// each project in work.json gets its own page at /work/<slug>.
// the slug comes from the title ("computers.json" -> "computers-json"),
// unless the project sets its own "slug" in the json.
export function slugFor(project) {
  if (project.slug) return project.slug;
  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const projectPath = (project) => `/work/${slugFor(project)}`;

// where the home page was scrolled to when a project was opened, so the
// back button returns to the same spot in the list (Home.jsx reads it)
let savedListScroll = null;
export const saveListScroll = () => {
  savedListScroll = window.scrollY;
};
export const takeListScroll = () => {
  const y = savedListScroll;
  savedListScroll = null;
  return y;
};
