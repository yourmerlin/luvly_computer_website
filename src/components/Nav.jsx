import { Link } from "react-router";
import { useTheme } from "../theme.jsx";

export default function Nav({ themeToggle = true }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <ul>
        <li><Link to="/">𐙚</Link></li>
        <li><Link to="/work">work</Link></li>
        <li><Link to="/about">about</Link></li>
        <li><Link to="/experiments">experiments</Link></li>
        <li><Link to="/play">play</Link></li>
        {themeToggle && (
          <li>
            <button id="themeToggle" aria-label="toggle theme" onClick={toggleTheme}>
              {theme === "light" ? "✹" : "☽"}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
