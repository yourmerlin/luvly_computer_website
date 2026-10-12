import { Fragment } from "react";
import Page from "../components/Page.jsx";
import asset from "../asset.js";

const LINKS = [
  { label: "linkedin", href: "https://www.linkedin.com/in/senrique/" },
  { label: "resume", href: asset("enriquezMerlin_Resume.pdf") },
  { label: "instagram", href: "https://www.instagram.com/luvlycomputer/" },
  { label: "substack", href: "https://substack.com/@iluvmycomputer" },
];

const CV = [
  {
    heading: "showcases/galleries",
    items: [
      "Fidget Camp Showcase @ Pebblebed | SF, CA | 2026",
      "Dematerialize @ Studio of Creative Inquiry | Pittsburgh, PA | 2025",
      "Disconnected Lovers @ Frame Gallery | Pittsburgh, PA | 2024",
      "Disconnected Lovers @ Wick Monet | Pittsburgh, PA | 2024",
    ],
  },
  {
    heading: "awards/honors",
    items: [
      "Samuel Rosenberg Junior Award, Issued by Carnegie Mellon School of Art. 2026.",
      "Honorable Mention: Henry Armero Memorial Award for Inclusive Creativity, Issued by BXA Intercollege Degree Program. 2026.",
      "Frank Ratchye Further Fund Recipient, Issued by The Frank Ratchye Studio. 2025",
      "Dean's List, Issued by Carnegie Mellon University. 2023 + 2024.",
    ],
  },
  {
    heading: "talks/workshops",
    items: [
      "Soft circuit wizard hat & nfc wands workshop @ haute glue | Pittsburgh, PA | 2026",
      "Soft circuit crown workshop @ the made | Oakland, CA | 2026",
      "Batik, tub-dying & dye painting workshop @ fidget camp | SF, CA | 2026",
      "Introduction to Laser-cutting @ cmu pre-college | Pittsburgh, PA | 2025",
    ],
  },
  {
    heading: "publications",
    items: [
      "dreamscape @ lemon publication | Pittsburgh, PA | 2026",
      "First-Gen guide to dealing with Guilt @ Carnegie Library (Permanent Collection) | Pittsburgh, PA | 2024",
    ],
  },
];

export default function About() {
  return (
    <Page title="about" className="about-page">
      <main className="about-main">
        <section className="about-headshot">
          <section>
            <img
              src={asset("sillyheadshot2026.webp")}
              alt="headshot of merlin with stickers surrounding the images"
              width="500"
              height="500"
            />
          </section>
        </section>
        <section className="about-bio">
          <h2>Merlin Susana Enriquez</h2>
          <br />
          <p>creative tech + hci + design @ carnegie mellon university</p>
          <br />
          <p>
            I am a creative technologist, researcher, and educator working at the
            intersection of art, textiles, and technology. My research focuses on
            soft electronics, holding people's data with care, and creating
            open-source programs that build pathways into STEAM (science,
            technology, engineering, art, and mathematics). Right now, I'm sewing
            circuits onto fabric, using 3D printers to create intricate batik
            patterns, and disguising technology within fashion pieces ୭˚. ᵎᵎ
          </p>
          <br />
          <p>
            My conceptual practice focuses on missing or absent data, misusing
            surveillance technology, and creating playful websites. Some of my
            work is rooted in activism, and some of it is just about making
            technology feel silly, playful, and unserious. I wholeheartedly
            believe play is a form of resistance. There has to be a balance
            between enjoying life and combating the systems that restrict that
            enjoyment!
          </p>
          <br />
          <p>
            Outside of my research and practice, I am a lifestyle lolita. Wearing
            lolita isn't just a fashion statement but a political one, too. It
            disrupts environments that force you to conform. Lolita is my armour
            (..◜ᴗ◝..)!
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
      <aside>
        {CV.map((section) => (
          <Fragment key={section.heading}>
            <h2>{section.heading}</h2>
            <ul>
              {section.items.map((item, i) => (
                <Fragment key={item}>
                  {i > 0 && <br />}
                  <li>⤿ {item}</li>
                </Fragment>
              ))}
            </ul>
          </Fragment>
        ))}
      </aside>
    </Page>
  );
}
