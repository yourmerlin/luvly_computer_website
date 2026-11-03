import { useEffect, useState } from "react";
import Page from "../components/Page.jsx";
import asset from "../asset.js";
import folders from "../data/play.json";

const isVideo = (path) => /\.(webm|mp4)$/i.test(path);
// folder names have spaces ("digital art"), so encode them for the url
const src = (path) => asset(encodeURI(path));

// spreads the pieces around the window (in %): one ring, or two for big folders,
// nudged a little off the circle so it looks hand-placed
function webPoints(count) {
  if (count === 1) return [{ x: 50, y: 50 }];
  const outer = count > 7 ? Math.ceil(count * 0.6) : count;
  return Array.from({ length: count }, (_, i) => {
    const inner = i >= outer;
    const ringSize = inner ? count - outer : outer;
    const slot = inner ? i - outer : i;
    const angle = (slot / ringSize) * Math.PI * 2 + (inner ? 0.6 : -Math.PI / 2);
    const radius = inner ? 0.18 : 0.36;
    const wobble = Math.sin(i * 12.9898) * 0.04;
    return {
      x: 50 + Math.cos(angle) * (radius + wobble) * 100,
      y: 50 + Math.sin(angle) * (radius + wobble) * 100,
    };
  });
}

// each piece gets a thread to its 3 closest neighbours, which makes the web
function webLines(points) {
  const seen = new Set();
  const lines = [];
  points.forEach((point, i) => {
    points
      .map((other, j) => ({ j, d: Math.hypot(other.x - point.x, other.y - point.y) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = [Math.min(i, j), Math.max(i, j)].join("-");
        if (seen.has(key)) return;
        seen.add(key);
        lines.push([point, points[j]]);
      });
  });
  return lines;
}

// pop-up window for one folder: its pieces strung together with lines
function FolderWindow({ folder, onClose }) {
  const [zoomed, setZoomed] = useState(null);
  const points = webPoints(folder.media.length);
  const lines = webLines(points);
  // fewer pieces get to be bigger
  const size = folder.media.length <= 2 ? "large" : folder.media.length <= 6 ? "medium" : "small";

  // esc closes the zoomed piece first, then the window
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (zoomed) setZoomed(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, onClose]);

  return (
    <div className="play-backdrop" onClick={onClose}>
      <div
        className="play-window"
        role="dialog"
        aria-label={folder.name}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="play-window-bar">
          <button className="play-window-close" onClick={onClose} aria-label="close">
            ×
          </button>
          <h3>{folder.name}</h3>
          <span>{folder.media.length} items</span>
        </div>

        <div className={`play-web play-web-${size}`}>
          {/* viewBox matches the % positions; non-scaling-stroke keeps lines thin when stretched */}
          <svg className="play-web-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            {lines.map(([a, b], i) => (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength="1"
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </svg>

          {folder.media.map((path, i) => (
            <button
              key={path}
              className="play-piece"
              style={{
                left: `${points[i].x}%`,
                top: `${points[i].y}%`,
                animationDelay: `${i * 60}ms`,
              }}
              onClick={() => setZoomed(path)}
            >
              {isVideo(path) ? (
                <video src={src(path)} autoPlay muted loop playsInline />
              ) : (
                <img src={src(path)} alt="" loading="lazy" />
              )}
            </button>
          ))}
        </div>

        {/* click a piece to see it big, click again to go back to the web */}
        {zoomed && (
          <div className="play-zoom" onClick={() => setZoomed(null)}>
            {isVideo(zoomed) ? (
              <video src={src(zoomed)} autoPlay loop playsInline controls />
            ) : (
              <img src={src(zoomed)} alt="" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Play() {
  const [open, setOpen] = useState(null);

  return (
    <Page title="play" cloud>
      {/* folders scattered like a desktop; x/y (in %) live in src/data/play.json */}
      <main className="play-desktop">
        {folders.map((folder) => (
          <button
            key={folder.name}
            className="play-folder"
            style={{ left: `${folder.x}%`, top: `${folder.y}%` }}
            onClick={() => setOpen(folder)}
          >
            <img src={asset("play_imgs/mac_folder.webp")} alt="" />
            <span>{folder.name}</span>
          </button>
        ))}
      </main>
      {open && <FolderWindow folder={open} onClose={() => setOpen(null)} />}
    </Page>
  );
}
