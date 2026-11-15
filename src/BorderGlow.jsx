import { useCallback, useEffect, useRef } from 'react'
import './BorderGlow.css'

function parseHSL(value) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) }
}

function buildGlowVars(color, intensity) {
  const { h, s, l } = parseHSL(color)
  const opacities = [100, 60, 50, 40, 30, 20, 10]
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10']
  return Object.fromEntries(opacities.map((opacity, index) => [
    `--glow-color${keys[index]}`,
    `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`,
  ]))
}

const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const colorMap = [0, 1, 2, 0, 1, 2, 1]

function buildGradientVars(colors) {
  const vars = {}
  positions.forEach((position, index) => {
    vars[`--gradient-${index + 1}`] = `radial-gradient(at ${position}, ${colors[Math.min(colorMap[index], colors.length - 1)]} 0, transparent 50%)`
  })
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`
  return vars
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease, onUpdate, onEnd }) {
  const startedAt = performance.now() + delay
  let frame = 0
  let timer = setTimeout(() => {
    const tick = () => {
      const progress = Math.min((performance.now() - startedAt) / duration, 1)
      onUpdate(start + (end - start) * ease(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else onEnd?.()
    }
    frame = requestAnimationFrame(tick)
  }, delay)
  return () => { clearTimeout(timer); cancelAnimationFrame(frame) }
}

const easeOutCubic = value => 1 - Math.pow(1 - value, 3)
const easeInCubic = value => value * value * value

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120f17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null)

  const handlePointerMove = useCallback(event => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = x - cx
    const dy = y - cy
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx)
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy)
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    let angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360
    card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3))
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
  }, [])

  useEffect(() => {
    if (!animated || !cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = cardRef.current
    const start = 110
    const end = 465
    card.classList.add('sweep-active')
    card.style.setProperty('--cursor-angle', `${start}deg`)
    const animations = [
      animateValue({ duration: 500, ease: easeOutCubic, onUpdate: value => card.style.setProperty('--edge-proximity', value) }),
      animateValue({ duration: 1500, ease: easeInCubic, end: 50, onUpdate: value => card.style.setProperty('--cursor-angle', `${(end - start) * (value / 100) + start}deg`) }),
      animateValue({ delay: 1500, duration: 2250, ease: easeOutCubic, start: 50, onUpdate: value => card.style.setProperty('--cursor-angle', `${(end - start) * (value / 100) + start}deg`) }),
      animateValue({ delay: 2500, duration: 1500, ease: easeInCubic, start: 100, end: 0, onUpdate: value => card.style.setProperty('--edge-proximity', value), onEnd: () => card.classList.remove('sweep-active') }),
    ]
    return () => { animations.forEach(cancel => cancel()); card.classList.remove('sweep-active') }
  }, [animated])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  )
}
