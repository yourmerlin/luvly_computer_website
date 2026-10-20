import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import experiments from "../data/experiments.json";

export default function Experiments() {
  return (
    <Page title="experiments" dither>
      <section className="work-header">
        <h2>my mad experiments</h2>
        <p>
          testing out new mediums, documenting trial + errors. some projects are
          somewhat failures and flops
        </p>
      </section>
      {/* same cards as the work + research pages */}
      <main className="project-list">
        {experiments.map((exp) => (
          <ProjectCard key={exp.title} project={exp} />
        ))}
      </main>
    </Page>
  );
}
