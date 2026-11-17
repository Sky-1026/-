import React, { useEffect, useMemo, useRef, useState } from 'react'
import { buildGallery } from './modules'

/* 实拍图栅格 + 大图查看。房间面板和模块页共用这一份。
   图片永远从 experienceData 里取，不另外维护清单。 */
export default function Shots({ kind, empty = '还没有可展示的照片。' }) {
  const items = useMemo(() => buildGallery(kind), [kind])
  const [zoom, setZoom] = useState(-1)
  const zoomRef = useRef(-1)
  const countRef = useRef(items.length)
  countRef.current = items.length

  /* 大图打开时吃掉 ESC 和左右键。监听必须在挂载时就注册（依赖为空）：
     子组件的 effect 先于外层面板跑，这样 ESC 先收大图、再收面板，
     而不是两个处理函数一起触发把两层同时关掉。 */
  useEffect(() => {
    const go = n => { zoomRef.current = n; setZoom(n) }
    const onKey = e => {
      const z = zoomRef.current
      if (z < 0) return
      if (e.key !== 'Escape' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      e.stopImmediatePropagation()
      const n = countRef.current
      if (e.key === 'Escape') go(-1)
      else if (e.key === 'ArrowRight') go((z + 1) % n)
      else go((z - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  if (!items.length) return <Placeholder label="SHOTS" note={empty}/>

  return (
    <>
      {zoom > -1 && (
        <figure className="room-zoom">
          <img src={items[zoom].src} alt={items[zoom].caption}/>
          <figcaption>
            {String(zoom + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            · {items[zoom].caption} · {items[zoom].org}
            <button onClick={() => { zoomRef.current = -1; setZoom(-1) }}>收起 ESC</button>
          </figcaption>
        </figure>
      )}
      <div className="room-shots">
        {items.map((g, i) => (
          <button key={g.src} onClick={() => { zoomRef.current = i; setZoom(i) }} aria-label={`查看大图：${g.caption}`}>
            <img src={g.thumb} alt={g.caption} loading="lazy" decoding="async"/>
            <span>{g.caption}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export function Placeholder({ label, note, ratio = '16 / 9' }) {
  return (
    <div className="mod-frame" style={{ aspectRatio: ratio }}>
      <b>{label}</b>
      <span>{note}</span>
    </div>
  )
}
