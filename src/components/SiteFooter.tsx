import { FiMapPin, FiInstagram, FiLinkedin, FiGithub, FiYoutube, FiMail } from "react-icons/fi";

const FOOTER_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/dhruva_rvce/",     icon: "instagram" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/dhruva-astronomy", icon: "linkedin" },
  { label: "GitHub",    href: "https://github.com/Team-Dhruva",            icon: "github" },
  { label: "YouTube",   href: "https://www.youtube.com/@dhruva1910",       icon: "youtube" },
];

const SOCIAL_ICON_SIZE = 18;
const renderSocialIcon = (icon: string) => {
  const s = { width: SOCIAL_ICON_SIZE, height: SOCIAL_ICON_SIZE };
  switch (icon) {
    case "instagram": return <FiInstagram {...s} />;
    case "linkedin":  return <FiLinkedin {...s} />;
    case "github":    return <FiGithub {...s} />;
    case "youtube":   return <FiYoutube {...s} />;
    default:          return null;
  }
};

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=teamdhruva@rvce.edu.in" target="_blank" rel="noopener noreferrer" className="footer-col-link">
              <FiMail size={14} /> teamdhruva@rvce.edu.in
            </a>
            <a href="https://maps.google.com/?q=12.9233,77.4988" target="_blank" rel="noopener noreferrer" className="footer-col-link">
              <FiMapPin size={14} /> 12.9233° N 77.4988° E
            </a>
            <span className="footer-col-text">Est. 2018 · @ RVCE</span>
          </div>

          <div className="footer-col footer-col-social">
            <div className="footer-col-socials">
              {FOOTER_SOCIALS.map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="footer-col-link" title={item.label}>
                  {renderSocialIcon(item.icon)}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <span className="footer-col-text" style={{ marginTop: "28px", fontSize: "0.72rem", opacity: 0.6, textAlign: "center", width: "100%" }}>© 2026 Team Dhruva | MIT License</span>
      </div>
    </footer>
  );
}
