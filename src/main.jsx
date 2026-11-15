import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BorderGlow from './BorderGlow'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: '电力期权定价',
    en: 'POWER OPTION PRICING',
    meta: '多模型协同优化研究 · 组长 · 2025—至今',
    description: '面向新能源高比例接入场景，搭建“场景划分—价差预测—动态定价”全链路体系，用 Bachelier 引擎适配负电价极端场景。',
    tags: ['K-Means', 'LSTM', 'Bachelier', 'L-BFGS-B'],
    art: 'energy',
  },
  {
    number: '02',
    title: '工业设备检测',
    en: 'EQUIPMENT DIAGNOSTICS',
    meta: '北京大学生数学建模与计算机应用竞赛 · 队长 · 2026',
    description: '融合时域、频域特征与注意力 CNN-LSTM，构建异常预筛选到故障识别的分层检测流程，适配缺失、噪声与小样本场景。',
    tags: ['CNN-LSTM', 'FFT', 'Isolation Forest', 'DBSCAN'],
    art: 'signal',
  },
  {
    number: '03',
    title: '烟幕投放策略',
    en: 'TACTICAL OPTIMIZATION',
    meta: '全国大学生数学建模大赛 · 队长 · 北京市二等奖',
    description: '建立无人机、导弹与烟幕的多对象运动学模型，通过混合优化算法平衡弹药用量与有效遮蔽时间。',
    tags: ['遗传算法', '粒子群', '二分法', '运动学建模'],
    art: 'trajectory',
  },
  {
    number: '04',
    title: '交通流量建模',
    en: 'TRAFFIC FLOW MODELING',
    meta: '五一数学建模竞赛 · 队长 · 全国二等奖',
    description: '以分段线性与正弦周期函数解释道路流量，在八项工程约束下完成参数优化，并以 Huber 损失增强抗噪稳定性。',
    tags: ['鲁棒回归', 'Huber Loss', '最小二乘', '参数优化'],
    art: 'traffic',
  },
]

const strengths = [
  { id: 'A', title: '数据工程', text: '从 10 万+ 条业务数据清洗，到跨源时间对齐、特征工程与自动化 ETL，能把混乱数据变成可靠的研究底座。', detail: 'Python · Pandas · SQL · Excel' },
  { id: 'B', title: '算法建模', text: '善于把真实问题抽象为可求解模型，在时序预测、聚类、异常检测与约束优化之间选择合理路径。', detail: 'ML · Optimization · Time Series' },
  { id: 'C', title: '业务落地', text: '既能下场调研、理解一线业务，也能将分析结果转译成可视化看板、风险区域与决策依据。', detail: 'Research · Dashboard · Delivery' },
  { id: 'D', title: '团队领导', text: '多次担任建模队长与班长，负责从任务拆解、算法实现到论文交付的完整协作闭环。', detail: 'Leadership · Writing · Execution' },
]

const experience = [
  ['2026.07—09', '汕尾汇能综合服务有限公司', '电力工程技术管理岗实习生'],
  ['2026.01—03', '广西北海市救助站', '政策研究数据分析支持岗'],
  ['2024.11—至今', '华电 Hunters 实验室', '成员 / 机器人与嵌入式训练'],
  ['2024.09—至今', '华北电力大学', '数据科学与大数据技术本科'],
]

function Arrow({ diagonal = false }) {
  return <span className={diagonal ? 'arrow arrow-diagonal' : 'arrow'} aria-hidden="true">↗</span>
}

function ProjectVisual({ type }) {
  if (type === 'energy') return (
    <div className="visual visual-energy" aria-label="电力期权定价数据可视化示意图">
      <div className="visual-grid" />
      <div className="energy-orbit orbit-a" /><div className="energy-orbit orbit-b" />
      <svg viewBox="0 0 800 420" role="img">
        <defs><linearGradient id="lineA" x1="0" x2="1"><stop stopColor="#74edff"/><stop offset="1" stopColor="#6d79ff"/></linearGradient></defs>
        <path className="chart-area" d="M0 335 C90 290 120 350 190 260 S300 265 365 190 S480 228 545 120 S650 170 800 55 L800 420 L0 420Z"/>
        <path className="chart-line" d="M0 335 C90 290 120 350 190 260 S300 265 365 190 S480 228 545 120 S650 170 800 55" stroke="url(#lineA)"/>
        <path className="chart-line secondary" d="M0 280 C105 310 150 225 235 245 S350 150 420 205 S570 100 800 170"/>
      </svg>
      <span className="data-label label-a">PRICE PATH / 8760H</span><span className="data-label label-b">λ 0.673</span>
    </div>
  )
  if (type === 'signal') return (
    <div className="visual visual-signal" aria-label="工业设备传感器信号示意图">
      <div className="visual-grid" />
      <svg viewBox="0 0 900 420" role="img">
        {[90,170,250,330].map((y, i) => <path key={y} className={`signal-line s${i}`} d={`M0 ${y} C40 ${y-60} 70 ${y+70} 115 ${y} S190 ${y-70} 230 ${y} S310 ${y+60} 355 ${y} S430 ${y-75} 485 ${y} S570 ${y+65} 620 ${y} S700 ${y-50} 760 ${y} S850 ${y+45} 900 ${y}`}/>) }
      </svg>
      <div className="scan-line"/><div className="fault-marker">ANOMALY<br/><b>93.7%</b></div>
    </div>
  )
  if (type === 'trajectory') return (
    <div className="visual visual-trajectory" aria-label="烟幕干扰弹轨迹优化示意图">
      <div className="visual-grid"/><div className="target-ring r1"/><div className="target-ring r2"/><div className="target-dot"/>
      <svg viewBox="0 0 900 420" role="img"><path className="trajectory t1" d="M30 380 Q250 40 520 218 T880 82"/><path className="trajectory t2" d="M-30 290 Q270 130 470 260 T920 190"/><path className="trajectory t3" d="M90 430 Q340 160 610 302 T850 10"/></svg>
      <span className="coord c1">X 117.23 / Y 39.12</span><span className="coord c2">OPTIMAL WINDOW 08.4S</span>
    </div>
  )
  return (
    <div className="visual visual-traffic" aria-label="交通流量建模示意图">
      <div className="visual-grid"/><div className="road road-main"/><div className="road road-branch-a"/><div className="road road-branch-b"/>
      {[1,2,3,4,5].map(n => <i key={n} className={`car car-${n}`}/>) }
      <div className="traffic-panel"><small>MEAN ABS. ERROR</small><strong>2.66</strong><span>↓ 30% NOISE IMPACT</span></div>
    </div>
  )
}

function App() {
  const appRef = useRef(null)
  const cursorRef = useRef(null)
  const videoRef = useRef(null)
  const [navFloating, setNavFloating] = useState(false)
  const allowHeroVideo = !window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 640px)').matches && !navigator.connection?.saveData

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('gsap-ready')

    if (reduceMotion) {
      document.body.classList.remove('is-opening')
      return () => document.documentElement.classList.remove('gsap-ready')
    }

    document.body.classList.add('is-opening')
    const context = gsap.context(() => {
      const opening = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => document.body.classList.remove('is-opening'),
      })

      gsap.set('.opening-panel', { transformOrigin: '50% 0%' })
      gsap.set('.hero-wordmark span', { yPercent: 115, scaleX: .72, clipPath: 'inset(0 0 100% 0)', transformOrigin: '0% 50%' })
      gsap.set(['.hero-kicker', '.hero-disciplines span', '.hero-stat', '.hero-motion-caption', '.hero-bottom', '.hero-index', '.scroll-cue'], { autoAlpha: 0, y: 34 })
      gsap.set('.nav', { autoAlpha: 0, y: -36 })
      gsap.set('.hero-video', { scale: 1.12, autoAlpha: .48 })

      opening
        .fromTo('.opening-mark span', { yPercent: 120 }, { yPercent: 0, duration: 1.05, stagger: .08 }, .15)
        .fromTo('.opening-line i', { scaleX: 0 }, { scaleX: 1, duration: 1.55, ease: 'power2.inOut' }, .25)
        .fromTo('.opening-meta', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .8 }, .5)
        .to('.opening-panel', { scaleY: 0, duration: 1.15, stagger: .09, ease: 'expo.inOut' }, 1.65)
        .to('.opening-screen', { autoAlpha: 0, duration: .18, pointerEvents: 'none' }, 2.65)
        .to('.hero-video', { scale: 1, autoAlpha: .82, duration: 1.8, ease: 'expo.out' }, 2.25)
        .to('.nav', { autoAlpha: 1, y: 0, duration: 1.15 }, 2.45)
        .to('.hero-wordmark span', { yPercent: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.55, stagger: .16, ease: 'expo.out' }, 2.45)
        .to('.hero-kicker', { autoAlpha: 1, y: 0, duration: .95 }, 2.75)
        .to('.hero-disciplines span', { autoAlpha: 1, y: 0, duration: .85, stagger: .09 }, 2.9)
        .to('.hero-stat', { autoAlpha: 1, y: 0, duration: 1.05 }, 3.05)
        .to(['.hero-motion-caption', '.hero-bottom', '.hero-index', '.scroll-cue'], { autoAlpha: 1, y: 0, duration: 1, stagger: .08 }, 3.18)

      gsap.to('.hero-video', {
        yPercent: 9,
        scale: 1.07,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      })
      gsap.to('.hero-wordmark', {
        yPercent: 24,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
      ScrollTrigger.create({
        trigger: '.hero',
        start: '82% top',
        onEnter: () => setNavFloating(true),
        onLeaveBack: () => setNavFloating(false),
      })

      document.querySelectorAll('.motion-section').forEach((section, index) => {
        const title = section.querySelector('.motion-title')
        const heading = section.querySelector('.section-heading')
        if (!title || !heading) return
        gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 76%', once: true } })
          .fromTo(title,
            { xPercent: index % 2 ? 18 : -18, scaleX: .72, clipPath: index % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
            { xPercent: 0, scaleX: 1, clipPath: 'inset(0 0% 0 0%)', duration: 1.65, ease: 'expo.out' })
          .fromTo(heading.querySelectorAll(':scope > span, :scope > h2, :scope > p'),
            { y: 90, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
            { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.25, stagger: .1, ease: 'power4.out' }, '-=.9')
      })

      gsap.timeline({ scrollTrigger: { trigger: '.about-grid', start: 'top 78%', once: true } })
        .fromTo('.portrait-wrap', { clipPath: 'inset(100% 0 0 0)', y: 80 }, { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.45, ease: 'expo.inOut' })
        .fromTo('.portrait-wrap > img', { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, '-=1.05')
        .fromTo('.about-copy', { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, ease: 'power4.out' }, '-=1.2')

      gsap.to('.portrait-wrap > img', {
        yPercent: 7,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: '.portrait-wrap', start: 'top bottom', end: 'bottom top', scrub: 1.1 },
      })

      gsap.fromTo('.metrics > div',
        { y: 70, autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.05, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: '.metrics', start: 'top 82%', once: true } })

      gsap.fromTo('.experience-glow-card',
        { y: 90, autoAlpha: 0, scaleY: .82, transformOrigin: '50% 100%' },
        { y: 0, autoAlpha: 1, scaleY: 1, duration: 1.15, stagger: .14, ease: 'expo.out', scrollTrigger: { trigger: '.experience', start: 'top 80%', once: true } })

      document.querySelectorAll('.project-card').forEach((card, index) => {
        const art = card.querySelector('.project-art')
        const visual = card.querySelector('.visual')
        const info = card.querySelector('.project-info')
        const fromLeft = index % 2 === 0
        gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 78%', once: true } })
          .fromTo(art,
            { clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', x: fromLeft ? -70 : 70 },
            { clipPath: 'inset(0 0% 0 0%)', x: 0, duration: 1.55, ease: 'expo.inOut' })
          .fromTo(visual, { scale: 1.16 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, '-=1.15')
          .fromTo(info.children, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: .09, ease: 'power4.out' }, '-=1.05')
        gsap.fromTo(visual, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
      })

      gsap.fromTo('.strength-card',
        { y: 100, autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.25, stagger: .14, ease: 'expo.out', scrollTrigger: { trigger: '.strength-grid', start: 'top 82%', once: true } })

      gsap.fromTo('.honors', { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.honors', start: 'top 88%', once: true } })

      gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top 72%', once: true } })
        .fromTo('.contact .motion-title', { xPercent: -22, scaleX: .68, clipPath: 'inset(0 100% 0 0)' }, { xPercent: 0, scaleX: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.7, ease: 'expo.out' })
        .fromTo('.contact h2', { y: 110, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'power4.out' }, '-=.95')
        .fromTo('.contact-bottom > *', { y: 65, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: .13, ease: 'power4.out' }, '-=.65')
    }, appRef)

    return () => {
      context.revert()
      document.body.classList.remove('is-opening')
      document.documentElement.classList.remove('gsap-ready')
    }
  }, [])

  useEffect(() => {
    let pointerFrame = 0
    let pointerX = 0
    let pointerY = 0
    let heroVisible = true
    const move = e => {
      pointerX = e.clientX
      pointerY = e.clientY
      if (pointerFrame) return
      pointerFrame = requestAnimationFrame(() => {
        if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
        pointerFrame = 0
      })
    }
    const syncVideoPlayback = () => {
      const video = videoRef.current
      if (!video || !allowHeroVideo) return
      if (document.hidden || !heroVisible) video.pause()
      else video.play().catch(() => {})
    }
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting
      syncVideoPlayback()
    }, { threshold: .01 })
    const hero = appRef.current?.querySelector('.hero')
    if (hero) heroObserver.observe(hero)
    window.addEventListener('pointermove', move)
    document.addEventListener('visibilitychange', syncVideoPlayback)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', syncVideoPlayback)
      heroObserver.disconnect()
      cancelAnimationFrame(pointerFrame)
    }
  }, [allowHeroVideo])

  return (
    <main ref={appRef}>
      <div className="opening-screen" aria-hidden="true">
        <div className="opening-panel opening-panel-a"/><div className="opening-panel opening-panel-b"/><div className="opening-panel opening-panel-c"/>
        <div className="opening-core">
          <div className="opening-mark"><span>LIU</span><span>XINGJI</span></div>
          <div className="opening-line"><i/></div>
          <div className="opening-meta"><span>PORTFOLIO / 2026</span><span>DATA × ENERGY × MODELING</span></div>
        </div>
      </div>
      <div className="cursor" ref={cursorRef}/>
      <header className={`nav shell${navFloating ? ' is-scrolled' : ''}`}>
        <a className="monogram" href="#home" aria-label="返回首页">LXJ<span>®</span></a>
        <nav aria-label="主导航">
          <a href="#about">关于</a><a href="#work">项目</a><a href="#strengths">能力</a>
        </nav>
        <a className="nav-contact" href="mailto:120241050109@ncepu.edu.cn">联系我 <Arrow/></a>
      </header>

      <section className="hero" id="home">
        <video ref={videoRef} className="hero-video" autoPlay={allowHeroVideo} muted loop playsInline preload={allowHeroVideo ? 'metadata' : 'none'} poster="/assets/video-poster.svg" aria-hidden="true">
          {allowHeroVideo && <source src="/assets/hero-red-abstract-720p.mp4" type="video/mp4" />}
        </video>
        <div className="hero-overlay"/><div className="hero-grid"/><div className="noise"/>
        <div className="hero-content shell">
          <div className="hero-kicker"><span className="pulse"/> NCEPU · DATA SCIENCE · GRADE 3</div>
          <div className="hero-wordmark" aria-hidden="true"><span>LIU</span><span>XINGJI</span></div>
          <div className="hero-disciplines" aria-label="研究方向">
            <span>DATA MODELING</span><span>ENERGY ANALYTICS</span><span>OPTIMIZATION</span>
          </div>
          <div className="hero-stat">
            <strong>98.7<sup>%</sup></strong>
            <span>ETL DATA ACCURACY</span>
            <small>10W+ RECORDS PROCESSED</small>
          </div>
          <div className="hero-motion-caption" aria-hidden="true"><span>GENERATIVE FIELD / 01</span><small>DATA IN MOTION</small></div>
          <div className="hero-bottom">
            <div className="hero-intro"><small>PORTFOLIO / 2026</small><p>数据科学与大数据技术<br/>华北电力大学 · 北京</p></div>
            <a href="#work" className="hero-cta" aria-label="查看精选项目"><span>EXPLORE WORK</span><Arrow diagonal/></a>
          </div>
        </div>
        <div className="hero-index">DATA × ENERGY × MODELING</div>
        <div className="scroll-cue"><span/> SCROLL TO EXPLORE</div>
      </section>

      <section className="about section shell motion-section" id="about">
        <div className="motion-title" aria-hidden="true">ABOUT</div>
        <div className="section-heading" data-reveal><span>01 / ABOUT</span><h2>不只分析数据，<br/>更理解数据背后的现实。</h2></div>
        <div className="about-grid">
          <div className="portrait-wrap" data-reveal>
            <img src="/assets/avatar-clay.webp" width="1200" height="1678" loading="lazy" decoding="async" fetchPriority="low" alt="刘兴技卡通人物头像"/>
            <div className="portrait-caption"><span>BEIJING, CN</span><span>GRADE 3 / NCEPU</span></div>
          </div>
          <div className="about-copy" data-reveal>
            <p className="lead">我是刘兴技，华北电力大学数据科学与大数据技术专业大三学生。关注数据如何进入真实场景——能源、公共服务、工业设备，以及每一个可以被更好理解的问题。</p>
            <p>我喜欢从业务现场开始：清洗数据、建立假设、构造模型，再把结果变成能被使用的工具与结论。多次建模竞赛队长经历，也让我习惯为复杂协作找到清晰的推进路径。</p>
            <div className="contact-lines">
              <a href="tel:18601916588"><span>PHONE</span>186 0191 6588</a>
              <a href="mailto:120241050109@ncepu.edu.cn"><span>MAIL</span>120241050109@ncepu.edu.cn</a>
            </div>
          </div>
        </div>
        <div className="metrics" data-reveal>
          <div><strong>10W<sup>+</sup></strong><span>业务数据处理量</span></div>
          <div><strong>98.7<sup>%</sup></strong><span>ETL 数据准确率</span></div>
          <div><strong>93.7<sup>%</sup></strong><span>故障识别准确率</span></div>
          <div><strong>04</strong><span>核心建模项目</span></div>
        </div>
        <div className="experience" data-reveal>
          <div className="experience-title">SELECTED EXPERIENCE</div>
          <div className="experience-list">
            {experience.map(([date, org, role], index) => (
              <BorderGlow
                key={org}
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
                <div className="experience-row"><time>{date}</time><strong>{org}</strong><span>{role}</span><Arrow/></div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section className="projects section motion-section" id="work">
        <div className="motion-title" aria-hidden="true">SELECTED WORK</div>
        <div className="shell section-heading project-heading" data-reveal><span>02 / SELECTED WORK</span><h2>用模型，回应<br/>真实世界的问题。</h2><p>从能源市场到工业设备，四个项目，四种把复杂问题拆开的方式。</p></div>
        <div className="project-list shell">
          {projects.map((p, idx) => (
            <article className="project-card" key={p.number} data-reveal>
              <div className="project-art"><ProjectVisual type={p.art}/><span className="project-no">{p.number}</span></div>
              <div className="project-info">
                <div className="project-meta">{p.meta}</div>
                <h3>{p.title}<small>{p.en}</small></h3>
                <p>{p.description}</p>
                <div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                <div className="project-stat">{idx === 0 ? '8760+ HOUR DATA' : idx === 1 ? '−28% FALSE POSITIVE' : idx === 2 ? '+40% SOLVE SPEED' : 'MAE 2.66'}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="strengths section shell motion-section" id="strengths">
        <div className="motion-title" aria-hidden="true">CAPABILITIES</div>
        <div className="section-heading compact" data-reveal><span>03 / CAPABILITIES</span><h2>理性建模，<br/>可靠交付。</h2></div>
        <div className="strength-grid">
          {strengths.map(s => <article key={s.id} className="strength-card" data-reveal><span className="strength-id">{s.id}</span><div><h3>{s.title}</h3><p>{s.text}</p><small>{s.detail}</small></div><Arrow/></article>)}
        </div>
        <div className="honors" data-reveal><span>RECENT RECOGNITION</span><p>全国大学生数学建模竞赛 北京二等奖 · 五一数学建模竞赛 全国二等奖 · 首都高校拔河锦标赛 冠军</p></div>
      </section>

      <footer className="contact" id="contact">
        <div className="motion-title" aria-hidden="true">LET'S WORK</div>
        <div className="contact-grid"/><div className="contact-glow"/>
        <div className="shell contact-inner">
          <div className="contact-top"><span>04 / CONTACT</span><span>BEIJING · CHINA · UTC+8</span></div>
          <h2 data-reveal>让数据产生<br/><em>真实影响。</em></h2>
          <div className="contact-bottom" data-reveal>
            <a className="email-link" href="mailto:120241050109@ncepu.edu.cn">120241050109@ncepu.edu.cn <Arrow/></a>
            <div><p>寻找数据分析、算法建模与能源科技方向的实习与项目合作。</p><a href="tel:18601916588">+86 186 0191 6588</a></div>
          </div>
          <div className="footer-line"><span>© 2026 LIU XINGJI</span><a href="#home">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
