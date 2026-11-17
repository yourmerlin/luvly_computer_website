import { useLayoutEffect } from "react";
import { useNavigationType } from "react-router";

// each project gets its own page at <base>/<slug>: work.json projects live
// under /work, experiments.json under /experiments (see App.jsx).
// the slug comes from the title ("computers.json" -> "computers-json"),
// unless the project sets its own "slug" in the json.
export function slugFor(project) {
  if (project.slug) return project.slug;
  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const projectPath = (project, base = "/work") =>
  `${base}/${slugFor(project)}`;

// where a list page was scrolled to when a project was opened, so the
// back button returns to the same spot in the list
let savedListScroll = null;
export const saveListScroll = () => {
  savedListScroll = window.scrollY;
};

// call on a list page (Home, Experiments): coming back from a project page
// jumps to where the list was
export function useRestoreListScroll() {
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    const y = savedListScroll;
    savedListScroll = null;
    if (navigationType === "POP" && y !== null) window.scrollTo(0, y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
