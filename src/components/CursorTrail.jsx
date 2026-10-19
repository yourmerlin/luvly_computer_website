import { useEffect, useRef } from "react";

const PIXEL = 10; //size of squares in the trail (px)
const LIFE = 700; //lifespan for each square (ms)
const MAX_PIXELS = 100; //cap
const LIGHT_COLOR = "#ff0077"; //trail color in light mode
const DARK_COLOR = "#ffffff"; //trail color in dark mode

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // skip the effect for people who've asked their computer for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let pixels = [];
    let last = null;
    let frameId = null;

    // match the canvas to the screen. devicePixelRatio keeps squares sharp
    // on high-resolution screens.
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function addPixel(x, y, now) {
      const gx = Math.floor(x / PIXEL) * PIXEL;
      const gy = Math.floor(y / PIXEL) * PIXEL;
      const prev = pixels[pixels.length - 1];
      if (prev && prev.x === gx && prev.y === gy) return;
      pixels.push({ x: gx, y: gy, born: now });
      if (pixels.length > MAX_PIXELS) pixels.shift(); // drop the oldest
    }

    function addPoint(x, y) {
      const now = performance.now();
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const steps = Math.ceil(Math.hypot(dx, dy) / PIXEL);
        for (let i = 1; i < steps; i++) {
          addPixel(last.x + (dx * i) / steps, last.y + (dy * i) / steps, now);
        }
      }
      addPixel(x, y, now);
      last = { x, y };

      if (frameId === null) frameId = requestAnimationFrame(draw);
    }

    function onMove(e) {
      // on touch screens the browser stops sending pointer events as soon as
      // the page starts scrolling, so touches are handled by onTouchMove instead
      if (e.pointerType === "touch") return;
      addPoint(e.clientX, e.clientY);
    }

    // touchmove keeps firing the whole time a finger drags, even while scrolling
    function onTouchMove(e) {
      const t = e.touches[0];
      addPoint(t.clientX, t.clientY);
    }

    function draw() {
      const now = performance.now();

      pixels = pixels.filter((p) => now - p.born < LIFE); //deletes squares when lifespan ages
      const isLight = document.documentElement.classList.contains("light-mode"); //checkes the mode
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = isLight ? LIGHT_COLOR : DARK_COLOR;
      for (const p of pixels) {
        const fade = 1 - (now - p.born) / LIFE;
        ctx.globalAlpha = Math.ceil(fade * 4) / 4;
        ctx.fillRect(p.x, p.y, PIXEL, PIXEL);
      }
      ctx.globalAlpha = 1;
      frameId = pixels.length > 0 ? requestAnimationFrame(draw) : null;
    }

    function onLeave() {
      last = null;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave); // each swipe starts a new trail
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas className="cursor-trail" ref={canvasRef} />;
}
