import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import asset from "../asset.js";

export const isVideo = (path) => /\.(webm|mp4)$/i.test(path);
// some folder names have spaces ("digital art"), so encode them for the url
export const mediaSrc = (path) => asset(encodeURI(path));

export function Media({ path, zoomed = false }) {
  if (isVideo(path)) {
    return zoomed ? (
      <video src={mediaSrc(path)} autoPlay loop playsInline controls />
    ) : (
      <video src={mediaSrc(path)} autoPlay muted loop playsInline />
    );
  }
  return <img src={mediaSrc(path)} alt="" loading={zoomed ? undefined : "lazy"} />;
}


export default function PopupWindow({ title, items, onClose, className, children }) {
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
          <button className="play-window-close" onClick={onClose} aria-label="close">
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
            <div className="play-zoom-media" onClick={(event) => event.stopPropagation()}>
              <Media key={items[zoomed]} path={items[zoomed]} zoomed />
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
    document.body
  );
}
