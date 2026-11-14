import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import PopupWindow, { Media, altFor } from "./PopupWindow.jsx";

const asList = (value) => [].concat(value || []).filter(Boolean);

// a section is { <name>_text, <name>_media } (plain text also works)
function readSection(value, name) {
  if (!value) return { text: [], media: [] };
  if (typeof value === "string" || Array.isArray(value)) {
    return { text: asList(value), media: [] };
  }
  return {
    text: asList(value[`${name}_text`]),
    media: asList(value[`${name}_media`]),
  };
}

function fullUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// one clickable piece: hover scales it up with a shadow.
// group: the pieces the zoom arrows flip through (just this one if left out)
function Piece({ path, zoom, group = [path] }) {
  return (
    <section
      className="project-detail-piece"
      onClick={() => zoom(path, group)}
      aria-label={`zoom in: ${altFor(path)}`}
    >
      <Media path={path} />
    </section>
  );
}

// where the track has to scroll so slide i sits in its middle
function centerOf(track, i) {
  const slide = track.children[i];
  const trackBox = track.getBoundingClientRect();
  const slideBox = slide.getBoundingClientRect();
  return (
    track.scrollLeft +
    (slideBox.left - trackBox.left) -
    (trackBox.width - slideBox.width) / 2
  );
}

// whichever slide is closest to the middle of the track
function closestToMiddle(track) {
  const trackBox = track.getBoundingClientRect();
  const middle = trackBox.left + trackBox.width / 2;
  let best = 0;
  let bestDistance = Infinity;
  [...track.children].forEach((slide, i) => {
    const box = slide.getBoundingClientRect();
    const distance = Math.abs(box.left + box.width / 2 - middle);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
}

// a sideways-scrolling row of pieces with dots underneath. move it by
// swiping, the scroll wheel, the dots, or clicking either side.
// it loops: the pieces are drawn three times in a row and we stay in the
// middle copy. whenever the scroll stops in the first or last copy, it jumps
// (instantly, no animation) to the same piece in the middle copy.
function Carousel({ items, zoom, single = false }) {
  const trackRef = useRef(null);
  const settleTimer = useRef(null);
  const touching = useRef(false); // finger on the track (phones)
  const n = items.length;
  const [current, setCurrent] = useState(n); // first piece of the middle copy

  // jump without animating (no smooth scroll, no blur fade)
  const jumpTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    track.classList.add("is-jumping");
    flushSync(() => setCurrent(i));
    track.scrollTo({ left: centerOf(track, i), behavior: "instant" });
    void track.offsetWidth; // apply the styles before turning transitions back on
    requestAnimationFrame(() => track.classList.remove("is-jumping"));
  };

  // start with the first piece in the middle
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (n > 1 && track) {
      track.scrollTo({ left: centerOf(track, n), behavior: "instant" });
    }
    return () => clearTimeout(settleTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // scrolling in any direction (wheel up/down, trackpad up/down/sideways)
  // moves the carousel one piece at a time while you're hovering it (the
  // images, the side click areas or the dots), instead of scrolling the pop-up.
  // down or right = next, up or left = back.
  //
  // the slide animation is done by hand (requestAnimationFrame) with snapping
  // switched off while it runs. the browser's own smooth scroll got cancelled
  // and snapped back when the wheel was over the images (inside the track),
  // which is what made it feel stuck there.
  const carouselRef = useRef(null);
  useEffect(() => {
    const box = carouselRef.current;
    const track = trackRef.current;
    if (n < 2 || !box || !track) return;
    let lastStep = 0;
    let frame = null; // the running animation, if any
    let target = null; // the slide it's heading to

    const glideTo = (i) => {
      cancelAnimationFrame(frame);
      target = i;
      const from = track.scrollLeft;
      const to = centerOf(track, i);
      const start = performance.now();
      const duration = 350;
      track.classList.add("is-gliding"); // no snapping mid-glide
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        track.scrollLeft = from + (to - from) * eased;
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          frame = null;
          target = null;
          track.classList.remove("is-gliding");
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event) => {
      // whichever way the scroll mostly went
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (delta === 0) return;
      event.preventDefault(); // keep the pop-up (and the track) from scrolling too
      // one wheel flick fires lots of events: only step once per 300ms
      const now = Date.now();
      if (now - lastStep < 300) return;
      lastStep = now;
      // start from where it's heading (mid-glide) or where it is now
      let from = target ?? closestToMiddle(track);
      // drifted into the first/last copy? hop back to the middle copy first
      // so non-stop scrolling can't run off the end of the row
      if (from < n || from >= 2 * n) {
        cancelAnimationFrame(frame);
        track.classList.remove("is-gliding");
        from = (from % n) + n;
        jumpTo(from);
      }
      glideTo(from + (delta > 0 ? 1 : -1));
    };
    // passive: false is what lets preventDefault stop the page scroll
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      box.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (n === 0) return null;
  // one piece needs no carousel
  if (n === 1) {
    return (
      <div className="project-detail-single">
        <Piece path={items[0]} zoom={zoom} />
      </div>
    );
  }

  const slides = [...items, ...items, ...items];

  const goTo = (i) => {
    const track = trackRef.current;
    track.scrollTo({ left: centerOf(track, i), behavior: "smooth" });
  };

  // once scrolling stops, move back into the middle copy if needed
  const settle = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = closestToMiddle(track);
    if (i < n || i >= 2 * n) jumpTo((i % n) + n);
  };


  const onScroll = () => {
    setCurrent(closestToMiddle(trackRef.current));
    clearTimeout(settleTimer.current);
    // never jump while a finger is still dragging (a pause mid-swipe
    // would otherwise yank the row out from under it)
    if (!touching.current) settleTimer.current = setTimeout(settle, 150);
  };

  const onTouchStart = () => {
    touching.current = true;
    clearTimeout(settleTimer.current);
  };
  // after letting go, the row may still glide (momentum); onScroll restarts
  // the timer while it does, so the jump only happens once it really stops
  const onTouchEnd = () => {
    touching.current = false;
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 150);
  };

  return (
    <div
      className={single ? "carousel carousel-single" : "carousel"}
      ref={carouselRef}
    >
      <div className="carousel-row">
        {/* invisible click areas on each side: no arrow drawn, but clicking
            the left/right edge still moves the carousel */}
        <button
          className="carousel-side"
          aria-label="previous"
          onClick={() => goTo(current - 1)}
        />
        <div
          className="carousel-track"
          ref={trackRef}
          onScroll={onScroll}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          {slides.map((path, i) => (
            <div
              className={
                i === current ? "carousel-slide is-current" : "carousel-slide"
              }
              key={`${i}-${path}`}
            >
              <Piece path={path} zoom={zoom} group={items} />
            </div>
          ))}
        </div>
        <button
          className="carousel-side"
          aria-label="next"
          onClick={() => goTo(current + 1)}
        />
      </div>
      <div className="carousel-dots">
        {items.map((path, i) => (
          <button
            key={path}
            className={
              i === current % n ? "carousel-dot is-active" : "carousel-dot"
            }
            aria-label={`go to piece ${i + 1}`}
            onClick={() => goTo(current - (current % n) + i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetail({ project, onClose }) {
  const tools = asList(project.tools);
  const link = project.links;
  const description = asList(project.description);

  const context = readSection(project.context, "context");
  const process = readSection(project.process, "process");
  const reflection = readSection(project.reflection, "reflection");
  const has = (s) => s.text.length > 0 || s.media.length > 0;

  const paragraphs = (list) => list.map((text) => <p key={text}>{text}</p>);

  return (
    <PopupWindow
      onClose={onClose}
      className="project-detail-window"
    >
      {(zoom) => (
        <div className="project-detail">
          <div className="project-detail-scroll">
            {/* main media, full width on top */}
            {project.media && (
              <div className="project-detail-media">
                <Piece path={project.media} zoom={zoom} />
              </div>
            )}
            {/* row 1 (under the media): title | timeline | tools.
             */}
            <header className="project-detail-header">
              <div className="project-detail-box">
                <span className="project-detail-label">title</span>
                <h2>{project.title}</h2>
                {link && (
                  <a
                    className="project-detail-link"
                    href={fullUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    visit the project ↗
                  </a>
                )}
              </div>
              <div className="project-detail-box">
                <span className="project-detail-label">timeline</span>
                <p>{project.timeline || "—"}</p>
              </div>
              <div className="project-detail-box">
                <span className="project-detail-label">tools</span>
                {tools.length > 0 ? (
                  <ul className="tags">
                    {tools.map((tool) => (
                      <li className="tag" key={tool}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>—</p>
                )}
              </div>
            </header>

            {/* row 2: main media | description + tools + link */}
            <div className="project-detail-row">
              <div className="project-detail-box project-detail-words">
                <h3>description</h3>
                {paragraphs(description)}
              </div>
            </div>

            {/* row 3: context text | context media */}
            {has(context) && (
              <section className="project-detail-row project-detail-section">
                <div className="project-detail-box project-detail-words">
                  <h3>context</h3>
                  {paragraphs(context.text)}
                </div>
                {context.media.length > 0 && (
                  <div className="project-detail-media">
                    <Carousel items={context.media} zoom={zoom} single />
                  </div>
                )}
              </section>
            )}

            {/* process + reflection: text on top, carousel underneath */}
            {[
              ["process", process],
              ["reflection", reflection],
            ].map(
              ([name, s]) =>
                has(s) && (
                  <section
                    key={name}
                    className="project-detail-section project-detail-stack"
                  >
                    {s.text.length > 0 && (
                      <div className="project-detail-box">
                        <h3>{name}</h3>
                        <div className="project-detail-columns">
                          {paragraphs(s.text)}
                        </div>
                      </div>
                    )}
                    {!s.text.length && <h3>{name}</h3>}
                    <Carousel items={s.media} zoom={zoom} />
                  </section>
                ),
            )}
          </div>
        </div>
      )}
    </PopupWindow>
  );
}
