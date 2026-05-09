import { useState, useRef, useCallback } from "react"

// ─── Chart dimensions ────────────────────────────────────────────────────────
const VW = 1200, VH = 740
const PL = 72, PR = 210, PT = 30, PB = 64
const CW = VW - PL - PR
const CH = VH - PT - PB
const N = 50, YMAX = 50, STEPS = 800

const sx = n => PL + (n / N) * CW
const sy = v => PT + CH - (Math.min(v, YMAX) / YMAX) * CH

// ─── Complexity functions ────────────────────────────────────────────────────
const fns = [
  {
    id: "c1", label: "O(1)", color: "#059669", dash: "",
    name: "Constant time",
    algos: ["Array index access a[i]", "Hash map get / set", "Stack push & pop", "Queue enqueue & dequeue", "Checking if a number is even"],
    fn: n => 1,
  },
  {
    id: "logn", label: "O(log n)", color: "#0ea5e9", dash: "6 3",
    name: "Logarithmic time",
    algos: ["Binary search", "Balanced BST lookup", "Heap insert & delete", "Finding power (fast exponentiation)", "Segment tree query"],
    fn: n => Math.log2(n + 1),
  },
  {
    id: "n", label: "O(n)", color: "#d97706", dash: "",
    name: "Linear time",
    algos: ["Linear search", "Array traversal", "Finding min / max", "Counting elements", "Two-pointer technique"],
    fn: n => n,
  },
  {
    id: "nlogn", label: "O(n log n)", color: "#7c3aed", dash: "8 3",
    name: "Linearithmic time",
    algos: ["Merge sort", "Heap sort", "Quick sort (avg)", "FFT (Fast Fourier Transform)", "Tim sort (Python default)"],
    fn: n => n * Math.log2(n + 1),
  },
  {
    id: "n2", label: "O(n²)", color: "#dc2626", dash: "4 4",
    name: "Quadratic time",
    algos: ["Bubble sort", "Insertion sort", "Selection sort", "Comparing all pairs", "Naive matrix multiply"],
    fn: n => n * n,
  },
  {
    id: "2n", label: "O(2ⁿ)", color: "#b91c1c", dash: "10 3 2 3",
    name: "Exponential time",
    algos: ["Recursive Fibonacci (naive)", "Generating all subsets", "0/1 Knapsack (brute force)", "Travelling salesman (brute)", "Recursive tower of Hanoi"],
    fn: n => Math.pow(2, n),
  },
  {
    id: "nfact", label: "O(n!)", color: "#7f1d1d", dash: "3 3",
    name: "Factorial time",
    algos: ["Generating all permutations", "Brute-force TSP (all routes)", "Bogosort", "Solving n-queens (brute)", "Lexicographic ordering"],
    fn: n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; },
  },
]

// ─── Build SVG path string from a math function ──────────────────────────────
function buildPath(fn, clip = true) {
  let d = ""
  for (let i = 0; i <= STEPS; i++) {
    const n = (i / STEPS) * N
    const v = fn(n)
    d += i === 0
      ? `M ${sx(n).toFixed(1)} ${sy(v).toFixed(1)}`
      : ` L ${sx(n).toFixed(1)} ${sy(v).toFixed(1)}`
    if (clip && v > YMAX * 1.02) break
  }
  return d
}

// Build a filled polygon between two curves (upper and lower bounding fns)
// upper curve drawn left→right, lower curve drawn right→left to close shape
function buildBand(fnTop, fnBottom) {
  const pts = []
  // forward along top curve
  for (let i = 0; i <= STEPS; i++) {
    const n = (i / STEPS) * N
    const v = fnTop(n)
    if (v > YMAX * 1.02) { pts.push(`${sx(n).toFixed(1)},${PT}`); break }
    pts.push(`${sx(n).toFixed(1)},${sy(v).toFixed(1)}`)
  }
  // backward along bottom curve
  for (let i = STEPS; i >= 0; i--) {
    const n = (i / STEPS) * N
    const v = fnBottom(n)
    if (v > YMAX * 1.02) continue
    pts.push(`${sx(n).toFixed(1)},${sy(v).toFixed(1)}`)
  }
  return pts.join(" ")
}

// ─── Performance zones bounded by actual curves ──────────────────────────────
// Each zone fills the region between two complexity curves
const zones = [
  {
    label: "Excellent",
    sublabel: "≤ O(1)",
    fill: "#bbf7d0", tc: "#14532d",
    // from O(1) down to the x-axis (y = CH bottom)
    points: () => {
      const pts = []
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
    label: "Good",
    sublabel: "O(log n)",
    fill: "#d1fae5", tc: "#065f46",
    points: () => buildBand(n => Math.log2(n + 1), n => 1),
    lx: () => PL + CW * 0.55,
    ly: () => sy(Math.log2(N * 0.55 + 1)) - 10,
  },
  {
    label: "Fair",
    sublabel: "O(n)",
    fill: "#fef9c3", tc: "#854d0e",
    points: () => buildBand(n => n, n => Math.log2(n + 1)),
    lx: () => PL + CW * 0.4,
    ly: () => sy((N * 0.4 + Math.log2(N * 0.4 + 1)) / 2) + 4,
  },
  {
    label: "Bad",
    sublabel: "O(n log n) – O(n²)",
    fill: "#fed7aa", tc: "#9a3412",
    points: () => buildBand(n => n * n, n => n),
    lx: () => PL + CW * 0.22,
    ly: () => sy((N * 0.22 * N * 0.22 + N * 0.22) / 2) - 6,
  },
  {
    label: "Horrible",
    sublabel: "O(2ⁿ) and beyond",
    fill: "#fecaca", tc: "#991b1b",
    points: () => buildBand(n => Math.pow(2, n), n => n * n),
    lx: () => PL + CW * 0.10,
    ly: () => sy((Math.pow(2, N * 0.10) + (N * 0.10) * (N * 0.10)) / 2) - 8,
  },
]

function getTagPos(fn) {
  for (let i = STEPS; i >= 1; i--) {
    const n = (i / STEPS) * N, v = fn(n)
    if (v <= YMAX * 0.97) return { tx: sx(n), ty: sy(v) }
  }
  return { tx: sx(N), ty: sy(fn(N)) }
}

// ─── Component ───────────────────────────────────────────────────────────────
const BigOVisualizer = () => {
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, c: null })
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const showTooltip = useCallback((c) => {
    if (!svgRef.current || !containerRef.current) return
    const svgRect = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const scale = svgRect.width / VW
    const { tx, ty } = getTagPos(c.fn)
    let x = tx * scale + svgRect.left - containerRect.left + 14
    let y = ty * scale + svgRect.top - containerRect.top - 10
    // keep tooltip inside container horizontally
    const tipW = 280
    if (x + tipW > containerRect.width - 8) x = x - tipW - 28
    setTooltip({ visible: true, x, y, c })
  }, [])

  const hideTooltip = useCallback(() => setTooltip(t => ({ ...t, visible: false })), [])
  const handleEnter = useCallback((c) => { setHovered(c.id); showTooltip(c) }, [showTooltip])
  const handleLeave = useCallback(() => { setHovered(null); hideTooltip() }, [hideTooltip])

  return (
    <div ref={containerRef} style={{ padding: "1.25rem 0.5rem", fontFamily: "sans-serif", position: "relative" }}>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginBottom: 16, padding: "0 6px" }}>
        {fns.map(c => (
          <div key={c.id}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151", cursor: "pointer", userSelect: "none", opacity: hovered && hovered !== c.id ? 0.25 : 1, transition: "opacity 0.2s" }}
            onMouseEnter={() => handleEnter(c)}
            onMouseLeave={handleLeave}
          >
            {c.dash
              ? <span style={{ width: 30, height: 0, borderTop: `3px dashed ${c.color}`, display: "inline-block", flexShrink: 0 }} />
              : <span style={{ width: 30, height: 3, borderRadius: 2, background: c.color, display: "inline-block", flexShrink: 0 }} />
            }
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: "relative" }}>
        <svg ref={svgRef} width="100%" viewBox={`0 0 ${VW} ${VH}`} role="img" style={{ display: "block" }}>

          {/* ── Performance zone fills (curve-bounded) ── */}
          {zones.map(z => (
            <polygon key={z.label} points={z.points()} fill={z.fill} opacity={0.72} />
          ))}

          {/* ── Zone labels rendered AFTER fills so they sit on top ── */}
          {zones.map(z => {
            const lx = z.lx(), ly = z.ly()
            return (
              <g key={z.label + "_lbl"}>
                <text x={lx} y={ly} textAnchor="middle" fontSize={15} fontWeight={800} fill={z.tc} fontFamily="sans-serif" opacity={0.9}>
                  {z.label}
                </text>
                <text x={lx} y={ly + 19} textAnchor="middle" fontSize={12} fontWeight={500} fill={z.tc} fontFamily="sans-serif" opacity={0.7}>
                  {z.sublabel}
                </text>
              </g>
            )
          })}

          {/* ── Grid ── */}
          {[1, 2, 3, 4].map(i => (
            <line key={`gy${i}`} x1={PL} x2={PL + CW} y1={PT + (i / 4) * CH} y2={PT + (i / 4) * CH}
              stroke="#d1d5db" strokeDasharray="5 4" strokeWidth={0.8} />
          ))}
          {[1, 2, 3, 4, 5].map(i => (
            <line key={`gx${i}`} x1={PL + (i / 5) * CW} x2={PL + (i / 5) * CW} y1={PT} y2={PT + CH}
              stroke="#d1d5db" strokeDasharray="5 4" strokeWidth={0.8} />
          ))}

          {/* ── Axes ── */}
          <line x1={PL} x2={PL} y1={PT} y2={PT + CH} stroke="#111827" strokeWidth={3} />
          <line x1={PL} x2={PL + CW} y1={PT + CH} y2={PT + CH} stroke="#111827" strokeWidth={3} />
          <polygon points={`${PL + CW},${PT + CH} ${PL + CW - 10},${PT + CH - 5} ${PL + CW - 10},${PT + CH + 5}`} fill="#111827" />
          <polygon points={`${PL},${PT} ${PL - 5},${PT + 10} ${PL + 5},${PT + 10}`} fill="#111827" />

          {/* ── X-axis tick labels ── */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <text key={i} x={PL + (i / 5) * CW} y={PT + CH + 22}
              textAnchor="middle" fontSize={13} fill="#6b7280" fontFamily="sans-serif">
              {Math.round(i / 5 * N)}
            </text>
          ))}

          {/* ── Axis titles ── */}
          <text x={PL + CW / 2} y={VH - 6} textAnchor="middle" fontSize={17} fontWeight={700} fill="#111827" fontFamily="sans-serif">
            Input size (n)
          </text>
          <text textAnchor="middle" fontSize={17} fontWeight={700} fill="#111827" fontFamily="sans-serif"
            transform={`rotate(-90) translate(${-(PT + CH / 2)}, 20)`}>
            Operations
          </text>

          {/* ── Complexity curves + tags ── */}
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
                  strokeWidth={active ? 5.5 : 3}
                  strokeDasharray={c.dash || undefined}
                  fill="none" strokeLinecap="round" strokeLinejoin="round"
                  opacity={dim ? 0.15 : 1}
                  style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
                />
                {/* invisible fat hit area */}
                <path
                  d={buildPath(c.fn)}
                  stroke="transparent"
                  strokeWidth={18}
                  fill="none"
                />
                <rect
                  x={tx - tw / 2} y={ty - th - 6} width={tw} height={th} rx={8}
                  fill={active ? c.color : "white"} stroke={c.color} strokeWidth={2}
                  opacity={dim ? 0.15 : 1}
                  style={{ transition: "fill 0.2s, opacity 0.2s" }}
                />
                <text
                  x={tx} y={ty - 6 - th / 2 + 7}
                  textAnchor="middle" fontSize={14} fontWeight={700}
                  fill={active ? "white" : c.color} fontFamily="sans-serif"
                  opacity={dim ? 0.15 : 1}
                  style={{ transition: "fill 0.2s, opacity 0.2s" }}
                >
                  {c.label}
                </text>
              </g>
            )
          })}

          {/* ── Right-side zone legend ── */}
          {[
            { label: "Excellent", fill: "#bbf7d0", tc: "#14532d", sub: "≤ O(1)" },
            { label: "Good",      fill: "#d1fae5", tc: "#065f46", sub: "O(log n)" },
            { label: "Fair",      fill: "#fef9c3", tc: "#854d0e", sub: "O(n)" },
            { label: "Bad",       fill: "#fed7aa", tc: "#9a3412", sub: "O(n²)" },
            { label: "Horrible",  fill: "#fecaca", tc: "#991b1b", sub: "O(2ⁿ)+" },
          ].map((z, i) => {
            const bx = PL + CW + 18
            const by = PT + 20 + i * 52
            return (
              <g key={z.label + "_legend"}>
                <rect x={bx} y={by} width={16} height={16} rx={4} fill={z.fill} stroke={z.tc} strokeWidth={1.2} />
                <text x={bx + 22} y={by + 7} fontSize={13} fontWeight={700} fill={z.tc} fontFamily="sans-serif" dominantBaseline="middle">
                  {z.label}
                </text>
                <text x={bx + 22} y={by + 22} fontSize={11} fill={z.tc} fontFamily="sans-serif" opacity={0.8}>
                  {z.sub}
                </text>
              </g>
            )
          })}

        </svg>

        {/* ── Tooltip ── */}
        {tooltip.visible && tooltip.c && (
          <div style={{
            position: "absolute", left: tooltip.x, top: tooltip.y,
            background: "white", border: `2px solid ${tooltip.c.color}`,
            borderRadius: 12, padding: "14px 16px", minWidth: 230, maxWidth: 290,
            boxShadow: "0 8px 28px rgba(0,0,0,0.13)", pointerEvents: "none",
            zIndex: 10, fontFamily: "sans-serif",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: tooltip.c.color, marginBottom: 4 }}>
              {tooltip.c.label}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, fontWeight: 500 }}>
              {tooltip.c.name}
            </div>
            <div style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginBottom: 4 }}>
              Common algorithms:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#374151", lineHeight: 1.9 }}>
              {tooltip.c.algos.map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default BigOVisualizer