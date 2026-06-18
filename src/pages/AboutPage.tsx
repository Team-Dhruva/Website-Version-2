import Breadcrumbs from "../components/Breadcrumbs";
import AboutSection from "../components/AboutSection";
import SiteFooter from "../components/SiteFooter";

export default function AboutPage() {
  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <AboutSection />
      <SiteFooter />
    </main>
  );
}
