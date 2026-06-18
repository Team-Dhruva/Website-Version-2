import { Outlet } from "react-router-dom";
import SpacetimeGrid from "./SpacetimeGrid";
import SiteHeader from "./SiteHeader";

export default function Layout() {
  return (
    <div className="app-container">
      <SpacetimeGrid />
      <SiteHeader />
      <Outlet />
    </div>
  );
}
