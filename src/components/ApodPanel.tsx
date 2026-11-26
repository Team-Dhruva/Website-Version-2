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

const API_KEY = "Cdjb9HGn6mTfwzhNrK8LGpPrMdmGQP6crJHDLtKr";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nasaTodayStr(): string {
  const etNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return formatDate(etNow);
}

function addDays(dateStr: string, n: number): string {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day, 12, 0, 0);
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

function isPlaceholderLogo(url?: string): boolean {
  return !url || url.toLowerCase().includes("nasa-logo");
}

export default function ApodPanel() {
  const [maxDate] = useState<string>(nasaTodayStr);
  const [date, setDate] = useState<string>(nasaTodayStr);
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApod = useCallback(
    async (targetDate: string, signal: AbortSignal, allowFallback: boolean) => {
      setLoading(true);
      setError(null);
      setData(null);

      const cacheKey = `apod_${targetDate}`;
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as ApodData;
          const cachedImg = parsed.hdurl ?? parsed.url;
          const isBadCachedImage =
            parsed.media_type === "image" && isPlaceholderLogo(cachedImg);

          if (isBadCachedImage && allowFallback && targetDate === maxDate) {
            setDate(addDays(targetDate, -1));
            return;
          }

          if (!signal.aborted) {
            setData(parsed);
            setLoading(false);
          }
          return;
        }
      } catch {
        // Ignore storage read/parse errors
      }

      try {
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(
            API_KEY
          )}&date=${encodeURIComponent(targetDate)}`,
          { signal }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = (await res.json()) as ApodData;
        if (signal.aborted) return;

        const imageUrl = json.hdurl ?? json.url;
        if (
          json.media_type === "image" &&
          isPlaceholderLogo(imageUrl) &&
          allowFallback &&
          targetDate === maxDate
        ) {
          setDate(addDays(targetDate, -1));
          return;
        }

        setData(json);
        setLoading(false);

        if (!(json.media_type === "image" && isPlaceholderLogo(imageUrl))) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(json));
          } catch {
            // Ignore storage quota errors
          }
        }
      } catch (err) {
        if (signal.aborted) return;

        if (allowFallback && targetDate === maxDate) {
          setDate(addDays(targetDate, -1));
          return;
        }

        setError(err instanceof Error ? err.message : "Unable to load");
        setLoading(false);
      }
    },
    [maxDate]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchApod(date, controller.signal, true);
    return () => controller.abort();
  }, [date, fetchApod]);

  const goPrev = () => setDate((d) => addDays(d, -1));
  const goNext = () => {
    const next = addDays(date, 1);
    if (next <= maxDate) setDate(next);
  };
  const atToday = date >= maxDate;

  return (
    <div className="apod-panel">
      <div className="apod-frame">
        {loading && (
          <div className="apod-placeholder">
            <div className="apod-skeleton" />
          </div>
        )}

        {!loading && error && (
          <div className="apod-placeholder">
            <span className="apod-loading-text">Unable to load ({error})</span>
          </div>
        )}

        {!loading && data && data.media_type === "image" && (
          <img
            src={data.hdurl ?? data.url}
            alt={data.title}
            className="apod-img"
            fetchPriority="high"
          />
        )}

        {!loading && data && data.media_type === "video" && (
          <div className="apod-placeholder">
            <span className="apod-loading-text">
              {data.date} feature is a video
            </span>
          </div>
        )}

        <button
          className="apod-nav-btn apod-nav-prev"
          onClick={goPrev}
          aria-label="Previous APOD"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          className={`apod-nav-btn apod-nav-next${
            atToday ? " apod-nav-disabled" : ""
          }`}
          onClick={goNext}
          disabled={atToday}
          aria-label="Next APOD"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {data && (
          <div className="apod-meta-overlay">
            <span className="apod-title">{data.title}</span>
            <span className="apod-date">
              {data.date}
              {data.copyright
                ? ` · ${data.copyright.trim().replace(/^[^a-zA-Z0-9]+/, "")}`
                : ""}
            </span>
          </div>
        )}
      </div>
      <span className="apod-label">Astronomy Picture of the Day</span>
    </div>
  );
}
