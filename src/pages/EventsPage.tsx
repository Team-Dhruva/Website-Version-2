import { useEffect, useRef, useState } from "react";
import { EVENTS, EventDetail } from "../data/eventsData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

export default function EventsPage() {
  const [eventsList, setEventsList] = useState<EventDetail[]>(EVENTS);
  const [activeEvent, setActiveEvent] = useState<EventDetail | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const list: EventDetail[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as EventDetail);
        });
        if (list.length > 0) {
          setEventsList(list);
        }
      } catch (err) {
        console.error("Error loading events from Firestore, using static fallback:", err);
      }
    };
    fetchEvents();
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
  }, [activeEvent]);

  const handleEventClick = (event: EventDetail) => {
    setActiveEvent(event);
  };

  const handleBackToEvents = () => {
    setActiveEvent(null);
  };

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        <div ref={containerRef} className="radio-headline">
          <h1 
            ref={textRef} 
            className="radio-headline-text"
            onClick={handleBackToEvents}
            style={{ cursor: activeEvent ? "pointer" : "default" }}
          >
            {"Events".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {!activeEvent ? (
          /* 1. Events List View */
          <div className="vertical-projects-grid" style={{ pointerEvents: "auto", marginTop: "40px" }}>
            {eventsList.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="vertical-project-card"
                style={{ cursor: "pointer" }}
              >
                <div className="card-content">
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-desc">{event.description}</p>
                  <div className="card-footer">
                    <span>{event.date}</span>
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
        ) : (
          /* 2. Event Details View */
          <div className="blog-view-container" style={{ marginTop: "40px" }}>
            <button
              onClick={handleBackToEvents}
              className="blog-back-arrow"
              aria-label="Back to Events"
              style={{ marginBottom: "32px" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 20 8 12 16 4"></polyline>
              </svg>
            </button>
            
            <div className="blog-meta-info" style={{ textTransform: "none" }}>
              <span>{activeEvent.date}</span>
              {activeEvent.time && (
                <>
                  <span>•</span>
                  <span>{activeEvent.time}</span>
                </>
              )}
            </div>
            
            <h2 className="blog-reader-h2" style={{ margin: "0 0 8px 0", fontSize: "2.2rem" }}>
              {activeEvent.title}
            </h2>
            {activeEvent.subtitle && (
              <p className="card-desc" style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "32px" }}>
                {activeEvent.subtitle}
              </p>
            )}
            
            <hr className="blog-header-divider" />

            <div className="blog-reader-content">
              {activeEvent.speaker && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 className="blog-reader-h3" style={{ margin: "0 0 8px 0" }}>Speaker</h3>
                  <p className="blog-reader-paragraph" style={{ fontWeight: 500 }}>
                    <span style={{ color: "var(--glass-teal-dim)" }}>{activeEvent.speaker}</span>
                    {activeEvent.speakerAffiliation && ` (${activeEvent.speakerAffiliation})`}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: "32px" }}>
                <h3 className="blog-reader-h3" style={{ margin: "0 0 16px 0" }}>Event Details</h3>
                <div className="blog-reader-table-container">
                  <table className="blog-reader-table">
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 500 }}>Date</td>
                        <td>{activeEvent.date}</td>
                      </tr>
                      {activeEvent.time && (
                        <tr>
                          <td style={{ fontWeight: 500 }}>Time</td>
                          <td>{activeEvent.time}</td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ fontWeight: 500 }}>Venue</td>
                        <td>{activeEvent.venue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <h3 className="blog-reader-h3" style={{ margin: "0 0 12px 0" }}>About the Event</h3>
                <p className="blog-reader-paragraph">{activeEvent.aboutSection}</p>
              </div>

              {activeEvent.aboutSpeaker && (
                <div style={{ marginBottom: "32px" }}>
                  <h3 className="blog-reader-h3" style={{ margin: "0 0 12px 0" }}>About the Speaker</h3>
                  <p className="blog-reader-paragraph">{activeEvent.aboutSpeaker}</p>
                </div>
              )}


            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
