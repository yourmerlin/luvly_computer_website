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
  const name = path
    .split("/")
    .pop()
    .replace(/\.[a-z0-9]+$/i, "");
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
}

export function Media({ path, zoomed = false }) {
  const alt = altFor(path);
  if (isVideo(path)) {
    // videos have no alt, so the description goes in aria-label
    return zoomed ? (
      <video
        src={mediaSrc(path)}
        aria-label={alt}
        autoPlay
        loop
        playsInline
        controls
      />
    ) : (
      <video
        src={mediaSrc(path)}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <img src={mediaSrc(path)} alt={alt} loading={zoomed ? undefined : "lazy"} />
  );
}

export default function PopupWindow({
  title,
  items,
  onClose,
  className,
  children,
}) {
  const [zoomed, setZoomed] = useState(null); // index into items, or null
  const zoom = (path) => setZoomed(items.indexOf(path));
  // wraps around: back from the first goes to the last
  const step = (by) => setZoomed((i) => (i + by + items.length) % items.length);

  // esc closes the zoomed piece first, then the window; arrow keys flip through
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        if (zoomed !== null) setZoomed(null);
        else onClose();
      } else if (zoomed !== null && event.key === "ArrowRight") step(1);
      else if (zoomed !== null && event.key === "ArrowLeft") step(-1);
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
          <button
            className="play-window-close"
            onClick={onClose}
            aria-label="close"
          >
            ×
          </button>
        </div>

        {children(zoom)}

        {/* click a piece to see it big, click around it to go back */}
        {zoomed !== null && (
          <div className="play-zoom" onClick={() => setZoomed(null)}>
            {items.length > 1 && (
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
            {/* key makes videos restart when you flip to them */}
            <div
              className="play-zoom-media"
              onClick={(event) => event.stopPropagation()}
            >
              {/* frame hugs the image so the × sits on its corner */}
              <div className="play-zoom-frame">
                <Media key={items[zoomed]} path={items[zoomed]} zoomed />
                <button
                  className="play-zoom-close"
                  aria-label="exit zoom"
                  onClick={() => setZoomed(null)}
                >
                  ×
                </button>
              </div>
            </div>
            {items.length > 1 && (
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
    document.body,
  );
}
