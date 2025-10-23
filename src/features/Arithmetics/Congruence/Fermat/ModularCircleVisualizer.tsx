interface ModularCircleVisualizerProps {
  modulus: number
  highlight: number
  label?: string
}

export function ModularCircleVisualizer({ modulus, highlight, label }: ModularCircleVisualizerProps) {
  const radius = 100
  const points = Array.from({ length: modulus }, (_, i) => {
    const angle = (2 * Math.PI * i) / modulus
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      value: i,
    }
  })

  return (
    <svg width={240} height={240}>
      <g transform="translate(120,120)">
        {points.map(({ x, y, value }) => (
          <circle
            key={value}
            cx={x}
            cy={y}
            r={value === highlight ? 10 : 6}
            fill={value === highlight ? "teal" : "gray"}
          />
        ))}
        {points.map(({ x, y, value }) => (
          <text
            key={`label-${value}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={value === highlight ? "black" : "gray"}
          >
            {value}
          </text>
        ))}
        <text x={0} y={-radius - 10} textAnchor="middle" fontSize="12" fill="teal">
          {label ?? `Résultat : ${highlight} mod ${modulus}`}
        </text>
      </g>
    </svg>
  )
}
