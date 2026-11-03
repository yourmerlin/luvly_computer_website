import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import experiments from "../data/experiments.json";

export default function Experiments() {
  return (
    <Page title="experiments" cloud>
      <section className="work-header">
        <h2>my mad experiments</h2>
        <p>
          testing out new technical mediums, documenting trial + errors. some
          projects are somewhat failures and flops
        </p>
      </section>
      {/* same cards as the work + research pages */}
      {/*
        experimental capture gallery notes (from the old experimental-capture page):
        use a 4 x 3 grid to display images of scanner
        also have another grid of flops
        use a 3x1 grid to display images of uv + scanner
        talk abt how u couldnt find the exporting process but luckily you had a portable scanner for that
        have a 3x1 grid to display images of security camera
        talk about how getting it to work was easy but you wanted to see if you can run your own scripts to the security cameras output using computer vision. kind of like an anti facial capture. yes, conceptually tame, it was a test for future projects
        have a grid of images of the themocratic paint

        notes:

        maybe i film a
      */}
      <main className="project-list">
        {experiments.map((exp) => (
          <ProjectCard key={exp.title} project={exp} />
        ))}
      </main>
    </Page>
  );
}
