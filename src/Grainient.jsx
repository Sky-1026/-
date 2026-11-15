import React from 'react'

export default function Grainient({
  colors = ['#000000', '#140505', '#700517', '#a36363', '#650404', '#1b060b', '#000000'],
  angle = 184,
  flow = 1.2,
  silk = 0.37,
  grainAmount = 0.03,
  softness = 0.75,
  scale = 0.95,
}) {
  const palette = [...colors]
  while (palette.length < 7) palette.push(palette.at(-1) || '#000000')

  return (
    <div
      className="grainient"
      aria-hidden="true"
      style={{
        '--g0': palette[0], '--g1': palette[1], '--g2': palette[2], '--g3': palette[3],
        '--g4': palette[4], '--g5': palette[5], '--g6': palette[6], '--g-angle': `${angle}deg`,
        '--g-silk': silk, '--g-grain': grainAmount, '--g-softness': `${softness * 34}px`,
        '--g-softness-lite': `${softness * 18}px`,
        '--g-scale': scale, animationDuration: `${16 / Math.max(flow, .1)}s`,
      }}
    >
      <span className="grainient-field" />
      <span className="grainient-silk" />
    </div>
  )
}
