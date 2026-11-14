import { useEffect, useState } from "react";

// types `text` out one letter at a time when the page loads, with a
// blinking _ cursor at the end.
// - speed: ms per letter, delay: ms to wait before it starts
// - people who turn on "reduce motion" just see the whole line right away
export default function TypeText({ text, speed = 55, delay = 400 }) {
  const [count, setCount] = useState(0); // how many letters are showing

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    let shown = 0;
    setCount(0);
    let timer = setTimeout(function next() {
      shown += 1;
      setCount(shown);
      if (shown < text.length) timer = setTimeout(next, speed);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return (
    // screen readers get the whole line once, not letter by letter
    <span className="type-text" aria-label={text} role="text">
      {/* invisible full line holds the space, so the text around it
          doesn't jump as letters appear */}
      <span className="type-text-ghost" aria-hidden="true">
        {text}_
      </span>
      <span className="type-text-typed" aria-hidden="true">
        {text.slice(0, count)}
        <span className="type-text-cursor">_</span>
      </span>
    </span>
  );
}
