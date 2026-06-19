import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrambleTitle from "./components/ScrambleTitle";
import AboutSection from "./components/AboutSection";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  const location = useLocation();
  const [titleDone, setTitleDone] = useState(false);
  const onTitleComplete = useCallback(() => setTitleDone(true), []);
  const modelViewerRef = useRef<any>(null);
  const [loadModel, setLoadModel] = useState(false);

  // Delay ISS 3D model loading by 1.2s to prioritize page render and responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadModel(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to About section if hash present (desktop only)
  useEffect(() => {
    if (location.hash === "#next") {
      const tryScroll = (attempt: number) => {
        const el = document.getElementById("next");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 150);
        }
      };
      tryScroll(0);
    }
  }, [location.hash]);

  const ctaHref = "#next";

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <section className="section section-hero">
        <div className="hero-content">
          <ScrambleTitle onComplete={onTitleComplete} />
          <a href={ctaHref} className={`hero-cta ${titleDone ? "arrow-visible" : "arrow-hidden"}`}>
            <span className="cta-arrow">↓</span>
            <span className="cta-arrow">↓</span>
            <span className="cta-arrow">↓</span>
          </a>
        </div>

          <div className="hero-iss-container">
            {loadModel && (
              /* @ts-ignore */
              <model-viewer
                ref={(el: any) => {
                  modelViewerRef.current = el;
                  if (el) {
                    el.addEventListener("load", () => {
                      el.style.opacity = "1";
                    });
                  }
                }}
                src="https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/i/ISS_stationary.glb"
                alt="International Space Station 3D Model"
                camera-controls
                interaction-prompt="none"
                camera-orbit="-112.3deg 127.8deg 1200m"
                camera-target="7.88m 11.16m 15.52m"
                field-of-view="8deg"
                min-camera-orbit="-180deg 0deg 800m"
                max-camera-orbit="180deg 180deg 2000m"
                max-field-of-view="10deg"
                style={{ width: "100%", height: "100%", opacity: 0, transition: "opacity 1s ease" }}
              />
            )}
          </div>
        {/* Invisible overlay: scroll here = page scroll, not model zoom */}
        <div className="hero-scroll-zone" />
      </section>

      <AboutSection />

      <SiteFooter />
    </main>
  );
}
