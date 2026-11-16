import { useEffect, useState } from "react";
import asset from "../asset.js";
// the .glb files are meshopt-compressed (smaller downloads). <model-viewer>
// can't open those on its own: it needs this decoder, and it has to be told
// where the decoder is *before* it loads. vite copies the file into the build.
import meshoptDecoderUrl from "meshoptimizer/meshopt_decoder.js?url";

let loadViewer = null;
function loadModelViewer() {
  if (!loadViewer) {
    self.ModelViewerElement = {
      ...self.ModelViewerElement,
      meshoptDecoderLocation: meshoptDecoderUrl,
    };
    loadViewer = import("@google/model-viewer");
  }
  return loadViewer;
}

export const isModel = (path) => /\.(glb|gltf)$/i.test(path);

// the high-res version of a model sits next to it: ".../low.glb" -> ".../high.glb"
const highResOf = (path) =>
  /(^|\/)low\.(glb|gltf)$/i.test(path)
    ? path.replace(/low\.(glb|gltf)$/i, "high.$1")
    : null;

// a 3D model people can drag to spin around and scroll/pinch to zoom.
// it starts with the low-res file (quick to load); if there's a high.glb in
// the same folder, a button swaps to it.
// <model-viewer> is only downloaded the first time a model shows up.
export default function ModelViewer({ path, alt }) {
  const [ready, setReady] = useState(false);
  const [high, setHigh] = useState(false);
  const highPath = highResOf(path);

  useEffect(() => {
    let alive = true;
    loadModelViewer().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const src = asset(encodeURI(high && highPath ? highPath : path));

  return (
    <div className="model-viewer">
      {/* hint + resolution button sit above the model */}
      <div className="model-viewer-bar">
        <span>drag to spin · scroll to zoom</span>
        {highPath && (
          <button
            className="model-viewer-toggle"
            onClick={() => setHigh((h) => !h)}
            aria-pressed={high}
          >
            {high ? "view low resolution" : "view in high resolution"}
          </button>
        )}
      </div>
      {ready ? (
        <model-viewer
          src={src}
          alt={alt}
          camera-controls=""
          touch-action="pan-y"
          auto-rotate=""
          auto-rotate-delay="2000"
          interaction-prompt="auto"
          shadow-intensity="1"
          exposure="1"
        />
      ) : (
        <p className="model-viewer-loading">loading model…</p>
      )}
    </div>
  );
}
