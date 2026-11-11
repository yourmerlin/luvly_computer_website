import { useRef, useState } from "react";
import PopupWindow, { Media } from "./PopupWindow.jsx";

// the big documentation pop-up for home page projects (src/data/work.json).
// reads (all optional):
//   "timeline":   "fall 2025 – spring 2026"
//   "techstack":  ["react.js", "three.js"]   (falls back to "tags")
//   "media":      main image/video under the header
//   "description": shown to the right of the main media
//   "context":    "text" or ["paragraph", "paragraph"], or { idea, text, media }
//   "process":    { "text": "..." or [...], "media": ["path", ...] }
//   "reflection": { "text": "..." or [...], "media": ["final images", ...] }
//   "link" / "links": a url, shown under the tech stack

const asList = (value) => [].concat(value || []).filter(Boolean);

// a section can be plain text or { text, media }
function readSection(value) {
  if (!value) return { idea: [], text: [], media: [] };
  if (typeof value === "string" || Array.isArray(value)) {
    return { idea: [], text: asList(value), media: [] };
  }
  return {
    idea: asList(value.idea),
    text: asList(value.text),
    media: asList(value.media),
  };
}

function fullUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function ProjectDetail({ project, onClose }) {
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("overview");

  const techstack = asList(project.techstack || project.tags);
  const link = project.link || project.links;
  const description = asList(project.description);

  // the sections in order; empty ones are skipped
  const sections = [
    { id: "context", title: "context", ...readSection(project.context) },
    {
      id: "reflection",
      title: "reflection",
      ...readSection(project.reflection),
    },
  ].filter((s) => s.text.length || s.media.length);
  const stops = [{ id: "overview", title: "overview" }, ...sections];

  // every piece in the window, in order (for the zoom arrows)
  const pieces = [
    ...new Set(
      [project.media, ...sections.flatMap((s) => s.media)].filter(Boolean),
    ),
  ];

  // fill the rail + highlight whichever section is in view
  const onScroll = () => {
    const el = scrollRef.current;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 1);
    let current = "overview";
    for (const s of sections) {
      const node = sectionRefs.current[s.id];
      if (node && node.offsetTop - el.scrollTop < el.clientHeight * 0.4)
        current = s.id;
    }
    // at the very bottom, the last section counts as current
    if (max > 0 && el.scrollTop >= max - 2 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  };

  const jumpTo = (id) => {
    const el = scrollRef.current;
    const node = sectionRefs.current[id];
    el.scrollTo({
      top: id === "overview" || !node ? 0 : node.offsetTop - 16,
      behavior: "smooth",
    });
  };

  // one clickable piece (opens the full-size view)
  const piece = (path, zoom) => (
    <button
      key={path}
      className="project-detail-piece"
      onClick={() => zoom(path)}
      aria-label="see it bigger"
    >
      <Media path={path} />
    </button>
  );

  return (
    <PopupWindow
      items={pieces}
      onClose={onClose}
      className="project-detail-window"
    >
      {(zoom) => (
        <div className="project-detail">
          {/* scroll rail: fills as you scroll, click a label to jump */}

          <div
            className="project-detail-scroll"
            ref={scrollRef}
            onScroll={onScroll}
          >
            {/* header: title - timeline - tech stack */}
            <header className="project-detail-header">
              <div>
                <span className="project-detail-label">title</span>
                <h2>{project.title}</h2>
              </div>
              <div>
                <span className="project-detail-label">timeline</span>
                <p>{project.timeline || "—"}</p>
              </div>
              <div>
                <span className="project-detail-label">tech stack</span>
                {techstack.length > 0 ? (
                  <ul className="tags">
                    {techstack.map((tool) => (
                      <li className="tag" key={tool}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>—</p>
                )}
                {link && (
                  <a
                    className="project-card-link"
                    href={fullUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    visit the project -&gt;
                  </a>
                )}
              </div>
            </header>

            {/* main media with the description to its right */}
            {(project.media || description.length > 0) && (
              <div className="project-detail-hero">
                {project.media && piece(project.media, zoom)}
                {description.length > 0 && (
                  <div className="project-detail-description">
                    <h3>description</h3>
                    {description.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* context -> process -> reflection */}
            {sections.map((s) => (
              <section
                key={s.id}
                // context puts its media to the right of the text
                className={
                  s.id === "context" && s.media.length > 0
                    ? "project-detail-section project-detail-side"
                    : "project-detail-section"
                }
                ref={(node) => (sectionRefs.current[s.id] = node)}
              >
                <div className="project-detail-words">
                  <h3>{s.title}</h3>
                  {[...s.idea, ...s.text].map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
                {s.media.length > 0 && (
                  <div className="project-detail-grid">
                    {s.media.map((path) => piece(path, zoom))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </PopupWindow>
  );
}
