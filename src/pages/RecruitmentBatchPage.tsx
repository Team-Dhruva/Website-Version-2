import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { RECRUITMENT_DATA, DEPARTMENTS, EpochData } from "../data/recruitmentData";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

interface FireRecruit {
  id: string;
  name: string;
  semester: string;
  epoch: string;
  department: string;
}

export default function RecruitmentBatchPage() {
  const { epoch } = useParams<{ epoch: string }>();

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const epochId = epoch || "J2024.7";
  const [fireRecruits, setFireRecruits] = useState<FireRecruit[]>([]);
  const [fireEpochs, setFireEpochs] = useState<{epoch: string; label: string}[]>([]);
  const [epochData, setEpochData] = useState(RECRUITMENT_DATA[epochId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "recruitment"));
        const list: FireRecruit[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as FireRecruit);
        });
        setFireRecruits(list);
      } catch (err) {
        console.error("Error fetching recruits:", err);
      }
      try {
        const epochSnap = await getDocs(collection(db, "recruitment-epochs"));
        const epochList: {epoch: string; label: string}[] = [];
        epochSnap.forEach(docSnap => {
          const d = docSnap.data() as any;
          epochList.push({ epoch: d.epoch, label: d.label });
        });
        setFireEpochs(epochList);
      } catch (err) {
        console.error("Error fetching epochs:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const staticData = RECRUITMENT_DATA[epochId];
    if (staticData) {
      const merged = JSON.parse(JSON.stringify(staticData));
      fireRecruits.filter(r => r.epoch === epochId).forEach((r) => {
        if (!merged.recruits[r.department]) {
          merged.recruits[r.department] = [];
        }
        merged.recruits[r.department].push({ name: r.name, semester: r.semester });
      });
      setEpochData(merged);
    } else {
      const matched = fireRecruits.filter(r => r.epoch === epochId);
      if (matched.length > 0 || fireEpochs.some(e => e.epoch === epochId)) {
        const dynamic: EpochData = {
          epoch: epochId,
          label: fireEpochs.find(e => e.epoch === epochId)?.label || `Epoch ${epochId}`,
          recruits: {}
        };
        matched.forEach((r) => {
          if (!dynamic.recruits[r.department]) {
            dynamic.recruits[r.department] = [];
          }
          dynamic.recruits[r.department].push({ name: r.name, semester: r.semester });
        });
        setEpochData(dynamic);
      } else {
        setEpochData(undefined as any);
      }
    }
  }, [epochId, fireRecruits, fireEpochs]);

  // Match the header padding and title font size logic from vertical page
  useEffect(() => {
    if (!epochData) return;

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
  }, [epochId, epochData]);

  if (!epochData) {
    return (
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container" style={{ paddingTop: "150px" }}>
          <h1 className="vertical-title-text">Epoch Not Found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="page-scroll">
      <Breadcrumbs />
      <div className="vertical-page-container">
        <div ref={containerRef} className="radio-headline">
          <h1 ref={textRef} className="radio-headline-text">
            {epochData.label.split("").map((ch, i) => (
              <span key={i}>{ch === " " ? " " : ch}</span>
            ))}
          </h1>
        </div>

        {Object.keys(epochData.recruits).length > 0 && (
          <div style={{ marginTop: "40px", pointerEvents: "auto" }}>
            <div className="recruit-branches-container" style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
              {Object.entries(epochData.recruits).map(([branchCode, recruitsList]) => {
                const branchName = DEPARTMENTS[branchCode] || branchCode;
                return (
                  <div key={branchCode} className="recruit-branch-section">
                    <h3 style={{ fontFamily: "'Helvetica Neue', 'HelveticaNeue', Helvetica, Arial, sans-serif", fontSize: "1.15rem", fontWeight: "600", color: "var(--text-color)", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "8px", marginBottom: "16px" }}>
                      {branchName} ({branchCode.toUpperCase()})
                    </h3>
                    <table className="radio-projects-table">
                      <colgroup>
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "320px" }} />
                        <col style={{ width: "auto" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="col-sno">Serial</th>
                          <th>Candidate Name</th>
                          <th>Semester</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recruitsList.map((rec, idx) => (
                          <tr key={idx}>
                            <td className="col-sno">{idx + 1}</td>
                            <td>{rec.name}</td>
                            <td>{rec.semester}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
