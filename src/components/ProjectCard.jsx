import asset from "../asset.js";

// one project on the work page (data comes from src/data/work.json)
export default function ProjectCard({ project, hidden }) {
  const isVideo = /\.(webm|mp4)$/i.test(project.media);

  return (
    <article className={hidden ? "is-hidden" : undefined}>
      {isVideo ? (
        <video src={asset(project.media)} />
      ) : (
        <img src={asset(project.media)} alt={project.title} />
      )}
      <h3>{project.title}</h3>
      <p className="status">({project.status})</p>
      <ul className="tags">
        {project.tags.map((tag) => (
          <li className="tag" key={tag}>{tag}</li>
        ))}
      </ul>
      {project.description && <p>{project.description}</p>}
    </article>
  );
}
