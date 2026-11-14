import { useEffect } from "react";
import Nav from "./Nav.jsx";
import DitherBackground from "./DitherBackground.jsx";
import PaperTexture from "./PaperTexture.jsx";
import Footer from "./Footer.jsx";
import asset from "../asset.js";

export default function Page({
  title,
  className,
  dither = false,
  cloud = false,
  paper = true,
  themeToggle = true,
  children,
}) {
  const showPaper = paper && !cloud && !dither;
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    // cloud pages also get blue text (see .cloud-page in styles.css)
    <div
      className={
        [className, cloud && "cloud-page"].filter(Boolean).join(" ") ||
        undefined
      }
    >
      {showPaper && <PaperTexture />}
      {dither && <DitherBackground />}
      {cloud && (
        <div
          className="cloud-bg"
          style={{ backgroundImage: `url(${asset("pixelcloud.png")})` }}
        />
      )}
      <Nav themeToggle={themeToggle} />
      {children}
      <Footer />
    </div>
  );
}
