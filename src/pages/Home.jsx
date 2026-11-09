// import { Link } from "react-router";
// import Page from "../components/Page.jsx";

import { useState } from "react";
import Page from "../components/Page.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import projects from "../data/work.json";

// const STARS =
//   "┆　┆　┆　┆　┆\n┆　┆  ࣪ ˖☆ ࣪⭑┆ ݁˖ .☆ . ݁ ˖ \n☆⊹ ࣪ ┆ ˖ ࣪　⊹ ࣪ ★ ⋆.˚  ⊹ ࣪\n   ࣪ ˖⋆˚★ ₊ ⊹　  ࣪˖ ࣪ ₊  ࣪ ˖　\n. ݁　⊹ ࣪ ˖　　　 ࣪ ˖\n　　.  ݁　　　  ݁\n　　. \n";

// the computer drawing (split around the link to dreams)
// const COMPUTER_TOP =
//   "             ________________________________________________\n            /                                                \\\n           |    _________________________________________     |\n           |   |                                         |    |\n           |   |  C:\\> welcome to my dreams...           |    |\n           |   |                                         |    |\n           |   |         ";
// const COMPUTER_BOTTOM =
//   "          |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |   > studying  new media art &           |    |\n           |   |             human computer interaction  |    |\n           |   |_________________________________________|    |\n           |                                                  |\n            \\_________________________________________________/\n                   \\___________________________________/\n                ___________________________________________\n             _-'    .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  --- `-_\n          _-'.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.  .-.-.`-_\n       _-'.-.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-`__`. .-.-.-.`-_\n    _-'.-.-.-.-. .-----.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-----. .-.-.-.-.`-_\n _-'.-.-.-.-.-. .---.-. .-------------------------. .-.---. .---.-.-.-.`-_\n:-------------------------------------------------------------------------:\n`---._.-------------------------------------------------------------._.---'\n\n";

// export default function Home() {
//   return (
//     <Page title="luvlycomputer">
//       <main className="home-main">
//         <section className="stars-border">
//           {[1, 2, 3, 4, 5].map((n) => (
//             <pre key={n}>{STARS}</pre>
//           ))}
//         </section>
//         <section className="home-content">
//           <pre>
//             {COMPUTER_TOP}
//             <Link
//               to="/dreams"
//               style={{ color: "inherit", textDecoration: "none" }}
//             >
//               {"    click to see more_"}
//             </Link>
//             {COMPUTER_BOTTOM}
//           </pre>
//         </section>
//       </main>
//     </Page>
//   );
// }

const TABS = ["all", "artsy", "techy", "design"];

export default function Home() {
  const [tab, setTab] = useState("all");
  const visible = projects.filter(
    (project) => tab === "all" || project.categories.includes(tab),
  );

  return (
    <Page title="work">
      <section className="work-header">
        <h2> Hey! I am Merlin Enriquez :-)</h2>
        <p>
          I am a creative technologist / designer/ web developer / researcher/
          educator / n more!
        </p>
        <h3>selected projects</h3>
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
