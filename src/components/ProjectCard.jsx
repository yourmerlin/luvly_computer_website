import { useState } from "react";
import asset from "../asset.js";
import PopupWindow, { Media, altFor } from "./PopupWindow.jsx";
import ProjectDetail from "./ProjectDetail.jsx";

export default function ProjectCard({ project, detailed = false }) {
  const isVideo = /\.(webm|mp4)$/i.test(project.media);
  const [open, setOpen] = useState(false);

  // the description is sometimes a list of paragraphs in the json
  const paragraphs = [].concat(project.description || []).filter(Boolean);

  // keyboard users can open the card with enter or space
  const openOnKey = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

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
        {/* media is optional: projects without an image yet just skip it */}
        {project.media && (
          <div className="project-card-media">
            {isVideo ? (
              // plays on its own like a gif (muted so browsers allow autoplay)
              <video
                src={asset(project.media)}
                aria-label={altFor(project.media)}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={asset(project.media)} alt={altFor(project.media)} />
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
          {/* only the first few lines show here; the pop-up has the whole thing */}
          {paragraphs.length > 0 && (
            <p className="project-card-description">{paragraphs.join(" ")}</p>
          )}
        </div>
      </article>

      {/* kept outside the <article> so clicks inside the pop-up (like ×)
          don't bubble up to the card and open it again */}
      {open && detailed && (
        <ProjectDetail project={project} onClose={() => setOpen(false)} />
      )}
      {open && !detailed && (
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
