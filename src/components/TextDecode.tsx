import { useEffect, useRef } from "react";

// Mixed pool: real letters + a few math symbols — keeps text readable mid-decode
const DECODE_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz∂∑∫∇√∞±αβγλμπσ";

const CHAR_STAGGER  = 40;  // ms between each character starting its decode
const SCRAMBLE_CYCLES = 7;  // random swaps before locking
const CYCLE_MS      = 36;  // ms per random swap

interface Props {
  text: string;
  className?: string;
  onComplete?: () => void;
}

export default function TextDecode({ text, className, onComplete }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mounted = true;
    let settled = 0;

    const chars = text.split("");
    const nonSpaces = chars.filter(c => c !== " ").length;

    // Build spans — start invisible so spans are ready before we reveal
    el.style.opacity = "0";
    el.innerHTML = "";

    const spans = chars.map(ch => {
      const s = document.createElement("span");
      if (ch === " ") {
        s.innerHTML = "&nbsp;";
      } else {
        s.textContent = DECODE_POOL[Math.floor(Math.random() * DECODE_POOL.length)];
        s.style.color = "rgb(150,150,162)";
      }
      el.appendChild(s);
      return s;
    });

    // Reveal element after one paint (avoids flash of empty)
    const showTimer = setTimeout(() => {
      if (mounted) el.style.opacity = "1";
    }, 30);

    // Decode each non-space character with staggered start
    chars.forEach((finalChar, i) => {
      if (finalChar === " ") return;

      setTimeout(() => {
        if (!mounted) return;
        let cycle = 0;

        const tick = () => {
          if (!mounted) return;

          if (cycle >= SCRAMBLE_CYCLES) {
            spans[i].textContent    = finalChar;
            spans[i].style.color    = "#475569";
            spans[i].style.transition = "color 0.2s ease";
            settled++;
            if (settled === nonSpaces) onComplete?.();
            return;
          }

          spans[i].textContent =
            DECODE_POOL[Math.floor(Math.random() * DECODE_POOL.length)];
          cycle++;
          setTimeout(tick, CYCLE_MS);
        };

        tick();
      }, i * CHAR_STAGGER);
    });

    return () => {
      mounted = false;
      clearTimeout(showTimer);
    };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return <p ref={ref} className={className} />;
}
