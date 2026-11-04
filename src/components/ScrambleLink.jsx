import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const FRAME_MS = 40; // how often the 0s and 1s reshuffle
const TOTAL_FRAMES = 12; // whole word decodes in ~half a second, long or short

const randomBit = () => (Math.random() < 0.5 ? "0" : "1");

// nav link that scrambles into binary on hover, then decodes back left to right
export default function ScrambleLink({ to, text }) {
  const [shown, setShown] = useState(text);
  const timer = useRef(null);

  const scramble = () => {
    // skip it for people who asked their computer for less motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      const decoded = Math.floor((frame / TOTAL_FRAMES) * text.length);
      setShown(
        [...text].map((letter, i) => (i < decoded ? letter : randomBit())).join("")
      );
      if (decoded >= text.length) clearInterval(timer.current);
      frame++;
    }, FRAME_MS);
  };

  // stop the timer if the page changes mid-scramble
  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <Link to={to} aria-label={text} onMouseEnter={scramble} onFocus={scramble}>
      {/* screen readers get the real word from aria-label, not the 0s and 1s */}
      <span aria-hidden="true">{shown}</span>
    </Link>
  );
}
