import React, { useEffect } from 'react'
import { byId, pageIds, nodes, isReady } from './modules'
import Shots, { Placeholder } from './Shots'

/* ── 单个槽位：六种类型，以后只往 items 里加东西 ── */
function Slot({ s }) {
  if (s.type === 'para') return <p className="mod-text">{s.text}</p>

  if (s.type === 'links') return (
    <section className="mod-slot">
      <h4>{s.title}</h4>
      <ul className="mod-links">
        {s.items.map(l => (
          <li key={l.kind}>
            <span>{l.kind}</span>
            {l.href ? <a href={l.href}>{l.label}</a> : <strong>{l.label}</strong>}
          </li>
        ))}
      </ul>
    </section>
  )

  if (s.type === 'shots') return (
    <section className="mod-slot">
      <h4>{s.title}</h4>
      <Shots kind={s.gallery} empty={s.empty}/>
    </section>
  )

  if (s.type === 'frame') return (
    <section className="mod-slot">
      <h4>{s.title}</h4>
      <Placeholder label={s.kind} note={s.empty} ratio={s.ratio}/>
    </section>
  )

  /* list 与 stats：列名先立起来，行等数据 */
  const rows = s.items || []
  return (
    <section className="mod-slot">
      <h4>{s.title}</h4>
      <div className="mod-table" style={{ '--cols': s.columns.length }}>
        <div className="mod-tr is-head">{s.columns.map(c => <span key={c}>{c}</span>)}</div>
        {rows.length === 0
          ? <p className="mod-empty">{s.empty}</p>
          : rows.map((r, i) => (
              <div className="mod-tr" key={i}>
                {(Array.isArray(r) ? r : r.cells).map((c, j) => <span key={j}>{c}</span>)}
              </div>
            ))}
      </div>
    </section>
  )
}

/* ── 模块页外壳：每个模块都是 #/<id>，结构一模一样 ── */
export default function ModulePage({ id }) {
  const m = byId[id]
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  if (!m) return null

  const ready = isReady(m)
  const i = pageIds.indexOf(id)
  const prev = byId[pageIds[(i - 1 + pageIds.length) % pageIds.length]]
  const next = byId[pageIds[(i + 1) % pageIds.length]]

  return (
    <main className="mod">
      <header className="mod-bar">
        <a href="#/">← 房间</a>
        <nav className="mod-tabs" aria-label="模块">
          {nodes.filter(n => n.go || n.slots).map(n => (
            <a key={n.id} href={n.go || `#/${n.id}`} data-on={n.id === id ? 'on' : 'off'}>{n.label}</a>
          ))}
        </nav>
        <span className="mod-loc">BEIJING · CN</span>
      </header>

      <div className="mod-head">
        <p className="mod-status" data-ready={ready ? 'on' : 'off'}>
          {ready ? '已有真实内容 / LIVE' : '框架已就位，等内容 / FRAME ONLY'}
        </p>
        <span className="mod-kicker">{m.kicker}</span>
        <h1>{m.title}</h1>
        <p className="mod-lead">{m.lead}</p>
        {m.body?.map((t, k) => <p className="mod-text" key={k}>{t}</p>)}
      </div>

      <div className="mod-body">
        {(m.slots || []).map((s, k) => <Slot key={k} s={s}/>)}
      </div>

      <nav className="mod-foot" aria-label="上一个 / 下一个模块">
        <a href={`#/${prev.id}`}>← {prev.label}</a>
        <a href="#/">回房间</a>
        <a href={`#/${next.id}`}>{next.label} →</a>
      </nav>
    </main>
  )
}
