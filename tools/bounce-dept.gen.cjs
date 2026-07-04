// Generator for BOUNCE DEPT. bounce logo scene
const fs = require('fs');

const OUT = 'public/projects/bounce-dept/scene-1/lottie.json';
const W = 1920, H = 1080, FR = 30, OP = 152;

// ---- colors (0..1 rgba) ----
const cream  = [0.965, 0.918, 0.816, 1];
const orange = [0.941, 0.537, 0.290, 1];
const blue   = [0.180, 0.173, 0.561, 1];
const eyeCol = [0.09, 0.08, 0.18, 1];
const bg     = [0.039, 0.039, 0.047, 1];

// ---- easing presets ----
const snap   = { o: { x: [0.7], y: [0] }, i: { x: [0.18], y: [1] } }; // fast out, soft land
const smooth = { o: { x: [0.4], y: [0] }, i: { x: [0.6], y: [1] } };  // balanced travel

function anim(keys) {
  const k = [];
  for (let idx = 0; idx < keys.length; idx++) {
    const [t, s, ease] = keys[idx];
    const e = ease || smooth;
    const key = { t, s };
    if (idx < keys.length - 1) { key.o = e.o; key.i = e.i; }
    k.push(key);
  }
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
    r: anim([
      [0, [-7], smooth], [54, [-7], smooth],
      [62, [-60], smooth], [70, [-130], smooth], [78, [-205], smooth],
      [86, [-250], smooth], [94, [-170], smooth], [102, [-60], smooth],
      [108, [-7], snap], [152, [-7], snap],
    ]),
    p: anim([
      [0, [960, 540, 0], smooth], [54, [960, 540, 0], smooth],
      [62, [828, 556, 0], smooth], [70, [700, 588, 0], smooth],
      [78, [588, 556, 0], smooth], [86, [560, 588, 0], smooth],
      [94, [748, 560, 0], smooth], [102, [908, 552, 0], smooth],
      [108, [960, 540, 0], snap],
    ]),
    a: stat([0, 0, 0]),
    s: anim([
      [0, [28, 28, 100], snap],
      [6, [118, 118, 100], snap], [12, [60, 60, 100], snap],
      [18, [116, 116, 100], snap], [24, [64, 64, 100], snap],
      [30, [114, 114, 100], snap], [36, [68, 68, 100], snap],
      [42, [112, 112, 100], snap], [48, [86, 86, 100], snap],
      [54, [100, 100, 100], smooth],
      [70, [110, 90, 100], smooth], [78, [94, 108, 100], smooth],
      [86, [106, 94, 100], smooth], [108, [100, 100, 100], snap],
      [116, [112, 112, 100], snap], [124, [100, 100, 100], snap],
    ]),
  },
});

// -------- CAT (behind text) --------
const CAT_X = -415, CAT_HIDDEN = -150, CAT_PEEK = -300;
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
    o: anim([ [0, [0]], [116, [0]], [119, [100], snap], [148, [100], snap], [150, [0]] ]),
    r: stat(0), a: stat([0, 0, 0]),
    p: anim([
      [0, [CAT_X, CAT_HIDDEN, 0], smooth], [118, [CAT_X, CAT_HIDDEN, 0], snap],
      [127, [CAT_X, CAT_PEEK, 0], snap], [140, [CAT_X, CAT_PEEK, 0], smooth],
      [150, [CAT_X, CAT_HIDDEN, 0], snap],
    ]),
    s: anim([ [118, [100, 100, 100], snap], [127, [109, 109, 100], snap], [134, [100, 100, 100], snap], [150, [100, 100, 100], snap] ]),
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
layers.splice(1, 0, ...textDefs); // text in front of cat

// -------- BACKGROUND (back) --------
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

fs.writeFileSync(OUT, JSON.stringify(doc, null, 2));
JSON.parse(fs.readFileSync(OUT, 'utf8'));
console.log('wrote', OUT, 'layers:', layers.length);
