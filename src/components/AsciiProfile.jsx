import { useEffect, useRef } from "react";
import { useTheme } from "../theme.jsx";
import asset from "../asset.js";

// me_wizard_profile.jpg drawn only with 0s and 1s.
// each cell gets an "ink" value from the photo: more ink = a bigger glyph,
// a thicker stroke, more opacity, and a "0" instead of a "1".
// edges in the photo get extra weight so the face/hat read with some depth,
// and a slow wave + per-cell flicker keeps it gently changing over time.

const COLS = 84; // characters across
const CELL_ASPECT = 1.5; // cell height / width (digits are tall)
const ROWS = Math.round(COLS / CELL_ASPECT); // photo is square
const LEVELS = 12; // how many size/stroke steps each glyph comes in
const FPS = 10; // slow on purpose
const FONT = '"Roboto Mono", monospace';
// same as --text-color in styles.css (read here because the css variable
// only updates after this component's effect runs on a theme switch)
const COLORS = { dark: "white", light: "#0005d0" };

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

// photo -> grid of { lum, edge } values (0..1)
function sampleImage(img) {
  const c = document.createElement("canvas");
  c.width = COLS;
  c.height = ROWS;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, COLS, ROWS);
  const { data } = ctx.getImageData(0, 0, COLS, ROWS);

  const lum = new Float32Array(COLS * ROWS);
  for (let i = 0; i < lum.length; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  // stretch contrast between the 2nd and 98th percentile
  const sorted = Array.from(lum).sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.02)];
  const hi = sorted[Math.floor(sorted.length * 0.98)];
  for (let i = 0; i < lum.length; i++) {
    lum[i] = clamp((lum[i] - lo) / (hi - lo || 1));
  }

  // sobel edges
  const edge = new Float32Array(COLS * ROWS);
  const at = (x, y) =>
    lum[Math.min(ROWS - 1, Math.max(0, y)) * COLS + Math.min(COLS - 1, Math.max(0, x))];
  let maxE = 0;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const gx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) -
        at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const gy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) -
        at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      const e = Math.hypot(gx, gy);
      edge[y * COLS + x] = e;
      if (e > maxE) maxE = e;
    }
  }
  for (let i = 0; i < edge.length; i++) edge[i] = Math.sqrt(edge[i] / (maxE || 1));

  // vignette centred on the face so the busy window/wall fall away
  const focus = new Float32Array(COLS * ROWS);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dx = x / COLS - 0.55;
      const dy = y / ROWS - 0.5;
      const d = Math.sqrt(dx * dx + dy * dy) / 0.62;
      focus[y * COLS + x] = clamp(1.15 - d * d);
    }
  }

  // stable random number per cell (for flicker timing)
  const seed = new Float32Array(COLS * ROWS);
  for (let i = 0; i < seed.length; i++) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    seed[i] = s - Math.floor(s);
  }

  return { lum, edge, focus, seed };
}

// pre-draw "0" and "1" at every size/stroke level once, then stamp them
function buildAtlas(cellW, cellH, color) {
  const spriteW = Math.ceil(cellW * 1.8);
  const spriteH = Math.ceil(cellH * 1.4);
  const atlas = document.createElement("canvas");
  atlas.width = spriteW * LEVELS;
  atlas.height = spriteH * 2;
  const ctx = atlas.getContext("2d");
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  ["1", "0"].forEach((glyph, g) => {
    for (let k = 0; k < LEVELS; k++) {
      const t = k / (LEVELS - 1);
      const size = cellH * (0.5 + 0.62 * t);
      // light weight for shadows, heavier strokes for highlights
      const weight = t < 0.35 ? 300 : t < 0.7 ? 400 : 700;
      ctx.font = `${weight} ${size}px ${FONT}`;
      const cx = k * spriteW + spriteW / 2;
      const cy = g * spriteH + spriteH / 2;
      ctx.fillText(glyph, cx, cy);
      const stroke = Math.max(0, t - 0.45) * cellW * 0.32;
      if (stroke > 0.1) {
        ctx.lineWidth = stroke;
        ctx.strokeText(glyph, cx, cy);
      }
    }
  });

  return { atlas, spriteW, spriteH };
}

// active={false} pauses the animation (e.g. while it's faded out on the
// about page) so a hidden portrait doesn't keep redrawing
export default function AsciiProfile({ active = true }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const { theme } = useTheme();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let grid = null;
    let sprites = null;
    let cellW = 0;
    let cellH = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let cancelled = false;

    // white ink on pink (dark mode) = bright parts get the ink;
    // pink ink on white (light mode) = dark parts get the ink
    const inkIsLight = theme !== "light";

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      cellW = (w / COLS) * dpr;
      cellH = cellW * CELL_ASPECT;
      canvas.width = Math.round(cellW * COLS);
      canvas.height = Math.round(cellH * ROWS);
      const color = COLORS[theme] || COLORS.dark;
      sprites = buildAtlas(cellW, cellH, color);
      draw(performance.now());
    }

    function draw(now) {
      if (!grid || !sprites) return;
      const t = reduceMotion ? 0 : now / 1000;
      const { lum, edge, focus, seed } = grid;
      const { atlas, spriteW, spriteH } = sprites;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          const base = inkIsLight ? lum[i] : 1 - lum[i];

          // slow travelling light that washes across the portrait
          const wave =
            Math.sin(x * 0.11 + y * 0.07 - t * 0.45) * 0.5 +
            Math.sin(x * 0.05 - y * 0.13 + t * 0.3) * 0.5;

          let ink = base * 0.82 + edge[i] * 0.38 + wave * 0.07;
          ink = clamp(ink * focus[i]);
          if (ink < 0.07) continue;

          // each cell drifts between 1 and 0 on its own slow clock;
          // mid-tones flip the most, extremes stay put
          const flick = Math.sin(t * (0.25 + seed[i] * 0.5) + seed[i] * 6.283) * 0.16;
          const g = ink > 0.52 + flick ? 1 : 0;

          const k = Math.min(LEVELS - 1, Math.floor(ink * LEVELS));
          ctx.globalAlpha = 0.18 + 0.82 * ink;
          ctx.drawImage(
            atlas,
            k * spriteW, g * spriteH, spriteW, spriteH,
            x * cellW + cellW / 2 - spriteW / 2,
            y * cellH + cellH / 2 - spriteH / 2,
            spriteW, spriteH,
          );
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible || !activeRef.current || now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    }

    const img = new Image();
    img.src = asset("me_wizard_profile.jpg");
    Promise.all([img.decode(), document.fonts?.ready]).then(() => {
      if (cancelled) return;
      grid = sampleImage(img);
      resize();
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    });

    const ro = new ResizeObserver(() => grid && resize());
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [theme]);

  return (
    <div className="ascii-profile" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="portrait of Merlin in a blue wizard hat and cape, drawn in 0s and 1s"
      />
    </div>
  );
}
