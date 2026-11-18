import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const KEY = 'lxj.heart.confess'
const API = '/api/heart'
const reduce = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* 本机数一直在（localStorage，不依赖后端）；全站数看 /api/heart。
   读不到就当没有，标签只写本机那颗数，不能让人把两个数当成一件事。 */
function useCount() {
  const [local, setLocal] = useState(0)
  const [total, setTotal] = useState(null)

  useEffect(() => {
    try { setLocal(Math.max(0, parseInt(localStorage.getItem(KEY) || '0', 10) || 0)) } catch { /* 隐私模式下读不到，就当 0 */ }
    let live = true
    fetch(API)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(d => { if (live && Number.isFinite(d.total)) setTotal(d.total) })
      .catch(() => { if (live) setTotal(null) })
    return () => { live = false }
  }, [])

  const bump = () => {
    setLocal(v => {
      const t = v + 1
      try { localStorage.setItem(KEY, String(t)) } catch { /* 写不进去也不拦着按 */ }
      return t
    })
    if (total === null) return
    fetch(API, { method: 'POST' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(d => setTotal(Number.isFinite(d.total) ? d.total : null))
      .catch(() => setTotal(null))
  }

  return { local, total, bump }
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

/* 全屏挂载那页表白爱心：不重写它的粒子时间线，直接用同源 iframe 装进来。
   iframe 里那份页面自己绑了 ESC 和左右键，所以这里只在"它自己的照片弹窗没开着"时
   才把 ESC 接过来关外层，否则会让两层同时关掉。 */
export function ConfessOverlay({ onClose }) {
  const fr = useRef(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const wire = () => {
    const w = fr.current && fr.current.contentWindow
    if (!w) return
    w.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return
      if (w.document.querySelector('.lb:not([hidden])')) return   // 先让里面关照片
      onClose()
    }, true)
  }

  return createPortal(
    <div className="confess-layer" role="dialog" aria-modal="true" aria-label="给你的爱心">
      <iframe ref={fr} className="confess-frame" src="/confess/index.html" title="由祝福文字组成的跳动爱心" onLoad={wire}/>
      <div className="confess-top">
        <button type="button" onClick={onClose}>← 回房间 <i>ESC</i></button>
        <a href="#/likes" onClick={onClose}>喜欢清单 <i>↗</i></a>
      </div>
    </div>,
    document.body,
  )
}

/* 表白块：挂在 #/likes。后端接上时同时显示本机数和全站数，没接上只显示本机数。 */
export function ConfessBox({ data, onOpen }) {
  const { local, total, bump } = useCount()

  return (
    <section className="confess" data-pop={local ? 'on' : 'off'}>
      <h4>{data.kicker}</h4>
      <p className="confess-line">{data.text}</p>
      <div className="confess-act">
        <button type="button" onClick={bump}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={HEART}/></svg>
          按一颗心
        </button>
        <button type="button" className="confess-open" onClick={onOpen}>打开完整爱心 <i>↗</i></button>
        <span aria-live="polite">
          {total === null ? `本机 ${local} 颗` : `本机 ${local} 颗 · 全站 ${total} 颗`}
        </span>
      </div>
      <p className="confess-note">{data.note}</p>
    </section>
  )
}
