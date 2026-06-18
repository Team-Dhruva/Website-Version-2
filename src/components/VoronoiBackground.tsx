import { useEffect, useRef } from "react";

interface Point { x: number; y: number; }
interface Triangle { a: Point; b: Point; c: Point; }

// ── Bowyer-Watson Delaunay triangulation (simple, sufficient for ~60 points) ──
function circumcircle(a: Point, b: Point, c: Point) {
  const ax = a.x - c.x, ay = a.y - c.y;
  const bx = b.x - c.x, by = b.y - c.y;
  const D = 2 * (ax * by - ay * bx);
  if (Math.abs(D) < 1e-10) return null;
  const ux = (by * (ax * ax + ay * ay) - ay * (bx * bx + by * by)) / D;
  const uy = (ax * (bx * bx + by * by) - bx * (ax * ax + ay * ay)) / D;
  const cx2 = c.x + ux, cy2 = c.y + uy;
  const r = Math.sqrt(ux * ux + uy * uy);
  return { x: cx2, y: cy2, r };
}

function delaunay(pts: Point[]): Triangle[] {
  const w = 20000, h = 20000;
  const super_: [Point, Point, Point] = [
    { x: -w, y: -h }, { x: 3 * w, y: -h }, { x: -w, y: 3 * h }
  ];
  let tris: { a: Point; b: Point; c: Point }[] = [{ a: super_[0], b: super_[1], c: super_[2] }];

  for (const p of pts) {
    const edges: [Point, Point][] = [];
    tris = tris.filter(t => {
      const cc = circumcircle(t.a, t.b, t.c);
      if (!cc) return true;
      const dx = p.x - cc.x, dy = p.y - cc.y;
      if (dx * dx + dy * dy < cc.r * cc.r) {
        edges.push([t.a, t.b], [t.b, t.c], [t.c, t.a]);
        return false;
      }
      return true;
    });
    const unique = edges.filter((e, i) =>
      !edges.some((f, j) => j !== i && ((
        e[0].x === f[1].x && e[0].y === f[1].y &&
        e[1].x === f[0].x && e[1].y === f[0].y
      ) || (
        e[0].x === f[0].x && e[0].y === f[0].y &&
        e[1].x === f[1].x && e[1].y === f[1].y
      )))
    );
    for (const [a, b] of unique) tris.push({ a, b, c: p });
  }

  return tris.filter(t =>
    ![t.a, t.b, t.c].some(p => super_.some(s => s.x === p.x && s.y === p.y))
  );
}

// ── Seeded random (deterministic layout) ──
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

export default function VoronoiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let tris: Triangle[] = [];
    let alphas: number[] = [];
    let speeds: number[] = [];
    let phases: number[] = [];

    const rand = seededRand(42);

    function build() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;

      // Scatter 65 seed points with some grid bias for a natural look
      const pts: Point[] = [];
      const cols = 10, rows = 8;
      for (let c = 0; c <= cols; c++)
        for (let r = 0; r <= rows; r++)
          pts.push({
            x: (c / cols) * W + (rand() - 0.5) * (W / cols) * 0.85,
            y: (r / rows) * H + (rand() - 0.5) * (H / rows) * 0.85,
          });

      tris  = delaunay(pts);
      alphas = tris.map(() => rand() * 0.10 + 0.03);  // 3–13% base opacity
      speeds = tris.map(() => rand() * 0.0004 + 0.0002);
      phases = tris.map(() => rand() * Math.PI * 2);
    }

    // Palette: teal → silver-white (mirrors reference image)
    const FILLS = [
      "rgba(126,200,200,1)",  // teal
      "rgba(180,225,225,1)",  // light teal
      "rgba(210,238,238,1)",  // pale teal
      "rgba(232,244,244,1)",  // near-white
      "rgba(248,252,252,1)",  // white-silver
    ];

    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      t += 1;

      for (let i = 0; i < tris.length; i++) {
        const { a, b, c } = tris[i];
        // Skip triangles entirely outside canvas
        if (Math.max(a.x, b.x, c.x) < 0 || Math.min(a.x, b.x, c.x) > W) continue;
        if (Math.max(a.y, b.y, c.y) < 0 || Math.min(a.y, b.y, c.y) > H) continue;

        const breathe = Math.sin(t * speeds[i] * 60 + phases[i]) * 0.5 + 0.5;
        const alpha   = alphas[i] + breathe * 0.05;
        const fill    = FILLS[i % FILLS.length];

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        // Hairline joint
        ctx.globalAlpha = 0.18 + breathe * 0.06;
        ctx.strokeStyle = "rgba(20,40,40,0.6)";
        ctx.lineWidth   = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    build();
    draw();

    const onResize = () => { build(); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="voronoi-bg"
      aria-hidden="true"
    />
  );
}
