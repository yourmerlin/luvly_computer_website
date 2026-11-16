import { useLayoutEffect, useState } from "react";
import { useNavigationType } from "react-router";
import { takeListScroll } from "../projectPath.js";
import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import AsciiProfile from "../components/AsciiProfile.jsx";
import TypeText from "../components/TypeText.jsx";
import projects from "../data/work.json";

const TABS = ["all", "artsy", "techy", "design"];

export default function Home() {
  const [tab, setTab] = useState("all");

  // coming back from a project page: return to the same spot in the list
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    const y = takeListScroll();
    if (navigationType === "POP" && y !== null) window.scrollTo(0, y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            <TypeText
              text={
                "> is a [creative technologist]<br />,[design engineer],[frontend developer],[hci researcher],[STEM educator]"
              }
            />
            <br></br>
            <br></br>
            <TypeText text="> building technology that holds you with care" />
          </h4>
        </div>
      </section>
      <section className="scroll-hello">
        <h2>explore my ("hello world")</h2>
        <h3>🡣</h3>
      </section>

      <main className="project-list">
        {visible.map((project) => (
          <ProjectCard key={project.title} project={project} detailed />
        ))}
      </main>
    </Page>
  );
}
