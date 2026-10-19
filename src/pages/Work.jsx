import { useState } from "react";
import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import projects from "../data/work.json";

const TABS = ["all", "artsy", "techy", "design"];

export default function Work() {
  const [tab, setTab] = useState("all");
  const visible = projects.filter(
    (project) => tab === "all" || project.categories.includes(tab)
  );

  return (
    <Page title="work">
      <section className="work-header">
        <h2>selected projects</h2>
        <p>
          web dev, design, creative code, digital fabrication, fashion design, n
          more!
        </p>
        <ul className="work-tabs">
          {TABS.map((name) => (
            <li key={name}>
              <button
                className={tab === name ? "is-active" : undefined}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {/* one column of wide, short cards (same as the research page) */}
      <main className="project-list">
        {visible.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </main>
    </Page>
  );
}
