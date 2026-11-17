import { Fragment, useState } from "react";
import { Link } from "react-router";
import Page from "../components/Page.jsx";
import AsciiProfile from "../components/AsciiProfile.jsx";
import asset from "../asset.js";

const LINKS = [
  {
    label: "senrique[@]andrew[dot]cmu[dot]edu",
    href: "mailto:senrique@andrew.cmu.edu",
  },
  { label: "linkedin", href: "https://www.linkedin.com/in/senrique/" },
  {
    label: "resume",
    href: asset("enriquez_merlin_RESUME.pdf"),
  },
  { label: "github", href: "https://github.com/yourmerlin" },
  { label: "instagram", href: "https://www.instagram.com/luvlycomputer/" },
  { label: "substack", href: "https://substack.com/@iluvmycomputer" },
];

const CV = [
  {
    heading: "talks/workshops",
    items: [
      "E-waste Jewelry Workshop (intro to soldering) @ Haute Glue | Pittsburgh, PA | 2026",
      "Soft Circuit Wizard Hat & NFC Wands Workshop @ Haute Glue | Pittsburgh, PA | 2026",
      "Soft Circuit Crown Workshop @ The Made | Oakland, CA | 2026",
      "Batik, Tub-Dyeing & Dye Painting Workshop @ Fidget Camp | SF, CA | 2026",
      "Introduction to Laser Cutting @ CMU Pre-College | Pittsburgh, PA | 2025",
    ],
  },
  {
    heading: "awards/honors",
    items: [
      "Frank Ratchye Further Fund Research Grant ($1,600), issued by The Studio for Creative Inquiry. 2026.",
      "Samuel Rosenberg Junior Award ($1,000), issued by Carnegie Mellon School of Art. 2026.",
      "Honorable Mention: Henry Armero Memorial Award for Inclusive Creativity ($500), issued by the BXA Intercollege Degree Program. 2026.",
      "Frank Ratchye Further Fund Recipient ($500), issued by The Studio for Creative Inquiry. 2025.",
      "Dean's List, issued by Carnegie Mellon University. 2023 + 2024.",
    ],
  },
  {
    heading: "showcases/galleries",
    items: [
      "Fidget Camp Showcase @ Pebblebed | SF, CA | 2026",
      "Dematerialize @ The Studio for Creative Inquiry | Pittsburgh, PA | 2025",
      "Disconnected Lovers @ Frame Gallery | Pittsburgh, PA | 2024",
      "Disconnected Lovers @ Wick Monet | Pittsburgh, PA | 2024",
    ],
  },
  {
    heading: "publications",
    items: [
      "Dreamscape @ Lemon Publication | Pittsburgh, PA | 2026",
      "First-Gen Guide to Dealing with Guilt @ Carnegie Library (Permanent Collection) | Pittsburgh, PA | 2024",
    ],
  },
];

export default function About() {
  const [ascii, setAscii] = useState(false); // showing the 0s-and-1s version?
  const [asciiLoaded, setAsciiLoaded] = useState(false);

  return (
    <Page title="about" className="about-page">
      <main className="about-main">
        <section className="about-headshot">
          {/* click the photo to cross-fade into the 0s-and-1s version (and back).
              the ascii one only mounts once someone hovers/focuses/clicks,
              so it costs nothing for people who never interact */}
          <button
            className={ascii ? "headshot-toggle is-ascii" : "headshot-toggle"}
            onPointerEnter={() => setAsciiLoaded(true)}
            onFocus={() => setAsciiLoaded(true)}
            onClick={() => {
              if (asciiLoaded) {
                setAscii((on) => !on);
                return;
              }
              // first time (e.g. a tap with no hover): mount it hidden, then
              // flip a couple of frames later so the fade actually plays
              setAsciiLoaded(true);
              requestAnimationFrame(() =>
                requestAnimationFrame(() => setAscii(true)),
              );
            }}
            aria-pressed={ascii}
            // the label replaces the img alt for screen readers, so it says both
            // what the picture is and what pressing does
            aria-label={
              ascii
                ? "portrait of merlin in a wizard hat drawn in 0s and 1s. press to show the photo"
                : "merlin smiling in a blue velvet wizard hat and cape. press to show it drawn in 0s and 1s"
            }
          >
            <img
              className="headshot-photo"
              src={asset("me_wizard_profile.jpg")}
              alt="merlin smiling in a blue velvet wizard hat and cape covered in gold stars and moons, with a pearl necklace"
              width="800"
              height="800"
            />
            {asciiLoaded && (
              <span className="headshot-ascii" aria-hidden={!ascii}>
                <AsciiProfile active={ascii} />
              </span>
            )}
            {/* hover pop-up (screen readers already get this from aria-label) */}
            <span className="headshot-hint" aria-hidden="true">
              {ascii ? "see the real me!" : "see me in binary code!"}
            </span>
          </button>
          <br />
          <br />
          <p>b.2004 based in california🡥</p>
        </section>
        <section className="about-bio">
          <h2>Merlin S. Enriquez</h2>
          <br />
          <h4>
            [ new media arts && human computer interaction,
            <br />+ minor in design @ carnegie mellon university ]
          </h4>
          <br />
          <p>
            I am a [creative technologist], [researcher], and [educator] working
            at the intersection of art && technology. I’m currently interested
            in researching algorithmic textiles, web interactivity using WebGL
            && computer graphics, and creating an open-source curriculum for
            learning creative technology.
          </p>
          <br />
          <p>
            My background in media arts, human-computer interaction, and design
            allows me to develop systems that consider humans in every aspect of
            using and building technology. I want technology and computing to
            feel like a playground, one that puts people first. Through my
            experimental software and design projects, my goal is to balance
            play, software optimization, and accessibility.
          </p>
          <br />
          <p>
            In my free time, I run a wearable art show called{" "}
            <a
              href="https://www.instagram.com/haute.glue.pgh?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              Haute Glue🡥
            </a>
            , where
            I teach free, open-source workshops in fashion and{" "}
            <Link to="/research/turning-play-into-neuroplasticity">
              wearable technology🡥
            </Link>{" "}
            (e-textiles). I was a{" "}
            <a
              href="https://www.springcarnival.org/booth.shtml"
              target="_blank"
              rel="noopener noreferrer"
            >
              Booth🡥
            </a>{" "}
            chair for two years, where
            we built a temporary interactive house in our school’s parking lot.
            I’m always finding ways to get involved in my community and give
            back :-)
          </p>
          <br />

          {/* <p>&gt; always open to chat ❤</p> */}
          <ul>
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>🡥 {link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Page>
  );
}
