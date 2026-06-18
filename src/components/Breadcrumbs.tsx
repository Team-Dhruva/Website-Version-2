import { Link, useLocation } from "react-router-dom";

const LABEL_MAP: Record<string, string> = {
  "": "Home",
  "about": "About",
  "events": "Events",
  "verticals": "Verticals",
  "radio": "Radio Astronomy",
  "data": "Data Driven Astronomy",
  "optical": "Optical Astronomy",
  "research": "Research",
  "sponsorship": "Sponsorship",
  "recruitment": "Recruitment",
  "J2023.6": "Epoch J2023.6",
  "J2024.7": "Epoch J2024.7",
  "J2025.8": "Epoch J2025.8",
  "J2026.9": "Epoch J2026.9",
  "merchandise": "Merchandise",
  "gallery": "Gallery",
  "blog": "Blog",
  "team": "Team",
  "admin": "Admin",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {parts.map((part, i) => {
        const path = "/" + parts.slice(0, i + 1).join("/");
        const label = LABEL_MAP[part] || part.replace(/-/g, " ");
        const isLast = i === parts.length - 1;
        return (
          <span key={path} className="breadcrumb-segment">
            <span className="breadcrumb-sep">/</span>
            {isLast ? (
              <span className="breadcrumb-current">{label}</span>
            ) : (
              <Link to={path} className="breadcrumb-link">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
