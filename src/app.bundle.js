var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config.js
var TAU, DEG, COLORS, CFG, LAYOUT, STEPS, PARTS, PART_NAMES;
var init_config = __esm({
  "src/config.js"() {
    TAU = Math.PI * 2;
    DEG = Math.PI / 180;
    COLORS = {
      bg: 16054009,
      floor: 15330803,
      cyan: 947344,
      amber: 11094795,
      green: 1342010,
      red: 11805464,
      yellow: 8413716,
      steel: 8885153,
      glass: 4218991
    };
    CFG = {
      units: { scene: "mm", display: "mm / \u03BCm / N / RPM" },
      gear: {
        Z: 98,
        mn: 8,
        alphaN: 20 * DEG,
        betaDeg: 28 + 21 / 60 + 27 / 3600,
        // 28.3575°
        beta: (28 + 21 / 60 + 27 / 3600) * DEG,
        x: 0,
        grade: "4\u7EA7\uFF08JB197-83 887HK\uFF09",
        D: 4200,
        d: 890.9,
        a: 550,
        ff: 0.045,
        // mm
        Fr: 0.112,
        // mm
        fpb: 0.032,
        // mm (±)
        Fbeta: 0.02,
        // mm
        rb: 368.36,
        // mm, 说明书口径
        rbExact: 411.6,
        // mm, (d/2)·cos αt, 仅折叠备注
        k: 11,
        W: 258.88,
        // mm
        ballD: 16
        // mm
      },
      scan: {
        length: 35,
        // mm
        defaultSpeed: 2,
        // mm/s, teaching setting
        minSpeed: 0.5,
        maxSpeed: 5,
        defaultSamples: 60,
        minSamples: 20,
        maxSamples: 120,
        lineError: 0.2
        // μm, software compensated
      },
      machine: {
        U: 9.6,
        // μm, k=2
        Ulimit: 12,
        mass: 25,
        // kg
        massLimit: 30,
        costLimit: 8e3,
        envelope: "\u2264 500 \xD7 400 \xD7 400 mm",
        stroke: 160,
        // Y rail stroke
        scanStroke: 35,
        straightness: 3,
        // μm / 300 mm
        reverse: 2,
        // μm
        forceMin: 0.1,
        forceMax: 0.5
      },
      drive: {
        screwPitch: 5,
        screwDia: 16,
        screwGrade: "C3",
        microsteps: 16,
        motorSteps: 200,
        stepUm: 5 / (200 * 16) * 1e3,
        // 1.5625 μm
        motorModel: "N85BYGH450A-04",
        holdTorque: 0.4,
        requiredTorque: 0.0265,
        coupling: "\u5F39\u6027\u819C\u7247\u8054\u8F74\u5668",
        couplingTorque: 1.5,
        screwStiffness: 117800,
        // N/mm
        screw30NDef: 0.25,
        // μm
        railMidDef: 0.48,
        // μm
        railMidAllow: 1.5
      },
      locator: {
        ballD: 16,
        ballRange: "12\u201319 mm",
        ballSet: "12 / 16 / 20 mm",
        roundness: 0.5,
        // μm
        Ra: 0.1,
        // μm
        material: "GCr15 \u8F74\u627F\u94A2 \xB7 HRC 60\u201364",
        armA: 129,
        armB: 40,
        micrometer: "M6 \xB7 0.01 mm/div \xB7 10 mm",
        springK: 2,
        // N/mm
        springPreload: 5
        // N
      },
      stylus: {
        ballD: 3,
        ballMaterial: "\u7EA2\u5B9D\u77F3 \xB7 HRA \u2265 88",
        rodMaterial: "\u94A8\u94A2",
        E: 600,
        // GPa
        rodD: 3,
        extension: 35,
        totalLength: 50,
        deflection: 1.2,
        // μm @0.2N
        deflectionAllow: 1.5
      },
      lever: {
        material: "2A12 \u786C\u94DD",
        section: "10 \xD7 6 mm",
        length: 60,
        ratio: 3,
        L1: 45,
        L2: 15,
        holeTolerance: "\xB10.02 mm",
        parallelism: 8e-3
      },
      flexure: {
        material: "QSn6.5-0.1 \u9521\u78F7\u9752\u94DC",
        size: "15 \xD7 8 \xD7 0.4 mm",
        kAlpha: 2.6,
        // N·mm/rad
        angleRange: 2,
        // ±°
        life: "\u2265 10\u2076 \u6B21",
        limitAngle: 5
        // ±°
      },
      reversal: {
        angle: 22.45,
        // ±° (≈ αt)
        repeat: 2,
        // μm
        angularAccuracy: 0.05,
        time: 10,
        // s
        bearing: "\u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F \u03C630 / \u03C655",
        runout: 5e-3,
        base: "7075-T6 \xB7 12 mm",
        pin: "\u03C64 \u7CBE\u5BC6\u5B9A\u4F4D\u9500 H7/h6"
      },
      support: {
        base: "HT200 \u7070\u94F8\u94C1 \xB7 400 \xD7 300 \xD7 80 mm",
        baseMass: 12,
        column: "6061-T6 \u65B9\u7BA1 60 \xD7 60 \xD7 5 \xB7 \u9AD8 250 mm",
        arm: "6061-T6 \xB7 \u957F 200 mm",
        armDeflection: 2,
        armDeflectionAllow: 5,
        feet: "3 \xD7 M16 \xB7 \xB15 mm \xB7 0.01 mm \u8C03\u6574\u91CF",
        level: 0.02,
        // mm/m
        isolator: "\u4E01\u8148\u6A61\u80F6 \xB7 5 mm",
        housing: "HT150 \xB7 \u58C1\u539A 10 mm"
      },
      precision: {
        uc: 6.5,
        ucp: 4.8,
        U: 9.6,
        margin: 20,
        // %
        errors: [
          { name: "\u5B9A\u4F4D\u91CD\u590D\u6027", u: 4.5, dist: "\u6B63\u6001" },
          { name: "\u5BFC\u8F68\u76F4\u7EBF\u5EA6", u: 2.5, dist: "\u6B63\u6001" },
          { name: "\u8FD0\u52A8\u5E73\u7A33\u6027\uFF08\u722C\u884C\u632F\u52A8\uFF09", u: 2, dist: "\u6B63\u6001" },
          { name: "\u5BFC\u8F68\u4E0E\u4F20\u611F\u5668\u57FA\u51C6\u5E73\u884C\u5EA6", u: 1.2, dist: "\u5747\u5300" },
          { name: "\u4F20\u52A8\u56DE\u5DEE", u: 0.8, dist: "\u5747\u5300" },
          { name: "\u6362\u5411\u5B9A\u4F4D\u8BEF\u5DEE", u: 1.8, dist: "\u6B63\u6001" },
          { name: "\u8BEF\u5DEE\u4F20\u9012\u7EBF\u6027\u5EA6", u: 0.8, dist: "\u5747\u5300" },
          { name: "\u6D4B\u6746\u53D7\u529B\u53D8\u5F62", u: 1.2, dist: "\u6B63\u6001" },
          { name: "\u673A\u6784\u6EDE\u540E", u: 0.4, dist: "\u6B63\u6001" },
          { name: "\u6E29\u5EA6\u53D8\u5F62", u: 1.8, dist: "\u5747\u5300" }
        ],
        contributions: [
          { key: "positioning", label: "\u5B9A\u4F4D\u91CD\u590D\u6027", value: 32 },
          { key: "straightness", label: "\u5BFC\u8F68\u76F4\u7EBF\u5EA6", value: 10 },
          { key: "motion", label: "\u8FD0\u52A8\u5E73\u7A33\u6027", value: 6 },
          { key: "others", label: "\u5176\u4F59 7 \u9879", value: 52 }
        ]
      }
    };
    LAYOUT = {
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
        toothLayers: 9
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
        rotorZ: -215,
        // in X carriage coordinates
        rotorY: 246,
        gearTopY: 160,
        rubyY: 160,
        // probe-contact plane; samples ride on the gear face
        scanCenterS: 17.5,
        xCarriageOriginZ: 35,
        xCoarseMeasurement: 60,
        xCoarseIdle: 34,
        ballSpan: 129.44,
        rootWorld: [120, 0, 80],
        yawDeg: 15
      },
      camera: {
        fov: 33,
        near: 18,
        far: 12e3,
        defaultPos: [850, 620, 1250],
        defaultTarget: [-330, 190, -360]
      },
      colors: COLORS
    };
    STEPS = [
      { key: "position", label: "\u5B9A\u4F4D", states: ["positioning"] },
      { key: "approach", label: "\u8FDB\u7ED9", states: ["approach"] },
      { key: "scan", label: "\u626B\u63CF", states: ["scanning"] },
      { key: "retract", label: "\u9000\u56DE", states: ["retract"] },
      { key: "reverse", label: "\u6362\u5411", states: ["reversing"] },
      { key: "done", label: "\u5B8C\u6210", states: ["done"] }
    ];
    PARTS = {
      gear: {
        code: "WORKPIECE / 01",
        name: "\u5927\u578B\u4EBA\u5B57\u9F7F\u8F6E\u6247\u6BB5",
        desc: "\u88AB\u6D4B\u5BF9\u8C61\u4E3A\u5DE8\u578B\u4EBA\u5B57\u9F7F\u8F6E\u6247\u6BB5\u3002\u5916\u5ED3\u5C3A\u5EA6\u6309\u4EFB\u52A1\u4E66 \u03A64200 mm \u5C55\u9648\uFF1B\u6D4B\u91CF\u8BA1\u7B97\u9075\u5FAA\u4EFB\u52A1\u4E66\u8868 1 \u7684\u9F7F\u5236\u53C2\u6570\u3002",
        specs: [
          ["\u9F7F\u6570 Z", "98"],
          ["\u6CD5\u5411\u6A21\u6570 mn", "8 mm"],
          ["\u538B\u529B\u89D2 \u03B1n", "20\xB0"],
          ["\u87BA\u65CB\u89D2 \u03B2", "28\xB021\u203227\u2033"],
          ["\u5206\u5EA6\u5706 d", "\u2248 890.9 mm"],
          ["\u9F7F\u5F62\u516C\u5DEE ff", "0.045 mm"],
          ["\u9F7F\u5708\u8DF3\u52A8 Fr", "0.112 mm"],
          ["\u7CBE\u5EA6", "4 \u7EA7"]
        ]
      },
      base: {
        code: "SUPPORT / BASE",
        name: "HT200 \u94F8\u94C1\u5E95\u5EA7",
        desc: "\u4E09\u70B9\u8C03\u5E73\u652F\u6491\u7684\u7BB1\u5F0F\u94F8\u94C1\u5E95\u5EA7\uFF0C\u5341\u5B57\u52A0\u5F3A\u7B4B\u4E0E\u78E8\u524A\u4E0A\u5E73\u9762\u5171\u540C\u6784\u6210\u6574\u673A\u521A\u5EA6\u57FA\u51C6\u3002",
        specs: [
          ["\u5916\u5F62", "400 \xD7 300 \xD7 80 mm"],
          ["\u6750\u6599", "HT200 \u7070\u94F8\u94C1"],
          ["\u58C1\u539A", "10 mm"],
          ["\u4E0A\u5E73\u9762\u5E73\u9762\u5EA6", "\u2264 0.01 mm"],
          ["\u8D28\u91CF", "\u2248 12 kg"],
          ["\u8C03\u5E73", "3 \xD7 M16\uFF0C\xB15 mm"],
          ["\u6C34\u5E73\u5EA6", "\u2264 0.02 mm/m"],
          ["\u9694\u632F", "\u4E01\u8148\u6A61\u80F6 5 mm"]
        ]
      },
      column: {
        code: "SUPPORT / COLUMN",
        name: "\u9633\u6781\u6C27\u5316\u7ACB\u67F1\u4E0E\u60AC\u81C2",
        desc: "6061-T6 \u65B9\u7BA1\u7ACB\u67F1\u4E0E L \u5F62\u60AC\u81C2\u7EC4\u6210\u7684\u65C1\u7F6E\u5F0F\u60AC\u81C2\u7ED3\u6784\uFF0C\u60AC\u81C2\u7AEF\u5728 3 kg \u8F7D\u8377\u4E0B\u6320\u5EA6\u7EA6 2 \u03BCm\u3002",
        specs: [
          ["\u7ACB\u67F1", "60 \xD7 60 \xD7 5 mm"],
          ["\u7ACB\u67F1\u9AD8", "250 mm"],
          ["\u60AC\u81C2\u957F", "200 mm"],
          ["\u6750\u6599", "6061-T6"],
          ["\u7AEF\u90E8\u6320\u5EA6 @3kg", "2.0 \u03BCm"],
          ["\u5141\u8BB8\u503C", "5.0 \u03BCm"],
          ["\u6574\u673A\u8D28\u91CF", "\u2248 25 kg"]
        ]
      },
      dualBall: {
        code: "DATUM / A\u2013B",
        name: "\u53CC\u5B9A\u4F4D\u7403\u57FA\u51C6\u7EC4",
        desc: "\u4E3B\u5B9A\u4F4D\u7403 A \u56FA\u5B9A\u57FA\u51C6\uFF0C\u526F\u5B9A\u4F4D\u7403 B \u7531\u9884\u7D27\u5F39\u7C27\u6D6E\u52A8\u81EA\u9002\u5E94\u3002\u4E24\u7403\u5D4C\u5165\u4E24\u7EC4\u9F7F\u69FD\uFF0C\u62B5\u6D88\u9F7F\u5708\u5B89\u88C5\u504F\u5FC3\u5BF9\u6D4B\u91CF\u57FA\u51C6\u7684\u5F71\u54CD\u3002",
        specs: [
          ["\u7403\u76F4\u5F84 D", "16 mm\uFF0812\u201319\uFF09"],
          ["\u4E24\u7403\u5FC3\u8DDD W", "258.88 mm"],
          ["\u8DE8\u9F7F\u6570 k", "11"],
          ["\u6750\u6599", "GCr15 \xB7 HRC 60\u201364"],
          ["\u5706\u5EA6", "\u2264 0.5 \u03BCm"],
          ["\u8868\u9762\u7C97\u7CD9\u5EA6", "Ra \u2264 0.1 \u03BCm"],
          ["A \u81C2", "6061-T6 \xB7 129 mm"],
          ["B \u81C2", "40 mm \xB7 \u9884\u7D27\u5F39\u7C27 2 N/mm"]
        ]
      },
      ballA: {
        code: "DATUM / A",
        name: "\u4E3B\u5B9A\u4F4D\u7403 A \xB7 \u56FA\u5B9A\u57FA\u51C6",
        desc: "\u56FA\u5B9A\u57FA\u51C6\u7403\uFF0C\u7531 M6 \u5FAE\u5206\u7B52\u5FAE\u8C03\u81F3\u9F7F\u69FD\u63A5\u89E6\u540E\u9501\u7D27\uFF1B\u5FAE\u5206\u7B52\u5206\u5EA6\u503C 0.01 mm\uFF0C\u884C\u7A0B 10 mm\u3002",
        specs: [
          ["\u7403\u5F84", "16 mm"],
          ["\u6750\u8D28", "GCr15 \xB7 \u955C\u9762\u6DEC\u706B"],
          ["\u5706\u5EA6", "\u2264 0.5 \u03BCm"],
          ["\u8C03\u6574\u673A\u6784", "M6 \u5FAE\u5206\u7B52"],
          ["\u5206\u5EA6\u503C", "0.01 mm"],
          ["\u884C\u7A0B", "10 mm"],
          ["\u5B89\u88C5", "M4 \u5FEB\u62C6"]
        ]
      },
      ballB: {
        code: "DATUM / B",
        name: "\u526F\u5B9A\u4F4D\u7403 B \xB7 \u5F39\u7C27\u6D6E\u52A8",
        desc: "\u6D6E\u52A8\u526F\u57FA\u51C6\uFF0C\u901A\u8FC7\u8FF7\u4F60\u76F4\u7EBF\u5BFC\u8F68\u4E0E\u9884\u7D27\u5F39\u7C27\u81EA\u9002\u5E94\u8D34\u5165\u76F8\u90BB\u9F7F\u69FD\uFF1B\u88C5\u914D\u65F6\u5F39\u7C27\u538B\u7F29\u91CF\u53EF\u89C1\u3002",
        specs: [
          ["\u7403\u5F84", "16 mm"],
          ["\u81C2\u957F", "40 mm"],
          ["\u6750\u8D28", "6061-T6 \u81C2 + GCr15 \u7403"],
          ["\u5F39\u7C27\u521A\u5EA6", "2 N/mm"],
          ["\u9884\u7D27\u529B", "5 N"],
          ["\u5BFC\u5411", "\u8FF7\u4F60\u76F4\u7EBF\u5BFC\u8F68"],
          ["\u529F\u80FD", "\u62B5\u6D88 Fr = 0.112 mm"]
        ]
      },
      armA: {
        code: "LOCATOR / ARM A",
        name: "A \u5B9A\u4F4D\u81C2\u4E0E M6 \u5FAE\u5206\u7B52",
        desc: "\u56FA\u5B9A\u57FA\u51C6\u4FA7\u5B9A\u4F4D\u81C2\uFF0C6061-T6 \u77E9\u5F62\u622A\u9762\uFF0C\u5FAE\u5206\u7B52\u5E26\u52A8\u4E3B\u5B9A\u4F4D\u7403\u505A 0.01 mm \u7EA7\u5FAE\u8C03\u3002",
        specs: [
          ["\u622A\u9762", "20 \xD7 30 mm"],
          ["\u81C2\u957F", "129 mm"],
          ["\u6750\u6599", "6061-T6"],
          ["\u5FAE\u5206\u7B52", "M6 \xB7 0.01 mm"],
          ["\u884C\u7A0B", "10 mm"],
          ["\u9501\u7D27", "\u4FA7\u5411\u9501\u7D27\u87BA\u9489"],
          ["\u7403\u5EA7", "M4 \u87BA\u7EB9\u5FEB\u62C6"]
        ]
      },
      armB: {
        code: "LOCATOR / ARM B",
        name: "B \u6D6E\u52A8\u5B9A\u4F4D\u81C2",
        desc: "\u526F\u5B9A\u4F4D\u81C2\u968F\u9F7F\u69FD\u5B9E\u9645\u4F4D\u7F6E\u6D6E\u52A8\uFF0C\u538B\u7F29\u5F39\u7C27\u5438\u6536\u9F7F\u5708\u504F\u5FC3\u4E0E\u5B89\u88C5\u8BEF\u5DEE\u3002",
        specs: [
          ["\u81C2\u957F", "40 mm"],
          ["\u6750\u6599", "6061-T6"],
          ["\u5BFC\u5411", "\u8FF7\u4F60\u76F4\u7EBF\u5BFC\u8F68"],
          ["\u5F39\u7C27\u521A\u5EA6", "2 N/mm"],
          ["\u9884\u7D27", "5 N"],
          ["\u884C\u7A0B", "\u81EA\u9002\u5E94\u6D6E\u52A8"],
          ["\u7403\u5EA7", "M4 \u5FEB\u62C6"]
        ]
      },
      motor: {
        code: "DRIVE / M",
        name: "\u4E24\u76F8\u6DF7\u5408\u5F0F\u6B65\u8FDB\u7535\u673A",
        desc: "42 \u673A\u5EA7\u6B65\u8FDB\u7535\u673A\u7ECF\u5F39\u6027\u819C\u7247\u8054\u8F74\u5668\u76F4\u9A71 C3 \u6EDA\u73E0\u4E1D\u6746\u3002\u4FDD\u6301\u626D\u77E9 0.4 N\xB7m\uFF0C\u9759\u6001\u9A71\u52A8\u9700\u6C42 0.0265 N\xB7m\u3002",
        specs: [
          ["\u578B\u53F7", "N85BYGH450A-04"],
          ["\u4FDD\u6301\u626D\u77E9", "0.4 N\xB7m"],
          ["\u9700\u6C42\u626D\u77E9", "0.0265 N\xB7m"],
          ["\u88D5\u5EA6", "3\u20135 \xD7"],
          ["\u7EC6\u5206", "16"],
          ["\u5355\u6B65\u4F4D\u79FB", "1.5625 \u03BCm"],
          ["\u8F6C\u901F", "v \xD7 12 RPM"]
        ]
      },
      coupling: {
        code: "DRIVE / CPL",
        name: "\u5F39\u6027\u819C\u7247\u8054\u8F74\u5668",
        desc: "\u4E0D\u9508\u94A2\u819C\u7247\u7EC4\u8865\u507F\u7535\u673A\u4E0E\u4E1D\u6746\u7684\u5FAE\u5C0F\u540C\u8F74\u8BEF\u5DEE\uFF0C\u540C\u65F6\u4FDD\u6301\u8DB3\u591F\u7684\u626D\u8F6C\u521A\u5EA6\u3002",
        specs: [
          ["\u7C7B\u578B", "\u5F39\u6027\u819C\u7247\u8054\u8F74\u5668"],
          ["\u516C\u79F0\u626D\u77E9", "1.5 N\xB7m"],
          ["\u626D\u8F6C\u521A\u5EA6", "\u2265 50 N\xB7m/rad"],
          ["\u5B89\u88C5\u540C\u8F74\u5EA6", "\u2264 0.05 mm"],
          ["\u8FDE\u63A5", "\u7535\u673A \u2192 \u4E1D\u6746"],
          ["\u819C\u7247", "\u4E0D\u9508\u94A2\u591A\u7247"]
        ]
      },
      screw: {
        code: "DRIVE / BSC",
        name: "C3 \u6EDA\u73E0\u4E1D\u6746",
        desc: "\u03C616\u3001\u5BFC\u7A0B 5 mm \u7684\u7CBE\u5BC6\u6EDA\u73E0\u4E1D\u6746\uFF0C\u53CC\u87BA\u6BCD\u9884\u7D27\uFF0C\u4E00\u7AEF\u56FA\u5B9A\u4E00\u7AEF\u6E38\u52A8\uFF0C\u628A\u7535\u673A\u8F6C\u89D2\u8F6C\u6362\u4E3A\u6ED1\u53F0\u76F4\u7EBF\u4F4D\u79FB\u3002",
        specs: [
          ["\u89C4\u683C", "\u03C616 \xD7 5 mm"],
          ["\u7CBE\u5EA6", "C3"],
          ["\u9884\u7D27", "\u53CC\u87BA\u6BCD\uFF0C\u6B8B\u4F59\u56DE\u5DEE < 0.5 \u03BCm"],
          ["\u8F74\u5411\u521A\u5EA6", "\u2248 117800 N/mm"],
          ["30 N \u53D8\u5F62", "0.25 \u03BCm"],
          ["\u5141\u8BB8\u53D8\u5F62", "1.0 \u03BCm"],
          ["\u652F\u6491", "7000C \u89D2\u63A5\u89E6 / \u6E38\u52A8\u7AEF"]
        ]
      },
      rail: {
        code: "DRIVE / RAIL",
        name: "P4 \u7CBE\u5BC6\u76F4\u7EBF\u5BFC\u8F68",
        desc: "Y \u8F74\u4E3B\u8FD0\u52A8\u91C7\u7528 P4 \u7EA7\u7CBE\u5BC6\u6EDA\u52A8\u76F4\u7EBF\u5BFC\u8F68\uFF0C\u53CC\u6ED1\u5757\u8F7B\u9884\u7D27\uFF1B\u5BFC\u8F68\u4E0E\u4F4D\u79FB\u4F20\u611F\u5668\u57FA\u51C6\u7684\u5E73\u884C\u5EA6\u5168\u7A0B\u53D7\u63A7\u3002",
        specs: [
          ["\u7CBE\u5EA6", "P4"],
          ["\u89C4\u683C", "\u5BBD 25 \xD7 \u957F 320 mm"],
          ["\u6ED1\u5757", "2 \u4E2A\uFF0C\u8F7B\u9884\u7D27"],
          ["\u6709\u6548\u884C\u7A0B", "160 mm"],
          ["\u4E2D\u70B9\u6320\u5EA6", "0.48 \u03BCm"],
          ["\u5141\u8BB8\u503C", "1.5 \u03BCm"],
          ["\u5E73\u884C\u5EA6", "\u2264 1.5 \u03BCm"]
        ]
      },
      stage: {
        code: "DRIVE / STAGE",
        name: "Y \u8F74\u6ED1\u53F0\u4E0E\u7AEF\u677F",
        desc: "\u6ED1\u53F0\u7531\u6EDA\u73E0\u4E1D\u6746\u87BA\u6BCD\u9A71\u52A8\uFF0C\u6CBF P4 \u5BFC\u8F68\u4F5C\u8FDB\u7ED9\u4E0E\u626B\u63CF\u8FD0\u52A8\uFF1B\u7AEF\u677F\u5185\u542B\u56FA\u5B9A\u7AEF\u89D2\u63A5\u89E6\u8F74\u627F\u5BF9\u3002",
        specs: [
          ["\u9A71\u52A8", "\u03C616 \xD7 5 \u6EDA\u73E0\u4E1D\u6746"],
          ["\u5BFC\u5411", "P4 \u76F4\u7EBF\u5BFC\u8F68"],
          ["\u5750\u6807", "s = y \u2013 y\u2080"],
          ["\u5355\u6B65", "1.5625 \u03BCm"],
          ["\u901F\u5EA6", "0.5\u20135 mm/s"],
          ["\u884C\u7A0B", "35 mm \u626B\u63CF"],
          ["\u56FA\u5B9A\u7AEF", "7000C \u89D2\u63A5\u89E6\u7403\u8F74\u627F"]
        ]
      },
      xslide: {
        code: "ADJUST / X",
        name: "X \u8F74\u71D5\u5C3E\u6ED1\u53F0",
        desc: "20Cr \u6E17\u78B3\u6DEC\u706B\u71D5\u5C3E\u5BFC\u8F68\uFF0C\u6ED1\u52A8\u9762\u522E\u7814\uFF0C\u9576\u6761\u8C03\u9699\uFF0C\u7528\u4E8E\u6D4B\u91CF\u524D 0\u201380 mm \u7684\u7C97\u5B9A\u4F4D\u3002",
        specs: [
          ["\u578B\u5F0F", "\u71D5\u5C3E\u69FD\u6ED1\u52A8\u5BFC\u8F68"],
          ["\u6750\u6599", "20Cr \u6E17\u78B3\u6DEC\u706B"],
          ["\u786C\u5EA6", "HRC 58\u201362"],
          ["\u63A5\u89E6\u9762", "\u522E\u7814 \u2265 12 \u70B9/cm\xB2"],
          ["\u5B9A\u5BFC\u8F68", "160 mm"],
          ["\u52A8\u5BFC\u8F68", "80 mm"],
          ["\u884C\u7A0B", "80 mm"]
        ]
      },
      ruby: {
        code: "TRANSFER / RUBY",
        name: "\u7EA2\u5B9D\u77F3\u6D4B\u7403",
        desc: "\u03C63 mm \u7EA2\u5B9D\u77F3\u6D4B\u7403\u63A5\u89E6\u9F7F\u9762\uFF0C\u662F\u6574\u4E2A\u8BEF\u5DEE\u4F20\u9012\u94FE\u7684\u8D77\u70B9\u3002\u6DF1\u7EA2\u8272\u7403\u4F53\u662F\u5168\u6A21\u578B\u552F\u4E00\u7684\u9AD8\u9971\u548C\u5B9E\u4F53\u3002",
        specs: [
          ["\u7403\u5F84", "\u03C63 mm"],
          ["\u6750\u6599", "\u7EA2\u5B9D\u77F3"],
          ["\u786C\u5EA6", "HRA \u2265 88"],
          ["\u5B89\u88C5", "M2.5 \u5FEB\u6362"],
          ["\u6D4B\u91CF\u8303\u56F4", "\xB10.1 mm"],
          ["\u6D4B\u91CF\u529B", "0.1\u20130.5 N \u53EF\u8C03"]
        ]
      },
      stylus: {
        code: "TRANSFER / STYLUS",
        name: "\u94A8\u94A2\u6D4B\u6746",
        desc: "\u76F4\u5F84 \u03C63 mm \u7684\u94A8\u94A2\u6D4B\u6746\uFF0C\u60AC\u4F38 35 mm\u30020.2 N \u6D4B\u529B\u4E0B\u60AC\u81C2\u6320\u5EA6\u7EA6 1.2 \u03BCm\uFF0C\u5C0F\u4E8E\u5141\u8BB8\u503C 1.5 \u03BCm\u3002",
        specs: [
          ["\u6D4B\u6746\u76F4\u5F84", "\u03C63 mm"],
          ["\u6750\u6599", "\u94A8\u94A2"],
          ["\u5F39\u6027\u6A21\u91CF", "600 GPa"],
          ["\u60AC\u4F38", "35 mm"],
          ["\u603B\u957F", "50 mm"],
          ["\u60AC\u81C2\u6320\u5EA6 @0.2N", "1.2 \u03BCm"],
          ["\u5141\u8BB8\u503C", "1.5 \u03BCm"],
          ["\u8868\u9762", "Ra \u2264 0.4 \u03BCm"]
        ]
      },
      lever: {
        code: "TRANSFER / LEVER",
        name: "2A12 \u7CBE\u5BC6\u6760\u6746",
        desc: "\u6760\u6746\u628A\u6D4B\u5934\u7AEF\u7684\u5FAE\u7C73\u4F4D\u79FB\u653E\u5927 3 \u500D\u540E\u4F20\u81F3 LVDT\u3002\u6D4B\u5934\u7AEF\u4E0E\u4F20\u611F\u5668\u7AEF\u529B\u81C2 45 / 15 mm\uFF0C\u5B54\u8DDD\u4E0E\u5E73\u884C\u5EA6\u53D7\u63A7\u3002",
        specs: [
          ["\u6750\u6599", "2A12 \u786C\u94DD"],
          ["\u622A\u9762", "10 \xD7 6 mm"],
          ["\u603B\u957F", "60 mm"],
          ["\u6760\u6746\u6BD4", "3 : 1"],
          ["L1 / L2", "45 / 15 mm"],
          ["\u5B54\u8DDD\u516C\u5DEE", "\xB10.02 mm"],
          ["\u5E73\u884C\u5EA6", "\u2264 0.008 mm"],
          ["\u4F20\u611F\u5668\u7AEF\u4F4D\u79FB", "3\u03B4"]
        ]
      },
      flexure: {
        code: "TRANSFER / FLEXURE",
        name: "\u5355\u7247\u7C27\u94F0\u94FE",
        desc: "\u9521\u78F7\u9752\u94DC\u5355\u7247\u7C27\u4F5C\u4E3A\u65E0\u56DE\u5DEE\u56DE\u8F6C\u94F0\u94FE\u3002\u5DE5\u4F5C\u89D2 \xB12\xB0 \u5904\u4E8E\u5C0F\u53D8\u5F62\u7EBF\u6027\u533A\uFF0C\u5BFF\u547D\u4E0D\u5C11\u4E8E 10\u2076 \u6B21\u3002",
        specs: [
          ["\u6750\u6599", "QSn6.5-0.1"],
          ["\u5C3A\u5BF8", "15 \xD7 8 \xD7 0.4 mm"],
          ["\u56DE\u8F6C\u521A\u5EA6", "2.6 N\xB7mm/rad"],
          ["\u5DE5\u4F5C\u89D2", "\xB12\xB0 \u5C0F\u53D8\u5F62\u7EBF\u6027\u533A"],
          ["\u5BFF\u547D", "\u2265 10\u2076 \u6B21"],
          ["\u9650\u4F4D", "PTFE \xB7 \u6760\u6746 \xB15\xB0"]
        ]
      },
      spring: {
        code: "TRANSFER / PRELOAD",
        name: "\u9884\u7D27\u5F39\u7C27",
        desc: "\u9884\u7D27\u5F39\u7C27\u4F7F\u6760\u6746\u4E0E\u6D4B\u7403\u4FDD\u6301\u5728\u7A33\u5B9A\u63A5\u89E6\u72B6\u6001\uFF0C\u6D4B\u529B\u5728 0.1\u20130.5 N \u8303\u56F4\u5185\u53EF\u8C03\u3002",
        specs: [
          ["\u6750\u6599", "65Mn \u94A2\u4E1D"],
          ["\u7EBF\u5F84", "\u03C60.4 mm"],
          ["\u4E2D\u5F84", "4 mm"],
          ["\u5708\u6570", "8"],
          ["\u521A\u5EA6", "\u2248 0.5 N/mm"],
          ["\u9884\u7D27\u529B", "0.1\u20130.5 N"],
          ["\u4F5C\u7528", "\u4FDD\u6301\u6D4B\u7403\u8D34\u9F7F"]
        ]
      },
      lvdt: {
        code: "TRANSFER / LVDT",
        name: "LVDT \u4F4D\u79FB\u4F20\u611F\u5668",
        desc: "\u7EBF\u6027\u53EF\u53D8\u5DEE\u52A8\u53D8\u538B\u5668\u63A5\u6536\u6760\u6746\u653E\u5927\u7684 3\u03B4 \u4F4D\u79FB\uFF0C\u5C06\u5FAE\u7C73\u7EA7\u673A\u68B0\u4F4D\u79FB\u8F6C\u6362\u4E3A\u7535\u4FE1\u53F7\u3002",
        specs: [
          ["\u7C7B\u578B", "LVDT"],
          ["\u8F93\u5165\u4F4D\u79FB", "3\u03B4"],
          ["\u6D4B\u5934\u91CF\u7A0B", "\xB10.1 mm"],
          ["\u58F3\u4F53", "\u4E0D\u9508\u94A2\u5706\u67F1\u58F3"],
          ["\u9876\u6746", "\u7CBE\u5BC6\u5BFC\u5411"],
          ["\u5B89\u88C5", "\u5F84\u5411\u53EF\u8C03\u652F\u67B6"]
        ]
      },
      bearing: {
        code: "REVERSAL / BRG",
        name: "\u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F",
        desc: "\u8BEF\u5DEE\u4F20\u9012\u673A\u6784\u6574\u4F53\u7ED5\u5782\u76F4\u8F74\u56DE\u8F6C\uFF0C\u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F\u63D0\u4F9B\u9AD8\u521A\u6027\u3001\u4F4E\u6643\u52A8\u7684\u56DE\u8F6C\u57FA\u51C6\uFF0C\u56DE\u8F6C\u7CBE\u5EA6 \u2264 0.005 mm\u3002",
        specs: [
          ["\u578B\u5F0F", "\u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F"],
          ["\u5185\u5F84 / \u5916\u5F84", "30 / 55 mm"],
          ["\u56DE\u8F6C\u7CBE\u5EA6", "\u2264 0.005 mm"],
          ["\u6362\u5411\u89D2", "\xB122.45\xB0"],
          ["\u89D2\u5EA6\u7CBE\u5EA6", "\xB10.05\xB0"],
          ["\u6362\u5411\u91CD\u590D\u6027", "\u2264 2.0 \u03BCm"],
          ["\u9501\u7D27", "\u03C64 \u5B9A\u4F4D\u9500 H7/h6"]
        ]
      },
      reversalPin: {
        code: "REVERSAL / PIN",
        name: "\u03C64 \u7CBE\u5BC6\u5B9A\u4F4D\u9500",
        desc: "\u6362\u5411\u5230\u4F4D\u540E\uFF0C\u03C64 \u7CBE\u5BC6\u5B9A\u4F4D\u9500\u63D2\u5165\u9501\u7D27\uFF0C\u6D88\u9664\u6D4B\u91CF\u529B\u4F5C\u7528\u4E0B\u7684\u89D2\u4F4D\u79FB\u3002",
        specs: [
          ["\u76F4\u5F84", "\u03C64 mm"],
          ["\u914D\u5408", "H7/h6"],
          ["\u4F5C\u7528", "\u6362\u5411\u5230\u4F4D\u9501\u7D27"],
          ["\u9501\u7D27\u540E\u89D2\u4F4D\u79FB", "0"],
          ["\u6362\u5411\u65F6\u95F4", "\u2264 10 s"],
          ["\u9A71\u52A8", "M4 \u5FAE\u5206\u7B52 \u2192 \u9F7F\u6761\u9F7F\u8F6E"]
        ]
      },
      rack: {
        code: "REVERSAL / RACK",
        name: "\u9F7F\u6761\u9F7F\u8F6E\u6362\u5411\u9A71\u52A8",
        desc: "M4 \u5FAE\u5206\u7B52\u9A71\u52A8 m=0.5\u3001Z=40 \u9F7F\u6761\u9F7F\u8F6E\uFF0C\u4F7F\u8BEF\u5DEE\u4F20\u9012\u673A\u6784\u5E73\u7A33\u56DE\u8F6C\u81F3\u76EE\u6807\u9F7F\u9762\u6CD5\u7EBF\u3002",
        specs: [
          ["\u6A21\u6570 m", "0.5"],
          ["\u9F7F\u6570 Z", "40"],
          ["\u9A71\u52A8", "M4 \u5FAE\u5206\u7B52"],
          ["\u89D2\u5EA6\u8303\u56F4", "\xB122.45\xB0"],
          ["\u89D2\u5EA6\u7CBE\u5EA6", "\xB10.05\xB0"],
          ["\u6D4B\u5934\u7AEF\u504F\u5DEE", "\u2248 \xB10.5 \u03BCm"]
        ]
      },
      emergencyStop: {
        code: "SAFETY / E-STOP",
        name: "\u6025\u505C\u6309\u94AE",
        desc: "\u8FD0\u884C\u4E2D\u6309\u4E0B\u53EF\u7ACB\u5373\u505C\u6B62\u6D4B\u91CF\u6D41\u7A0B\u5E76\u4FDD\u6301\u5F53\u524D\u673A\u6784\u72B6\u6001\u3002\u7269\u7406\u6309\u94AE\u91C7\u7528 RAL2004 \u6A59\u7EA2\u8272\u8611\u83C7\u5934\u3002",
        specs: [
          ["\u989C\u8272", "RAL2004 \u6A59\u7EA2"],
          ["\u52A8\u4F5C", "\u6025\u505C / \u4FDD\u6301"],
          ["\u590D\u4F4D", "\u65CB\u8D77\u590D\u4F4D"],
          ["\u8054\u9501", "\u7535\u673A\u9A71\u52A8\u7981\u7528"],
          ["\u4F4D\u7F6E", "\u7BB1\u4F53\u524D\u53F3\u4FA7"]
        ]
      },
      controlBox: {
        code: "ELECTRICAL / BOX",
        name: "HT150 \u63A7\u5236\u7BB1",
        desc: "HT150 \u94F8\u94C1\u8584\u58C1\u7BB1\u4F53\uFF0C\u5185\u7F6E\u9A71\u52A8\u4E0E\u4FE1\u53F7\u8C03\u7406\u5355\u5143\uFF0C\u524D\u7A97\u53EF\u89C1\u72B6\u6001\u6307\u793A\u53CA\u6025\u505C\u6309\u94AE\u3002",
        specs: [
          ["\u6750\u6599", "HT150 \u7070\u94F8\u94C1"],
          ["\u58C1\u539A", "10 mm"],
          ["\u89C2\u5BDF\u7A97", "\u6DF1\u8272\u94A2\u5316\u73BB\u7483"],
          ["\u72B6\u6001\u706F", "\u5F85\u673A\u9752 / \u8FD0\u884C\u7425\u73C0 / \u8D85\u5DEE\u7EA2"],
          ["\u6025\u505C", "RAL2004 \u6A59\u7EA2"],
          ["\u8D70\u7EBF", "\u9632\u6C34\u683C\u5170\u5934"]
        ]
      }
    };
    PART_NAMES = Object.fromEntries(Object.entries(PARTS).map(([k, v]) => [k, v.name]));
  }
});

// src/utils.js
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function roundedBoxGeo(w, h, d, radius = 2, segments = 2) {
  const r = Math.min(radius, Math.abs(w) / 2 - 0.01, Math.abs(h) / 2 - 0.01, Math.abs(d) / 2 - 0.01);
  if (r <= 0.05) return new THREE.BoxGeometry(w, h, d);
  return new RoundedBoxGeometry(w, h, d, segments, r);
}
function makeMesh(geometry, material, parent, position, rotation, name) {
  const m = new THREE.Mesh(geometry, material);
  if (position) m.position.set(position[0], position[1], position[2]);
  if (rotation) m.rotation.set(rotation[0], rotation[1], rotation[2]);
  if (name) m.name = name;
  if (parent) parent.add(m);
  return m;
}
function box(w, h, d, mat, parent, pos, radius = 0, segments = 2, rot, name) {
  const geo = radius > 0.1 ? roundedBoxGeo(w, h, d, radius, segments) : new THREE.BoxGeometry(w, h, d);
  return makeMesh(geo, mat, parent, pos, rot, name);
}
function cylinder(rt, rb, h, mat, parent, pos, segments = 24, rot, openEnded = false, name) {
  const geo = new THREE.CylinderGeometry(rt, rb, h, segments, 1, openEnded);
  return makeMesh(geo, mat, parent, pos, rot, name);
}
function sphere(r, mat, parent, pos, segments = 24, name) {
  return makeMesh(new THREE.SphereGeometry(r, segments, Math.max(12, segments / 2)), mat, parent, pos, null, name);
}
function torus(r, tube, mat, parent, pos, rot, seg = 32, tubeSeg = 8, name) {
  return makeMesh(new THREE.TorusGeometry(r, tube, tubeSeg, seg), mat, parent, pos, rot, name);
}
function setShadows(root, cast = true, receive = true) {
  root.traverse((obj) => {
    if (!obj.isMesh && !obj.isInstancedMesh) return;
    if (obj.userData.noShadow) return;
    obj.castShadow = cast;
    obj.receiveShadow = receive;
  });
}
function tagPart(group, key) {
  group.traverse((o) => {
    if (o.isMesh || o.isInstancedMesh) {
      if (!o.userData.partKey) o.userData.partKey = key;
    }
  });
  group.userData.partKey = key;
}
function createCanvasTexture(w, h, draw, opts = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = opts.colorSpace ?? THREE.SRGBColorSpace;
  if (opts.linear) tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = opts.anisotropy ?? 4;
  if (opts.repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  tex.needsUpdate = true;
  return tex;
}
function makeNoiseTexture({ size = 256, base = 126, amp = 26, horizontal = false, seed = 1, blur = false } = {}) {
  const rand = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  let value = base;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (horizontal) {
        if (x === 0) value = base + (rand() - 0.5) * amp * 0.9;
        value = clamp(value + (rand() - 0.5) * 4, base - amp, base + amp);
      }
      let v = horizontal ? value : base + (rand() - 0.5) * amp;
      if (!horizontal && blur) {
        v = base + (rand() - 0.5) * amp * 0.4 + Math.sin(y * 0.19) * amp * 0.14 + Math.cos(x * 0.11) * amp * 0.12;
      }
      img.data[idx] = img.data[idx + 1] = img.data[idx + 2] = clamp(v, 0, 255);
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.lineWidth = 0.5 + rand();
    ctx.beginPath();
    if (horizontal) {
      const yy = rand() * size;
      ctx.moveTo(0, yy);
      ctx.lineTo(size, yy + (rand() - 0.5) * 2);
    } else {
      const xx = rand() * size, yy = rand() * size;
      ctx.arc(xx, yy, 4 + rand() * 22, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}
function makeCastTexture(size = 256, seed = 4) {
  const rand = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#8d8d8d";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 30 + (rand() > 0.985 ? 25 : 0);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = clamp(138 + n, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 32; i++) {
    ctx.strokeStyle = rand() > 0.5 ? "#fff" : "#222";
    ctx.lineWidth = 0.35 + rand() * 1.5;
    ctx.beginPath();
    const x = rand() * size, y = rand() * size;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + (rand() - 0.5) * 80, y + rand() * 35, x + rand() * 100, y + (rand() - 0.5) * 100, x + (rand() - 0.5) * 130, y + 45);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}
function makeFloorTexture(size = 512, seed = 7) {
  const rand = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grd = ctx.createRadialGradient(size * 0.37, size * 0.34, 0, size * 0.5, size * 0.5, size * 0.8);
  grd.addColorStop(0, "#F7F9FC");
  grd.addColorStop(0.45, "#EEF2F7");
  grd.addColorStop(1, "#E4EAF1");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 500; i++) {
    const x = rand() * size, y = rand() * size, r = rand() * 24 + 2;
    ctx.beginPath();
    ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.ellipse(x, y, r, r * (0.3 + rand()), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const y = rand() * size;
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (rand() - 0.5) * 4);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
function makeGlowTexture(size = 64, color = "#ffab5e", inner = "rgba(255,245,225,1)", mid = "rgba(255,171,94,.55)") {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.25, mid);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();
  }, { colorSpace: THREE.SRGBColorSpace });
}
function makeContactShadowTexture(size = 256, opacity = 0.72) {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, `rgba(0,0,0,${opacity})`);
    g.addColorStop(0.35, `rgba(0,0,0,${opacity * 0.7})`);
    g.addColorStop(0.7, `rgba(0,0,0,${opacity * 0.2})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, { colorSpace: THREE.SRGBColorSpace });
}
function makeTextTexture(lines, {
  width = 1024,
  height = 256,
  background = "transparent",
  color = "#dbe5ec",
  dim = "rgba(180,198,212,.62)",
  align = "left",
  font = "500",
  border = null,
  padding = 36
} = {}) {
  return createCanvasTexture(width, height, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
    }
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.strokeRect(3, 3, w - 6, h - 6);
    }
    const lineArray = Array.isArray(lines) ? lines : [{ text: lines }];
    const total = lineArray.length;
    const lineH = Math.min(58, (h - padding * 2) / Math.max(1, total));
    lineArray.forEach((line, i) => {
      const item = typeof line === "string" ? { text: line } : line;
      const size = item.size ?? (i === 0 ? 44 : 22);
      const weight = item.weight ?? (i === 0 ? 600 : 400);
      const family = item.mono === false ? "'Noto Sans SC','Microsoft YaHei',sans-serif" : "'SFMono-Regular','Cascadia Mono',Consolas,monospace";
      ctx.fillStyle = item.color ?? (i === 0 ? color : dim);
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.textAlign = item.align ?? align;
      ctx.textBaseline = "middle";
      const x = align === "center" ? w / 2 : align === "right" ? w - padding : padding;
      const y = padding + lineH * (i + 0.5);
      ctx.fillText(item.text, x, y);
      if (item.underline) {
        const m = ctx.measureText(item.text);
        ctx.fillRect(x, y + size * 0.7, m.width, 2);
      }
    });
  });
}
function textPlane(lines, opts = {}) {
  const {
    width = 400,
    height = 100,
    material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      opacity: 0.9
    }),
    textureOptions = {},
    opacity = 0.9,
    toneMapped = false
  } = opts;
  const texture = makeTextTexture(lines, textureOptions);
  const mat = material.clone();
  mat.map = texture;
  mat.transparent = true;
  mat.depthWrite = false;
  mat.toneMapped = toneMapped;
  mat.opacity = opacity;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return mesh;
}
function makeHelixPoints({
  radius = 2,
  pitch = 5,
  turns = 8,
  startY = 0,
  segmentsPerTurn = 18,
  axis = "y",
  clockwise = true
} = {}) {
  const pts = [];
  const total = Math.ceil(turns * segmentsPerTurn);
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const a = t * turns * Math.PI * 2 * (clockwise ? 1 : -1);
    const y = startY + t * turns * pitch;
    if (axis === "y") pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
    else if (axis === "x") pts.push(new THREE.Vector3(y, Math.cos(a) * radius, Math.sin(a) * radius));
    else pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, y));
  }
  return pts;
}
function createCoilGeometry({ radius = 2, wire = 0.35, pitch = 2.2, turns = 8, segments = 20 } = {}) {
  const pts = makeHelixPoints({ radius, pitch, turns, segmentsPerTurn: segments });
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, Math.ceil(turns * segments * 1.4), wire, 5, false);
}
function makeDialTexture({
  size = 512,
  color = "#dfe7ed",
  bg = "rgba(0,0,0,0)",
  marks = 40,
  labels = ["0", "10", "20", "30", "40"],
  title = ""
} = {}) {
  return createCanvasTexture(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < marks; i++) {
      const major = i % 5 === 0;
      const a = i / marks * Math.PI * 2;
      const r1 = w * 0.4;
      const r2 = w * (major ? 0.335 : 0.365);
      ctx.lineWidth = major ? 2.2 : 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.72;
    ctx.font = "400 18px 'SFMono-Regular',Consolas,monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    labels.forEach((label, i) => {
      const a = -Math.PI / 2 + i / labels.length * Math.PI * 2;
      ctx.fillText(label, Math.cos(a) * w * 0.285, Math.sin(a) * w * 0.285);
    });
    if (title) {
      ctx.globalAlpha = 0.45;
      ctx.font = "400 11px 'SFMono-Regular',Consolas,monospace";
      ctx.fillText(title, 0, -w * 0.12);
    }
  });
}
var clamp, lerp, easeInOutCubic, damp, deg;
var init_utils = __esm({
  "src/utils.js"() {
    clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    lerp = (a, b, t) => a + (b - a) * t;
    easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));
    deg = (v) => v * Math.PI / 180;
  }
});

// src/materials.js
import * as THREE2 from "three";
function std(params) {
  return new THREE2.MeshStandardMaterial(params);
}
function phys(params) {
  return new THREE2.MeshPhysicalMaterial(params);
}
function createMaterials(renderer) {
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const brushed = makeNoiseTexture({ size: 256, base: 136, amp: 22, horizontal: true, seed: 22 });
  brushed.anisotropy = anisotropy;
  brushed.repeat.set(5, 2);
  const cast = makeCastTexture(256, 12);
  cast.anisotropy = anisotropy;
  cast.repeat.set(2.4, 2.4);
  const rubberNoise = makeNoiseTexture({ size: 128, base: 80, amp: 30, seed: 9 });
  rubberNoise.repeat.set(5, 5);
  const floorTex = makeFloorTexture(512, 31);
  floorTex.anisotropy = anisotropy;
  floorTex.repeat.set(3, 3);
  const gearRough = makeNoiseTexture({ size: 512, base: 120, amp: 28, horizontal: false, seed: 61, blur: true });
  gearRough.anisotropy = anisotropy;
  gearRough.repeat.set(4, 2);
  const mats = {
    floor: new THREE2.ShadowMaterial({
      color: 2770532,
      opacity: 0.13,
      transparent: true,
      depthWrite: false
    }),
    floorRing: std({
      map: floorTex,
      color: 13227231,
      metalness: 0.08,
      roughness: 0.76,
      envMapIntensity: 0.58
    }),
    displayBase: std({
      color: 1976885,
      metalness: 0.48,
      roughness: 0.55,
      envMapIntensity: 0.8
    }),
    castIron: phys({
      color: 4279125,
      metalness: 0.55,
      roughness: 0.56,
      roughnessMap: cast,
      clearcoat: 0.12,
      clearcoatRoughness: 0.52,
      envMapIntensity: 1.12
    }),
    castIronDark: phys({
      color: 2963007,
      metalness: 0.52,
      roughness: 0.58,
      roughnessMap: cast,
      clearcoat: 0.08,
      clearcoatRoughness: 0.58,
      envMapIntensity: 1.02
    }),
    machined: phys({
      color: 9608357,
      metalness: 0.92,
      roughness: 0.29,
      roughnessMap: brushed,
      clearcoat: 0.16,
      clearcoatRoughness: 0.32,
      envMapIntensity: 1.45,
      anisotropy: 0.35
    }),
    machinedEdge: phys({
      color: 11910854,
      metalness: 0.96,
      roughness: 0.2,
      clearcoat: 0.2,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.55
    }),
    aluminum: phys({
      color: 10595252,
      metalness: 0.84,
      roughness: 0.34,
      roughnessMap: brushed,
      clearcoat: 0.18,
      clearcoatRoughness: 0.42,
      envMapIntensity: 1.4,
      anisotropy: 0.28
    }),
    aluminumDark: phys({
      color: 7239810,
      metalness: 0.82,
      roughness: 0.39,
      roughnessMap: brushed,
      clearcoat: 0.12,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.18
    }),
    aluminum7075: phys({
      color: 9345443,
      metalness: 0.86,
      roughness: 0.32,
      clearcoat: 0.15,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.32
    }),
    blackAnodized: phys({
      color: 2042677,
      metalness: 0.72,
      roughness: 0.37,
      roughnessMap: cast,
      clearcoat: 0.16,
      clearcoatRoughness: 0.32,
      envMapIntensity: 1.1
    }),
    blackAnodizedMatte: phys({
      color: 1516075,
      metalness: 0.55,
      roughness: 0.6,
      roughnessMap: cast,
      clearcoat: 0.06,
      clearcoatRoughness: 0.65,
      envMapIntensity: 0.92
    }),
    polishedSteel: phys({
      color: 14542315,
      metalness: 1,
      roughness: 0.075,
      clearcoat: 0.45,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.9
    }),
    steel: phys({
      color: 11252924,
      metalness: 0.96,
      roughness: 0.2,
      roughnessMap: brushed,
      clearcoat: 0.18,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.55,
      anisotropy: 0.22
    }),
    steelDark: phys({
      color: 7634568,
      metalness: 0.93,
      roughness: 0.31,
      roughnessMap: brushed,
      envMapIntensity: 1.22
    }),
    tungsten: phys({
      color: 13094870,
      metalness: 1,
      roughness: 0.12,
      clearcoat: 0.35,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.72
    }),
    chrome: phys({
      color: 14936816,
      metalness: 1,
      roughness: 0.06,
      clearcoat: 0.55,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.05
    }),
    ruby: phys({
      color: 12916031,
      metalness: 0.28,
      roughness: 0.055,
      clearcoat: 1,
      clearcoatRoughness: 0.012,
      ior: 1.76,
      sheen: 0.45,
      sheenColor: 16747936,
      emissive: 5506068,
      emissiveIntensity: 0.55,
      envMapIntensity: 2.2
    }),
    bronze: phys({
      color: 12157507,
      metalness: 0.9,
      roughness: 0.28,
      clearcoat: 0.22,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.35,
      anisotropy: 0.2
    }),
    brass: phys({
      color: 13017181,
      metalness: 0.93,
      roughness: 0.27,
      clearcoat: 0.25,
      envMapIntensity: 1.25
    }),
    springSteel: phys({
      color: 7174788,
      metalness: 0.92,
      roughness: 0.3,
      clearcoat: 0.15,
      envMapIntensity: 1.1
    }),
    rubber: std({
      color: 724239,
      metalness: 0.02,
      roughness: 0.94,
      roughnessMap: rubberNoise,
      envMapIntensity: 0.35
    }),
    ptfe: std({
      color: 15000540,
      metalness: 0,
      roughness: 0.63,
      envMapIntensity: 0.5
    }),
    glass: phys({
      color: 7245731,
      metalness: 0.05,
      roughness: 0.08,
      transparent: true,
      opacity: 0.36,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.9,
      side: THREE2.DoubleSide,
      depthWrite: false
    }),
    darkGlass: phys({
      color: 1055524,
      metalness: 0.25,
      roughness: 0.12,
      transparent: true,
      opacity: 0.58,
      clearcoat: 0.8,
      envMapIntensity: 1.5,
      side: THREE2.DoubleSide,
      depthWrite: false
    }),
    gearBody: phys({
      color: 5397864,
      metalness: 0.48,
      roughness: 0.44,
      roughnessMap: gearRough,
      clearcoat: 0.24,
      clearcoatRoughness: 0.4,
      envMapIntensity: 1.26,
      anisotropy: 0.32
    }),
    gearWeb: phys({
      color: 3884624,
      metalness: 0.28,
      roughness: 0.56,
      roughnessMap: cast,
      clearcoat: 0.22,
      clearcoatRoughness: 0.48,
      envMapIntensity: 1.2
    }),
    gearMachined: phys({
      color: 8292755,
      metalness: 0.74,
      roughness: 0.38,
      roughnessMap: brushed,
      clearcoat: 0.23,
      clearcoatRoughness: 0.36,
      envMapIntensity: 1.26,
      anisotropy: 0.4
    }),
    gearCut: phys({
      color: 8424341,
      metalness: 0.52,
      roughness: 0.44,
      clearcoat: 0.15,
      envMapIntensity: 1.16
    }),
    gearGroove: phys({
      color: 3357765,
      metalness: 0.7,
      roughness: 0.7,
      envMapIntensity: 0.6
    }),
    accentLine: new THREE2.LineBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0.48,
      toneMapped: false,
      depthWrite: false
    }),
    cyanGlow: new THREE2.MeshBasicMaterial({
      color: new THREE2.Color(COLORS.cyan).multiplyScalar(3.5),
      toneMapped: false
    }),
    amberGlow: new THREE2.MeshBasicMaterial({
      color: new THREE2.Color(COLORS.amber).multiplyScalar(3.8),
      toneMapped: false
    }),
    redGlow: new THREE2.MeshBasicMaterial({
      color: new THREE2.Color(COLORS.red).multiplyScalar(3.2),
      toneMapped: false
    }),
    greenGlow: new THREE2.MeshBasicMaterial({
      color: new THREE2.Color(COLORS.green).multiplyScalar(2.8),
      toneMapped: false
    }),
    contactShadow: new THREE2.MeshBasicMaterial({
      map: makeGlowTexture(128, "#000", "rgba(0,0,0,.95)", "rgba(0,0,0,.58)"),
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      color: 0,
      blending: THREE2.NormalBlending,
      toneMapped: false
    }),
    pointDot: new THREE2.PointsMaterial({
      size: 4.2,
      map: makeGlowTexture(64, "#A94B0B", "rgba(255,250,242,1)", "rgba(169,75,11,.72)"),
      color: new THREE2.Color(COLORS.amber).multiplyScalar(1.4),
      transparent: true,
      depthWrite: false,
      blending: THREE2.NormalBlending,
      sizeAttenuation: true,
      toneMapped: false,
      opacity: 1
    }),
    pointDotCyan: new THREE2.PointsMaterial({
      size: 3.2,
      map: makeGlowTexture(64, "#0E7490", "rgba(248,253,255,1)", "rgba(14,116,144,.66)"),
      color: new THREE2.Color(COLORS.cyan).multiplyScalar(1.25),
      transparent: true,
      depthWrite: false,
      blending: THREE2.NormalBlending,
      sizeAttenuation: true,
      toneMapped: false,
      opacity: 0.8
    }),
    sectionLine: new THREE2.LineBasicMaterial({
      color: 3052452,
      transparent: true,
      opacity: 0.78,
      toneMapped: false,
      depthWrite: false
    }),
    hatch: std({
      color: 7963533,
      metalness: 0.72,
      roughness: 0.42,
      envMapIntensity: 1.12
    })
  };
  mats._textures = {
    brushed,
    cast,
    rubberNoise,
    floorTex,
    gearRough
  };
  mats._rendererAnisotropy = anisotropy;
  return mats;
}
var init_materials = __esm({
  "src/materials.js"() {
    init_utils();
    init_config();
  }
});

// src/environment.js
import * as THREE3 from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
function makeStudioEnvironment(renderer) {
  const pmrem = new THREE3.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = new THREE3.Scene();
  const dome = new THREE3.Mesh(
    new THREE3.SphereGeometry(100, 32, 20),
    new THREE3.MeshBasicMaterial({ color: 5398638, side: THREE3.BackSide })
  );
  env.add(dome);
  function panel(w, h, x, y, z, color, intensity = 1) {
    const mat = new THREE3.MeshBasicMaterial({ side: THREE3.DoubleSide });
    mat.color.setRGB(color[0] * intensity, color[1] * intensity, color[2] * intensity);
    const mesh = new THREE3.Mesh(new THREE3.PlaneGeometry(w, h), mat);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
    return mesh;
  }
  panel(52, 34, -23, 36, 25, [1, 0.88, 0.75], 3.7);
  panel(16, 44, 16, 13, -36, [0.32, 0.78, 0.96], 3);
  panel(6, 36, 18, 30, 12, [0.92, 0.97, 1], 2.5);
  panel(32, 10, -35, -2, 17, [0.92, 0.55, 0.34], 0.65);
  panel(8, 26, -41, 10, -10, [0.35, 0.52, 0.65], 0.7);
  panel(28, 6, 22, -6, 30, [0.5, 0.63, 0.7], 0.3);
  const renderTarget = pmrem.fromScene(env, 0.04, 0.1, 200);
  pmrem.dispose();
  dome.geometry.dispose();
  dome.material.dispose();
  return renderTarget.texture;
}
function makeBackdrop() {
  const geo = new THREE3.SphereGeometry(11e3, 48, 28);
  const mat = new THREE3.ShaderMaterial({
    side: THREE3.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE3.Color(16317180) },
      uHorizon: { value: new THREE3.Color(15725560) },
      uBottom: { value: new THREE3.Color(15067889) },
      uWarm: { value: new THREE3.Color(15985893) }
    },
    vertexShader: `
      varying vec3 vWorld;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 uTop;
      uniform vec3 uHorizon;
      uniform vec3 uBottom;
      uniform vec3 uWarm;
      varying vec3 vWorld;
      void main(){
        vec3 d = normalize(vWorld);
        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(uBottom, uHorizon, smoothstep(0.0, 0.55, h));
        col = mix(col, uTop, smoothstep(0.48, 0.96, h));
        float horizon = exp(-pow(abs(d.y) * 11.0, 1.5));
        float warm = pow(clamp(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(-0.72, 0.0, 0.69))), 0.0, 1.0), 5.0);
        col += uWarm * horizon * warm * 0.07;
        float cool = pow(clamp(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(0.62, 0.0, -0.78))), 0.0, 1.0), 5.0);
        col += vec3(0.006, 0.012, 0.020) * horizon * cool;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  const mesh = new THREE3.Mesh(geo, mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}
function makeDust(renderer) {
  const rand = mulberry32(77);
  const count = 260;
  const pos = new Float32Array(count * 3);
  const seedAttr = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (rand() - 0.5) * 4300 - 120;
    pos[i * 3 + 1] = 50 + rand() * 1450;
    pos[i * 3 + 2] = (rand() - 0.5) * 3500 - 500;
    seedAttr[i] = rand();
  }
  const geo = new THREE3.BufferGeometry();
  geo.setAttribute("position", new THREE3.BufferAttribute(pos, 3));
  const tex = makeGlowTexture(32, "#7A8FA5", "rgba(255,255,255,.82)", "rgba(122,143,165,.42)");
  const mat = new THREE3.PointsMaterial({
    size: 2,
    map: tex,
    color: 8032165,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    blending: THREE3.NormalBlending,
    sizeAttenuation: true,
    toneMapped: false
  });
  const points = new THREE3.Points(geo, mat);
  points.userData.count = count;
  points.userData.seed = seedAttr;
  points.userData.base = pos.slice();
  points.frustumCulled = false;
  return points;
}
function createStageEnvironment(renderer, scene, materials, initialQuality = "auto") {
  const envTex = makeStudioEnvironment(renderer);
  scene.environment = envTex;
  scene.environmentIntensity = 1.22;
  const backdrop = makeBackdrop();
  backdrop.visible = false;
  scene.add(backdrop);
  RectAreaLightUniformsLib.init();
  const rectOver = new THREE3.RectAreaLight(16771026, 1.48, 3300, 1900);
  rectOver.position.set(-420, 2450, -820);
  rectOver.lookAt(-330, 40, -540);
  scene.add(rectOver);
  const rectKey = new THREE3.RectAreaLight(16770509, 1.34, 2400, 1200);
  rectKey.position.set(-1320, 1620, 1080);
  rectKey.lookAt(-180, 170, -300);
  scene.add(rectKey);
  const rectRim = new THREE3.RectAreaLight(8902117, 1.02, 650, 1900);
  rectRim.position.set(950, 1050, -1450);
  rectRim.lookAt(-200, 220, -280);
  scene.add(rectRim);
  const rectFill = new THREE3.RectAreaLight(16757115, 0.36, 1400, 560);
  rectFill.position.set(1100, 230, 900);
  rectFill.lookAt(-150, 180, -260);
  scene.add(rectFill);
  const hemi = new THREE3.HemisphereLight(15003125, 12174802, 0.56);
  scene.add(hemi);
  const topFill = new THREE3.DirectionalLight(14871539, 0.32);
  topFill.position.set(200, 2800, 900);
  topFill.target.position.set(-380, 0, -520);
  scene.add(topFill, topFill.target);
  const key = new THREE3.DirectionalLight(16773597, 1.08);
  key.position.set(-1550, 2200, 1450);
  key.target.position.set(-280, 60, -350);
  scene.add(key, key.target);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1950;
  key.shadow.camera.right = 1950;
  key.shadow.camera.top = 1700;
  key.shadow.camera.bottom = -1500;
  key.shadow.camera.near = 50;
  key.shadow.camera.far = 6500;
  key.shadow.bias = -18e-5;
  key.shadow.normalBias = 0.55;
  key.shadow.radius = 3;
  key.shadow.blurSamples = 8;
  const rim = new THREE3.DirectionalLight(6141126, 0.95);
  rim.position.set(900, 1200, -2300);
  rim.target.position.set(-150, 220, -300);
  scene.add(rim, rim.target);
  const fill = new THREE3.DirectionalLight(11897707, 0.28);
  fill.position.set(1300, 440, 1300);
  fill.target.position.set(0, 160, -200);
  scene.add(fill, fill.target);
  const lowFill = new THREE3.DirectionalLight(10136504, 0.36);
  lowFill.position.set(1100, 110, 1500);
  lowFill.target.position.set(0, 90, 0);
  scene.add(lowFill, lowFill.target);
  const low = new THREE3.PointLight(16762780, 28, 1400, 2);
  low.position.set(300, 90, 680);
  scene.add(low);
  const floor = new THREE3.Mesh(
    new THREE3.PlaneGeometry(15e3, 15e3, 1, 1),
    materials.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.name = "floor";
  floor.userData.fixedColor = true;
  scene.add(floor);
  const seamMat = new THREE3.LineBasicMaterial({
    color: 8096668,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    toneMapped: false
  });
  const seamPts = [];
  const seamR = 2840;
  for (let i = 0; i <= 256; i++) {
    const a = i / 256 * Math.PI * 2;
    seamPts.push(new THREE3.Vector3(Math.cos(a) * seamR - 250, 0.6, Math.sin(a) * seamR - 400));
  }
  const seam = new THREE3.Line(new THREE3.BufferGeometry().setFromPoints(seamPts), seamMat);
  seam.raycast = () => {
  };
  scene.add(seam);
  const shelfMat = new THREE3.MeshBasicMaterial({
    color: 2046550,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    map: makeContactShadowTexture(256, 0.88)
  });
  const shadowPlane = new THREE3.Mesh(new THREE3.PlaneGeometry(1300, 1300), shelfMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(-120, 0.7, -430);
  shadowPlane.renderOrder = 1;
  shadowPlane.raycast = () => {
  };
  scene.add(shadowPlane);
  const dust = makeDust(renderer);
  scene.add(dust);
  function setQuality(mode) {
    const q = mode === "high" ? 2048 : mode === "smooth" ? 512 : 1024;
    if (key.shadow.mapSize.x !== q) {
      key.shadow.mapSize.set(q, q);
      if (key.shadow.map) {
        key.shadow.map.dispose();
        key.shadow.map = null;
      }
    }
    dust.visible = mode !== "smooth";
    dust.geometry.setDrawRange(0, mode === "high" ? 260 : mode === "smooth" ? 80 : 170);
  }
  setQuality(initialQuality);
  const clock = { t: 0 };
  function update(dt) {
    if (!dust.visible) return;
    clock.t += dt;
    const arr = dust.geometry.attributes.position.array;
    const base = dust.userData.base;
    for (let i = 0; i < arr.length / 3; i++) {
      const ph = dust.userData.seed[i] * Math.PI * 2;
      arr[i * 3] = base[i * 3] + Math.sin(clock.t * 0.035 + ph) * 28 + Math.sin(clock.t * 0.013 + ph * 2) * 55;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.cos(clock.t * 0.026 + ph) * 20;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(clock.t * 0.031 + ph * 1.5) * 24;
    }
    dust.geometry.attributes.position.needsUpdate = true;
  }
  return {
    envTex,
    floor,
    key,
    rim,
    topFill,
    dust,
    update,
    setQuality,
    shadow: shadowPlane,
    rect: { key: rectKey, rim: rectRim, fill: rectFill, overhead: rectOver },
    low
  };
}
var init_environment = __esm({
  "src/environment.js"() {
    init_config();
    init_utils();
  }
});

// src/instrument.js
import * as THREE4 from "three";
function knurlTexture() {
  return createCanvasTexture(512, 64, (ctx, w, h) => {
    ctx.fillStyle = "#777";
    ctx.fillRect(0, 0, w, h);
    const n = 120;
    for (let i = 0; i < n; i++) {
      const x = i / n * w;
      const g = ctx.createLinearGradient(x, 0, x + 3, 0);
      g.addColorStop(0, "rgba(255,255,255,.28)");
      g.addColorStop(0.5, "rgba(0,0,0,.32)");
      g.addColorStop(1, "rgba(255,255,255,.15)");
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, 3.2, h);
    }
    ctx.globalAlpha = 0.18;
    for (let y = 0; y < h; y += 8) {
      ctx.fillStyle = y % 16 ? "#fff" : "#000";
      ctx.fillRect(0, y, w, 0.7);
    }
  }, { linear: true, repeat: [1, 1] });
}
function makeKnurledMaterial(base, texture) {
  const mat = base.clone();
  mat.roughness = Math.min(0.52, (mat.roughness ?? 0.35) + 0.08);
  mat.bumpMap = texture;
  mat.bumpScale = 0.18;
  mat.roughnessMap = texture;
  mat.needsUpdate = true;
  return mat;
}
function addBolts(parent, positions, mat, radius = 4, height = 2.6) {
  if (!positions.length) return null;
  const geo = new THREE4.CylinderGeometry(radius, radius, height, 6);
  const inst = new THREE4.InstancedMesh(geo, mat, positions.length);
  const dummy = new THREE4.Object3D();
  positions.forEach((p, i) => {
    dummy.position.set(p[0], p[1], p[2]);
    dummy.rotation.set(p[3] || 0, p[4] || 0, p[5] || 0);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  inst.name = "fasteners";
  parent.add(inst);
  return inst;
}
function addNut(parent, x, y, z, mat, r = 11, h = 8, rot = [0, 0, 0]) {
  const g = new THREE4.Group();
  g.position.set(x, y, z);
  g.rotation.set(rot[0], rot[1], rot[2]);
  parent.add(g);
  cylinder(r, r, h, mat, g, [0, 0, 0], 6);
  cylinder(r * 0.58, r * 0.58, h + 0.2, mat, g, [0, 0, 0], 20);
  return g;
}
function addLinearTicks(parent, {
  length = 100,
  count = 20,
  origin = [0, 0, 0],
  axis = "z",
  normal = "x",
  majorEvery = 5,
  color = 12109004,
  opacity = 0.5
} = {}) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const major = i % majorEvery === 0;
    const l = major ? 3.4 : 1.8;
    if (axis === "z") {
      pts.push(origin[0], origin[1], origin[2] + t * length);
      pts.push(origin[0] + (normal === "x" ? l : 0), origin[1] + (normal === "y" ? l : 0), origin[2] + t * length);
    } else if (axis === "x") {
      pts.push(origin[0] + t * length, origin[1], origin[2]);
      pts.push(origin[0] + t * length, origin[1] + (normal === "y" ? l : 0), origin[2] + (normal === "z" ? l : 0));
    } else {
      pts.push(origin[0], origin[1] + t * length, origin[2]);
      pts.push(origin[0] + (normal === "x" ? l : 0), origin[1] + t * length, origin[2] + (normal === "z" ? l : 0));
    }
  }
  const geo = new THREE4.BufferGeometry();
  geo.setAttribute("position", new THREE4.Float32BufferAttribute(pts, 3));
  const line = new THREE4.LineSegments(geo, new THREE4.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    toneMapped: false
  }));
  line.raycast = () => {
  };
  parent.add(line);
  return line;
}
function addDialTicks(parent, radius, y, count = 96, color = 10466239) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2;
    const major = i % 8 === 0;
    const r0 = radius * (major ? 0.86 : 0.92);
    positions.push(Math.cos(a) * r0, y, Math.sin(a) * r0);
    positions.push(Math.cos(a) * radius, y, Math.sin(a) * radius);
  }
  const geo = new THREE4.BufferGeometry();
  geo.setAttribute("position", new THREE4.Float32BufferAttribute(positions, 3));
  const line = new THREE4.LineSegments(geo, new THREE4.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
    toneMapped: false
  }));
  line.raycast = () => {
  };
  parent.add(line);
  return line;
}
function addCable(parent, points, radius = 1.25, material) {
  const curve = new THREE4.CatmullRomCurve3(points.map((p) => new THREE4.Vector3(...p)));
  const geo = new THREE4.TubeGeometry(curve, 80, radius, 5, false);
  const m = new THREE4.Mesh(geo, material);
  m.castShadow = true;
  m.raycast = () => {
  };
  parent.add(m);
  return m;
}
function addHexVent(parent, pos, mat, radius = 10, depth = 1.6) {
  const g = new THREE4.Group();
  g.position.set(...pos);
  const outer = cylinder(radius, radius, depth, mat, g, [0, 0, 0], 6);
  outer.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const slit = box(radius * 1.35, 1, 0.4, new THREE4.MeshBasicMaterial({ color: 329739 }), g, [0, -3 + i * 3, depth / 2 + 0.2]);
    slit.rotation.z = -0.2;
    slit.raycast = () => {
    };
  }
  parent.add(g);
  return g;
}
function createMicrometerHead(mats, knurlMat, options = {}) {
  const {
    scale = 1,
    color = "dark",
    axisLength = 26
  } = options;
  const g = new THREE4.Group();
  const bodyMat = color === "dark" ? mats.blackAnodized : mats.aluminum;
  const barrelMat = mats.steel;
  cylinder(9, 9, 20, bodyMat, g, [0, 2, 0], 24);
  const scaleRing = cylinder(9.3, 9.3, 2.4, mats.machined, g, [0, 7.2, 0], 32);
  const tickTex = makeDialTexture({ size: 512, marks: 50, labels: ["0", "10", "20", "30", "40"], color: "#d7e2e8" });
  const tickMat = new THREE4.MeshBasicMaterial({ map: tickTex, transparent: true, opacity: 0.6, toneMapped: false });
  const tickPlane = new THREE4.Mesh(new THREE4.PlaneGeometry(17, 9), tickMat);
  tickPlane.position.set(0, 7.5, 9.28);
  tickPlane.raycast = () => {
  };
  g.add(tickPlane);
  const thimble = cylinder(10.3, 10.3, 12, knurlMat, g, [0, -10, 0], 40);
  thimble.name = "micrometerThimble";
  cylinder(3, 3, 34, barrelMat, g, [0, -26, 0], 16);
  const ring = torus(9.5, 0.4, mats.polishedSteel, g, [0, 3.6, 0], [Math.PI / 2, 0, 0], 32, 5);
  g.userData.thimble = thimble;
  g.userData.scaleRing = scaleRing;
  g.userData.spindle = barrelMat;
  g.scale.setScalar(scale);
  return g;
}
function createScrewThreadGeometry(length, shaftRadius, threadRadius, pitch) {
  const pts = makeHelixPoints({
    radius: shaftRadius,
    pitch,
    turns: length / pitch,
    startY: 0,
    segmentsPerTurn: 22,
    axis: "y",
    clockwise: true
  });
  const curve = new THREE4.CatmullRomCurve3(pts);
  const geo = new THREE4.TubeGeometry(curve, Math.ceil(length / pitch * 22), threadRadius, 5, false);
  geo.translate(0, -length / 2, 0);
  return geo;
}
function createSimpleGearGeometry(teeth = 40, module = 0.5, thickness = 6) {
  const rRoot = module * teeth / 2 - module * 1.25;
  const rTip = module * teeth / 2 + module;
  const shape = new THREE4.Shape();
  const steps = teeth * 4;
  for (let i = 0; i <= steps; i++) {
    const t = i % 4;
    const a = i / steps * Math.PI * 2;
    const r = t === 1 || t === 2 ? rTip : rRoot;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geo = new THREE4.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSize: 0.35,
    bevelThickness: 0.4,
    bevelSegments: 1,
    curveSegments: 32
  });
  geo.center();
  geo.rotateX(-Math.PI / 2);
  return { geo, rRoot, rTip, pitchR: module * teeth / 2 };
}
function addSmallDisplayLabel(parent, lines, pos, rot, width, height, opacity = 0.7) {
  const plate = textPlane(lines, {
    width,
    height,
    textureOptions: {
      width: 1024,
      height: 256,
      align: "center",
      color: "rgba(211,224,232,.72)",
      dim: "rgba(175,193,205,.46)",
      padding: 26
    },
    opacity,
    material: new THREE4.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, side: THREE4.DoubleSide })
  });
  plate.position.set(...pos);
  plate.rotation.set(...rot);
  plate.raycast = () => {
  };
  parent.add(plate);
  return plate;
}
function createInstrument(materials, opts = {}) {
  const root = new THREE4.Group();
  root.name = "Instrument";
  root.position.fromArray(opts.position || I.rootWorld);
  root.rotation.y = deg(opts.yawDeg ?? I.yawDeg);
  const motion = {};
  const anchors = {};
  const explodeGroups = [];
  const partGroups = {};
  const clickables = [];
  const knurlTex = knurlTexture();
  const knurlMat = makeKnurledMaterial(materials.blackAnodized, knurlTex);
  const knurlSilver = makeKnurledMaterial(materials.steel, knurlTex);
  const copperMat = materials.bronze.clone();
  copperMat.color = new THREE4.Color(10911048);
  const register = (key, mesh) => {
    tagPart(mesh, key);
    (partGroups[key] ||= []).push(mesh);
  };
  const bindAnchor = (key, obj, pos = [0, 0, 0]) => {
    const a = new THREE4.Object3D();
    a.position.set(pos[0], pos[1], pos[2]);
    obj.add(a);
    anchors[key] = a;
    return a;
  };
  const addExplode = (name, object, parent, base = [0, 0, 0], offset = [0, 0, 0], delay = 0) => {
    const g = new THREE4.Group();
    g.name = `EXPLODE_${name}`;
    g.position.set(base[0], base[1], base[2]);
    parent.add(g);
    const entry = {
      name,
      object: g,
      base: g.position.clone(),
      offset: new THREE4.Vector3(offset[0], offset[1], offset[2]),
      delay
    };
    explodeGroups.push(entry);
    return g;
  };
  const feetExpl = addExplode("feet", new THREE4.Group(), root, [0, 0, 0], [0, -190, 0], 0.05);
  const feetGroup = feetExpl;
  {
    const feet = [
      [-158, -110, 0.94],
      [158, -110, 1],
      [4, 138, 1.05]
    ];
    for (const [x, z, s] of feet) {
      const f = new THREE4.Group();
      f.position.set(x, 0, z);
      f.scale.setScalar(s);
      cylinder(27, 29, 6, materials.rubber, f, [0, 3, 0], 48);
      cylinder(23, 23, 4, materials.brass, f, [0, 8.2, 0], 40);
      cylinder(8, 8, 22, materials.steel, f, [0, 18, 0], 20);
      const rings = new THREE4.Group();
      for (let i = 0; i < 7; i++) {
        const r = torus(8.1, 0.45, materials.steelDark, rings, [0, 12 + i * 2.4, 0], [Math.PI / 2, 0, 0], 20, 4);
        r.raycast = () => {
        };
      }
      f.add(rings);
      addNut(f, 0, 20.7, 0, materials.steelDark, 13, 7);
      addNut(f, 0, 26.5, 0, materials.steelDark, 12, 5);
      cylinder(19, 22, 4, materials.castIronDark, f, [0, 28, 0], 24);
      feetGroup.add(f);
    }
    const shadowTex = makeGlowTexture(96, "#000", "rgba(0,0,0,.9)", "rgba(0,0,0,.3)");
    for (const [x, z] of [[-158, -110], [158, -110], [4, 138]]) {
      const m = new THREE4.Mesh(new THREE4.PlaneGeometry(142, 142), new THREE4.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.42,
        color: 0,
        depthWrite: false,
        toneMapped: false
      }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.28, z);
      m.renderOrder = 1;
      m.raycast = () => {
      };
      feetGroup.add(m);
    }
  }
  const baseGroup = new THREE4.Group();
  baseGroup.name = "Base";
  root.add(baseGroup);
  {
    const body = box(400, 80, 300, materials.castIron, baseGroup, [0, 60, 0], 5, 3, null, "BaseCastBody");
    body.receiveShadow = true;
    box(396, 5, 296, materials.machined, baseGroup, [0, 102.5, 0], 1.6, 2, null, "MachinedTop");
    box(214, 2.4, 184, materials.steelDark, baseGroup, [0, 101.6, 6], 0.8, 2);
    box(266, 48, 3.2, materials.castIronDark, baseGroup, [0, 52, 150.7], 1.4, 2);
    const rib1 = box(232, 9, 5, materials.castIron, baseGroup, [0, 55, 153.2], 1.6, 2);
    rib1.rotation.z = 0.56;
    const rib2 = box(232, 9, 5, materials.castIron, baseGroup, [0, 55, 153.2], 1.6, 2);
    rib2.rotation.z = -0.56;
    box(2.4, 38, 198, materials.castIronDark, baseGroup, [-200.2, 61, -10], 0.8, 2);
    box(2.4, 38, 198, materials.castIronDark, baseGroup, [200.2, 61, -10], 0.8, 2);
    addHexVent(baseGroup, [-128, 40, 151], materials.steelDark, 8, 1.1);
    addHexVent(baseGroup, [128, 40, 151], materials.steelDark, 8, 1.1);
    addBolts(baseGroup, [
      [-180, 105, -134, 0, 0, 0],
      [180, 105, -134, 0, 0, 0],
      [-180, 105, 134, 0, 0, 0],
      [180, 105, 134, 0, 0, 0],
      [-90, 105, -134, 0, 0, 0],
      [90, 105, -134, 0, 0, 0],
      [-90, 105, 134, 0, 0, 0],
      [90, 105, 134, 0, 0, 0]
    ], materials.steel, 3.6, 2.2);
    addBolts(baseGroup, [
      [-169, 80, 151.8, Math.PI / 2, 0, 0],
      [169, 80, 151.8, Math.PI / 2, 0, 0],
      [-169, 36, 151.8, Math.PI / 2, 0, 0],
      [169, 36, 151.8, Math.PI / 2, 0, 0]
    ], materials.steelDark, 4.6, 2.7);
    const badge = addSmallDisplayLabel(baseGroup, [
      "IN-SITU  /  MS-04",
      "GEAR PROFILE METROLOGY \u8DEF \u9366\u3124\u7D85\u5A34\u5B2E\u567A"
    ], [0, 76, 152.05], [0, 0, 0], 150, 40, 0.7);
    addLinearTicks(baseGroup, {
      length: 120,
      count: 24,
      origin: [-72, 114, -140],
      axis: "z",
      normal: "y",
      majorEvery: 5,
      opacity: 0.3
    });
    const bubbleG = new THREE4.Group();
    bubbleG.position.set(148, 106, 104);
    cylinder(10, 10, 4.5, materials.blackAnodized, bubbleG, [0, 0, 0], 28);
    const glass = cylinder(8.2, 8.2, 2.2, materials.glass, bubbleG, [0, 2.4, 0], 28);
    glass.raycast = () => {
    };
    const bubble = cylinder(3.1, 3.1, 0.5, new THREE4.MeshStandardMaterial({
      color: 10219204,
      emissive: 2255688,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0
    }), bubbleG, [1.3, 3.55, 0], 20);
    bubble.raycast = () => {
    };
    baseGroup.add(bubbleG);
    setShadows(baseGroup, true, true);
    register("base", baseGroup);
  }
  const controlBoxExpl = addExplode("controlBox", new THREE4.Group(), root, [0, 0, 0], [170, 70, 120], 0.3);
  const controlBox = controlBoxExpl;
  const indicators = {};
  {
    const g = new THREE4.Group();
    g.position.set(160, 118, 70);
    const shell = box(92, 122, 112, materials.castIron, g, [0, 46, 0], 3.5, 3, null, "HT150ControlBox");
    box(82, 58, 2.4, materials.darkGlass, g, [0, 65, 56.6], 1.2, 2);
    box(96, 7, 118, materials.castIronDark, g, [0, 108, 0], 2, 2);
    box(84, 24, 1.8, materials.blackAnodized, g, [0, 21, 56.6], 1.2, 2);
    addBolts(g, [
      [-39, 100, 28, 0, 0, 0],
      [39, 100, 28, 0, 0, 0],
      [-39, 100, -28, 0, 0, 0],
      [39, 100, -28, 0, 0, 0]
    ], materials.steelDark, 3.3, 2);
    for (const x of [-24, 0, 24]) {
      cylinder(5, 6, 10, materials.blackAnodizedMatte, g, [x, 115, -22], 16);
      cylinder(2.8, 2.8, 2, materials.rubber, g, [x, 121, -22], 12);
    }
    const ledGroup = new THREE4.Group();
    ledGroup.position.set(-28, 65, 57.6);
    for (let i = 0; i < 3; i++) {
      const col = [COLORS.cyan, COLORS.amber, COLORS.red][i];
      const mat = new THREE4.MeshStandardMaterial({
        color: 1120029,
        emissive: col,
        emissiveIntensity: 0.08,
        roughness: 0.14,
        metalness: 0.25
      });
      const lens = cylinder(3.4, 3.4, 2, mat, ledGroup, [0, 9 - i * 8, 0], 16);
      lens.rotation.x = Math.PI / 2;
      lens.raycast = () => {
      };
      indicators[["idle", "run", "error"][i]] = mat;
    }
    g.add(ledGroup);
    addSmallDisplayLabel(g, [
      { text: "METROLOGY CONTROL", size: 32, color: "rgba(208,221,230,.62)" },
      { text: "IDLE  \u8DEF  READY  \u8DEF  FAULT", size: 20, color: "rgba(160,180,194,.38)" }
    ], [14, 81, 57], [0, 0, 0], 44, 24, 0.8);
    const estop = new THREE4.Group();
    estop.position.set(28, 66, 58);
    const orange = new THREE4.MeshStandardMaterial({
      color: 15237178,
      roughness: 0.29,
      metalness: 0.34,
      emissive: 3871235,
      emissiveIntensity: 0.18
    });
    const bezel = cylinder(11.5, 11.5, 4, materials.blackAnodized, estop, [0, 0, 2], 32);
    bezel.rotation.x = Math.PI / 2;
    const btn = cylinder(8.7, 10.3, 6.5, orange, estop, [0, 0, 6.6], 32);
    btn.rotation.x = Math.PI / 2;
    const top = cylinder(7.1, 8.3, 2.8, orange, estop, [0, 0, 11.1], 32);
    top.rotation.x = Math.PI / 2;
    const symbol = new THREE4.Mesh(
      new THREE4.TorusGeometry(3.5, 0.55, 5, 24, Math.PI * 1.5),
      new THREE4.MeshBasicMaterial({ color: 1182470 })
    );
    symbol.position.set(0, 0, 12.6);
    estop.add(symbol);
    tagPart(estop, "emergencyStop");
    (partGroups.emergencyStop ||= []).push(estop);
    g.add(estop);
    addSmallDisplayLabel(g, [
      { text: "E-STOP", size: 28, color: "rgba(232,128,58,.65)" },
      { text: "PRESS TO HOLD", size: 17, color: "rgba(190,200,210,.34)" }
    ], [28, 45, 57], [0, 0, 0], 27, 12, 0.62);
    box(2.2, 48, 1.4, materials.steelDark, g, [-44.8, 64, 47.5], 0.6, 2);
    box(88, 3, 120, materials.castIronDark, g, [0, 108.4, 0], 1, 2);
    controlBox.add(g);
    setShadows(controlBox, true, true);
    register("controlBox", controlBox);
    register("emergencyStop", estop);
  }
  const xGuideGroup = new THREE4.Group();
  xGuideGroup.name = "XAxisDovetailGuide";
  baseGroup.add(xGuideGroup);
  {
    const shape = new THREE4.Shape();
    shape.moveTo(-84, 0);
    shape.lineTo(84, 0);
    shape.lineTo(84, 6);
    shape.lineTo(61, 18);
    shape.lineTo(-61, 18);
    shape.lineTo(-84, 6);
    shape.closePath();
    const geo = new THREE4.ExtrudeGeometry(shape, {
      depth: 176,
      bevelEnabled: true,
      bevelThickness: 1.2,
      bevelSize: 1.2,
      bevelSegments: 2,
      steps: 1
    });
    geo.center();
    const fixed = new THREE4.Mesh(geo, materials.castIronDark);
    fixed.position.set(0, 112, 10);
    fixed.castShadow = fixed.receiveShadow = true;
    xGuideGroup.add(fixed);
    for (const s of [-1, 1]) {
      const slideFace = box(17, 2.3, 172, materials.steel, xGuideGroup, [s * 72, 124.1, 10], 0.8, 2);
      slideFace.rotation.z = s * 0.36;
      const gib = box(2.2, 13, 150, materials.bronze, xGuideGroup, [s * 82.5, 119, 8], 0.5, 2);
      gib.rotation.z = s * 0.13;
    }
    addBolts(xGuideGroup, [
      [-66, 127, -72, 0, 0, 0],
      [66, 127, -72, 0, 0, 0],
      [-66, 127, 88, 0, 0, 0],
      [66, 127, 88, 0, 0, 0]
    ], materials.steel, 3.4, 2);
    addLinearTicks(xGuideGroup, {
      length: 130,
      count: 26,
      origin: [87, 121, -56],
      axis: "z",
      normal: "y",
      majorEvery: 5,
      opacity: 0.4
    });
    const wheelG = new THREE4.Group();
    wheelG.position.set(0, 105, 162);
    wheelG.rotation.x = Math.PI / 2;
    cylinder(5, 5, 12, materials.steel, wheelG, [0, 0, 0], 16);
    const wheel = new THREE4.Group();
    wheel.rotation.x = Math.PI / 2;
    cylinder(20, 20, 4, knurlMat, wheel, [0, 0, 0], 38);
    cylinder(6, 6, 6, materials.blackAnodized, wheel, [0, 0, 0], 20);
    new Array(3).fill(0).forEach((_, i) => {
      const a = i * Math.PI * 2 / 3;
      const spoke = box(33, 2.2, 3, materials.steelDark, wheel, [0, 0, 0], 1, 1);
      spoke.rotation.z = a;
    });
    wheelG.add(wheel);
    xGuideGroup.add(wheelG);
    xGuideGroup.userData.wheel = wheel;
    register("xslide", xGuideGroup);
  }
  const xCarriage = new THREE4.Group();
  xCarriage.name = "XAxisMovingSaddle";
  xCarriage.position.set(0, 0, I.xCarriageOriginZ - I.xCoarseIdle);
  root.add(xCarriage);
  motion.xCarriage = xCarriage;
  {
    const saddle = new THREE4.Group();
    xCarriage.add(saddle);
    box(176, 15, 154, materials.castIron, saddle, [0, 119, 6], 3, 3);
    box(158, 3, 142, materials.machined, saddle, [0, 127, 5], 0.8, 2);
    box(74, 7, 74, materials.steelDark, saddle, [0, 129.5, 70], 1.2, 2);
    const lock = new THREE4.Group();
    lock.position.set(-72, 131, 52);
    cylinder(3.4, 3.4, 14, materials.steel, lock, [0, 0, 0], 16);
    const lever = box(4, 17, 4, knurlMat, lock, [0, 8, 0], 1, 2);
    lever.rotation.z = -0.35;
    cylinder(7, 7, 4, materials.blackAnodized, lock, [0, 16, 0], 24);
    xCarriage.add(lock);
    setShadows(saddle, true, true);
  }
  const columnArmExpl = addExplode("columnArm", new THREE4.Group(), xCarriage, [0, 0, 0], [0, 280, 140], 0.36);
  const columnArm = columnArmExpl;
  {
    const column = new THREE4.Group();
    column.position.set(0, 0, 62);
    box(86, 14, 86, materials.castIronDark, column, [0, 129, 0], 2.2, 2);
    box(76, 5, 76, materials.machined, column, [0, 137, 0], 1, 2);
    addBolts(column, [
      [-32, 147, -32, 0, 0, 0],
      [32, 147, -32, 0, 0, 0],
      [-32, 147, 32, 0, 0, 0],
      [32, 147, 32, 0, 0, 0]
    ], materials.steel, 3.8, 2.4);
    const tube = box(60, 250, 60, materials.aluminum, column, [0, 265, 0], 2.2, 3, null, "ColumnTube");
    box(1.8, 214, 27, materials.aluminumDark, column, [-30.9, 262, 0], 0.6, 2);
    box(1.8, 214, 27, materials.aluminumDark, column, [30.9, 262, 0], 0.6, 2);
    box(27, 214, 1.8, materials.aluminumDark, column, [0, 262, -30.9], 0.6, 2);
    box(76, 10, 76, materials.castIronDark, column, [0, 390, 0], 1.8, 2);
    box(72, 4, 72, materials.machined, column, [0, 396.5, 0], 1, 2);
    addBolts(column, [
      [-27, 400, -27, 0, 0, 0],
      [27, 400, -27, 0, 0, 0],
      [-27, 400, 27, 0, 0, 0],
      [27, 400, 27, 0, 0, 0]
    ], materials.steel, 4.3, 2.6);
    addLinearTicks(column, {
      length: 212,
      count: 42,
      origin: [-31.2, 158, 17],
      axis: "y",
      normal: "z",
      majorEvery: 10,
      opacity: 0.22
    });
    addSmallDisplayLabel(column, [
      { text: "6061-T6", size: 34, color: "rgba(196,209,219,.50)" },
      { text: "OPTICAL BENCH COLUMN \u8DEF 250", size: 18, color: "rgba(155,174,189,.30)" }
    ], [31.1, 338, 0], [0, Math.PI / 2, 0], 96, 24, 0.6);
    const gusShape = new THREE4.Shape();
    gusShape.moveTo(0, 0);
    gusShape.lineTo(-96, 0);
    gusShape.lineTo(-96, 54);
    gusShape.lineTo(-8, 54);
    gusShape.closePath();
    const gusGeo = new THREE4.ExtrudeGeometry(gusShape, {
      depth: 10,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1,
      steps: 1
    });
    gusGeo.rotateY(Math.PI / 2);
    const gusset = new THREE4.Mesh(gusGeo, materials.aluminumDark);
    gusset.position.set(-10, 314, 62);
    gusset.castShadow = gusset.receiveShadow = true;
    column.add(gusset);
    const arm = new THREE4.Group();
    const armBeam = box(76, 28, 286, materials.aluminum, arm, [0, 352, -78], 3.2, 3, null, "CantileverBeam");
    box(72, 3, 262, materials.machined, arm, [0, 367.4, -78], 1, 2);
    box(2, 18, 230, materials.aluminumDark, arm, [-38.2, 351, -82], 0.5, 2);
    box(2, 18, 230, materials.aluminumDark, arm, [38.2, 351, -82], 0.5, 2);
    box(58, 3, 185, materials.aluminumDark, arm, [0, 337.4, -75], 1, 2);
    box(332, 11, 92, materials.blackAnodized, arm, [0, 329, -190], 2, 2);
    addBolts(arm, [
      [-26, 368, 44, 0, 0, 0],
      [26, 368, 44, 0, 0, 0],
      [-26, 368, 4, 0, 0, 0],
      [26, 368, 4, 0, 0, 0]
    ], materials.steel, 4.2, 2.6);
    for (const s of [-1, 1]) {
      const pocket = box(1.3, 10, 96, materials.aluminumDark, arm, [s * 38.4, 348, -150], 0.4, 1);
      pocket.rotation.x = 0.16;
    }
    addCable(arm, [
      [-34, 378, 60],
      [-34, 382, 10],
      [-33, 379, -90],
      [-32, 365, -170],
      [-32, 346, -202]
    ], 2.1, materials.rubber);
    addCable(arm, [
      [32, 360, 40],
      [31, 356, -40],
      [30, 345, -132],
      [26, 336, -186]
    ], 1.4, materials.rubber);
    for (let z = 30; z > -170; z -= 42) {
      box(7, 5, 13, materials.blackAnodizedMatte, arm, [-35, 377, z], 1.3, 2);
    }
    column.add(arm);
    setShadows(column, true, true);
    columnArm.add(column);
    bindAnchor("column", column, [0, 310, -80]);
    register("column", column);
  }
  const yDriveExpl = addExplode("yDrive", new THREE4.Group(), xCarriage, [0, 0, 0], [0, 55, 220], 0.52);
  const yDrive = yDriveExpl;
  const yMotion = {};
  {
    box(344, 10, 94, materials.blackAnodized, yDrive, [0, 323, -186], 2.4, 2);
    box(322, 5, 74, materials.machined, yDrive, [0, 329, -186], 1.2, 2);
    for (const s of [-1, 1]) {
      box(28, 31, 84, materials.aluminumDark, yDrive, [s * 156, 310, -188], 2, 2);
      addBolts(yDrive, [
        [s * 156, 326, -220, Math.PI / 2, 0, 0],
        [s * 156, 326, -156, Math.PI / 2, 0, 0]
      ], materials.steel, 3.4, 2.1);
    }
    const railExp = addExplode("rail", new THREE4.Group(), yDrive, [0, 0, 0], [0, 70, -150], 0.62);
    {
      const railBase = box(320, 12, 34, materials.steelDark, railExp, [0, 299, -215], 2, 2, null, "P4RailBase");
      const strip = new THREE4.Mesh(new THREE4.BoxGeometry(314, 5, 11), materials.polishedSteel);
      strip.position.set(0, 307.6, -215);
      strip.castShadow = strip.receiveShadow = true;
      railExp.add(strip);
      for (const s of [-1, 1]) {
        const race = new THREE4.Mesh(new THREE4.BoxGeometry(312, 3.4, 5), materials.steel);
        race.position.set(0, 304.3, -215 + s * 10.7);
        race.castShadow = race.receiveShadow = true;
        railExp.add(race);
      }
      const holes = [];
      for (let x = -145; x <= 145; x += 29) {
        holes.push([x, 301.3, -215 + 12]);
        holes.push([x, 301.3, -215 - 12]);
      }
      addBolts(railExp, holes.map((p) => [p[0], p[1], p[2], Math.PI / 2, 0, 0]), materials.steelDark, 1.6, 1.2);
      addSmallDisplayLabel(railExp, [
        { text: "P4 / 25 \u8133 320", size: 28, color: "rgba(204,218,228,.55)" },
        { text: "PRECISION LINEAR GUIDE", size: 16, color: "rgba(160,180,194,.36)" }
      ], [0, 288.8, -230.8], [0, Math.PI, 0], 72, 18, 0.58);
      register("rail", railBase);
    }
    const motorExp = addExplode("motor", new THREE4.Group(), yDrive, [0, 0, 0], [-430, 80, 80], 0.58);
    const motorGroup = new THREE4.Group();
    motorGroup.position.set(-198, 312, -186);
    motorGroup.rotation.z = Math.PI / 2;
    {
      const body = cylinder(21, 21, 54, materials.blackAnodized, motorGroup, [0, 6, 0], 32);
      cylinder(22, 22, 4, materials.steelDark, motorGroup, [0, -23, 0], 32);
      cylinder(23, 23, 6, materials.blackAnodized, motorGroup, [0, 35, 0], 32);
      cylinder(12, 12, 5, materials.machined, motorGroup, [0, 40, 0], 24);
      cylinder(5, 5, 22, materials.steel, motorGroup, [0, 51, 0], 16);
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2 + Math.PI / 4;
        const fin = box(2.8, 42, 3.2, materials.blackAnodizedMatte, motorGroup, [Math.cos(a) * 20.6, 7, Math.sin(a) * 20.6], 0.8, 2);
        fin.rotation.y = -a;
      }
      const band = torus(21.6, 0.6, materials.steelDark, motorGroup, [0, 22, 0], [Math.PI / 2, 0, 0], 32, 5);
      const band2 = torus(21.6, 0.6, materials.steelDark, motorGroup, [0, -4, 0], [Math.PI / 2, 0, 0], 32, 5);
      addSmallDisplayLabel(motorGroup, [
        { text: "N85BYGH", size: 30, color: "rgba(208,220,230,.62)" },
        { text: "450A-04 \u8DEF 0.4 N\u8DEFm", size: 17, color: "rgba(160,180,194,.38)" }
      ], [0, 7, 21.2], [0, Math.PI / 2, 0], 38, 14, 0.66);
      const gland = cylinder(5, 5, 8, materials.blackAnodizedMatte, motorGroup, [0, -31, 0], 16);
      const cable = new THREE4.CatmullRomCurve3([
        new THREE4.Vector3(0, -34, 0),
        new THREE4.Vector3(0, -50, -4),
        new THREE4.Vector3(-12, -72, -18),
        new THREE4.Vector3(-40, -90, -48)
      ]);
      const cm = new THREE4.Mesh(new THREE4.TubeGeometry(cable, 24, 2.3, 5, false), materials.rubber);
      cm.castShadow = true;
      cm.raycast = () => {
      };
      motorGroup.add(cm);
      motorGroup.rotation.set(0, 0, -Math.PI / 2);
      motorGroup.rotation.set(0, 0, -Math.PI / 2);
      motorExp.add(motorGroup);
      setShadows(motorExp, true, true);
      tagPart(motorExp, "motor");
      (partGroups.motor ||= []).push(motorExp);
      bindAnchor("motor", motorGroup, [0, 0, 0]);
    }
    const couplingExp = addExplode("coupling", new THREE4.Group(), yDrive, [0, 0, 0], [-260, 120, 100], 0.5);
    const couplingGroup = new THREE4.Group();
    couplingGroup.position.set(-137, 312, -186);
    couplingGroup.rotation.z = Math.PI / 2;
    {
      const rot = new THREE4.Group();
      cylinder(12.5, 12.5, 11, materials.aluminum, rot, [0, -8, 0], 28);
      cylinder(12.5, 12.5, 11, materials.aluminum, rot, [0, 8, 0], 28);
      for (let i = 0; i < 4; i++) {
        const disc = cylinder(13.6, 13.6, 1.4, i % 2 ? materials.polishedSteel : materials.steel, rot, [0, -2.5 + i * 1.6, 0], 32);
        disc.scale.x = 0.96;
      }
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + 0.4;
        const bolt = cylinder(1.2, 1.2, 25, materials.steel, rot, [Math.cos(a) * 8.2, 0, Math.sin(a) * 8.2], 6);
      }
      cylinder(4.8, 4.8, 31, materials.steel, rot, [0, 0, 0], 16);
      couplingGroup.add(rot);
      couplingGroup.userData.rotor = rot;
      couplingExp.add(couplingGroup);
      setShadows(couplingExp, true, true);
      tagPart(couplingExp, "coupling");
      (partGroups.coupling ||= []).push(couplingExp);
      bindAnchor("coupling", couplingGroup);
    }
    const screwExp = addExplode("screw", new THREE4.Group(), yDrive, [0, 0, 0], [60, 170, -210], 0.66);
    const screwGroup = new THREE4.Group();
    screwGroup.position.set(30, 313, -186);
    screwGroup.rotation.z = -Math.PI / 2;
    const screwSpin = new THREE4.Group();
    screwGroup.add(screwSpin);
    {
      const screwBody = cylinder(7.1, 7.1, 268, materials.steel, screwSpin, [0, 0, 0], 24);
      const threadGeo = createScrewThreadGeometry(250, 7, 0.72, 5);
      const thread = new THREE4.Mesh(threadGeo, materials.polishedSteel);
      thread.castShadow = thread.receiveShadow = true;
      screwSpin.add(thread);
      screwGroup.userData.thread = thread;
      cylinder(9.2, 9.2, 18, materials.machined, screwSpin, [0, -136, 0], 24);
      cylinder(9.2, 9.2, 18, materials.machined, screwSpin, [0, 136, 0], 24);
      screwExp.add(screwGroup);
      setShadows(screwExp, true, true);
      tagPart(screwExp, "screw");
      (partGroups.screw ||= []).push(screwExp);
      bindAnchor("screw", screwGroup, [0, 0, 20]);
      motion.screwSpin = screwSpin;
    }
    const bearingsExp = addExplode("bearingBlocks", new THREE4.Group(), yDrive, [0, 0, 0], [250, 100, 30], 0.58);
    const bearingCovers = [];
    {
      const lblock = new THREE4.Group();
      lblock.position.set(-104, 313, -186);
      lblock.rotation.z = -Math.PI / 2;
      cylinder(23, 23, 30, materials.castIronDark, lblock, [0, 0, 0], 32);
      cylinder(17, 17, 33, materials.steelDark, lblock, [0, 0, 0], 28);
      for (let k = 0; k < 2; k++) {
        const b = new THREE4.Group();
        b.position.set(0, (k - 0.5) * 9.5, 0);
        cylinder(12.5, 12.5, 4, materials.polishedSteel, b, [0, 0, 0], 32);
        cylinder(7.5, 7.5, 5, materials.steelDark, b, [0, 0, 0], 24);
        const ring = new THREE4.Mesh(new THREE4.TorusGeometry(9.7, 1, 6, 32), materials.steel);
        ring.rotation.x = Math.PI / 2;
        b.add(ring);
        lblock.add(b);
      }
      const lCover = box(42, 42, 8, materials.aluminumDark, lblock, [0, 0, 19], 2, 2);
      const lCoverBolt = addBolts(lblock, [
        [-13, 13, 23.5, 0, 0, 0],
        [13, 13, 23.5, 0, 0, 0],
        [-13, -13, 23.5, 0, 0, 0],
        [13, -13, 23.5, 0, 0, 0]
      ], materials.steel, 2.5, 1.6);
      bearingCovers.push(lCover);
      bearingsExp.add(lblock);
      addSmallDisplayLabel(bearingsExp, [
        { text: "FIXED / 7000C PAIR", size: 24, color: "rgba(207,219,228,.52)" }
      ], [-104, 284, -154], [0, 0, 0], 54, 11, 0.55);
      const rblock = new THREE4.Group();
      rblock.position.set(170, 313, -186);
      box(38, 38, 40, materials.aluminumDark, rblock, [0, 0, 0], 2, 2);
      cylinder(15, 15, 43, materials.steelDark, rblock, [0, 0, 0], 32);
      cylinder(8.6, 8.6, 52, materials.polishedSteel, rblock, [0, 0, 0], 24);
      addBolts(rblock, [
        [-13, 14, -17, 0, 0, 0],
        [13, 14, -17, 0, 0, 0],
        [-13, 14, 17, 0, 0, 0],
        [13, 14, 17, 0, 0, 0]
      ], materials.steel, 2.8, 1.8);
      bearingsExp.add(rblock);
      addSmallDisplayLabel(bearingsExp, [
        { text: "FLOATING / DEEP GROOVE", size: 22, color: "rgba(200,213,223,.44)" }
      ], [170, 285, -156], [0, 0, 0], 58, 11, 0.5);
      bearingsExp.userData.sectionHide = bearingCovers;
      setShadows(bearingsExp, true, true);
      register("bearingEnds", bearingsExp);
    }
    const yCarriage = new THREE4.Group();
    yCarriage.name = "YStage";
    yDrive.add(yCarriage);
    motion.yCarriage = yCarriage;
    {
      const stagePlate = box(70, 17, 55, materials.blackAnodized, yCarriage, [0, 287, -220], 2, 2);
      box(56, 3, 45, materials.machined, yCarriage, [0, 296, -220], 1, 2);
      for (const sx of [-35, 35]) {
        box(54, 17, 38, materials.aluminumDark, yCarriage, [sx, 299, -215], 2, 2);
        box(40, 3, 2, materials.steel, yCarriage, [sx, 289, -234.2], 0.6, 1);
      }
      box(36, 28, 38, materials.bronze, yCarriage, [0, 313, -186], 2, 2);
      cylinder(15, 15, 12, materials.machined, yCarriage, [0, 313, -186], 28).rotation.z = Math.PI / 2;
      box(44, 56, 38, materials.aluminum, yCarriage, [0, 310, -214], 2.4, 3);
      box(74, 14, 62, materials.blackAnodized, yCarriage, [0, 281, -218], 2, 2);
      addBolts(yCarriage, [
        [-23, 318, -230.5, Math.PI / 2, 0, 0],
        [23, 318, -230.5, Math.PI / 2, 0, 0],
        [-23, 294, -230.5, Math.PI / 2, 0, 0],
        [23, 294, -230.5, Math.PI / 2, 0, 0]
      ], materials.steel, 3.2, 2);
      setShadows(yCarriage, true, true);
      tagPart(stagePlate, "stage");
      (partGroups.stage ||= []).push(stagePlate);
    }
    motion.yStage = yCarriage;
    motion.railExp = railExp;
    motion.screwGroup = screwGroup;
    motion.couplingRotor = couplingGroup.userData.rotor;
    motion.motorRotor = motorGroup;
    motion.screwThread = screwGroup.userData.thread;
    motion.bearingCover = bearingsExp.userData.sectionHide;
    motion.motorGroup = motorGroup;
    motion.couplingGroup = couplingGroup;
    setShadows(yDrive, true, true);
    register("stage", yCarriage);
    register("screw", screwGroup);
    register("motor", motorExp);
    register("coupling", couplingExp);
    register("rail", railExp);
  }
  const datumExp = addExplode("datumFrame", new THREE4.Group(), yDrive, [0, 0, 0], [0, 60, 90], 0.6);
  const datumFrame = datumExp;
  {
    box(330, 12, 24, materials.aluminum, datumFrame, [0, 276, -238], 2, 2);
    box(318, 2.2, 19, materials.machined, datumFrame, [0, 282.5, -238], 0.8, 1);
    for (const s of [-1, 1]) {
      box(12, 34, 24, materials.aluminumDark, datumFrame, [s * 152, 289, -238], 1.6, 2);
    }
    addBolts(datumFrame, [
      [-142, 284, -238, 0, 0, 0],
      [142, 284, -238, 0, 0, 0],
      [-105, 284, -238, 0, 0, 0],
      [105, 284, -238, 0, 0, 0]
    ], materials.steel, 3.5, 2.2);
    addSmallDisplayLabel(datumFrame, [
      { text: "DATUM A\u9225\u63C3  /  k = 11", size: 26, color: "rgba(118,220,231,.58)" },
      { text: "W 258.88 mm", size: 16, color: "rgba(150,184,194,.35)" }
    ], [0, 288, -250.1], [0, 0, 0], 72, 16, 0.7);
  }
  function makeBallA() {
    const wrapper = addExplode("ballA", new THREE4.Group(), datumFrame, [-I.ballSpan, 0, 0], [-110, 10, -30], 0.78);
    const assembly = new THREE4.Group();
    wrapper.add(assembly);
    const slider = new THREE4.Group();
    assembly.add(slider);
    box(30, 18, 38, materials.aluminumDark, assembly, [0, 286, -238], 1.8, 2);
    const micro = createMicrometerHead(materials, knurlMat, { scale: 0.72 });
    micro.position.set(0, 296, -238);
    micro.rotation.set(0, 0, Math.PI / 2);
    assembly.add(micro);
    const arm = box(20, 112, 30, materials.aluminum, slider, [0, 223.5, -238], 2, 2);
    box(2, 104, 22, materials.machined, slider, [10.2, 222, -238], 0.4, 1);
    addLinearTicks(slider, {
      length: 96,
      count: 20,
      origin: [10.8, 172, -228],
      axis: "y",
      normal: "x",
      majorEvery: 5,
      opacity: 0.35
    });
    box(28, 24, 36, materials.aluminumDark, slider, [0, 281, -238], 1.8, 2);
    cylinder(9, 9, 10, materials.steelDark, slider, [0, 163, -238], 20);
    cylinder(8.2, 8.2, 6, materials.brass, slider, [0, 169, -238], 24);
    const ball = sphere(8, materials.chrome, slider, [0, 150, -238], 32, "LocatorBallA");
    bindAnchor("ballA", ball);
    register("ballA", slider);
    wrapper.userData.slider = slider;
    wrapper.userData.thimble = micro.userData.thimble;
    bindAnchor("armA", arm, [0, 0, 20]);
    return { wrapper, slider, micro, ball };
  }
  function makeBallB() {
    const wrapper = addExplode("ballB", new THREE4.Group(), datumFrame, [I.ballSpan, 0, 0], [110, 10, -30], 0.78);
    const assembly = new THREE4.Group();
    wrapper.add(assembly);
    box(34, 16, 36, materials.aluminumDark, assembly, [0, 287, -238], 1.8, 2);
    box(10, 39, 17, materials.aluminum, assembly, [0, 260, -238], 1.5, 2);
    const slider = new THREE4.Group();
    assembly.add(slider);
    box(18, 8, 22, materials.steelDark, slider, [0, 249, -238], 1.2, 2);
    box(20, 40, 28, materials.aluminum, slider, [0, 222, -238], 1.8, 2);
    cylinder(3.2, 3.2, 36, materials.steel, slider, [0, 185, -238], 16);
    cylinder(9, 9, 10, materials.steelDark, slider, [0, 163, -238], 20);
    const ball = sphere(8, materials.chrome, slider, [0, 150, -238], 32, "LocatorBallB");
    const springGroup = new THREE4.Group();
    springGroup.position.set(0, 266, -222);
    const springGeo = createCoilGeometry({ radius: 5.2, wire: 0.75, pitch: 3.1, turns: 9, segments: 24 });
    const spring = new THREE4.Mesh(springGeo, materials.springSteel);
    spring.rotation.x = Math.PI;
    spring.position.y = -3;
    spring.castShadow = true;
    springGroup.add(spring);
    cylinder(2.2, 2.2, 25, materials.steelDark, springGroup, [0, -14, 0], 12);
    assembly.add(springGroup);
    const springTop = box(13, 5, 13, materials.blackAnodized, assembly, [0, 268, -222], 1, 2);
    const springBottom = box(12, 4, 12, materials.steel, slider, [0, 247, -222], 1, 2);
    bindAnchor("ballB", ball);
    register("ballB", slider);
    register("spring", springGroup);
    wrapper.userData.slider = slider;
    wrapper.userData.spring = springGroup;
    wrapper.userData.springMesh = spring;
    wrapper.userData.springLimits = [springTop, springBottom];
    bindAnchor("armB", assembly, [0, 260, 0]);
    return { wrapper, slider, springGroup, spring, ball };
  }
  const ballA = makeBallA();
  const ballB = makeBallB();
  tagPart(datumFrame, "dualBall");
  (partGroups.dualBall ||= []).push(datumFrame);
  register("armA", ballA.wrapper);
  register("armB", ballB.wrapper);
  bindAnchor("dualBall", datumFrame, [0, 250, -238]);
  const datumFill = new THREE4.PointLight(16769730, 0, 230, 0);
  datumFill.position.set(0, 205, -188);
  datumFill.castShadow = false;
  datumFrame.add(datumFill);
  motion.datumFill = datumFill;
  const pulseGroup = new THREE4.Group();
  pulseGroup.visible = false;
  {
    const geom = new THREE4.BufferGeometry();
    const vertices = new Float32Array([
      -I.ballSpan,
      150,
      -238,
      I.ballSpan,
      150,
      -238
    ]);
    geom.setAttribute("position", new THREE4.BufferAttribute(vertices, 3));
    const lineMat = new THREE4.LineBasicMaterial({
      color: new THREE4.Color(COLORS.red).multiplyScalar(1.45),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE4.NormalBlending,
      toneMapped: false
    });
    const line = new THREE4.Line(geom, lineMat);
    line.renderOrder = 12;
    line.frustumCulled = false;
    line.raycast = () => {
    };
    pulseGroup.add(line);
    const ringMat = new THREE4.MeshBasicMaterial({
      color: new THREE4.Color(COLORS.amber).multiplyScalar(1.8),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE4.NormalBlending,
      toneMapped: false
    });
    const rings = [];
    for (let i = 0; i < 2; i++) {
      const r = new THREE4.Mesh(new THREE4.TorusGeometry(12.4, 0.55, 5, 40), ringMat);
      r.rotation.x = Math.PI / 2;
      r.position.set((i ? 1 : -1) * I.ballSpan, 150, -238);
      r.renderOrder = 13;
      r.frustumCulled = false;
      r.raycast = () => {
      };
      pulseGroup.add(r);
      rings.push(r);
    }
    pulseGroup.userData = { line, lineMat, ringMat, rings, geom, time: 0 };
    datumFrame.add(pulseGroup);
  }
  motion.screwAngle = 0;
  motion.xCoarse = I.xCoarseIdle;
  motion.ballDrop = 0;
  motion.ballA = ballA;
  motion.ballB = ballB;
  motion.pulseGroup = pulseGroup;
  motion.yDrive = yDrive;
  const headGroup = new THREE4.Group();
  headGroup.name = "ReversalAndTransferHead";
  motion.yStage.add(headGroup);
  motion.headGroup = headGroup;
  const rotor = new THREE4.Group();
  rotor.name = "ReversalRotor";
  rotor.position.set(0, 246, -215);
  headGroup.add(rotor);
  motion.rotor = rotor;
  const headAnchors = {};
  box(56, 26, 54, materials.aluminum, headGroup, [0, 274, -215], 2.4, 2);
  box(70, 9, 70, materials.blackAnodized, headGroup, [0, 286, -215], 2, 2);
  addBolts(headGroup, [
    [-22, 291, -232, 0, 0, 0],
    [22, 291, -232, 0, 0, 0],
    [-22, 291, -198, 0, 0, 0],
    [22, 291, -198, 0, 0, 0]
  ], materials.steel, 3.2, 2);
  const bearingFixed = new THREE4.Group();
  bearingFixed.position.set(0, 254, -215);
  headGroup.add(bearingFixed);
  {
    cylinder(30, 30, 16, materials.machined, bearingFixed, [0, 0, 0], 48);
    cylinder(24, 24, 17, materials.blackAnodized, bearingFixed, [0, 0.5, 0], 48);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const clamp2 = box(14, 7, 20, materials.aluminumDark, bearingFixed, [Math.cos(a) * 28, 9, Math.sin(a) * 28], 1.3, 2);
      clamp2.rotation.y = -a;
    }
    addDialTicks(bearingFixed, 37, 11, 96, 9415096);
    const idx = box(2.5, 4, 10, materials.cyanGlow, bearingFixed, [0, 12, 38], 0.4, 1);
    idx.raycast = () => {
    };
    const pointer = new THREE4.Mesh(new THREE4.ConeGeometry(2.2, 8, 3), new THREE4.MeshBasicMaterial({
      color: new THREE4.Color(COLORS.cyan).multiplyScalar(1.6),
      toneMapped: false
    }));
    pointer.position.set(0, 12.5, 42);
    pointer.rotation.x = Math.PI / 2;
    pointer.raycast = () => {
    };
    bearingFixed.add(pointer);
    const bearing = new THREE4.Group();
    const rollerGeo = new THREE4.CylinderGeometry(1.25, 1.25, 6.5, 10);
    const rollers = new THREE4.InstancedMesh(rollerGeo, materials.polishedSteel, 28);
    const dummy = new THREE4.Object3D();
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 21.2, 8.2, Math.sin(a) * 21.2);
      dummy.rotation.set(Math.PI / 2, 0, -a + (i % 2 ? Math.PI / 2 : 0));
      dummy.updateMatrix();
      rollers.setMatrixAt(i, dummy.matrix);
    }
    rollers.instanceMatrix.needsUpdate = true;
    rollers.castShadow = true;
    bearing.add(rollers);
    cylinder(17, 17, 9, materials.steelDark, bearing, [0, 8, 0], 32);
    rotor.add(bearing);
    rotor.userData.innerBearing = bearing;
    register("bearing", bearingFixed);
    bindAnchor("bearing", bearingFixed, [0, 8, 0]);
  }
  {
    cylinder(28, 28, 8, materials.aluminum7075, rotor, [0, 4, 0], 48);
    cylinder(22, 22, 10, materials.steel, rotor, [0, 0, 0], 32);
  }
  const reversalMechanism = new THREE4.Group();
  headGroup.add(reversalMechanism);
  {
    const rackGroup = new THREE4.Group();
    rackGroup.position.set(0, 0, 0);
    const toothMat = materials.steel;
    const rackTeeth = [];
    const rackRadius = 62;
    for (let i = 0; i < 24; i++) {
      const a = (-36 + i * 3.1) * DEG;
      const pos = [Math.sin(a) * rackRadius, -7, Math.cos(a) * rackRadius];
      const b = box(3.2, 5, 5.5, toothMat, rackGroup, pos, 0.5, 1);
      b.rotation.y = a;
      rackTeeth.push(b);
    }
    const arc = torus(rackRadius, 2.2, materials.aluminumDark, rackGroup, [0, -10.5, 0], [Math.PI / 2, 0, 0], 48, 6);
    rackGroup.rotation.y = 0;
    rotor.add(rackGroup);
    rotor.userData.rack = rackGroup;
    tagPart(rackGroup, "rack");
    (partGroups.rack ||= []).push(rackGroup);
    const pinion = new THREE4.Group();
    const gearData = createSimpleGearGeometry(40, 0.5, 7);
    const pinionMesh = new THREE4.Mesh(gearData.geo, materials.polishedSteel);
    pinionMesh.castShadow = true;
    pinion.add(pinionMesh);
    cylinder(5, 5, 19, materials.steel, pinion, [0, 0, 0], 20);
    pinion.position.set(68, 239.5, -242);
    headGroup.add(pinion);
    motion.rackPinion = pinion;
    const diff = createMicrometerHead(materials, knurlMat, { scale: 0.55 });
    diff.position.set(68, 259, -242);
    diff.rotation.x = 0;
    headGroup.add(diff);
    motion.reversalKnob = diff.userData.thimble;
    box(42, 8, 16, materials.aluminum, headGroup, [47, 280, -230], 1.5, 2);
    box(8, 20, 10, materials.aluminumDark, headGroup, [68, 270, -230], 1.2, 2);
    box(8, 6, 14, materials.aluminumDark, headGroup, [68, 260, -236], 1.1, 2);
    addSmallDisplayLabel(headGroup, [
      { text: "m 0.5  /  Z 40", size: 28, color: "rgba(206,220,229,.52)" },
      { text: "M4 DIFFERENTIAL", size: 16, color: "rgba(155,175,189,.33)" }
    ], [68, 228, -231], [0, 0, 0], 48, 12, 0.6);
    const lockGroup = new THREE4.Group();
    lockGroup.position.set(-63, 255, -238);
    box(20, 16, 26, materials.aluminumDark, lockGroup, [0, 12, 0], 1.5, 2);
    const pin = cylinder(2, 2, 22, materials.brass, lockGroup, [0, -2, 0], 18);
    cylinder(5.4, 5.4, 4, knurlMat, lockGroup, [0, 18, 0], 24);
    lockGroup.userData.pin = pin;
    headGroup.add(lockGroup);
    motion.lockPin = pin;
    motion.lockGroup = lockGroup;
    tagPart(lockGroup, "reversalPin");
    (partGroups.reversalPin ||= []).push(lockGroup);
    bindAnchor("reversalPin", lockGroup, [0, 4, 0]);
    bindAnchor("rack", rackGroup, [0, -4, 42]);
  }
  const transferExpl = addExplode("transfer", new THREE4.Group(), rotor, [0, 0, 0], [0, -80, 40], 0.8);
  const transfer = transferExpl;
  const transferAnchors = {};
  const headShell = new THREE4.Group();
  transfer.add(headShell);
  {
    box(112, 8, 102, materials.aluminum7075, headShell, [0, -58, 0], 2.4, 3);
    const nearWall = [];
    for (const s of [-1, 1]) {
      const side = box(7, 52, 102, materials.aluminumDark, headShell, [s * 52, -32, 0], 1.8, 3);
      const inset = box(1.5, 23, 67, materials.blackAnodizedMatte, headShell, [s * 55.8, -30, 0], 0.5, 2);
      if (s === 1) nearWall.push(side, inset);
    }
    box(102, 52, 7, materials.aluminumDark, headShell, [0, -32, -49], 1.8, 3);
    box(94, 5, 4, materials.aluminum, headShell, [0, -57, 51], 1, 2);
    box(112, 6, 7, materials.aluminumDark, headShell, [0, -5, -49], 1.4, 2);
    box(7, 6, 96, materials.aluminumDark, headShell, [-52, -5, 0], 1.4, 2);
    const topNear = box(7, 6, 96, materials.aluminumDark, headShell, [52, -5, 0], 1.4, 2);
    nearWall.push(topNear);
    const glass = box(88, 44, 2, materials.glass, headShell, [0, -31, 50], 1.2, 2);
    glass.raycast = () => {
    };
    glass.renderOrder = 4;
    const glassFrame = new THREE4.Group();
    box(92, 3, 4, materials.aluminum, glassFrame, [0, -9, 51.2], 0.6, 2);
    box(92, 3, 4, materials.aluminum, glassFrame, [0, -53, 51.2], 0.6, 2);
    box(3, 44, 4, materials.aluminum, glassFrame, [-45, -31, 51.2], 0.6, 2);
    box(3, 44, 4, materials.aluminum, glassFrame, [45, -31, 51.2], 0.6, 2);
    headShell.add(glassFrame);
    const sectionFrame = new THREE4.Group();
    sectionFrame.visible = false;
    const boxGeo = new THREE4.EdgesGeometry(new THREE4.BoxGeometry(96, 48, 4));
    const edges = new THREE4.LineSegments(boxGeo, new THREE4.LineBasicMaterial({
      color: 10345445,
      transparent: true,
      opacity: 0.55,
      toneMapped: false
    }));
    edges.position.set(0, -31, 50.5);
    edges.raycast = () => {
    };
    sectionFrame.add(edges);
    headShell.add(sectionFrame);
    headShell.userData.sectionHide = [glass, glassFrame, ...nearWall];
    headShell.userData.sectionShow = [sectionFrame];
    const stripMat = new THREE4.MeshStandardMaterial({
      color: 1446669,
      emissive: 16757870,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.1
    });
    box(48, 1.2, 1.1, stripMat, headShell, [0, -9, -41], 0.2, 1);
    cylinder(7, 8, 5, materials.steelDark, headShell, [0, -60, 0], 24);
    addBolts(headShell, [
      [-44, -54, 50, Math.PI / 2, 0, 0],
      [44, -54, 50, Math.PI / 2, 0, 0],
      [-44, -17, 50, Math.PI / 2, 0, 0],
      [44, -17, 50, Math.PI / 2, 0, 0]
    ], materials.steel, 2.2, 1.6);
    addSmallDisplayLabel(headShell, [
      { text: "MICRO TRANSFER", size: 22, color: "rgba(200,225,232,.45)" },
      { text: "3 : 1  /  \xB15\xB0 LIMIT", size: 14, color: "rgba(140,178,190,.32)" }
    ], [0, -56, 52.2], [0, 0, 0], 58, 13, 0.55);
    const cutSurfMat = materials.machinedEdge.clone();
    cutSurfMat.side = THREE4.DoubleSide;
    const cutFace = new THREE4.Mesh(new THREE4.PlaneGeometry(88, 40), cutSurfMat);
    cutFace.position.set(0, -31, 49);
    cutFace.visible = false;
    cutFace.raycast = () => {
    };
    headShell.add(cutFace);
    headShell.userData.cutFace = cutFace;
    const bayLight = new THREE4.PointLight(16766899, 1.8, 260, 0);
    bayLight.position.set(0, -31, 24);
    bayLight.castShadow = false;
    headShell.add(bayLight);
    headShell.userData.bayLight = bayLight;
    setShadows(headShell, true, true);
  }
  const flexureExpl = addExplode("flexure", new THREE4.Group(), transfer, [0, 0, 0], [-120, 180, 100], 1.02);
  {
    const flex = new THREE4.Group();
    flex.position.set(-15, -46, 0);
    const leaf = box(14, 8, 0.45, materials.bronze, flex, [0, 0, 0], 0.3, 1, null, "SingleLeafSpring");
    box(15, 3, 4, materials.steelDark, flex, [0, 5, 0], 0.7, 2);
    box(15, 3, 4, materials.steelDark, flex, [0, -5, 0], 0.7, 2);
    box(8, 13, 8, materials.aluminum, flex, [-7.5, 0, 0], 1, 2);
    transfer.add(flex);
    flexureExpl.add(flex);
    register("flexure", leaf);
    bindAnchor("flexure", leaf, [0, 0, 1]);
    flexureExpl.userData.leaf = leaf;
  }
  const leverExpl = addExplode("lever", new THREE4.Group(), transfer, [0, 0, 0], [150, 45, 130], 1.08);
  let leverPivot;
  {
    leverPivot = new THREE4.Group();
    leverPivot.position.set(-15, -46, 0);
    const bar = box(66, 6, 10, materials.aluminum, leverPivot, [18, 0, 0], 1.2, 2, null, "PrecisionLever");
    box(10, 7, 12, materials.steelDark, leverPivot, [15, 0, 0], 1, 2);
    cylinder(3.4, 3.4, 8, materials.steel, leverPivot, [15, 0, 0], 16);
    box(12, 7, 9, materials.brass, leverPivot, [45, 0, 0], 1, 2);
    const stylusExpl = addExplode("stylus", new THREE4.Group(), transfer, [0, 0, 0], [-120, -310, 0], 1.15);
    const stylusMotion = new THREE4.Group();
    stylusMotion.position.set(0, 0, 0);
    stylusExpl.add(stylusMotion);
    {
      const collet = cylinder(4.6, 4.6, 9, materials.steelDark, stylusMotion, [0, -45.5, 0], 20);
      const rod = cylinder(1.5, 1.5, 32.8, materials.tungsten, stylusMotion, [0, -62.4, 0], 20, null, null, "TungstenStylus");
      const neck = cylinder(2.2, 1.2, 4.2, materials.tungsten, stylusMotion, [0, -80.5, 0], 18);
      const ruby = sphere(1.7, materials.ruby, stylusMotion, [0, -84.3, 0], 32, "RubyProbe");
      register("ruby", ruby);
      bindAnchor("ruby", ruby);
      transferAnchors.ruby = ruby;
      const stylusGroup = new THREE4.Group();
      stylusGroup.add(collet, rod, neck, ruby);
      stylusMotion.add(stylusGroup);
      tagPart(stylusMotion, "stylus");
      (partGroups.stylus ||= []).push(stylusMotion);
      bindAnchor("stylus", rod, [0, 0, 0]);
      stylusMotion.userData.rod = rod;
      stylusMotion.userData.ruby = ruby;
      stylusExpl.userData.motion = stylusMotion;
      levers: {
        const link = box(3, 10, 1.2, materials.bronze, stylusMotion, [0, -44.5, 0], 0.3, 1);
        link.rotation.x = 0.1;
      }
    }
    transfer.add(stylusExpl);
    leverExpl.add(leverPivot);
    transfer.add(leverExpl);
    register("lever", bar);
    bindAnchor("lever", bar, [0, 3, 0]);
    const lvdtExpl = addExplode("lvdt", new THREE4.Group(), transfer, [0, 0, 0], [280, 30, -80], 1.22);
    {
      const ly = -46, lx = 30;
      const housing = cylinder(8, 8, 40, materials.steel, lvdtExpl, [lx, ly, -38], 32);
      housing.rotation.x = Math.PI / 2;
      for (const z of [-20, -55]) {
        const nut = cylinder(10.5, 10.5, 4, materials.steelDark, lvdtExpl, [lx, ly, z], 24);
        nut.rotation.x = Math.PI / 2;
      }
      cylinder(4.2, 4.2, 7, materials.aluminumDark, lvdtExpl, [lx, ly, -12], 20).rotation.x = Math.PI / 2;
      const plunger = cylinder(1.35, 1.35, 39, materials.polishedSteel, lvdtExpl, [lx, ly, -7], 16);
      plunger.rotation.x = Math.PI / 2;
      const plungerTip = sphere(2, materials.polishedSteel, lvdtExpl, [lx, ly, 12.5], 18);
      const curve = new THREE4.CatmullRomCurve3([
        new THREE4.Vector3(lx, ly, -58),
        new THREE4.Vector3(30, ly + 4, -68),
        new THREE4.Vector3(25, ly + 30, -60),
        new THREE4.Vector3(18, -7, -20)
      ]);
      const cable = new THREE4.Mesh(new THREE4.TubeGeometry(curve, 30, 1.2, 5, false), materials.rubber);
      cable.castShadow = true;
      cable.raycast = () => {
      };
      lvdtExpl.add(cable);
      transfer.add(lvdtExpl);
      tagPart(lvdtExpl, "lvdt");
      (partGroups.lvdt ||= []).push(lvdtExpl);
      bindAnchor("lvdt", housing);
      lvdtExpl.userData.plunger = plungerTip;
      lvdtExpl.userData.plungerRod = plunger;
      lvdtExpl.userData.anchor = housing;
    }
    const springExpl = addExplode("preloadSpring", new THREE4.Group(), transfer, [0, 0, 0], [-190, 20, 140], 1.26);
    {
      const sg = new THREE4.Group();
      sg.position.set(20, -42, -24);
      const coil = new THREE4.Mesh(createCoilGeometry({ radius: 3.8, wire: 0.6, pitch: 2.9, turns: 7, segments: 22 }), materials.springSteel);
      coil.rotation.x = Math.PI / 2;
      coil.position.z = -2;
      coil.castShadow = true;
      sg.add(coil);
      box(9, 8, 5, materials.steelDark, sg, [0, 0, -24], 1, 2);
      cylinder(2.5, 2.5, 17, materials.steel, sg, [0, 0, 0], 16);
      transfer.add(springExpl);
      springExpl.add(sg);
      register("spring", coil);
      bindAnchor("spring", coil, [0, 0, 0]);
      springExpl.userData.coil = coil;
    }
    const limitGroup = new THREE4.Group();
    for (const s of [-1, 1]) {
      const lb = box(8, 10, 4, materials.ptfe, limitGroup, [30, -46, s * 9.5], 0.6, 2);
      lb.rotation.x = s * 0.03;
    }
    transfer.add(limitGroup);
    box(39, 3, 7, materials.aluminumDark, transfer, [0, -39, 0], 0.8, 2);
    addLinearTicks(transfer, {
      length: 54,
      count: 18,
      origin: [-6, -35, -52],
      axis: "x",
      normal: "y",
      majorEvery: 3,
      color: 10337480,
      opacity: 0.35
    });
    addSmallDisplayLabel(transfer, [
      { text: "\xB15\xB0", size: 24, color: "rgba(210,224,230,.42)" }
    ], [31, -33, -2], [0, 0, 0], 18, 10, 0.55);
    motion.leverPivot = leverPivot;
    motion.flexureExpl = flexureExpl;
    motion.stylusExpl = stylusExpl;
    motion.stylusMotion = stylusExpl.userData.motion;
    motion.lvdtExpl = lvdtExpl;
    motion.springExpl = springExpl;
    motion.transfer = transfer;
    setShadows(transfer, true, true);
  }
  motion.alphaTarget = CFG.reversal.angle;
  motion.alphaCurrent = CFG.reversal.angle;
  xCarriage.position.z = I.xCarriageOriginZ - I.xCoarseIdle;
  motion.yStage.position.x = 0;
  rotor.rotation.y = -deg(CFG.reversal.angle);
  motion.lockPin.position.y = 8;
  motion.lockPin.visible = false;
  motion.indicators = indicators;
  motion.apply = ({ s, xCoarse, alphaDeg, ballDrop, visualDelta, forceN, lockPinned, motorAngle, micrometer = 0, headLift = 0 }) => {
    motion.xCoarse = xCoarse;
    xCarriage.position.z = I.xCarriageOriginZ - xCoarse;
    const stageGroup = motion.yStage;
    const stageX = s - CFG.scan.length / 2;
    stageGroup.position.x = stageX;
    stageGroup.position.y = headLift;
    motion.screwAngle = motorAngle;
    if (motion.screwSpin) motion.screwSpin.rotation.y = motorAngle;
    if (motion.couplingRotor) motion.couplingRotor.rotation.y = -motorAngle;
    if (motion.reversalKnob) motion.reversalKnob.rotation.y = deg(alphaDeg) * 4.2;
    if (motion.rackPinion) motion.rackPinion.rotation.y = -deg(alphaDeg) * 6.2;
    rotor.rotation.y = -deg(alphaDeg);
    const pinTarget = lockPinned ? 8 : 20.5;
    motion.lockPin.position.y += (pinTarget - motion.lockPin.position.y) * 0.18;
    motion.lockPin.visible = true;
    const drop = clamp(ballDrop, 0, 1);
    const ballY = lerp(182, 168, drop);
    ballA.slider.position.y = ballY - 150;
    ballB.slider.position.y = ballY - 150;
    const compression = 1 - 0.13 * drop - clamp((forceN - 0.1) / 0.4, 0, 1) * 0.035;
    const sg = ballB.springGroup;
    sg.scale.y = compression;
    sg.position.y = 266 + (ballY - 150) * 0.34;
    ballA.micro.userData.thimble.rotation.y = -deg(drop * 78) + micrometer * 7.5;
    ballA.slider.position.x = clamp(micrometer, -0.99, 0.99) * 2.2;
    const v = clamp(visualDelta, -1.32, 1.32);
    const theta = v / 15;
    leverPivot.rotation.y = -theta;
    motion.stylusMotion.position.z = v;
    if (motion.flexureExpl?.userData.leaf) {
      motion.flexureExpl.userData.leaf.rotation.y = -theta * 0.18;
    }
    if (motion.lvdtExpl?.userData.plunger) {
      motion.lvdtExpl.userData.plunger.position.z = 12.5 + v * 3;
      motion.lvdtExpl.userData.plungerRod.position.z = -7 + v * 3;
    }
    if (motion.springExpl?.userData.coil) {
      motion.springExpl.userData.coil.position.z = -2 - v * 0.55;
    }
    motion.visualDelta = v;
    const line = pulseGroup.userData.line;
    const pos = line.geometry.attributes.position.array;
    pos[1] = ballY + 4;
    pos[4] = ballY + 4;
    line.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < pulseGroup.userData.rings.length; i++) {
      pulseGroup.userData.rings[i].position.y = ballY + 4;
    }
    anchors.alphaWorld = rotor;
  };
  motion.setDatumPulse = (on, strength = 1) => {
    pulseGroup.visible = on;
    pulseGroup.userData.target = strength;
  };
  const partObjects = partGroups;
  motion.anchors = anchors;
  motion.partObjects = partObjects;
  motion.explodeGroups = explodeGroups;
  motion.transferAnchors = transferAnchors;
  motion.headShell = headShell;
  motion.sectionHide = headShell.userData.sectionHide;
  motion.sectionShow = headShell.userData.sectionShow;
  motion.bearingSectionHide = motion.bearingCover;
  motion.apply({
    s: 0,
    xCoarse: I.xCoarseIdle,
    alphaDeg: CFG.reversal.angle,
    ballDrop: 0,
    visualDelta: 0,
    forceN: 0.3,
    lockPinned: false,
    motorAngle: 0
  });
  setShadows(root, true, true);
  root.traverse((o) => {
    if (o.isMesh && o.material?.transparent) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
  anchors.ballA = anchors.ballA || null;
  return {
    root,
    motion,
    anchors,
    partGroups,
    explodeGroups,
    clickables,
    initialXCoarse: I.xCoarseIdle,
    measurementXCoarse: I.xCoarseMeasurement
  };
}
var I;
var init_instrument = __esm({
  "src/instrument.js"() {
    init_config();
    init_utils();
    I = LAYOUT.instrument;
  }
});

// src/gear.js
import * as THREE5 from "three";
function topSurface(r0, r1, a0, a1, y, segments, material) {
  const nA = Math.max(2, segments);
  const pos = [], uv = [], idx = [];
  const rows = 2;
  for (let i = 0; i < rows; i++) {
    const r = i === 0 ? r0 : r1;
    for (let j = 0; j <= nA; j++) {
      const a = a0 + (a1 - a0) * (j / nA);
      pos.push(Math.sin(a) * r, y, Math.cos(a) * r);
      uv.push((r - r0) / Math.max(1, r1 - r0), j / nA);
    }
  }
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < nA; j++) {
      const p = i * (nA + 1) + j;
      idx.push(p, p + nA + 1, p + nA + 2, p, p + nA + 2, p + 1);
    }
  }
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE5.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE5.Mesh(geo, material);
}
function bottomSurface(r0, r1, a0, a1, y, segments, material) {
  const nA = Math.max(2, segments);
  const pos = [], idx = [];
  for (let i = 0; i < 2; i++) {
    const r = i === 0 ? r0 : r1;
    for (let j = 0; j <= nA; j++) {
      const a = a0 + (a1 - a0) * (j / nA);
      pos.push(Math.sin(a) * r, y, Math.cos(a) * r);
    }
  }
  for (let j = 0; j < nA; j++) {
    const p = j;
    idx.push(p, p + 1, p + nA + 2, p, p + nA + 2, p + nA + 1);
  }
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE5.Mesh(geo, material);
}
function cylindricalWall(r, a0, a1, y0, y1, segments, material, inward = false) {
  const nA = Math.max(2, segments);
  const pos = [], idx = [];
  for (let j = 0; j <= nA; j++) {
    const a = a0 + (a1 - a0) * (j / nA);
    pos.push(Math.sin(a) * r, y0, Math.cos(a) * r);
    pos.push(Math.sin(a) * r, y1, Math.cos(a) * r);
  }
  for (let j = 0; j < nA; j++) {
    const b0 = j * 2, t0 = j * 2 + 1, b1 = (j + 1) * 2, t1 = (j + 1) * 2 + 1;
    if (!inward) idx.push(b0, b1, t1, b0, t1, t0);
    else idx.push(b0, t1, b1, b0, t0, t1);
  }
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE5.Mesh(geo, material);
}
function radialEndFace(r0, r1, a, y0, y1, material, outwardTangent = true) {
  const pos = [
    Math.sin(a) * r0,
    y0,
    Math.cos(a) * r0,
    Math.sin(a) * r0,
    y1,
    Math.cos(a) * r0,
    Math.sin(a) * r1,
    y1,
    Math.cos(a) * r1,
    Math.sin(a) * r1,
    y0,
    Math.cos(a) * r1
  ];
  const idx = outwardTangent ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE5.Mesh(geo, material);
  return mesh;
}
function makeToothHalfGeometry(sign, yMin, yMax, layers = 10) {
  const tip = 2100;
  const root = 2038;
  const rootHalf = 0.0315;
  const profile = [
    { r: root, a: -rootHalf },
    { r: root + 11, a: -rootHalf * 0.94 },
    { r: 2056, a: -0.0238 },
    { r: 2073, a: -0.0178 },
    { r: 2089, a: -0.0128 },
    { r: 2096, a: -0.0103 },
    { r: tip, a: -69e-4 },
    { r: tip, a: 69e-4 },
    { r: 2096, a: 0.0103 },
    { r: 2089, a: 0.0128 },
    { r: 2073, a: 0.0178 },
    { r: 2056, a: 0.0238 },
    { r: root + 11, a: rootHalf * 0.94 },
    { r: root, a: rootHalf }
  ];
  for (let k = 1; k < 5; k++) {
    const t = k / 5;
    profile.push({ r: root, a: rootHalf + (-rootHalf - rootHalf) * t });
  }
  const nP = profile.length;
  const midY = 80;
  const tangent = Math.tan(CFG.gear.beta) / LAYOUT.gear.pitchR;
  const pos = [], idx = [];
  for (let l = 0; l <= layers; l++) {
    const t = l / layers;
    const y = yMin + (yMax - yMin) * t;
    const twist = sign * (y - midY) * tangent;
    for (let p = 0; p < nP; p++) {
      const { r, a } = profile[p];
      const angle = a + twist;
      pos.push(Math.sin(angle) * r, y, Math.cos(angle) * r);
    }
  }
  const layerVerts = nP;
  for (let l = 0; l < layers; l++) {
    for (let p = 0; p < nP; p++) {
      const a = l * layerVerts + p;
      const b = l * layerVerts + (p + 1) % nP;
      const c = (l + 1) * layerVerts + (p + 1) % nP;
      const d = (l + 1) * layerVerts + p;
      idx.push(a, b, d, b, c, d);
    }
  }
  function addCap(level, upward) {
    const y = level === 0 ? yMin : yMax;
    const base = pos.length / 3;
    let cx = 0, cz = 0;
    for (let p = 0; p < nP; p++) {
      const i = (level * nP + p) * 3;
      pos.push(pos[i], y, pos[i + 2]);
      cx += pos[i];
      cz += pos[i + 2];
    }
    cx /= nP;
    cz /= nP;
    pos.push(cx, y, cz);
    const centerIdx = base + nP;
    for (let p = 0; p < nP; p++) {
      const p1 = base + p;
      const p2 = base + (p + 1) % nP;
      if (upward) idx.push(centerIdx, p1, p2);
      else idx.push(centerIdx, p2, p1);
    }
  }
  addCap(0, false);
  addCap(layers, true);
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function makeWebGeometry(a0, a1, rIn, rOut, height, holes) {
  const shape = new THREE5.Shape();
  const outerPts = [];
  const innerPts = [];
  const seg = 100;
  for (let i = 0; i <= seg; i++) {
    const a = a0 + (a1 - a0) * (i / seg);
    outerPts.push(new THREE5.Vector2(Math.sin(a) * rOut, -Math.cos(a) * rOut));
    innerPts.push(new THREE5.Vector2(Math.sin(a) * rIn, -Math.cos(a) * rIn));
  }
  const pts = outerPts.concat(innerPts.reverse());
  shape.setFromPoints(pts);
  if (THREE5.ShapeUtils.isClockWise(shape.getPoints())) {
    shape.setFromPoints(pts.reverse());
  }
  for (const hole of holes) {
    const path = new THREE5.Path();
    const cx = Math.sin(hole.a) * hole.r;
    const cy = -Math.cos(hole.a) * hole.r;
    path.absarc(cx, cy, hole.radius, 0, Math.PI * 2, false);
    shape.holes.push(path);
  }
  const geo = new THREE5.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 2.2,
    bevelSize: 3.5,
    bevelSegments: 2,
    curveSegments: 48,
    steps: 1
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}
function addGearMarks(group, materials, a0, a1) {
  const positions = [];
  const rand = mulberry32(91);
  for (let r = LAYOUT.gear.innerR + 35; r < LAYOUT.gear.rootR - 10; r += 24) {
    const y = r > LAYOUT.gear.webOuterR ? LAYOUT.gear.topY + 0.18 : LAYOUT.gear.webTopY + 0.18;
    const segs = 78;
    for (let i = 0; i < segs; i++) {
      const a = a0 + (a1 - a0) * (i / segs);
      const b = a0 + (a1 - a0) * ((i + 1) / segs);
      if (rand() < 0.2) continue;
      positions.push(Math.sin(a) * r, y, Math.cos(a) * r);
      positions.push(Math.sin(b) * r, y, Math.cos(b) * r);
    }
  }
  for (let i = 0; i < 38; i++) {
    const a = a0 + (a1 - a0) * rand();
    const r0 = LAYOUT.gear.innerR + 30 + rand() * 110;
    const r1 = r0 + 20 + rand() * 80;
    const y = LAYOUT.gear.webTopY + 0.2;
    positions.push(Math.sin(a) * r0, y, Math.cos(a) * r0);
    positions.push(Math.sin(a) * r1, y, Math.cos(a) * r1);
  }
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(positions, 3));
  const mat = new THREE5.LineBasicMaterial({
    color: 5202032,
    transparent: true,
    opacity: 0.11,
    depthWrite: false,
    toneMapped: false
  });
  const lines = new THREE5.LineSegments(geo, mat);
  lines.raycast = () => {
  };
  group.add(lines);
}
function addTopEdges(group) {
  const mat = new THREE5.LineBasicMaterial({
    color: 3425619,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    toneMapped: false
  });
  const arcs = [
    { r: LAYOUT.gear.innerR + 1.5, y: LAYOUT.gear.webTopY + 0.35 },
    { r: LAYOUT.gear.webOuterR - 1.2, y: LAYOUT.gear.webTopY + 0.35 },
    { r: LAYOUT.gear.webOuterR + 1.2, y: LAYOUT.gear.topY + 0.35 },
    { r: LAYOUT.gear.rootR - 0.8, y: LAYOUT.gear.topY + 0.35 },
    { r: 1990, y: LAYOUT.gear.topY + 0.35 }
  ];
  const pts = [];
  for (const arc of arcs) {
    for (let i = 0; i < 100; i++) {
      const a = (-29 + i * 0.31) * DEG;
      const b = (-29 + (i + 1) * 0.31) * DEG;
      pts.push(Math.sin(a) * arc.r, arc.y, Math.cos(a) * arc.r);
      pts.push(Math.sin(b) * arc.r, arc.y, Math.cos(b) * arc.r);
    }
  }
  const geo = new THREE5.BufferGeometry();
  geo.setAttribute("position", new THREE5.Float32BufferAttribute(pts, 3));
  const line = new THREE5.LineSegments(geo, mat);
  line.raycast = () => {
  };
  group.add(line);
}
function addRaisedSectorBand(group, materials, {
  r0,
  r1,
  y0,
  y1,
  a0,
  a1,
  topMaterial,
  sideMaterial,
  segments = 100
}) {
  const g = new THREE5.Group();
  g.add(topSurface(r0, r1, a0, a1, y1, segments, topMaterial));
  g.add(cylindricalWall(r0, a0, a1, y0, y1, segments, sideMaterial, true));
  g.add(cylindricalWall(r1, a0, a1, y0, y1, segments, sideMaterial, false));
  g.add(radialEndFace(r0, r1, a0, y0, y1, sideMaterial, false));
  g.add(radialEndFace(r0, r1, a1, y0, y1, sideMaterial, true));
  group.add(g);
  return g;
}
function addGearFixtureDetails(group, materials, a0, a1) {
  const yTop = LAYOUT.gear.topY;
  const yWeb = LAYOUT.gear.webTopY;
  addRaisedSectorBand(group, materials, {
    r0: LAYOUT.gear.innerR + 2,
    r1: LAYOUT.gear.innerR + 62,
    y0: yWeb,
    y1: yWeb + 10,
    a0,
    a1,
    topMaterial: materials.gearMachined,
    sideMaterial: materials.gearCut,
    segments: 100
  });
  addRaisedSectorBand(group, materials, {
    r0: 1882,
    r1: 1932,
    y0: yTop,
    y1: yTop + 7,
    a0,
    a1,
    topMaterial: materials.gearCut,
    sideMaterial: materials.gearBody,
    segments: 100
  });
  addRaisedSectorBand(group, materials, {
    r0: 1872,
    r1: 1882,
    y0: yTop,
    y1: yTop + 1.4,
    a0,
    a1,
    topMaterial: materials.gearMachined,
    sideMaterial: materials.gearMachined,
    segments: 100
  });
  addRaisedSectorBand(group, materials, {
    r0: 1932,
    r1: 1944,
    y0: yTop,
    y1: yTop + 1.4,
    a0,
    a1,
    topMaterial: materials.gearMachined,
    sideMaterial: materials.gearMachined,
    segments: 100
  });
  for (const r of [1450, 1848]) {
    const band = topSurface(r, r + 4.5, a0, a1, yWeb + 0.7, 100, materials.gearGroove);
    band.raycast = () => {
    };
    group.add(band);
  }
  const holeSpecs = [
    { a: -25.2, r: 1660, radius: 118 },
    { a: -17.6, r: 1680, radius: 148 },
    { a: -9.1, r: 1670, radius: 135 }
  ];
  for (const hole of holeSpecs) {
    const ring = new THREE5.Mesh(
      new THREE5.RingGeometry(hole.radius - 1.5, hole.radius + 9, 56),
      materials.gearMachined
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(Math.sin(hole.a * DEG) * hole.r, yWeb + 0.85, Math.cos(hole.a * DEG) * hole.r);
    ring.raycast = () => {
    };
    group.add(ring);
  }
  const boltGroup = new THREE5.Group();
  const angles = [-26.9, -24, -21, -14.2, -11.8, -6, -3.6, -0.9];
  for (const degA of angles) {
    const a = degA * DEG;
    const r = 1408;
    const boss = new THREE5.Group();
    boss.position.set(Math.sin(a) * r, yWeb + 5, Math.cos(a) * r);
    cylinder(24, 27, 10, materials.gearBody, boss, [0, 0, 0], 24);
    const socket = cylinder(12.2, 12.2, 2.4, materials.gearGroove, boss, [0, 5.6, 0], 6);
    socket.raycast = () => {
    };
    boltGroup.add(boss);
  }
  group.add(boltGroup);
  for (const a of [a0, a1]) {
    for (const r of [1370, 1440]) {
      const pad = new THREE5.Group();
      pad.position.set(Math.sin(a) * r, yTop + 0.3, Math.cos(a) * r);
      const plate = cylinder(17, 19, 5, materials.gearCut, pad, [0, 0, 0], 6);
      plate.rotation.y = a;
      group.add(pad);
    }
  }
}
function addGearLabel(group, materials) {
  const plate = textPlane([
    "IN-SITU  /  HERRINGBONE GEAR RING",
    "\u03A64200  \xB7  Z 98  \xB7  mn 8  \xB7  \u03B2 28\xB021\u203227\u2033  \xB7  CLASS 4"
  ], {
    width: 660,
    height: 118,
    textureOptions: {
      width: 1400,
      height: 250,
      align: "center",
      color: "rgba(35,48,60,.58)",
      dim: "rgba(52,69,83,.38)",
      padding: 26
    },
    opacity: 0.7,
    material: new THREE5.MeshBasicMaterial({ transparent: true, depthWrite: false, toneMapped: false, side: THREE5.DoubleSide })
  });
  const a = -17.2 * DEG;
  const r = 1930;
  const pivot = new THREE5.Group();
  pivot.position.set(Math.sin(a) * r, LAYOUT.gear.topY + 0.55, Math.cos(a) * r);
  pivot.rotation.y = a;
  plate.rotation.x = -Math.PI / 2;
  plate.rotation.z = 0;
  plate.position.y = 0;
  pivot.add(plate);
  group.add(pivot);
}
function createGear(materials, contactWorld, instrumentYaw) {
  const group = new THREE5.Group();
  group.name = "GearSector";
  const a0 = LAYOUT.gear.sectorStartDeg * DEG;
  const a1 = LAYOUT.gear.sectorEndDeg * DEG;
  const rIn = LAYOUT.gear.innerR;
  const rWebOut = LAYOUT.gear.webOuterR;
  const rRoot = LAYOUT.gear.rootR;
  const yWeb = LAYOUT.gear.webTopY;
  const yTop = LAYOUT.gear.topY;
  const holes = [
    { a: -25.2 * DEG, r: 1660, radius: 118 },
    { a: -17.6 * DEG, r: 1680, radius: 148 },
    { a: -9.1 * DEG, r: 1670, radius: 135 }
  ];
  const webGeo = makeWebGeometry(a0, a1, rIn, rWebOut, yWeb, holes);
  const web = new THREE5.Mesh(webGeo, materials.gearWeb);
  web.position.y = 0;
  web.castShadow = true;
  web.receiveShadow = true;
  group.add(web);
  group.add(topSurface(rWebOut, rRoot - 44, a0, a1, yTop, 112, materials.gearBody));
  group.add(topSurface(rRoot - 44, rRoot, a0, a1, yTop, 112, materials.gearMachined));
  group.add(bottomSurface(rWebOut, rRoot, a0, a1, 0, 48, materials.gearWeb));
  group.add(cylindricalWall(rRoot, a0, a1, 0, yTop, 112, materials.gearMachined, false));
  group.add(cylindricalWall(rWebOut, a0, a1, yWeb, yTop, 112, materials.gearCut, true));
  const a0FaceRim = radialEndFace(rWebOut, rRoot, a0, 0, yTop, materials.gearCut, false);
  const a1FaceRim = radialEndFace(rWebOut, rRoot, a1, 0, yTop, materials.gearCut, true);
  group.add(a0FaceRim, a1FaceRim);
  const gap = 2.4;
  const upperGeo = makeToothHalfGeometry(1, 80 + gap / 2, yTop, LAYOUT.gear.toothLayers);
  const lowerGeo = makeToothHalfGeometry(-1, 0, 80 - gap / 2, LAYOUT.gear.toothLayers);
  const toothMat = materials.gearMachined.clone();
  toothMat.side = THREE5.DoubleSide;
  toothMat.color = new THREE5.Color(6450551);
  toothMat.roughness = 0.52;
  toothMat.metalness = 0.48;
  toothMat.clearcoat = 0.1;
  toothMat.clearcoatRoughness = 0.45;
  const upperTooth = new THREE5.InstancedMesh(upperGeo, toothMat, TOOTH_CENTERS.length);
  const lowerTooth = new THREE5.InstancedMesh(lowerGeo, toothMat, TOOTH_CENTERS.length);
  upperTooth.name = "HerringboneTeethUpper";
  lowerTooth.name = "HerringboneTeethLower";
  const dummy = new THREE5.Object3D();
  TOOTH_CENTERS.forEach((a, i) => {
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, a, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    upperTooth.setMatrixAt(i, dummy.matrix);
    lowerTooth.setMatrixAt(i, dummy.matrix);
  });
  upperTooth.instanceMatrix.needsUpdate = true;
  lowerTooth.instanceMatrix.needsUpdate = true;
  upperTooth.castShadow = lowerTooth.castShadow = true;
  upperTooth.receiveShadow = lowerTooth.receiveShadow = true;
  upperTooth.computeBoundingSphere?.();
  lowerTooth.computeBoundingSphere?.();
  group.add(upperTooth, lowerTooth);
  const undercut = new THREE5.Mesh(
    new THREE5.CylinderGeometry(1, 1, 1, 12, 1, true),
    materials.gearGroove
  );
  undercut.visible = false;
  group.add(undercut);
  addGearFixtureDetails(group, materials, a0, a1);
  addGearMarks(group, materials, a0, a1);
  addTopEdges(group);
  const cutEdgePts = [];
  for (const a of [a0, a1]) {
    for (const r of [rIn, rWebOut, rRoot]) {
      cutEdgePts.push(Math.sin(a) * r, 0.2, Math.cos(a) * r);
      cutEdgePts.push(Math.sin(a) * r, r === rRoot ? yTop + 0.2 : yWeb + 0.2, Math.cos(a) * r);
    }
  }
  const cutEdgeGeo = new THREE5.BufferGeometry();
  cutEdgeGeo.setAttribute("position", new THREE5.Float32BufferAttribute(cutEdgePts, 3));
  const cutEdges = new THREE5.LineSegments(cutEdgeGeo, new THREE5.LineBasicMaterial({
    color: 5399665,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    toneMapped: false
  }));
  cutEdges.raycast = () => {
  };
  group.add(cutEdges);
  addGearLabel(group, materials);
  const Rcontact = LAYOUT.gear.pitchR;
  const outward = new THREE5.Vector2(Math.sin(instrumentYaw), Math.cos(instrumentYaw));
  const cx = contactWorld.x - outward.x * Rcontact;
  const cz = contactWorld.z - outward.y * Rcontact;
  group.position.set(cx, 0, cz);
  group.rotation.y = instrumentYaw - GAP_ALIGN_DEG * DEG;
  const gapA = GAP_ALIGN_DEG * DEG;
  const anchor = new THREE5.Object3D();
  anchor.position.set(Math.sin(gapA) * 2020, yTop + 3, Math.cos(gapA) * 2020);
  group.add(anchor);
  const shadowMat = new THREE5.MeshBasicMaterial({
    map: makeContactShadowTexture(256, 0.82),
    transparent: true,
    opacity: 0.38,
    color: 0,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1
  });
  const contactShadow = new THREE5.Mesh(new THREE5.PlaneGeometry(2600, 1600), shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(Math.sin(gapA) * 1990, 0.45, Math.cos(gapA) * 1990);
  contactShadow.rotation.z = GAP_ALIGN_DEG * DEG;
  contactShadow.raycast = () => {
  };
  contactShadow.renderOrder = 1;
  group.add(contactShadow);
  tagPart(group, "gear");
  setShadows(group, true, true);
  group.traverse((o) => {
    if (o.isMesh && o.material && o.material.transparent) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });
  web.castShadow = true;
  return {
    group,
    anchor,
    center: new THREE5.Vector3(cx, 0, cz),
    contact: new THREE5.Vector3(contactWorld.x, 0, contactWorld.z),
    gapAlignDeg: GAP_ALIGN_DEG,
    toothCentersDeg: TOOTH_CENTERS_DEG,
    toothPitchDeg: PITCH_DEG,
    a0,
    a1,
    yWeb,
    yTop,
    teeth: [upperTooth, lowerTooth],
    bodyMeshes: [web]
  };
}
var PITCH_DEG, TOOTH_CENTERS_DEG, GAP_ALIGN_DEG, TOOTH_CENTERS;
var init_gear = __esm({
  "src/gear.js"() {
    init_config();
    init_utils();
    PITCH_DEG = 360 / CFG.gear.Z;
    TOOTH_CENTERS_DEG = Array.from({ length: 8 }, (_, i) => -26 + i * PITCH_DEG);
    GAP_ALIGN_DEG = (TOOTH_CENTERS_DEG[6] + TOOTH_CENTERS_DEG[7]) / 2;
    TOOTH_CENTERS = TOOTH_CENTERS_DEG.map((d) => d * DEG);
  }
});

// src/post.js
import * as THREE6 from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
function createPostPipeline(renderer, scene, camera, initialMode = "auto") {
  const size = renderer.getSize(new THREE6.Vector2());
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(size.x, size.y);
  const renderPass = new RenderPass(scene, camera);
  const gradePass = new ShaderPass(GradeShader);
  const outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(gradePass);
  composer.addPass(outputPass);
  let mode = initialMode;
  let enabled = true;
  let time = 0;
  function setMode(next) {
    mode = next;
    enabled = next !== "smooth";
    composer.passes.forEach((p) => {
      p.enabled = true;
    });
    gradePass.enabled = enabled;
    outputPass.enabled = true;
    renderPass.enabled = true;
  }
  function resize(width, height, pixelRatio) {
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    gradePass.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
  }
  function render(dt) {
    time += dt;
    gradePass.uniforms.uTime.value = time;
    if (enabled) {
      composer.render(dt);
    } else {
      renderer.render(scene, camera);
    }
  }
  setMode(initialMode);
  return {
    composer,
    renderPass,
    gradePass,
    outputPass,
    render,
    resize,
    setMode,
    get mode() {
      return mode;
    },
    set enabled(v) {
      enabled = v;
    },
    get enabled() {
      return enabled;
    }
  };
}
var GradeShader;
var init_post = __esm({
  "src/post.js"() {
    GradeShader = {
      name: "InSituGrade",
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uResolution: { value: new THREE6.Vector2(1, 1) },
        uVignette: { value: 0.09 },
        uGrain: { value: 12e-4 },
        uContrast: { value: 1.018 },
        uSaturation: { value: 0.99 }
      },
      vertexShader: (
        /* glsl */
        `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
      ),
      fragmentShader: (
        /* glsl */
        `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 col = t.rgb;
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));

      // A restrained filmic contrast in the linear working space.
      col = (col - 0.5) * uContrast + 0.5;
      col = max(col, 0.0);

      // Cool, very slightly lifted shadows; clean neutral shoulders on paper.
      col += vec3(0.0015, 0.0030, 0.0055) * (1.0 - smoothstep(0.0, 0.22, l));
      col *= mix(vec3(1.0), vec3(1.006, 1.002, 0.996), smoothstep(0.18, 1.1, l));

      // Desaturate the dense graphite areas, leave cyan/amber accents alive.
      float grey = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(grey), col, uSaturation + 0.06 * smoothstep(0.32, 1.8, l));

      float d = distance(vUv, vec2(0.55, 0.47));
      float vig = smoothstep(0.86, 0.25, d);
      col *= mix(1.0 - uVignette, 1.0, vig);

      // Fine sensor grain only in the shadows/midtones.
      float grain = hash12(vUv * uResolution + vec2(uTime * 7.31, -uTime * 11.73));
      col += (grain - 0.5) * uGrain * (0.55 + 0.45 * (1.0 - smoothstep(0.1, 0.8, l)));

      gl_FragColor = vec4(col, t.a);
    }
  `
      )
    };
  }
});

// src/measurement.js
function presetTargets(preset, seed) {
  if (preset === "fail") {
    return { left: 67 + seed % 5 * 0.9, right: 71 + seed % 4 * 1.3, shape: "fail" };
  }
  if (preset === "random") {
    const rand = mulberry32(seed);
    return {
      left: 29 + rand() * 38,
      right: 29 + rand() * 38,
      shape: "random",
      phases: [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28]
    };
  }
  return { left: 29.5 + seed % 3 * 0.7, right: 32.2 + seed % 2 * 0.8, shape: "pass" };
}
function makeErrorSignal(face, targetFF, shape, seed) {
  const rand = mulberry32(seed + (face === "right" ? 57 : 13));
  const p = [rand() * 6.283, rand() * 6.283, rand() * 6.283, rand() * 6.283];
  const weights = shape === "fail" ? [0.38, 0.28, 0.2, 0.14] : [0.56, 0.24, 0.13, 0.07];
  const values = new Float32Array(DENSE);
  for (let i = 0; i < DENSE; i++) {
    const s = i / (DENSE - 1) * LENGTH;
    const t = s / LENGTH * Math.PI * 2;
    let v = 0;
    v += Math.sin(t * 1.03 + p[0]) * weights[0];
    v += Math.sin(t * 2.61 + p[1]) * weights[1];
    v += Math.sin(t * 5.77 + p[2] + 0.5) * weights[2];
    v += Math.sin(t * 11.9 + p[3]) * weights[3];
    v += Math.sin(t * 0.43 + p[1] * 0.7) * 0.06;
    if (shape === "fail") {
      const c = 0.56 + 0.06 * Math.sin(p[0]);
      v -= Math.exp(-Math.pow((s / LENGTH - c) / 0.22, 2)) * 0.16;
    }
    values[i] = v;
  }
  let min = Infinity, max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min || 1;
  for (let i = 0; i < DENSE; i++) {
    values[i] = ((values[i] - min) / span - 0.5) * targetFF;
  }
  return values;
}
function classifyFF(ff) {
  if (ff == null || !Number.isFinite(ff)) {
    return { tone: "idle", label: "\u7B49\u5F85\u626B\u63CF\u6570\u636E" };
  }
  if (ff <= TOL - U) return { tone: "pass", label: "\u5408\u683C \xB7 \u4F4D\u4E8E\u590D\u68C0\u88D5\u5EA6\u4E4B\u5916" };
  if (ff <= TOL + U) return { tone: "warn", label: "\u4E34\u754C \xB7 \u5EFA\u8BAE\u590D\u68C0" };
  return { tone: "fail", label: "\u8D85\u5DEE \xB7 ff \u8D85\u51FA\u516C\u5DEE\u5E26" };
}
var LENGTH, TOL, U, ALPHA, DENSE, MeasurementEngine;
var init_measurement = __esm({
  "src/measurement.js"() {
    init_config();
    init_utils();
    LENGTH = CFG.scan.length;
    TOL = CFG.gear.ff * 1e3;
    U = CFG.machine.U;
    ALPHA = CFG.reversal.angle;
    DENSE = 513;
    MeasurementEngine = class {
      constructor() {
        this.speed = CFG.scan.defaultSpeed;
        this.sampleCount = CFG.scan.defaultSamples;
        this.preset = "pass";
        this.seed = 20261115;
        this.forceN = 0.3;
        this.magnify = 500;
        this.time = 0;
        this.slowPresentation = false;
        this.signals = {};
        this.faceTargets = {};
        this.regenerateSignals();
        this.mode = "idle";
        this.paused = false;
        this.pausedMode = null;
        this.positioned = false;
        this.userCoarse = 34;
        this.xCoarse = 34;
        this.ballDrop = 0;
        this.alpha = ALPHA;
        this.alphaTarget = ALPHA;
        this.face = "left";
        this.nextFace = null;
        this.stageS = 0;
        this.motorAngle = 0;
        this.stateT = 0;
        this.reverseStartAlpha = ALPHA;
        this.reverseEndAlpha = ALPHA;
        this.reverseFromMode = "idle";
        this.autoRun = false;
        this.completedSteps = /* @__PURE__ */ new Set();
        this.activeStep = null;
        this.pinLocked = true;
        this._stepSerial = 0;
        this._dataSerial = 0;
        this._sampleSerial = 0;
        this.lastNewSample = null;
        this.resetFaceData("left");
        this.resetFaceData("right");
        this.refreshStep();
      }
      regenerateSignals() {
        const targets = presetTargets(this.preset, this.seed);
        this.faceTargets = targets;
        for (const face of ["left", "right"]) {
          const target = face === "left" ? targets.left : targets.right;
          this.signals[face] = makeErrorSignal(face, target, targets.shape, this.seed);
        }
        for (const face of ["left", "right"]) {
          if (!this.faces?.[face]) continue;
          this.faces[face].complete = false;
          this.faces[face].ff = null;
          this.faces[face].classification = classifyFF(null);
          this.faces[face].samples = [];
          this.faces[face].nextIndex = 0;
        }
        this._dataSerial++;
      }
      resetFaceData(face) {
        this.faces = this.faces || {};
        this.faces[face] = {
          samples: [],
          nextIndex: 0,
          complete: false,
          ff: null,
          classification: classifyFF(null),
          targetFF: face === "left" ? this.faceTargets.left : this.faceTargets.right
        };
      }
      reset(hard = true) {
        this.mode = "idle";
        this.paused = false;
        this.pausedMode = null;
        this.positioned = false;
        this.xCoarse = 34;
        this.userCoarse = 34;
        this.ballDrop = 0;
        this.face = "left";
        this.nextFace = null;
        this.stageS = 0;
        this.motorAngle = 0;
        this.alphaTarget = ALPHA;
        this.stateT = 0;
        this.autoRun = false;
        this.completedSteps.clear();
        this.activeStep = null;
        this.pinLocked = false;
        this._sampleSerial = 0;
        this.lastNewSample = null;
        this.resetFaceData("left");
        this.resetFaceData("right");
        if (hard) {
          this.alpha = ALPHA;
        }
        this.refreshStep();
        this._dataSerial++;
      }
      setSpeed(v) {
        this.speed = clamp(Number(v) || CFG.scan.defaultSpeed, CFG.scan.minSpeed, CFG.scan.maxSpeed);
      }
      setSampleCount(n) {
        const next = clamp(Math.round(Number(n) || CFG.scan.defaultSamples), CFG.scan.minSamples, CFG.scan.maxSamples);
        if (next === this.sampleCount) return;
        this.sampleCount = next;
        if (this.mode === "scanning" || this.paused && this.pausedMode === "scanning") {
          this.rebuildFaceUpTo(this.face, this.stageS, false);
        } else if (!this.isActive()) {
          for (const f of ["left", "right"]) {
            if (!this.faces[f].complete) this.resetFaceData(f);
          }
          this._dataSerial++;
        }
      }
      setPreset(preset) {
        if (!["pass", "fail", "random"].includes(preset)) return;
        this.preset = preset;
        if (preset === "random") this.seed = this.seed * 1664525 + 1013904223 >>> 0;
        this.regenerateSignals();
        this.reset(true);
      }
      setForce(v) {
        this.forceN = clamp(Number(v) || 0.3, CFG.machine.forceMin, CFG.machine.forceMax);
      }
      setUserCoarse(v) {
        this.userCoarse = clamp(Number(v), 0, 80);
      }
      isActive() {
        return ["positioning", "approach", "scanning", "retract", "reversing"].includes(this.mode);
      }
      get isRunning() {
        return this.isActive() && !this.paused;
      }
      start() {
        if (this.isActive() && !this.paused) return { ok: false, reason: "\u6D4B\u91CF\u6B63\u5728\u8FD0\u884C" };
        if (this.paused) {
          this.paused = false;
          this.mode = this.pausedMode;
          this.pausedMode = null;
          return { ok: true, resumed: true };
        }
        if (this.mode === "positioning" || this.mode === "reversing") return { ok: false, reason: "\u673A\u6784\u6B63\u5728\u52A8\u4F5C" };
        this.clearMeasurementData();
        this.autoRun = true;
        this.paused = false;
        this.face = "left";
        this.nextFace = null;
        this.stageS = 0;
        this.alphaTarget = ALPHA;
        this.completedSteps.clear();
        this.completedSteps.add("done");
        this.completedSteps.delete("done");
        this.activeStep = null;
        this.stateT = 0;
        this.pinLocked = false;
        if (this.positioned) {
          this.mode = "approach";
          this.xCoarse = Math.max(this.xCoarse, 55);
        } else {
          this.mode = "positioning";
          this.xCoarse = Math.min(this.xCoarse, 34);
        }
        this.refreshStep();
        return { ok: true };
      }
      pauseToggle() {
        if (!this.isActive()) return { ok: false, reason: "\u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u6D4B\u91CF" };
        if (!this.paused) {
          this.paused = true;
          this.pausedMode = this.mode;
          this.pinLocked = true;
        } else {
          this.paused = false;
          this.mode = this.pausedMode || this.mode;
          this.pausedMode = null;
        }
        return { ok: true, paused: this.paused };
      }
      emergencyStop() {
        if (this.isActive()) {
          this.paused = true;
          this.pausedMode = this.mode;
        }
        this.pinLocked = true;
        return { ok: true };
      }
      clearMeasurementData() {
        this.resetFaceData("left");
        this.resetFaceData("right");
        this._dataSerial++;
        this._sampleSerial = 0;
        this.lastNewSample = null;
      }
      positionOnly() {
        if (this.isActive()) return { ok: false, reason: "\u6D4B\u91CF\u6B63\u5728\u8FD0\u884C" };
        this.autoRun = false;
        this.paused = false;
        this.mode = "positioning";
        this.stateT = 0;
        this.activeStep = null;
        this.completedSteps.clear();
        this.pinLocked = false;
        this.refreshStep();
        return { ok: true };
      }
      manualReverseTo(targetFace = null) {
        if (this.isActive()) return { ok: false, reason: "\u6D4B\u91CF\u8FDB\u884C\u4E2D\uFF0C\u6362\u5411\u7531\u6D41\u7A0B\u81EA\u52A8\u5B8C\u6210" };
        if (this.mode === "positioning") return { ok: false, reason: "\u5B9A\u4F4D\u8FDB\u884C\u4E2D" };
        const nf = targetFace || (this.face === "left" ? "right" : "left");
        if (nf === this.face && this.mode !== "reversing") {
          return { ok: true, already: true };
        }
        this.reverseFromMode = this.mode === "done" ? "done" : "idle";
        this.mode = "reversing";
        this.autoRun = false;
        this.nextFace = nf;
        this.reverseStartAlpha = this.alpha;
        this.reverseEndAlpha = nf === "left" ? ALPHA : -ALPHA;
        this.alphaTarget = this.reverseEndAlpha;
        this.stateT = 0;
        this.pinLocked = false;
        this.activeStep = null;
        this.refreshStep();
        return { ok: true };
      }
      seek(value) {
        const s = clamp(Number(value), 0, LENGTH);
        if (this.isActive() && !this.paused) {
          this.paused = true;
          this.pausedMode = this.mode;
        }
        this.stageS = s;
        this.motorAngle = this.computeMotorAngle(s);
        if (this.mode === "scanning" || this.paused && this.pausedMode === "scanning") {
          const faceData = this.faces[this.face];
          if (!faceData.complete) {
            this.rebuildFaceUpTo(this.face, s, false);
          }
        }
        return s;
      }
      computeMotorAngle(s = this.stageS) {
        return s / CFG.drive.screwPitch * Math.PI * 2;
      }
      collectSamplesTo(face, s) {
        const data = this.faces[face];
        const N = this.sampleCount;
        while (data.nextIndex < N) {
          const i = data.nextIndex;
          const targetS = i / (N - 1) * LENGTH;
          if (targetS > s + 1e-7) break;
          const e = this.errorAt(face, targetS);
          const sample = { s: targetS, e, i, born: performance.now() / 1e3 };
          data.samples.push(sample);
          this.lastNewSample = { ...sample, face };
          this._sampleSerial++;
          data.nextIndex++;
        }
        if (data.samples.length >= 2) {
          let min = Infinity, max = -Infinity;
          for (const sp of data.samples) {
            if (sp.e < min) min = sp.e;
            if (sp.e > max) max = sp.e;
          }
          data.ff = max - min;
          data.classification = classifyFF(data.ff);
        }
      }
      rebuildFaceUpTo(face, s, complete = false) {
        const data = this.faces[face];
        data.samples = [];
        data.nextIndex = 0;
        data.complete = false;
        data.ff = null;
        data.classification = classifyFF(null);
        this.collectSamplesTo(face, s);
        if (complete) {
          data.complete = true;
        }
        this._dataSerial++;
      }
      finishFace() {
        const data = this.faces[this.face];
        this.collectSamplesTo(this.face, LENGTH + 1e-5);
        data.complete = true;
        data.ff = data.samples.length ? Math.max(...data.samples.map((p) => p.e)) - Math.min(...data.samples.map((p) => p.e)) : 0;
        data.classification = classifyFF(data.ff);
        this._dataSerial++;
      }
      errorAt(face, s) {
        const values = this.signals[face];
        const x = clamp(s, 0, LENGTH) / LENGTH * (DENSE - 1);
        const i0 = Math.floor(x);
        const i1 = Math.min(DENSE - 1, i0 + 1);
        const f = x - i0;
        return values[i0] * (1 - f) + values[i1] * f;
      }
      highPassAt(face, s) {
        const center = this.errorAt(face, s);
        let mean = 0;
        const n = 9, span = 3;
        for (let i = 0; i < n; i++) {
          mean += this.errorAt(face, clamp(s + (i / (n - 1) - 0.5) * span, 0, LENGTH));
        }
        mean /= n;
        return center - mean;
      }
      getCurrentError() {
        return this.errorAt(this.face, this.stageS);
      }
      getResult() {
        const left = this.faces.left;
        const right = this.faces.right;
        const anyComplete = left.complete || right.complete;
        if (!anyComplete) return { tone: "idle", label: "\u7B49\u5F85\u626B\u63CF\u6570\u636E" };
        const tones = [left.classification.tone, right.classification.tone];
        let tone = "pass";
        if (tones.includes("fail")) tone = "fail";
        else if (tones.includes("warn")) tone = "warn";
        let label = "\u5408\u683C \xB7 \u53CC\u9F7F\u9762\u5747\u901A\u8FC7";
        if (tone === "fail") label = "\u8D85\u5DEE \xB7 \u81F3\u5C11\u4E00\u4E2A\u9F7F\u9762\u8D85\u51FA\u516C\u5DEE";
        else if (tone === "warn") label = "\u4E34\u754C \xB7 \u5EFA\u8BAE\u590D\u68C0";
        else if (!(left.complete && right.complete)) label = "\u626B\u63CF\u4E2D \xB7 \u5F53\u524D\u9F7F\u9762\u6570\u636E\u751F\u957F";
        return {
          tone,
          label,
          left: left.complete ? left.ff : left.samples.length > 2 ? left.ff : null,
          right: right.complete ? right.ff : right.samples.length > 2 ? right.ff : null
        };
      }
      beginScanning() {
        this.mode = "scanning";
        this.stateT = 0;
        this.stageS = 0;
        this.motorAngle = 0;
        this.resetFaceData(this.face);
        this.faces[this.face].targetFF = this.face === "left" ? this.faceTargets.left : this.faceTargets.right;
        this.faces[this.face].nextIndex = 0;
        this._dataSerial++;
        this.collectSamplesTo(this.face, 0);
        this.completedSteps.add("approach");
        this.completedSteps.add("position");
        this.refreshStep();
      }
      beginReversal(nextFace, returnMode, auto) {
        this.mode = "reversing";
        this.nextFace = nextFace;
        this.reverseStartAlpha = this.alpha;
        this.reverseEndAlpha = nextFace === "left" ? ALPHA : -ALPHA;
        this.alphaTarget = this.reverseEndAlpha;
        this.reverseFromMode = returnMode;
        this.autoRun = auto;
        this.stateT = 0;
        this.pinLocked = false;
        this.stageS = 0;
        this.motorAngle = 0;
        this.refreshStep();
      }
      finishReversal() {
        const next = this.nextFace;
        this.face = next;
        this.nextFace = null;
        this.alpha = this.alphaTarget;
        this.pinLocked = true;
        if (this.autoRun && next === "right") {
          this.mode = "approach";
          this.stateT = 0;
          this.stageS = 0;
          this.completedSteps.add("reverse");
          this.completedSteps.add("retract");
        } else {
          this.mode = this.reverseFromMode === "done" ? "done" : "idle";
          this.stateT = 0;
          this.completedSteps.add("reverse");
          this._dataSerial++;
        }
        this.refreshStep();
      }
      refreshStep() {
        if (this.mode === "positioning") this.activeStep = "position";
        else if (this.mode === "approach") this.activeStep = "approach";
        else if (this.mode === "scanning") this.activeStep = "scan";
        else if (this.mode === "retract") this.activeStep = "retract";
        else if (this.mode === "reversing") this.activeStep = "reverse";
        else if (this.mode === "done") this.activeStep = "done";
        else if (this.mode === "idle" && this.paused) this.activeStep = this.pausedMode === "scanning" ? "scan" : null;
        else this.activeStep = null;
      }
      markStepDone(step) {
        this.completedSteps.add(step);
      }
      update(dt) {
        if (this.paused || dt <= 0) {
          this.pinLocked = this.mode === "reversing" ? this.pinLocked : true;
          return;
        }
        this.time += dt;
        const targetX = (() => {
          if (this.mode === "positioning") return 58;
          if (this.mode === "approach" || this.mode === "scanning") return 60;
          if (this.mode === "retract" || this.mode === "reversing") return 55;
          if (this.mode === "done") return 60;
          return this.userCoarse;
        })();
        this.xCoarse = damp(this.xCoarse, targetX, 4.2, dt);
        const shouldBePositioned = this.positioned || this.mode === "done" || this.mode === "scanning" || this.mode === "retract";
        const dropTarget = this.mode === "idle" && !this.positioned ? 0 : shouldBePositioned || this.activeStep === "position" ? 1 : 0;
        this.ballDrop = damp(this.ballDrop, dropTarget, 3.6, dt);
        if (this.mode === "reversing") {
          this.stateT += dt;
          const duration = 2.25;
          const u = clamp(this.stateT / duration, 0, 1);
          const eased = easeInOutCubic(u);
          this.alpha = lerp(this.reverseStartAlpha, this.reverseEndAlpha, eased);
          this.pinLocked = u > 0.9 && Math.abs(this.alpha - this.reverseEndAlpha) < 0.35;
          if (u >= 1) this.finishReversal();
          this.pinLocked = this.mode === "reversing" ? this.pinLocked : true;
        } else {
          this.alphaTarget = this.face === "left" ? ALPHA : -ALPHA;
          this.alpha = damp(this.alpha, this.alphaTarget, 4.2, dt);
          this.pinLocked = Math.abs(this.alpha - this.alphaTarget) < 0.06;
        }
        if (this.mode === "positioning") {
          this.stateT += dt;
          if (this.stateT >= 2.2) {
            this.positioned = true;
            this.completedSteps.add("position");
            if (this.autoRun) {
              this.mode = "approach";
              this.stateT = 0;
            } else {
              this.mode = "idle";
              this.stateT = 0;
            }
            this.refreshStep();
          }
        } else if (this.mode === "approach") {
          this.stateT += dt;
          this.stageS = 0;
          if (this.stateT >= 0.75) {
            this.completedSteps.add("approach");
            this.beginScanning();
          }
        } else if (this.mode === "scanning") {
          const prev = this.stageS;
          this.stageS = Math.min(LENGTH, this.stageS + this.speed * dt);
          this.motorAngle = this.computeMotorAngle(this.stageS);
          this.collectSamplesTo(this.face, this.stageS);
          if (this.stageS >= LENGTH - 1e-7 && prev < LENGTH) {
            this.finishFace();
            this.completedSteps.add("scan");
            if (this.face === "left" && this.autoRun) {
              this.mode = "retract";
              this.stateT = 0;
              this.refreshStep();
            } else {
              this.mode = "done";
              this.stateT = 0;
              this.finishFace();
              this.completedSteps.add("retract");
              this.completedSteps.add("reverse");
              this.completedSteps.add("done");
              this.activeStep = "done";
              this.pinLocked = true;
              this._dataSerial++;
              this.refreshStep();
            }
          }
        } else if (this.mode === "retract") {
          this.stateT += dt;
          this.stageS = Math.max(0, this.stageS - this.speed * 4 * dt);
          this.motorAngle = this.computeMotorAngle(this.stageS);
          if (this.stageS <= 0 && this.stateT > 0.2) {
            this.completedSteps.add("retract");
            if (this.autoRun) {
              this.beginReversal("right", "idle", true);
            } else {
              this.mode = "idle";
              this.stateT = 0;
              this.refreshStep();
            }
          }
        }
        if (this.mode === "scanning") {
          this._dataSerial += 0;
        }
        this.refreshStep();
      }
      getSnapshot() {
        const left = this.faces.left;
        const right = this.faces.right;
        const result = this.getResult();
        const active = this.paused ? this.pausedMode : this.mode;
        return {
          mode: this.mode,
          activeMode: active,
          paused: this.paused,
          face: this.face,
          nextFace: this.nextFace,
          alpha: this.alpha,
          alphaTarget: this.alphaTarget,
          pinLocked: this.pinLocked,
          xCoarse: this.xCoarse,
          ballDrop: this.ballDrop,
          s: this.stageS,
          motorAngle: this.motorAngle,
          speed: this.speed,
          sampleCount: this.sampleCount,
          forceN: this.forceN,
          positioned: this.positioned,
          activeStep: this.activeStep,
          completedSteps: [...this.completedSteps],
          result,
          signals: this.signals,
          faces: {
            left: {
              samples: left.samples,
              complete: left.complete,
              ff: left.ff,
              classification: left.classification
            },
            right: {
              samples: right.samples,
              complete: right.complete,
              ff: right.ff,
              classification: right.classification
            }
          },
          currentError: this.getCurrentError(),
          highPass: this.highPassAt(this.face, this.stageS),
          dataSerial: this._dataSerial,
          sampleSerial: this._sampleSerial,
          lastNewSample: this.lastNewSample
        };
      }
    };
  }
});

// src/charts.js
var TOL2, LENGTH2, PHI_MAX, ProfileChart;
var init_charts = __esm({
  "src/charts.js"() {
    init_config();
    init_utils();
    TOL2 = CFG.gear.ff * 1e3;
    LENGTH2 = CFG.scan.length;
    PHI_MAX = LENGTH2 / CFG.gear.rb * 180 / Math.PI;
    ProfileChart = class {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.axis = "s";
        this.faces = { left: { samples: [], complete: false }, right: { samples: [], complete: false } };
        this.current = null;
        this.currentFace = "left";
        this.result = null;
        this.cssW = 10;
        this.cssH = 10;
        this.dpr = 1;
        this._needsDraw = true;
        this._lastDraw = 0;
        this.resize();
        this._ro = new ResizeObserver(() => this.resize());
        try {
          this._ro.observe(canvas);
        } catch {
        }
      }
      resize() {
        const rect = this.canvas.getBoundingClientRect();
        const w = Math.max(140, rect.width);
        const h = Math.max(100, rect.height);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (w === this.cssW && h === this.cssH && dpr === this.dpr) return;
        this.cssW = w;
        this.cssH = h;
        this.dpr = dpr;
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this._needsDraw = true;
      }
      setAxis(axis) {
        this.axis = axis === "phi" ? "phi" : "s";
        this._needsDraw = true;
      }
      toggleAxis() {
        this.setAxis(this.axis === "s" ? "phi" : "s");
        return this.axis;
      }
      update(data) {
        this.faces = data.faces;
        this.current = data.current;
        this.currentFace = data.currentFace;
        this.result = data.result;
        this._needsDraw = true;
      }
      draw(now = performance.now()) {
        if (!this._needsDraw && now - this._lastDraw < 32) return;
        this._needsDraw = false;
        this._lastDraw = now;
        const ctx = this.ctx;
        const W2 = this.cssW, H = this.cssH;
        const dpr = this.dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W2, H);
        const leftMargin = 34;
        const rightMargin = 8;
        const topMargin = 18;
        const bottomMargin = 22;
        const plotW = Math.max(10, W2 - leftMargin - rightMargin);
        const plotH = Math.max(10, H - topMargin - bottomMargin);
        const x0 = leftMargin, y0 = topMargin;
        const allSamples = [...this.faces.left.samples, ...this.faces.right.samples];
        let maxAbs = 26;
        for (const s of allSamples) maxAbs = Math.max(maxAbs, Math.abs(s.e));
        const yLimit = Math.max(30, maxAbs * 1.16);
        const xMax = this.axis === "s" ? LENGTH2 : PHI_MAX;
        const xFor = (s) => x0 + (this.axis === "s" ? s / LENGTH2 : s / CFG.gear.rb * 180 / Math.PI / PHI_MAX) * plotW;
        const yFor = (e) => y0 + plotH / 2 - e / yLimit * (plotH / 2);
        ctx.fillStyle = "rgba(248,250,252,.72)";
        ctx.fillRect(x0, y0, plotW, plotH);
        ctx.font = "7px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const yTicks = [-yLimit, -yLimit / 2, 0, yLimit / 2, yLimit];
        for (let i = 0; i < yTicks.length; i++) {
          const v = yTicks[i];
          const y = yFor(v);
          ctx.strokeStyle = v === 0 ? "rgba(31,41,55,.18)" : "rgba(31,41,55,.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x0, Math.round(y) + 0.5);
          ctx.lineTo(x0 + plotW, Math.round(y) + 0.5);
          ctx.stroke();
          if (i === 0 || i === 2 || i === 4) {
            ctx.fillStyle = "#5B6472";
            ctx.fillText(`${v > 0 ? "+" : ""}${Math.round(v)}`, x0 - 5, y);
          }
        }
        const bandTop = yFor(TOL2 / 2);
        const bandBottom = yFor(-TOL2 / 2);
        ctx.fillStyle = "rgba(20,122,58,.10)";
        ctx.fillRect(x0, bandTop, plotW, bandBottom - bandTop);
        ctx.strokeStyle = "rgba(20,122,58,.34)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        for (const y of [bandTop, bandBottom]) {
          ctx.beginPath();
          ctx.moveTo(x0, y);
          ctx.lineTo(x0 + plotW, y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.fillStyle = "#147A3A";
        ctx.textAlign = "left";
        ctx.font = "6px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
        ctx.fillText("[ff] / 2", x0 + 5, bandTop + 7);
        const xTicks = this.axis === "s" ? [0, 5, 10, 15, 20, 25, 30, 35] : [0, 1, 2, 3, 4, 5, PHI_MAX];
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (const tick of xTicks) {
          const x = x0 + tick / xMax * plotW;
          ctx.strokeStyle = "rgba(31,41,55,.06)";
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + 0.5, y0);
          ctx.lineTo(Math.round(x) + 0.5, y0 + plotH);
          ctx.stroke();
          ctx.fillStyle = "#5B6472";
          ctx.font = "6px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
          ctx.fillText(this.axis === "s" ? `${tick}` : tick.toFixed(1), x, y0 + plotH + 5);
        }
        ctx.fillStyle = "#5E6978";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.font = "6.2px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
        ctx.fillText(this.axis === "s" ? "\u5C55\u5F00\u957F\u5EA6 s / mm" : "\u5C55\u5F00\u89D2 \u03C6 / \xB0", x0, H - 2);
        ctx.save();
        ctx.translate(8, y0 + 10);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "right";
        ctx.fillText("e / \u03BCm", 0, 0);
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.rect(x0, y0, plotW, plotH);
        ctx.clip();
        const drawFace = (face, color, dashed, alpha = 1) => {
          const samples = this.faces[face].samples;
          if (!samples || samples.length < 2) return;
          ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = face === this.currentFace ? 1.15 : 0.9;
          ctx.setLineDash(dashed ? [4, 3] : []);
          ctx.beginPath();
          for (let i = 0; i < samples.length; i++) {
            const s = samples[i].s;
            const x = xFor(s);
            const y = yFor(samples[i].e);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          ctx.fillStyle = color;
          for (let i = 0; i < samples.length; i += Math.max(1, Math.round(samples.length / 40))) {
            const x = xFor(samples[i].s);
            const y = yFor(samples[i].e);
            ctx.beginPath();
            ctx.arc(x, y, 1.25, 0, Math.PI * 2);
            ctx.fill();
          }
        };
        drawFace("left", "rgba(169,75,11,.95)", false, 1);
        drawFace("right", "rgba(128,98,20,.88)", true, 0.95);
        if (this.current) {
          const { s, e } = this.current;
          const cx = xFor(clamp(s, 0, LENGTH2));
          const cy = yFor(clamp(e, -yLimit, yLimit));
          ctx.strokeStyle = "rgba(169,75,11,.26)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(cx, y0);
          ctx.lineTo(cx, y0 + plotH);
          ctx.stroke();
          ctx.setLineDash([]);
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
          grad.addColorStop(0, "rgba(169,75,11,1)");
          grad.addColorStop(0.3, "rgba(169,75,11,.72)");
          grad.addColorStop(1, "rgba(169,75,11,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#A94B0B";
          ctx.beginPath();
          ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = "rgba(31,41,55,.13)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x0 + 0.5, y0 + 0.5, plotW - 1, plotH - 1);
        ctx.restore();
      }
    };
  }
});

// src/audio.js
var AudioEngine;
var init_audio = __esm({
  "src/audio.js"() {
    AudioEngine = class {
      constructor() {
        this.ctx = null;
        this.master = null;
        this.humGain = null;
        this.humOsc = null;
        this.humOsc2 = null;
        this.filter = null;
        this.noiseBuffer = null;
        this.volume = 0.36;
        this.muted = true;
        this.started = false;
      }
      async init() {
        if (this.ctx) {
          await this.ctx.resume();
          return;
        }
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
        this.humGain = this.ctx.createGain();
        this.humGain.gain.value = 0;
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.frequency.value = 260;
        this.filter.Q.value = 0.8;
        this.humOsc = this.ctx.createOscillator();
        this.humOsc.type = "sawtooth";
        this.humOsc.frequency.value = 42;
        this.humOsc2 = this.ctx.createOscillator();
        this.humOsc2.type = "sine";
        this.humOsc2.frequency.value = 84;
        const g1 = this.ctx.createGain();
        g1.gain.value = 0.16;
        const g2 = this.ctx.createGain();
        g2.gain.value = 0.08;
        this.humOsc.connect(g1).connect(this.filter);
        this.humOsc2.connect(g2).connect(this.filter);
        this.filter.connect(this.humGain).connect(this.master);
        this.humOsc.start();
        this.humOsc2.start();
        this.noiseBuffer = this.makeNoiseBuffer(0.3);
        await this.ctx.resume();
      }
      makeNoiseBuffer(seconds) {
        const len = Math.floor(this.ctx.sampleRate * seconds);
        const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
        return buffer;
      }
      async setMuted(muted) {
        this.muted = muted;
        if (!muted) await this.init();
        if (!this.ctx) return;
        const target = muted ? 0 : this.volume * 0.55;
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.12);
      }
      setVolume(v) {
        this.volume = Math.max(0, Math.min(1, Number(v)));
        if (!this.ctx || this.muted) return;
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(this.volume * 0.55, this.ctx.currentTime + 0.1);
      }
      update({ running, speed, closeup = false, reversing = false }) {
        if (!this.ctx || this.muted) return;
        const t = this.ctx.currentTime;
        const active = running || reversing;
        const targetGain = active ? closeup ? 0.055 : 0.1 : 0;
        const rpm = Math.max(0, speed * 12);
        const f = 34 + rpm * 1.7 + (reversing ? 7 : 0);
        this.humGain.gain.cancelScheduledValues(t);
        this.humGain.gain.linearRampToValueAtTime(targetGain, t + 0.3);
        this.humOsc.frequency.cancelScheduledValues(t);
        this.humOsc.frequency.linearRampToValueAtTime(f, t + 0.4);
        this.humOsc2.frequency.cancelScheduledValues(t);
        this.humOsc2.frequency.linearRampToValueAtTime(f * 2.01, t + 0.4);
        this.filter.frequency.cancelScheduledValues(t);
        this.filter.frequency.linearRampToValueAtTime(180 + rpm * 4.2, t + 0.4);
      }
      _tone({ freq = 880, duration = 0.05, gain = 0.08, type = "sine", decay = 0.05, delay = 0 }) {
        if (!this.ctx || this.muted) return;
        const t0 = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.68), t0 + duration);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + 4e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, t0 + duration + decay);
        osc.connect(g).connect(this.master);
        osc.start(t0);
        osc.stop(t0 + duration + decay + 0.01);
      }
      _noiseClick({ gain = 0.055, duration = 0.03, highpass = 900, delay = 0 } = {}) {
        if (!this.ctx || this.muted || !this.noiseBuffer) return;
        const t0 = this.ctx.currentTime + delay;
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = "highpass";
        bp.frequency.value = highpass;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(1e-4, t0 + duration);
        src.connect(bp).connect(g).connect(this.master);
        src.start(t0);
        src.stop(t0 + duration + 0.02);
      }
      sampleTick() {
        this._noiseClick({ gain: 0.035, duration: 0.018, highpass: 1800 });
        this._tone({ freq: 1240, duration: 0.012, gain: 0.018, type: "triangle", decay: 0.02 });
      }
      positionChime() {
        this._tone({ freq: 620, duration: 0.07, gain: 0.032, type: "sine", decay: 0.18 });
        this._tone({ freq: 930, duration: 0.055, gain: 0.022, type: "sine", decay: 0.24, delay: 0.075 });
      }
      lockClick() {
        this._noiseClick({ gain: 0.09, duration: 0.025, highpass: 900 });
        this._tone({ freq: 140, duration: 0.04, gain: 0.05, type: "square", decay: 0.06 });
      }
      completionTone(pass = true) {
        const freqs = pass ? [523.25, 659.25, 783.99] : [392, 392, 311];
        freqs.forEach((f, i) => this._tone({
          freq: f,
          duration: 0.14,
          gain: 0.045,
          type: "sine",
          decay: 0.3,
          delay: i * 0.16
        }));
      }
    };
  }
});

// src/camera.js
import * as THREE7 from "three";
var CameraDirector;
var init_camera = __esm({
  "src/camera.js"() {
    init_config();
    init_utils();
    CameraDirector = class {
      constructor(camera, controls, anchors, yawRad, onChange) {
        this.camera = camera;
        this.controls = controls;
        this.anchors = anchors;
        this.yaw = yawRad;
        this.onChange = onChange || (() => {
        });
        this.tween = null;
        this.currentPreset = "overview";
        this.saved = null;
        this.lastInteraction = performance.now();
        this.autoEnabled = true;
        this.driftTime = 0;
        this._lastBase = null;
        this.controls.addEventListener("start", () => this.noteInteraction(true));
        this.controls.addEventListener("end", () => {
          this.lastInteraction = performance.now();
        });
        this._pointerCancel = () => {
          if (this.tween) this.cancelTween(true);
          this.noteInteraction();
        };
        this.controls.domElement.addEventListener("pointerdown", this._pointerCancel, { passive: true });
        this.controls.domElement.addEventListener("wheel", this._pointerCancel, { passive: true });
        this.controls.domElement.addEventListener("touchstart", this._pointerCancel, { passive: true });
        this.resetToPreset("overview", true);
      }
      getInstrumentBasis() {
        const right = new THREE7.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
        const forward = new THREE7.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
        const up = new THREE7.Vector3(0, 1, 0);
        return { right, forward, up };
      }
      worldAnchor(key) {
        const a = this.anchors[key];
        if (!a) return new THREE7.Vector3();
        return a.getWorldPosition(new THREE7.Vector3());
      }
      relativeView(anchor, { right = 0, up = 0, forward = 0, targetLift = 0, fov = 30 }) {
        const { right: r, forward: f, up: u } = this.getInstrumentBasis();
        const target = anchor.clone().add(u.clone().multiplyScalar(targetLift));
        const pos = target.clone().addScaledVector(r, right).addScaledVector(u, up).addScaledVector(f, forward);
        return { pos, target, fov };
      }
      preset(name) {
        switch (name) {
          case "overview":
          case "reset":
            if (typeof window !== "undefined" && window.innerWidth <= 760) {
              return {
                pos: new THREE7.Vector3(620, 460, 900),
                target: new THREE7.Vector3(0, 190, -280),
                fov: 48
              };
            }
            return {
              pos: new THREE7.Vector3(...LAYOUT.camera.defaultPos),
              target: new THREE7.Vector3(...LAYOUT.camera.defaultTarget),
              fov: LAYOUT.camera.fov
            };
          case "positioning": {
            const a = this.worldAnchor("ballA");
            const b = this.worldAnchor("ballB");
            const mid = a.clone().add(b).multiplyScalar(0.5);
            mid.y = Math.max(150, mid.y);
            const target = mid.clone().add(new THREE7.Vector3(0, 10, 0));
            const pos = target.clone().add(new THREE7.Vector3(-120, 290, -120));
            return { pos, target, fov: 50 };
          }
          case "drivetrain": {
            const a = this.worldAnchor("screw");
            const { right, forward, up } = this.getInstrumentBasis();
            const target = a.clone().add(new THREE7.Vector3(0, -6, 20));
            const pos = target.clone().addScaledVector(right, 250).addScaledVector(up, 120).addScaledVector(forward, 310);
            return { pos, target, fov: 29 };
          }
          case "transfer": {
            const a = this.worldAnchor("lever");
            const { right, forward, up } = this.getInstrumentBasis();
            const target = a.clone().add(new THREE7.Vector3(0, -18, 2));
            const pos = target.clone().addScaledVector(right, 232).addScaledVector(up, 135).addScaledVector(forward, 355);
            return { pos, target, fov: 27 };
          }
          case "reversal": {
            const a = this.worldAnchor("bearing");
            const { right, forward, up } = this.getInstrumentBasis();
            const target = a.clone().add(new THREE7.Vector3(0, -18, 0));
            const pos = target.clone().addScaledVector(right, 60).addScaledVector(up, 130).addScaledVector(forward, 340);
            return { pos, target, fov: 28 };
          }
          case "section":
            return this.preset("transfer");
          case "exploded": {
            return {
              pos: new THREE7.Vector3(1120, 780, 1520),
              target: new THREE7.Vector3(0, 120, 0),
              fov: 38
            };
          }
          default:
            return this.preset("overview");
        }
      }
      noteInteraction(cancelTween = false) {
        this.lastInteraction = performance.now();
        this.driftTime = 0;
        if (cancelTween && this.tween) this.cancelTween(true);
      }
      cancelTween(enableControls = true) {
        this.tween = null;
        if (enableControls) this.controls.enabled = true;
      }
      _compactFov(fov) {
        const compact = typeof window !== "undefined" && window.innerWidth <= 760;
        return compact ? Math.max(38, fov) : fov;
      }
      flyTo(name, { duration = 1.15, immediate = false, silent = false } = {}) {
        const p = this.preset(name);
        if (!p) return;
        p.fov = this._compactFov(p.fov);
        this.currentPreset = name === "reset" ? "overview" : name;
        this.onChange(this.currentPreset);
        if (immediate) {
          this.camera.position.copy(p.pos);
          this.camera.fov = p.fov;
          this.camera.updateProjectionMatrix();
          this.controls.target.copy(p.target);
          this.controls.update();
          this.controls.enabled = true;
          this._lastBase = { pos: p.pos.clone(), target: p.target.clone(), fov: p.fov };
          return;
        }
        this.cancelTween(false);
        this.controls.enabled = false;
        const startPos = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startFov = this.camera.fov;
        const distance = startPos.distanceTo(p.pos);
        const arc = Math.min(180, distance * 0.07);
        this.tween = {
          name,
          t: 0,
          duration: clamp(duration, 0.35, 2),
          startPos,
          startTarget,
          startFov,
          endPos: p.pos.clone(),
          endTarget: p.target.clone(),
          endFov: p.fov,
          arc,
          silent
        };
        this._lastBase = { pos: p.pos.clone(), target: p.target.clone(), fov: p.fov };
      }
      resetToPreset(name = "overview", immediate = false) {
        this.flyTo(name, { immediate, duration: 1 });
      }
      saveState() {
        this.saved = {
          pos: this.camera.position.clone(),
          target: this.controls.target.clone(),
          fov: this.camera.fov,
          preset: this.currentPreset
        };
        return this.saved;
      }
      restoreState(state = this.saved) {
        if (!state) return;
        this.tween = null;
        this.controls.enabled = true;
        this.camera.position.copy(state.pos);
        this.controls.target.copy(state.target);
        this.camera.fov = state.fov;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.currentPreset = state.preset || "overview";
        this.onChange(this.currentPreset);
        this._lastBase = { pos: state.pos.clone(), target: state.target.clone(), fov: state.fov };
      }
      update(dt, allowDrift = true) {
        if (this.tween) {
          this.tween.t += dt;
          const u = clamp(this.tween.t / this.tween.duration, 0, 1);
          const e = easeInOutCubic(u);
          const pos = new THREE7.Vector3().lerpVectors(this.tween.startPos, this.tween.endPos, e);
          pos.y += Math.sin(Math.PI * e) * this.tween.arc;
          const target = new THREE7.Vector3().lerpVectors(this.tween.startTarget, this.tween.endTarget, e);
          this.camera.position.copy(pos);
          this.controls.target.copy(target);
          this.camera.fov = this.tween.startFov + (this.tween.endFov - this.tween.startFov) * e;
          this.camera.updateProjectionMatrix();
          this.controls.update();
          if (u >= 1) {
            this.tween = null;
            this.controls.enabled = true;
          }
          return;
        }
        if (allowDrift && this.autoEnabled) {
          const idleMs = performance.now() - this.lastInteraction;
          if (idleMs > 16e3 && !this.controls.active && this.currentPreset === "overview") {
            this.driftTime += dt;
            const base = this._lastBase || {
              pos: new THREE7.Vector3(...LAYOUT.camera.defaultPos),
              target: new THREE7.Vector3(...LAYOUT.camera.defaultTarget)
            };
            const angle = Math.sin(this.driftTime * 0.045) * 0.018;
            const off = this.camera.position.clone().sub(this.controls.target);
            off.applyAxisAngle(new THREE7.Vector3(0, 1, 0), angle * dt * 0.6);
            this.camera.position.copy(this.controls.target).add(off);
            const target = this.controls.target.clone();
            target.x += Math.sin(this.driftTime * 0.033) * 0.03;
            this.controls.target.lerp(target, 0.02);
            this.controls.update();
          }
        }
      }
    };
  }
});

// src/annotations.js
import * as THREE8 from "three";
var D, Z, MN, W, K, BALL_D, RUBY_D, RUBY_HRA, SCREW, FLEX_MAT, LEVER_MAT, FORCE_RANGE, ANGLE, BEARING_SIZE, DEFAULT_LABELS, POSITIONING_LABELS, SECTION_LABELS, EXPLODED_LABELS, AnnotationSystem;
var init_annotations = __esm({
  "src/annotations.js"() {
    init_config();
    init_utils();
    D = CFG.gear.D;
    Z = CFG.gear.Z;
    MN = CFG.gear.mn;
    W = CFG.gear.W;
    K = CFG.gear.k;
    BALL_D = CFG.locator.ballD;
    RUBY_D = CFG.stylus.ballD;
    RUBY_HRA = CFG.stylus.ballMaterial.replace(/^.*?·\s*/, "");
    SCREW = `\u03C6${CFG.drive.screwDia} \xD7 ${CFG.drive.screwPitch}`;
    FLEX_MAT = CFG.flexure.material.split(/\s+/)[0];
    LEVER_MAT = CFG.lever.material.split(/\s+/)[0];
    FORCE_RANGE = `${CFG.machine.forceMin}\u2013${CFG.machine.forceMax} N`;
    ANGLE = CFG.reversal.angle;
    BEARING_SIZE = CFG.reversal.bearing.replace(/^交叉滚子轴承\s*/, "");
    DEFAULT_LABELS = [
      { key: "dualBall", anchor: "ballA", title: "\u53CC\u5B9A\u4F4D\u7403 A / B", value: `\u03C6${BALL_D} mm \xB7 W ${W} \xB7 k ${K}`, side: "left", dx: -55, dy: 6, noOcclude: true },
      { key: "ruby", anchor: "ruby", title: "\u7EA2\u5B9D\u77F3\u6D4B\u7403", value: `\u03C6${RUBY_D} mm \xB7 ${RUBY_HRA}`, side: "right", dx: 78, dy: 48 },
      { key: "screw", anchor: "screw", title: "C3 \u6EDA\u73E0\u4E1D\u6746", value: `${SCREW} \xB7 \u56DE\u5DEE < 0.5 \u03BCm`, side: "right", dx: 52, dy: -54 }
    ];
    POSITIONING_LABELS = [
      { key: "dualBall", anchor: "ballA", title: "\u4E3B\u5B9A\u4F4D\u7403 A", value: `\u03C6${BALL_D} mm \xB7 W ${W} \xB7 k ${K}`, side: "left", noOcclude: true, dx: -52, dy: 24 },
      { key: "ballB", anchor: "ballB", title: "\u526F\u5B9A\u4F4D\u7403 B", value: `${CFG.locator.springK} N/mm \u5F39\u7C27\u6D6E\u52A8`, side: "right", noOcclude: true, dx: 45, dy: 12 },
      { key: "ruby", anchor: "ruby", title: "\u7EA2\u5B9D\u77F3\u6D4B\u7403", value: `\u03C6${RUBY_D} mm \xB7 \u6D4B\u91CF\u529B ${FORCE_RANGE}`, side: "right", noOcclude: true, dx: 55, dy: 64 }
    ];
    SECTION_LABELS = [
      { key: "ruby", anchor: "ruby", title: "\u7EA2\u5B9D\u77F3\u6D4B\u7403", value: `\u03C6${RUBY_D} mm \xB7 \u6D4B\u91CF\u529B ${FORCE_RANGE}`, side: "right", noOcclude: true, dx: 40, dy: 24 },
      { key: "flexure", anchor: "flexure", title: "\u5355\u7247\u7C27\u94F0\u94FE", value: `${FLEX_MAT} \xB7 ${CFG.flexure.kAlpha} N\xB7mm/rad`, side: "left" },
      { key: "lever", anchor: "lever", title: `${CFG.lever.ratio} : 1 \u7CBE\u5BC6\u6760\u6746`, value: `${LEVER_MAT} \xB7 L1/L2 = ${CFG.lever.L1} / ${CFG.lever.L2} mm`, side: "left" },
      { key: "lvdt", anchor: "lvdt", title: "LVDT \u4F4D\u79FB\u4F20\u611F\u5668", value: `\u63A5\u6536 ${CFG.lever.ratio}\u03B4 \xB7 \u4E0D\u9508\u94A2\u58F3\u4F53`, side: "right" },
      { key: "bearing", anchor: "bearing", title: "\u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F", value: `${BEARING_SIZE} \xB7 \xB1${ANGLE}\xB0`, side: "left" }
    ];
    EXPLODED_LABELS = [
      { key: "gear", anchor: "gear", title: "\u4EBA\u5B57\u9F7F\u8F6E\u6247\u6BB5", value: `\u03A6${D} \xB7 Z ${Z} \xB7 mn ${MN}`, side: "left", noOcclude: true, dx: -10, dy: 10 },
      { key: "column", anchor: "column", title: "\u7ACB\u67F1 + \u60AC\u81C2", value: "6061-T6 \xB7 250 / 200 mm", side: "left", noOcclude: true, dy: -20 },
      { key: "motor", anchor: "motor", title: "\u6B65\u8FDB\u7535\u673A", value: `${CFG.drive.motorModel} \xB7 ${CFG.drive.holdTorque} N\xB7m`, side: "right", noOcclude: true, dx: 20, dy: -20 },
      { key: "screw", anchor: "screw", title: "C3 \u6EDA\u73E0\u4E1D\u6746", value: `${SCREW} \xB7 \u53CC\u87BA\u6BCD\u9884\u7D27`, side: "right", noOcclude: true, dx: 30, dy: 30 },
      { key: "flexure", anchor: "flexure", title: "\u5355\u7247\u7C27\u94F0\u94FE", value: `${FLEX_MAT} \xB7 k\u03B1 = ${CFG.flexure.kAlpha} N\xB7mm/rad`, side: "left", noOcclude: true, dy: 20 },
      { key: "ruby", anchor: "ruby", title: "\u7EA2\u5B9D\u77F3\u6D4B\u7403", value: `\u03C6${RUBY_D} mm \xB7 \u6D4B\u91CF\u529B ${FORCE_RANGE}`, side: "right", noOcclude: true, dx: 50, dy: 35 }
    ];
    AnnotationSystem = class {
      constructor({ layer, svg, anchors, renderer, camera, occluders = [] }) {
        this.layer = layer;
        this.svg = svg;
        this.anchors = anchors;
        this.camera = camera;
        this.renderer = renderer;
        this.rawOccluders = occluders;
        this.raycaster = new THREE8.Raycaster();
        this.entries = [];
        this.enabled = true;
        this.mode = "default";
        this.width = 1;
        this.height = 1;
        this._occlusionTime = 0;
        this._visible = /* @__PURE__ */ new Map();
        this.setMode("default", true);
      }
      setOccluders(objects) {
        this.rawOccluders = objects;
      }
      clear() {
        for (const e of this.entries) {
          e.el.remove();
          e.path.remove();
          e.dot.remove();
        }
        this.entries = [];
        this.svg.innerHTML = "";
      }
      setMode(mode, force = false) {
        if (!force && this.mode === mode) return;
        this.mode = mode;
        this.clear();
        const defs = mode === "exploded" ? EXPLODED_LABELS : mode === "section" ? SECTION_LABELS : mode === "positioning" ? POSITIONING_LABELS : DEFAULT_LABELS;
        const ns = "http://www.w3.org/2000/svg";
        for (const def of defs) {
          const anchorObj = this.anchors[def.anchor];
          if (!anchorObj) continue;
          const el = document.createElement("div");
          el.className = `annotation ${def.side === "left" ? "is-left" : "is-right"}`;
          el.dataset.part = def.key;
          el.innerHTML = `
        <div class="annotation-card">
          <div class="annotation-title">
            <b><span class="annotation-index">\u25CF</span>${def.title}</b>
            <span>${def.value}</span>
          </div>
        </div>
        <span class="annotation-mark"></span>`;
          this.layer.appendChild(el);
          const path = document.createElementNS(ns, "path");
          path.setAttribute("class", "leader-path");
          const dot = document.createElementNS(ns, "circle");
          dot.setAttribute("class", "leader-dot");
          dot.setAttribute("r", "1.7");
          this.svg.appendChild(path);
          this.svg.appendChild(dot);
          this.entries.push({ ...def, anchorObj, el, path, dot, card: el.querySelector(".annotation-card"), projected: new THREE8.Vector3(), visible: false, occluded: false, width: 100 });
        }
      }
      setEnabled(v) {
        this.enabled = v;
        this.layer.style.display = v ? "" : "none";
      }
      resize() {
        const rect = this.layer.getBoundingClientRect();
        this.width = Math.max(1, rect.width);
        this.height = Math.max(1, rect.height);
        this.svg.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        this.svg.setAttribute("width", this.width);
        this.svg.setAttribute("height", this.height);
        this._occlusionTime = 0;
      }
      _isOccluded(anchorWorld, camPos) {
        if (!this.rawOccluders.length) return false;
        const dir = anchorWorld.clone().sub(camPos);
        const dist = dir.length();
        dir.normalize();
        this.raycaster.set(camPos, dir);
        this.raycaster.far = dist - 80;
        const hits = this.raycaster.intersectObjects(this.rawOccluders, true);
        for (const h of hits) {
          if (h.object.userData.noOcclude) continue;
          if (h.distance < dist - 80) return true;
        }
        return false;
      }
      update(now, cameraMoving = false) {
        if (!this.enabled) return;
        const camPos = this.camera.position;
        const tmp = new THREE8.Vector3();
        const doOcclusion = now - this._occlusionTime > 280;
        if (doOcclusion) this._occlusionTime = now;
        let visibleIndex = 0;
        for (const e of this.entries) {
          e.anchorObj.getWorldPosition(tmp);
          const distance = tmp.distanceTo(camPos);
          const p = e.projected.copy(tmp).project(this.camera);
          const behind = p.z > 1 || p.z < -1;
          const sx = (p.x * 0.5 + 0.5) * this.width;
          const sy = (-p.y * 0.5 + 0.5) * this.height;
          const pad = 30;
          let visible2 = !behind && sx > -40 && sx < this.width + 40 && sy > 40 && sy < this.height - 160;
          if (distance > 4200) visible2 = false;
          e.desiredY = clamp(sy + (e.dy || 0), 40, this.height - 170);
          if (doOcclusion && visible2 && !e.noOcclude) {
            e.occluded = this._isOccluded(tmp, camPos);
          } else if (e.noOcclude) {
            e.occluded = false;
          }
          if (e.occluded) visible2 = false;
          e.visible = visible2;
          e.screenX = clamp(sx, 16, this.width - 16);
          e.screenY = clamp(sy, 40, this.height - 170);
          e.distance = distance;
          if (visible2) visibleIndex++;
        }
        const visible = this.entries.filter((e) => e.visible);
        for (const side of ["left", "right"]) {
          const column = visible.filter((e) => e.side === side).sort((a, b) => a.desiredY - b.desiredY);
          let cursor = 54;
          for (const e of column) {
            e.width = Math.max(94, e.card.offsetWidth || 94);
            const h = Math.max(28, e.card.offsetHeight || 28);
            let y = Math.max(cursor, e.desiredY - h / 2);
            y = Math.min(y, this.height - 168 - h);
            e.cardY = y;
            cursor = y + h + 7;
          }
        }
        for (const e of this.entries) {
          const el = e.el;
          if (!e.visible) {
            el.classList.remove("is-visible");
            e.path.classList.remove("is-visible");
            e.dot.classList.remove("is-visible");
            continue;
          }
          const w = e.width;
          const h = Math.max(28, e.card.offsetHeight || 28);
          const gap = 22;
          let x = e.side === "left" ? e.screenX - w - gap + (e.dx || 0) : e.screenX + gap + (e.dx || 0);
          x = clamp(x, 10, this.width - w - 10);
          const y = e.cardY;
          el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
          el.style.opacity = cameraMoving ? "0.35" : "1";
          el.classList.add("is-visible");
          const endX = e.side === "left" ? x + w : x;
          const endY = y + h / 2;
          const elbowX = e.side === "left" ? e.screenX - 18 : e.screenX + 18;
          const d = `M ${e.screenX.toFixed(1)} ${e.screenY.toFixed(1)} L ${elbowX.toFixed(1)} ${e.screenY.toFixed(1)} L ${elbowX.toFixed(1)} ${endY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
          e.path.setAttribute("d", d);
          e.path.classList.add("is-visible");
          e.dot.setAttribute("cx", e.screenX);
          e.dot.setAttribute("cy", e.screenY);
          e.dot.classList.add("is-visible");
        }
      }
      get visibleCount() {
        return this.entries.filter((e) => e.visible).length;
      }
    };
  }
});

// src/main.js
import * as THREE9 from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
var require_main = __commonJS({
  "src/main.js"() {
    init_config();
    init_utils();
    init_materials();
    init_environment();
    init_instrument();
    init_gear();
    init_post();
    init_measurement();
    init_charts();
    init_audio();
    init_camera();
    init_annotations();
    var $ = (id) => document.getElementById(id);
    var $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    var app = $("app");
    var stage = $("stage");
    var dom = {
      topStatus: $("topStatus"),
      topStatusText: $("topStatusText"),
      qualitySelect: $("qualitySelect"),
      labelToggle: $("labelToggle"),
      soundToggle: $("soundToggle"),
      volumeWrap: $("volumeWrap"),
      volumeRange: $("volumeRange"),
      helpButton: $("helpButton"),
      canvasHost: $("canvasHost"),
      labelLayer: $("labelLayer"),
      leaderSvg: $("leaderSvg"),
      consoleScroll: $("consoleScroll"),
      workpiece: document.querySelector(".workpiece-card"),
      observationHud: document.querySelector(".observation-hud"),
      hudSpeed: $("hudSpeed"),
      hudObs: $("hudObs"),
      hudMag: $("hudMag"),
      hudSignal: $("hudSignal"),
      cameraRail: document.querySelector(".camera-rail"),
      stageCaption: document.querySelector(".stage-caption"),
      heroStatement: document.querySelector(".hero-statement"),
      modeCaption: $("modeCaption"),
      modeEyebrow: $("modeEyebrow"),
      modeTitle: $("modeTitle"),
      modeCopy: $("modeCopy"),
      datumLive: $("datumLive"),
      datumState: $("datumState"),
      datumFill: $("datumFill"),
      datumU: $("datumU"),
      orbitHint: $("orbitHint"),
      micronScale: $("micronScale"),
      scaleMag: $("scaleMag"),
      scaleFill: $("scaleFill"),
      scaleMarker: $("scaleMarker"),
      scaleDelta: $("scaleDelta"),
      scaleNote: $("scaleNote"),
      cinemaLayer: $("cinemaLayer"),
      cinemaTime: $("cinemaTime"),
      cinemaTitle: $("cinemaTitle"),
      cinemaCopy: $("cinemaCopy"),
      cinemaProgress: $("cinemaProgress"),
      dock: $("dock"),
      dockFace: $("dockFace"),
      processSteps: $("processSteps"),
      btnPlay: $("btnPlay"),
      btnPause: $("btnPause"),
      btnPlayText: $("btnPlayText"),
      timelineRange: $("timelineRange"),
      timelineRead: $("timelineRead"),
      timelineFill: $("timelineFill"),
      timelineSamples: $("timelineSamples"),
      timelineKnob: $("timelineKnob"),
      timelineTrack: $("timelineTrack"),
      dockObserve: $("dockObserve"),
      fsStatus: $("fsmStatus"),
      faceTag: $("faceTag"),
      readS: $("readS"),
      readPhi: $("readPhi"),
      readDelta: $("readDelta"),
      read3d: $("read3d"),
      readErr: $("readErr"),
      readAlpha: $("readAlpha"),
      readYPos: $("readYPos"),
      readRpm: $("readRpm"),
      readAngle: $("readAngle"),
      signalPreset: $("signalPreset"),
      scanSpeed: $("scanSpeed"),
      speedValue: $("speedValue"),
      sampleCount: $("sampleCount"),
      samplesValue: $("samplesValue"),
      observeModes: $("observeModes"),
      observeValue: $("observeValue"),
      observeModeLabel: $("observeModeLabel"),
      presentationScale: $("presentationScale"),
      magnify: $("magnify"),
      magnifyValue: $("magnifyValue"),
      coarseX: $("coarseX"),
      coarseValue: $("coarseValue"),
      micValue: $("micValue"),
      probeForce: $("probeForce"),
      forceValue: $("forceValue"),
      faceSegmented: $("faceSegmented"),
      chartSection: $("chartSection"),
      profileChart: $("profileChart"),
      axisToggle: $("axisToggle"),
      chartResult: $("chartResult"),
      ffLeft: $("ffLeft"),
      ffRight: $("ffRight"),
      sourceBars: document.querySelector(".source-bars"),
      partInspector: $("partInspector"),
      inspectorCode: $("inspectorCode"),
      inspectorName: $("inspectorName"),
      inspectorDesc: $("inspectorDesc"),
      inspectorSpecs: $("inspectorSpecs"),
      inspectorClose: $("inspectorClose"),
      eduMag: $("eduMag"),
      helpModal: $("helpModal"),
      loadingScreen: $("loadingScreen"),
      loadingProgress: $("loadingProgress"),
      loadingText: $("loadingText"),
      loadingPct: $("loadingPct"),
      fatalScreen: $("fatalScreen"),
      toast: $("toast"),
      debugPanel: $("debugPanel"),
      debugFps: $("debugFps"),
      debugCalls: $("debugCalls"),
      debugTris: $("debugTris"),
      debugS: $("debugS"),
      debugA: $("debugA"),
      debugScale: $("debugScale"),
      debugMag: $("debugMag"),
      debugFsm: $("debugFsm")
    };
    var ui = {
      actionButtons: $$("[data-action]"),
      playButtons: $$('[data-action="play"]'),
      pauseButtons: $$('[data-action="pause"]'),
      playLabels: $$('[data-action="play"] .action-label'),
      pauseLabels: $$('[data-action="pause"] .action-label'),
      positionButtons: $$('[data-action="position"]'),
      reverseButtons: $$('[data-action="reverse"]'),
      resetButtons: $$('[data-action="reset"], [data-action="reset-measurement"]'),
      faceButtons: $$("#faceSegmented button"),
      viewButtons: $$(".camera-rail [data-view]"),
      structureButtons: $$(".view-modes [data-structure]"),
      observeButtons: $$("[data-observe]"),
      micButtons: $$("[data-mic]"),
      sourceButtons: $$("[data-source]"),
      processItems: $$("#processSteps li"),
      rangeInputs: $$('input[type="range"]')
    };
    var state = {
      quality: "auto",
      observeMode: "auto",
      manualScale: 1,
      presentationScale: 1,
      magnify: 500,
      structure: "exterior",
      frozen: false,
      estop: false,
      exploded: false,
      explodeTarget: 0,
      explodeProgress: 0,
      leavingExplode: false,
      explodeState: null,
      labelsOn: true,
      selectedKeys: [],
      micrometer: 0,
      timelineDragging: false,
      debug: false,
      cinema: {
        active: false,
        t: 0,
        duration: 26.8,
        events: [],
        index: 0,
        savedSpeed: 2,
        savedObserveMode: "auto",
        savedObserveScale: 1,
        changedSpeed: false,
        labelsBefore: true,
        startedAt: 0
      }
    };
    var renderer;
    var scene;
    var camera;
    var controls;
    var environment;
    var materials;
    var post;
    var instrument;
    var gear;
    var engine;
    var cameraDirector;
    var annotations;
    var chart;
    var audio;
    var explodeLight = null;
    var sampleSystems = {};
    var contactGlow = null;
    var sampleFlash = null;
    var selectionLines = [];
    var pulseLines = [];
    var pulseLineClearAt = 0;
    var explodeEntries = [];
    var gearBasePosition = new THREE9.Vector3();
    var lastFrame = performance.now();
    var lastUI = 0;
    var firstFrameRendered = false;
    var loadingProgress = 0;
    var fpsAvg = 60;
    var frameCount = 0;
    var fpsAccum = 0;
    var sampleSerialSeen = 0;
    var pulseUntil = 0;
    var lastSampleTick = 0;
    var hoverRayTimer = 0;
    var resizeScheduled = false;
    var lastPositioned = false;
    var lastPinLocked = true;
    var lastAudioUpdate = 0;
    var lastCompletionMode = null;
    var shadowUpdateFrame = 0;
    var lastShadowState = null;
    var shadowDirty = true;
    function pruneSmallShadowCasters(root) {
      const geoRadius = /* @__PURE__ */ new Map();
      root.traverse((o) => {
        if (!o.isMesh && !o.isInstancedMesh) return;
        const geo = o.geometry;
        if (!geo) return;
        let radius = geoRadius.get(geo);
        if (radius === void 0) {
          if (!geo.boundingSphere) geo.computeBoundingSphere();
          radius = geo.boundingSphere?.radius || 0;
          geoRadius.set(geo, radius);
        }
        if (radius < 38) {
          o.castShadow = false;
          o.receiveShadow = false;
        }
      });
    }
    var frameState = {
      engineSnapshot: null,
      timeScale: 1,
      visualDelta: 0,
      camMoving: false
    };
    var _v = new THREE9.Vector3();
    var _v2 = new THREE9.Vector3();
    var raycaster = new THREE9.Raycaster();
    var ndc = new THREE9.Vector2();
    function setLoading(pct, text) {
      loadingProgress = pct;
      if (dom.loadingProgress) dom.loadingProgress.style.width = `${pct}%`;
      if (dom.loadingPct) dom.loadingPct.textContent = String(Math.round(pct)).padStart(2, "0");
      if (dom.loadingText && text) dom.loadingText.textContent = text;
    }
    function showFatal(message) {
      console.error(message);
      if (dom.fatalScreen) {
        dom.fatalScreen.hidden = false;
        const p = dom.fatalScreen.querySelector("p");
        if (p && message) p.textContent = String(message);
      }
      dom.loadingScreen?.classList.add("is-done");
    }
    function nextAnimationFrame() {
      return new Promise((resolve) => requestAnimationFrame(resolve));
    }
    async function boot() {
      try {
        setLoading(4, "\u6B63\u5728\u5EFA\u7ACB\u6D4B\u91CF\u5750\u6807\u7CFB");
        await nextAnimationFrame();
        renderer = new THREE9.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        });
        renderer.outputColorSpace = THREE9.SRGBColorSpace;
        renderer.toneMapping = THREE9.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.56;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE9.PCFShadowMap;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true;
        renderer.info.autoReset = false;
        renderer.domElement.style.touchAction = "none";
        renderer.setClearAlpha(0);
        dom.canvasHost.appendChild(renderer.domElement);
        const w = Math.max(320, stage.clientWidth);
        const h = Math.max(300, stage.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.setSize(w, h, false);
        scene = new THREE9.Scene();
        scene.background = null;
        scene.fog = new THREE9.FogExp2(15659767, 5e-5);
        camera = new THREE9.PerspectiveCamera(LAYOUT.camera.fov, w / h, LAYOUT.camera.near, LAYOUT.camera.far);
        camera.position.set(...LAYOUT.camera.defaultPos);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(...LAYOUT.camera.defaultTarget);
        controls.enableDamping = true;
        controls.dampingFactor = 0.065;
        controls.minDistance = 260;
        controls.maxDistance = 7e3;
        controls.minPolarAngle = 0.07;
        controls.maxPolarAngle = Math.PI * 0.493;
        controls.zoomSpeed = 0.8;
        controls.rotateSpeed = 0.65;
        controls.panSpeed = 0.55;
        controls.update();
        setLoading(16, "\u914D\u7F6E\u6444\u5F71\u68DA\u73AF\u5883\u5149");
        materials = createMaterials(renderer);
        environment = createStageEnvironment(renderer, scene, materials, state.quality);
        explodeLight = new THREE9.SpotLight(12900581, 0, 1700, 0.62, 0.85, 0);
        explodeLight.position.set(820, 880, 1240);
        explodeLight.target.position.set(0, 130, 0);
        explodeLight.castShadow = false;
        scene.add(explodeLight, explodeLight.target);
        await nextAnimationFrame();
        setLoading(34, "\u88C5\u914D L \u5F62\u60AC\u81C2\u673A\u6784");
        engine = new MeasurementEngine();
        engine.setSpeed(CFG.scan.defaultSpeed);
        engine.setSampleCount(CFG.scan.defaultSamples);
        instrument = createInstrument(materials);
        scene.add(instrument.root);
        pruneSmallShadowCasters(instrument.root);
        engine.setUserCoarse(34);
        instrument.motion.apply({
          s: LENGTH / 2,
          xCoarse: 60,
          alphaDeg: CFG.reversal.angle,
          ballDrop: 1,
          visualDelta: 0,
          forceN: 0.3,
          lockPinned: true,
          motorAngle: 0
        });
        instrument.root.updateMatrixWorld(true);
        const contact = new THREE9.Vector3();
        instrument.anchors.ruby.getWorldPosition(contact);
        setLoading(52, "\u5C31\u4F4D\u5DE8\u578B\u4EBA\u5B57\u9F7F\u8F6E\u6247\u6BB5");
        gear = createGear(materials, contact, instrument.root.rotation.y);
        gear.group.traverse((o) => {
          if (o.isMesh && !o.userData.partKey) o.userData.partKey = "gear";
        });
        scene.add(gear.group);
        gearBasePosition.copy(gear.group.position);
        await nextAnimationFrame();
        setLoading(68, "\u63A5\u5165\u4E09\u8F74\u6D4B\u91CF\u94FE");
        const snap = engine.getSnapshot();
        instrument.motion.apply({
          s: snap.s,
          xCoarse: snap.xCoarse,
          alphaDeg: snap.alpha,
          ballDrop: snap.ballDrop,
          visualDelta: 0,
          forceN: snap.forceN,
          lockPinned: snap.pinLocked,
          motorAngle: snap.motorAngle
        });
        setupStageExtras();
        setLoading(82, "\u7F16\u6392\u5B9E\u65F6\u6D4B\u91CF\u754C\u9762");
        try {
          post = createPostPipeline(renderer, scene, camera, state.quality);
        } catch (err) {
          console.warn("Post-processing unavailable, using direct render path.", err);
          post = null;
        }
        chart = new ProfileChart(dom.profileChart);
        audio = new AudioEngine();
        cameraDirector = new CameraDirector(camera, controls, annotationsAnchors(), instrument.root.rotation.y, syncViewButtons);
        annotations = new AnnotationSystem({
          layer: dom.labelLayer,
          svg: dom.leaderSvg,
          anchors: annotationsAnchors(),
          camera,
          renderer,
          occluders: instrument.partGroups.base?.concat(instrument.partGroups.column || []) || []
        });
        annotations.resize();
        annotations.setEnabled(state.labelsOn);
        wireEvents();
        applyQuality(state.quality, true);
        if (dom.datumU) {
          const repeat = CFG.precision.errors.find((e) => e.name.includes("\u5B9A\u4F4D\u91CD\u590D\u6027"))?.u;
          dom.datumU.textContent = repeat == null ? "\u2014" : String(repeat);
        }
        bindRangeFills();
        updateObserveUI(true);
        updateAllUI(true);
        resizeScene();
        setLoading(100, "\u6D4B\u91CF\u5750\u6807\u7CFB\u5DF2\u5EFA\u7ACB");
        await nextAnimationFrame();
        dom.loadingScreen.classList.add("is-done");
        requestAnimationFrame(tick);
        window.__APP__ = {
          THREE: THREE9,
          scene,
          camera,
          renderer,
          controls,
          post,
          instrument,
          gear,
          engine,
          cameraDirector,
          annotations,
          chart,
          audio,
          environment,
          materials,
          state,
          setSection,
          setStructure,
          applyQuality,
          enterExplosion,
          exitExplosion,
          startCinema,
          stopCinema,
          selectPartKeys,
          clearSelection,
          applyExplosion,
          updateExplosion,
          finishExplodeState,
          refreshUI,
          updateAllUI,
          updateCinema,
          doPlay,
          doPause,
          doReset,
          resizeScene,
          raycastPart,
          get debugFunctions() {
            return { applyExplosion, updateExplosion, updateCinema, refreshUI };
          }
        };
      } catch (err) {
        showFatal(err?.stack || err?.message || err);
      }
    }
    function annotationsAnchors() {
      if (!instrument) return {};
      return {
        ...instrument.anchors,
        gear: gear?.anchor,
        column: instrument.anchors.column
      };
    }
    function setupStageExtras() {
      const shadowTex = makeContactShadowTexture(256, 0.82);
      const shadowMat = new THREE9.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.42,
        color: 0,
        depthWrite: false,
        toneMapped: false
      });
      const shadow = new THREE9.Mesh(new THREE9.PlaneGeometry(780, 660), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, 0.5, -20);
      shadow.renderOrder = 1;
      shadow.raycast = () => {
      };
      instrument.root.add(shadow);
      const dotTex = makeGlowTexture(64, "#A94B0B", "rgba(255,250,242,1)", "rgba(169,75,11,.70)");
      const maxSamples = CFG.scan.maxSamples;
      for (const face of ["left", "right"]) {
        const geo = new THREE9.BufferGeometry();
        const positions = new Float32Array(maxSamples * 3);
        geo.setAttribute("position", new THREE9.BufferAttribute(positions, 3).setUsage(THREE9.DynamicDrawUsage));
        geo.setDrawRange(0, 0);
        geo.computeBoundingSphere();
        const mat = new THREE9.PointsMaterial({
          size: face === "left" ? 7.4 : 6.4,
          map: dotTex,
          color: new THREE9.Color(COLORS.amber).multiplyScalar(face === "left" ? 1.35 : 1.1),
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          depthTest: false,
          blending: THREE9.NormalBlending,
          sizeAttenuation: true,
          toneMapped: false
        });
        const points = new THREE9.Points(geo, mat);
        points.renderOrder = 5;
        points.frustumCulled = false;
        points.name = `SamplePoints_${face}`;
        scene.add(points);
        sampleSystems[face] = { points, geo, positions, mat, count: 0 };
      }
      const glowTex = makeGlowTexture(64, "#A94B0B", "rgba(255,250,242,.98)", "rgba(169,75,11,.58)");
      const glowMat = new THREE9.SpriteMaterial({
        map: glowTex,
        color: new THREE9.Color(COLORS.amber).multiplyScalar(1.25),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        blending: THREE9.NormalBlending,
        toneMapped: false
      });
      contactGlow = new THREE9.Sprite(glowMat);
      contactGlow.scale.set(17, 17, 1);
      contactGlow.renderOrder = 6;
      instrument.anchors.ruby.add(contactGlow);
      const flashMat = new THREE9.SpriteMaterial({
        map: glowTex,
        color: new THREE9.Color(13199890),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        blending: THREE9.NormalBlending,
        toneMapped: false
      });
      sampleFlash = new THREE9.Sprite(flashMat);
      sampleFlash.scale.set(34, 34, 1);
      sampleFlash.renderOrder = 7;
      scene.add(sampleFlash);
      const glint = new THREE9.Sprite(new THREE9.SpriteMaterial({
        map: glowTex,
        color: new THREE9.Color(11805464),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE9.NormalBlending,
        toneMapped: false
      }));
      glint.scale.set(8, 8, 1);
      instrument.anchors.ruby.add(glint);
    }
    var QUALITY = {
      high: { dpr: () => Math.min(window.devicePixelRatio || 1, 2), shadow: 2048, post: true, dust: true },
      auto: {
        dpr: () => {
          if (window.innerWidth <= 760) return Math.min(window.devicePixelRatio || 1, 1.15);
          const cores = navigator.hardwareConcurrency || 8;
          return Math.min(window.devicePixelRatio || 1, cores <= 4 ? 1.25 : 1.5);
        },
        shadow: 1024,
        post: true,
        dust: true
      },
      smooth: { dpr: () => Math.min(window.devicePixelRatio || 1, 1), shadow: 512, post: false, dust: false }
    };
    var SIGNAL_LABELS = {
      idle: "STANDBY",
      positioning: "POSITIONING",
      approach: "APPROACH",
      scanning: "SCANNING",
      retract: "RETRACT",
      reversing: "REVERSING",
      done: "COMPLETE"
    };
    function setStatusTone(el, tone) {
      if (el) el.dataset.tone = tone || "idle";
    }
    function formatMm(v, digits = 3) {
      return Number(v).toFixed(digits);
    }
    function formatMicron(v, digits = 1) {
      return Number(v).toFixed(digits);
    }
    function signedNum(v, digits = 2, unit = "\xB0") {
      const n = Number(v);
      return `${n >= 0 ? "+" : "\u2212"}${Math.abs(n).toFixed(digits)}${unit}`;
    }
    function currentTimeScale() {
      if (state.cinema.active) return 1;
      if (state.observeMode === "real") return 1;
      if (state.observeMode === "auto") {
        const close = state.structure === "section" || cameraDirector?.currentPreset === "transfer";
        return close ? 0.2 : 1;
      }
      return state.manualScale;
    }
    function setRangeFill(input) {
      if (!input) return;
      const min = Number(input.min || 0);
      const max = Number(input.max || 100);
      const val = Number(input.value);
      const pct = max > min ? (val - min) / (max - min) * 100 : 0;
      input.style.setProperty("--fill", `${clamp(pct, 0, 100)}%`);
    }
    function bindRangeFills() {
      for (const input of ui.rangeInputs) {
        setRangeFill(input);
        input.addEventListener("input", () => setRangeFill(input), { passive: true });
      }
    }
    function applyQuality(mode, initial = false) {
      const q = QUALITY[mode] || QUALITY.auto;
      state.quality = mode;
      if (!renderer) return;
      const w = Math.max(320, stage.clientWidth);
      const h = Math.max(300, stage.clientHeight);
      const dpr = q.dpr();
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
      shadowDirty = true;
      const autoCompact = mode === "auto" && window.innerWidth <= 760;
      const renderMode = autoCompact ? "smooth" : mode;
      environment?.setQuality(renderMode);
      if (post) {
        post.setMode(renderMode === "smooth" ? "smooth" : mode);
        post.resize(w, h, dpr);
      }
      if (dom.qualitySelect) dom.qualitySelect.value = mode;
      resizeScene();
      if (!initial) toast(`\u753B\u8D28\u5DF2\u5207\u6362\u4E3A${mode === "high" ? "\u9AD8\u753B\u8D28" : mode === "smooth" ? "\u6D41\u7545" : "\u81EA\u52A8"}`, "info");
    }
    function resizeScene() {
      if (!renderer || !camera) return;
      const w = Math.max(320, stage.clientWidth);
      const h = Math.max(300, stage.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (cameraDirector && cameraDirector.currentPreset === "overview" && !cameraDirector.tween) {
        camera.fov = window.innerWidth <= 760 ? 48 : LAYOUT.camera.fov;
      }
      camera.updateProjectionMatrix();
      if (post) post.resize(w, h, renderer.getPixelRatio());
      annotations?.resize();
      chart?.resize();
    }
    function syncViewButtons(name) {
      for (const btn of ui.viewButtons) {
        const v = btn.dataset.view;
        btn.classList.toggle("is-active", !!name && (v === name || name === "reset" && v === "reset"));
      }
      applyAnnotationModeForView(name);
    }
    function applyAnnotationModeForView(name) {
      if (!annotations || state.cinema.active) return;
      if (state.structure === "section") annotations.setMode("section");
      else if (state.structure === "exploded") annotations.setMode("exploded");
      else if (name === "positioning") annotations.setMode("positioning");
      else annotations.setMode("default");
    }
    function showToast(message, tone = "info", duration = 2300) {
      if (!dom.toast) return;
      dom.toast.textContent = message;
      dom.toast.dataset.tone = tone;
      dom.toast.classList.add("is-visible");
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => dom.toast.classList.remove("is-visible"), duration);
    }
    function toast(message, tone = "info", duration = 2300) {
      showToast(message, tone, duration);
    }
    function openHelp() {
      dom.helpModal.hidden = false;
      document.body.classList.add("modal-open");
      setTimeout(() => dom.helpModal.querySelector(".modal-close")?.focus(), 30);
    }
    function closeHelp() {
      dom.helpModal.hidden = true;
      document.body.classList.remove("modal-open");
      dom.helpButton?.focus();
    }
    function processModeLabel() {
      if (state.estop) return "\u6025\u505C";
      if (state.frozen) return "\u5DF2\u6682\u505C";
      if (engine.paused) return "\u5DF2\u6682\u505C";
      switch (engine.mode) {
        case "positioning":
          return "\u5B9A\u4F4D\u4E2D";
        case "approach":
          return "\u8FDB\u7ED9\u4E2D";
        case "scanning":
          return "\u626B\u63CF\u4E2D";
        case "retract":
          return "\u9000\u56DE\u4E2D";
        case "reversing":
          return "\u6362\u5411\u4E2D";
        case "done":
          return "\u5B8C\u6210";
        default:
          return "\u5F85\u673A";
      }
    }
    function setDisabled(el, disabled) {
      if (!el) return;
      el.disabled = !!disabled;
    }
    function updateActionButtons(snapshot) {
      const active = engine.isActive();
      const paused = engine.paused;
      const blocked = state.estop || state.frozen || state.exploded;
      const playDisabled = blocked || active && !paused;
      const pauseDisabled = blocked || !active;
      const positionDisabled = blocked || active;
      const reverseDisabled = blocked || active;
      const faceDisabled = blocked || active;
      for (const b of ui.playButtons) {
        setDisabled(b, playDisabled);
        b.setAttribute("aria-disabled", String(playDisabled));
      }
      for (const b of ui.pauseButtons) {
        setDisabled(b, pauseDisabled);
        b.setAttribute("aria-pressed", String(paused));
      }
      for (const b of ui.positionButtons) setDisabled(b, positionDisabled);
      for (const b of ui.reverseButtons) setDisabled(b, reverseDisabled);
      for (const b of ui.faceButtons) setDisabled(b, faceDisabled);
      const playLabel = state.estop ? "\u6025\u505C\u4E2D" : blocked ? "\u673A\u6784\u5DF2\u51BB\u7ED3" : paused ? "\u7EE7\u7EED\u6D4B\u91CF" : active ? "\u6D4B\u91CF\u4E2D" : engine.mode === "done" ? "\u91CD\u65B0\u6D4B\u91CF" : "\u542F\u52A8\u6D4B\u91CF";
      for (const label of ui.playLabels) label.textContent = playLabel;
      if (dom.btnPlayText) dom.btnPlayText.textContent = playLabel;
      for (const label of ui.pauseLabels) label.textContent = paused ? "\u7EE7\u7EED" : "\u6682\u505C";
      setDisabled(dom.coarseX, blocked || active);
      setDisabled(dom.timelineRange, blocked);
      for (const b of ui.micButtons) setDisabled(b, blocked || active);
    }
    function updateProcessSteps(snapshot) {
      const completed = new Set(snapshot.completedSteps || []);
      if (snapshot.mode === "done") STEPS.forEach((s) => completed.add(s.key));
      const active = snapshot.activeStep || (snapshot.paused ? engine.pausedMode && mapModeStep(engine.pausedMode) : null);
      for (const li of ui.processItems) {
        const k = li.dataset.step;
        li.classList.toggle("is-active", k === active);
        li.classList.toggle("is-done", completed.has(k) && k !== active);
        li.classList.toggle("is-position", k === "position");
        li.classList.toggle("is-reverse", k === "reverse");
        if (k === "done" && snapshot.mode === "done") li.classList.add("is-done");
      }
    }
    function mapModeStep(mode) {
      return { positioning: "position", approach: "approach", scanning: "scan", retract: "retract", reversing: "reverse", done: "done" }[mode] || null;
    }
    function updateChartAndResult(snapshot, now) {
      const hasData = snapshot.faces.left.samples.length + snapshot.faces.right.samples.length > 0;
      chart.update({
        faces: {
          left: { samples: snapshot.faces.left.samples, complete: snapshot.faces.left.complete },
          right: { samples: snapshot.faces.right.samples, complete: snapshot.faces.right.complete }
        },
        current: hasData || engine.isActive() ? { s: snapshot.s, e: snapshot.currentError } : null,
        currentFace: snapshot.face,
        result: snapshot.result
      });
      chart.draw(now);
      const leftFF = snapshot.faces.left.samples.length >= 2 ? snapshot.faces.left.ff : null;
      const rightFF = snapshot.faces.right.samples.length >= 2 ? snapshot.faces.right.ff : null;
      if (dom.ffLeft) dom.ffLeft.textContent = leftFF == null ? "\u2014" : `${formatMicron(leftFF)} \u03BCm`;
      if (dom.ffRight) dom.ffRight.textContent = rightFF == null ? "\u2014" : `${formatMicron(rightFF)} \u03BCm`;
      const activeScan = engine.isActive() || engine.paused;
      const hasAny = leftFF != null || rightFF != null;
      let tone = "idle";
      let label = "\u7B49\u5F85\u626B\u63CF\u6570\u636E";
      if (hasAny) {
        if (snapshot.mode === "done" || snapshot.faces.left.complete && snapshot.faces.right.complete) {
          tone = snapshot.result.tone;
          label = snapshot.result.label;
        } else if (activeScan) {
          tone = "active";
          const faceName = snapshot.face === "left" ? "\u5DE6" : "\u53F3";
          label = `\u626B\u63CF\u4E2D \xB7 ${faceName}\u9F7F\u9762 ff ${formatMicron(snapshot.faces[snapshot.face].ff ?? 0)} \u03BCm`;
        } else {
          tone = snapshot.result.tone;
          label = snapshot.result.label;
        }
      }
      const roleEl = dom.chartResult.querySelector(".result-state");
      if (roleEl) {
        roleEl.dataset.tone = tone;
        roleEl.querySelector("span").textContent = label;
      }
      app.dataset.result = tone === "fail" || tone === "warn" ? tone : snapshot.result.tone === "fail" ? "fail" : "";
      return { tone, label };
    }
    function buildTimelineTicks(count) {
      if (!dom.timelineSamples || dom.timelineSamples.dataset.count === String(count)) return;
      dom.timelineSamples.dataset.count = String(count);
      dom.timelineSamples.innerHTML = "";
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const mark = document.createElement("i");
        mark.style.left = `${i / (count - 1) * 100}%`;
        frag.appendChild(mark);
      }
      dom.timelineSamples.appendChild(frag);
    }
    function updateTimeline(snapshot) {
      const pct = clamp(snapshot.s / LENGTH, 0, 1) * 100;
      if (dom.timelineFill) dom.timelineFill.style.width = `${pct}%`;
      if (dom.timelineKnob) dom.timelineKnob.style.left = `${pct}%`;
      if (dom.timelineRead) dom.timelineRead.textContent = formatMm(snapshot.s);
      if (dom.timelineRange && !state.timelineDragging) dom.timelineRange.value = snapshot.s;
      buildTimelineTicks(engine.sampleCount);
    }
    function updateFaceAndAngleUI(snapshot) {
      const targetFace = snapshot.nextFace || snapshot.face;
      const faceName = targetFace === "left" ? "\u5DE6\u9F7F\u9762" : "\u53F3\u9F7F\u9762";
      const actual = signedNum(snapshot.alpha);
      if (dom.faceTag) {
        dom.faceTag.dataset.face = targetFace;
        dom.faceTag.innerHTML = `${faceName} <b>${actual}</b>`;
      }
      if (dom.dockFace) dom.dockFace.innerHTML = `${faceName} \xB7 <b>${actual}</b>`;
      for (const b of ui.faceButtons) b.classList.toggle("is-active", b.dataset.face === targetFace);
      if (dom.readAlpha) dom.readAlpha.textContent = actual;
      if (dom.readAngle) dom.readAngle.textContent = actual.replace("\xB0", "");
    }
    function refreshUI(snapshot, force = false) {
      if (!snapshot) snapshot = engine.getSnapshot();
      const now = performance.now();
      if (!force && now - lastUI < 45) return;
      lastUI = now;
      const detailView = state.structure !== "exterior" || cameraDirector?.currentPreset && !["overview", "reset", null].includes(cameraDirector.currentPreset);
      stage.classList.toggle("is-detail", !!detailView);
      stage.classList.toggle("is-exploded", state.structure === "exploded");
      stage.classList.toggle("is-section", state.structure === "section");
      const datumActive = !state.cinema.active && (engine.mode === "positioning" || engine.positioned && now < pulseUntil + 500);
      stage.classList.toggle("is-datum", datumActive);
      if (instrument?.motion.datumFill) {
        instrument.motion.datumFill.intensity = datumActive ? 1.25 : 0;
      }
      if (datumActive) {
        const p = engine.mode === "positioning" ? clamp(engine.stateT / 2.2, 0, 1) : 1;
        if (dom.datumFill) dom.datumFill.style.width = `${(p * 100).toFixed(1)}%`;
        if (dom.datumState) dom.datumState.textContent = p >= 0.999 ? "\u57FA\u51C6\u9501\u5B9A" : "\u5165\u69FD\u4E2D";
      }
      updateModeCaption();
      const modeLabel = processModeLabel();
      const blocked = state.estop || state.frozen || state.exploded;
      let tone = "idle";
      if (state.estop) tone = "error";
      else if (state.frozen) tone = "paused";
      else if (engine.paused) tone = "paused";
      else if (engine.mode === "done") {
        const t = snapshot.result.tone;
        tone = t === "fail" ? "error" : t === "warn" ? "paused" : "done";
      } else if (engine.mode === "reversing") tone = "reversal";
      else if (["approach", "scanning", "retract"].includes(engine.mode)) tone = "run";
      else tone = "idle";
      if (dom.topStatusText) dom.topStatusText.textContent = modeLabel;
      if (dom.fsStatus) dom.fsStatus.textContent = state.cinema.active ? "\u7535\u5F71\u6F14\u793A" : modeLabel;
      setStatusTone(dom.topStatus, tone);
      app.dataset.fsm = state.estop ? "error" : state.frozen ? "paused" : engine.paused ? "paused" : engine.mode;
      const s = snapshot.s;
      if (dom.readS) dom.readS.textContent = formatMm(s);
      if (dom.readPhi) dom.readPhi.textContent = `${formatMm(s / CFG.gear.rb * 180 / Math.PI, 3)}\xB0`;
      const activeReading = engine.mode === "scanning" || engine.mode === "approach" || engine.mode === "done" || engine.paused && ["scanning", "approach", "done"].includes(engine.pausedMode) || snapshot.faces[snapshot.face].samples.length > 0;
      const e = activeReading ? snapshot.currentError : 0;
      if (dom.readDelta) dom.readDelta.textContent = formatMicron(e, 1);
      if (dom.read3d) dom.read3d.textContent = formatMicron(e * 3, 1);
      if (dom.readErr) dom.readErr.textContent = formatMicron(e, 1);
      if (dom.readYPos) dom.readYPos.textContent = `${formatMm(s, 3)} mm`;
      if (dom.readRpm) dom.readRpm.textContent = (engine.speed * 12).toFixed(1);
      if (dom.readAngle) dom.readAngle.textContent = signedNum(snapshot.alpha).replace("\xB0", "");
      updateFaceAndAngleUI(snapshot);
      updateTimeline(snapshot);
      updateProcessSteps(snapshot);
      updateActionButtons(snapshot);
      if (dom.hudSignal) dom.hudSignal.textContent = state.estop ? "E-STOP" : state.frozen ? "FROZEN" : engine.paused ? "PAUSED" : SIGNAL_LABELS[engine.mode] || "STANDBY";
      if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
      if (dom.speedValue) dom.speedValue.textContent = engine.speed.toFixed(1);
      if (dom.samplesValue) dom.samplesValue.textContent = String(engine.sampleCount);
      if (dom.coarseValue) dom.coarseValue.textContent = engine.xCoarse.toFixed(1);
      if (dom.coarseX) {
        setRangeFill(dom.coarseX);
        if (!blocked && !engine.isActive() && document.activeElement !== dom.coarseX) {
          dom.coarseX.value = engine.xCoarse.toFixed(1);
        }
      }
      if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
      if (dom.forceValue) dom.forceValue.textContent = engine.forceN.toFixed(2);
      if (dom.probeForce && document.activeElement !== dom.probeForce) dom.probeForce.value = engine.forceN;
      if (dom.sampleCount && document.activeElement !== dom.sampleCount) {
        dom.sampleCount.value = engine.sampleCount;
        setRangeFill(dom.sampleCount);
      }
      if (dom.scanSpeed && document.activeElement !== dom.scanSpeed) {
        dom.scanSpeed.value = engine.speed;
        setRangeFill(dom.scanSpeed);
      }
      if (dom.magnifyValue) dom.magnifyValue.textContent = String(state.magnify);
      if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
      if (dom.eduMag) dom.eduMag.textContent = `\xD7${state.magnify}`;
      if (dom.magnify && document.activeElement !== dom.magnify) {
        dom.magnify.value = state.magnify;
        setRangeFill(dom.magnify);
      }
      updateObserveUI(false);
      updateChartAndResult(snapshot, now);
      updateDebug(snapshot);
    }
    function tick(now) {
      requestAnimationFrame(tick);
      if (document.hidden) {
        lastFrame = now;
        return;
      }
      const measuredDt = Math.max(1e-3, (now - lastFrame) / 1e3);
      const rawDt = clamp(measuredDt, 0, 0.25);
      lastFrame = now;
      fpsAccum += measuredDt;
      frameCount++;
      if (fpsAccum > 0.5) {
        fpsAvg = frameCount / fpsAccum;
        fpsAccum = 0;
        frameCount = 0;
      }
      if (state.cinema.active) updateCinema(rawDt, now);
      const timeScale = currentTimeScale();
      state.presentationScale = timeScale;
      const simDt = state.frozen || state.estop ? 0 : rawDt * timeScale;
      if (simDt > 0) {
        let remaining = simDt;
        let substeps = 0;
        while (remaining > 1e-6 && substeps < 6) {
          const step = Math.min(0.06, remaining);
          engine.update(step);
          remaining -= step;
          substeps++;
        }
      } else {
        engine.update(0);
      }
      const snapshot = engine.getSnapshot();
      frameState.engineSnapshot = snapshot;
      if (engine.positioned && !lastPositioned) {
        pulseUntil = now + 3300;
        instrument.motion.setDatumPulse(true, 1);
        if (audio) audio.positionChime();
        if (!state.cinema.active) toast("\u57FA\u51C6\u5DF2\u5EFA\u7ACB \xB7 W 258.88 mm \xB7 k 11", "info", 2600);
      }
      if (!engine.positioned) lastPositioned = false;
      else lastPositioned = true;
      if (engine.pinLocked && !lastPinLocked && engine.mode !== "done" && !engine.paused) {
        if (audio) audio.lockClick();
      }
      lastPinLocked = engine.pinLocked;
      if (engine.mode === "done" && lastCompletionMode !== "done") {
        const result = engine.getResult();
        if (audio) audio.completionTone(result.tone !== "fail");
        if (!state.cinema.active) toast(result.label, result.tone === "fail" ? "error" : result.tone === "warn" ? "warn" : "info", 3600);
      }
      lastCompletionMode = engine.mode;
      if (audio && audio.ctx && !audio.muted && now - lastAudioUpdate > 220) {
        lastAudioUpdate = now;
        audio.update({
          running: engine.isRunning,
          speed: engine.speed,
          closeup: state.structure === "section" || cameraDirector?.currentPreset === "transfer",
          reversing: engine.mode === "reversing"
        });
      }
      let targetVisual = 0;
      if (!engine.paused && !state.frozen && !state.estop) {
        if (engine.mode === "scanning") {
          targetVisual = clamp(snapshot.highPass / 1e3 * state.magnify, -1.3, 1.3);
        } else if (engine.mode === "approach") {
          targetVisual = -0.06;
        }
      }
      if (engine.paused || state.frozen || state.estop) {
      } else {
        frameState.visualDelta = damp(frameState.visualDelta, targetVisual, 16, Math.min(rawDt, 0.08));
      }
      instrument.motion.apply({
        s: snapshot.s,
        xCoarse: snapshot.xCoarse,
        alphaDeg: snapshot.alpha,
        ballDrop: snapshot.ballDrop,
        visualDelta: frameState.visualDelta,
        forceN: snapshot.forceN,
        lockPinned: snapshot.pinLocked,
        motorAngle: snapshot.motorAngle,
        micrometer: state.micrometer,
        headLift: 0
      });
      updateExplosion(rawDt);
      updatePulse(now, snapshot);
      updateSampleCloud(snapshot, now);
      updateContactGlow(snapshot, now);
      cameraDirector.update(rawDt, !state.frozen && !state.cinema.active);
      if (!cameraDirector.tween) controls.update();
      frameState.camMoving = !!cameraDirector.tween;
      updateMicronScale(snapshot, now);
      annotations.update(now, frameState.camMoving);
      if (pulseLineClearAt && now > pulseLineClearAt) {
        clearTemporaryHighlights();
        pulseLineClearAt = 0;
      }
      refreshUI(snapshot, false);
      const changedMotion = !lastShadowState || Math.abs(snapshot.s - lastShadowState.s) > 2e-3 || Math.abs(snapshot.xCoarse - lastShadowState.x) > 0.01 || Math.abs(snapshot.ballDrop - lastShadowState.ball) > 2e-3 || Math.abs(snapshot.alpha - lastShadowState.alpha) > 0.01;
      lastShadowState = { s: snapshot.s, x: snapshot.xCoarse, ball: snapshot.ballDrop, alpha: snapshot.alpha };
      shadowUpdateFrame++;
      if (renderer) {
        renderer.shadowMap.needsUpdate = shadowDirty || changedMotion && shadowUpdateFrame % 3 === 0;
        shadowDirty = false;
        renderer.info.reset();
        try {
          if (post) post.render(rawDt);
          else renderer.render(scene, camera);
        } catch (err) {
          console.error("Render error, switching to direct render.", err);
          post = null;
          renderer.render(scene, camera);
        }
      }
      if (dom.debugPanel && !dom.debugPanel.hidden) updateDebug(snapshot, true);
      if (!firstFrameRendered) {
        firstFrameRendered = true;
        dom.loadingScreen?.classList.add("is-done");
      }
    }
    function updateDebug(snapshot, valid = false) {
      if (!state.debug) return;
      if (!dom.debugPanel || dom.debugPanel.hidden) return;
      if (dom.debugFps) dom.debugFps.textContent = `${fpsAvg.toFixed(0)} FPS`;
      if (dom.debugCalls) dom.debugCalls.textContent = String(renderer.info.render.calls);
      if (dom.debugTris) dom.debugTris.textContent = String(renderer.info.render.triangles);
      if (dom.debugS) dom.debugS.textContent = `${formatMm(snapshot.s)} mm`;
      if (dom.debugA) dom.debugA.textContent = signedNum(snapshot.alpha);
      if (dom.debugScale) dom.debugScale.textContent = `${state.presentationScale.toFixed(2)}\xD7`;
      if (dom.debugMag) dom.debugMag.textContent = `${state.magnify}\xD7`;
      if (dom.debugFsm) dom.debugFsm.textContent = engine.mode.toUpperCase();
    }
    function updatePulse(now, snapshot) {
      const group = instrument.motion.pulseGroup;
      if (!group) return;
      if (engine.positioned && !state.frozen && !state.estop) {
        if (pulseUntil === 0) {
          pulseUntil = now + 3300;
          instrument.motion.setDatumPulse(true, 1);
        }
      }
      if (now > pulseUntil || !engine.positioned) {
        group.visible = false;
        group.userData.target = 0;
        return;
      }
      group.visible = true;
      const remain = clamp((pulseUntil - now) / 3300, 0, 1);
      const pulse = 0.55 + 0.25 * Math.sin(now * 0.012);
      group.userData.lineMat.opacity = remain * pulse * 0.95;
      group.userData.ringMat.opacity = remain * (0.42 + 0.3 * Math.sin(now * 0.014));
      const sc = 1 + 0.06 * Math.sin(now * 0.01);
      for (const r of group.userData.rings) r.scale.setScalar(sc);
    }
    function probePositionAt(s, out = new THREE9.Vector3()) {
      if (!instrument || !engine) return out.set(0, 0, 0);
      const local = new THREE9.Vector3(
        s - LENGTH / 2,
        LAYOUT.instrument.rubyY,
        LAYOUT.instrument.xCarriageOriginZ - engine.xCoarse + LAYOUT.instrument.rotorZ
      );
      instrument.root.updateMatrixWorld();
      return instrument.root.localToWorld(local);
    }
    function updateSampleCloud(snapshot, now) {
      const currentFace = snapshot.face;
      for (const face of ["left", "right"]) {
        const sys = sampleSystems[face];
        if (!sys) continue;
        if (face !== currentFace) {
          sys.geo.setDrawRange(0, 0);
          sys.count = 0;
          continue;
        }
        const samples = snapshot.faces[face].samples;
        const limit = snapshot.s;
        let count = 0;
        const arr = sys.positions;
        for (const sp of samples) {
          if (sp.s > limit + 1e-3 && !(snapshot.mode === "done" && snapshot.s >= LENGTH - 1e-3)) continue;
          const p = probePositionAt(sp.s, _v2);
          arr[count * 3] = p.x;
          arr[count * 3 + 1] = p.y;
          arr[count * 3 + 2] = p.z;
          count++;
        }
        sys.geo.setDrawRange(0, count);
        sys.geo.attributes.position.needsUpdate = true;
        sys.geo.computeBoundingSphere();
        sys.count = count;
        sys.mat.opacity = 0.2 + 0.75 * (state.estop ? 0 : state.frozen ? 0.2 : 1);
      }
      if (sampleFlash) {
        const age = now / 1e3 - (sampleFlash.userData.bornAt || -10);
        if (age < 0.45) {
          const t = age / 0.45;
          sampleFlash.material.opacity = (1 - t) * 0.85;
          sampleFlash.scale.setScalar(24 + t * 28);
        } else {
          sampleFlash.material.opacity = 0;
        }
      }
      if (sampleSerialSeen !== snapshot.sampleSerial) {
        const delta = snapshot.sampleSerial - sampleSerialSeen;
        sampleSerialSeen = snapshot.sampleSerial;
        if (delta > 0 && delta <= 2 && snapshot.lastNewSample && !engine.paused && !state.frozen) {
          const p = probePositionAt(snapshot.lastNewSample.s, _v2);
          if (sampleFlash) {
            sampleFlash.position.copy(p);
            sampleFlash.userData.bornAt = now / 1e3;
            sampleFlash.material.opacity = 0.85;
            sampleFlash.scale.setScalar(24);
          }
          if (audio) audio.sampleTick();
          lastSampleTick = now;
        }
      }
    }
    function updateContactGlow(snapshot, now) {
      if (!contactGlow || !sampleFlash) return;
      const active = (snapshot.mode === "scanning" || snapshot.mode === "approach" || engine.paused) && !state.frozen && !state.estop;
      const pulse = 0.55 + 0.18 * Math.sin(now * 9e-3);
      contactGlow.material.opacity = active ? pulse : 0;
      contactGlow.visible = active;
      const isRubySelected = state.selectedKeys.includes("ruby");
      contactGlow.scale.setScalar(isRubySelected ? 22 + Math.sin(now * 6e-3) * 2 : 16);
    }
    function updateMicronScale(snapshot, now) {
      if (!dom.micronScale) return;
      const close = state.structure === "section" || cameraDirector?.currentPreset === "transfer" || state.cinema.active && cameraDirector?.currentPreset === "transfer" || state.selectedKeys.includes("ruby");
      const active = engine.mode === "scanning" || engine.mode === "approach" || engine.mode === "done" || engine.paused && ["scanning", "approach"].includes(engine.pausedMode);
      const visible = close && active && !state.exploded && !state.estop;
      dom.micronScale.classList.toggle("is-visible", visible);
      if (!visible) return;
      const anchor = instrument.anchors.ruby;
      anchor.getWorldPosition(_v);
      const projected = _v.clone().project(camera);
      const w = stage.clientWidth, h = stage.clientHeight;
      const x = clamp((projected.x * 0.5 + 0.5) * w + 58, 115, w - 110);
      const y = clamp((-projected.y * 0.5 + 0.5) * h - 10, 250, h - 185);
      dom.micronScale.style.left = `${x}px`;
      dom.micronScale.style.top = `${y}px`;
      const real = snapshot.currentError;
      const vis = Math.abs(frameState.visualDelta);
      if (dom.scaleDelta) dom.scaleDelta.textContent = formatMicron(real, 1);
      if (dom.scaleNote) dom.scaleNote.innerHTML = `\u89C6\u89C9\u4F4D\u79FB <b>${vis.toFixed(2)}</b> mm`;
      if (dom.scaleMag) dom.scaleMag.textContent = String(state.magnify);
      const pct = clamp(vis / 1.3 * 100, 1, 100);
      if (dom.scaleFill) dom.scaleFill.style.width = `${pct}%`;
      if (dom.scaleMarker) dom.scaleMarker.style.left = `${pct}%`;
    }
    function updateObserveUI(force = false) {
      const mode = state.observeMode;
      const scale = currentTimeScale();
      if (mode === "manual" && !state.cinema.active) state.presentationScale = state.manualScale;
      for (const b of ui.observeButtons) {
        const v = b.dataset.observe;
        b.classList.toggle("is-active", mode === "auto" && v === "auto" || mode === "manual" && v === "manual" || mode === "real" && v === "real");
      }
      if (dom.observeModeLabel) dom.observeModeLabel.textContent = mode === "auto" ? "\u81EA\u52A8" : mode === "real" ? "\u771F\u5B9E 1\xD7" : "\u624B\u52A8";
      if (dom.observeValue) dom.observeValue.textContent = scale.toFixed(2);
      if (dom.hudObs) dom.hudObs.textContent = scale.toFixed(2);
      if (dom.presentationScale) {
        if (mode !== "manual" || state.cinema.active) {
          dom.presentationScale.value = scale;
        }
        dom.presentationScale.disabled = mode !== "manual" || state.estop || state.frozen || state.cinema.active;
        setRangeFill(dom.presentationScale);
      }
      if (dom.dockObserve) {
        const value = mode === "auto" ? "auto" : String(state.presentationScale.toFixed(2));
        if (![...dom.dockObserve.options].some((o) => o.value === value)) {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = `${state.presentationScale.toFixed(2)}\xD7`;
          dom.dockObserve.appendChild(opt);
        }
        dom.dockObserve.value = value;
      }
      if (dom.presentationScale) {
        if (!dom.presentationScale.disabled && document.activeElement !== dom.presentationScale && mode === "manual") {
          dom.presentationScale.value = state.manualScale;
        }
        setRangeFill(dom.presentationScale);
      }
      if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
      if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
    }
    function updateAllUI(force = true) {
      if (!engine) return;
      const snapshot = engine.getSnapshot();
      refreshUI(snapshot, true);
      updateStructureButtons();
      updatePresetOption();
      if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
      if (dom.labelToggle) dom.labelToggle.setAttribute("aria-pressed", String(state.labelsOn));
      if (dom.volumeWrap) dom.volumeWrap.classList.toggle("is-visible", !audio?.muted);
      if (dom.volumeRange) {
        dom.volumeRange.value = String(audio?.volume ?? 0.36);
        setRangeFill(dom.volumeRange);
      }
      if (dom.soundToggle) dom.soundToggle.setAttribute("aria-pressed", String(!(audio?.muted ?? true)));
    }
    function updatePresetOption() {
      if (dom.signalPreset && engine) dom.signalPreset.value = engine.preset;
    }
    function doPlay() {
      if (state.estop) {
        toast("\u6025\u505C\u5DF2\u89E6\u53D1\uFF0C\u8BF7\u5148\u590D\u4F4D", "warn");
        return;
      }
      if (state.frozen || state.exploded) {
        toast("\u5206\u5C42/\u51BB\u7ED3\u72B6\u6001\u4E0B\u4E0D\u80FD\u542F\u52A8\u6D4B\u91CF", "warn");
        return;
      }
      if (engine.isActive() && !engine.paused) return;
      if (engine.isActive() && engine.paused) {
        const r = engine.pauseToggle();
        if (r.ok) toast("\u6D4B\u91CF\u7EE7\u7EED", "info");
        frameState.visualDelta = 0;
        updateAllUI(true);
        return;
      }
      if (engine.mode === "done") {
        engine.reset(true);
      }
      const res = engine.start();
      if (!res.ok) {
        toast(res.reason || "\u65E0\u6CD5\u542F\u52A8\u6D4B\u91CF", "warn");
        return;
      }
      pulseUntil = 0;
      frameState.visualDelta = 0;
      if (engine.positioned) {
        pulseUntil = performance.now() + 2e3;
        instrument.motion.setDatumPulse(true, 1);
      }
      toast(engine.mode === "approach" ? "\u6D4B\u91CF\u7EE7\u7EED \xB7 \u8FDB\u5165\u626B\u63CF" : "\u6D4B\u91CF\u542F\u52A8 \xB7 \u53CC\u7403\u5B9A\u4F4D\u4E2D", "info");
      updateAllUI(true);
    }
    function doPause() {
      if (state.frozen || state.exploded) {
        toast("\u8BF7\u5148\u9000\u51FA\u5206\u5C42\u89C6\u56FE", "warn");
        return;
      }
      if (!engine.isActive()) {
        toast("\u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u6D4B\u91CF", "warn");
        return;
      }
      const res = engine.pauseToggle();
      if (res.ok) toast(engine.paused ? "\u6D4B\u91CF\u5DF2\u6682\u505C" : "\u6D4B\u91CF\u7EE7\u7EED", engine.paused ? "warn" : "info");
      updateAllUI(true);
    }
    function doPosition() {
      if (state.estop) {
        toast("\u6025\u505C\u5DF2\u89E6\u53D1\uFF0C\u8BF7\u5148\u590D\u4F4D", "warn");
        return;
      }
      if (state.frozen || state.exploded) {
        toast("\u8BF7\u5148\u9000\u51FA\u73B0\u6709\u7ED3\u6784\u89C6\u56FE", "warn");
        return;
      }
      const res = engine.positionOnly();
      if (!res.ok) {
        toast(res.reason || "\u5B9A\u4F4D\u4E0D\u80FD\u5F00\u59CB", "warn");
        return;
      }
      if (cameraDirector && !state.cinema.active) cameraDirector.flyTo("positioning", { duration: 1.15 });
      toast("\u53CC\u7403\u5165\u69FD\u5B9A\u4F4D \xB7 \u5EFA\u7ACB\u57FA\u51C6", "info");
      updateAllUI(true);
    }
    function doReverse() {
      if (state.estop) {
        toast("\u6025\u505C\u5DF2\u89E6\u53D1\uFF0C\u8BF7\u5148\u590D\u4F4D", "warn");
        return;
      }
      if (state.frozen || state.exploded) {
        toast("\u8BF7\u5148\u9000\u51FA\u5206\u5C42\u89C6\u56FE", "warn");
        return;
      }
      if (engine.isActive()) {
        toast("\u6D4B\u91CF\u8FDB\u884C\u4E2D\uFF0C\u6362\u5411\u7531\u6D41\u7A0B\u81EA\u52A8\u5B8C\u6210", "warn");
        return;
      }
      const target = engine.face === "left" ? "right" : "left";
      const res = engine.manualReverseTo(target);
      if (!res.ok) {
        toast(res.reason || "\u6362\u5411\u4E0D\u80FD\u5F00\u59CB", "warn");
        return;
      }
      toast(`\u6362\u5411\u81F3${target === "left" ? "\u5DE6" : "\u53F3"}\u9F7F\u9762 \xB7 \u5B9A\u4F4D\u9500\u9501\u7D27`, "info");
      updateAllUI(true);
    }
    function doReset() {
      if (state.cinema.active) stopCinema(false);
      if (state.exploded) {
        state.explodeProgress = 0;
        state.explodeTarget = 0;
        state.leavingExplode = false;
        applyExplosion(0);
        finishExplodeState(true);
      }
      state.estop = false;
      stage.classList.remove("is-estop");
      engine.reset(true);
      state.micrometer = 0;
      pulseUntil = 0;
      frameState.visualDelta = 0;
      instrument.motion.setDatumPulse(false, 0);
      const p = instrument.motion.pulseGroup;
      if (p) p.visible = false;
      clearSelection();
      clearTemporaryHighlights();
      toast("\u6D4B\u91CF\u5DF2\u590D\u4F4D \xB7 \u53CC\u7403\u57FA\u51C6\u89E3\u9664", "info");
      updateAllUI(true);
    }
    function selectFace(face) {
      if (!["left", "right"].includes(face)) return;
      if (state.estop || state.frozen || state.exploded) {
        toast("\u5F53\u524D\u89C6\u56FE\u4E0B\u4E0D\u53EF\u6362\u5411", "warn");
        return;
      }
      if (engine.isActive()) {
        toast("\u6D4B\u91CF\u8FDB\u884C\u4E2D\uFF0C\u8BF7\u5148\u6682\u505C", "warn");
        return;
      }
      if (face === engine.face) return;
      const res = engine.manualReverseTo(face);
      if (!res.ok) {
        toast(res.reason || "\u6362\u5411\u4E0D\u80FD\u5F00\u59CB", "warn");
        return;
      }
      toast(`\u6362\u5411\u81F3${face === "left" ? "\u5DE6" : "\u53F3"}\u9F7F\u9762`, "info");
      updateAllUI(true);
    }
    function triggerEmergencyStop() {
      state.estop = true;
      stage.classList.add("is-estop");
      engine.emergencyStop();
      if (state.cinema.active) stopCinema(false);
      if (audio) audio.lockClick();
      toast("\u6025\u505C \xB7 \u673A\u6784\u4FDD\u6301\u5F53\u524D\u4F4D\u7F6E\uFF0C\u8BF7\u590D\u4F4D\u540E\u7EE7\u7EED", "error", 3400);
      refreshUI(engine.getSnapshot(), true);
    }
    function setObserveMode(mode) {
      if (!["auto", "manual", "real"].includes(mode)) return;
      state.observeMode = mode;
      if (mode === "real") state.presentationScale = 1;
      updateObserveUI(true);
      updateAllUI(false);
    }
    function setManualObserveScale(v) {
      state.observeMode = "manual";
      state.manualScale = clamp(Number(v) || 1, 0.05, 1);
      state.presentationScale = state.manualScale;
      updateObserveUI(true);
      updateAllUI(false);
    }
    function changeMagnify(v) {
      state.magnify = clamp(Math.round(Number(v) / 50) * 50, 100, 2e3);
      if (dom.magnifyValue) dom.magnifyValue.textContent = String(state.magnify);
      if (dom.hudMag) dom.hudMag.textContent = String(state.magnify);
      if (dom.eduMag) dom.eduMag.textContent = `\xD7${state.magnify}`;
      if (dom.scaleMag) dom.scaleMag.textContent = String(state.magnify);
    }
    function changeMicrometer(dir) {
      if (engine.isActive() || state.frozen || state.estop) return;
      const next = clamp(state.micrometer + dir * 0.01, -0.99, 0.99);
      state.micrometer = Math.round(next * 100) / 100;
      if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
      refreshUI(engine.getSnapshot(), true);
    }
    function setScanPreset(value) {
      if (state.cinema.active) stopCinema(false);
      if (state.estop) {
        toast("\u6025\u505C\u5DF2\u89E6\u53D1\uFF0C\u8BF7\u5148\u590D\u4F4D", "warn");
        updatePresetOption();
        return;
      }
      if (state.exploded) {
        toast("\u8BF7\u5148\u9000\u51FA\u5206\u5C42\u89C6\u56FE", "warn");
        updatePresetOption();
        return;
      }
      engine.setPreset(value);
      clearSelection();
      frameState.visualDelta = 0;
      pulseUntil = 0;
      toast(`\u8BEF\u5DEE\u4FE1\u53F7\u5207\u6362\u4E3A${value === "pass" ? "\u5408\u683C\u793A\u4F8B" : value === "fail" ? "\u8D85\u5DEE\u793A\u4F8B" : "\u968F\u673A\u793A\u610F"}`, "info");
      updateAllUI(true);
    }
    function applySectionVisual(section) {
      if (!instrument) return;
      for (const obj of instrument.motion.sectionHide || []) obj.visible = !section;
      for (const obj of instrument.motion.sectionShow || []) obj.visible = section;
      for (const obj of instrument.motion.bearingSectionHide || []) obj.visible = !section;
      const cutFace = instrument.motion.headShell?.userData?.cutFace;
      if (cutFace) cutFace.visible = false;
    }
    function updateStructureButtons() {
      for (const b of ui.structureButtons) {
        b.classList.toggle("is-active", b.dataset.structure === state.structure);
      }
    }
    function updateModeCaption() {
      if (!dom.modeCaption) return;
      if (state.structure === "exploded") {
        dom.modeEyebrow.textContent = "EXPLODED / 05 MODULES";
        dom.modeTitle.textContent = "\u5206\u5C42\u7206\u70B8\u89C6\u56FE";
        dom.modeCopy.textContent = "\u57FA\u5EA7 \u2192 \u7ACB\u67F1\u60AC\u81C2 \u2192 Y \u8F74\u9A71\u52A8 \u2192 \u5FAE\u4F4D\u79FB\u4F20\u9012 \u2192 \u9F7F\u8F6E";
      } else if (state.structure === "section") {
        dom.modeEyebrow.textContent = "SECTION A\u2014A / TRANSFER";
        dom.modeTitle.textContent = "3 : 1 \u5FAE\u4F4D\u79FB\u4F20\u9012\u94FE";
        dom.modeCopy.textContent = "\u7EA2\u5B9D\u77F3\u6D4B\u7403 \u2192 \u6D4B\u6746 \u2192 \u6760\u6746 \u2192 \u5355\u7247\u7C27 \u2192 LVDT";
      }
    }
    function setSection(enabled, opts = {}) {
      if (!instrument) return;
      if (state.exploded) {
        exitExplosion({ pendingStructure: enabled ? "section" : "exterior" });
        return;
      }
      state.structure = enabled ? "section" : "exterior";
      applySectionVisual(enabled);
      shadowDirty = true;
      if (annotations && annotations.mode !== "exploded") {
        annotations.setMode(enabled ? "section" : "default");
        annotations.setEnabled(state.labelsOn && !state.cinema.active);
      }
      updateStructureButtons();
      if (enabled) {
        if (!opts.skipCamera && cameraDirector) cameraDirector.flyTo("transfer", { duration: 1.15 });
        toast("A\u2014A \u5C40\u90E8\u5256\u5207 \xB7 \u8BEF\u5DEE\u4F20\u9012\u94FE\u5DF2\u663E\u9732", "info");
      } else {
        toast("\u6062\u590D\u5916\u89C2\u89C6\u56FE", "info");
      }
      updateObserveUI(true);
      updateAllUI(true);
    }
    function setStructureExterior() {
      if (!instrument) return;
      if (state.exploded) {
        exitExplosion({ pendingStructure: "exterior" });
        return;
      }
      state.structure = "exterior";
      applySectionVisual(false);
      if (annotations && annotations.mode !== "exploded") {
        annotations.setMode("default");
        annotations.setEnabled(state.labelsOn && !state.cinema.active);
      }
      updateStructureButtons();
      updateObserveUI(true);
      updateAllUI(true);
    }
    function buildExplosionEntries() {
      if (explodeEntries.length) return;
      explodeEntries = instrument.explodeGroups.map((e) => ({
        ...e,
        base: e.base.clone(),
        offset: e.offset.clone()
      }));
      explodeEntries.sort((a, b) => (a.delay || 0) - (b.delay || 0));
    }
    function enterExplosion() {
      if (!instrument || state.exploded) return;
      if (state.cinema.active) stopCinema(false);
      if (state.estop) {
        toast("\u6025\u505C\u72B6\u6001\u4E0B\u4E0D\u80FD\u8FDB\u5165\u5206\u5C42\u89C6\u56FE", "warn");
        return;
      }
      buildExplosionEntries();
      state.explodeState = {
        structure: state.structure,
        camera: cameraDirector?.saveState(),
        paused: engine.paused,
        labels: state.labelsOn
      };
      state.frozen = true;
      state.exploded = true;
      state.structure = "exploded";
      state.explodeTarget = 1;
      state.explodeProgress = 0;
      state.leavingExplode = false;
      state.explodeFloor = { floor: environment.floor.visible, shadow: environment.shadow.visible, dust: environment.dust.visible };
      environment.floor.visible = false;
      environment.shadow.visible = false;
      environment.dust.visible = false;
      if (explodeLight) explodeLight.intensity = 1.55;
      applySectionVisual(true);
      applyExplosion(0);
      updateStructureButtons();
      if (annotations && state.labelsOn) {
        annotations.setMode("exploded");
        annotations.setEnabled(state.labelsOn);
      }
      if (cameraDirector) {
        cameraDirector.autoEnabled = false;
        cameraDirector.flyTo("exploded", { duration: 1.35 });
      }
      toast("\u5206\u5C42\u7206\u70B8\u56FE \xB7 \u673A\u6784\u5C55\u793A\u5DF2\u6682\u505C", "info", 2800);
      refreshUI(engine.getSnapshot(), true);
    }
    function exitExplosion(opts = {}) {
      if (!state.exploded && state.explodeProgress <= 1e-3) return;
      if (state.leavingExplode) return;
      state.leavingExplode = true;
      state.explodeTarget = 0;
      state.pendingStructure = opts.pendingStructure || (state.explodeState?.structure === "section" ? "section" : "exterior");
      if (state.pendingStructure === "section") {
      }
    }
    function updateExplosion(dt) {
      if (Math.abs(state.explodeProgress - state.explodeTarget) < 5e-4) {
        if (state.leavingExplode && state.explodeProgress <= 5e-4) finishExplodeState();
        return;
      }
      const dir = Math.sign(state.explodeTarget - state.explodeProgress);
      state.explodeProgress = clamp(state.explodeProgress + dir * dt / 1.32, 0, 1);
      shadowDirty = true;
      applyExplosion(state.explodeProgress);
      if (state.explodeProgress >= 0.999 && state.explodeTarget === 1) {
        state.explodeProgress = 1;
        applyExplosion(1);
      }
      if (state.explodeProgress <= 1e-3 && state.explodeTarget === 0) {
        state.explodeProgress = 0;
        applyExplosion(0);
        if (state.leavingExplode) finishExplodeState();
      }
    }
    function applyExplosion(progress) {
      const p = clamp(progress, 0, 1);
      if (gear) {
        const gearOffset = new THREE9.Vector3(-720, -40, -420);
        const local = clamp(p / 0.65, 0, 1);
        const e = local * local * (3 - 2 * local);
        gear.group.position.copy(gearBasePosition).addScaledVector(gearOffset, e);
      }
      for (const entry of explodeEntries) {
        const start = (entry.delay || 0) * 0.45;
        const local = clamp((p - start) / (1 - start), 0, 1);
        const e = local * local * (3 - 2 * local);
        if (!entry.object) continue;
        entry.object.position.copy(entry.base).addScaledVector(entry.offset, e);
      }
      if (p <= 1e-4) {
        if (gear) gear.group.position.copy(gearBasePosition);
        for (const entry of explodeEntries) {
          if (entry.object) entry.object.position.copy(entry.base);
        }
      }
    }
    function finishExplodeState(instant = false) {
      if (!state.exploded && !state.explodeState) return;
      const prev = state.explodeState;
      const pending = state.pendingStructure || prev?.structure || "exterior";
      state.exploded = false;
      state.frozen = false;
      state.leavingExplode = false;
      state.pendingStructure = null;
      state.explodeTarget = 0;
      state.explodeProgress = 0;
      applyExplosion(0);
      if (state.explodeFloor) {
        environment.floor.visible = state.explodeFloor.floor;
        environment.shadow.visible = state.explodeFloor.shadow;
        environment.dust.visible = state.explodeFloor.dust;
        state.explodeFloor = null;
      }
      if (explodeLight) explodeLight.intensity = 0;
      if (prev?.camera) cameraDirector?.restoreState(prev.camera);
      if (prev?.paused !== void 0) {
        engine.paused = prev.paused;
        engine.pausedMode = prev.paused ? engine.pausedMode : null;
      }
      if (pending === "section") {
        state.structure = "section";
        applySectionVisual(true);
        if (!instant) cameraDirector?.flyTo("section", { duration: 1.1 });
        state.explodeState = null;
        if (annotations) {
          annotations.setMode("section");
          annotations.setEnabled(state.labelsOn && !state.cinema.active);
        }
        updateStructureButtons();
        updateAllUI(true);
        return;
      }
      state.structure = "exterior";
      applySectionVisual(false);
      state.explodeState = null;
      if (annotations) {
        annotations.setMode("default");
        annotations.setEnabled(state.labelsOn && !state.cinema.active);
      }
      updateStructureButtons();
      updateAllUI(true);
    }
    function setStructure(mode) {
      if (!["exterior", "section", "exploded"].includes(mode)) return;
      if (state.cinema.active) stopCinema(false);
      if (mode === "exploded") {
        if (state.exploded) exitExplosion();
        else enterExplosion();
        return;
      }
      if (state.exploded) {
        exitExplosion({ pendingStructure: mode });
        return;
      }
      if (mode === "section") setSection(true);
      else setStructureExterior();
    }
    function setCinemaCaption(title, copy) {
      if (dom.cinemaTitle) dom.cinemaTitle.innerHTML = title;
      if (dom.cinemaCopy) dom.cinemaCopy.textContent = copy;
    }
    function startCinema() {
      if (state.cinema.active) return;
      if (state.estop) {
        toast("\u8BF7\u5148\u590D\u4F4D\u6025\u505C", "warn");
        return;
      }
      if (state.exploded) {
        toast("\u8BF7\u5148\u9000\u51FA\u5206\u5C42\u7206\u70B8\u89C6\u56FE", "warn");
        return;
      }
      if (state.structure !== "exterior") {
        state.structure = "exterior";
        applySectionVisual(false);
        if (annotations) annotations.setMode("default");
        updateStructureButtons();
      }
      clearSelection();
      clearTemporaryHighlights();
      const c = state.cinema;
      c.savedSpeed = engine.speed;
      c.savedObserveMode = state.observeMode;
      c.savedObserveScale = state.manualScale;
      c.labelsBefore = state.labelsOn;
      c.changedSpeed = false;
      c.active = true;
      c.t = 0;
      c.index = 0;
      c.startedAt = performance.now();
      engine.reset(true);
      engine.setSpeed(CFG.scan.maxSpeed);
      if (dom.scanSpeed) {
        dom.scanSpeed.value = engine.speed;
        setRangeFill(dom.scanSpeed);
      }
      if (annotations) annotations.setEnabled(false);
      if (cameraDirector) {
        cameraDirector.autoEnabled = false;
        cameraDirector.flyTo("overview", { duration: 1.1 });
      }
      dom.stage?.classList.add("is-cinema");
      stage.classList.add("is-cinema");
      app.classList.add("is-cinema");
      dom.cinemaLayer?.classList.add("is-visible");
      dom.cinemaLayer?.setAttribute("aria-hidden", "false");
      if (dom.cinemaTime) dom.cinemaTime.textContent = "00:00";
      if (dom.cinemaProgress) dom.cinemaProgress.style.width = "0%";
      setCinemaCaption("\u5728\u5927\u9F7F\u8F6E\u65C1\uFF0C<br />\u91CD\u5EFA\u4E00\u5FAE\u7C73\u7684\u79E9\u5E8F\u3002", "\u53CC\u7403\u5B9A\u4F4D \xB7 \u5207\u7EBF\u626B\u63CF \xB7 \u5FAE\u7C73\u7EA7\u8BEF\u5DEE\u4F20\u9012");
      if (audio) audio.setMuted(audio.muted);
      c.events = [
        { t: 0.15, fn: () => setCinemaCaption("\u5728\u5927\u9F7F\u8F6E\u65C1\uFF0C<br />\u91CD\u5EFA\u4E00\u5FAE\u7C73\u7684\u79E9\u5E8F\u3002", "\u53CC\u7403\u5B9A\u4F4D \xB7 \u5207\u7EBF\u626B\u63CF \xB7 \u5FAE\u7C73\u7EA7\u8BEF\u5DEE\u4F20\u9012") },
        { t: 1.9, fn: () => {
          cameraDirector?.flyTo("drivetrain", { duration: 1.25 });
          setCinemaCaption("01 / \u4F20\u52A8\u94FE", "\u6B65\u8FDB\u7535\u673A \u2192 \u819C\u7247\u8054\u8F74\u5668 \u2192 C3 \u6EDA\u73E0\u4E1D\u6746 \u2192 P4 \u5BFC\u8F68 \u2192 \u6ED1\u53F0");
        } },
        { t: 2.4, fn: () => flashParts(["motor"], 900) },
        { t: 2.8, fn: () => {
          engine.start();
        } },
        { t: 3.4, fn: () => flashParts(["coupling"], 900) },
        { t: 3.9, fn: () => flashParts(["screw"], 900) },
        { t: 4.4, fn: () => flashParts(["rail"], 900) },
        { t: 4.9, fn: () => flashParts(["stage"], 900) },
        { t: 5.7, fn: () => {
          cameraDirector?.flyTo("overview", { duration: 1.2 });
          setCinemaCaption("02 / \u53CC\u7403\u5B9A\u57FA\u51C6", "\u9F7F\u69FD\u5373\u5929\u7136\u57FA\u51C6 \xB7 W 258.88 mm \xB7 k 11");
        } },
        { t: 6.2, fn: () => flashParts(["ballA", "ballB"], 1300) },
        { t: 7, fn: () => {
          cameraDirector?.flyTo("transfer", { duration: 1.25 });
          setCinemaCaption("03 / \u5FAE\u7C73\u4F20\u9012", "\u6D4B\u6746 \u2192 \u6760\u6746 3:1 \u2192 \u5355\u7247\u7C27 \u2192 LVDT \xB7 \u4F4D\u79FB\u6309 \xD7" + state.magnify + " \u5448\u73B0");
        } },
        { t: 10.4, fn: () => {
          cameraDirector?.flyTo("overview", { duration: 1.2 });
          setCinemaCaption("04 / \u626B\u63CF\u91C7\u6837", "2.0 mm/s \u6559\u5B66\u901F\u5EA6 \xB7 60 \u4E2A\u91C7\u6837\u70B9 \xB7 ff = e<sub>max</sub> \u2212 e<sub>min</sub>");
        } },
        { t: 11.5, fn: () => {
          cameraDirector?.flyTo("reversal", { duration: 1.25 });
          setCinemaCaption("05 / \xB122.45\xB0 \u6362\u5411", "\u9F7F\u6761\u9F7F\u8F6E\u9A71\u52A8 \xB7 \u4EA4\u53C9\u6EDA\u5B50\u8F74\u627F \xB7 \u03C64 \u5B9A\u4F4D\u9500\u9501\u7D27");
        } },
        { t: 12.2, fn: () => flashParts(["bearing", "rack"], 1400) },
        { t: 16.3, fn: () => {
          cameraDirector?.flyTo("overview", { duration: 1.2 });
          setCinemaCaption("06 / \u53F3\u9F7F\u9762", "\u7B2C\u4E8C\u7EC4\u8BEF\u5DEE\u66F2\u7EBF\u4EE5\u865A\u7EBF\u751F\u957F \xB7 \u4E0E\u5DE6\u9F7F\u9762\u5171\u7528 45 \u03BCm \u516C\u5DEE\u5E26");
        } },
        { t: 18.4, fn: () => flashParts(["ruby", "lever", "lvdt"], 1300) },
        { t: 19.4, fn: () => cameraDirector?.flyTo("transfer", { duration: 1.2 }) },
        { t: 22.2, fn: () => cameraDirector?.flyTo("overview", { duration: 1.35 }) },
        { t: 25.2, fn: () => {
          const res = engine.getResult();
          const l = engine.faces.left.ff;
          const r = engine.faces.right.ff;
          const ffText = `${l == null ? "\u2014" : formatMicron(l)} / ${r == null ? "\u2014" : formatMicron(r)} \u03BCm`;
          setCinemaCaption("\u53CC\u9F7F\u9762\u8BC4\u5B9A", `${res.label} \xB7 ff \u5DE6 / \u53F3 = ${ffText}`);
        } },
        { t: 26.7, fn: () => stopCinema(true) }
      ];
      updateAllUI(true);
    }
    function updateCinema(dt, now) {
      const c = state.cinema;
      c.t += dt;
      while (c.index < c.events.length && c.t >= c.events[c.index].t) {
        const ev = c.events[c.index];
        c.index++;
        try {
          ev.fn();
        } catch (err) {
          console.warn("Cinematic step failed", err);
        }
      }
      const pct = clamp(c.t / c.duration, 0, 1);
      if (dom.cinemaProgress) dom.cinemaProgress.style.width = `${pct * 100}%`;
      if (dom.cinemaTime) {
        const total = Math.floor(c.t);
        dom.cinemaTime.textContent = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
      }
      if (c.t >= c.duration) stopCinema(true);
    }
    function stopCinema(normal = false) {
      const c = state.cinema;
      if (!c.active) return;
      c.active = false;
      c.index = c.events.length;
      dom.cinemaLayer?.classList.remove("is-visible");
      dom.cinemaLayer?.setAttribute("aria-hidden", "true");
      stage.classList.remove("is-cinema");
      app.classList.remove("is-cinema");
      dom.stage?.classList.remove("is-cinema");
      if (annotations) annotations.setEnabled(state.labelsOn);
      clearTemporaryHighlights();
      if (cameraDirector) cameraDirector.autoEnabled = true;
      if (normal) {
        if (!c.changedSpeed) engine.setSpeed(c.savedSpeed);
        state.observeMode = c.savedObserveMode;
        state.manualScale = c.savedObserveScale;
        if (dom.scanSpeed) {
          dom.scanSpeed.value = engine.speed;
          setRangeFill(dom.scanSpeed);
        }
        toast("\u6F14\u793A\u5B8C\u6210 \xB7 \u53CC\u9F7F\u9762\u8BC4\u5B9A\u5DF2\u751F\u6210", "info", 3e3);
      } else if (cameraDirector?.tween) {
        cameraDirector.cancelTween(true);
      }
      if (cameraDirector) applyAnnotationModeForView(cameraDirector.currentPreset);
      updateObserveUI(true);
      updateAllUI(true);
    }
    function clearEdgeRecords(records) {
      for (const rec of records) {
        try {
          rec.parent.remove(rec.line);
          rec.line.geometry.dispose();
        } catch {
        }
      }
      records.length = 0;
    }
    function clearSelection() {
      clearEdgeRecords(selectionLines);
      state.selectedKeys = [];
      if (dom.partInspector) dom.partInspector.hidden = true;
      for (const b of ui.sourceButtons) b.classList.remove("is-active");
    }
    function clearTemporaryHighlights() {
      clearEdgeRecords(pulseLines);
      pulseLineClearAt = 0;
    }
    function collectMeshesForKeys(keys) {
      const meshes = /* @__PURE__ */ new Set();
      for (const key of keys) {
        if (key === "gear") {
          if (gear) {
            const candidates = [];
            gear.group.traverse((o) => {
              if (o.isMesh && o.geometry?.attributes?.position && !o.material?.transparent) candidates.push(o);
            });
            candidates.slice(0, 8).forEach((m) => meshes.add(m));
          }
          continue;
        }
        const groups = instrument.partGroups?.[key];
        if (!groups) continue;
        for (const g of groups) {
          g.traverse((o) => {
            if (o.isMesh && !o.isInstancedMesh && o.geometry?.attributes?.position && !o.material?.transparent) {
              if (o.geometry.attributes.position.count > 35e3) return;
              meshes.add(o);
            }
          });
        }
      }
      return [...meshes].slice(0, 34);
    }
    function addEdgeSet(meshes, color, opacity) {
      const records = [];
      const mat = new THREE9.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        toneMapped: false
      });
      let n = 0;
      for (const mesh of meshes) {
        if (n++ > 34) break;
        try {
          const edges = new THREE9.EdgesGeometry(mesh.geometry, 32);
          if (!edges.attributes.position?.count) continue;
          const line = new THREE9.LineSegments(edges, mat);
          line.raycast = () => {
          };
          line.renderOrder = 3;
          mesh.add(line);
          records.push({ parent: mesh, line });
        } catch {
        }
      }
      return records;
    }
    function flashParts(keys, duration = 1200) {
      clearTemporaryHighlights();
      const meshes = collectMeshesForKeys(keys);
      const records = addEdgeSet(meshes, 947344, 0.82);
      pulseLines = records;
      pulseLineClearAt = performance.now() + duration;
    }
    function selectPartKeys(keys, overrideInfo = null, { scroll = true } = {}) {
      if (!keys || !keys.length) {
        clearSelection();
        return;
      }
      clearSelection();
      state.selectedKeys = [...new Set(keys)];
      const meshes = collectMeshesForKeys(state.selectedKeys);
      selectionLines = addEdgeSet(meshes, 746615, 0.78);
      let info = overrideInfo;
      if (!info) {
        if (state.selectedKeys.length === 1) info = PARTS[state.selectedKeys[0]];
        else {
          const names = state.selectedKeys.map((k) => PARTS[k]?.name).filter(Boolean);
          info = {
            code: "MULTI / SELECTION",
            name: names.join(" \xB7 "),
            desc: "\u591A\u4E2A\u673A\u6784\u90E8\u4EF6\u8054\u5408\u9AD8\u4EAE\u3002\u6CBF\u8BEF\u5DEE\u94FE\u67E5\u770B\u5404\u90E8\u4EF6\u7684\u53D7\u529B\u3001\u521A\u5EA6\u4E0E\u4F20\u52A8\u5173\u7CFB\u3002",
            specs: state.selectedKeys.flatMap((k) => (PARTS[k]?.specs || []).slice(0, 3)).slice(0, 10)
          };
        }
      }
      if (!info) return;
      dom.inspectorCode.textContent = info.code || "COMPONENT";
      dom.inspectorName.textContent = info.name || "\u90E8\u4EF6";
      dom.inspectorDesc.textContent = info.desc || "";
      dom.inspectorSpecs.innerHTML = "";
      for (const pair of info.specs || []) {
        const dt = document.createElement("dt");
        dt.textContent = pair[0];
        const dd = document.createElement("dd");
        dd.textContent = pair[1];
        dom.inspectorSpecs.append(dt, dd);
      }
      dom.partInspector.hidden = false;
      if (scroll) {
        try {
          if (window.innerWidth <= 760) {
            dom.partInspector.scrollIntoView({ block: "center", behavior: "smooth" });
          } else if (dom.consoleScroll) {
            const top = dom.partInspector.getBoundingClientRect().top - dom.consoleScroll.getBoundingClientRect().top + dom.consoleScroll.scrollTop - 10;
            dom.consoleScroll.scrollTo({ top, behavior: "smooth" });
          }
        } catch {
        }
      }
    }
    var SOURCE_SELECTIONS = {
      positioning: {
        keys: ["ballA", "ballB"],
        info: { ...PARTS.dualBall, desc: "\u5B9A\u4F4D\u91CD\u590D\u6027\u8D21\u732E 32%\u3002\u4E3B\u7403 A \u9501\u5B9A\u57FA\u51C6\uFF0C\u526F\u7403 B \u7531\u9884\u7D27\u5F39\u7C27\u81EA\u9002\u5E94\uFF0C\u53CC\u7403\u5171\u540C\u62B5\u6D88\u5B89\u88C5\u504F\u5FC3\u4E0E\u91CD\u590D\u5B9A\u4F4D\u8BEF\u5DEE\u3002" }
      },
      straightness: {
        keys: ["rail"],
        info: { ...PARTS.rail, desc: "\u5BFC\u8F68\u76F4\u7EBF\u5EA6\u8D21\u732E 10%\u3002P4 \u5BFC\u8F68\u4E0E\u4F4D\u79FB\u4F20\u611F\u5668\u57FA\u51C6\u5E73\u884C\u5EA6\u63A7\u5236\u5728 1.5 \u03BCm \u5185\uFF0C\u8BEF\u5DEE\u91C7\u7528\u8F6F\u4EF6\u8865\u507F\u3002" }
      },
      motion: {
        keys: ["screw", "stage"],
        info: { ...PARTS.stage, desc: "\u8FD0\u52A8\u5E73\u7A33\u6027\u8D21\u732E 6%\u3002C3 \u53CC\u87BA\u6BCD\u6EDA\u73E0\u4E1D\u6746\u4E0E P4 \u5BFC\u8F68\u7684\u914D\u5408\u51B3\u5B9A\u626B\u63CF\u722C\u884C\u4E0E\u901F\u5EA6\u5E73\u7A33\u6027\u3002" }
      },
      others: {
        keys: ["coupling", "lever", "lvdt", "bearing"],
        info: {
          code: "RSS / OTHERS",
          name: "\u5176\u4F59 7 \u9879\u590D\u5408\u8BEF\u5DEE",
          desc: "\u5E73\u884C\u5EA6\u3001\u4F20\u52A8\u56DE\u5DEE\u3001\u6362\u5411\u5B9A\u4F4D\u3001\u7EBF\u6027\u5EA6\u3001\u6D4B\u6746\u53D8\u5F62\u3001\u673A\u6784\u6EDE\u540E\u4E0E\u6E29\u5EA6\u53D8\u5F62\u5408\u8BA1\u8D21\u732E\u7EA6 52%\u3002\u9AD8\u4EAE\u663E\u793A\u76F8\u5173\u67D4\u6027\u73AF\u8282\u548C\u6362\u5411\u57FA\u51C6\u3002",
          specs: [
            ["\u5E73\u884C\u5EA6", "1.2 \u03BCm \xB7 \u5747\u5300"],
            ["\u4F20\u52A8\u56DE\u5DEE", "0.8 \u03BCm \xB7 \u5747\u5300"],
            ["\u6362\u5411\u5B9A\u4F4D", "1.8 \u03BCm \xB7 \u6B63\u6001"],
            ["\u4F20\u9012\u7EBF\u6027\u5EA6", "0.8 \u03BCm \xB7 \u5747\u5300"],
            ["\u6D4B\u6746\u53D7\u529B", "1.2 \u03BCm \xB7 \u6B63\u6001"],
            ["\u673A\u6784\u6EDE\u540E", "0.4 \u03BCm \xB7 \u6B63\u6001"],
            ["\u6E29\u5EA6\u53D8\u5F62", "1.8 \u03BCm \xB7 \u5747\u5300"],
            ["\u5408\u6210\u6269\u5C55\u4E0D\u786E\u5B9A\u5EA6", "U \u2248 9.6 \u03BCm (k=2)"]
          ]
        }
      }
    };
    function applySourceSelection(key) {
      const sel = SOURCE_SELECTIONS[key];
      if (!sel) return;
      selectPartKeys(sel.keys, sel.info);
      for (const b of ui.sourceButtons) b.classList.toggle("is-active", b.dataset.source === key);
    }
    function partKeyOf(obj) {
      let p = obj;
      while (p) {
        if (p.userData?.partKey) return p.userData.partKey;
        p = p.parent;
      }
      return null;
    }
    function raycastPart(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = (clientX - rect.left) / rect.width * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        const o = hit.object;
        if (!o.isMesh && !o.isInstancedMesh) continue;
        if (o.material?.transparent) continue;
        const key = partKeyOf(o);
        if (key) return { key, object: o, point: hit.point };
      }
      return null;
    }
    function wireEvents() {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn || btn.disabled) return;
        const action = btn.dataset.action;
        if (action === "play") doPlay();
        else if (action === "pause") doPause();
        else if (action === "position") doPosition();
        else if (action === "reverse") doReverse();
        else if (action === "reset") doReset();
        else if (action === "cinema") startCinema();
      });
      for (const btn of ui.viewButtons) {
        btn.addEventListener("click", () => {
          if (state.cinema.active) stopCinema(false);
          const name = btn.dataset.view;
          if (name === "reset") {
            cameraDirector.flyTo("overview", { duration: 1 });
            return;
          }
          if (name === "transfer" && state.structure !== "exploded" && state.structure !== "section") {
            setSection(true);
            return;
          }
          if (state.exploded) {
            toast("\u5206\u5C42\u89C6\u56FE\u4E2D\u4ECD\u53EF\u81EA\u7531\u65CB\u8F6C\u955C\u5934", "info");
          }
          cameraDirector.flyTo(name, { duration: 1.12 });
        });
      }
      for (const btn of ui.structureButtons) {
        btn.addEventListener("click", () => {
          if (state.cinema.active) stopCinema(false);
          setStructure(btn.dataset.structure);
        });
      }
      for (const b of ui.faceButtons) {
        b.addEventListener("click", () => selectFace(b.dataset.face));
      }
      for (const b of ui.observeButtons) {
        b.addEventListener("click", () => setObserveMode(b.dataset.observe));
      }
      for (const b of ui.micButtons) {
        b.addEventListener("click", () => changeMicrometer(Number(b.dataset.mic)));
      }
      for (const b of ui.sourceButtons) {
        b.addEventListener("click", () => applySourceSelection(b.dataset.source));
      }
      dom.scanSpeed?.addEventListener("input", () => {
        engine.setSpeed(dom.scanSpeed.value);
        if (state.cinema.active) state.cinema.changedSpeed = true;
        if (dom.speedValue) dom.speedValue.textContent = engine.speed.toFixed(1);
        if (dom.hudSpeed) dom.hudSpeed.textContent = engine.speed.toFixed(1);
        setRangeFill(dom.scanSpeed);
      });
      dom.sampleCount?.addEventListener("input", () => {
        engine.setSampleCount(dom.sampleCount.value);
        if (dom.samplesValue) dom.samplesValue.textContent = String(engine.sampleCount);
        setRangeFill(dom.sampleCount);
        buildTimelineTicks(engine.sampleCount);
        updateAllUI(false);
      });
      dom.presentationScale?.addEventListener("input", () => {
        setManualObserveScale(dom.presentationScale.value);
      });
      dom.dockObserve?.addEventListener("change", () => {
        if (dom.dockObserve.value === "auto") setObserveMode("auto");
        else if (dom.dockObserve.value === "1.00") setObserveMode("real");
        else setManualObserveScale(dom.dockObserve.value);
      });
      dom.magnify?.addEventListener("input", () => {
        changeMagnify(dom.magnify.value);
        setRangeFill(dom.magnify);
      });
      dom.coarseX?.addEventListener("input", () => {
        if (engine.isActive() || state.frozen) return;
        engine.setUserCoarse(dom.coarseX.value);
        if (dom.coarseValue) dom.coarseValue.textContent = Number(dom.coarseX.value).toFixed(1);
        setRangeFill(dom.coarseX);
        refreshUI(engine.getSnapshot(), true);
      });
      dom.probeForce?.addEventListener("input", () => {
        engine.setForce(dom.probeForce.value);
        if (dom.forceValue) dom.forceValue.textContent = engine.forceN.toFixed(2);
        setRangeFill(dom.probeForce);
        refreshUI(engine.getSnapshot(), true);
      });
      dom.signalPreset?.addEventListener("change", () => setScanPreset(dom.signalPreset.value));
      dom.axisToggle?.addEventListener("click", () => {
        const axis = chart.toggleAxis();
        dom.axisToggle.textContent = axis === "s" ? "X\uFF1A\u5C55\u5F00\u957F\u5EA6 s" : "X\uFF1A\u5C55\u5F00\u89D2 \u03C6";
        chart.draw(performance.now());
      });
      dom.timelineRange?.addEventListener("pointerdown", () => {
        state.timelineDragging = true;
        stage.classList.add("has-interacted");
      });
      const endTimeline = () => {
        state.timelineDragging = false;
      };
      dom.timelineRange?.addEventListener("pointerup", endTimeline);
      dom.timelineRange?.addEventListener("pointercancel", endTimeline);
      dom.timelineRange?.addEventListener("input", () => {
        if (state.frozen || state.exploded || state.estop) return;
        if (engine.isActive() && !engine.paused) engine.pauseToggle();
        if (["positioning", "reversing"].includes(engine.mode)) return;
        engine.seek(Number(dom.timelineRange.value));
        refreshUI(engine.getSnapshot(), true);
      });
      dom.qualitySelect?.addEventListener("change", () => applyQuality(dom.qualitySelect.value));
      dom.labelToggle?.addEventListener("click", () => {
        state.labelsOn = !state.labelsOn;
        annotations.setEnabled(state.labelsOn && !state.cinema.active);
        dom.labelToggle.setAttribute("aria-pressed", String(state.labelsOn));
        dom.labelToggle.classList.toggle("is-off", !state.labelsOn);
      });
      dom.soundToggle?.addEventListener("click", async () => {
        if (!audio) return;
        const muted = !audio.muted;
        try {
          await audio.setMuted(muted);
        } catch (err) {
          toast("\u97F3\u9891\u521D\u59CB\u5316\u5931\u8D25\uFF0C\u6D4F\u89C8\u5668\u53EF\u80FD\u7981\u6B62\u4E86\u81EA\u52A8\u97F3\u9891", "warn");
          return;
        }
        dom.soundToggle.setAttribute("aria-pressed", String(!muted));
        dom.volumeWrap?.classList.toggle("is-visible", !muted);
        toast(muted ? "\u58F0\u97F3\u5DF2\u5173\u95ED" : "\u58F0\u97F3\u5DF2\u5F00\u542F \xB7 \u8DDF\u968F\u771F\u5B9E\u626B\u63CF\u901F\u5EA6", "info");
        if (!muted) audio.update({ running: engine.isRunning, speed: engine.speed });
      });
      dom.volumeRange?.addEventListener("input", () => {
        audio?.setVolume(Number(dom.volumeRange.value));
        setRangeFill(dom.volumeRange);
      });
      dom.helpButton?.addEventListener("click", openHelp);
      $("chartJump")?.addEventListener("click", () => {
        if (!dom.chartSection) return;
        if (window.innerWidth <= 760) {
          const top2 = dom.chartSection.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo(0, top2);
          return;
        }
        if (!dom.consoleScroll) return;
        const top = dom.chartSection.getBoundingClientRect().top - dom.consoleScroll.getBoundingClientRect().top + dom.consoleScroll.scrollTop - 10;
        const oldBehavior = dom.consoleScroll.style.scrollBehavior;
        dom.consoleScroll.style.scrollBehavior = "auto";
        dom.consoleScroll.scrollTop = top;
        dom.consoleScroll.style.scrollBehavior = oldBehavior;
      });
      for (const close of $$("[data-close]")) close.addEventListener("click", closeHelp);
      dom.inspectorClose?.addEventListener("click", clearSelection);
      dom.canvasHost?.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        showFatal("WebGL \u4E0A\u4E0B\u6587\u5DF2\u4E22\u5931\u3002\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u65B0\u5EFA\u7ACB\u4E09\u7EF4\u573A\u666F\u3002");
      });
      window.addEventListener("resize", () => {
        if (resizeScheduled) return;
        resizeScheduled = true;
        requestAnimationFrame(() => {
          resizeScheduled = false;
          resizeScene();
        });
      });
      let camStart = null;
      controls.addEventListener("start", () => {
        camStart = camera.position.clone();
        if (state.cinema.active) stopCinema(false);
        stage.classList.add("has-interacted");
        if (dom.sliderHint) dom.sliderHint.style.opacity = "0";
      });
      controls.addEventListener("end", () => {
        if (camStart && camera.position.distanceTo(camStart) > 2) {
          cameraDirector.currentPreset = null;
          syncViewButtons(null);
        }
        camStart = null;
      });
      let down = null;
      renderer.domElement.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        down = { x: e.clientX, y: e.clientY, t: performance.now() };
      });
      renderer.domElement.addEventListener("pointerup", (e) => {
        if (!down) return;
        const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
        const elapsed = performance.now() - down.t;
        down = null;
        if (moved > 6 || elapsed > 720) return;
        const hit = raycastPart(e.clientX, e.clientY);
        if (!hit) {
          clearSelection();
          return;
        }
        if (hit.key === "emergencyStop") {
          selectPartKeys(["emergencyStop"], PARTS.emergencyStop, { scroll: true });
          triggerEmergencyStop();
          return;
        }
        selectPartKeys([hit.key], null, { scroll: true });
      });
      renderer.domElement.addEventListener("pointermove", (e) => {
        const now = performance.now();
        if (now - hoverRayTimer < 90) return;
        hoverRayTimer = now;
        const hit = raycastPart(e.clientX, e.clientY);
        renderer.domElement.style.cursor = hit ? "pointer" : "grab";
      });
      renderer.domElement.addEventListener("pointerleave", () => {
        renderer.domElement.style.cursor = "grab";
      });
      window.addEventListener("pointerdown", () => {
        if (state.cinema.active) stopCinema(false);
      }, true);
      window.addEventListener("wheel", () => {
        if (state.cinema.active) stopCinema(false);
      }, { capture: true, passive: true });
      window.addEventListener("keydown", () => {
        if (state.cinema.active) stopCinema(false);
      }, true);
      document.addEventListener("keydown", (e) => {
        const tag = (e.target?.tagName || "").toLowerCase();
        if (["input", "select", "textarea"].includes(tag) || e.target?.isContentEditable) return;
        if (e.key === "Escape") {
          if (!dom.helpModal.hidden) {
            closeHelp();
            return;
          }
          if (state.exploded) {
            exitExplosion();
            return;
          }
          clearSelection();
          return;
        }
        if (e.key === " " || e.code === "Space") {
          e.preventDefault();
          if (state.frozen) return;
          if (engine.isActive()) doPause();
          else doPlay();
          return;
        }
        if (state.cinema.active) stopCinema(false);
        const k = e.key.toLowerCase();
        if (k === "r") cameraDirector.flyTo("overview", { duration: 1 });
        else if (k === "c") setSection(state.structure !== "section");
        else if (k === "e") setStructure("exploded");
        else if (k === "m") dom.soundToggle?.click();
        else if (k === "d") toggleDebug();
        else if (["1", "2", "3", "4", "5"].includes(k)) {
          const names = ["overview", "positioning", "drivetrain", "transfer", "reversal"];
          const name = names[Number(k) - 1];
          if (name === "transfer") setSection(true);
          else cameraDirector.flyTo(name, { duration: 1.05 });
        }
      });
      document.addEventListener("visibilitychange", () => {
        lastFrame = performance.now();
        if (document.hidden) {
          if (audio) audio.update({ running: false, speed: engine.speed });
        }
      });
      if (dom.micValue) dom.micValue.textContent = state.micrometer.toFixed(2);
    }
    function toggleDebug() {
      state.debug = !state.debug;
      if (dom.debugPanel) dom.debugPanel.hidden = !state.debug;
      if (state.debug) refreshUI(engine.getSnapshot(), true);
      toast(state.debug ? "\u8C03\u8BD5\u8BFB\u6570\u5DF2\u5F00\u542F\uFF08D\uFF09" : "\u8C03\u8BD5\u8BFB\u6570\u5DF2\u5173\u95ED", "info", 1300);
    }
    boot();
  }
});
export default require_main();
