import { useEffect, useRef, useState, useCallback } from "react";
import ApodPanel from "./ApodPanel";


const PARAS = [
  `Dhruva is the Astrophysics and Astronomy Club at RV College of Engineering — an interdisciplinary team working towards understanding our universe better. What began as a quest to explore the secrets of the universe is now a growing team of passionate astrophysics enthusiasts. Like Dhruva, the pole star, we constantly try to keep up with the happenings of the universe through our telescopes, radio telescopes and analysis.`,
  `We host stargazing events, astrophysics-related coding competitions and engage in impactful discussions on the latest observations made by the astrophysics community across the globe. We also believe in sharing our understanding through informative videos, blogs and journals.`,
  `We have also delved into astrophotography to capture the marvelous pictures of the universe. We collaborate with ABBA and other student astrophysics clubs for interactive sessions and better outreach.`,
];

export default function AboutSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Trigger TextDecode animation on scroll-into-view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const updateLayout = useCallback(() => {
    const container = headlineRef.current;
    if (!container) return;

    const p = container.querySelector("p");
    if (p) {
      const availableWidth = container.getBoundingClientRect().width;
      
      const measureContainer = document.createElement("div");
      measureContainer.style.fontFamily = getComputedStyle(p).fontFamily || "'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, sans-serif";
      measureContainer.style.fontWeight = getComputedStyle(p).fontWeight || "800";
      measureContainer.style.letterSpacing = "-0.04em";
      measureContainer.style.fontSize = "100px";
      measureContainer.style.position = "absolute";
      measureContainer.style.visibility = "hidden";
      measureContainer.style.whiteSpace = "nowrap";

      const text = "Astrophysics and Astronomy Club";
      const chars = text.split("");
      chars.forEach(ch => {
        const s = document.createElement("span");
        if (ch === " ") {
          s.innerHTML = "&nbsp;";
        } else {
          s.textContent = ch;
        }
        measureContainer.appendChild(s);
      });

      document.body.appendChild(measureContainer);
      const containerLeft = measureContainer.getBoundingClientRect().left;
      const lastSpan = measureContainer.lastElementChild;
      const lastSpanRight = lastSpan ? lastSpan.getBoundingClientRect().right : measureContainer.getBoundingClientRect().right;
      const probeWidth = lastSpanRight - containerLeft;
      document.body.removeChild(measureContainer);

      if (availableWidth > 0 && probeWidth > 0) {
        const exactSize = Math.min((availableWidth / probeWidth) * 100, 96);
        p.style.fontSize = `${exactSize.toFixed(2)}px`;
      }
    }
  }, []);

  // Update layout when element visibility changes
  useEffect(() => {
    if (visible) {
      updateLayout();
    }
  }, [visible, updateLayout]);

  // Update layout on window resize (font scaling only, guarded against height-only changes)
  useEffect(() => {
    let lastWidth = window.innerWidth;
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      updateLayout();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateLayout]);

  // Update layout when the columns resize (e.g. image loads, text wrap changes)
  useEffect(() => {
    if (!visible) return;
    const columnsEl = sectionRef.current?.querySelector(".about-columns");
    if (!columnsEl) return;

    const observer = new ResizeObserver(() => {
      updateLayout();
    });
    observer.observe(columnsEl);
    return () => observer.disconnect();
  }, [visible, updateLayout]);

  return (
    <section ref={sectionRef} id="next" className="section section-about">

      {/* Full-width headline */}
      <div ref={headlineRef} className="about-headline">
        {visible && (
          <p className="about-headline-text">
            {"Astrophysics and Astronomy Club".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </p>
        )}
      </div>

      {/* Two-column: body text left, APOD panel right */}
      <div className="about-columns">
        <div className="about-body">
          <p className={`about-quote ${visible ? "about-fadein" : "about-hidden"}`}
             style={{ animationDelay: "1.7s" }}>
            "We are stardust brought to life, then empowered by the universe to figure itself out — and we have only just begun."
            <span style={{ display: "block", marginTop: "12px", fontSize: "0.88em", opacity: 0.85 }}>
              — Neil deGrasse Tyson
            </span>
          </p>
          {PARAS.map((para, i) => (
            <p key={i}
               className={`about-para ${visible ? "about-fadein" : "about-hidden"}`}
               style={{ animationDelay: `${2.1 + i * 0.22}s` }}>
              {para}
            </p>
          ))}
        </div>

        <ApodPanel />
      </div>

    </section>
  );
}
