import Page from "../components/Page.jsx";
import ResearchCard from "../components/ResearchCard.jsx";
import projects from "../data/research.json";

export default function Research() {
  return (
    <Page title="research">
      <section className="work-header">
        <h2>research</h2>
        <p>
          my current research focuses on information law & policy, e-textiles,
          and creating open-source tools to learn creative technology.
        </p>
      </section>
      <main className="research-content">
        {projects.map((project) => (
          <ResearchCard key={project.title} project={project} />
        ))}
      </main>
    </Page>
  );
}
