import { useEffect } from "react";
import Nav from "./Nav.jsx";
import DitherBackground from "./DitherBackground.jsx";

// every page: sets the tab title, draws the nav, and (optionally) the dither bg
export default function Page({ title, className, dither = false, themeToggle = true, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className={className}>
      {dither && <DitherBackground />}
      <Nav themeToggle={themeToggle} />
      {children}
    </div>
  );
}
