import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteFooter from "../components/SiteFooter";

interface MerchItem {
  src: string;
  title: string;
  category: string;
  description: string;
}

const MERCH_ITEMS: MerchItem[] = [
  {
    src: "/merchandise/FFmockup.webp",
    title: "Hoodie Front View",
    category: "Hoodie",
    description: "Astrophysics logo coordinates printed in high-density silver ink on front chest."
  },
  {
    src: "/merchandise/FBmockup.webp",
    title: "Hoodie Back View",
    category: "Hoodie",
    description: "Full back blueprint layout illustrating radio astronomy horn calculations and waveguide geometry."
  },
  {
    src: "/merchandise/SHmockup.webp",
    title: "Hoodie Sleeve Design",
    category: "Hoodie",
    description: "LIGO gravitational wave frequency signal trace printed along the sleeve."
  },
  {
    src: "/merchandise/Back element.webp",
    title: "Varsity Back Design Element",
    category: "Varsity Details",
    description: "Full spacetime curvature and coordinate vector layout for the back panel of the Varsity Jacket."
  }
];

export default function MerchandisePage() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>(MERCH_ITEMS);

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const snap = await getDocs(collection(db, "merchandise"));
        const list: MerchItem[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as MerchItem);
        });
        if (list.length > 0) {
          setMerchItems([...list, ...MERCH_ITEMS]);
        }
      } catch (err) {
        console.error("Error loading merchandise from Firestore, using static fallback:", err);
      }
    };
    fetchMerch();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Match the header padding and title font size logic from vertical page/events
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
    <>
      <main className="page-scroll">
        <Breadcrumbs />
        <div className="vertical-page-container">
          <div ref={containerRef} className="radio-headline">
            <h1 ref={textRef} className="radio-headline-text">
              {"Merchandise".split("").map((ch, i) => (
                <span key={i}>{ch === " " ? " " : ch}</span>
              ))}
            </h1>
          </div>

          <div className="merch-grid-container" style={{ marginTop: "40px", pointerEvents: "auto" }}>
            {merchItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className="merch-card"
                >
                  <div className="merch-img-wrapper">
                    <img src={item.src} alt={item.title} className="merch-img" loading="lazy" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <SiteFooter />
      </main>
    </>
  );
}
