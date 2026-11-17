import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams, useLocation } from "react-router";
import Page from "../components/Page.jsx";
import ProjectDetail from "../components/ProjectDetail.jsx";
import { slugFor } from "../projectPath.js";

// one project's own page, e.g. /work/<slug> or /experiments/<slug>
// (routes in App.jsx). projects: the json list to look the slug up in.
// backTo / backLabel: the list page the "back" link returns to.
export default function ProjectPage({ projects, backTo, backLabel }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const project = projects.find((p) => slugFor(p) === slug);

  // a new project always opens at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to={backTo} replace />;

  // came here from the list? going back returns to the same spot in it.
  // opened straight from a link? there's no "back", so go to the list.
  const cameFromSite = location.key !== "default";
  const goBack = (event) => {
    if (cameFromSite) {
      event.preventDefault();
      navigate(-1);
    }
  };

  return (
    <Page title={`${project.title} · Merlin Enriquez`}>
      <main className="project-page-wrap">
        <Link className="project-page-back" to={backTo} onClick={goBack}>
          ← {backLabel}
        </Link>
        <ProjectDetail key={slug} project={project} />
      </main>
    </Page>
  );
}
