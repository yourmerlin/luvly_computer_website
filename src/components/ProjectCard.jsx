import { useState } from "react";
import asset from "../asset.js";
import PopupWindow, { Media } from "./PopupWindow.jsx";

// one project on the work, research or experiments page (data from src/data/*.json)
// wide and short: media on the left, text on the right
export default function ProjectCard({ project }) {
  const isVideo = /\.(webm|mp4)$/i.test(project.media);
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <article className="project-card">
      {/* media is optional: projects without an image yet just skip it */}
      {project.media && (
        <div className="project-card-media">
          {isVideo ? (
            // plays on its own like a gif (muted so browsers allow autoplay)
            <video src={asset(project.media)} autoPlay muted loop playsInline />
          ) : (
            <img src={asset(project.media)} alt={project.title} />
          )}
        </div>
      )}
      <div className="project-card-text">
        <h3>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
        </h3>
        {/* status, tags, description and link are all optional */}
        {project.status && <p className="status">[{project.status}]</p>}
        {project.tags && (
          <ul className="tags">
            {project.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
        {project.description && <p>{project.description}</p>}
        {project.gallery && (
          <button className="project-card-link" onClick={() => setGalleryOpen(true)}>
            check out the process -&gt;
          </button>
        )}
      </div>

      {/* "gallery" in the json: every piece in a pop-up grid, in the order listed */}
      {galleryOpen && (
        <PopupWindow
          title={project.title}
          count={project.gallery.length}
          onClose={() => setGalleryOpen(false)}
        >
          {(zoom) => (
            <div className="gallery-grid">
              {project.gallery.map((path) => (
                <button key={path} className="gallery-piece" onClick={() => zoom(path)}>
                  <Media path={path} />
                </button>
              ))}
            </div>
          )}
        </PopupWindow>
      )}
    </article>
  );
}
