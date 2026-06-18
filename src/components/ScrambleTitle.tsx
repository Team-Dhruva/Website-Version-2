import { useEffect, useRef } from "react";

// ── Final characters ──────────────────────────────────────────────────────────
const FINAL = ["ð", "ħ", "R", "μ", "V", "α"];

// ── Near-miss pools: glyphs that look like the final char ────────────────────
// These play in the last ~380ms before each letter locks — creates the "almost"
// feeling right before the snap.
const NEAR_MISS: string[][] = [
  ["δ", "∂", "d", "ð", "δ", "∂", "ð"],   // → ð
  ["ħ", "ℏ", "h", "ħ", "ℏ", "ħ", "h"],   // → ħ
  ["ℜ", "ℝ", "Ρ", "R", "ℜ", "R", "Ρ"],   // → R
  ["υ", "ν", "u", "μ", "υ", "μ", "ν"],   // → μ
  ["∨", "ν", "V", "∨", "ν", "V", "∨"],   // → V
  ["α", "a", "ɑ", "α", "a", "α", "ɑ"],   // → α
];

// ── Wide chaos pool ───────────────────────────────────────────────────────────
const POOL = [
  // Greek upper + lower
  "Α","Β","Γ","Δ","Ε","Ζ","Η","Θ","Ι","Κ","Λ","Μ","Ν","Ξ","Π","Ρ","Σ","Τ","Υ","Φ","Χ","Ψ","Ω",
  "α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","π","ρ","σ","τ","υ","φ","χ","ψ","ω",
  // Math / physics
  "∂","∑","∏","∫","∬","∮","∇","∆","√","∞","∅","∝","ℏ","ℜ","ℑ","ℓ",
  "⊕","⊗","⊘","⊙","⊂","⊃","∈","∉","∩","∪","≠","≡","≈","±",
  // Latin extended
  "ð","ħ","ß","æ","ø","þ","Ð","Ħ","ℕ","ℤ","ℚ","ℝ","ℂ",
  // Elder Futhark runes
  "ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ",
  // Cyrillic
  "Д","Ж","З","И","Й","Л","Ф","Х","Ц","Ч","Ш","Щ","Ю","Я","Э","Ъ","Ы",
  // Logic / arrows
  "→","←","↑","↓","⇒","⇔","∀","∃","∄","¬","∧","∨",
];

// ── Settle order: which character locks first → last ──────────────────────────
// [2,0,4,1,5,3] = R first, then ð, V, ħ, α, μ last  (not left-to-right)
const SETTLE_ORDER = [2, 0, 4, 1, 5, 3];

const FAST_MS      = 75;   // ms between frames during chaos
const NEAR_MS      = 105;  // ms during near-miss (slightly slower = more tension)
const DECEL_MAX    = 430;  // ms at the slowest point of decel
const SETTLE_BASE  = 1500; // ms when the first char begins settling
const SETTLE_STEP  = 380;  // ms stagger between each char's settlement start
const NEAR_LEAD    = 380;  // ms before settle to switch to near-miss pool
const DECEL_DUR    = 540;  // ms of deceleration before hard lock

interface Props { onComplete?: () => void; }

export default function ScrambleTitle({ onComplete }: Props) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeoutRefs = useRef<(number | undefined)[]>([]);

  const startSettle = () => {
    let doneCount = 0;
    const settleStart = Date.now();
    
    FINAL.forEach((finalChar, i) => {
      const el = charRefs.current[i];
      if (!el) return;
      
      const settleAt = SETTLE_BASE + SETTLE_ORDER.indexOf(i) * SETTLE_STEP;
      const nearAt = settleAt - NEAR_LEAD;
      const doneAt = settleAt + DECEL_DUR;
      
      clearTimeout(timeoutRefs.current[i]);
      
      const tick = () => {
        const elapsed = Date.now() - settleStart;
        
        // Locked
        if (elapsed >= doneAt) {
          el.textContent = finalChar;
          el.style.color = "var(--text-color)";
          el.style.transition = "color 0.3s ease";
          
          doneCount++;
          if (doneCount === FINAL.length) {
            onComplete?.();
          }
          return;
        }
        
        // Decelerating
        if (elapsed >= settleAt) {
          const t = (elapsed - settleAt) / DECEL_DUR;
          const pool = NEAR_MISS[i];
          el.textContent = pool[Math.floor(Math.random() * pool.length)];
          const isDark = document.documentElement.classList.contains("dark");
          const g = isDark
            ? Math.round(150 + t * t * 90)
            : Math.round(150 - t * t * 120);
          el.style.color = `rgb(${g},${g},${g + 10})`;
          
          timeoutRefs.current[i] = window.setTimeout(tick, FAST_MS + t * t * DECEL_MAX);
          return;
        }
        
        // Near-miss
        if (elapsed >= nearAt) {
          const pool = NEAR_MISS[i];
          el.textContent = pool[Math.floor(Math.random() * pool.length)];
          timeoutRefs.current[i] = window.setTimeout(tick, NEAR_MS);
          return;
        }
        
        // Chaos
        el.textContent = POOL[Math.floor(Math.random() * POOL.length)];
        el.style.color = "rgb(150,150,162)";
        timeoutRefs.current[i] = window.setTimeout(tick, FAST_MS);
      };
      
      const startDelay = 80 + Math.random() * 720;
      el.textContent = POOL[Math.floor(Math.random() * POOL.length)];
      el.style.color = "rgb(150,150,162)";
      timeoutRefs.current[i] = window.setTimeout(tick, startDelay);
    });
  };

  useEffect(() => {
    startSettle();
    
    // Safety fallback
    const maxSettleAt = SETTLE_BASE + (FINAL.length - 1) * SETTLE_STEP;
    const maxDoneAt = maxSettleAt + DECEL_DUR;
    const fallback = setTimeout(() => {
      onComplete?.();
    }, maxDoneAt + 400);
    
    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t));
      clearTimeout(fallback);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <h1
      className="hero-title"
      style={{ cursor: "default", userSelect: "none" }}
    >
      {FINAL.map((_, i) => (
        <span key={i} ref={el => { charRefs.current[i] = el; }} className="scramble-char">
          {FINAL[i]}
        </span>
      ))}
    </h1>
  );
}
