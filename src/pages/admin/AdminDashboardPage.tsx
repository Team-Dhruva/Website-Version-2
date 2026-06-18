import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { uploadFileToCloudinary } from "../../cloudinary";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import Breadcrumbs from "../../components/Breadcrumbs";
import SiteFooter from "../../components/SiteFooter";

// Types
interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  description?: string;
  createdAt?: number;
}

interface Chapter {
  id: number;
  title: string;
  markdown: string;
}

interface BlogItem {
  id: string;
  blogId: number; // static identifier
  title: string;
  description: string;
  image: string;
  link?: string;
  date?: string;
  author: string;
  chapters: Chapter[];
  nextChapterDate: string;
  lastUpdated: string;
}

interface EventItem {
  id: string;
  eventId: string; // static identifier
  title: string;
  subtitle?: string;
  description: string;
  speaker?: string;
  speakerAffiliation?: string;
  date: string;
  time?: string;
  venue: string;
  aboutSection: string;
  aboutSpeaker?: string;
  registrationLink?: string;
  registrationStatus: "open" | "closed";
}

interface MerchItem {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Direct login form states if accessed unauthorized
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"gallery" | "blogs" | "events" | "merchandise">("gallery");

  // Data States
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);

  // Loading States
  const [fetchingData, setFetchingData] = useState(false);

  // File Upload states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Form states - Gallery
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryAlt, setGalleryAlt] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Form states - Blogs
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogChapters, setBlogChapters] = useState<Chapter[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  // Temporary chapter editing states
  const [newChTitle, setNewChTitle] = useState("");
  const [newChMarkdown, setNewChMarkdown] = useState("");
  const [editingChIndex, setEditingChIndex] = useState<number | null>(null);

  // Form states - Events
  const [eventTitle, setEventTitle] = useState("");
  const [eventSubtitle, setEventSubtitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventSpeaker, setEventSpeaker] = useState("");
  const [eventSpeakerAff, setEventSpeakerAff] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventAbout, setEventAbout] = useState("");
  const [eventAboutSpeaker, setEventAboutSpeaker] = useState("");
  const [eventRegLink, setEventRegLink] = useState("");
  const [eventRegStatus, setEventRegStatus] = useState<"open" | "closed">("open");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form states - Merchandise
  const [merchFile, setMerchFile] = useState<File | null>(null);
  const [merchTitle, setMerchTitle] = useState("");
  const [merchCategory, setMerchCategory] = useState("");
  const [merchDesc, setMerchDesc] = useState("");
  const [editingMerchId, setEditingMerchId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return unsubscribe;
  }, []);

  // Fetch data when authenticated and active tab changes
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, activeTab]);

  // Design alignment logic from other vertical pages
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
  }, [currentUser]);

  // Fetch functions
  const fetchData = async () => {
    setFetchingData(true);
    try {
      if (activeTab === "gallery") {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: GalleryItem[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as GalleryItem);
        });
        setGallery(list);
      } else if (activeTab === "blogs") {
        const snap = await getDocs(collection(db, "blogs"));
        const list: BlogItem[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BlogItem);
        });
        setBlogs(list);
      } else if (activeTab === "events") {
        const snap = await getDocs(collection(db, "events"));
        const list: EventItem[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
        });
        setEvents(list);
      } else if (activeTab === "merchandise") {
        const snap = await getDocs(collection(db, "merchandise"));
        const list: MerchItem[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as MerchItem);
        });
        setMerch(list);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setFetchingData(false);
  };

  // Helper for uploading file to Cloudinary
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    setUploadProgress(0);
    try {
      const url = await uploadFileToCloudinary(file, folder);
      setUploadProgress(null);
      return url;
    } catch (e) {
      setUploadProgress(null);
      throw e;
    }
  };

  // Local login handler (matches the logic in header form)
  const handlePageLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    const email = loginUsername.includes("@") ? loginUsername : `${loginUsername}@rvce.edu.in`;
    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
      setLoginUsername("");
      setLoginPassword("");
    } catch (err: any) {
      setLoginErr("Invalid admin credentials");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Gallery CRUD Handlers
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let downloadUrl = "";
      if (galleryFile) {
        downloadUrl = await uploadFile(galleryFile, "gallery");
      }

      if (editingGalleryId) {
        const updateData: any = { alt: galleryAlt, description: galleryDesc };
        if (downloadUrl) updateData.src = downloadUrl;
        await updateDoc(doc(db, "gallery", editingGalleryId), updateData);
        setEditingGalleryId(null);
      } else {
        if (!downloadUrl) return alert("Please select an image file first.");
        await addDoc(collection(db, "gallery"), {
          src: downloadUrl,
          alt: galleryAlt,
          description: galleryDesc,
          createdAt: Date.now()
        });
      }
      setGalleryFile(null);
      setGalleryAlt("");
      setGalleryDesc("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving gallery item");
    }
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryAlt(item.alt);
    setGalleryDesc(item.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  // Blogs CRUD Handlers
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const blogData = {
        title: blogTitle,
        description: blogDesc,
        author: blogAuthor,
        image: blogImage,
        chapters: blogChapters,
        lastUpdated: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
        nextChapterDate: ""
      };

      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), blogData);
        setEditingBlogId(null);
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          blogId: Date.now()
        });
      }

      setBlogTitle("");
      setBlogDesc("");
      setBlogAuthor("");
      setBlogImage("");
      setBlogChapters([]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving blog");
    }
  };

  const handleEditBlog = (item: BlogItem) => {
    setEditingBlogId(item.id);
    setBlogTitle(item.title);
    setBlogDesc(item.description);
    setBlogAuthor(item.author);
    setBlogImage(item.image || "");
    setBlogChapters(item.chapters || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteDoc(doc(db, "blogs", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting blog");
    }
  };

  const addChapter = () => {
    if (!newChTitle) return alert("Chapter title is required");
    const newCh: Chapter = {
      id: blogChapters.length + 1,
      title: newChTitle,
      markdown: newChMarkdown
    };
    setBlogChapters([...blogChapters, newCh]);
    setNewChTitle("");
    setNewChMarkdown("");
  };

  const startEditChapter = (index: number) => {
    setEditingChIndex(index);
    setNewChTitle(blogChapters[index].title);
    setNewChMarkdown(blogChapters[index].markdown);
  };

  const saveEditedChapter = () => {
    if (editingChIndex === null) return;
    const updated = [...blogChapters];
    updated[editingChIndex] = {
      ...updated[editingChIndex],
      title: newChTitle,
      markdown: newChMarkdown
    };
    setBlogChapters(updated);
    setEditingChIndex(null);
    setNewChTitle("");
    setNewChMarkdown("");
  };

  const deleteChapter = (index: number) => {
    const updated = blogChapters.filter((_, i) => i !== index).map((ch, idx) => ({
      ...ch,
      id: idx + 1
    }));
    setBlogChapters(updated);
  };

  // Events CRUD Handlers
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        title: eventTitle,
        subtitle: eventSubtitle,
        description: eventDesc,
        speaker: eventSpeaker,
        speakerAffiliation: eventSpeakerAff,
        date: eventDate,
        time: eventTime,
        venue: eventVenue,
        aboutSection: eventAbout,
        aboutSpeaker: eventAboutSpeaker,
        registrationLink: eventRegLink,
        registrationStatus: eventRegStatus
      };

      if (editingEventId) {
        await updateDoc(doc(db, "events", editingEventId), eventData);
        setEditingEventId(null);
      } else {
        await addDoc(collection(db, "events"), {
          ...eventData,
          eventId: eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        });
      }

      setEventTitle("");
      setEventSubtitle("");
      setEventDesc("");
      setEventSpeaker("");
      setEventSpeakerAff("");
      setEventDate("");
      setEventTime("");
      setEventVenue("");
      setEventAbout("");
      setEventAboutSpeaker("");
      setEventRegLink("");
      setEventRegStatus("open");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };

  const handleEditEvent = (item: EventItem) => {
    setEditingEventId(item.id);
    setEventTitle(item.title);
    setEventSubtitle(item.subtitle || "");
    setEventDesc(item.description);
    setEventSpeaker(item.speaker || "");
    setEventSpeakerAff(item.speakerAffiliation || "");
    setEventDate(item.date);
    setEventTime(item.time || "");
    setEventVenue(item.venue);
    setEventAbout(item.aboutSection);
    setEventAboutSpeaker(item.aboutSpeaker || "");
    setEventRegLink(item.registrationLink || "");
    setEventRegStatus(item.registrationStatus);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  // Merchandise CRUD Handlers
  const handleMerchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let downloadUrl = "";
      if (merchFile) {
        downloadUrl = await uploadFile(merchFile, "merchandise");
      }

      const merchData: any = {
        title: merchTitle,
        category: merchCategory,
        description: merchDesc
      };
      if (downloadUrl) merchData.src = downloadUrl;

      if (editingMerchId) {
        await updateDoc(doc(db, "merchandise", editingMerchId), merchData);
        setEditingMerchId(null);
      } else {
        if (!downloadUrl) return alert("Please select a mockup image first.");
        await addDoc(collection(db, "merchandise"), merchData);
      }

      setMerchFile(null);
      setMerchTitle("");
      setMerchCategory("");
      setMerchDesc("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving merchandise item");
    }
  };

  const handleEditMerch = (item: MerchItem) => {
    setEditingMerchId(item.id);
    setMerchTitle(item.title);
    setMerchCategory(item.category);
    setMerchDesc(item.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMerch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this merchandise item?")) return;
    try {
      await deleteDoc(doc(db, "merchandise", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error deleting merchandise item");
    }
  };

  if (loadingUser) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container" style={{ minHeight: "90vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div className="vertical-project-card" style={{ maxWidth: "400px", width: "100%", pointerEvents: "auto" }}>
            <div className="card-content">
              <h2 className="card-title" style={{ fontSize: "1.4rem", marginBottom: "8px", textTransform: "uppercase", fontFamily: "monospace", letterSpacing: "0.05em" }}>Admin Auth</h2>
              <p className="card-desc" style={{ marginBottom: "24px", fontSize: "0.85rem" }}>Login to access the astronomy database management controls.</p>
              
              <form onSubmit={handlePageLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Username</label>
                  <input 
                    type="text" 
                    placeholder="e.g. admin" 
                    className="login-input" 
                    style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="login-input" 
                    style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                
                {loginErr && (
                  <p style={{ color: "rgba(220, 38, 38, 0.85)", fontSize: "0.75rem", margin: 0, fontFamily: "monospace" }}>{loginErr}</p>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: "100%", justifyContent: "center", marginTop: "8px", padding: "12px", cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  Authorize
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const allowedDomain = (email: string) =>
    email.endsWith("@rvce.edu.in") || email.endsWith("@gmail.com");

  if (!currentUser.email || !allowedDomain(currentUser.email)) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container" style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px", padding: "20px" }}>
          <h2 style={{ fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "1.2rem", color: "var(--text-color)" }}>Unauthorized</h2>
          <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "400px", textAlign: "center" }}>
            Your account does not have admin privileges. Only @rvce.edu.in or @gmail.com accounts can access the dashboard.
          </p>
          <button onClick={handleLogout} type="button" className="btn btn-primary" style={{ padding: "10px 24px", cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        
        {/* Header exact match with team and events */}
        <div ref={containerRef} className="radio-headline">
          <h1 ref={textRef} className="radio-headline-text">
            {"Database".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {/* Tab Controls */}
        <div style={{ marginTop: "40px", pointerEvents: "auto", display: "flex", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
          {(["gallery", "blogs", "events", "merchandise"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingGalleryId(null);
                setEditingBlogId(null);
                setEditingEventId(null);
                setEditingMerchId(null);
              }}
              className="side-nav-link admin-tab-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 16px",
                color: activeTab === tab ? (theme === "dark" ? "#ffffff" : "#18181b") : "var(--text-muted)",
                fontWeight: activeTab === tab ? "600" : "400",
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.35rem",
                letterSpacing: "-0.01em"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button 
            onClick={handleLogout} 
            className="side-nav-link"
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: "8px 16px", color: "rgba(220, 38, 38, 0.85)", fontFamily: "'Inter', sans-serif", fontSize: "1.35rem", textTransform: "none", display: "flex", alignItems: "center", gap: "6px" }}
            title="Logout"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="admin-logout-label">Logout</span>
          </button>
        </div>

        {/* Upload progress indicator */}
        {uploadProgress !== null && (
          <div style={{ pointerEvents: "auto", marginTop: "20px", padding: "16px", background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "4px" }}>
            <p style={{ margin: "0", fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-color)" }}>Uploading to Cloudinary…</p>
          </div>
        )}

        <div className="admin-dashboard-grid" style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "40px", pointerEvents: "auto" }}>
          
          {/* LEFT COLUMN: Manage Form */}
          <div>
            <div className="vertical-project-card" style={{ width: "100%" }}>
              <div className="card-content">
                
                {/* GALLERY FORM */}
                {activeTab === "gallery" && (
                  <form onSubmit={handleGallerySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Image File {editingGalleryId && "(Optional to replace)"}</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)}
                        style={{ color: "inherit", fontSize: "0.8rem" }}
                        required={!editingGalleryId}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Alt Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Stargazing Event Setup"
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={galleryAlt}
                        onChange={e => setGalleryAlt(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Detailed details about the capture, setup, or context..."
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "inherit", fontSize: "0.85rem", resize: "vertical" }}
                        value={galleryDesc}
                        onChange={e => setGalleryDesc(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {editingGalleryId ? "Save Image" : "Upload Image"}
                    </button>
                    {editingGalleryId && (
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditingGalleryId(null); setGalleryAlt(""); setGalleryDesc(""); }} style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>Cancel</button>
                    )}
                  </form>
                )}

                {/* BLOGS FORM */}
                {activeTab === "blogs" && (
                  <form onSubmit={handleBlogSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Blog Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Beyond earth: Life among stars"
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={blogTitle}
                        onChange={e => setBlogTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Description / Summary</label>
                      <textarea 
                        rows={3}
                        placeholder="Brief summary of the blog post..."
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "inherit", fontSize: "0.85rem" }}
                        value={blogDesc}
                        onChange={e => setBlogDesc(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Author Name(s)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nishtha Chakraborty"
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={blogAuthor}
                        onChange={e => setBlogAuthor(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Cover Image URL (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={blogImage}
                        onChange={e => setBlogImage(e.target.value)}
                      />
                    </div>

                    {/* CHAPTERS SECTION inside form */}
                    <div style={{ border: "1px solid var(--border-color)", padding: "16px", borderRadius: "4px", marginTop: "10px", background: "rgba(0,0,0,0.01)" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-color)" }}>Chapters Manager ({blogChapters.length})</h4>
                      
                      {/* Chapter list */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                        {blogChapters.map((ch, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.03)", padding: "6px 10px", borderRadius: "3px", fontSize: "0.8rem" }}>
                            <span>Ch {ch.id}: {ch.title}</span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button type="button" onClick={() => startEditChapter(idx)} style={{ border: "none", background: "none", cursor: "pointer", color: "inherit", textDecoration: "underline" }}>Edit</button>
                              <button type="button" onClick={() => deleteChapter(idx)} style={{ border: "none", background: "none", cursor: "pointer", color: "rgba(220, 38, 38, 0.85)" }}>Del</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add/Edit Chapter form */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                        <input 
                          type="text" 
                          placeholder="Chapter Title"
                          className="login-input"
                          style={{ width: "100%", padding: "8px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontSize: "0.8rem" }}
                          value={newChTitle}
                          onChange={e => setNewChTitle(e.target.value)}
                        />
                        <textarea 
                          rows={6}
                          placeholder="# Markdown Title\n\nChapter body content here..."
                          style={{ width: "100%", padding: "8px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "monospace", fontSize: "0.78rem" }}
                          value={newChMarkdown}
                          onChange={e => setNewChMarkdown(e.target.value)}
                        />
                        {editingChIndex !== null ? (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button type="button" onClick={saveEditedChapter} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.75rem", cursor: "pointer" }}>Save Chapter</button>
                            <button type="button" onClick={() => { setEditingChIndex(null); setNewChTitle(""); setNewChMarkdown(""); }} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.75rem", cursor: "pointer" }}>Cancel</button>
                          </div>
                        ) : (
                          <button type="button" onClick={addChapter} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.75rem", alignSelf: "flex-start", cursor: "pointer" }}>+ Add Chapter</button>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "10px" }}>
                      {editingBlogId ? "Save Blog Post" : "Create Blog Post"}
                    </button>
                    {editingBlogId && (
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditingBlogId(null); setBlogTitle(""); setBlogDesc(""); setBlogAuthor(""); setBlogImage(""); setBlogChapters([]); }} style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>Cancel</button>
                    )}
                  </form>
                )}

                {/* EVENTS FORM */}
                {activeTab === "events" && (
                  <form onSubmit={handleEventSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Event Title</label>
                        <input 
                          type="text" 
                          placeholder="Einstein Lectures"
                          className="login-input"
                          value={eventTitle}
                          onChange={e => setEventTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Subtitle</label>
                        <input 
                          type="text" 
                          placeholder="The Six Faces of..."
                          className="login-input"
                          value={eventSubtitle}
                          onChange={e => setEventSubtitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Description (Short snippet)</label>
                      <input 
                        type="text" 
                        placeholder="Explore the life and contributions of..."
                        className="login-input"
                        value={eventDesc}
                        onChange={e => setEventDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Speaker Name</label>
                        <input 
                          type="text" 
                          placeholder="Rajaram Nityananda"
                          className="login-input"
                          value={eventSpeaker}
                          onChange={e => setEventSpeaker(e.target.value)}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Speaker Affiliation</label>
                        <input 
                          type="text" 
                          placeholder="ICTS-TIFR, Bengaluru"
                          className="login-input"
                          value={eventSpeakerAff}
                          onChange={e => setEventSpeakerAff(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Date</label>
                        <input 
                          type="text" 
                          placeholder="October 29, 2024"
                          className="login-input"
                          value={eventDate}
                          onChange={e => setEventDate(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Time</label>
                        <input 
                          type="text" 
                          placeholder="11:30 AM - 1:00 PM"
                          className="login-input"
                          value={eventTime}
                          onChange={e => setEventTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Venue</label>
                      <input 
                        type="text" 
                        placeholder="TE Seminar Hall, RVCE"
                        className="login-input"
                        value={eventVenue}
                        onChange={e => setEventVenue(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>About the Event (Full narrative)</label>
                      <textarea 
                        rows={4}
                        placeholder="Detailed details about what will be covered in the event..."
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "inherit", fontSize: "0.85rem" }}
                        value={eventAbout}
                        onChange={e => setEventAbout(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>About the Speaker Bio</label>
                      <textarea 
                        rows={3}
                        placeholder="Brief biography of the speaker..."
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "inherit", fontSize: "0.85rem" }}
                        value={eventAboutSpeaker}
                        onChange={e => setEventAboutSpeaker(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Registration Link</label>
                        <input 
                          type="text" 
                          placeholder="https://..."
                          className="login-input"
                          value={eventRegLink}
                          onChange={e => setEventRegLink(e.target.value)}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)" }}>Status</label>
                        <select 
                          className="login-input" 
                          style={{ padding: "9px", background: "rgba(0,0,0,0.02)", color: "inherit" }}
                          value={eventRegStatus}
                          onChange={e => setEventRegStatus(e.target.value as any)}
                        >
                          <option value="open" style={{ color: "#000" }}>Open</option>
                          <option value="closed" style={{ color: "#000" }}>Closed</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {editingEventId ? "Save Event Details" : "Create Event"}
                    </button>
                    {editingEventId && (
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditingEventId(null); setEventTitle(""); setEventSubtitle(""); setEventDesc(""); setEventSpeaker(""); setEventSpeakerAff(""); setEventDate(""); setEventTime(""); setEventVenue(""); setEventAbout(""); setEventAboutSpeaker(""); setEventRegLink(""); setEventRegStatus("open"); }} style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>Cancel</button>
                    )}
                  </form>
                )}

                {/* MERCHANDISE FORM */}
                {activeTab === "merchandise" && (
                  <form onSubmit={handleMerchSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Mockup Image File {editingMerchId && "(Optional to replace)"}</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setMerchFile(e.target.files ? e.target.files[0] : null)}
                        style={{ color: "inherit", fontSize: "0.8rem" }}
                        required={!editingMerchId}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Mockup Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hoodie Front View"
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={merchTitle}
                        onChange={e => setMerchTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Category</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hoodie or Varsity Details"
                        className="login-input"
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit" }}
                        value={merchCategory}
                        onChange={e => setMerchCategory(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Detailed details about designs and specs..."
                        style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-color)", borderRadius: "4px", color: "inherit", fontFamily: "inherit", fontSize: "0.85rem" }}
                        value={merchDesc}
                        onChange={e => setMerchDesc(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {editingMerchId ? "Save Item" : "Create Item"}
                    </button>
                    {editingMerchId && (
                      <button type="button" className="btn btn-ghost" onClick={() => { setEditingMerchId(null); setMerchTitle(""); setMerchCategory(""); setMerchDesc(""); setMerchFile(null); }} style={{ cursor: "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>Cancel</button>
                    )}
                  </form>
                )}

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Database View */}
          <div className="admin-dashboard-records" style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "10px" }}>
            <h2 className="vertical-section-title" style={{ fontFamily: "'Inter', sans-serif", fontWeight: "600", fontSize: "1.35rem", marginBottom: "20px", textTransform: "none", letterSpacing: "-0.02em" }}>
              Active Database Records
            </h2>

            {fetchingData ? (
              <p style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.8rem" }}>QUERYING DB...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* GALLERY LIST */}
                {activeTab === "gallery" && gallery.length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No gallery items in database. Fallback content is active on the website.</p>
                )}
                {activeTab === "gallery" && gallery.map((item) => (
                  <div key={item.id} className="vertical-project-card" style={{ display: "flex", flexDirection: "row", gap: "16px", padding: "12px" }}>
                    <img src={item.src} alt={item.alt} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", fontWeight: 600 }}>{item.alt}</h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>
                      </div>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        <button onClick={() => handleEditGallery(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.75rem", padding: 0 }}>Edit</button>
                        <button onClick={() => handleDeleteGallery(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220, 38, 38, 0.85)", fontSize: "0.75rem", padding: 0 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* BLOGS LIST */}
                {activeTab === "blogs" && blogs.length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No blogs in database. Fallback content is active on the website.</p>
                )}
                {activeTab === "blogs" && blogs.map((item) => (
                  <div key={item.id} className="vertical-project-card" style={{ padding: "16px" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>By {item.author} · {item.chapters.length} chapters · Updated {item.lastUpdated}</p>
                    <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem" }}>{item.description.substring(0, 100)}...</p>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <button onClick={() => handleEditBlog(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.75rem", padding: 0 }}>Edit</button>
                      <button onClick={() => handleDeleteBlog(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220, 38, 38, 0.85)", fontSize: "0.75rem", padding: 0 }}>Delete</button>
                    </div>
                  </div>
                ))}

                {/* EVENTS LIST */}
                {activeTab === "events" && events.length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No events in database. Fallback content is active on the website.</p>
                )}
                {activeTab === "events" && events.map((item) => (
                  <div key={item.id} className="vertical-project-card" style={{ padding: "16px" }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.date} · {item.venue} · Reg: <span style={{ color: item.registrationStatus === "open" ? "#22c55e" : "rgba(220,38,38,0.85)", fontWeight: "500" }}>{item.registrationStatus.charAt(0).toUpperCase() + item.registrationStatus.slice(1)}</span></p>
                    <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem" }}>{item.description}</p>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <button onClick={() => handleEditEvent(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.75rem", padding: 0 }}>Edit</button>
                      <button onClick={() => handleDeleteEvent(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220, 38, 38, 0.85)", fontSize: "0.75rem", padding: 0 }}>Delete</button>
                    </div>
                  </div>
                ))}

                {/* MERCHANDISE LIST */}
                {activeTab === "merchandise" && merch.length === 0 && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No merchandise mockups in database. Fallback content is active.</p>
                )}
                {activeTab === "merchandise" && merch.map((item) => (
                  <div key={item.id} className="vertical-project-card" style={{ display: "flex", flexDirection: "row", gap: "16px", padding: "12px" }}>
                    <img src={item.src} alt={item.title} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: "0.62rem", textTransform: "uppercase", background: "rgba(113,113,122,0.1)", color: "var(--text-muted)", padding: "2px 6px", borderRadius: "2px" }}>{item.category}</span>
                        <h4 style={{ margin: "4px 0 4px 0", fontSize: "0.95rem", fontWeight: 600 }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.description}</p>
                      </div>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        <button onClick={() => handleEditMerch(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", textDecoration: "underline", fontSize: "0.75rem", padding: 0 }}>Edit</button>
                        <button onClick={() => handleDeleteMerch(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(220, 38, 38, 0.85)", fontSize: "0.75rem", padding: 0 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>

      </div>
      
      <SiteFooter />
    </main>
  );
}
