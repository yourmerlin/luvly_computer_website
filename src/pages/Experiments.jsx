import { Link } from "react-router";
import Page from "../components/Page.jsx";

const EXPERIMENTS = [
  {
    title: "please verify your identity",
    note: "learn how bytes worked and able to create my own program to delete/rearrange bytes in a image",
  },
  {
    title: "overconsumed",
    note: "able to connect arduino connection (sensor) to p5js",
  },
  {
    title: "pieces of you",
    note: "learned how to write SQL + basic database structure",
  },
  {
    title: "notes around the web",
    note: "learned how to make my own chrome extension!",
  },
  {
    title: "recorder of feelings",
    note: "learned how to have p5js input to export to an thermal printer (via arduino)",
  },
];

export default function Experiments() {
  return (
    <Page title="experiments" dither>
      <section className="experiments-header">
        <h2>my mad experiments</h2>
        <p>
          testing out new mediums, documenting trial + errors. some projects are
          somewhat failures and flops
        </p>
      </section>
      <main className="experiments-main">
        <section className="experiments-content">
          <article>
            <h3>experimental capture studies</h3>
            <p>a collection of all the studies i did for experimental capture</p>
            <Link to="/experimental-capture">check out the process -&gt;</Link>
          </article>
          {EXPERIMENTS.map((exp) => (
            <article key={exp.title}>
              <h3>{exp.title}</h3>
              <p>{exp.note}</p>
            </article>
          ))}
        </section>
      </main>
    </Page>
  );
}
