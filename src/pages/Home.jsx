// import { Link } from "react-router";
// import Page from "../components/Page.jsx";

import { useState } from "react";
import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import AsciiProfile from "../components/AsciiProfile.jsx";
import projects from "../data/work.json";

const TABS = ["all", "artsy", "techy", "design"];

export default function Home() {
  const [tab, setTab] = useState("all");
  const visible = projects.filter(
    (project) => tab === "all" || project.categories.includes(tab),
  );

  return (
    <Page title="Merlin Enriquez">
      <section className="work-intro">
        <AsciiProfile />
        <div className="work-intro-text">
          <h2>C:\Merlin\Enriquez</h2>
          <h4>
            {">"}is a creative technologist / front-end developer<br></br>/ ux
            designer / hci researcher / STEM educator
            <br></br>
            <br></br>
            {">"}building technology that holds you with care_
          </h4>
          <p>
            {">"} double major in human computer interaction & new media arts @
            Carnegie Mellon University
          </p>
        </div>
      </section>

      <main className="project-list">
        {visible.map((project) => (
          <ProjectCard key={project.title} project={project} detailed />
        ))}
      </main>
    </Page>
  );
}
