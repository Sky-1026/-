import { experience } from './experienceData'

/* ────────────────────────────────────────────────────────────
   平台唯一的结构定义。
   一个 node = 一个模块。加模块只改这里，Room / 面板 / 页面都会跟着长。

   spot      在房间里的位置（背景图 1792×1024 的百分比）+ 对应姿势
             pose: 1—9 是奥赛姿势，一件物品一个，不能重复；
             10 是放松站立的待机姿势，没有 hover 时回到它。
             ⇒ 带 spot 的物品必须 ≤ 9，否则姿势会撞车。
   go        直接跳去别处（简历长页 / 深链），不打开面板
   slots     有它就有独立页面 #/<id>，见 ModulePage.jsx
   kicker/title/lead/body  面板与页面共用的文案

   slot 类型只有六种，内容以后往 items 里填，不再动结构：
     para   { text }
     list   { title, columns:[], items:[{ cells:[], note? }], empty }
     stats  { title, columns:[], items:[[k, v]], empty }
     shots  { title, gallery:'gallery'|'honors' }        // 从经历数据里取真实图
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
    spot: { kind: 'note', x: 30.6, y: 19.3, w: 5.6, h: 9.2, tilt: -2, pose: 2 },
  },

  {
    id: 'training', label: '训练', en: 'TRAINING', hint: '热力图 · 三大项 · 周容量',
    kicker: 'TRAINING LOG / 训练日志', title: '把坚持变成一张图',
    lead: '这一格会放你自己的训练数据：年度热力图、周训练容量曲线、三大项 PR 阶梯。',
    body: [
      '数据结构就一行一条：日期、动作、重量、次数、组数。你继续用 Hevy 或 Keep 记，导出成 CSV 放进 src/data/training.csv，构建时算出所有图，不需要后端。',
      '体重、体脂这类身体数据默认不上线——训练量可以公开，身体不行。',
    ],
    spot: { kind: 'note', x: 39.1, y: 12.9, w: 5.6, h: 9.2, tilt: 1.5, pose: 5 },
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
    spot: { kind: 'note', x: 46.5, y: 23.0, w: 5.6, h: 9.2, tilt: -1, pose: 8 },
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
    spot: { kind: 'note', x: 42.3, y: 33.9, w: 5.6, h: 9.2, tilt: -1.5, pose: 1 },
    slots: [
      { type: 'list', title: '现在', columns: ['方面', '状态'], items: [],
        empty: '四个位置留好了：在练 / 在学 / 在读 / 在想。每季度只改这一页。' },
      { type: 'para', text: '这一页的价值在于它会过期，所以更新痕迹本身就是“这个人是活的”的证据。' },
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
    spot: { kind: 'note', x: 53.0, y: 18.3, w: 5.6, h: 9.2, tilt: 2, pose: 7 },
    slots: [
      { type: 'shots', title: '照片', gallery: 'gallery' },
      { type: 'frame', title: '现场视频', kind: 'VIDEO · 16:9', ratio: '16 / 9',
        empty: '位置留着。有素材再挂，不拿占位图假装已有。' },
    ],
  },

  {
    id: 'work', label: '精选项目', en: 'SELECTED WORK', hint: '数据 · 建模 · 能源',
    kicker: 'PROJECTS / 精选项目', title: '三个能讲清楚的项目',
    lead: '项目详情写在简历页里，这一格只负责把你送到那一段。',
    body: ['等模块页都填上真内容后，项目会从简历里拆出来单独一页。'],
    go: '#/resume?to=work',
    spot: { kind: 'prop', x: 70.5, y: 36.5, w: 19.5, h: 15.5, pose: 4 },
  },

  {
    id: 'tug', label: '拔河队', en: 'TUG OF WAR', hint: '节奏比力量更重要',
    kicker: 'TUG OF WAR / 拔河队', title: '八个人一个节拍',
    lead: '校拔河队发力核心，两个赛季各拿下一个冠军。',
    body: ['完整段落、三张赛场图和奖学金证书都在简历页的经历区里。'],
    go: '#/resume?to=experience',
    spot: { kind: 'prop', x: 41.5, y: 78.5, w: 11.5, h: 10.0, pose: 3 },
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

export const byId = Object.fromEntries(nodes.map(n => [n.id, n]))
export const pageIds = pages.map(n => n.id)

/* 有没有真内容不由我手写 status 决定，看槽位里到底有没有条目，
   免得我忘了改，让一个空格子自称"已完成"。 */
export function isReady(n) {
  return (n.slots || []).some(s => {
    if (s.type === 'shots') return buildGallery(s.gallery).length > 0
    if (s.type === 'para' || s.type === 'frame') return false
    return (s.items || []).length > 0
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
