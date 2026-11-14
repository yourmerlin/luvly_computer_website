import { Fragment, useState } from "react";
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
        </section>
        <section className="about-bio">
          <h2>Merlin S. Enriquez</h2>
          <br />
          <h3>new media arts + hci + design @ carnegie mellon university</h3>
          <br />
          <p>
            I am a [creative technologist], [researcher], and [educator] working
            at the intersection of art && technology. My research focuses on
            e-textiles & wearables, and creating open-source programs that build
            pathways into STEAM.
          </p>
          <br />
          <p>
            My conceptual practice focuses on misusing surveillance technology,
            and making computing playful. Some of my work is rooted in activism,
            and some of it is just about making technology feel silly, playful,
            and unserious. I wholeheartedly believe play is a form of
            resistance. There has to be a balance between enjoying life and
            combating the systems that restrict that enjoyment.
          </p>
          <br />
          <p>
            I am always involved in my community, whether by organizing a
            wearable art and fashion show called Haute Glue, building a
            temporary interactive house on campus for Booth, or being part of a
            satirical newspaper.
          </p>
          <br />
          <br />
          <p>&gt; always open to chat ❤</p>
          <br />

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
