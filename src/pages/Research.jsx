import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import projects from "../data/research.json";
import { useRestoreListScroll } from "../projectPath.js";

// each card opens that project's own page (/research/<slug>)
export default function Research() {
  // coming back from a project page: return to the same spot in the list
  useRestoreListScroll();
  return (
    <Page title="research">
      <section className="work-header">
        <h2>research</h2>
        <p>
          my current research focuses on information law & policy, e-textiles,
          and creating open-source tools to learn creative technology.
        </p>
      </section>
      <main className="project-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            detailed
            base="/research"
          />
        ))}
      </main>
    </Page>
  );
}
