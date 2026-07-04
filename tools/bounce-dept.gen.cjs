// Generator for BOUNCE DEPT. — physics-baked spring/bounce logo (60fps)
const fs = require('fs');

const OUT = 'public/projects/bounce-dept/scene-1/lottie.json';
const W = 1920, H = 1080, FR = 60, OP = 372;

// ---- colors (0..1 rgba) ----
const cream  = [0.965, 0.918, 0.816, 1];
const orange = [0.941, 0.537, 0.290, 1];
const blue   = [0.180, 0.173, 0.561, 1];
const eyeCol = [0.09, 0.08, 0.18, 1];
const bg     = [0.039, 0.039, 0.047, 1];

// ================= easing library =================
const E = {
  linear: t => t,
  inQuad: t => t * t,
  outQuad: t => 1 - (1 - t) * (1 - t),
  inOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  inBack: t => { const c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; },
  outBackBig: t => { const c1 = 2.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};

// evaluate a piecewise segment list at frame f. segs: [f0,f1,v0,v1,easeName]
function evalSegs(segs, f) {
  if (f <= segs[0][0]) return segs[0][2];
  const last = segs[segs.length - 1];
  if (f >= last[1]) return last[3];
  for (const [f0, f1, v0, v1, ez] of segs) {
    if (f >= f0 && f <= f1) {
      const t = f1 === f0 ? 1 : (f - f0) / (f1 - f0);
      return v0 + (v1 - v0) * E[ez](t);
    }
  }
  return last[3];
}

// ================= timeline (frames @60fps) =================
// pulses 0..90 | shrink 90..114 | rollLeft 114..210 | rollBack 210..288 | grow2 288..318 | hold/cat 318..372
const GROUND = 650, CENTER_Y = 540, CENTER_X = 960, LEFT_X = 430;

// --- base uniform scale (%) ---
const scaleSegs = [
  [0, 14, 20, 124, 'outBackBig'], [14, 24, 124, 58, 'inOutQuad'],
  [24, 34, 58, 121, 'outBack'],   [34, 44, 121, 60, 'inOutQuad'],
  [44, 54, 60, 119, 'outBack'],   [54, 64, 119, 62, 'inOutQuad'],
  [64, 74, 62, 117, 'outBack'],   [74, 90, 117, 100, 'outBack'],
  [90, 114, 100, 40, 'inOutQuad'],       // shrink for the roll
  [114, 210, 40, 40, 'linear'],          // stay small (squash overlay adds life)
  [210, 268, 40, 112, 'outBackBig'],     // grow back with overshoot on return
  [268, 288, 112, 100, 'inOutQuad'],     // settle
  [288, 303, 100, 113, 'outBack'],       // slight secondary grow
  [303, 320, 113, 100, 'inOutQuad'],
];
// --- x position ---
const xSegs = [
  [0, 114, CENTER_X, CENTER_X, 'linear'],
  [114, 210, CENTER_X, LEFT_X, 'outQuad'],     // roll left, decelerating
  [210, 288, LEFT_X, CENTER_X, 'inOutCubic'],  // roll back to center
  [288, 372, CENTER_X, CENTER_X, 'linear'],
];
// --- y position (bounce arcs) ---
const ySegs = [
  [0, 114, CENTER_Y, CENTER_Y, 'linear'],
  // roll-left hops (decaying apexes above GROUND)
  [114, 124, CENTER_Y, GROUND, 'inQuad'],
  [124, 140, GROUND, 470, 'outQuad'], [140, 156, 470, GROUND, 'inQuad'],
  [156, 170, GROUND, 520, 'outQuad'], [170, 184, 520, GROUND, 'inQuad'],
  [184, 196, GROUND, 575, 'outQuad'], [196, 210, 575, 648, 'inQuad'],
  // roll-back hops, diminishing, settle to center
  [210, 228, 648, 452, 'outQuad'], [228, 246, 452, 612, 'inQuad'],
  [246, 260, 612, 505, 'outQuad'], [260, 272, 505, 588, 'inQuad'],
  [272, 281, 588, 524, 'outQuad'], [281, 288, 524, CENTER_Y, 'inQuad'],
  [288, 372, CENTER_Y, CENTER_Y, 'linear'],
];
// --- rotation (deg) ---
const rotSegs = [
  [0, 114, -7, -7, 'linear'],
  [114, 210, -7, -547, 'outQuad'],       // spin CCW while rolling left
  [210, 288, -547, -7, 'inOutCubic'],    // unwind CW rolling back
  [288, 372, -7, -7, 'linear'],
];

// squash&stretch overlay from vertical motion (ground contact -> wide/short)
function squash(f, yVal) {
  if (f < 114 || f > 300) return [1, 1];
  const contact = Math.max(0, Math.min(1, (yVal - 452) / (GROUND - 452)));
  let k = 0.20 * contact;                 // ground -> squash
  // landing pop at ~288
  if (f >= 284 && f <= 306) {
    const lt = (f - 284) / 22;
    k += 0.14 * Math.sin(Math.PI * lt) * (1 - lt); // quick squash that fades
  }
  return [1 + k, 1 - k];
}

// ================= baker =================
const LINEAR_EASE = { o: { x: [0.5], y: [0.5] }, i: { x: [0.5], y: [0.5] } };
function bake(fn, f0, f1) {
  const raw = [];
  for (let f = f0; f <= f1; f++) raw.push([f, fn(f)]);
  // drop middle of colinear/identical runs to trim size
  const keep = [];
  const eq = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.02);
  for (let i = 0; i < raw.length; i++) {
    if (i > 0 && i < raw.length - 1) {
      const [, a] = raw[i - 1], [, b] = raw[i], [, c] = raw[i + 1];
      // colinear check per component
      let colinear = a.length === b.length;
      for (let j = 0; j < b.length && colinear; j++) {
        const mid = (a[j] + c[j]) / 2;
        if (Math.abs(mid - b[j]) > 0.15) colinear = false;
      }
      if (colinear) continue;
    }
    keep.push(raw[i]);
  }
  const k = keep.map(([f, v], i) => {
    const key = { t: f, s: v.map(n => Math.round(n * 1000) / 1000) };
    if (i < keep.length - 1) { key.o = LINEAR_EASE.o; key.i = LINEAR_EASE.i; }
    return key;
  });
  return { a: 1, k };
}
const stat = (v) => ({ a: 0, k: v });

// ---- lockup layout (relative to null center 0,0) ----
const BOUNCE_BL = -20, DEPT_BL = 230;
const off = { cream: [0, 0], orange: [9, 12], blue: [22, 30] };

let ind = 0;
const layers = [];

// -------- NULL: logoRoot (ind 1) --------
const NULL_IND = ++ind;
layers.push({
  ty: 3, ind: NULL_IND, nm: 'logoRoot', ip: 0, op: OP, st: 0, sr: 1,
  ks: {
    o: stat(100),
    r: bake(f => [evalSegs(rotSegs, f)], 0, OP),
    p: bake(f => [evalSegs(xSegs, f), evalSegs(ySegs, f), 0], 0, OP),
    a: stat([0, 0, 0]),
    s: bake(f => {
      const base = evalSegs(scaleSegs, f);
      const y = evalSegs(ySegs, f);
      const [kx, ky] = squash(f, y);
      return [base * kx, base * ky, 100];
    }, 0, OP),
  },
});

// -------- CAT (behind text), bouncy peek --------
const CAT_X = -415, CAT_HIDDEN = -150, CAT_PEEK = -300;
const catYSegs = [
  [0, 322, CAT_HIDDEN, CAT_HIDDEN, 'linear'],
  [322, 340, CAT_HIDDEN, CAT_PEEK, 'outBack'],   // pop up with overshoot
  [340, 356, CAT_PEEK, CAT_PEEK, 'linear'],      // hold
  [356, 368, CAT_PEEK, CAT_HIDDEN, 'inBack'],    // duck with anticipation
];
const catSSegs = [
  [0, 322, 100, 100, 'linear'],
  [322, 334, 100, 112, 'outBack'], [334, 344, 112, 100, 'inOutQuad'],
  [356, 368, 100, 96, 'inQuad'],
];
function catShapes() {
  const tr = () => ({ ty: 'tr', p: stat([0, 0]), a: stat([0, 0]), s: stat([100, 100]), r: stat(0), o: stat(100) });
  const poly = (pts) => ({ ty: 'sh', ks: stat({ c: true, v: pts, i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]) }) });
  const line = (pts) => ({ ty: 'sh', ks: stat({ c: false, v: pts, i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]) }) });
  const fill = (c) => ({ ty: 'fl', c: stat(c), o: stat(100) });
  const strokeC = (c, w) => ({ ty: 'st', c: stat(c), o: stat(100), w: stat(w), lc: 2, lj: 2 });
  const head  = { ty: 'gr', nm: 'head', it: [ { ty: 'el', p: stat([0, -4]), s: stat([176, 156]) }, fill(cream), tr() ] };
  const ear = (sign) => { const bx = 50 * sign; return { ty: 'gr', nm: 'ear' + sign, it: [ poly([[bx - 33, -50], [bx + 33, -50], [bx + 6 * sign, -112]]), fill(cream), tr() ] }; };
  const earIn = (sign) => { const bx = 50 * sign; return { ty: 'gr', nm: 'earIn' + sign, it: [ poly([[bx - 15, -56], [bx + 15, -56], [bx + 4 * sign, -96]]), fill(orange), tr() ] }; };
  const eye = (sign) => { const x = 37 * sign; return { ty: 'gr', nm: 'eye' + sign, it: [ { ty: 'el', p: stat([x, -10]), s: stat([32, 42]) }, fill(eyeCol), { ty: 'el', p: stat([x + 5, -18]), s: stat([11, 12]) }, fill(cream), tr() ] }; };
  const nose  = { ty: 'gr', nm: 'nose', it: [ poly([[-13, 24], [13, 24], [0, 40]]), fill(orange), tr() ] };
  const mouth = { ty: 'gr', nm: 'mouth', it: [ line([[-22, 50], [0, 40], [22, 50]]), strokeC(eyeCol, 5), tr() ] };
  const whisker = (sign, dy) => ({ ty: 'gr', nm: 'wh' + sign + dy, it: [ line([[74 * sign, 20 + dy], [116 * sign, 12 + dy]]), strokeC(cream, 5), tr() ] });
  return [ ear(-1), ear(1), earIn(-1), earIn(1), head, eye(-1), eye(1), nose, mouth,
           whisker(-1, 0), whisker(1, 0), whisker(-1, 15), whisker(1, 15) ];
}
const CAT_IND = ++ind;
layers.push({
  ty: 4, ind: CAT_IND, parent: NULL_IND, nm: 'cat', ip: 0, op: OP, st: 0, sr: 1,
  ks: {
    o: { a: 1, k: [
      { t: 0, s: [0], o: LINEAR_EASE.o, i: LINEAR_EASE.i },
      { t: 320, s: [0], o: LINEAR_EASE.o, i: LINEAR_EASE.i },
      { t: 326, s: [100], o: LINEAR_EASE.o, i: LINEAR_EASE.i },
      { t: 362, s: [100], o: LINEAR_EASE.o, i: LINEAR_EASE.i },
      { t: 368, s: [0] },
    ] },
    r: stat(0), a: stat([0, 0, 0]),
    p: bake(f => [CAT_X, evalSegs(catYSegs, f), 0], 300, OP),
    s: bake(f => { const v = evalSegs(catSSegs, f); return [v, v, 100]; }, 300, OP),
  },
  shapes: catShapes(),
});

// -------- TEXT layers (front-most first) --------
function textLayer(name, str, size, baseline, color, offset) {
  const i = ++ind;
  return {
    ty: 5, ind: i, parent: NULL_IND, nm: name, ip: 0, op: OP, st: 0, sr: 1,
    ks: { o: stat(100), r: stat(0), p: stat([offset[0], baseline + offset[1], 0]), a: stat([0, 0, 0]), s: stat([100, 100, 100]) },
    t: {
      d: { k: [ { t: 0, s: { t: str, f: 'LuckiestGuy', s: size, fc: color.slice(0, 3), j: 2, tr: 0, lh: size * 1.2, ls: 0 } } ] },
      p: {}, m: { g: 1, a: stat([0, 0, 0]) }, a: [],
    },
  };
}
const textDefs = [];
for (const [tag, color, offset] of [['cream', cream, off.cream], ['orange', orange, off.orange], ['blue', blue, off.blue]]) {
  textDefs.push(textLayer(tag + '-bounce', 'BOUNCE', 300, BOUNCE_BL, color, offset));
  textDefs.push(textLayer(tag + '-dept', 'DEPT.', 210, DEPT_BL, color, offset));
}
layers.splice(1, 0, ...textDefs);

// -------- BACKGROUND --------
layers.push({
  ty: 4, ind: ++ind, nm: 'background', ip: 0, op: OP, st: 0, sr: 1,
  ks: { o: stat(100), r: stat(0), a: stat([0, 0, 0]), s: stat([100, 100, 100]), p: stat([W / 2, H / 2, 0]) },
  shapes: [ { ty: 'gr', nm: 'bg', it: [
    { ty: 'rc', p: stat([0, 0]), s: stat([W, H]), r: stat(0) },
    { ty: 'fl', c: { a: 0, k: bg, sid: 'bgColor' }, o: stat(100) },
    { ty: 'tr', p: stat([0, 0]), a: stat([0, 0]), s: stat([100, 100]), r: stat(0), o: stat(100) },
  ] } ],
});

const doc = {
  v: '5.7.0', fr: FR, ip: 0, op: OP, w: W, h: H, nm: 'Bounce Dept - Spring Logo',
  fonts: { list: [ { fName: 'LuckiestGuy', fFamily: 'Luckiest Guy', fStyle: 'Regular', ascent: 70 } ] },
  slots: { bgColor: { p: { a: 0, k: bg } } },
  assets: [], layers,
};
fs.writeFileSync(OUT, JSON.stringify(doc));
JSON.parse(fs.readFileSync(OUT, 'utf8'));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log('wrote', OUT, '| layers:', layers.length, '| size:', kb + 'KB', '| op:', OP, '@', FR + 'fps');
