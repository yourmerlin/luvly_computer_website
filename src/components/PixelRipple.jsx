import { useEffect, useRef } from "react";

// click on the background (not a link, button, card, image...) and a ring of
// square pixels spreads out from that spot and fades, with a smaller echo
// ring right behind it. it only draws while a ripple is moving, so it costs
// nothing the rest of the time. it sits behind the page content
// (see .pixel-ripple in styles.css).

const PIXEL = 8; // size of each square (px), snapped to a grid
const LIFE = 900; // how long one ring lasts (ms)
const MAX_RADIUS = 150; // how far the ring spreads (px)
const ECHO_DELAY = 140; // ms before the second, smaller ring starts
const ECHO_SIZE = 0.6; // the echo ring's size compared to the first
const MAX_RINGS = 10; // cap, for very fast clicking

// clicks on these don't count as "the background"
const NOT_BACKGROUND =
  "a, button, input, textarea, select, label, summary, img, video, canvas, nav, .project-card, .play-backdrop";

const easeOut = (t) => 1 - (1 - t) ** 3;

export default function PixelRipple() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // skip the effect for people who've asked their computer for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rings = []; // { x, y, born, size, color }
    let frameId = null;

    // give the canvas a full-screen bitmap only while a ripple is playing
    function wake() {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.round(window.innerWidth * dpr);
      const height = Math.round(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; // resizing also wipes the canvas
        canvas.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // all rings are gone: free the bitmap's memory until the next click
    function sleep() {
      rings = [];
      frameId = null;
      canvas.width = 0;
      canvas.height = 0;
    }

    function onResize() {
      if (frameId !== null) wake();
    }

    function draw() {
      const now = performance.now();
      // finished rings are dropped here, so nothing piles up
      rings = rings.filter((r) => now - r.born < LIFE);
      if (rings.length === 0) {
        sleep();
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const ring of rings) {
        const t = (now - ring.born) / LIFE;
        if (t < 0) continue; // echo ring hasn't started yet
        const radius = easeOut(t) * MAX_RADIUS * ring.size;
        // fade in steps, like the cursor trail, so it stays pixel-y
        ctx.globalAlpha = Math.ceil((1 - t) * 4) / 4;
        ctx.fillStyle = ring.color;

        // light up every grid square whose center sits on the ring
        const reach = Math.ceil(radius / PIXEL) + 1;
        const cx = Math.floor(ring.x / PIXEL);
        const cy = Math.floor(ring.y / PIXEL);
        for (let gy = cy - reach; gy <= cy + reach; gy++) {
          for (let gx = cx - reach; gx <= cx + reach; gx++) {
            const dx = (gx + 0.5) * PIXEL - ring.x;
            const dy = (gy + 0.5) * PIXEL - ring.y;
            if (Math.abs(Math.hypot(dx, dy) - radius) < PIXEL * 0.6) {
              ctx.fillRect(gx * PIXEL, gy * PIXEL, PIXEL, PIXEL);
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(draw);
    }

    function onClick(e) {
      if (e.target.closest?.(NOT_BACKGROUND)) return;
      // the clicked spot's text color, so it matches the theme (and the
      // blue text on cloud pages)
      const color = getComputedStyle(e.target).color;
      const now = performance.now();
      rings.push(
        { x: e.clientX, y: e.clientY, born: now, size: 1, color },
        {
          x: e.clientX,
          y: e.clientY,
          born: now + ECHO_DELAY,
          size: ECHO_SIZE,
          color,
        },
      );
      rings = rings.slice(-MAX_RINGS);
      if (frameId === null) {
        wake();
        frameId = requestAnimationFrame(draw);
      }
    }

    sleep(); // start with no bitmap at all
    window.addEventListener("resize", onResize);
    window.addEventListener("click", onClick);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      sleep();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas className="pixel-ripple" ref={canvasRef} aria-hidden="true" />;
}
