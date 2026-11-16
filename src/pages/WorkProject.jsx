import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams, useLocation } from "react-router";
import Page from "../components/Page.jsx";
import ProjectDetail from "../components/ProjectDetail.jsx";
import projects from "../data/work.json";
import { slugFor } from "../projectPath.js";

// one project's page: /work/<slug> (see projectPath.js)
export default function WorkProject() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const project = projects.find((p) => slugFor(p) === slug);

  // a new project always opens at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  // came here from the home page? going back returns to the same spot in
  // the list. opened straight from a link? there's no "back", so go home.
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
        <Link className="project-page-back" to="/" onClick={goBack}>
          ← back to work
        </Link>
        <ProjectDetail key={slug} project={project} />
      </main>
    </Page>
  );
}
