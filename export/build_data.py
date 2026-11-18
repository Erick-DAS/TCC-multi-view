"""Gera o data.json da demonstração a partir do método oficial, no car-evaluation.

O pipeline segue a configuração do artigo (k = 10, normalização z-score das
distâncias, 300 épocas, temperatura 0,1) e usa a implementação oficial do
submódulo `vendor/multiview`, sem reimplementá-la.

Para cada consulta de teste, o arquivo gerado traz os 20 vizinhos mais próximos
em cada um dos quatro cenários de busca, os pesos que a rede atribuiu às
projeções e as coordenadas t-SNE, usadas apenas para exibir os pontos.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from types import SimpleNamespace

REPO = Path(__file__).resolve().parent.parent

# Importar a implementação oficial sem deixar bytecode dentro do submódulo.
sys.dont_write_bytecode = True
sys.path.insert(0, str(REPO / "vendor" / "multiview"))

import numpy as np
import scipy
import sklearn
import torch
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.preprocessing import LabelEncoder, StandardScaler

from src.adaptive import ViewWeighter, train_hypernetwork
from src.dataloader import get_dataset
from src.fusion import (
    build_distance_views,
    build_projections,
    compute_metrics,
    distance_matrix,
    knn_predict,
    normalize_dist_matrix,
)

DATASET = "car-evaluation"

# Padrões da linha de comando do método oficial, que são a configuração do artigo.
PAPER_CONFIG = SimpleNamespace(
    k=10,
    norm="zscore",
    jl_eps=0.5,
    rp_frac=0.1,
    hidden=32,
    n_epochs=300,
    batch_size=256,
    lr=1e-3,
    temperature=0.1,
    lambda_ent=0.0,
)

# A demonstração permite variar k entre 3 e 20, e a vizinhança de qualquer k
# nessa faixa é um prefixo da lista exportada.
TOP_K = 20

# Rótulos originais do car-evaluation, na ordem das classes 0 a 3 do TALENT.
# A ordem vem das contagens do conjunto (1210, 384, 65, 69), que identificam a
# classe 2 como vgood (65 amostras) e a 3 como good (69), e não o contrário.
CLASS_NAMES = ["unacc", "acc", "vgood", "good"]

SCENARIOS = ["original", "pca", "uniform", "adaptive"]


def prepare_data(data_root: Path) -> dict:
    """Carrega e padroniza o conjunto como o experimento oficial faz."""
    train_val, test, info = get_dataset(DATASET, str(data_root))

    X_train, X_val = train_val[0]["train"], train_val[0]["val"]
    y_train, y_val = train_val[2]["train"], train_val[2]["val"]
    X_test, y_test = test[0]["test"], test[2]["test"]

    x_scaler = StandardScaler()
    X_train = x_scaler.fit_transform(X_train)
    X_val = x_scaler.transform(X_val)
    X_test = x_scaler.transform(X_test)

    y_scaler = LabelEncoder()
    y_train = y_scaler.fit_transform(y_train)
    y_val = y_scaler.transform(y_val)
    y_test = y_scaler.transform(y_test)

    return {
        "info": info,
        "X_train": X_train,
        "X_val": X_val,
        "X_test": X_test,
        "y_train": y_train,
        "y_val": y_val,
        "y_test": y_test,
        "classes": y_scaler.classes_,
    }


def scenario_distances(data: dict, config: SimpleNamespace, device: torch.device) -> dict:
    """Monta a matriz de distâncias de cada cenário, na ordem do experimento oficial."""
    X_train, X_val, X_test = data["X_train"], data["X_val"], data["X_test"]
    y_train, y_val = data["y_train"], data["y_val"]

    latent_spaces, view_names, random_dim, svd_dim = build_projections(
        X_train, y_train, "classification", config
    )

    pca_proj = PCA(n_components=0.99)
    X_train_pca = pca_proj.fit_transform(X_train)
    X_test_pca = pca_proj.transform(X_test)

    D_views_test = build_distance_views(X_train, X_test, latent_spaces, config.norm)
    D_views_val = build_distance_views(X_train, X_val, latent_spaces, config.norm)
    n_views = len(D_views_test)

    weighter = ViewWeighter(X_train.shape[1], n_views, hidden=config.hidden)
    loss_curve = train_hypernetwork(
        weighter=weighter,
        X_val=X_val,
        D_views_val=D_views_val,
        y_train=y_train,
        y_val=y_val,
        k=config.k,
        task="classification",
        temperature=config.temperature,
        lambda_ent=config.lambda_ent,
        n_epochs=config.n_epochs,
        batch_size=config.batch_size,
        lr=config.lr,
        device=device,
    )

    weighter.eval()
    with torch.no_grad():
        X_test_t = torch.tensor(X_test, dtype=torch.float32, device=device)
        alpha = weighter(X_test_t).cpu().numpy()

    return {
        "distances": {
            # O cenário do espaço original usa a distância sem normalizar, como
            # no experimento oficial; a normalização é monótona por consulta e
            # não altera a ordem dos vizinhos.
            "original": distance_matrix(X_train, X_test),
            "pca": normalize_dist_matrix(
                distance_matrix(X_train_pca, X_test_pca), norm=config.norm
            ),
            "uniform": sum(D_views_test) / n_views,
            "adaptive": np.einsum("iv,vij->ij", alpha, np.stack(D_views_test, axis=0)),
        },
        "alpha": alpha,
        "view_names": view_names,
        "view_dims": [X_train.shape[1]] + [X_lat.shape[1] for _, X_lat in latent_spaces],
        "random_dim": random_dim,
        "svd_dim": svd_dim,
        "pca_components": int(pca_proj.n_components_),
        "loss_curve": loss_curve,
    }


def display_coordinates(X_train: np.ndarray, X_test: np.ndarray, seed: int) -> np.ndarray:
    """Projeta treino e teste em 2D, juntos, apenas para exibir o mapa."""
    tsne = TSNE(n_components=2, random_state=seed, init="pca", perplexity=30)
    return tsne.fit_transform(np.vstack([X_train, X_test]))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=20261118)
    parser.add_argument("--device", type=str, default="cpu", choices=["cpu", "cuda"])
    parser.add_argument("--data-root", type=Path, default=REPO)
    parser.add_argument("--out", type=Path, default=REPO / "src/lib/data/data.json")
    args = parser.parse_args()

    config = SimpleNamespace(**vars(PAPER_CONFIG))
    device = torch.device(args.device)

    data = prepare_data(args.data_root)

    # O método não fixa as sementes da projeção aleatória nem da inicialização da
    # rede, por isso a demonstração fixa as nossas antes de construir as visões.
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)

    built = scenario_distances(data, config, device)

    y_train, y_test = data["y_train"], data["y_test"]
    neighbors = {}
    accuracy = {}
    for name in SCENARIOS:
        D = built["distances"][name]
        neighbors[name] = np.argsort(D, axis=1)[:, :TOP_K]
        preds = knn_predict(D, y_train, config.k, "classification")
        accuracy[name] = compute_metrics(preds, y_test, "classification")["accuracy"]

    coords = display_coordinates(data["X_train"], data["X_test"], args.seed)
    n_train = len(y_train)

    all_y = np.concatenate([y_train, data["y_val"], y_test])
    class_counts = [int((all_y == c).sum()) for c in range(len(CLASS_NAMES))]

    payload = {
        "meta": {
            "dataset": DATASET,
            "seed": args.seed,
            "device": args.device,
            "config": vars(config),
            "top_k": TOP_K,
            "scenarios": SCENARIOS,
            "views": built["view_names"],
            "view_dims": built["view_dims"],
            "pca_components": built["pca_components"],
            "random_dim": built["random_dim"],
            "svd_dim": built["svd_dim"],
            "classes": CLASS_NAMES,
            "talent_labels": [str(c) for c in data["classes"]],
            "class_counts": class_counts,
            "splits": {
                "train": n_train,
                "val": len(data["y_val"]),
                "test": len(y_test),
            },
            "n_features": int(data["X_train"].shape[1]),
            "accuracy": {name: round(float(acc), 6) for name, acc in accuracy.items()},
            "final_loss": round(float(built["loss_curve"][-1]), 6),
            "environment": {
                "numpy": np.__version__,
                "scipy": scipy.__version__,
                "scikit-learn": sklearn.__version__,
                "torch": torch.__version__,
            },
        },
        "train": {
            "x": [round(float(v), 2) for v in coords[:n_train, 0]],
            "y": [round(float(v), 2) for v in coords[:n_train, 1]],
            "class": [int(c) for c in y_train],
        },
        "test": {
            "x": [round(float(v), 2) for v in coords[n_train:, 0]],
            "y": [round(float(v), 2) for v in coords[n_train:, 1]],
            "class": [int(c) for c in y_test],
        },
        "neighbors": {name: [[int(i) for i in row] for row in neighbors[name]] for name in SCENARIOS},
        "alpha": [[round(float(w), 4) for w in row] for row in built["alpha"]],
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n")

    print(f"Visões: {built['view_names']}")
    print(f"Dimensões das visões: {built['view_dims']}")
    print(f"Rede: {data['X_train'].shape[1]}-{config.hidden}-{len(built['view_names'])}")
    print(f"Acurácia (k = {config.k}): {payload['meta']['accuracy']}")
    print(f"Escrito em {args.out} ({args.out.stat().st_size / 1024:.0f} kB)")


if __name__ == "__main__":
    main()
