import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import asset from "../asset.js";

import altText from "../data/alt.json";

export const isVideo = (path) => /\.(webm|mp4)$/i.test(path);
// some folder names have spaces ("digital art"), so encode them for the url
export const mediaSrc = (path) => asset(encodeURI(path));

// what screen readers say for a piece: written descriptions live in
// src/data/alt.json (keyed by the same path as the other json files).
// a new piece without one falls back to its file name, cleaned up.
export function altFor(path) {
  if (altText[path]) return altText[path];
  const name = path.split("/").pop().replace(/\.[a-z0-9]+$/i, "");
  return name.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}

export function Media({ path, zoomed = false }) {
  const alt = altFor(path);
  if (isVideo(path)) {
    // videos have no alt, so the description goes in aria-label
    return zoomed ? (
      <video src={mediaSrc(path)} aria-label={alt} autoPlay loop playsInline controls />
    ) : (
      <video src={mediaSrc(path)} aria-label={alt} autoPlay muted loop playsInline />
    );
  }
  return <img src={mediaSrc(path)} alt={alt} loading={zoomed ? undefined : "lazy"} />;
}


// zoom(path, group) opens a piece big. the back/next arrows only flip
// through `group` (the carousel it came from), or `items` when no group is
// given. a group of one gets no arrows.
export default function PopupWindow({ title, items = [], onClose, className, children }) {
  const [zoomed, setZoomed] = useState(null); // index into group, or null
  const [group, setGroup] = useState(items); // the pieces the arrows flip through
  const zoom = (path, from = items) => {
    const list = from.includes(path) ? from : [path];
    setGroup(list);
    setZoomed(list.indexOf(path));
  };
  // wraps around: back from the first goes to the last
  const step = (by) => setZoomed((i) => (i + by + group.length) % group.length);
  const hasArrows = group.length > 1;

  // esc closes the zoomed piece first, then the window; arrow keys flip through
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        if (zoomed !== null) setZoomed(null);
        else onClose();
      } else if (zoomed !== null && hasArrows && event.key === "ArrowRight") step(1);
      else if (zoomed !== null && hasArrows && event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // drawn straight into <body> so a blurred card can't trap the fixed backdrop inside it
  return createPortal(
    <div className="play-backdrop" onClick={onClose}>
      <div
        className={className ? `play-window ${className}` : "play-window"}
        role="dialog"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="play-window-bar">
          <h3>{title}</h3>
          <button className="play-window-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>

        {children(zoom)}

        {/* click a piece to see it big, click around it to go back */}
        {zoomed !== null && (
          <div className="play-zoom" onClick={() => setZoomed(null)}>
            {hasArrows && (
              <button
                className="play-zoom-arrow"
                aria-label="back"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
              >
                ‹
              </button>
            )}
            {/* clicking the zoomed image zooms back out. videos are left
                alone so their play/volume controls still work.
                key makes videos restart when you flip to them */}
            <div
              className="play-zoom-media"
              onClick={(event) => {
                event.stopPropagation();
                if (event.target.tagName === "IMG") setZoomed(null);
              }}
            >
              <Media key={group[zoomed]} path={group[zoomed]} zoomed />
            </div>
            {hasArrows && (
              <button
                className="play-zoom-arrow"
                aria-label="next"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
              >
                ›
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
