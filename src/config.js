/* =========================================================
   Authoritative configuration
   All mechanical values come from the design brief.
   Visual-only layout constants are explicitly grouped below.
   ========================================================= */
export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export const COLORS = {
  bg: 0xF4F6F9,
  floor: 0xE9EDF3,
  cyan: 0x0E7490,
  amber: 0xA94B0B,
  green: 0x147A3A,
  red: 0xB42318,
  yellow: 0x806214,
  steel: 0x8793A1,
  glass: 0x40606F,
};

export const CFG = {
  units: { scene: 'mm', display: 'mm / μm / N / RPM' },
  gear: {
    Z: 98,
    mn: 8,
    alphaN: 20 * DEG,
    betaDeg: 28 + 21 / 60 + 27 / 3600, // 28.3575°
    beta: (28 + 21 / 60 + 27 / 3600) * DEG,
    x: 0,
    grade: '4级（JB197-83 887HK）',
    D: 4200,
    d: 890.9,
    a: 550,
    ff: 0.045,          // mm
    Fr: 0.112,          // mm
    fpb: 0.032,         // mm (±)
    Fbeta: 0.02,        // mm
    rb: 368.36,         // mm, 说明书口径
    rbExact: 411.6,     // mm, (d/2)·cos αt, 仅折叠备注
    k: 11,
    W: 258.88,          // mm
    ballD: 16,          // mm
  },
  scan: {
    length: 35,         // mm
    defaultSpeed: 2.0,  // mm/s, teaching setting
    minSpeed: 0.5,
    maxSpeed: 5.0,
    defaultSamples: 60,
    minSamples: 20,
    maxSamples: 120,
    lineError: 0.2,     // μm, software compensated
  },
  machine: {
    U: 9.6,             // μm, k=2
    Ulimit: 12,
    mass: 25,           // kg
    massLimit: 30,
    costLimit: 8000,
    envelope: '≤ 500 × 400 × 400 mm',
    stroke: 160,        // Y rail stroke
    scanStroke: 35,
    straightness: 3,    // μm / 300 mm
    reverse: 2.0,       // μm
    forceMin: 0.1,
    forceMax: 0.5,
  },
  drive: {
    screwPitch: 5,
    screwDia: 16,
    screwGrade: 'C3',
    microsteps: 16,
    motorSteps: 200,
    stepUm: (5 / (200 * 16)) * 1000, // 1.5625 μm
    motorModel: 'N85BYGH450A-04',
    holdTorque: 0.4,
    requiredTorque: 0.0265,
    coupling: '弹性膜片联轴器',
    couplingTorque: 1.5,
    screwStiffness: 117800, // N/mm
    screw30NDef: 0.25,      // μm
    railMidDef: 0.48,       // μm
    railMidAllow: 1.5,
  },
  locator: {
    ballD: 16,
    ballRange: '12–19 mm',
    ballSet: '12 / 16 / 20 mm',
    roundness: 0.5, // μm
    Ra: 0.1,        // μm
    material: 'GCr15 轴承钢 · HRC 60–64',
    armA: 129,
    armB: 40,
    micrometer: 'M6 · 0.01 mm/div · 10 mm',
    springK: 2.0,   // N/mm
    springPreload: 5, // N
  },
  stylus: {
    ballD: 3,
    ballMaterial: '红宝石 · HRA ≥ 88',
    rodMaterial: '钨钢',
    E: 600,          // GPa
    rodD: 3,
    extension: 35,
    totalLength: 50,
    deflection: 1.2, // μm @0.2N
    deflectionAllow: 1.5,
  },
  lever: {
    material: '2A12 硬铝',
    section: '10 × 6 mm',
    length: 60,
    ratio: 3,
    L1: 45,
    L2: 15,
    holeTolerance: '±0.02 mm',
    parallelism: 0.008,
  },
  flexure: {
    material: 'QSn6.5-0.1 锡磷青铜',
    size: '15 × 8 × 0.4 mm',
    kAlpha: 2.6,    // N·mm/rad
    angleRange: 2,  // ±°
    life: '≥ 10⁶ 次',
    limitAngle: 5,  // ±°
  },
  reversal: {
    angle: 22.45,   // ±° (≈ αt)
    repeat: 2.0,    // μm
    angularAccuracy: 0.05,
    time: 10,       // s
    bearing: '交叉滚子轴承 φ30 / φ55',
    runout: 0.005,
    base: '7075-T6 · 12 mm',
    pin: 'φ4 精密定位销 H7/h6',
  },
  support: {
    base: 'HT200 灰铸铁 · 400 × 300 × 80 mm',
    baseMass: 12,
    column: '6061-T6 方管 60 × 60 × 5 · 高 250 mm',
    arm: '6061-T6 · 长 200 mm',
    armDeflection: 2.0,
    armDeflectionAllow: 5.0,
    feet: '3 × M16 · ±5 mm · 0.01 mm 调整量',
    level: 0.02,     // mm/m
    isolator: '丁腈橡胶 · 5 mm',
    housing: 'HT150 · 壁厚 10 mm',
  },
  precision: {
    uc: 6.5,
    ucp: 4.8,
    U: 9.6,
    margin: 20, // %
    errors: [
      { name: '定位重复性', u: 4.5, dist: '正态' },
      { name: '导轨直线度', u: 2.5, dist: '正态' },
      { name: '运动平稳性（爬行振动）', u: 2.0, dist: '正态' },
      { name: '导轨与传感器基准平行度', u: 1.2, dist: '均匀' },
      { name: '传动回差', u: 0.8, dist: '均匀' },
      { name: '换向定位误差', u: 1.8, dist: '正态' },
      { name: '误差传递线性度', u: 0.8, dist: '均匀' },
      { name: '测杆受力变形', u: 1.2, dist: '正态' },
      { name: '机构滞后', u: 0.4, dist: '正态' },
      { name: '温度变形', u: 1.8, dist: '均匀' },
    ],
    contributions: [
      { key: 'positioning', label: '定位重复性', value: 32 },
      { key: 'straightness', label: '导轨直线度', value: 10 },
      { key: 'motion', label: '运动平稳性', value: 6 },
      { key: 'others', label: '其余 7 项', value: 52 },
    ],
  },
};

/* Presentation layout constants: not measurement data. */
export const LAYOUT = {
  gear: {
    tipR: 2100,
    rootR: 2038,
    pitchR: 2065,
    webOuterR: 1970,
    innerR: 1320,
    topY: 160,
    webTopY: 142,
    toothCount: 8,
    toothPitchDeg: 360 / 98,
    sectorStartDeg: -28.6,
    sectorEndDeg: 2.1,
    gapAlignDeg: -9.4694,
    bodySegments: 88,
    toothLayers: 9,
  },
  instrument: {
    baseW: 400,
    baseH: 80,
    baseD: 300,
    baseBottomY: 20,
    baseTopY: 100,
    columnZ: 72,
    columnSize: 60,
    columnTopY: 360,
    armY: 336,
    armW: 76,
    armH: 30,
    armFrontZ: -188,
    rotorZ: -215,     // in X carriage coordinates
    rotorY: 246,
    gearTopY: 160,
    rubyY: 150,
    scanCenterS: 17.5,
    xCarriageOriginZ: 35,
    xCoarseMeasurement: 60,
    xCoarseIdle: 34,
    ballSpan: 129.44,
    rootWorld: [120, 0, 80],
    yawDeg: 15,
  },
  camera: {
    fov: 33,
    near: 18,
    far: 12000,
    defaultPos: [850, 620, 1250],
    defaultTarget: [-330, 190, -360],
  },
  colors: COLORS,
};

export const FSM_LABELS = {
  idle: '待机',
  positioning: '定位中',
  approach: '进给中',
  scanning: '扫描中',
  retract: '退回中',
  reversing: '换向中',
  paused: '已暂停',
  done: '完成',
};

export const STEPS = [
  { key: 'position', label: '定位', states: ['positioning'] },
  { key: 'approach', label: '进给', states: ['approach'] },
  { key: 'scan', label: '扫描', states: ['scanning'] },
  { key: 'retract', label: '退回', states: ['retract'] },
  { key: 'reverse', label: '换向', states: ['reversing'] },
  { key: 'done', label: '完成', states: ['done'] },
];

/* Catalogue shown when a 3D part is selected. */
export const PARTS = {
  gear: {
    code: 'WORKPIECE / 01',
    name: '大型人字齿轮扇段',
    desc: '被测对象为巨型人字齿轮扇段。外廓尺度按任务书 Φ4200 mm 展陈；测量计算遵循任务书表 1 的齿制参数。',
    specs: [
      ['齿数 Z', '98'],
      ['法向模数 mn', '8 mm'],
      ['压力角 αn', '20°'],
      ['螺旋角 β', '28°21′27″'],
      ['分度圆 d', '≈ 890.9 mm'],
      ['齿形公差 ff', '0.045 mm'],
      ['齿圈跳动 Fr', '0.112 mm'],
      ['精度', '4 级'],
    ],
  },
  base: {
    code: 'SUPPORT / BASE',
    name: 'HT200 铸铁底座',
    desc: '三点调平支撑的箱式铸铁底座，十字加强筋与磨削上平面共同构成整机刚度基准。',
    specs: [
      ['外形', '400 × 300 × 80 mm'],
      ['材料', 'HT200 灰铸铁'],
      ['壁厚', '10 mm'],
      ['上平面平面度', '≤ 0.01 mm'],
      ['质量', '≈ 12 kg'],
      ['调平', '3 × M16，±5 mm'],
      ['水平度', '≤ 0.02 mm/m'],
      ['隔振', '丁腈橡胶 5 mm'],
    ],
  },
  column: {
    code: 'SUPPORT / COLUMN',
    name: '阳极氧化立柱与悬臂',
    desc: '6061-T6 方管立柱与 L 形悬臂组成的旁置式悬臂结构，悬臂端在 3 kg 载荷下挠度约 2 μm。',
    specs: [
      ['立柱', '60 × 60 × 5 mm'],
      ['立柱高', '250 mm'],
      ['悬臂长', '200 mm'],
      ['材料', '6061-T6'],
      ['端部挠度 @3kg', '2.0 μm'],
      ['允许值', '5.0 μm'],
      ['整机质量', '≈ 25 kg'],
    ],
  },
  dualBall: {
    code: 'DATUM / A–B',
    name: '双定位球基准组',
    desc: '主定位球 A 固定基准，副定位球 B 由预紧弹簧浮动自适应。两球嵌入两组齿槽，抵消齿圈安装偏心对测量基准的影响。',
    specs: [
      ['球直径 D', '16 mm（12–19）'],
      ['两球心距 W', '258.88 mm'],
      ['跨齿数 k', '11'],
      ['材料', 'GCr15 · HRC 60–64'],
      ['圆度', '≤ 0.5 μm'],
      ['表面粗糙度', 'Ra ≤ 0.1 μm'],
      ['A 臂', '6061-T6 · 129 mm'],
      ['B 臂', '40 mm · 预紧弹簧 2 N/mm'],
    ],
  },
  ballA: {
    code: 'DATUM / A',
    name: '主定位球 A · 固定基准',
    desc: '固定基准球，由 M6 微分筒微调至齿槽接触后锁紧；微分筒分度值 0.01 mm，行程 10 mm。',
    specs: [
      ['球径', '16 mm'],
      ['材质', 'GCr15 · 镜面淬火'],
      ['圆度', '≤ 0.5 μm'],
      ['调整机构', 'M6 微分筒'],
      ['分度值', '0.01 mm'],
      ['行程', '10 mm'],
      ['安装', 'M4 快拆'],
    ],
  },
  ballB: {
    code: 'DATUM / B',
    name: '副定位球 B · 弹簧浮动',
    desc: '浮动副基准，通过迷你直线导轨与预紧弹簧自适应贴入相邻齿槽；装配时弹簧压缩量可见。',
    specs: [
      ['球径', '16 mm'],
      ['臂长', '40 mm'],
      ['材质', '6061-T6 臂 + GCr15 球'],
      ['弹簧刚度', '2 N/mm'],
      ['预紧力', '5 N'],
      ['导向', '迷你直线导轨'],
      ['功能', '抵消 Fr = 0.112 mm'],
    ],
  },
  armA: {
    code: 'LOCATOR / ARM A',
    name: 'A 定位臂与 M6 微分筒',
    desc: '固定基准侧定位臂，6061-T6 矩形截面，微分筒带动主定位球做 0.01 mm 级微调。',
    specs: [
      ['截面', '20 × 30 mm'],
      ['臂长', '129 mm'],
      ['材料', '6061-T6'],
      ['微分筒', 'M6 · 0.01 mm'],
      ['行程', '10 mm'],
      ['锁紧', '侧向锁紧螺钉'],
      ['球座', 'M4 螺纹快拆'],
    ],
  },
  armB: {
    code: 'LOCATOR / ARM B',
    name: 'B 浮动定位臂',
    desc: '副定位臂随齿槽实际位置浮动，压缩弹簧吸收齿圈偏心与安装误差。',
    specs: [
      ['臂长', '40 mm'],
      ['材料', '6061-T6'],
      ['导向', '迷你直线导轨'],
      ['弹簧刚度', '2 N/mm'],
      ['预紧', '5 N'],
      ['行程', '自适应浮动'],
      ['球座', 'M4 快拆'],
    ],
  },
  motor: {
    code: 'DRIVE / M',
    name: '两相混合式步进电机',
    desc: '42 机座步进电机经弹性膜片联轴器直驱 C3 滚珠丝杆。保持扭矩 0.4 N·m，静态驱动需求 0.0265 N·m。',
    specs: [
      ['型号', 'N85BYGH450A-04'],
      ['保持扭矩', '0.4 N·m'],
      ['需求扭矩', '0.0265 N·m'],
      ['裕度', '3–5 ×'],
      ['细分', '16'],
      ['单步位移', '1.5625 μm'],
      ['转速', 'v × 12 RPM'],
    ],
  },
  coupling: {
    code: 'DRIVE / CPL',
    name: '弹性膜片联轴器',
    desc: '不锈钢膜片组补偿电机与丝杆的微小同轴误差，同时保持足够的扭转刚度。',
    specs: [
      ['类型', '弹性膜片联轴器'],
      ['公称扭矩', '1.5 N·m'],
      ['扭转刚度', '≥ 50 N·m/rad'],
      ['安装同轴度', '≤ 0.05 mm'],
      ['连接', '电机 → 丝杆'],
      ['膜片', '不锈钢多片'],
    ],
  },
  screw: {
    code: 'DRIVE / BSC',
    name: 'C3 滚珠丝杆',
    desc: 'φ16、导程 5 mm 的精密滚珠丝杆，双螺母预紧，一端固定一端游动，把电机转角转换为滑台直线位移。',
    specs: [
      ['规格', 'φ16 × 5 mm'],
      ['精度', 'C3'],
      ['预紧', '双螺母，残余回差 < 0.5 μm'],
      ['轴向刚度', '≈ 117800 N/mm'],
      ['30 N 变形', '0.25 μm'],
      ['允许变形', '1.0 μm'],
      ['支撑', '7000C 角接触 / 游动端'],
    ],
  },
  rail: {
    code: 'DRIVE / RAIL',
    name: 'P4 精密直线导轨',
    desc: 'Y 轴主运动采用 P4 级精密滚动直线导轨，双滑块轻预紧；导轨与位移传感器基准的平行度全程受控。',
    specs: [
      ['精度', 'P4'],
      ['规格', '宽 25 × 长 320 mm'],
      ['滑块', '2 个，轻预紧'],
      ['有效行程', '160 mm'],
      ['中点挠度', '0.48 μm'],
      ['允许值', '1.5 μm'],
      ['平行度', '≤ 1.5 μm'],
    ],
  },
  stage: {
    code: 'DRIVE / STAGE',
    name: 'Y 轴滑台与端板',
    desc: '滑台由滚珠丝杆螺母驱动，沿 P4 导轨作进给与扫描运动；端板内含固定端角接触轴承对。',
    specs: [
      ['驱动', 'φ16 × 5 滚珠丝杆'],
      ['导向', 'P4 直线导轨'],
      ['坐标', 's = y – y₀'],
      ['单步', '1.5625 μm'],
      ['速度', '0.5–5 mm/s'],
      ['行程', '35 mm 扫描'],
      ['固定端', '7000C 角接触球轴承'],
    ],
  },
  xslide: {
    code: 'ADJUST / X',
    name: 'X 轴燕尾滑台',
    desc: '20Cr 渗碳淬火燕尾导轨，滑动面刮研，镶条调隙，用于测量前 0–80 mm 的粗定位。',
    specs: [
      ['型式', '燕尾槽滑动导轨'],
      ['材料', '20Cr 渗碳淬火'],
      ['硬度', 'HRC 58–62'],
      ['接触面', '刮研 ≥ 12 点/cm²'],
      ['定导轨', '160 mm'],
      ['动导轨', '80 mm'],
      ['行程', '80 mm'],
    ],
  },
  ruby: {
    code: 'TRANSFER / RUBY',
    name: '红宝石测球',
    desc: 'φ3 mm 红宝石测球接触齿面，是整个误差传递链的起点。深红色球体是全模型唯一的高饱和实体。',
    specs: [
      ['球径', 'φ3 mm'],
      ['材料', '红宝石'],
      ['硬度', 'HRA ≥ 88'],
      ['安装', 'M2.5 快换'],
      ['测量范围', '±0.1 mm'],
      ['测量力', '0.1–0.5 N 可调'],
    ],
  },
  stylus: {
    code: 'TRANSFER / STYLUS',
    name: '钨钢测杆',
    desc: '直径 φ3 mm 的钨钢测杆，悬伸 35 mm。0.2 N 测力下悬臂挠度约 1.2 μm，小于允许值 1.5 μm。',
    specs: [
      ['测杆直径', 'φ3 mm'],
      ['材料', '钨钢'],
      ['弹性模量', '600 GPa'],
      ['悬伸', '35 mm'],
      ['总长', '50 mm'],
      ['悬臂挠度 @0.2N', '1.2 μm'],
      ['允许值', '1.5 μm'],
      ['表面', 'Ra ≤ 0.4 μm'],
    ],
  },
  lever: {
    code: 'TRANSFER / LEVER',
    name: '2A12 精密杠杆',
    desc: '杠杆把测头端的微米位移放大 3 倍后传至 LVDT。测头端与传感器端力臂 45 / 15 mm，孔距与平行度受控。',
    specs: [
      ['材料', '2A12 硬铝'],
      ['截面', '10 × 6 mm'],
      ['总长', '60 mm'],
      ['杠杆比', '3 : 1'],
      ['L1 / L2', '45 / 15 mm'],
      ['孔距公差', '±0.02 mm'],
      ['平行度', '≤ 0.008 mm'],
      ['传感器端位移', '3δ'],
    ],
  },
  flexure: {
    code: 'TRANSFER / FLEXURE',
    name: '单片簧铰链',
    desc: '锡磷青铜单片簧作为无回差回转铰链。工作角 ±2° 处于小变形线性区，寿命不少于 10⁶ 次。',
    specs: [
      ['材料', 'QSn6.5-0.1'],
      ['尺寸', '15 × 8 × 0.4 mm'],
      ['回转刚度', '2.6 N·mm/rad'],
      ['工作角', '±2° 小变形线性区'],
      ['寿命', '≥ 10⁶ 次'],
      ['限位', 'PTFE · 杠杆 ±5°'],
    ],
  },
  spring: {
    code: 'TRANSFER / PRELOAD',
    name: '预紧弹簧',
    desc: '预紧弹簧使杠杆与测球保持在稳定接触状态，测力在 0.1–0.5 N 范围内可调。',
    specs: [
      ['材料', '65Mn 钢丝'],
      ['线径', 'φ0.4 mm'],
      ['中径', '4 mm'],
      ['圈数', '8'],
      ['刚度', '≈ 0.5 N/mm'],
      ['预紧力', '0.1–0.5 N'],
      ['作用', '保持测球贴齿'],
    ],
  },
  lvdt: {
    code: 'TRANSFER / LVDT',
    name: 'LVDT 位移传感器',
    desc: '线性可变差动变压器接收杠杆放大的 3δ 位移，将微米级机械位移转换为电信号。',
    specs: [
      ['类型', 'LVDT'],
      ['输入位移', '3δ'],
      ['测头量程', '±0.1 mm'],
      ['壳体', '不锈钢圆柱壳'],
      ['顶杆', '精密导向'],
      ['安装', '径向可调支架'],
    ],
  },
  bearing: {
    code: 'REVERSAL / BRG',
    name: '交叉滚子轴承',
    desc: '误差传递机构整体绕垂直轴回转，交叉滚子轴承提供高刚性、低晃动的回转基准，回转精度 ≤ 0.005 mm。',
    specs: [
      ['型式', '交叉滚子轴承'],
      ['内径 / 外径', '30 / 55 mm'],
      ['回转精度', '≤ 0.005 mm'],
      ['换向角', '±22.45°'],
      ['角度精度', '±0.05°'],
      ['换向重复性', '≤ 2.0 μm'],
      ['锁紧', 'φ4 定位销 H7/h6'],
    ],
  },
  reversalPin: {
    code: 'REVERSAL / PIN',
    name: 'φ4 精密定位销',
    desc: '换向到位后，φ4 精密定位销插入锁紧，消除测量力作用下的角位移。',
    specs: [
      ['直径', 'φ4 mm'],
      ['配合', 'H7/h6'],
      ['作用', '换向到位锁紧'],
      ['锁紧后角位移', '0'],
      ['换向时间', '≤ 10 s'],
      ['驱动', 'M4 微分筒 → 齿条齿轮'],
    ],
  },
  rack: {
    code: 'REVERSAL / RACK',
    name: '齿条齿轮换向驱动',
    desc: 'M4 微分筒驱动 m=0.5、Z=40 齿条齿轮，使误差传递机构平稳回转至目标齿面法线。',
    specs: [
      ['模数 m', '0.5'],
      ['齿数 Z', '40'],
      ['驱动', 'M4 微分筒'],
      ['角度范围', '±22.45°'],
      ['角度精度', '±0.05°'],
      ['测头端偏差', '≈ ±0.5 μm'],
    ],
  },
  emergencyStop: {
    code: 'SAFETY / E-STOP',
    name: '急停按钮',
    desc: '运行中按下可立即停止测量流程并保持当前机构状态。物理按钮采用 RAL2004 橙红色蘑菇头。',
    specs: [
      ['颜色', 'RAL2004 橙红'],
      ['动作', '急停 / 保持'],
      ['复位', '旋起复位'],
      ['联锁', '电机驱动禁用'],
      ['位置', '箱体前右侧'],
    ],
  },
  controlBox: {
    code: 'ELECTRICAL / BOX',
    name: 'HT150 控制箱',
    desc: 'HT150 铸铁薄壁箱体，内置驱动与信号调理单元，前窗可见状态指示及急停按钮。',
    specs: [
      ['材料', 'HT150 灰铸铁'],
      ['壁厚', '10 mm'],
      ['观察窗', '深色钢化玻璃'],
      ['状态灯', '待机青 / 运行琥珀 / 超差红'],
      ['急停', 'RAL2004 橙红'],
      ['走线', '防水格兰头'],
    ],
  },
};

export const PART_NAMES = Object.fromEntries(Object.entries(PARTS).map(([k, v]) => [k, v.name]));
