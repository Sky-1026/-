import React, { useEffect, useRef, useState } from 'react'

const KEY = 'lxj.heart.confess'
const reduce = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* 本机计数：静态站没有后端，所以这个数字只属于当前这台设备的浏览器。
   文案里必须把这句话写出来，不能让它看起来像全站统计。 */
function useCount() {
  const [n, setN] = useState(0)
  useEffect(() => {
    try { setN(Math.max(0, parseInt(localStorage.getItem(KEY) || '0', 10) || 0)) } catch { /* 隐私模式下读不到，就当 0 */ }
  }, [])
  const bump = () => setN(v => {
    const t = v + 1
    try { localStorage.setItem(KEY, String(t)) } catch { /* 写不进去也不拦着按 */ }
    return t
  })
  return [n, bump]
}

const HEART = 'M12 20.8s-7.2-4.4-9.2-8.9C.9 8.6 2.8 5.3 6.2 5.3c1.9 0 3.3 1 4.3 2.4 1-1.4 2.4-2.4 4.3-2.4 3.4 0 5.3 3.3 3.4 6.6-2 4.5-9.2 8.9-9.2 8.9z'

/* 从墙上那颗心甩出来的一片爱心，飘向人物那一侧。
   偏移在触发时按舞台实际像素算，避免用 vw 估：房间有 contain/full-bleed 两种宽度算法。 */
export function HeartBurst({ seed }) {
  const layer = useRef(null)
  const [batch, setBatch] = useState(null)

  useEffect(() => {
    const el = layer.current
    if (!seed || !el || reduce()) return
    const W = el.clientWidth, H = el.clientHeight
    if (!W) return
    const sx = W * 0.91, sy = H * 0.14
    setBatch(Array.from({ length: 16 }, (_, i) => ({
      k: `${seed}-${i}`,
      x: sx + (Math.random() - .5) * W * .03,
      y: sy + (Math.random() - .5) * H * .08,
      dx: -(0.14 + Math.random() * 0.42) * W,
      dy: (0.18 + Math.random() * 0.6) * H,
      rot: (Math.random() - .5) * 110,
      sz: 9 + Math.random() * 17,
      delay: Math.random() * .38,
      dur: 1.35 + Math.random() * 1.15,
    })))
  }, [seed])

  if (!batch) return <div className="room-hearts" ref={layer} aria-hidden="true"/>

  return (
    <div className="room-hearts" ref={layer} aria-hidden="true"
         onAnimationEnd={e => { if (e.target.tagName === 'svg') setBatch(null) }}>
      {batch.map(h => (
        <svg key={h.k} viewBox="0 0 24 24"
             style={{ left: `${h.x}px`, top: `${h.y}px`, width: `${h.sz}px`, height: `${h.sz}px`,
                      '--dx': `${h.dx}px`, '--dy': `${h.dy}px`, '--rot': `${h.rot}deg`,
                      animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s` }}>
          <path d={HEART}/>
        </svg>
      ))}
    </div>
  )
}

/* 表白块：面板和模块页共用同一份文案与同一个计数。 */
export function ConfessBox({ data, onBurst }) {
  const [n, bump] = useCount()
  const tap = () => { bump(); onBurst?.() }

  return (
    <section className="confess" data-pop={n ? 'on' : 'off'}>
      <h4>{data.kicker}</h4>
      <p className="confess-line">{data.text}</p>
      <div className="confess-act">
        <button type="button" onClick={tap}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={HEART}/></svg>
          按一颗心
        </button>
        <span aria-live="polite">本机已按 {n} 颗</span>
      </div>
      <p className="confess-note">{data.note}</p>
    </section>
  )
}
