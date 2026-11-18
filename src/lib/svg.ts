/** Forma por classe, para que a classe seja legivel sem depender da cor. */
export function markerPath(cls: number, cx: number, cy: number, r: number): string {
  if (cls === 0) {
    return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`
  }
  if (cls === 1) {
    return `M ${cx - r} ${cy - r} h ${2 * r} v ${2 * r} h ${-2 * r} Z`
  }
  if (cls === 2) {
    return `M ${cx} ${cy - r * 1.15} L ${cx + r * 1.1} ${cy + r * 0.85} L ${cx - r * 1.1} ${cy + r * 0.85} Z`
  }
  return `M ${cx} ${cy - r * 1.2} L ${cx + r * 1.2} ${cy} L ${cx} ${cy + r * 1.2} L ${cx - r * 1.2} ${cy} Z`
}

export function starPoints(cx: number, cy: number, r: number): string {
  const points: string[] = []
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const radius = i % 2 ? r * 0.45 : r
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`)
  }
  return points.join(' ')
}

export const CLASS_COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)']

/** Mapeia um intervalo de dados para um intervalo de coordenadas do SVG. */
export function scaler(domain: [number, number], range: [number, number]) {
  const span = domain[1] - domain[0] || 1
  return (value: number) => range[0] + ((value - domain[0]) / span) * (range[1] - range[0])
}

/** Caixa que contem os pontos informados, folgada pela fracao indicada. */
export function boxAround(xs: number[], ys: number[], pad: number) {
  const x0 = Math.min(...xs)
  const x1 = Math.max(...xs)
  const y0 = Math.min(...ys)
  const y1 = Math.max(...ys)
  const dx = (x1 - x0 || 1) * pad
  const dy = (y1 - y0 || 1) * pad
  return { x: [x0 - dx, x1 + dx] as [number, number], y: [y0 - dy, y1 + dy] as [number, number] }
}
