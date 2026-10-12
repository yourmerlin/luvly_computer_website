import { useState } from "react";
import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import projects from "../data/work.json";

const TABS = ["all", "artsy", "techy", "design"];

export default function Work() {
  const [tab, setTab] = useState("all");

  return (
    <Page title="work" dither>
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
      <main className="work-main">
        <section className="work-content">
          {/* cyber autonomy front-end devleoper */}
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              hidden={tab !== "all" && !project.categories.includes(tab)}
            />
          ))}
        </section>
      </main>
    </Page>
  );
}
