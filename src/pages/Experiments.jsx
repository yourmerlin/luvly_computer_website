import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import experiments from "../data/experiments.json";

// laid out like the home page: paper bg, left-aligned intro, then the cards
export default function Experiments() {
  return (
    <Page title="experiments">
      <section className="work-intro">
        <div className="work-intro-text">
          <h2>my mad experiments</h2>
          <p>
            {">"} testing out new technical mediums, documenting trials +
            errors. some projects are kinda failures and flops
          </p>
        </div>
      </section>

      <main className="project-list">
        {experiments.map((exp) => (
          <ProjectCard key={exp.title} project={exp} />
        ))}
      </main>
    </Page>
  );
}
