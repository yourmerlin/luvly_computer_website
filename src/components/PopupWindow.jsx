import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import asset from "../asset.js";

export const isVideo = (path) => /\.(webm|mp4)$/i.test(path);
// some folder names have spaces ("digital art"), so encode them for the url
export const mediaSrc = (path) => asset(encodeURI(path));

// one image or video; videos play on their own like a gif
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

// white + blue pop-up window (play folders, experiments gallery)
// children is a function that gets `zoom(path)` to show one piece big
export default function PopupWindow({ title, count, onClose, children }) {
  const [zoomed, setZoomed] = useState(null);

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

  // drawn straight into <body> so a blurred card can't trap the fixed backdrop inside it
  return createPortal(
    <div className="play-backdrop" onClick={onClose}>
      <div
        className="play-window"
        role="dialog"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="play-window-bar">
          <button className="play-window-close" onClick={onClose} aria-label="close">
            ×
          </button>
          <h3>{title}</h3>
          <span>{count} items</span>
        </div>

        {children(setZoomed)}

        {/* click a piece to see it big, click again to go back */}
        {zoomed && (
          <div className="play-zoom" onClick={() => setZoomed(null)}>
            <Media path={zoomed} zoomed />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
