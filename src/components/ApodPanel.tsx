import { useEffect, useState, useCallback } from "react";

interface ApodData {
  title: string;
  date: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  explanation: string;
  copyright?: string;
}

const API_KEY = "CXw8rZkaGYCA4JnlE3jLB87C8de6uOcmcEGmnFc1";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr(): string {
  return formatDate(new Date());
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

export default function ApodPanel() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(todayStr);

  const fetchApod = useCallback((d: string) => {
    setLoading(true);
    setError(false);
    setData(null);
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${d}`)
      .then(r => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((res: ApodData) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        if (d === todayStr()) {
          setDate(addDays(d, -1));
        } else {
          setError(true);
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => { fetchApod(date); }, [date, fetchApod]);

  const goPrev = () => setDate(d => addDays(d, -1));
  const goNext = () => {
    const next = addDays(date, 1);
    if (next <= todayStr()) setDate(next);
  };
  const atToday = date === todayStr();

  return (
    <div className="apod-panel">
      <div className="apod-frame">
        {loading && (
          <div className="apod-placeholder">
            <div className="apod-skeleton" />
          </div>
        )}
        {error && (
          <div className="apod-placeholder">
            <span className="apod-loading-text">Unable to load</span>
          </div>
        )}
        {data && data.media_type === "image" && (
          <img
            src={data.hdurl ?? data.url}
            alt={data.title}
            className="apod-img"
            fetchPriority="high"
          />
        )}
        {data && data.media_type === "video" && (
          <div className="apod-placeholder">
            <span className="apod-loading-text">Today's feature is a video</span>
          </div>
        )}

        <button className="apod-nav-btn apod-nav-prev" onClick={goPrev} aria-label="Previous APOD">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className={`apod-nav-btn apod-nav-next${atToday ? " apod-nav-disabled" : ""}`}
          onClick={goNext}
          disabled={atToday}
          aria-label="Next APOD"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {data && (
          <div className="apod-meta-overlay">
            <span className="apod-title">{data.title}</span>
            <span className="apod-date">
              {data.date}
              {data.copyright ? ` · ${data.copyright.trim().replace(/^[^a-zA-Z0-9]+/, "")}` : ""}
            </span>
          </div>
        )}
      </div>
      <span className="apod-label">Astronomy Picture of the Day</span>
    </div>
  );
}
