import { Fragment } from "react";
import Page from "../components/Page.jsx";
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
      "Frank Ratchye Further Fund Research Grant($1,600), issued by The Studio for Creative Inquiry. 2026.",
      "Samuel Rosenberg Junior Award($1,000), issued by Carnegie Mellon School of Art. 2026.",
      "Honorable Mention: Henry Armero Memorial Award for Inclusive Creativity($500), issued by the BXA Intercollege Degree Program. 2026.",
      "Frank Ratchye Further Fund Recipient($500), issued by The Studio for Creative Inquiry. 2025.",
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
  return (
    <Page title="about" className="about-page">
      <main className="about-main">
        <section className="about-headshot">
          <section>
            <img
              src={asset("sillyheadshot2026.webp")}
              alt="headshot of merlin with stickers surrounding the image"
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
            I am a creative technologist, researcher, and educator working at
            the intersection of art, textiles, and technology. My research
            focuses on soft electronics, holding people's data with care, and
            creating open-source programs that build pathways into STEAM. Right
            now, I'm sewing circuits onto fabric, using 3D printers to create
            intricate batik patterns, and disguising technology within fashion
            pieces ୭˚. ᵎᵎ
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
            I am always involved in my community, whether by organizing a
            wearable art and fashion show called Haute Glue, building a
            temporary interactive house on campus for Booth, or writing for a
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

          <section className="about-cv">
            <h2>CV</h2>
            {/* each heading opens/closes its list when clicked */}
            {CV.map((section) => (
              <details key={section.heading}>
                <summary>
                  <h3>{section.heading}</h3>
                </summary>
                <ul>
                  {section.items.map((item, i) => (
                    <Fragment key={item}>
                      {i > 0 && <br />}
                      <li>⤿ {item}</li>
                    </Fragment>
                  ))}
                </ul>
              </details>
            ))}
          </section>
        </section>
      </main>
    </Page>
  );
}
