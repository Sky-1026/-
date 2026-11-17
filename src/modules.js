import { experience } from './experienceData'
import { projects } from './workData'

/* ────────────────────────────────────────────────────────────
   平台唯一的结构定义。
   一个 node = 一个模块。加模块只改这里，Room / 面板 / 页面都会跟着长。

   spot      在房间里的位置（背景图 1792×1024 的百分比，左上角为准）+ 对应姿势
             pose: 1—9 是奥赛姿势，一件物品一个，不能重复；11 是双手比心；
             10 是放松站立的待机姿势，没有 hover 时回到它。
             ⇒ 可点物品原来限 9 件（怕姿势撞车），2026-11-17 你决定破这条：
                现在 10 件可点、姿势 11 个，再加物品就继续往后编姿势号，别复用。
             kind: 'note' 是便利贴，文字由 HTML 叠上去（画里是空白纸）；
                   'prop' 是画里的实物，靠 hover 的红虚线框和左下角读数条提示。
                   「喜欢」那颗心是画在纸上的涂鸦，按 prop 处理：热区给整张纸加胶带，
                   不在纸上叠 HTML 文字。
             坐标不许目测：用 /c/Python314/python 量色块，再把候选区裁出来
             肉眼确认边界（source-assets/ref/room/）。改完必须查重叠——
             两个热区叠住时，点击会落到 DOM 里靠后的那个，前面那个就点不到。
   go        直接跳去别处（简历长页 / 深链），不打开面板
   slots     有它就有独立页面 #/<id>，见 ModulePage.jsx
   kicker/title/lead/body  面板与页面共用的文案

   slot 类型只有八种，内容以后往 items 里填，不再动结构：
     para   { text }
     paras  { title, from:'<经历 id>' }                   // 正文取自经历数据
     list   { title, columns:[], items:[{ cells:[], note? }], empty }
     stats  { title, columns:[], items:[[k, v]], empty }  // 也可 from:'<经历 id>'
     shots  { title, gallery:'gallery'|'honors' }          // 全部经历的实拍
     cards  { title, items:[项目] }                        // 取自 workData
     links  { title, items:[{ kind, label, href }] }
     frame  { title, kind, ratio, empty }                // 图/视频/图表的位置，先空着
   ──────────────────────────────────────────────────────────── */

const EMAIL = '120241050109@ncepu.edu.cn'

export const nodes = [
  {
    id: 'resume', label: '简历', en: 'RESUME', hint: '完整经历 · 项目 · 能力',
    kicker: 'RESUME / 简历', title: '一页纸的那个版本',
    lead: '实习、项目、竞赛、技能写在一起的长页，可以直接打印，也可以只看拔河那一段。',
    body: ['它是这个房间里的一个模块，不是整个网站。想快速跳进某一段，房间里那台显示器和那根绳子就是入口。'],
    go: '#/resume',
    spot: { kind: 'prop', x: 1.4, y: 35.8, w: 7.2, h: 7.6, pose: 2 },
  },

  {
    id: 'training', label: '训练', en: 'TRAINING', hint: '热力图 · 三大项 · 周容量',
    kicker: 'TRAINING LOG / 训练日志', title: '把坚持变成一张图',
    lead: '这一格会放你自己的训练数据：年度热力图、周训练容量曲线、三大项 PR 阶梯。',
    body: [
      '数据结构就一行一条：日期、动作、重量、次数、组数。你继续用 Hevy 或 Keep 记，导出成 CSV 放进 src/data/training.csv，构建时算出所有图，不需要后端。',
      '体重、体脂这类身体数据默认不上线——训练量可以公开，身体不行。',
    ],
    spot: { kind: 'prop', x: 12.5, y: 61.5, w: 32.5, h: 13.5, pose: 5 },
    slots: [
      { type: 'para', text: '先只搭架子：下面每一块的位置、比例、列名都定好了，等你把真实记录给我，填进去就出图，不再改版式。' },
      { type: 'stats', title: '三大项 PR', columns: ['动作', '重量', '日期'], items: [],
        empty: '一行一个：深蹲 / 卧推 / 硬拉。名次和重量我只写你亲口确认过的。' },
      { type: 'frame', title: '年度打卡', kind: 'HEATMAP · 365 格', ratio: '16 / 5',
        empty: '一格一天。数据来自同一份训练记录，不另外维护。' },
      { type: 'frame', title: '周容量曲线', kind: 'CHART · 折线', ratio: '16 / 7',
        empty: '等你有连续几周的真实数据再画，不然就是一条编出来的假线。' },
    ],
  },

  {
    id: 'notes', label: '记录', en: 'NOTES', hint: '踩过的坑，一条一个',
    kicker: 'FIELD NOTES / 随手记录', title: '一条只解决一个问题',
    lead: '踩过的坑、查明白的东西，一条两三百字，带日期和关键词。',
    body: [
      '格式是带 YAML 头的 Markdown，放在 src/data/notes/ 下，构建时读目录生成索引。不写长文，所以不会变成负担。',
      '候选选题：ETL 里遇到过的脏数据模式、STAR 与索引失效、数模里被推翻的假设、拔河发力节奏。',
    ],
    spot: { kind: 'prop', x: 0.8, y: 44.5, w: 9.4, h: 18.5, pose: 8 },
    slots: [
      { type: 'para', text: '列表页与详情页的结构在这里；每条只写日期、标题、标签、正文四样，写不出来的就先空着。' },
      { type: 'list', title: '条目', columns: ['日期', '标题', '标签'], items: [],
        empty: '等你写第一批五条。我不动你的原文，只排版式。' },
    ],
  },

  {
    id: 'now', label: '此刻', en: 'NOW', hint: '最近在忙什么',
    kicker: 'NOW / 此刻', title: '这个学期我在做的事',
    lead: '不是时间线，是“此刻”：在练什么、在读什么、在纠结什么。每季度改一次。',
    body: ['参考 Derek Sivers 的 now page 思路——它替代了“朋友圈”，但不用天天发。'],
    spot: { kind: 'prop', x: 10.3, y: 42.0, w: 5.0, h: 18.7, pose: 1 },
    slots: [
      { type: 'list', title: '现在', columns: ['方面', '状态'], items: [],
        empty: '四个位置留好了：在练 / 在学 / 在读 / 在想。每季度只改这一页。' },
      { type: 'para', text: '这一页的价值在于它会过期，所以更新痕迹本身就是“这个人是活的”的证据。' },
    ],
  },

  {
    id: 'likes', label: '喜欢', en: 'FAVORITES', hint: '在听 · 在看 · 反复看的一句话',
    kicker: 'FAVORITES / 喜欢', title: '墙上那颗心',
    lead: '不是成就，是偏好：最近在循环的歌、在看的片、还有反复翻的那几页。',
    body: [
      '这一格和「此刻」分开：此刻讲在做什么，这里讲在喜欢什么。它是最不像简历的部分，所以允许写得随便一点。',
      '内容等你给——我不替你挑歌，也不替你写理由。',
    ],
    spot: { kind: 'prop', x: 88.6, y: 7.6, w: 5.4, h: 11.2, pose: 11 },
    slots: [
      { type: 'list', title: '清单', columns: ['类别', '内容', '为什么留下'], items: [],
        empty: '四行位置留好：在听 / 在看 / 在读 / 一句话。' },
      { type: 'para', text: '改这一格没有负担，一行一条；哪天不喜欢了，删掉也算更新。' },
    ],
  },

  {
    id: 'gear', label: '在用装备', en: 'GEAR', hint: '腰带 · 助力带 · 软杠',
    kicker: 'SETUP / 在用装备', title: '我手上正在用的东西',
    lead: '训练装备和干活工具，各写一句为什么留下、为什么换掉。',
    body: ['这部分成本极低，改一行文字就行，适合当作“网站是活的”的证据。'],
    spot: { kind: 'prop', x: 29.5, y: 31.0, w: 10.0, h: 23.0, pose: 6 },
    slots: [
      { type: 'list', title: '清单', columns: ['物品', '用来做什么', '留着的原因'], items: [],
        empty: '一行一件。照片以后再说，先把话说清楚。' },
    ],
  },

  {
    id: 'honors', label: '荣誉与证书', en: 'HONORS', hint: '奖杯 · 奖学金 · 竞赛',
    kicker: 'HONORS / 荣誉与证书', title: '奖杯和证书',
    lead: '数学建模、体育活动、团员荣誉的原件实拍。',
    body: [
      '名次按证书与赛事照片核对过：2025 年男子乙组四人组冠军、八人组亚军；2026 年升入男子甲组后八人组冠军、四人组亚军。',
      '拔河那一段经历现在配了三张图——两张赛场奖杯照加一张体育活动优秀奖学金证书。',
    ],
    spot: { kind: 'prop', x: 1.0, y: 18.5, w: 14.0, h: 13.5, pose: 9 },
    slots: [
      { type: 'shots', title: '证书与奖杯实拍', gallery: 'honors' },
    ],
  },

  {
    id: 'gallery', label: '影像', en: 'IMAGES', hint: '现场照片与证书实拍',
    kicker: 'IMAGES / 影像', title: '现场照片',
    lead: '从各段经历里抽出来的实拍，不按经历排，按“看得见的事”排。',
    body: [
      '实习、抢修、志愿服务现场的原始照片都在这里；证书另放在“荣誉与证书”那一格，免得混在一起看不清。',
      '点任意一张看大图，左右方向键翻页。',
    ],
    spot: { kind: 'prop', x: 79.8, y: 67.8, w: 12.5, h: 17.6, pose: 7 },
    slots: [
      { type: 'shots', title: '照片', gallery: 'gallery' },
      { type: 'frame', title: '现场视频', kind: 'VIDEO · 16:9', ratio: '16 / 9',
        empty: '位置留着。有素材再挂，不拿占位图假装已有。' },
    ],
  },

  {
    id: 'work', label: '精选项目', en: 'SELECTED WORK', hint: '数据 · 建模 · 能源',
    kicker: 'SELECTED WORK / 精选项目', title: '四个项目，四种把问题拆开的方式',
    lead: '能源市场、工业设备、运动学、交通流：每个都从数据口径开始，到能被别人复现的结论结束。',
    body: ['项目清单只有 src/workData.js 一份，这一格和简历页的项目区块读同一份数据，不会长成两个版本。'],
    spot: { kind: 'prop', x: 70.5, y: 36.5, w: 19.5, h: 15.5, pose: 4 },
    slots: [
      { type: 'cards', title: 'PROJECTS', items: projects },
      { type: 'frame', title: '可复现的附件', kind: 'REPO · 数据 · 结果图', ratio: '16 / 9',
        empty: '等你给仓库地址、数据来源和结果图，我再按项目一行一行挂上去；没有之前这里就空着。' },
    ],
  },

  {
    id: 'tug', label: '拔河队', en: 'TUG OF WAR', hint: '节奏比力量更重要',
    kicker: 'TUG OF WAR / 拔河队', title: '八个人一个节拍',
    lead: '校拔河队，位置是发力核心：把八个人的输出压到同一个节拍上，比一个人多使三分力有用。',
    body: ['这一段文字、名次和照片与 experienceData 同源，简历页写的是经历顺序，这里只留拔河本身。'],
    spot: { kind: 'prop', x: 41.5, y: 78.5, w: 11.5, h: 10.0, pose: 3 },
    slots: [
      { type: 'stats', title: '名次与荣誉', columns: ['项目', '记录'], from: 'tugofwar' },
      { type: 'paras', title: '两个赛季', from: 'tugofwar' },
      { type: 'shots', title: '赛场与证书', from: 'tugofwar' },
    ],
  },

  {
    id: 'files', label: '文件柜', en: 'FILES', hint: 'PDF · 作品集 · 可下载',
    kicker: 'FILES / 文件柜', title: '可下载的东西',
    lead: '简历 PDF、作品集长图，以及任何你希望别人存下来的版本。',
    body: ['现在还没有导出好的 PDF。等房间这一层定稿后，我把深色简历页排一版 A4 打印样式。'],
    slots: [
      { type: 'list', title: '文件', columns: ['名称', '格式', '说明'], items: [],
        empty: 'A4 打印版简历排好后放进 public/downloads/，这里一行一个。' },
    ],
  },

  {
    id: 'contact', label: '联系', en: 'CONTACT', hint: '邮箱 · 电话 · 北京',
    kicker: 'CONTACT / 联系我', title: '怎么找到我',
    lead: '数据分析、算法建模、能源科技方向的实习与项目合作，都可以聊。',
    body: ['联系方式不是房间里的家具，所以它不在墙上，在角上和这一页。'],
    slots: [
      { type: 'links', title: '直达', items: [
        { kind: 'EMAIL', label: EMAIL, href: `mailto:${EMAIL}` },
        { kind: 'PHONE', label: '+86 186 0191 6588', href: 'tel:18601916588' },
        { kind: 'BASE', label: '北京 · 华北电力大学', href: null },
        { kind: 'RESUME', label: '完整简历一页版', href: '#/resume' },
      ] },
    ],
  },
]

/* 房间里的可点物品（姿势唯一，数量 ≤ 9） */
export const hotspots = nodes
  .filter(n => n.spot)
  .map(n => ({ ...n.spot, id: n.id, label: n.label, en: n.en, hint: n.hint, go: n.go, page: n.slots ? n.id : null }))

/* 有独立页面的模块，页面之间的上一格/下一格按这个顺序走 */
export const pages = nodes.filter(n => n.slots)

/* 墙上的海报：纯装饰，不可点。
   每件可点物品都要独占一个姿势，所以海报继续只当画面，不顺手加热点。
   坐标同样是背景图 1792×1024 的百分比，加一张只加一行。 */
export const posters = [
  { id: 'self-carving', src: '/assets/room/posters/self-carving.webp',
    x: 40.0, y: 10.5, w: 18.5, h: 41.5, tilt: -0.7 },
]

export const byId = Object.fromEntries(nodes.map(n => [n.id, n]))
export const pageIds = pages.map(n => n.id)

/* 有没有真内容不由我手写 status 决定，看槽位里到底有没有条目，
   免得我忘了改，让一个空格子自称"已完成"。 */
export function isReady(n) {
  return slotsOf(n).some(s => {
    if (s.type === 'shots') return (s.items || buildGallery(s.gallery)).length > 0
    if (s.type === 'para' || s.type === 'paras' || s.type === 'frame') return false
    return (s.items || []).length > 0
  })
}

const expById = id => experience.find(e => e.id === id)

/* 写了 from 的槽位，渲染前从同一份经历数据里把内容取过来：
   文字、名次、照片只在 experienceData.js 维护一处，
   拔河这一格和简历页读的是同一条记录。 */
export function slotsOf(n) {
  return (n.slots || []).map(s => {
    if (!s.from) return s
    const e = expById(s.from)
    if (!e) return s
    if (s.type === 'paras') return { ...s, texts: e.body }
    if (s.type === 'stats') return { ...s, items: e.facts }
    if (s.type === 'shots') return { ...s, items: e.gallery.map(g => ({ ...g, org: e.org, date: e.date })) }
    return s
  })
}

/* 影像与荣誉：直接从经历数据里取真实图片，不重复维护一份清单 */
export function buildGallery(kind) {
  const out = []
  experience.forEach(e => {
    e.gallery.forEach(g => {
      const isCert = /cert-\d+/.test(g.src)
      if (kind === 'honors' ? isCert : !isCert) out.push({ ...g, org: e.org, date: e.date })
    })
  })
  return out
}
