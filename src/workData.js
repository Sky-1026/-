/* 精选项目的唯一数据来源。
   简历页的 SELECTED WORK 区块和 #/work 模块页都读这一份，
   改一处两边一起变，不会出现两个版本的项目描述。 */
export const projects = [
  {
    number: '01',
    title: '电力期权定价',
    en: 'POWER OPTION PRICING',
    meta: '多模型协同优化研究 · 组长 · 2025.11—至今',
    description: '整合广西光伏、山西风电两省 8760+ 小时级数据，搭建“场景划分—价差预测—动态定价”全链路体系，用 Bachelier 引擎适配负电价极端场景。',
    tags: ['K-Means', 'LSTM', 'Bachelier', 'L-BFGS-B'],
    art: 'energy',
  },
  {
    number: '02',
    title: '工业设备检测',
    en: 'EQUIPMENT DIAGNOSTICS',
    meta: '北京大学生数学建模与计算机应用竞赛 · 队长 · 2026.04—05 · 三等奖',
    description: '融合时域、频域特征与注意力 CNN-LSTM，结合孤立森林与 DBSCAN 构建分层检测流程，故障识别准确率提升至 93.7%，误报率降低 28%。',
    tags: ['CNN-LSTM', 'FFT', 'Isolation Forest', 'DBSCAN'],
    art: 'signal',
  },
  {
    number: '03',
    title: '烟幕投放策略',
    en: 'TACTICAL OPTIMIZATION',
    meta: '全国大学生数学建模竞赛 · 队长 · 2025.09—10 · 北京二等奖',
    description: '建立无人机、导弹与烟幕的多对象运动学模型，通过遗传算法、改进粒子群与二分法平衡弹药用量和有效遮蔽时间，求解效率提升 40% 以上。',
    tags: ['遗传算法', '粒子群', '二分法', '运动学建模'],
    art: 'trajectory',
  },
  {
    number: '04',
    title: '交通流量建模',
    en: 'TRAFFIC FLOW MODELING',
    meta: '第二十二届五一数学建模竞赛 · 队长 · 2025.05—06 · 全国二等奖',
    description: '以分段线性与正弦周期函数解释道路流量，在八项工程约束下完成参数优化，并以 Huber 损失增强抗噪稳定性，含噪声数据下稳定性提升 30% 以上。',
    tags: ['鲁棒回归', 'Huber Loss', '最小二乘', '参数优化'],
    art: 'traffic',
  },
]
