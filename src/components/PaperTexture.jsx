// a soft paper layer over the page color, under the content:
// fine grain + faint blotches, made with an svg noise filter (no image file).
// it's a still image, so it costs nothing after the first paint.
// tweak the look in styles.css (.paper-grain).

const svg = (baseFrequency, octaves) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>` +
      `<filter id='n'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${octaves}' stitchTiles='stitch'/>` +
      `<feColorMatrix type='saturate' values='0'/>` +
      `</filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/>` +
      `</svg>`,
  )}")`;

// fine grain on top, big soft blotches underneath (like uneven paper fibers)
const GRAIN = `${svg(0.85, 3)}, ${svg(0.012, 2)}`;

export default function PaperTexture() {
  return (
    <div
      className="paper-grain"
      aria-hidden="true"
      style={{ backgroundImage: GRAIN }}
    />
  );
}
