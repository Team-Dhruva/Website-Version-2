import { useEffect, useRef } from "react";

export default function SpacetimeGrid() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let cx = width / 2;
    let cy = height / 2;

    // Set viewBox immediately on mount for correct coordinate system
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // ── Chaotic 3-Body: asymmetric triangle, small angular momentum ──────────
    // For chaos we need:
    //   1. All three bodies at COMPARABLE separations (no hierarchy)
    //   2. No special periodic orbit (asymmetry breaks any symmetry)
    //   3. Small angular velocity so they orbit a few times before
    //      the first close encounter — then chaos unfolds naturally.
    //
    // The three stars start at an off-centre, unequal triangle.
    // We correct the centre-of-mass to (cx, cy) analytically so
    // the whole system stays centred on screen.

    const GM = 120000.0; // G·M per body

    // Raw triangle positions (in local coords from origin, corrected below)
    const rawPositions = [
      { x:   0, y: -135 },   // star 1 — top, near centre
      { x: -150, y:  80 },   // star 2 — lower-left, far
      { x:  110, y:  95 },   // star 3 — lower-right, medium
    ];

    // Shift so the 3-body COM sits exactly at (cx, cy)
    const comX = rawPositions.reduce((s, p) => s + p.x, 0) / 3; //  −20
    const comY = rawPositions.reduce((s, p) => s + p.y, 0) / 3; //   13.3

    let mx1 = cx + rawPositions[0].x - comX;
    let my1 = cy + rawPositions[0].y - comY;
    let mx2 = cx + rawPositions[1].x - comX;
    let my2 = cy + rawPositions[1].y - comY;
    let mx3 = cx + rawPositions[2].x - comX;
    let my3 = cy + rawPositions[2].y - comY;

    // Small solid-body rotation around (cx, cy): v = ω × r
    // CCW tangential: vx = -ω·(y-cy),  vy = +ω·(x-cx)
    // ω = 0.016 gives slow, graceful approach before first encounter
    const omega = 0.012;
    let vx1 = -omega * (my1 - cy);  let vy1 = +omega * (mx1 - cx);
    let vx2 = -omega * (my2 - cy);  let vy2 = +omega * (mx2 - cx);
    let vx3 = -omega * (my3 - cy);  let vy3 = +omega * (mx3 - cx);

    let draggedStarIndex: number | null = null;
    let mouseX = 0;
    let mouseY = 0;

    // Get the references to the groups/elements
    const linesGroup = svg.querySelector("#grid-lines-group");
    const star1El = svg.querySelector("#star1") as SVGCircleElement;
    const star2El = svg.querySelector("#star2") as SVGCircleElement;
    const star3El = svg.querySelector("#star3") as SVGCircleElement;
    if (!linesGroup || !star1El || !star2El || !star3El) return;

    // Grid spacing configuration
    const gridSpacing = 40;

    // Dynamically created paths based on size
    let horizontalPaths: SVGPathElement[] = [];
    let verticalPaths: SVGPathElement[] = [];

    const setupGridElements = () => {
      linesGroup.innerHTML = "";
      horizontalPaths = [];
      verticalPaths = [];

      const maxDistX = Math.max(cx, width - cx);
      const maxDistY = Math.max(cy, height - cy);
      const xRange = Math.ceil(maxDistX / gridSpacing) * 2 + 12;
      const yRange = Math.ceil(maxDistY / gridSpacing) * 2 + 12;

      const startX = cx - (xRange * gridSpacing) / 2;
      const endX = cx + (xRange * gridSpacing) / 2;
      const startY = cy - (yRange * gridSpacing) / 2;
      const endY = cy + (yRange * gridSpacing) / 2;

      for (let gy = startY; gy <= endY; gy += gridSpacing) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "var(--grid-color)"); // Subtle slate-grey lines
        path.setAttribute("stroke-width", "1");
        linesGroup.appendChild(path);
        horizontalPaths.push(path);
      }

      for (let gx = startX; gx <= endX; gx += gridSpacing) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "var(--grid-color)");
        path.setAttribute("stroke-width", "1");
        linesGroup.appendChild(path);
        verticalPaths.push(path);
      }
    };

    setupGridElements();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const applyResize = (rect: { width: number; height: number }) => {
      const prevCx = cx;
      const prevCy = cy;
      width = rect.width;
      height = rect.height;
      cx = width / 2;
      cy = height / 2;

      const dx = cx - prevCx;
      const dy = cy - prevCy;
      mx1 += dx; my1 += dy;
      mx2 += dx; my2 += dy;
      mx3 += dx; my3 += dy;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      setupGridElements();
    };

    const ro = new ResizeObserver(([entry]) => {
      const { inlineSize, blockSize } = entry.contentBoxSize?.[0] ?? entry.contentRect;
      svg.setAttribute("viewBox", `0 0 ${inlineSize} ${blockSize}`);
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => applyResize({ width: inlineSize, height: blockSize }), 200);
    });
    ro.observe(svg);

    // Physics parameters for wave generation
    // Lower waveLength → longer wavelength → smoother, gentler ripples
    // Lower waveSpeed  → slow-moving wavefronts
    const waveLength = 0.022;
    const waveSpeed  = 0.014;
    const waveAmplitude = 34;
    const damping = 0.0006;

    // Camera tilt / perspective parameters
    const tilt = 0.55;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);

    let time = 0;
    let frameCount = 0;

    const project = (gx: number, gy: number, gzOverride?: number) => {
      const cameraDistance = Math.max(width, height) + 1000;
      const dx = gx - cx;
      const dy = gy - cy;

      const d1 = Math.sqrt((gx - mx1) ** 2 + (gy - my1) ** 2);
      const d2 = Math.sqrt((gx - mx2) ** 2 + (gy - my2) ** 2);
      const d3 = Math.sqrt((gx - mx3) ** 2 + (gy - my3) ** 2);

      // Gravitational wave ripples (damped sinusoidal waves) from 3 sources
      const ripple1 = waveAmplitude * Math.cos(d1 * waveLength - time * waveSpeed) * Math.exp(-d1 * damping);
      const ripple2 = waveAmplitude * Math.cos(d2 * waveLength - time * waveSpeed) * Math.exp(-d2 * damping);
      const ripple3 = waveAmplitude * Math.cos(d3 * waveLength - time * waveSpeed) * Math.exp(-d3 * damping);

      const z = gzOverride !== undefined ? gzOverride : (ripple1 + ripple2 + ripple3);

      const rotY = dy * cosTilt - z * sinTilt;
      const rotZ = dy * sinTilt + z * cosTilt;

      const depth = cameraDistance - rotZ;
      const scale = cameraDistance / depth;
      const px = cx + dx * scale;
      const py = cy + rotY * scale;

      return { px, py, z };
    };

    const getGridCoords = (mx: number, my: number) => {
      const cameraDistance = Math.max(width, height) + 1000;
      const Y_prime = my - cy;

      const dy = (Y_prime * cameraDistance) / (cosTilt * cameraDistance + Y_prime * sinTilt);
      const scale = cameraDistance / (cameraDistance - dy * sinTilt);
      const dx = (mx - cx) / scale;

      return { gx: cx + dx, gy: cy + dy };
    };

    const render = () => {
      frameCount++;
      time += 0.07;

      // Skip every other frame — reduces GPU work during scroll
      if (frameCount % 2 === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // --- Physical N-Body 3-Body Integration Loop ---
      // Sub-stepping for integration stability (4 steps per frame)
      const subSteps = 4;
      const dt = 0.018; // Time integration step
      const softening = 20; // Enough to prevent singularities while keeping chaotic encounters

      for (let step = 0; step < subSteps; step++) {
        // Calculate relative displacement vectors
        const dx12 = mx2 - mx1;
        const dy12 = my2 - my1;
        const dist12_sq = dx12 * dx12 + dy12 * dy12 + softening;
        const dist12 = Math.sqrt(dist12_sq);
        const f12 = GM / (dist12_sq * dist12); // G * M / r^3

        const dx13 = mx3 - mx1;
        const dy13 = my3 - my1;
        const dist13_sq = dx13 * dx13 + dy13 * dy13 + softening;
        const dist13 = Math.sqrt(dist13_sq);
        const f13 = GM / (dist13_sq * dist13);

        const dx23 = mx3 - mx2;
        const dy23 = my3 - my2;
        const dist23_sq = dx23 * dx23 + dy23 * dy23 + softening;
        const dist23 = Math.sqrt(dist23_sq);
        const f23 = GM / (dist23_sq * dist23);

        // Gravitational accelerations (a = Sum GM * r_vec / r^3)
        const ax1 = f12 * dx12 + f13 * dx13;
        const ay1 = f12 * dy12 + f13 * dy13;

        const ax2 = -f12 * dx12 + f23 * dx23;
        const ay2 = -f12 * dy12 + f23 * dy23;

        const ax3 = -f13 * dx13 - f23 * dx23;
        const ay3 = -f13 * dy13 - f23 * dy23;

        // Integrate positions and velocities (leapfrog style or Euler-Cromer)
        if (draggedStarIndex !== 0) {
          vx1 += ax1 * dt;
          vy1 += ay1 * dt;
          mx1 += vx1 * dt;
          my1 += vy1 * dt;
        } else {
          const gridPos = getGridCoords(mouseX, mouseY);
          // Calculate velocity from drag displacement for inertia
          vx1 = (gridPos.gx - mx1) / (dt * subSteps);
          vy1 = (gridPos.gy - my1) / (dt * subSteps);
          mx1 = gridPos.gx;
          my1 = gridPos.gy;
        }

        if (draggedStarIndex !== 1) {
          vx2 += ax2 * dt;
          vy2 += ay2 * dt;
          mx2 += vx2 * dt;
          my2 += vy2 * dt;
        } else {
          const gridPos = getGridCoords(mouseX, mouseY);
          vx2 = (gridPos.gx - mx2) / (dt * subSteps);
          vy2 = (gridPos.gy - my2) / (dt * subSteps);
          mx2 = gridPos.gx;
          my2 = gridPos.gy;
        }

        if (draggedStarIndex !== 2) {
          vx3 += ax3 * dt;
          vy3 += ay3 * dt;
          mx3 += vx3 * dt;
          my3 += vy3 * dt;
        } else {
          const gridPos = getGridCoords(mouseX, mouseY);
          vx3 = (gridPos.gx - mx3) / (dt * subSteps);
          vy3 = (gridPos.gy - my3) / (dt * subSteps);
          mx3 = gridPos.gx;
          my3 = gridPos.gy;
        }

        // Soft containment: graduated spring that kicks in at ~60% of screen radius
        // and grows stronger the further out a star goes — keeps them always visible.
        const boundInner = Math.max(width, height) * 0.55;
        const boundOuter = Math.max(width, height) * 0.75;

        const applyContainment = (
          x: number, y: number,
          setVx: (v: number) => void, setVy: (v: number) => void,
          vx: number, vy: number
        ) => {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (dist > boundInner) {
            // Linear spring that strengthens toward outer bound
            const excess = (dist - boundInner) / (boundOuter - boundInner);
            const k = 0.0008 + excess * 0.006; // 0.0008 → 0.0068 as star goes further
            setVx(vx - (x - cx) * k);
            setVy(vy - (y - cy) * k);
          }
        };

        applyContainment(mx1, my1, (v) => { vx1 = v; }, (v) => { vy1 = v; }, vx1, vy1);
        applyContainment(mx2, my2, (v) => { vx2 = v; }, (v) => { vy2 = v; }, vx2, vy2);
        applyContainment(mx3, my3, (v) => { vx3 = v; }, (v) => { vy3 = v; }, vx3, vy3);
      }

      // Draw horizontal lines
      const maxDistX = Math.max(cx, width - cx);
      const maxDistY = Math.max(cy, height - cy);
      const xRange = Math.ceil(maxDistX / gridSpacing) * 2 + 12;
      const yRange = Math.ceil(maxDistY / gridSpacing) * 2 + 12;

      const startX = cx - (xRange * gridSpacing) / 2;
      const endX = cx + (xRange * gridSpacing) / 2;
      const startY = cy - (yRange * gridSpacing) / 2;
      const endY = cy + (yRange * gridSpacing) / 2;

      horizontalPaths.forEach((path, idx) => {
        const gy = startY + idx * gridSpacing;
        let pathD = "";
        let isDrawing = false;

        for (let gx = startX; gx <= endX; gx += 10) {
          const { px, py } = project(gx, gy);

          if (px >= -100 && px <= width + 100 && py >= -100 && py <= height + 100) {
            if (!isDrawing) {
              pathD += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
              isDrawing = true;
            } else {
              pathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
            }
          } else {
            isDrawing = false;
          }
        }
        path.setAttribute("d", pathD);
      });

      // Draw vertical lines
      verticalPaths.forEach((path, idx) => {
        const gx = startX + idx * gridSpacing;
        let pathD = "";
        let isDrawing = false;

        for (let gy = startY; gy <= endY; gy += 10) {
          const { px, py } = project(gx, gy);

          if (px >= -100 && px <= width + 100 && py >= -100 && py <= height + 100) {
            if (!isDrawing) {
              pathD += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
              isDrawing = true;
            } else {
              pathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
            }
          } else {
            isDrawing = false;
          }
        }
        path.setAttribute("d", pathD);
      });

      // Render the three stars
      const z1 = project(mx1, my1).z;
      const z2 = project(mx2, my2).z;
      const z3 = project(mx3, my3).z;

      const pStar1 = project(mx1, my1, z1);
      const pStar2 = project(mx2, my2, z2);
      const pStar3 = project(mx3, my3, z3);

      star1El.setAttribute("cx", pStar1.px.toFixed(1));
      star1El.setAttribute("cy", pStar1.py.toFixed(1));

      star2El.setAttribute("cx", pStar2.px.toFixed(1));
      star2El.setAttribute("cy", pStar2.py.toFixed(1));

      star3El.setAttribute("cx", pStar3.px.toFixed(1));
      star3El.setAttribute("cy", pStar3.py.toFixed(1));

      // Hover checks
      const mouseGrid = getGridCoords(mouseX, mouseY);
      const d1_mouse = Math.sqrt((mouseGrid.gx - mx1) ** 2 + (mouseGrid.gy - my1) ** 2);
      const d2_mouse = Math.sqrt((mouseGrid.gx - mx2) ** 2 + (mouseGrid.gy - my2) ** 2);
      const d3_mouse = Math.sqrt((mouseGrid.gx - mx3) ** 2 + (mouseGrid.gy - my3) ** 2);
      
      const hoverRadius = 45;
      const isHover1 = d1_mouse < hoverRadius && (draggedStarIndex === null || draggedStarIndex === 0);
      const isHover2 = d2_mouse < hoverRadius && (draggedStarIndex === null || draggedStarIndex === 1);
      const isHover3 = d3_mouse < hoverRadius && (draggedStarIndex === null || draggedStarIndex === 2);

      if (isHover1 || isHover2 || isHover3 || draggedStarIndex !== null) {
        svg.style.cursor = draggedStarIndex !== null ? "grabbing" : "grab";
        star1El.setAttribute("stroke-width", isHover1 ? "2" : "1");
        star1El.setAttribute("stroke", isHover1 ? "var(--text-color)" : "var(--text-muted)");
        
        star2El.setAttribute("stroke-width", isHover2 ? "2" : "1");
        star2El.setAttribute("stroke", isHover2 ? "var(--text-color)" : "var(--text-muted)");

        star3El.setAttribute("stroke-width", isHover3 ? "2" : "1");
        star3El.setAttribute("stroke", isHover3 ? "var(--text-color)" : "var(--text-muted)");
      } else {
        svg.style.cursor = "default";
        star1El.setAttribute("stroke-width", "1");
        star1El.setAttribute("stroke", "var(--text-muted)");
        star2El.setAttribute("stroke-width", "1");
        star2El.setAttribute("stroke", "var(--text-muted)");
        star3El.setAttribute("stroke-width", "1");
        star3El.setAttribute("stroke", "var(--text-muted)");
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Event Handlers for Grab & Move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseDown = () => {
      const gridPos = getGridCoords(mouseX, mouseY);
      const d1 = Math.sqrt((gridPos.gx - mx1) ** 2 + (gridPos.gy - my1) ** 2);
      const d2 = Math.sqrt((gridPos.gx - mx2) ** 2 + (gridPos.gy - my2) ** 2);
      const d3 = Math.sqrt((gridPos.gx - mx3) ** 2 + (gridPos.gy - my3) ** 2);

      const selectRadius = 45;
      if (d1 < selectRadius && d1 < d2 && d1 < d3) {
        draggedStarIndex = 0;
      } else if (d2 < selectRadius && d2 < d3) {
        draggedStarIndex = 1;
      } else if (d3 < selectRadius) {
        draggedStarIndex = 2;
      }
    };

    const handleMouseUp = () => {
      draggedStarIndex = null;
    };

    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mousedown", handleMouseDown);
    const onWindowResize = () => {
      svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    };
    window.addEventListener("resize", onWindowResize);

    render();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="spacetime-grid-svg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100dvw",
        height: "100dvh",
        zIndex: 1,
        pointerEvents: "none",
        display: "block",
        backgroundColor: "var(--bg-color)",
      }}
    >
      <defs>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" className="bg-glow-start" />
          <stop offset="100%" className="bg-glow-end" />
        </radialGradient>
      </defs>
      
      {/* Background shape */}
      <rect width="100%" height="100%" fill="url(#bg-glow)" />

      {/* Grid lines container */}
      <g id="grid-lines-group"></g>

      {/* Outlined grey circles representing stars (simple, no glow) */}
      <circle id="star1" r="5" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
      <circle id="star2" r="5" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
      <circle id="star3" r="5" fill="none" stroke="var(--text-muted)" strokeWidth="1" />
    </svg>
  );
}
