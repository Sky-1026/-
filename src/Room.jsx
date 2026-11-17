import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { nodes, hotspots, byId, isReady, slotsOf, posters } from './modules'
import Shots from './Shots'

const TOTAL_POSES = 11
const IDLE = 10                                   // 放松站立：没有 hover 时回到它；11 是「喜欢」的双手比心
const POSES = Array.from(
  { length: TOTAL_POSES },
  (_, i) => `/assets/room/poses/pose-${String(i + 1).padStart(2, '0')}.webp`,
)
const poseOf = id => hotspots.find(h => h.id === id)?.pose ?? null

/* ─────────── 房间面板：一眼预览，剩下的在模块页里 ─────────── */
function RoomSheet({ id, onClose }) {
  const node = byId[id]

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey, true)
    }
  }, [onClose])

  if (!node) return null
  const ready = isReady(node)
  const slots = slotsOf(node)
  const shotSlot = slots.find(s => s.type === 'shots')
  const linkSlot = slots.find(s => s.type === 'links')
  const pending = slots.filter(s => s.empty)

  return createPortal(
    <div className="room-layer" role="dialog" aria-modal="true" aria-label={node.title}>
      <button className="room-scrim" onClick={onClose} aria-label="关闭面板"/>
      <section className="room-panel" data-soon={ready ? 'off' : 'on'}>
        <header className="room-panel-bar">
          <span>{node.kicker}</span>
          <button autoFocus onClick={onClose}>关闭 <i>ESC</i></button>
        </header>

        <div className="room-panel-body">
          <p className="room-status" data-soon={ready ? 'off' : 'on'}>
            {ready ? '已就绪 / READY' : '框架已就位，等内容 / FRAME ONLY'}
          </p>
          <h3>{node.title}</h3>
          <p className="room-lead">{node.lead}</p>
          {node.body?.map((t, i) => <p className="room-text" key={i}>{t}</p>)}

          {linkSlot && (
            <ul className="room-links">
              {linkSlot.items.map(l => (
                <li key={l.kind}>
                  <span>{l.kind}</span>
                  {l.href ? <a href={l.href}>{l.label}</a> : <strong>{l.label}</strong>}
                </li>
              ))}
            </ul>
          )}

          {shotSlot && <Shots kind={shotSlot.gallery} items={shotSlot.items}/>}

          {pending.length > 0 && (
            <ul className="room-todo">
              {pending.map(s => <li key={s.title}>{s.title}：{s.empty}</li>)}
            </ul>
          )}

          <p className="room-panel-foot">
            <a href={`#/${node.id}`}>进入这一格 ↗</a>
            <span>面板只是预览，往后的图片和视频都填在页面里</span>
          </p>
        </div>
      </section>
    </div>,
    document.body,
  )
}

/* ─────────── 房间本体 = 导航 ─────────── */
export default function Room() {
  const [hover, setHover] = useState(null)
  const [held, setHeld] = useState(null)          // 打开面板的那件物品，面板期间保持姿势
  const [open, setOpen] = useState(null)

  const activeId = open ? held : hover
  const pose = poseOf(activeId) ?? IDLE
  const active = activeId ? hotspots.find(h => h.id === activeId) : null

  const close = useCallback(() => { setOpen(null); setHeld(null) }, [])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && open) close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const enter = id => setHover(() => id)
  const leave = id => setHover(v => (v === id ? null : v))

  const pick = h => {
    setHeld(h.id)
    if (h.go) { window.location.hash = h.go; setHeld(null) }
    else setOpen(h.id)
  }

  const entries = nodes.filter(n => n.go || n.slots)

  return (
    <div className="room">
      <h1 className="room-sr">刘兴技的房间 · 简历、训练、记录、影像、此刻</h1>

      <div className="room-stage">
        <img className="room-bg" src="/assets/room/bg.jpg" alt="" decoding="async" fetchPriority="high"/>

        {/* 海报在人物之前渲染：他站在墙前，相框被他挡住是应该的 */}
        {posters.map(p => (
          <div key={p.id} className="room-poster" aria-hidden="true"
               style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`, '--tilt': `${p.tilt}deg` }}>
            <img src={p.src} alt="" loading="eager" decoding="async"/>
          </div>
        ))}

        {/* 十张姿势精灵叠在一起：hover 到哪件物品就摆那件对应的姿势，离开回到待机 */}
        <div className="room-figure" aria-hidden="true" data-pose={pose}>
          {POSES.map((src, i) => (
            <img key={src} src={src} alt="" data-on={i + 1 === pose ? 'on' : 'off'}
                 loading="eager" decoding="async"/>
          ))}
        </div>

        {hotspots.map(h => (
          <button
            key={h.id}
            className={`room-hot${h.kind === 'note' ? ' is-note' : ' is-prop'}`}
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%`, '--tilt': `${h.tilt || 0}deg` }}
            onMouseEnter={() => enter(h.id)}
            onMouseLeave={() => leave(h.id)}
            onFocus={() => enter(h.id)}
            onBlur={() => leave(h.id)}
            onClick={() => pick(h)}
            aria-label={`${h.label} — ${h.hint}`}
          >
            {h.kind === 'note' && <span className="room-note-text">{h.label}</span>}
          </button>
        ))}

        {/* 读数条只在 hover 时出现：不 hover 时画面上一个 UI 元素都不留 */}
        <p className="room-readout" data-on={active ? 'on' : 'off'} aria-hidden="true">
          {active && (
            <>
              <strong>{active.label}</strong>
              <span>{active.en} · {active.hint}</span>
            </>
          )}
        </p>
      </div>

      {/* 窄屏兜底：房间还是那张图，但入口再给一份可点列表 */}
      <nav className="room-list" aria-label="模块入口">
        {entries.map(n => (
          <button key={n.id} onClick={() => (n.go ? window.location.hash = n.go : setOpen(n.id))}>
            <small>{n.en}</small><strong>{n.label}</strong><span>{n.hint}</span>
          </button>
        ))}
      </nav>

      {open && <RoomSheet id={open} onClose={close}/>}
    </div>
  )
}
