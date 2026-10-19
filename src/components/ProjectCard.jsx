import asset from "../asset.js";

// one project on the work page (data comes from src/data/work.json)
// `order` keeps the original project order when the columns collapse to one on phones
export default function ProjectCard({ project, order }) {
  const isVideo = /\.(webm|mp4)$/i.test(project.media);

  return (
    <article style={{ order }}>
      {isVideo ? (
        // plays on its own like a gif (muted so browsers allow autoplay)
        <video src={asset(project.media)} autoPlay muted loop playsInline />
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
      {project.description && (
        <p>{project.description}</p>
      )}
    </article>
  );
}
