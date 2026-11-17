import { useState } from "react";
import { Link } from "react-router";
import asset from "../asset.js";
import PopupWindow, { Media, altFor } from "./PopupWindow.jsx";
import { readSection } from "./ProjectDetail.jsx";
import { projectPath, saveListScroll } from "../projectPath.js";

// detailed: the card links to the project's own page (<base>/<slug>, e.g.
// /work/computers-json). otherwise clicking it opens a small pop-up.
export default function ProjectCard({ project, detailed = false, base = "/work" }) {
  // the card shows "thumbnail" if there is one (needed when "media" is a 3D
  // model, which can't be a card picture), otherwise "media"
  const cardMedia = project.thumbnail || project.media;
  const isVideo = /\.(webm|mp4)$/i.test(cardMedia);
  const [open, setOpen] = useState(false);

  // the description can be a string, a list of paragraphs, or
  // { description_text, description_media } in the json
  const paragraphs = readSection(project.description, "description").text;

  // keyboard users can open the card with enter or space
  const openOnKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const cardContents = (
    <>
        {/* media is optional: projects without an image yet just skip it */}
        {cardMedia && (
          <div className="project-card-media">
            {isVideo ? (
              // plays on its own like a gif (muted so browsers allow autoplay)
              <video
                src={asset(cardMedia)}
                aria-label={altFor(cardMedia)}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={asset(cardMedia)} alt={altFor(cardMedia)} />
            )}
          </div>
        )}

        <div className="project-card-text">
          <h3>{project.title}</h3>
          {/* status and tools are optional */}
          {project.status && <p className="status">[{project.status}]</p>}
          {project.tools && (
            <ul className="tags">
              {project.tools.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {/* only the first few lines show here; the full write-up is on
              the project's page (or in the pop-up) */}
          {paragraphs.length > 0 && (
            <p className="project-card-description">{paragraphs.join(" ")}</p>
          )}
        </div>
    </>
  );

  // a real link: opens the project's page, and works with
  // ctrl/cmd-click (new tab) and right-click "copy link"
  if (detailed) {
    return (
      <Link
        className="project-card"
        to={projectPath(project, base)}
        aria-label={`open ${project.title}`}
        onClick={saveListScroll}
      >
        {cardContents}
      </Link>
    );
  }

  return (
    <>
      <article
        className="project-card"
        role="button"
        tabIndex={0}
        aria-label={`open ${project.title}`}
        onClick={() => setOpen(true)}
        onKeyDown={openOnKey}
      >
        {cardContents}
      </article>

      {/* kept outside the <article> so clicks inside the pop-up (like ×)
          don't bubble up to the card and open it again */}
      {open && (
        <PopupWindow
          title={project.title}
          onClose={() => setOpen(false)}
        >
          {(zoom) => (
            <div className="project-popup">
              <div className="project-popup-main">
                {project.media && (
                  <button
                    className="project-popup-media"
                    onClick={() => zoom(project.media, [project.media])}
                    aria-label={`see it bigger: ${altFor(project.media)}`}
                  >
                    <Media path={project.media} />
                  </button>
                )}
                <div className="project-popup-info">
                  {project.status && (
                    <p className="status">[{project.status}]</p>
                  )}
                  {project.tools && (
                    <ul className="tags">
                      {project.tools.map((tag) => (
                        <li className="tag" key={tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  {paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  {project.links && (
                    <a
                      className="project-card-link"
                      href={project.links}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      visit the project -&gt;
                    </a>
                  )}
                </div>
              </div>

              {/* "gallery" in the json: the process pieces, in the order listed */}
              {project.gallery && (
                <>
                  <h4 className="project-popup-heading">the process</h4>
                  <div className="gallery-grid">
                    {project.gallery.map((path) => (
                      <button
                        key={path}
                        className="gallery-piece"
                        onClick={() => zoom(path, project.gallery)}
                      >
                        <Media path={path} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </PopupWindow>
      )}
    </>
  );
}
