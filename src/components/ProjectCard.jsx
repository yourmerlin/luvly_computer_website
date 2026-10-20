import { Link } from "react-router";
import asset from "../asset.js";

// one project on the work, research or experiments page (data from src/data/*.json)
// wide and short: media on the left, text on the right
export default function ProjectCard({ project }) {
  const isVideo = /\.(webm|mp4)$/i.test(project.media);

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
        <h3><a href={project.link} target="_blank" rel="noopener noreferrer">
          {project.title}
        </a></h3>
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
        {project.link && (
          <Link className="project-card-link" to={project.link.to}>
            {project.link.label}
          </Link>
        )}
      </div>
    </article>
  );
}
