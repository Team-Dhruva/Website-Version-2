import { useState, useEffect, useRef } from "react";
import { BLOGS, Blog, Chapter } from "../data/blogData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

export default function BlogPage() {
  const [blogsList, setBlogsList] = useState<Blog[]>(BLOGS);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const snap = await getDocs(collection(db, "blogs"));
        const list: Blog[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as Blog);
        });
        if (list.length > 0) {
          list.sort((a, b) => b.id - a.id);
          setBlogsList(list);
        }
      } catch (err) {
        console.error("Error loading blogs from Firestore, using static fallback:", err);
      }
    };
    fetchBlogs();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Match the header padding and title font size logic from vertical page
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

  const handleBlogClick = (blog: Blog) => {
    setActiveBlog(blog);
    if (blog.chapters.length === 1) {
      setActiveChapter(blog.chapters[0]);
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

  const handleBackToBlogs = () => {
    setActiveBlog(null);
    setActiveChapter(null);
  };

  const handlePrevChapter = () => {
    if (!activeBlog || !activeChapter) return;
    const currentIndex = activeBlog.chapters.findIndex(c => c.id === activeChapter.id);
    if (currentIndex > 0) {
      setActiveChapter(activeBlog.chapters[currentIndex - 1]);
    }
  };

  const handleNextChapter = () => {
    if (!activeBlog || !activeChapter) return;
    const currentIndex = activeBlog.chapters.findIndex(c => c.id === activeChapter.id);
    if (currentIndex < activeBlog.chapters.length - 1) {
      setActiveChapter(activeBlog.chapters[currentIndex + 1]);
    }
  };

  // Robust line-by-line markdown parser that strips out all images, videos and handles formatting
  const renderBlogContent = (md: string) => {
    // 1. Strip all video elements and their contents
    let cleaned = md.replace(/<video[^>]*>([\s\S]*?)<\/video>/gi, "");
    
    // 2. Strip all HTML img tags and markdown image syntax
    cleaned = cleaned.replace(/<img[^>]*>/gi, "");
    cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]*\)/gi, "");

    // 3. Strip HTML layout wrappers and line breaks
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
        // Clean markdown italic wrappers/blockquotes from the caption for display
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

          // Skip repeated/duplicated titles dynamically (ignoring capitalization and punctuation)
          if (activeBlog && activeChapter) {
            const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normText = norm(text);
            const normBlogTitle = norm(activeBlog.title);
            const normChapterTitle = norm(activeChapter.title);

            if (normText === normBlogTitle || normText === normChapterTitle) {
              return; // Skip duplicated title
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

      // Regular line - add to current paragraph
      flushList(idx);
      flushQuote(idx);
      currentParagraphLines.push(trimmed);
    });

    // Flush any remaining content
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
            onClick={handleBackToBlogs}
            style={{ cursor: activeBlog ? "pointer" : "default" }}
          >
            {"Blog".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {!activeBlog ? (
          /* 1. Blog List View */
          <div className="vertical-projects-grid" style={{ pointerEvents: "auto", marginTop: "40px" }}>
            {blogsList.map((blog, idx) => (
              <div
                key={idx}
                onClick={() => handleBlogClick(blog)}
                className="vertical-project-card"
                style={{ cursor: "pointer" }}
              >
                <div className="card-content">
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-desc">{blog.description}</p>
                  <div className="card-footer">
                    <span>By {blog.author}</span>
                    <span className="repo-link-text" style={{ display: "inline-flex", alignItems: "center" }}>
                      <svg className="repo-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !activeChapter ? (
          /* 2. Chapters List View */
          <div className="blog-view-container" style={{ marginTop: "40px" }}>
            <button
              onClick={handleBackToBlogs}
              className="blog-back-arrow"
              aria-label="Back to Blogs"
              style={{ marginBottom: "32px" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>
            
            <div className="blog-meta-info" style={{ textTransform: "none" }}>
              <span>By {activeBlog.author}</span>
              <span>•</span>
              <span>Last updated: {activeBlog.lastUpdated}</span>
            </div>
            
            <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2.2rem" }}>
              {activeBlog.title}
            </h2>
            <p className="card-desc" style={{ fontSize: "1.05rem", color: "var(--text-muted)", marginBottom: "40px" }}>
              {activeBlog.description}
            </p>
            
            <hr className="blog-header-divider" />
            
            <h3 className="blog-reader-h3" style={{ margin: "0 0 24px 0" }}>Chapters</h3>
            <div className="chapters-list-grid">
              {activeBlog.chapters.map((chapter, index) => (
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
              onClick={activeBlog.chapters.length > 1 ? handleBackToChapters : handleBackToBlogs}
              className="blog-back-arrow"
              aria-label="Back"
              style={{ marginBottom: "32px" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>

            <div className="blog-meta-info" style={{ textTransform: "none" }}>
              <span>{activeBlog.title}</span>
              <span>•</span>
              <span>By {activeBlog.author}</span>
              {activeBlog.lastUpdated && (
                <>
                  <span>•</span>
                  <span>Updated: {activeBlog.lastUpdated}</span>
                </>
              )}
            </div>

            <h2 className="blog-reader-h2" style={{ margin: "0 0 16px 0", fontSize: "2rem" }}>
              {activeChapter.title}
            </h2>

            <hr className="blog-header-divider" style={{ marginBottom: "32px" }} />

            <div className="blog-reader-content">
              {renderBlogContent(activeChapter.markdown)}
            </div>

            {activeBlog.chapters.length > 1 && (
              <div className="blog-reader-nav">
                {/* Previous Chapter */}
                {activeBlog.chapters.findIndex(c => c.id === activeChapter.id) > 0 ? (
                  <div
                    onClick={handlePrevChapter}
                    className="blog-nav-link"
                  >
                    <span className="blog-nav-label">Previous Chapter</span>
                    <span className="blog-nav-title">
                      ← {activeBlog.chapters[activeBlog.chapters.findIndex(c => c.id === activeChapter.id) - 1].title}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {/* Next Chapter */}
                {activeBlog.chapters.findIndex(c => c.id === activeChapter.id) < activeBlog.chapters.length - 1 ? (
                  <div
                    onClick={handleNextChapter}
                    className="blog-nav-link next-link"
                  >
                    <span className="blog-nav-label">Next Chapter</span>
                    <span className="blog-nav-title">
                      {activeBlog.chapters[activeBlog.chapters.findIndex(c => c.id === activeChapter.id) + 1].title} →
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
