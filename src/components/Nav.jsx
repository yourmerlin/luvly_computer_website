import { useState } from "react";
import { Link } from "react-router";
import { useTheme } from "../theme.jsx";
import ScrambleLink from "./ScrambleLink.jsx";

// on phones the links hide behind a "menu" button that drops them down
export default function Nav({ themeToggle = true }) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  // close the dropdown after picking a page
  const closeOnLink = (e) => {
    if (e.target.closest("a")) setOpen(false);
  };

  const themeIcon = theme === "light" ? "✹" : "☽";

  return (
    <nav>
      {/* phones only: bow on the left, theme toggle + menu on the right */}
      <Link to="/" className="nav-home">
        𐙚
      </Link>
      <div className="nav-controls">
        {themeToggle && (
          <button
            className="nav-theme"
            aria-label="toggle theme"
            onClick={toggleTheme}
          >
            {themeIcon}
          </button>
        )}
        <button
          className="menu-button"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "close" : "menu"}
        </button>
      </div>
      <ul
        id="nav-links"
        className={open ? "is-open" : undefined}
        onClick={closeOnLink}
      >
        <li className="nav-home-item">
          <Link to="/">𐙚</Link>
        </li>
        {/* these scramble into binary on hover (see ScrambleLink) */}
        <li>
          <ScrambleLink to="/about" text="about" />
        </li>
        <li>
          <ScrambleLink to="/research" text="research" />
        </li>
        <li>
          <ScrambleLink to="/play" text="play" />
        </li>
        {themeToggle && (
          <li className="nav-theme-item">
            <button
              id="themeToggle"
              aria-label="toggle theme"
              onClick={toggleTheme}
            >
              {themeIcon}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
