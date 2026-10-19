import { Link } from "react-router";
import Page from "../components/Page.jsx";
import Footer from "../components/Footer.jsx";

const STARS =
  "┆　┆　┆　┆　┆\n┆　┆  ࣪ ˖☆ ࣪⭑┆ ݁˖ .☆ . ݁ ˖ \n☆⊹ ࣪ ┆ ˖ ࣪　⊹ ࣪ ★ ⋆.˚  ⊹ ࣪\n   ࣪ ˖⋆˚★ ₊ ⊹　  ࣪˖ ࣪ ₊  ࣪ ˖　\n. ݁　⊹ ࣪ ˖　　　 ࣪ ˖\n　　.  ݁　　　  ݁\n　　. \n";

// the computer drawing (split around the link to dreams)
const COMPUTER_TOP =
  "             ________________________________________________\n            /                                                \\\n           |    _________________________________________     |\n           |   |                                         |    |\n           |   |  C:\\> welcome to my dreams...           |    |\n           |   |                                         |    |\n           |   |         ";
const COMPUTER_BOTTOM =
  "          |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |                                         |    |\n           |   |   > studying  new media art &           |    |\n           |   |             human computer interaction  |    |\n           |   |_________________________________________|    |\n           |                                                  |\n            \\_________________________________________________/\n                   \\___________________________________/\n                ___________________________________________\n             _-'    .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  --- `-_\n          _-'.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.  .-.-.`-_\n       _-'.-.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-`__`. .-.-.-.`-_\n    _-'.-.-.-.-. .-----.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-----. .-.-.-.-.`-_\n _-'.-.-.-.-.-. .---.-. .-------------------------. .-.---. .---.-.-.-.`-_\n:-------------------------------------------------------------------------:\n`---._.-------------------------------------------------------------._.---'\n\n";

export default function Home() {
  return (
    <Page title="luvlycomputer">
      <main className="home-main">
        <section className="stars-border">
          {[1, 2, 3, 4, 5].map((n) => (
            <pre key={n}>{STARS}</pre>
          ))}
        </section>
        <section className="home-content">
          <pre>
            {COMPUTER_TOP}
            <Link
              to="/dreams"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {"    click to see more_"}
            </Link>
            {COMPUTER_BOTTOM}
          </pre>
        </section>
      </main>
      <Footer />
    </Page>
  );
}
