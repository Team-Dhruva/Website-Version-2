import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { VerticalProject } from "../data/verticals";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

interface Chapter {
  id: number;
  title: string;
  markdown: string;
}

interface ProjectWithChapters extends VerticalProject {
  chapters?: Chapter[];
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectWithChapters | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));
        let found: ProjectWithChapters | null = null;
        snap.forEach((docSnap) => {
          const d = docSnap.data() as any;
          const titleSlug = d.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          if (titleSlug === slug) {
            found = { title: d.title, description: d.description, image: d.image || "", link: d.link || "", chapters: d.chapters || [] };
          }
        });
        setProject(found);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project || !project.chapters) return;
    const updateLayout = () => {
      const container = containerRef.current;
      const p = textRef.current;
      if (!container || !p) return;
      const availableWidth = container.getBoundingClientRect().width;
      const measureContainer = document.createElement("div");
      measureContainer.style.fontFamily = getComputedStyle(p).fontFamily || "'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, sans-serif";
      measureContainer.style.fontWeight = getComputedStyle(p).fontWeight || "800";
      measureContainer.style.letterSpacing = "-0.04em";
      measureContainer.style.fontSize = "100px";
      measureContainer.style.position = "absolute";
      measureContainer.style.visibility = "hidden";
      measureContainer.style.whiteSpace = "nowrap";
      const referenceText = "Astrophysics and Astronomy Club";
      const chars = referenceText.split("");
      chars.forEach(ch => {
        const s = document.createElement("span");
        if (ch === " ") { s.innerHTML = "&nbsp;"; } else { s.textContent = ch; }
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
    };
    updateLayout();
    let resizeTimer: number;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateLayout, 200);
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(resizeTimer); };
  }, [project, activeChapter]);

  const handleChapterClick = (chapter: Chapter) => {
    setActiveChapter(chapter);
  };

  const handleBack = () => {
    setActiveChapter(null);
  };

  if (loading) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container">
          <h1 className="vertical-title-text">Project Not Found</h1>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        <div ref={containerRef} className="radio-headline">
          <h1 ref={textRef} className="radio-headline-text">
            {(activeChapter ? project.title : project.title).split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {!activeChapter ? (
          <>
            <p className="card-desc" style={{ marginTop: "24px", fontSize: "1.05rem", color: "var(--text-muted)" }}>{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-table-link" style={{ display: "inline-block", marginTop: "16px" }}>
                View Repository ↗
              </a>
            )}
            {project.chapters && project.chapters.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h2 className="blog-reader-h2" style={{ margin: "0 0 24px 0" }}>Chapters</h2>
                <div className="chapters-list-grid">
                  {project.chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter)}
                      className="chapter-list-item"
                    >
                      <span className="chapter-number-badge">{index + 1}</span>
                      <div className="chapter-item-title">{chapter.title}</div>
                      <div className="chapter-read-btn">
                        <svg className="repo-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="blog-view-container" style={{ marginTop: "40px" }}>
            <button onClick={handleBack} className="blog-back-arrow" aria-label="Back" style={{ marginBottom: "32px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>
            <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>{activeChapter.title}</h2>
            <hr className="blog-header-divider" style={{ marginBottom: "32px" }} />
            <div className="blog-reader-content">
              {renderMarkdown(activeChapter.markdown)}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}

function renderMarkdown(md: string) {
  const cleaned = md.replace(/!\[[^\]]*\]\([^)]*\)/gi, "").replace(/<img[^>]*>/gi, "");
  const lines = cleaned.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let inQuote = false;
  let quoteLines: string[] = [];

  const flushPara = (k: string | number) => { if (para.length > 0) { elements.push(<p key={`p-${k}`} className="blog-reader-paragraph">{parseInline(para.join(" "))}</p>); para = []; } };
  const flushList = (k: string | number) => { if (list.length > 0) { elements.push(<ul key={`ul-${k}`} className="blog-reader-list">{list.map((item, i) => <li key={i}>{parseInline(item)}</li>)}</ul>); list = []; } };
  const flushQuote = (k: string | number) => { if (quoteLines.length > 0) { elements.push(<blockquote key={`q-${k}`} className="blog-reader-quote">{parseInline(quoteLines.join(" "))}</blockquote>); quoteLines = []; inQuote = false; } };
  const flushAll = (k: string | number) => { flushPara(k); flushList(k); flushQuote(k); };

  lines.forEach((line, idx) => {
    const t = line.trim();
    if (!t) { flushAll(idx); return; }
    if (t.startsWith("#")) {
      flushAll(idx);
      const m = t.match(/^(#{1,6})\s+(.*)$/);
      if (m) {
        const level = m[1].length > 4 ? 4 : m[1].length;
        const H = `h${level}` as keyof JSX.IntrinsicElements;
        elements.push(<H key={`h-${idx}`} className={`blog-reader-h${level}`}>{parseInline(m[2])}</H>);
      }
      return;
    }
    if (t.startsWith("> ")) { flushPara(idx); flushList(idx); inQuote = true; quoteLines.push(t.slice(2)); return; }
    if (inQuote && !t.startsWith("> ")) { flushQuote(idx); }
    if (t.startsWith("- ") || t.startsWith("* ")) { flushPara(idx); flushQuote(idx); list.push(t.replace(/^[-*]\s+/, "")); return; }
    flushList(idx); flushQuote(idx); para.push(t);
  });
  flushAll("end");
  return elements;
}

function parseInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  parts.forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) tokens.push(<strong key={i}>{part.slice(2, -2)}</strong>);
    else if (part.startsWith("*") && part.endsWith("*")) tokens.push(<em key={i}>{part.slice(1, -1)}</em>);
    else if (part.startsWith("[") && part.includes("](")) {
      const m = part.match(/\[(.*?)\]\((.*?)\)/);
      if (m) tokens.push(<a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="blog-content-link">{m[1]}</a>);
      else tokens.push(part);
    } else tokens.push(part);
  });
  return tokens;
}
