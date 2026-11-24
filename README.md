# Vizinhos Multi-view

Site de divulgação e demonstração prática do trabalho de conclusão de curso
"Inferência com recuperação de instâncias vizinhas e projeção de atributos em dados tabulares",
de Erick Diogo de Almeida Sousa (Engenharia de Computação, Escola Politécnica da USP).

A demonstração usa o kNN multi-view adaptativo no conjunto `car-evaluation` e compara,
para a consulta que o visitante escolher, os vizinhos recuperados em quatro cenários de busca:
espaço original, PCA, multi-view uniforme e multi-view adaptativo.

O método é o do artigo "Beyond Single-Space Representation: Adaptive Multi-View Neighborhood
Retrieval for Tabular Learning", aceito no S+SSPR 2026, cuja implementação oficial está em
https://github.com/c2d-usp/Adaptive-Multi-view-Neighborhood-Retrieval
e entra aqui como submódulo, em `vendor/multiview`.

## Estrutura

- `src/`: o site, em Svelte 5 com TypeScript, com os gráficos desenhados em SVG.
- `src/lib/data/data.json`: dados da demonstração, versionados e gerados pelo `export/`.
- `export/`: pipeline em Python que executa o método e escreve o `data.json`.
- `vendor/multiview`: submódulo com a implementação oficial do método.
- `car-evaluation/`: dados do conjunto, no formato do TALENT. Não são versionados.

## Como rodar o site

```
git clone --recurse-submodules https://github.com/Erick-DAS/TCC-multi-view.git
cd TCC-multi-view
npm install
npm run dev
```

## Como regerar os dados da demonstração

O `data.json` já está versionado, de modo que rodar o site não exige Python nem os dados do TALENT.
Para regerá-lo, são necessários o submódulo e a pasta `car-evaluation/` com os arquivos
`C_train.npy`, `C_val.npy`, `C_test.npy`, `y_train.npy`, `y_val.npy`, `y_test.npy` e `info.json`,
nas versões distribuídas pelo TALENT.

Os dados do conjunto não são redistribuídos aqui.

```
uv venv export/.venv
uv pip install --python export/.venv -r vendor/multiview/requirements.txt --torch-backend=cpu
export/.venv/bin/python export/build_data.py
```

O script executa os quatro cenários na configuração do artigo (k = 10, normalização z-score,
rede com 32 unidades escondidas, 300 épocas, temperatura 0,1) e escreve, para cada uma das 346
consultas de teste, os 20 vizinhos mais próximos em cada cenário, os cinco pesos atribuídos pela
rede e as coordenadas t-SNE usadas apenas para exibir o mapa.