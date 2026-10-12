import { useEffect, useRef } from "react";

// the magic wand that follows your mouse
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div id="customCursor" ref={ref} />;
}
