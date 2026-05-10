import { useState, useRef, useCallback } from "react"

// ─── Chart dimensions ────────────────────────────────────────────────────────
const VW = 1200, VH = 740
const PL = 72, PR = 210, PT = 30, PB = 64
const CW = VW - PL - PR
const CH = VH - PT - PB
const N = 50, YMAX = 50, STEPS = 800

const sx = (n: number) => PL + (n / N) * CW
const sy = (v: number) => PT + CH - (Math.min(v, YMAX) / YMAX) * CH

// ─── Complexity functions ────────────────────────────────────────────────────
const fns = [
  {
    id: "c1", label: "O(1)", color: "#34d399", dash: "",
    name: "Constant time",
    algos: ["Array index access a[i]", "Hash map get / set", "Stack push & pop", "Queue enqueue & dequeue", "Checking if a number is even"],
    fn: () => 1,
  },
  {
    id: "logn", label: "O(log n)", color: "#38bdf8", dash: "6 3",
    name: "Logarithmic time",
    algos: ["Binary search", "Balanced BST lookup", "Heap insert & delete", "Finding power (fast exponentiation)", "Segment tree query"],
    fn: (n: number) => Math.log2(n + 1),
  },
  {
    id: "n", label: "O(n)", color: "#fbbf24", dash: "",
    name: "Linear time",
    algos: ["Linear search", "Array traversal", "Finding min / max", "Counting elements", "Two-pointer technique", "Sliding Window"],
    fn: (n: number) => n,
  },
  {
    id: "nlogn", label: "O(n log n)", color: "#c084fc", dash: "8 3",
    name: "Linearithmic time",
    algos: ["Merge sort", "Heap sort", "Quick sort (avg)", "FFT (Fast Fourier Transform)", "Tim sort (Python default)"],
    fn: (n: number) => n * Math.log2(n + 1),
  },
  {
    id: "n2", label: "O(n²)", color: "#f87171", dash: "4 4",
    name: "Quadratic time",
    algos: ["Bubble sort", "Insertion sort", "Selection sort", "Comparing all pairs", "Naive matrix multiply"],
    fn: (n: number) => n * n,
  },
  {
    id: "2n", label: "O(2ⁿ)", color: "#fb923c", dash: "10 3 2 3",
    name: "Exponential time",
    algos: ["Recursive Fibonacci (naive)", "Generating all subsets", "0/1 Knapsack (brute force)", "Travelling salesman (brute)", "Recursive tower of Hanoi"],
    fn: (n: number) => Math.pow(2, n),
  },
  {
    id: "nfact", label: "O(n!)", color: "#e879f9", dash: "3 3",
    name: "Factorial time",
    algos: ["Generating all permutations", "Brute-force TSP (all routes)", "Bogosort", "Solving n-queens (brute)", "Lexicographic ordering"],
    fn: (n: number) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f },
  },
]

// ─── Zones — dark-adapted fills ─────────────────────────────────────────────
// fills use low-opacity colors that read well on #16171d background
const ZONE_DEFS = [
  { label: "Excellent", sub: "≤ O(1)",          fill: "rgba(52,211,153,0.08)",  tc: "#34d399" },
  { label: "Good",      sub: "O(log n)",         fill: "rgba(56,189,248,0.08)",  tc: "#38bdf8" },
  { label: "Fair",      sub: "O(n)",             fill: "rgba(251,191,36,0.08)",  tc: "#fbbf24" },
  { label: "Bad",       sub: "O(n log n)–O(n²)", fill: "rgba(251,146,60,0.10)",  tc: "#fb923c" },
  { label: "Horrible",  sub: "O(2ⁿ)+",           fill: "rgba(248,113,113,0.10)", tc: "#f87171" },
]

function buildPath(fn: (n: number) => number) {
  let d = ""
  for (let i = 0; i <= STEPS; i++) {
    const n = (i / STEPS) * N
    const v = fn(n)
    d += i === 0
      ? `M ${sx(n).toFixed(1)} ${sy(v).toFixed(1)}`
      : ` L ${sx(n).toFixed(1)} ${sy(v).toFixed(1)}`
    if (v > YMAX * 1.02) break
  }
  return d
}

function buildBand(fnTop: (n: number) => number, fnBottom: (n: number) => number) {
  const pts: string[] = []
  for (let i = 0; i <= STEPS; i++) {
    const n = (i / STEPS) * N, v = fnTop(n)
    if (v > YMAX * 1.02) { pts.push(`${sx(n).toFixed(1)},${PT}`); break }
    pts.push(`${sx(n).toFixed(1)},${sy(v).toFixed(1)}`)
  }
  for (let i = STEPS; i >= 0; i--) {
    const n = (i / STEPS) * N, v = fnBottom(n)
    if (v > YMAX * 1.02) continue
    pts.push(`${sx(n).toFixed(1)},${sy(v).toFixed(1)}`)
  }
  return pts.join(" ")
}

const zones = [
  {
    ...ZONE_DEFS[0],
    points: () => {
      const pts: string[] = []
      for (let i = 0; i <= STEPS; i++) {
        const n = (i / STEPS) * N
        pts.push(`${sx(n).toFixed(1)},${sy(1).toFixed(1)}`)
      }
      pts.push(`${sx(N).toFixed(1)},${(PT + CH).toFixed(1)}`)
      pts.push(`${sx(0).toFixed(1)},${(PT + CH).toFixed(1)}`)
      return pts.join(" ")
    },
    lx: () => PL + CW * 0.5,
    ly: () => sy(1) + (PT + CH - sy(1)) * 0.5,
  },
  {
    ...ZONE_DEFS[1],
    points: () => buildBand(n => Math.log2(n + 1), () => 1),
    lx: () => PL + CW * 0.55,
    ly: () => sy(Math.log2(N * 0.55 + 1)) - 10,
  },
  {
    ...ZONE_DEFS[2],
    points: () => buildBand(n => n, n => Math.log2(n + 1)),
    lx: () => PL + CW * 0.4,
    ly: () => sy((N * 0.4 + Math.log2(N * 0.4 + 1)) / 2) + 4,
  },
  {
    ...ZONE_DEFS[3],
    points: () => buildBand(n => n * n, n => n),
    lx: () => PL + CW * 0.49,
    ly: () => sy((N * 0.22 * N * 0.22 + N * 0.22) / 2) - 6,
  },
  {
    ...ZONE_DEFS[4],
    points: () => buildBand(n => Math.pow(2, n), n => n * n),
    lx: () => PL + CW * 0.10,
    ly: () => sy((Math.pow(2, N * 0.10) + (N * 0.10) * (N * 0.10)) / 2) - 8,
  },
]

function getTagPos(fn: (n: number) => number) {
  for (let i = STEPS; i >= 1; i--) {
    const n = (i / STEPS) * N, v = fn(n)
    if (v <= YMAX * 0.97) return { tx: sx(n), ty: sy(v) }
  }
  return { tx: sx(N), ty: sy(fn(N)) }
}

// ─── Component ───────────────────────────────────────────────────────────────
const BigOVisualizer = () => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; c: (typeof fns)[number] | null }>
    ({ visible: false, x: 0, y: 0, c: null })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const showTooltip = useCallback((c: (typeof fns)[number]) => {
    if (!svgRef.current || !containerRef.current) return
    const svgRect = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const scale = svgRect.width / VW
    const { tx, ty } = getTagPos(c.fn)
    let x = tx * scale + svgRect.left - containerRect.left + 14
    let y = ty * scale + svgRect.top - containerRect.top - 10
    const tipW = 280
    if (x + tipW > containerRect.width - 8) x = x - tipW - 28
    setTooltip({ visible: true, x, y, c })
  }, [])

  const hideTooltip = useCallback(() => setTooltip(t => ({ ...t, visible: false })), [])
  const handleEnter = useCallback((c: (typeof fns)[number]) => { setHovered(c.id); showTooltip(c) }, [showTooltip])
  const handleLeave = useCallback(() => { setHovered(null); hideTooltip() }, [hideTooltip])

  // Theme tokens
  const BG         = "var(--bg)"          // #16171d in dark
  const GRID       = "rgba(255,255,255,0.07)"
  const AXIS       = "rgba(255,255,255,0.5)"
  const AXIS_TEXT  = "rgba(255,255,255,0.35)"
  const AXIS_TITLE = "rgba(255,255,255,0.55)"

  return (
    <div
      ref={containerRef}
      style={{
        padding: "1.25rem 0.5rem",
        fontFamily: "var(--mono, monospace)",
        position: "relative",
        background: BG,
        borderRadius: 12,
        border: "1px solid var(--border, #2e303a)",
      }}
    >
      {/* ── Legend ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginBottom: 16, padding: "0 6px" }}>
        {fns.map(c => (
          <div
            key={c.id}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, color: c.color,
              cursor: "pointer", userSelect: "none",
              opacity: hovered && hovered !== c.id ? 0.2 : 1,
              transition: "opacity 0.2s",
              fontFamily: "var(--mono, monospace)",
            }}
            onMouseEnter={() => handleEnter(c)}
            onMouseLeave={handleLeave}
          >
            {c.dash
              ? <span style={{ width: 26, height: 0, borderTop: `2.5px dashed ${c.color}`, display: "inline-block", flexShrink: 0 }} />
              : <span style={{ width: 26, height: 2.5, borderRadius: 2, background: c.color, display: "inline-block", flexShrink: 0 }} />
            }
            <span style={{ fontWeight: 600 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <div style={{ position: "relative" }}>
        <svg ref={svgRef} width="100%" viewBox={`0 0 ${VW} ${VH}`} role="img" style={{ display: "block" }}>

          {/* Zone fills */}
          {zones.map(z => (
            <polygon key={z.label} points={z.points()} fill={z.fill} />
          ))}

          {/* Zone labels */}
          {zones.map(z => {
            const lx = z.lx(), ly = z.ly()
            return (
              <g key={z.label + "_lbl"}>
                <text x={lx} y={ly} textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={z.tc} fontFamily="monospace" opacity={0.5}>
                  {z.label}
                </text>
                <text x={lx} y={ly + 17} textAnchor="middle" fontSize={10} fontWeight={500}
                  fill={z.tc} fontFamily="monospace" opacity={0.35}>
                  {z.sub}
                </text>
              </g>
            )
          })}

          {/* Grid */}
          {[1, 2, 3, 4].map(i => (
            <line key={`gy${i}`} x1={PL} x2={PL + CW} y1={PT + (i / 4) * CH} y2={PT + (i / 4) * CH}
              stroke={GRID} strokeDasharray="5 4" strokeWidth={1} />
          ))}
          {[1, 2, 3, 4, 5].map(i => (
            <line key={`gx${i}`} x1={PL + (i / 5) * CW} x2={PL + (i / 5) * CW} y1={PT} y2={PT + CH}
              stroke={GRID} strokeDasharray="5 4" strokeWidth={1} />
          ))}

          {/* Axes */}
          <line x1={PL} x2={PL} y1={PT} y2={PT + CH} stroke={AXIS} strokeWidth={2} />
          <line x1={PL} x2={PL + CW} y1={PT + CH} y2={PT + CH} stroke={AXIS} strokeWidth={2} />
          <polygon points={`${PL + CW},${PT + CH} ${PL + CW - 10},${PT + CH - 5} ${PL + CW - 10},${PT + CH + 5}`} fill={AXIS} />
          <polygon points={`${PL},${PT} ${PL - 5},${PT + 10} ${PL + 5},${PT + 10}`} fill={AXIS} />

          {/* X tick labels */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <text key={i} x={PL + (i / 5) * CW} y={PT + CH + 22}
              textAnchor="middle" fontSize={12} fill={AXIS_TEXT} fontFamily="monospace">
              {Math.round(i / 5 * N)}
            </text>
          ))}

          {/* Axis titles */}
          <text x={PL + CW / 2} y={VH - 6} textAnchor="middle" fontSize={15} fontWeight={600}
            fill={AXIS_TITLE} fontFamily="monospace">
            Input size (n)
          </text>
          <text textAnchor="middle" fontSize={15} fontWeight={600} fill={AXIS_TITLE} fontFamily="monospace"
            transform={`rotate(-90) translate(${-(PT + CH / 2)}, 20)`}>
            Operations
          </text>

          {/* Curves + tag badges */}
          {fns.map(c => {
            const active = hovered === c.id
            const dim = Boolean(hovered && !active)
            const { tx, ty } = getTagPos(c.fn)
            const tw = c.label.length * 9.5 + 24, th = 26

            return (
              <g key={c.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => handleEnter(c)}
                onMouseLeave={handleLeave}>
                <path
                  d={buildPath(c.fn)}
                  stroke={c.color}
                  strokeWidth={active ? 5 : 2.5}
                  strokeDasharray={c.dash || undefined}
                  fill="none" strokeLinecap="round" strokeLinejoin="round"
                  opacity={dim ? 0.1 : 1}
                  style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
                />
                {/* invisible fat hit area */}
                <path d={buildPath(c.fn)} stroke="transparent" strokeWidth={18} fill="none" />

                {/* Tag badge — dark bg with colored border */}
                <rect
                  x={tx - tw / 2} y={ty - th - 6} width={tw} height={th} rx={6}
                  fill={active ? c.color : "#1f2028"}
                  stroke={c.color} strokeWidth={1.5}
                  opacity={dim ? 0.1 : 1}
                  style={{ transition: "fill 0.2s, opacity 0.2s" }}
                />
                <text
                  x={tx} y={ty - 6 - th / 2 + 7}
                  textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={active ? "#0d1117" : c.color} fontFamily="monospace"
                  opacity={dim ? 0.1 : 1}
                  style={{ transition: "fill 0.2s, opacity 0.2s" }}
                >
                  {c.label}
                </text>
              </g>
            )
          })}

          {/* Right-side zone legend */}
          {ZONE_DEFS.map((z, i) => {
            const bx = PL + CW + 18
            const by = PT + 20 + i * 52
            return (
              <g key={z.label + "_legend"}>
                <rect x={bx} y={by} width={14} height={14} rx={3}
                  fill={z.fill} stroke={z.tc} strokeWidth={1.2} />
                <text x={bx + 20} y={by + 7} fontSize={12} fontWeight={700}
                  fill={z.tc} fontFamily="monospace" dominantBaseline="middle">
                  {z.label}
                </text>
                <text x={bx + 20} y={by + 22} fontSize={10}
                  fill={z.tc} fontFamily="monospace" opacity={0.6}>
                  {z.sub}
                </text>
              </g>
            )
          })}

        </svg>

        {/* Tooltip */}
        {tooltip.visible && tooltip.c && (
          <div style={{
            position: "absolute", left: tooltip.x, top: tooltip.y,
            background: "var(--code-bg, #1f2028)",
            border: `1.5px solid ${tooltip.c.color}`,
            borderRadius: 10, padding: "12px 16px",
            minWidth: 230, maxWidth: 290,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            pointerEvents: "none", zIndex: 10,
            fontFamily: "var(--mono, monospace)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: tooltip.c.color, marginBottom: 3 }}>
              {tooltip.c.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text, #9ca3af)", marginBottom: 10, fontWeight: 500 }}>
              {tooltip.c.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-h, #f3f4f6)", fontWeight: 600, marginBottom: 4 }}>
              Common algorithms:
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "var(--text, #9ca3af)", lineHeight: 1.9 }}>
              {tooltip.c.algos.map((a: string) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default BigOVisualizer