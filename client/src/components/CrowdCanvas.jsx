import { useEffect, useRef } from 'react';

// Animated stadium crowd. `levelRef.current.level` (0..1) drives bobbing / arms-up / camera flashes,
// and decays back to a calm baseline on its own. Set `.flash=1` for a burst of camera flashes.
export default function CrowdCanvas({ levelRef, colors = ['#1766d6', '#f2c300'] }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const skins = ['#5a3522', '#6f4329', '#8d5a3b', '#a8704a', '#c68a62', '#e0ac82'];
    let raf, w = 0, h = 0, people = [], last = performance.now();

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const palette = [colors[0], colors[0], colors[0], colors[1], colors[1], '#e9eee9', '#c94a4a', '#2c3a5c', '#d8a431'];
      people = [];
      const rows = 6;
      for (let r = 0; r < rows; r++) {
        const y = h * 0.16 + r * (h * 0.145);
        const gap = Math.max(10, w / 95) + r * 0.8;
        const size = 4.2 + r * 0.95;
        for (let x = -gap / 2 + (r % 2) * gap / 2; x < w + gap; x += gap) {
          people.push({
            x, y, size, ph: Math.random() * 6.28, sp: 2 + Math.random() * 2.6,
            col: palette[Math.floor(Math.random() * palette.length)],
            skin: skins[Math.floor(Math.random() * skins.length)],
            arms: Math.random() < 0.7, flag: Math.random() < 0.035,
            fc: colors[Math.floor(Math.random() * 2)],
          });
        }
      }
    };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const lv = levelRef?.current || { level: 0.2, flash: 0 };
      lv.level += (0.2 - lv.level) * Math.min(1, dt * 0.45);
      lv.flash = Math.max(0, (lv.flash || 0) - dt * 0.6);
      const t = now / 1000;
      const amp = (reduce ? 0.3 : 1) * (0.6 + lv.level * 7);
      const up = lv.level > 0.55;

      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#08130e'); g.addColorStop(1, '#162b20');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      for (const p of people) {
        const bob = Math.abs(Math.sin(t * p.sp + p.ph)) * amp * (0.35 + p.size / 11);
        const y = p.y - bob;
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.ellipse(p.x, y + p.size * 1.35, p.size * 0.95, p.size * 1.25, 0, 0, 6.283); ctx.fill();
        if (up && p.arms) {
          ctx.strokeStyle = p.skin; ctx.lineWidth = Math.max(1.2, p.size * 0.28); ctx.lineCap = 'round';
          const wv = Math.sin(t * 9 + p.ph) * p.size * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 0.8, y + p.size * 0.9); ctx.lineTo(p.x - p.size * 1.2 + wv, y - p.size * 1.3);
          ctx.moveTo(p.x + p.size * 0.8, y + p.size * 0.9); ctx.lineTo(p.x + p.size * 1.2 + wv, y - p.size * 1.3);
          ctx.stroke();
        }
        ctx.fillStyle = p.skin;
        ctx.beginPath(); ctx.arc(p.x, y, p.size * 0.58, 0, 6.283); ctx.fill();
        if (p.flag) {
          const fy = y - p.size * 3.2, sway = Math.sin(t * 4 + p.ph) * 3;
          ctx.strokeStyle = '#d8d8d0'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x + p.size, y); ctx.lineTo(p.x + p.size, fy); ctx.stroke();
          ctx.fillStyle = p.fc;
          ctx.beginPath(); ctx.moveTo(p.x + p.size, fy); ctx.lineTo(p.x + p.size + 10 + sway, fy + 3); ctx.lineTo(p.x + p.size, fy + 7); ctx.fill();
        }
      }
      // camera flashes
      const flashes = Math.floor((lv.level > 0.4 ? 4 : 0) + (lv.flash || 0) * 14);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      for (let i = 0; i < flashes; i++) {
        const s = 1.5 + Math.random() * 2;
        ctx.fillRect(Math.random() * w, Math.random() * h * 0.8, s, s);
      }
      raf = requestAnimationFrame(draw);
    };

    build();
    const ro = new ResizeObserver(build); ro.observe(cv);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [colors[0], colors[1], levelRef]); // eslint-disable-line
  return <canvas ref={ref} className="crowd-canvas" aria-hidden="true" />;
}
