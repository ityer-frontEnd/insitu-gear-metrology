import { CFG } from './config.js';
import { clamp } from './utils.js';

const TOL = CFG.gear.ff * 1000; // μm
const LENGTH = CFG.scan.length;
const PHI_MAX = (LENGTH / CFG.gear.rb) * 180 / Math.PI;

export class ProfileChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.axis = 's';
    this.faces = { left: { samples: [], complete: false }, right: { samples: [], complete: false } };
    this.current = null;
    this.currentFace = 'left';
    this.result = null;
    this.cssW = 10;
    this.cssH = 10;
    this.dpr = 1;
    this._needsDraw = true;
    this._lastDraw = 0;
    this.resize();
    this._ro = new ResizeObserver(() => this.resize());
    try { this._ro.observe(canvas); } catch { /* non-DOM fallback */ }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(140, rect.width);
    const h = Math.max(100, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === this.cssW && h === this.cssH && dpr === this.dpr) return;
    this.cssW = w; this.cssH = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this._needsDraw = true;
  }

  setAxis(axis) {
    this.axis = axis === 'phi' ? 'phi' : 's';
    this._needsDraw = true;
  }

  toggleAxis() {
    this.setAxis(this.axis === 's' ? 'phi' : 's');
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
    const W = this.cssW, H = this.cssH;
    const dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const leftMargin = 34;
    const rightMargin = 8;
    const topMargin = 18;
    const bottomMargin = 22;
    const plotW = Math.max(10, W - leftMargin - rightMargin);
    const plotH = Math.max(10, H - topMargin - bottomMargin);
    const x0 = leftMargin, y0 = topMargin;

    const allSamples = [...this.faces.left.samples, ...this.faces.right.samples];
    let maxAbs = 26;
    for (const s of allSamples) maxAbs = Math.max(maxAbs, Math.abs(s.e));
    const yLimit = Math.max(30, maxAbs * 1.16);
    const xMax = this.axis === 's' ? LENGTH : PHI_MAX;

    const xFor = s => x0 + (this.axis === 's' ? s / LENGTH : (s / CFG.gear.rb * 180 / Math.PI) / PHI_MAX) * plotW;
    const yFor = e => y0 + plotH / 2 - (e / yLimit) * (plotH / 2);

    // Subtle inner background.
    ctx.fillStyle = 'rgba(248,250,252,.72)';
    ctx.fillRect(x0, y0, plotW, plotH);

    // Horizontal grid and y labels.
    ctx.font = "7px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yTicks = [-yLimit, -yLimit / 2, 0, yLimit / 2, yLimit];
    for (let i = 0; i < yTicks.length; i++) {
      const v = yTicks[i];
      const y = yFor(v);
      ctx.strokeStyle = v === 0 ? 'rgba(31,41,55,.18)' : 'rgba(31,41,55,.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, Math.round(y) + 0.5);
      ctx.lineTo(x0 + plotW, Math.round(y) + 0.5);
      ctx.stroke();
      if (i === 0 || i === 2 || i === 4) {
        ctx.fillStyle = '#5B6472';
        ctx.fillText(`${v > 0 ? '+' : ''}${Math.round(v)}`, x0 - 5, y);
      }
    }

    // Tolerance band ±[ff]/2.
    const bandTop = yFor(TOL / 2);
    const bandBottom = yFor(-TOL / 2);
    ctx.fillStyle = 'rgba(20,122,58,.10)';
    ctx.fillRect(x0, bandTop, plotW, bandBottom - bandTop);
    ctx.strokeStyle = 'rgba(20,122,58,.34)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    for (const y of [bandTop, bandBottom]) {
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + plotW, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = '#147A3A';
    ctx.textAlign = 'left';
    ctx.font = "6px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
    ctx.fillText('[ff] / 2', x0 + 5, bandTop + 7);

    // Vertical grid.
    const xTicks = this.axis === 's'
      ? [0, 5, 10, 15, 20, 25, 30, 35]
      : [0, 1, 2, 3, 4, 5, PHI_MAX];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const tick of xTicks) {
      const x = x0 + (tick / xMax) * plotW;
      ctx.strokeStyle = 'rgba(31,41,55,.06)';
      ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, y0); ctx.lineTo(Math.round(x) + .5, y0 + plotH); ctx.stroke();
      ctx.fillStyle = '#5B6472';
      ctx.font = "6px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
      ctx.fillText(this.axis === 's' ? `${tick}` : tick.toFixed(1), x, y0 + plotH + 5);
    }

    // Axis titles.
    ctx.fillStyle = '#5E6978';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = "6.2px 'SFMono-Regular','Cascadia Mono',Consolas,monospace";
    ctx.fillText(this.axis === 's' ? '展开长度 s / mm' : '展开角 φ / °', x0, H - 2);
    ctx.save();
    ctx.translate(8, y0 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'right';
    ctx.fillText('e / μm', 0, 0);
    ctx.restore();

    // Clip chart curves to the plot.
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, plotW, plotH);
    ctx.clip();

    // Tolerance edge annotations.
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
      // unobtrusive data dots
      ctx.fillStyle = color;
      for (let i = 0; i < samples.length; i += Math.max(1, Math.round(samples.length / 40))) {
        const x = xFor(samples[i].s);
        const y = yFor(samples[i].e);
        ctx.beginPath(); ctx.arc(x, y, 1.25, 0, Math.PI * 2); ctx.fill();
      }
    };

    drawFace('left', 'rgba(169,75,11,.95)', false, 1);
    drawFace('right', 'rgba(128,98,20,.88)', true, 0.95);

    // Current scanning point and vertical time line.
    if (this.current) {
      const { s, e } = this.current;
      const cx = xFor(clamp(s, 0, LENGTH));
      const cy = yFor(clamp(e, -yLimit, yLimit));
      ctx.strokeStyle = 'rgba(169,75,11,.26)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(cx, y0); ctx.lineTo(cx, y0 + plotH); ctx.stroke();
      ctx.setLineDash([]);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      grad.addColorStop(0, 'rgba(169,75,11,1)');
      grad.addColorStop(0.3, 'rgba(169,75,11,.72)');
      grad.addColorStop(1, 'rgba(169,75,11,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#A94B0B';
      ctx.beginPath(); ctx.arc(cx, cy, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    // A quiet rounded frame inside the corner ticks.
    ctx.strokeStyle = 'rgba(31,41,55,.13)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + .5, y0 + .5, plotW - 1, plotH - 1);
    ctx.restore();
  }
}
