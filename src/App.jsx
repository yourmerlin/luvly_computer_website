import { Routes, Route, Navigate, useLocation } from "react-router";
import { ThemeProvider } from "./theme.jsx";
import Cursor from "./components/Cursor.jsx";
import CursorTrail from "./components/CursorTrail.jsx";
import PixelRipple from "./components/PixelRipple.jsx";
import Home from "./pages/Home.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import work from "./data/work.json";
import research from "./data/research.json";
import Research from "./pages/Research.jsx";
import About from "./pages/About.jsx";
import Play from "./pages/Play.jsx";
import Dreams from "./pages/Dreams.jsx";
import Blogs from "./pages/Blogs.jsx";
import Resources from "./pages/Resources.jsx";

// old links like /work.html or /home.html still go to the right page
function OldLinks() {
  const { pathname } = useLocation();
  if (pathname.endsWith(".html")) {
    const page = pathname.slice(0, -".html".length);
    return <Navigate to={page === "/home" ? "/" : page} replace />;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* each project's own page (cards on the list pages link here) */}
        <Route
          path="/work/:slug"
          element={
            <ProjectPage projects={work} backTo="/" backLabel="back to work" />
          }
        />
        <Route
          path="/research/:slug"
          element={
            <ProjectPage
              projects={research}
              backTo="/research"
              backLabel="back to research"
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<Research />} />
        <Route path="/play" element={<Play />} />
        <Route path="/dreams" element={<Dreams />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<OldLinks />} />
      </Routes>
      <PixelRipple />
      <CursorTrail />
      <Cursor />
    </ThemeProvider>
  );
}
