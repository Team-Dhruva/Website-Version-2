/**
 * GlassDivider — a narrow strip of Voronoi-style polygon facets
 * used as a visual section separator. Pure SVG, deterministic layout.
 */

interface GlassDividerProps {
  flip?: boolean;
  className?: string;
}

const FACETS = [
  // Each entry: [points-string, fill-index]
  // Generated manually to fill a 1400×36 viewBox
  ["0,0 148,0 122,36 0,36",         0],
  ["148,0 290,0 265,36 122,36",     2],
  ["290,0 412,0 440,36 265,36",     1],
  ["412,0 580,0 558,36 440,36",     3],
  ["580,0 700,0 720,36 558,36",     0],
  ["700,0 840,0 815,36 720,36",     2],
  ["840,0 960,0 988,36 815,36",     1],
  ["960,0 1105,0 1078,36 988,36",   3],
  ["1105,0 1240,0 1265,36 1078,36", 0],
  ["1240,0 1400,0 1400,36 1265,36", 2],
] as const;

const FILLS = [
  "rgba(126,200,200,0.09)",
  "rgba(180,225,225,0.07)",
  "rgba(210,238,238,0.08)",
  "rgba(232,244,244,0.06)",
];

export default function GlassDivider({ flip = false, className = "" }: GlassDividerProps) {
  return (
    <div
      className={`glass-divider-wrap ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : "none" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1400 36"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="glass-divider-svg"
      >
        {FACETS.map(([pts, fi], i) => (
          <polygon
            key={i}
            points={pts as string}
            fill={FILLS[fi as number]}
            stroke="rgba(20,40,40,0.18)"
            strokeWidth="0.8"
          />
        ))}
      </svg>
    </div>
  );
}
