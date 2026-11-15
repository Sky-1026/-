import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import BorderGlow from './BorderGlow'
import { experience } from './experienceData'

const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ─────────── 悬停即预览：跟随光标的封面 ─────────── */
function HoverPreview({ index }) {
  const ref = useRef(null)
  const s = useRef({ x: 0, y: 0, tx: 0, ty: 0, tilt: 0, on: false })
  const item = index > -1 ? experience[index] : null

  useEffect(() => {
    if (!canHover()) return
    const st = s.current
    const onMove = e => { st.tx = e.clientX; st.ty = e.clientY }
    window.addEventListener('pointermove', onMove, { passive: true })
    let raf = 0
    const tick = () => {
      const dx = st.tx - st.x
      st.x += dx * .17
      st.y += (st.ty - st.y) * .21
      st.tilt += (Math.max(-8, Math.min(8, dx * .2)) - st.tilt) * .12
      if (ref.current) {
        ref.current.style.transform =
          `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%) rotate(${st.tilt}deg) scale(${st.on ? 1 : .84})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => { s.current.on = !!item }, [item])

  // Portal 到 body：避免被 .experience 的 z-index 层叠上下文困住
  return createPortal(
    <div className="exp-hover-preview" ref={ref} data-active={item ? 'on' : 'off'} aria-hidden="true">
      {item?.cover
        ? <img src={item.cover} alt="" draggable="false"/>
        : <div className="exp-hover-empty"><span>{item?.kind}</span><small>暂无影像资料</small></div>}
      {item && <div className="exp-hover-tag">{item.org}<b>{item.gallery.length ? `${item.gallery.length} 张现场图` : '展开详情'}</b></div>}
    </div>,
    document.body,
  )
}

/* ─────────── 灯箱 ─────────── */
function Lightbox({ gallery, index, onIndex, onClose }) {
  const item = gallery[index]
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(false) }, [index])

  // 命中缓存时 load 事件不会触发，用 ref 回调兜底，否则图片会一直停在 opacity:0
  const bindImg = el => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      else if (e.key === 'ArrowRight') onIndex((index + 1) % gallery.length)
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, gallery.length, onIndex, onClose])

  if (!item) return null
  return (
    <div className="exp-lightbox" role="dialog" aria-modal="true" aria-label={item.caption}>
      <button className="exp-lightbox-scrim" onClick={onClose} aria-label="关闭图片"/>
      <figure className="exp-lightbox-stage" data-loaded={loaded ? 'on' : 'off'}>
        <img key={item.src} ref={bindImg} src={item.src} alt={item.caption} onLoad={() => setLoaded(true)}/>
      </figure>
      <div className="exp-lightbox-bar">
        <span>{String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
        <p>{item.caption}</p>
        <div>
          <button onClick={() => onIndex((index - 1 + gallery.length) % gallery.length)} aria-label="上一张">←</button>
          <button onClick={onClose} aria-label="关闭">✕ ESC</button>
          <button onClick={() => onIndex((index + 1) % gallery.length)} aria-label="下一张">→</button>
        </div>
      </div>
    </div>
  )
}

/* ─────────── 全屏案例页 ─────────── */
function ExperienceSheet({ index, onIndex, onClose }) {
  const item = experience[index]
  const layerRef = useRef(null)
  const scrollRef = useRef(null)
  const closeRef = useRef(null)
  const closingRef = useRef(false)
  const [lightbox, setLightbox] = useState(-1)
  const [shown, setShown] = useState(false)

  const dismiss = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setShown(false)
    if (reduced()) { onClose(); return }
    window.setTimeout(onClose, 620)
  }, [onClose])

  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.classList.add('exp-open')
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    // 用 React 状态而非 rAF 触发入场：后台标签页里 rAF 不执行，不能让它挡住打开动作
    const t = window.setTimeout(() => setShown(true), reduced() ? 0 : 30)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
      document.body.classList.remove('exp-open')
    }
  }, [])

  useEffect(() => {
    if (shown && !reduced()) closeRef.current?.focus({ preventScroll: true })
  }, [shown])

  // 切换上/下一条：回到顶部（正文用 key 重挂载，CSS 入场自然重放）
  useEffect(() => {
    setLightbox(-1)
    const scroller = scrollRef.current
    if (scroller) scroller.scrollTop = 0
  }, [index])

  useEffect(() => {
    const onKey = e => {
      if (lightbox > -1) return                 // 按键由灯箱接管
      if (e.key === 'Escape') dismiss()
      else if (e.key === 'ArrowRight') onIndex((index + 1) % experience.length)
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + experience.length) % experience.length)
      else if (e.key === 'Tab') {              // 焦点陷阱
        const f = layerRef.current?.querySelectorAll('button, a[href]')
        if (!f?.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, lightbox, dismiss, onIndex])

  if (!item) return null
  const prev = (index - 1 + experience.length) % experience.length
  const next = (index + 1) % experience.length

  return createPortal(
    <div className={`exp-layer${shown ? ' is-open' : ''}`} ref={layerRef}>
      <div className="exp-scrim" onClick={dismiss} aria-hidden="true"/>
      <article className="exp-sheet" role="dialog" aria-modal="true" aria-label={`${item.org} 经历详情`}>
        <header className="exp-bar">
          <span className="exp-bar-idx">
            {String(index + 1).padStart(2, '0')} <i>/</i> {String(experience.length).padStart(2, '0')}
          </span>
          <span className="exp-bar-org">{item.org}</span>
          <div className="exp-bar-actions">
            <button onClick={() => onIndex(prev)}>← 上一条</button>
            <button onClick={() => onIndex(next)}>下一条 →</button>
            <button className="is-close" onClick={dismiss} ref={closeRef}>关闭 <i>ESC</i></button>
          </div>
        </header>

        <div className="exp-scroll" ref={scrollRef}>
          {item.cover && (
            <div className="exp-hero">
              <img className="exp-hero-img" src={item.cover.replace('/thumb/', '/full/')} alt={item.coverAlt} decoding="async"/>
              <div className="exp-hero-scrim"/>
              <span className="exp-hero-kind">{item.kind} · {item.location}</span>
            </div>
          )}

          <div className="exp-inner" key={index}>
            <div className="exp-head exp-rise" style={{ '--r': 0 }}>
              <time>{item.date}</time>
              <h3>{item.org}</h3>
              <p className="exp-role">{item.role}</p>
            </div>

            <p className="exp-lead exp-rise" style={{ '--r': 1 }}>{item.lead}</p>

            <ul className="exp-facts exp-rise" style={{ '--r': 2 }}>
              {item.facts.map(([k, v]) => <li key={k}><span>{k}</span><strong>{v}</strong></li>)}
            </ul>

            <div className="exp-prose exp-rise" style={{ '--r': 3 }}>
              {item.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {item.gallery.length > 0 ? (
              <>
                <div className="exp-gallery-title exp-rise" style={{ '--r': 4 }}>
                  <span>现场影像 / FIELD IMAGES</span>
                  <b>{String(item.gallery.length).padStart(2, '0')} 张 · 点击查看大图</b>
                </div>
                <div className="exp-gallery">
                  {item.gallery.map((g, i) => (
                    <button key={g.src} className="exp-shot" data-span={g.span} style={{ '--i': i }}
                            onClick={() => setLightbox(i)} aria-label={`查看大图：${g.caption}`}>
                      <img src={g.thumb} alt={g.caption} loading="lazy" decoding="async"/>
                      <span className="exp-shot-no">{g.n}</span>
                      <span className="exp-shot-cap">{g.caption}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="exp-pending exp-rise" style={{ '--r': 4 }}>
                <span>影像资料待补充</span>
                <p>这段经历的现场照片还没有整理进来；先把内容留在这里，图片到位后会以同样的方式展示。</p>
              </div>
            )}

            <div className="exp-tags exp-rise" style={{ '--r': 5 }}>{item.tags.map(t => <span key={t}>{t}</span>)}</div>

            <nav className="exp-footnav exp-rise" style={{ '--r': 6 }}>
              <button onClick={() => onIndex(prev)}>
                <small>← 上一条</small><strong>{experience[prev].org}</strong>
              </button>
              <button onClick={() => onIndex(next)}>
                <small>下一条 →</small><strong>{experience[next].org}</strong>
              </button>
            </nav>
          </div>
        </div>
      </article>

      {lightbox > -1 && (
        <Lightbox gallery={item.gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(-1)}/>
      )}
    </div>,
    document.body,
  )
}

/* ─────────── 经历列表 ─────────── */
export default function ExperienceList() {
  const [open, setOpen] = useState(-1)
  const [hover, setHover] = useState(-1)
  const restoreRef = useRef(null)

  const close = useCallback(() => {
    setOpen(-1)
    restoreRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <>
      {canHover() && !reduced() && <HoverPreview index={open > -1 ? -1 : hover}/>}
      <div className="experience-title">SELECTED EXPERIENCE<small>点击任意一条，查看现场影像与工作细节</small></div>
      <div className="experience-list">
        {experience.map((e, index) => (
          <BorderGlow
            key={e.id}
            className="experience-glow-card"
            edgeSensitivity={24}
            glowColor="8 88 60"
            backgroundColor="#0b0d11"
            borderRadius={18}
            glowRadius={28}
            glowIntensity={.82}
            coneSpread={20}
            animated={index === 0}
            fillOpacity={.3}
            colors={['#f14120', '#ff8a5c', '#7a1324']}
          >
            <button
              className="experience-row"
              type="button"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(h => (h === index ? -1 : h))}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(h => (h === index ? -1 : h))}
              onClick={ev => { restoreRef.current = ev.currentTarget; setOpen(index) }}
              aria-haspopup="dialog"
              aria-expanded={open === index}
            >
              <time>{e.date}</time>
              <strong>{e.org}</strong>
              <span>{e.role}</span>
              <em className="experience-count" data-empty={e.gallery.length ? undefined : 'on'}>
                {e.gallery.length ? String(e.gallery.length).padStart(2, '0') : ''}
              </em>
              <span className="arrow" aria-hidden="true">↗</span>
            </button>
          </BorderGlow>
        ))}
      </div>
      {open > -1 && <ExperienceSheet index={open} onIndex={setOpen} onClose={close}/>}
    </>
  )
}
