import { useRef, useState } from "react";
import PopupWindow, { Media } from "./PopupWindow.jsx";

// the big documentation pop-up for home page projects (src/data/work.json).
// layout (from the wireframe sketch):
//   [ title, link    ][ timeline  ][ tools       ]
//   [ main media            ][ description      ]
//   [ context text          ][ context media (carousel) ]
//   [ process text, two columns                         ]
//   [ <  process media carousel  >  . . . .             ]
//   [ reflection text                                   ]
//   [ <  reflection media carousel  >  . . . .          ]
//
// reads (all optional):
//   "title", "timeline", "media", "links", "tools", "description"
//   "context":     { "context_text": "..." or [...], "context_media": [...] }
//   "process":     { "process_text": "..." or [...], "process_media": [...] }
//   "reflection":  { "reflection_text": "..." or [...], "reflection_media": [...] }

const asList = (value) => [].concat(value || []).filter(Boolean);

// a section is { <name>_text, <name>_media } (plain text also works)
function readSection(value, name) {
  if (!value) return { text: [], media: [] };
  if (typeof value === "string" || Array.isArray(value)) {
    return { text: asList(value), media: [] };
  }
  return {
    text: asList(value[`${name}_text`]),
    media: asList(value[`${name}_media`]),
  };
}

function fullUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// one clickable piece: hover shows a magnifier + "click to zoom in"
function Piece({ path, zoom }) {
  return (
    <button
      className="project-detail-piece"
      onClick={() => zoom(path)}
      aria-label="click to zoom in"
    >
      <Media path={path} />
      <span className="project-detail-zoom-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
        </svg>
        click to zoom in
      </span>
    </button>
  );
}

// a sideways-scrolling row of pieces with arrows and dots underneath
function Carousel({ items, zoom, single = false }) {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  if (items.length === 0) return null;
  // one piece needs no carousel
  if (items.length === 1) {
    return (
      <div className="project-detail-single">
        <Piece path={items[0]} zoom={zoom} />
      </div>
    );
  }

  const goTo = (i) => {
    const track = trackRef.current;
    const index = (i + items.length) % items.length;
    const slide = track.children[index];
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  // whichever slide is closest to the left edge is the current one
  const onScroll = () => {
    const track = trackRef.current;
    let best = 0;
    let bestDistance = Infinity;
    [...track.children].forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setCurrent(best);
  };

  return (
    <div className={single ? "carousel carousel-single" : "carousel"}>
      <div className="carousel-row">
        <button className="carousel-arrow" aria-label="previous" onClick={() => goTo(current - 1)}>
          ‹
        </button>
        <div className="carousel-track" ref={trackRef} onScroll={onScroll}>
          {items.map((path) => (
            <div className="carousel-slide" key={path}>
              <Piece path={path} zoom={zoom} />
            </div>
          ))}
        </div>
        <button className="carousel-arrow" aria-label="next" onClick={() => goTo(current + 1)}>
          ›
        </button>
      </div>
      <div className="carousel-dots">
        {items.map((path, i) => (
          <button
            key={path}
            className={i === current ? "carousel-dot is-active" : "carousel-dot"}
            aria-label={`go to piece ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetail({ project, onClose }) {
  const tools = asList(project.tools);
  const link = project.links;
  const description = asList(project.description);

  const context = readSection(project.context, "context");
  const process = readSection(project.process, "process");
  const reflection = readSection(project.reflection, "reflection");
  const has = (s) => s.text.length > 0 || s.media.length > 0;

  // every piece in the window, in order (for the zoom arrows)
  const pieces = [
    ...new Set(
      [project.media, ...context.media, ...process.media, ...reflection.media].filter(Boolean),
    ),
  ];

  const paragraphs = (list) => list.map((text) => <p key={text}>{text}</p>);

  return (
    <PopupWindow items={pieces} onClose={onClose} className="project-detail-window">
      {(zoom) => (
        <div className="project-detail">
          <div className="project-detail-scroll">
            {/* row 1: title | timeline */}
            <header className="project-detail-header">
              <div className="project-detail-box">
                <span className="project-detail-label">title</span>
                <h2>{project.title}</h2>
                {link && (
                  <a
                    className="project-detail-link"
                    href={fullUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    visit the project ↗
                  </a>
                )}
              </div>
              <div className="project-detail-box">
                <span className="project-detail-label">timeline</span>
                <p>{project.timeline || "—"}</p>
              </div>
              <div className="project-detail-box">
                <span className="project-detail-label">tools</span>
                {tools.length > 0 ? (
                  <ul className="tags">
                    {tools.map((tool) => (
                      <li className="tag" key={tool}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>—</p>
                )}
              </div>
            </header>

            {/* row 2: main media | description + tools + link */}
            <div className="project-detail-row">
              {project.media && (
                <div className="project-detail-media">
                  <Piece path={project.media} zoom={zoom} />
                </div>
              )}
              <div className="project-detail-box project-detail-words">
                <h3>description</h3>
                {paragraphs(description)}
              </div>
            </div>

            {/* row 3: context text | context media */}
            {has(context) && (
              <section className="project-detail-row project-detail-section">
                <div className="project-detail-box project-detail-words">
                  <h3>context</h3>
                  {paragraphs(context.text)}
                </div>
                {context.media.length > 0 && (
                  <div className="project-detail-media">
                    <Carousel items={context.media} zoom={zoom} single />
                  </div>
                )}
              </section>
            )}

            {/* process + reflection: text on top, carousel underneath */}
            {[
              ["process", process],
              ["reflection", reflection],
            ].map(
              ([name, s]) =>
                has(s) && (
                  <section key={name} className="project-detail-section project-detail-stack">
                    {s.text.length > 0 && (
                      <div className="project-detail-box">
                        <h3>{name}</h3>
                        <div className="project-detail-columns">{paragraphs(s.text)}</div>
                      </div>
                    )}
                    {!s.text.length && <h3>{name}</h3>}
                    <Carousel items={s.media} zoom={zoom} />
                  </section>
                ),
            )}
          </div>
        </div>
      )}
    </PopupWindow>
  );
}
