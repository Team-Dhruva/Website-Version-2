import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const NAV_ITEMS = [
  { label: "Home",        href: "/",            external: false },
  { label: "About",       href: "/#next",       external: false },
  { label: "Events",      href: "/events",      external: false },
  { label: "Verticals",   href: "/verticals",   external: false, hasSubmenu: true },
  { label: "Team",        href: "/team",        external: false },
  { label: "Blog",        href: "/blog",        external: false },
  { label: "Gallery",     href: "/gallery",     external: false },
  { label: "Merchandise", href: "/merchandise", external: false },
  { label: "Recruitment", href: "/recruitment", external: false },
  { label: "Sponsorship", href: "/sponsorship", external: false },
  { label: "Join Us",     href: "",             external: false, hasSubmenu: true },
];

const VERTICALS_SUBMENU = [
  { label: "Radio Astronomy",       href: "/verticals/radio" },
  { label: "Data Driven Astronomy", href: "/verticals/data" },
  { label: "Optical Astronomy",     href: "/verticals/optical" },
  { label: "Research",              href: "/verticals/research" },
];

const RECRUITMENT_SUBMENU = [
  { label: "Epoch J2023.6", href: "/recruitment/J2023.6" },
  { label: "Epoch J2024.7", href: "/recruitment/J2024.7" },
  { label: "Epoch J2025.8", href: "/recruitment/J2025.8" },
  { label: "Epoch J2026.9", href: "/recruitment/J2026.9" },
];

const HAMBURGER_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/dhruva_rvce/" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/dhruva-astronomy" },
  { label: "GitHub",    href: "https://github.com/Team-Dhruva" },
  { label: "YouTube",   href: "https://www.youtube.com/@dhruva1910" },
];

const CATEGORIES = [
  { key: "verticals" as const, label: "Verticals" },
  { key: "recruitment" as const, label: "Recruitment" },
  { key: "sponsorship" as const, label: "Sponsorship" },
  { key: "join-us" as const, label: "Join Us" },
];

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [activeSubmenu, setActiveSubmenu] = useState<"verticals" | "sponsorship" | "recruitment" | "join-us" | "admin" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"verticals" | "recruitment" | "sponsorship" | "join-us">("verticals");

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthResolved(true);
    });
    return unsubscribe;
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const email = username.includes("@") ? username : `${username}@rvce.edu.in`;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUsername("");
      setPassword("");
      setActiveSubmenu(null);
      navigate("/admin");
    } catch (err: any) {
      console.error("Firebase Login Error:", err.code, err.message);
      if (err.code === "auth/operation-not-allowed") {
        setLoginError("Email/Password provider is disabled in Firebase Console. Please enable it.");
        return;
      }
      setLoginError("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveSubmenu(null);
    navigate("/");
  };

  useEffect(() => {
    if (path.startsWith("/verticals")) {
      setActiveSubmenu("verticals");
      setSelectedCategory("verticals");
    } else if (path.startsWith("/recruitment")) {
      setActiveSubmenu("recruitment");
      setSelectedCategory("recruitment");
    } else {
      setActiveSubmenu(null);
    }
  }, [path]);

  useEffect(() => {
    if (hamburgerOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      if (top) {
        window.scrollTo(0, parseInt(top, 10) * -1);
      }
    }
  }, [hamburgerOpen]);

  const toggle = (menu: "verticals" | "sponsorship" | "recruitment" | "join-us" | "admin") =>
    setActiveSubmenu(prev => (prev === menu ? null : menu));

  const closeHamburger = () => setHamburgerOpen(false);

  const renderHamburgerSubmenu = () => {
    switch (selectedCategory) {
      case "verticals":
        return VERTICALS_SUBMENU.map(s => (
          <Link key={s.label} to={s.href} className="hamburger-sub-link" onClick={closeHamburger}>{s.label}</Link>
        ));
      case "recruitment":
        return RECRUITMENT_SUBMENU.map(s => (
          <Link key={s.label} to={s.href} className="hamburger-sub-link" onClick={closeHamburger}>{s.label}</Link>
        ));
      case "sponsorship":
        return (
          <div className="hamburger-sub-text">
            For sponsorship enquiries, email us at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=teamdhruva@rvce.edu.in" target="_blank" rel="noopener noreferrer" className="hamburger-email-link">teamdhruva@rvce.edu.in</a>
          </div>
        );
      case "join-us":
        return (
          <div className="hamburger-sub-text">
            Send us a letter of motivation and interests through Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=teamdhruva@rvce.edu.in" target="_blank" rel="noopener noreferrer" className="hamburger-email-link">teamdhruva@rvce.edu.in</a> and we will get back to you regarding your interview and evaluation as soon as possible
          </div>
        );
      default:
        return null;
    }
  };

  const hamburgerBtn = (
    <button
      className="hamburger-btn"
      onClick={() => setHamburgerOpen(true)}
      type="button"
      title="Menu"
      aria-label="Open menu"
    >
<svg viewBox="0 0 24 24" className="hamburger-icon" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
    </button>
  );

  return (
    <header className="site-header">
      <Link to="/" className="header-logo-mobile" onClick={closeHamburger} aria-label="Home">
        <svg viewBox="0 0 250 180" className="mobile-header-constellation" fill="currentColor">
          <circle cx="20"  cy="40"  r="7" />
          <circle cx="75"  cy="48"  r="7" />
          <circle cx="122" cy="92"  r="7" />
          <circle cx="119" cy="128" r="7" />
          <circle cx="172" cy="149" r="7" />
          <circle cx="191" cy="110" r="7" />
        </svg>
      </Link>
      {hamburgerBtn}

      {hamburgerOpen && (
        <div className="hamburger-overlay" onClick={closeHamburger}>
          <div className="hamburger-drawer" onClick={e => e.stopPropagation()}>
            <button className="hamburger-close-btn" onClick={closeHamburger} type="button" title="Close menu" aria-label="Close menu">
              <svg viewBox="0 0 24 24" className="hamburger-close-icon" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="hamburger-two-col">
              <div className="hamburger-left-col">
                {NAV_ITEMS.filter(item => !["Verticals", "Recruitment", "Sponsorship", "Join Us"].includes(item.label)).map(item => {
                  const isActive = path === item.href || (item.href !== "/" && path.startsWith(item.href));
                  if (item.external) {
                    return (
                      <a key={item.label} href={item.href} className={`hamburger-nav-link ${isActive ? "active" : ""}`} target="_blank" rel="noopener noreferrer" onClick={closeHamburger}>
                        {item.label}
                      </a>
                    );
                  }
                  return (
                    <Link key={item.label} to={item.href} className={`hamburger-nav-link ${isActive ? "active" : ""}`} onClick={closeHamburger}>
                      {item.label}
                    </Link>
                  );
                })}

                <div className="hamburger-category-divider" />

                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`hamburger-category-btn ${selectedCategory === cat.key ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.key)}
                    type="button"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="hamburger-divider-col" />

              <div className="hamburger-right-col">
                {renderHamburgerSubmenu()}
              </div>
            </div>

            <div className="hamburger-footer">
              {(!authResolved ? (
                <div className="hamburger-item-group">
                  <span className="hamburger-nav-link" style={{ opacity: 0.3, pointerEvents: "none" }}>Admin</span>
                </div>
              ) : currentUser ? (
                <div className="hamburger-item-group">
                  <Link to="/admin" className="hamburger-nav-link" onClick={closeHamburger}>Dashboard</Link>
                  <button className="hamburger-nav-btn" onClick={handleLogout} type="button" style={{ color: "rgba(220, 38, 38, 0.85)" }}>Logout</button>
                </div>
              ) : (
                <div className="hamburger-item-group">
                  <button
                    className={`hamburger-nav-link hamburger-nav-btn ${activeSubmenu === "admin" ? "expanded" : ""}`}
                    onClick={() => toggle("admin")}
                    type="button"
                  >
                    Admin
                    <svg viewBox="0 0 24 24" className="hamburger-chevron" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  {activeSubmenu === "admin" && (
                    <div className="hamburger-submenu-content">
                      {currentUser ? null : (
                        <form className="hamburger-login-form" onSubmit={handleLoginSubmit}>
                          <input type="text" placeholder="Username" className="hamburger-login-input" value={username} onChange={e => setUsername(e.target.value)} />
                          <input type="password" placeholder="Password" className="hamburger-login-input" value={password} onChange={e => setPassword(e.target.value)} />
                          <button type="submit" className="hamburger-login-submit">&gt;</button>
                          {loginError && (
                            <span className="hamburger-login-error">{loginError}</span>
                          )}
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="hamburger-social-links">
                {HAMBURGER_SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hamburger-social-link">{s.label}</a>
                ))}
              </div>
              <button type="button" className="hamburger-theme-toggle" onClick={toggleTheme}>
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
