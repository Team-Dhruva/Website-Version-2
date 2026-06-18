import { useState, useEffect, useRef } from "react";
import { IA_ARTICLES, IAArticle, Chapter } from "../data/indianAstrophysicsData";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

export default function IndianAstrophysicsPage() {
  const [activeArticle, setActiveArticle] = useState<IAArticle | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Match the header padding and title font size logic
  useEffect(() => {
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
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, []);

  const handleArticleClick = (article: IAArticle) => {
    if (article.chapters.length === 0) return;
    setActiveArticle(article);
    if (article.chapters.length === 1) {
      setActiveChapter(article.chapters[0]);
    } else {
      setActiveChapter(null);
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    setActiveChapter(chapter);
  };

  const handleBackToChapters = () => {
    setActiveChapter(null);
  };

  const handleBackToArticles = () => {
    setActiveArticle(null);
    setActiveChapter(null);
  };

  const handlePrevChapter = () => {
    if (!activeArticle || !activeChapter) return;
    const currentIndex = activeArticle.chapters.findIndex(c => c.id === activeChapter.id);
    if (currentIndex > 0) {
      setActiveChapter(activeArticle.chapters[currentIndex - 1]);
    }
  };

  const handleNextChapter = () => {
    if (!activeArticle || !activeChapter) return;
    const currentIndex = activeArticle.chapters.findIndex(c => c.id === activeChapter.id);
    if (currentIndex < activeArticle.chapters.length - 1) {
      setActiveChapter(activeArticle.chapters[currentIndex + 1]);
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
          if (activeArticle && activeChapter) {
            const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normText = norm(text);
            const normArticleTitle = norm(activeArticle.title);
            const normChapterTitle = norm(activeChapter.title);

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
    const tokens: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);

    parts.forEach((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        tokens.push(<strong key={index}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
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
            onClick={handleBackToArticles}
            style={{ cursor: activeArticle ? "pointer" : "default" }}
          >
            {"Indian Astrophysics".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {!activeArticle ? (
          /* 1. Article List View */
          <div className="vertical-projects-grid" style={{ pointerEvents: "auto", marginTop: "40px" }}>
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
                        <span className="repo-link-text">
                          Read <span className="repo-arrow">→</span>
                        </span>
                      ) : (
                        <span className="repo-link-text" style={{ textTransform: "none", color: "#a1a1aa" }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !activeChapter ? (
          /* 2. Chapters List View */
          <div className="blog-view-container" style={{ marginTop: "40px" }}>
            <button
              onClick={handleBackToArticles}
              className="blog-back-arrow"
              aria-label="Back to Indian Astrophysics"
              style={{ marginBottom: "32px" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>
            
            <div className="blog-meta-info" style={{ textTransform: "none" }}>
              <span>By {activeArticle.author}</span>
              {activeArticle.lastUpdated && (
                <>
                  <span>•</span>
                  <span>Last updated: {activeArticle.lastUpdated}</span>
                </>
              )}
            </div>
            
            <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2.2rem" }}>
              {activeArticle.title}
            </h2>
            <p className="card-desc" style={{ fontSize: "1.05rem", color: "var(--text-muted)", marginBottom: "40px" }}>
              {activeArticle.description}
            </p>
            
            <hr className="blog-header-divider" />
            
            <h3 className="blog-reader-h3" style={{ margin: "0 0 24px 0" }}>Chapters</h3>
            <div className="chapters-list-grid">
              {activeArticle.chapters.map((chapter, index) => (
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
          /* 3. Chapter Reader View */
          <div className="blog-view-container" style={{ marginTop: "40px" }}>
            <button
              onClick={activeArticle.chapters.length > 1 ? handleBackToChapters : handleBackToArticles}
              className="blog-back-arrow"
              aria-label="Back"
              style={{ marginBottom: "32px" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>

            <div className="blog-meta-info" style={{ textTransform: "none" }}>
              <span>{activeArticle.title}</span>
              <span>•</span>
              <span>By {activeArticle.author}</span>
              {activeArticle.lastUpdated && (
                <>
                  <span>•</span>
                  <span>Updated: {activeArticle.lastUpdated}</span>
                </>
              )}
            </div>

            <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>
              {activeChapter.title}
            </h2>

            <hr className="blog-header-divider" style={{ marginBottom: "32px" }} />

            <div className="blog-reader-content">
              {renderArticleContent(activeChapter.markdown)}
            </div>

            {activeArticle.chapters.length > 1 && (
              <div className="blog-reader-nav">
                {/* Previous Chapter */}
                {activeArticle.chapters.findIndex(c => c.id === activeChapter.id) > 0 ? (
                  <div
                    onClick={handlePrevChapter}
                    className="blog-nav-link"
                  >
                    <span className="blog-nav-label">Previous Chapter</span>
                    <span className="blog-nav-title">
                      ← {activeArticle.chapters[activeArticle.chapters.findIndex(c => c.id === activeChapter.id) - 1].title}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {/* Next Chapter */}
                {activeArticle.chapters.findIndex(c => c.id === activeChapter.id) < activeArticle.chapters.length - 1 ? (
                  <div
                    onClick={handleNextChapter}
                    className="blog-nav-link next-link"
                  >
                    <span className="blog-nav-label">Next Chapter</span>
                    <span className="blog-nav-title">
                      {activeArticle.chapters[activeArticle.chapters.findIndex(c => c.id === activeChapter.id) + 1].title} →
                    </span>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
