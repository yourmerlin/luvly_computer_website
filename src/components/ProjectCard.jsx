import asset from "../asset.js";

// one project on the work or research page (data from src/data/work.json or research.json)
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
        <h3>{project.title}</h3>
        <p className="status">({project.status})</p>
        <ul className="tags">
          {project.tags.map((tag) => (
            <li className="tag" key={tag}>{tag}</li>
          ))}
        </ul>
        {project.description && <p>{project.description}</p>}
      </div>
    </article>
  );
}
