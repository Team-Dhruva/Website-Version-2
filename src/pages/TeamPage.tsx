import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

interface Member {
  name: string;
  role: string;
}

interface FireMember {
  id: string;
  name: string;
  role: string;
  batch: string;
}

const TEAM_DATA: Record<string, { label: string; members: Member[] }> = {
  "2024-core": {
    label: "2024 Core Team",
    members: [
      { name: "Aryan", role: "Team Captain" },
      { name: "Khushi", role: "Team Captain" },
      { name: "Srujan", role: "Treasurer and Optical Head" },
      { name: "Prarthana", role: "DDA Head" },
      { name: "Atharva", role: "Coding Lead" },
      { name: "Suravi", role: "ML Lead" },
      { name: "Harsha", role: "Optical Electronics Lead" },
      { name: "Srinidhi", role: "Optical Electronics Lead" },
      { name: "Yogesh", role: "Radio Head" },
      { name: "Rutvik", role: "Radio AstroLead" },
      { name: "Manav", role: "Radio Research Lead" },
      { name: "Aditya", role: "Radio Research Lead" },
      { name: "Sricharan", role: "Radio Electronics Lead" },
      { name: "Vineet", role: "Radio Electronics Lead" },
      { name: "Vibha", role: "Research Lead" },
      { name: "Deepthi", role: "Indian Astrophysics Lead" },
      { name: "Nitya", role: "Journals Lead" },
      { name: "Amrutha", role: "PR POC" },
    ]
  },
  "2024-semi": {
    label: "2024 Semi-Core Team",
    members: [
      { name: "Tejas R", role: "Team Captain" },
      { name: "Krishna Vidhiprasad", role: "Team Captain" }
    ]
  },
  "2023-core": {
    label: "2023 Core Team",
    members: [
      { name: "Aryan Namboodiri", role: "Team Captain" },
      { name: "Khushi Ligade", role: "Team Captain" },
      { name: "Sunil Joshi", role: "Technical Lead" },
      { name: "Aditi Pai", role: "PR Lead" },
      { name: "Vinay", role: "Optical Head" },
      { name: "Shashank", role: "Optical Head" },
      { name: "Rohith Gowda M", role: "Radio Head" },
      { name: "Harshhitha", role: "Radio Head" },
      { name: "Aneesh Adiga", role: "DDA Head" },
      { name: "Sanjan", role: "DDA Head" },
      { name: "Akash M P", role: "Research Head" },
      { name: "Abhishek S", role: "Event Management Head" }
    ]
  },
  "faculty": {
    label: "Faculty Advisors",
    members: [
      { name: "Dr. Niranjana K M", role: "Faculty Advisor" },
      { name: "Dr. Venugopal K", role: "Faculty Advisor" }
    ]
  }
};

const BATCH_ORDER = ["faculty", "2024-core", "2024-semi", "2023-core"];

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [fireMembers, setFireMembers] = useState<FireMember[]>([]);
  const [mergedData, setMergedData] = useState<Record<string, { label: string; members: Member[] }>>(TEAM_DATA);

  // Fetch Firestore team members and merge with static data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snap = await getDocs(collection(db, "team"));
        const list: FireMember[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as FireMember);
        });
        setFireMembers(list);
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (fireMembers.length === 0) return;
    const merged = { ...TEAM_DATA };
    fireMembers.forEach((m) => {
      if (!merged[m.batch]) {
        merged[m.batch] = { label: m.batch, members: [] };
      }
      merged[m.batch].members.push({ name: m.name, role: m.role });
    });
    setMergedData(merged);
  }, [fireMembers]);

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
  }, []);

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        <div ref={containerRef} className="radio-headline">
          <h1 ref={textRef} className="radio-headline-text">
            {"Our Team".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        <div style={{ marginTop: "40px", pointerEvents: "auto", display: "flex", flexDirection: "column", gap: "60px" }}>
            {[...BATCH_ORDER, ...Object.keys(mergedData).filter(k => !BATCH_ORDER.includes(k))].map((batchKey) => {
            const batch = mergedData[batchKey];
            if (!batch) return null;
            return (
              <div key={batchKey} className="team-table-container">
                <h2 className="vertical-section-title" style={{ fontFamily: "'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, sans-serif", fontSize: "1.8rem", marginBottom: "24px", fontWeight: "600" }}>
                  {batch.label}
                </h2>
                
                <table className="radio-projects-table">
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "320px" }} />
                    <col style={{ width: "auto" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="col-sno">Serial</th>
                      <th>Member Name</th>
                      <th>Role / Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.members.map((member, idx) => (
                      <tr key={idx}>
                        <td className="col-sno">{idx + 1}</td>
                        <td className="team-member-name">{member.name}</td>
                        <td>{member.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
