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
      <main className="work-main">
        <section className="work-content">
          {/* cyber autonomy front-end devleoper */}
          {/* two stacked columns so each card hugs its content (left, right, left, right...) */}
          {[0, 1].map((col) => (
            <div className="work-column" key={col}>
              {visible.map((project, i) =>
                i % 2 === col ? (
                  <ProjectCard key={project.title} project={project} order={i} />
                ) : null
              )}
            </div>
          ))}
        </section>
      </main>
    </Page>
  );
}
