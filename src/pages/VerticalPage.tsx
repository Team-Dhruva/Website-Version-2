import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { VERTICALS } from "../data/verticals";
import { IA_ARTICLES, IAArticle, Chapter } from "../data/indianAstrophysicsData";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

export default function VerticalPage() {
  const { slug } = useParams<{ slug: string }>();
  const vertical = VERTICALS.find((v) => v.slug === slug);
  
  const [activeIAArticle, setActiveIAArticle] = useState<IAArticle | null>(null);
  const [activeIAChapter, setActiveIAChapter] = useState<Chapter | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const iaContainerRef = useRef<HTMLDivElement>(null);
  const iaTextRef = useRef<HTMLHeadingElement>(null);

  // Dynamic calculation to match the exact font size and vertical alignment of the home page tagline
  useEffect(() => {
    if (!vertical) return;

    const updateLayout = () => {
      // 1. Scale Main Title
      const container = containerRef.current;
      const p = textRef.current;
      if (container && p) {
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

      // 2. Scale Indian Astrophysics Title (if visible)
      const iaContainer = iaContainerRef.current;
      const iaP = iaTextRef.current;
      if (iaContainer && iaP) {
        const availableWidth = iaContainer.getBoundingClientRect().width;
        
        const measureContainer = document.createElement("div");
        measureContainer.style.fontFamily = getComputedStyle(iaP).fontFamily || "'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, sans-serif";
        measureContainer.style.fontWeight = getComputedStyle(iaP).fontWeight || "800";
        measureContainer.style.letterSpacing = "-0.04em";
        measureContainer.style.fontSize = "100px";
        measureContainer.style.position = "absolute";
        measureContainer.style.visibility = "hidden";
        measureContainer.style.whiteSpace = "nowrap";

        const referenceText = "Astrophysics and Astronomy Club";
        const chars = referenceText.split("");
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
          iaP.style.fontSize = `${exactSize.toFixed(2)}px`;
        }
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
    const resizeObserver = new ResizeObserver(onResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (iaContainerRef.current) {
      resizeObserver.observe(iaContainerRef.current);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [slug, vertical, activeIAArticle, activeIAChapter]);

  // Reset local state when slug changes
  useEffect(() => {
    setActiveIAArticle(null);
    setActiveIAChapter(null);
  }, [slug]);

  if (!vertical) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container">
          <h1 className="vertical-title-text">Not Found</h1>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const handleArticleClick = (article: IAArticle) => {
    if (article.chapters.length === 0) return;
    setActiveIAArticle(article);
    if (article.chapters.length === 1) {
      setActiveIAChapter(article.chapters[0]);
    } else {
      setActiveIAChapter(null);
    }
    setTimeout(() => {
      const el = document.getElementById("indian-astrophysics");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleChapterClick = (chapter: Chapter) => {
    setActiveIAChapter(chapter);
    setTimeout(() => {
      const el = document.getElementById("indian-astrophysics");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleBackToChapters = () => {
    setActiveIAChapter(null);
    setTimeout(() => {
      const el = document.getElementById("indian-astrophysics");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleBackToResearch = () => {
    setActiveIAArticle(null);
    setActiveIAChapter(null);
    setTimeout(() => {
      const el = document.getElementById("indian-astrophysics");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handlePrevChapter = () => {
    if (!activeIAArticle || !activeIAChapter) return;
    const currentIndex = activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id);
    if (currentIndex > 0) {
      setActiveIAChapter(activeIAArticle.chapters[currentIndex - 1]);
      setTimeout(() => {
        const el = document.getElementById("indian-astrophysics");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleNextChapter = () => {
    if (!activeIAArticle || !activeIAChapter) return;
    const currentIndex = activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id);
    if (currentIndex < activeIAArticle.chapters.length - 1) {
      setActiveIAChapter(activeIAArticle.chapters[currentIndex + 1]);
      setTimeout(() => {
        const el = document.getElementById("indian-astrophysics");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  // Markdown parser supporting figure captions and tables
  const renderArticleContent = (md: string) => {
    let cleaned = md.replace(/<video[^>]*>([\s\S]*?)<\/video>/gi, "");
    cleaned = cleaned.replace(/<img[^>]*>/gi, "");
    cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]*\)/gi, "");
    cleaned = cleaned.replace(/<div[^>]*>/gi, "");
    cleaned = cleaned.replace(/<\/div>/gi, "");
    cleaned = cleaned.replace(/<br\s*\/?>/gi, "");

    const lines = cleaned.replace(/\r\n/g, "\n").split("\n");
    
    const elements: React.ReactNode[] = [];
    let currentParagraphLines: string[] = [];
    let currentListItems: string[] = [];
    let inQuote = false;
    let quoteLines: string[] = [];
    let currentTableRows: string[][] = [];

    const flushParagraph = (key: string | number) => {
      if (currentParagraphLines.length > 0) {
        elements.push(
          <p key={`p-${key}`} className="blog-reader-paragraph">
            {parseInline(currentParagraphLines.join(" "))}
          </p>
        );
        currentParagraphLines = [];
      }
    };

    const flushList = (key: string | number) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="blog-reader-list">
            {currentListItems.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        currentListItems = [];
      }
    };

    const flushQuote = (key: string | number) => {
      if (quoteLines.length > 0) {
        elements.push(
          <blockquote key={`q-${key}`} className="blog-reader-quote">
            {parseInline(quoteLines.join(" "))}
          </blockquote>
        );
        quoteLines = [];
        inQuote = false;
      }
    };

    const flushTable = (key: string | number) => {
      if (currentTableRows.length > 0) {
        const hasHeader = currentTableRows.length > 1 && currentTableRows[1].every(c => c === "---");
        const headerRow = hasHeader ? currentTableRows[0] : null;
        const bodyRows = hasHeader ? currentTableRows.slice(2) : currentTableRows;
        
        elements.push(
          <div key={`table-wrapper-${key}`} className="blog-reader-table-container">
            <table className="blog-reader-table">
              {headerRow && (
                <thead>
                  <tr>
                    {headerRow.map((cell, i) => (
                      <th key={i}>{parseInline(cell.trim())}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td key={k}>{parseInline(cell.trim())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTableRows = [];
      }
    };

    const flushAll = (key: string | number) => {
      flushParagraph(key);
      flushList(key);
      flushQuote(key);
      flushTable(key);
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        flushAll(idx);
        return;
      }

      // Check for table rows
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        flushParagraph(idx);
        flushList(idx);
        flushQuote(idx);
        const cells = line.split("|").slice(1, -1);
        const isSeparator = cells.every(c => /^[\s:-]+$/.test(c));
        if (isSeparator) {
          currentTableRows.push(cells.map(() => "---"));
        } else {
          currentTableRows.push(cells);
        }
        return;
      } else {
        flushTable(idx);
      }

      // Check if this line is a figure/video caption or credit text
      const isCaption = /^(Fig|Figure|Video|Illustration)\.?\s*\d/i.test(trimmed) || 
                        /^(?:>\s*)?\*\(?(?:An artist|Credit|Courtesy|Photo|Image|Source)/i.test(trimmed);

      if (isCaption) {
        flushAll(idx);
        let captionText = trimmed.replace(/^>\s*/, "").trim();
        if (captionText.startsWith("*") && captionText.endsWith("*")) {
          captionText = captionText.slice(1, -1).trim();
        }
        if (captionText.startsWith("(") && captionText.endsWith(")")) {
          captionText = captionText.slice(1, -1).trim();
        }
        
        elements.push(
          <div key={`caption-${idx}`} className="blog-reader-caption">
            {parseInline(captionText)}
          </div>
        );
        return;
      }

      // Horizontal Rule
      if (trimmed === "---" || trimmed === "***") {
        flushAll(idx);
        elements.push(<hr key={`hr-${idx}`} className="blog-reader-hr" />);
        return;
      }

      // Blockquote
      if (trimmed.startsWith(">")) {
        flushParagraph(idx);
        flushList(idx);
        inQuote = true;
        quoteLines.push(trimmed.replace(/^>\s*/, "").trim());
        return;
      } else if (inQuote && !trimmed.startsWith(">")) {
        flushQuote(idx);
      }

      // Headers
      if (trimmed.startsWith("#")) {
        flushAll(idx);
        const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];

          // Skip repeated/duplicated titles dynamically
          if (activeIAArticle && activeIAChapter) {
            const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normText = norm(text);
            const normArticleTitle = norm(activeIAArticle.title);
            const normChapterTitle = norm(activeIAChapter.title);

            if (normText === normArticleTitle || normText === normChapterTitle) {
              return;
            }
          }

          const targetLevel = level === 1 ? 2 : level > 4 ? 4 : level;
          const HeaderTag = `h${targetLevel}` as keyof JSX.IntrinsicElements;
          elements.push(
            <HeaderTag key={`h-${idx}`} className={`blog-reader-h${targetLevel}`}>
              {parseInline(text)}
            </HeaderTag>
          );
        } else {
          currentParagraphLines.push(trimmed);
        }
        return;
      }

      // List item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph(idx);
        flushQuote(idx);
        currentListItems.push(trimmed.replace(/^[-*]\s+/, "").trim());
        return;
      }

      // Regular line
      flushList(idx);
      flushQuote(idx);
      currentParagraphLines.push(trimmed);
    });

    flushAll("end");
    return elements;
  };

  const parseInline = (text: string): React.ReactNode[] => {
    const processed = text.replace(/\\_/g, "_").replace(/\\\./g, ".").replace(/\\/g, "");
    const tokens: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|\[.*?\]\(.*?\))/g;
    const parts = processed.split(regex);

    parts.forEach((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        tokens.push(<strong key={index}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        tokens.push(<em key={index}>{part.slice(1, -1)}</em>);
      } else if (part.startsWith("_") && part.endsWith("_")) {
        tokens.push(<em key={index}>{part.slice(1, -1)}</em>);
      } else if (part.startsWith("[") && part.includes("](")) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          tokens.push(
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-content-link"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          tokens.push(part);
        }
      } else {
        tokens.push(part);
      }
    });

    return tokens;
  };

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        <div ref={containerRef} className="radio-headline">
          <h1 
            ref={textRef} 
            className="radio-headline-text"
            onClick={handleBackToResearch}
            style={{ cursor: (slug === "research" && activeIAArticle) ? "pointer" : "default" }}
          >
            {((slug === "research" && activeIAArticle) ? "Indian Astrophysics" : vertical.name).split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {slug === "research" && activeIAArticle ? (
          /* Indian Astrophysics Article Chapters / Reader View */
          !activeIAChapter ? (
            /* Chapters list */
            <div className="blog-view-container" style={{ marginTop: "40px" }}>
              <button
                onClick={handleBackToResearch}
                className="blog-back-arrow"
                aria-label="Back to Research"
                style={{ marginBottom: "32px" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 20 8 12 16 4"></polyline>
                </svg>
              </button>
              
              <div className="blog-meta-info" style={{ textTransform: "none" }}>
                <span>By {activeIAArticle.author}</span>
                {activeIAArticle.lastUpdated && (
                  <>
                    <span>•</span>
                    <span>Last updated: {activeIAArticle.lastUpdated}</span>
                  </>
                )}
              </div>
              
              <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2.2rem" }}>
                {activeIAArticle.title}
              </h2>
              <p className="card-desc" style={{ fontSize: "1.05rem", color: "var(--text-muted)", marginBottom: "40px" }}>
                {activeIAArticle.description}
              </p>
              
              <hr className="blog-header-divider" />
              
              <h3 className="blog-reader-h3" style={{ margin: "0 0 24px 0" }}>Chapters</h3>
              <div className="chapters-list-grid">
                {activeIAArticle.chapters.map((chapter, index) => (
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
          ) : (
            /* Chapter reader */
            <div className="blog-view-container" style={{ marginTop: "40px" }}>
              <button
                onClick={activeIAArticle.chapters.length > 1 ? handleBackToChapters : handleBackToResearch}
                className="blog-back-arrow"
                aria-label="Back"
                style={{ marginBottom: "32px" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 20 8 12 16 4"></polyline>
                </svg>
              </button>

              <div className="blog-meta-info" style={{ textTransform: "none" }}>
                <span>{activeIAArticle.title}</span>
                <span>•</span>
                <span>By {activeIAArticle.author}</span>
                {activeIAArticle.lastUpdated && (
                  <>
                    <span>•</span>
                    <span>Updated: {activeIAArticle.lastUpdated}</span>
                  </>
                )}
              </div>

              <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>
                {activeIAChapter.title}
              </h2>

              <hr className="blog-header-divider" style={{ marginBottom: "32px" }} />

              <div className="blog-reader-content">
                {renderArticleContent(activeIAChapter.markdown)}
              </div>

              {activeIAArticle.chapters.length > 1 && (
                <div className="blog-reader-nav">
                  {activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id) > 0 ? (
                    <div
                      onClick={handlePrevChapter}
                      className="blog-nav-link"
                    >
                      <span className="blog-nav-label">Previous Chapter</span>
                      <span className="blog-nav-title">
                        ← {activeIAArticle.chapters[activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id) - 1].title}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id) < activeIAArticle.chapters.length - 1 ? (
                    <div
                      onClick={handleNextChapter}
                      className="blog-nav-link next-link"
                    >
                      <span className="blog-nav-label">Next Chapter</span>
                      <span className="blog-nav-title">
                        {activeIAArticle.chapters[activeIAArticle.chapters.findIndex(c => c.id === activeIAChapter.id) + 1].title} →
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          /* Main projects table and Indian Astrophysics card grid */
          <>
            {vertical.projects && vertical.projects.length > 0 && (
              <div className="radio-projects-table-container">
                <table className="radio-projects-table">
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "320px" }} />
                    <col style={{ width: "auto" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="col-sno">Serial</th>
                      <th>Project</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vertical.projects.map((proj, idx) => (
                      <tr key={idx}>
                        <td className="col-sno">{idx + 1}</td>
                        <td className="col-project">
                          {proj.link.startsWith("/") ? (
                            <Link to={proj.link} className="project-table-link">
                              {proj.title} <span className="project-link-arrow">→</span>
                            </Link>
                          ) : proj.link.startsWith("#") ? (
                            <a 
                              href={proj.link} 
                              onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(proj.link.slice(1));
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="project-table-link"
                            >
                              {proj.title} <span className="project-link-arrow">↓</span>
                            </a>
                          ) : (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="project-table-link">
                              {proj.title} <span className="project-link-arrow">↗</span>
                            </a>
                          )}
                        </td>
                        <td className="col-desc">{proj.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {slug === "research" && (
              <div id="indian-astrophysics" className="indian-astrophysics-section" style={{ pointerEvents: "auto" }}>
                <div ref={iaContainerRef} className="radio-headline" style={{ marginTop: "120px" }}>
                  <h1 ref={iaTextRef} className="radio-headline-text">
                    {"Indian Astrophysics".split("").map((ch, i) => (
                      <span key={i}>{ch === " " ? " " : ch}</span>
                    ))}
                  </h1>
                </div>

                <div className="vertical-projects-grid" style={{ marginTop: "40px" }}>
                  {IA_ARTICLES.map((article) => {
                    const isClickable = article.chapters.length > 0;
                    return (
                      <div
                        key={article.id}
                        onClick={() => isClickable && handleArticleClick(article)}
                        className="vertical-project-card"
                        style={{
                          cursor: isClickable ? "pointer" : "default",
                          opacity: isClickable ? 1 : 0.6
                        }}
                      >
                        <div className="card-content">
                          <h3 className="card-title">{article.title}</h3>
                          <p className="card-desc">{article.description}</p>
                          <div className="card-footer">
                            <span>By {article.author.split(" | ")[0]}</span>
                            {isClickable ? (
                              <span className="repo-link-text" style={{ display: "inline-flex", alignItems: "center" }}>
                                <svg className="repo-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                              </span>
                            ) : (
                              <span className="repo-link-text" style={{ textTransform: "none", color: "var(--text-muted)", opacity: 0.7 }}>
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="site-footer">
        <p className="footer-copy">© 2026 Team Dhruva | Licensed under the MIT License.</p>
      </footer>
    </main>
  );
}
