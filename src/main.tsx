import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import VerticalPage from './pages/VerticalPage.tsx'
import EventsPage from './pages/EventsPage.tsx'
import RecruitmentBatchPage from './pages/RecruitmentBatchPage.tsx'
import GalleryPage from './pages/GalleryPage.tsx'
import BlogPage from './pages/BlogPage.tsx'
import TeamPage from './pages/TeamPage.tsx'
import MerchandisePage from './pages/MerchandisePage.tsx'
import IndianAstrophysicsPage from './pages/IndianAstrophysicsPage.tsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx'
import Layout from './components/Layout.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/verticals/:slug" element={<VerticalPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/recruitment/:epoch" element={<RecruitmentBatchPage />} />
          <Route path="/recruitment" element={<RecruitmentBatchPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/merchandise" element={<MerchandisePage />} />
          <Route path="/indian-astrophysics" element={<IndianAstrophysicsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

