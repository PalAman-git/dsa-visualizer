import ActionPanel from "@/components/controls/ActionPanel"
import ArrayVisualizer from "@/components/dataStructure/ArrayVisualizer"

// ─── Types ───────────────────────────────────────────────────────────────────

type Pointer = {
    index: number
    label: string
    position?: "top" | "bottom"
    color?: string
}

export type MetaItem = {
    name: string
    value: React.ReactNode
}

export type LegendItem = {
    label: string
    desc: string
    color: string
}

export type StatCard = {
    label: string
    value: React.ReactNode
    accent?: "blue" | "red" | "green" | "purple" | "orange" | "default"
}

export type SetPanel = {
    title: string
    items: string[]
    accent?: "blue" | "red" | "green" | "purple" | "orange" | "default"
}

export type AlgoLayoutProps<T> = {
    // ── Identity
    title: string
    subtitle?: string

    // ── Array
    items: T[]
    highlightedIndices?: number[]
    foundIndex?: number
    pointers?: Pointer[]

    // ── Controls
    step: number
    statesLength: number
    setStep: React.Dispatch<React.SetStateAction<number>>

    // ── Optional sections
    /** key=value strip under the header */
    meta?: MetaItem[]
    /** Terminal-style status line */
    status?: string
    statusVariant?: "info" | "success" | "error"
    /** Pointer legend row */
    legend?: LegendItem[]
    /** Variable state cards */
    stats?: StatCard[]
    /** Set / stack / queue chip panels */
    sets?: SetPanel[]
    /** Fully custom extra section */
    extra?: React.ReactNode
}

// ─── Color map ────────────────────────────────────────────────────────────────

const ACCENT: Record<NonNullable<StatCard["accent"]>, { text: string; bg: string; border: string; chip: string }> = {
    blue:    { text: "#38bdf8", bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.25)",  chip: "rgba(56,189,248,0.15)"  },
    red:     { text: "#f87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)", chip: "rgba(248,113,113,0.15)" },
    green:   { text: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.25)",  chip: "rgba(52,211,153,0.15)"  },
    purple:  { text: "#c084fc", bg: "rgba(192,132,252,0.08)",  border: "rgba(192,132,252,0.25)", chip: "rgba(192,132,252,0.15)" },
    orange:  { text: "#fb923c", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.25)",  chip: "rgba(251,146,60,0.15)"  },
    default: { text: "var(--text-h)", bg: "var(--code-bg)",    border: "var(--border)",          chip: "var(--code-bg)"         },
}

const STATUS_STYLE = {
    info:    { bg: "var(--code-bg)",           border: "var(--accent)",  color: "var(--text)"   },
    success: { bg: "rgba(34,197,94,0.08)",     border: "#22c55e",        color: "#16a34a"       },
    error:   { bg: "rgba(239,68,68,0.08)",     border: "#ef4444",        color: "#dc2626"       },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AlgoLayout<T>({
    title,
    subtitle,
    items,
    highlightedIndices = [],
    foundIndex,
    pointers = [],
    step,
    statesLength,
    setStep,
    meta,
    status,
    statusVariant = "info",
    legend,
    stats = [],
    sets = [],
    extra,
}: AlgoLayoutProps<T>) {
    const mono = "var(--mono, 'JetBrains Mono', monospace)"
    const ss = STATUS_STYLE[statusVariant]

    return (
        <div
            className="min-h-screen px-4 py-8 sm:px-6 md:px-10 md:py-12"
            style={{ background: "var(--bg)", fontFamily: mono }}
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* ── Header ── */}
                <div className="flex flex-col gap-1">
                    <span style={{ color: "var(--text)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Algorithm Visualizer
                    </span>
                    <h1 style={{
                        color: "var(--text-h)", fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                        fontWeight: 600, margin: 0, letterSpacing: "-0.02em",
                        fontFamily: "var(--heading, var(--sans))",
                    }}>
                        {title}
                        {subtitle && (
                            <span style={{ color: "var(--text)", fontFamily: mono, fontWeight: 400, fontSize: "0.6em", marginLeft: "0.75rem" }}>
                                {subtitle}
                            </span>
                        )}
                    </h1>
                </div>

                {/* ── Meta strip ── */}
                {meta && meta.length > 0 && (
                    <div
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-4"
                        style={{ borderBottom: "1px solid var(--border)", fontFamily: mono }}
                    >
                        {meta.map(({ name, value }) => (
                            <span key={name} className="text-xs" style={{ color: "var(--text)" }}>
                                <span style={{ color: "var(--accent)" }}>{name}</span>
                                <span> = </span>
                                <code style={{ background: "var(--code-bg)", color: "var(--text-h)", borderRadius: 4, padding: "2px 6px", fontSize: 13 }}>
                                    {value}
                                </code>
                            </span>
                        ))}
                    </div>
                )}

                {/* ── Controls ── */}
                <div style={{ borderBottom: meta ? undefined : "1px solid var(--border)", paddingBottom: meta ? 0 : "1.25rem" }}>
                    <ActionPanel step={step} statesLength={statesLength} setStep={setStep} />
                </div>

                {/* ── Status line ── */}
                {status && (
                    <div
                        className="text-sm px-4 py-2.5 rounded"
                        style={{ fontFamily: mono, background: ss.bg, borderLeft: `2px solid ${ss.border}`, color: ss.color }}
                    >
                        <span style={{ color: "var(--text)" }}>$ </span>
                        {status}
                    </div>
                )}

                {/* ── Legend ── */}
                {legend && legend.length > 0 && (
                    <div className="flex flex-wrap gap-4 text-xs" style={{ fontFamily: mono, color: "var(--text)" }}>
                        {legend.map(({ label, desc, color }) => (
                            <div key={label + desc} className="flex items-center gap-2">
                                <span
                                    className="w-2 h-2 shrink-0"
                                    style={{
                                        background: color,
                                        borderRadius: label === "■" ? 2 : "50%",
                                        display: "inline-block",
                                    }}
                                />
                                <span className="font-bold" style={{ color }}>{label === "■" ? "" : label}</span>
                                {label !== "■" && <span>—</span>}
                                <span>{desc}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Array card ── */}
                <div style={{ background: "var(--code-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "1.25rem 1rem" }}>
                    <ArrayVisualizer
                        items={items}
                        highlightedIndices={highlightedIndices}
                        foundIndex={foundIndex}
                        pointers={pointers}
                    />
                </div>

                {/* ── Stat cards ── */}
                {stats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {stats.map(({ label, value, accent = "default" }) => {
                            const a = ACCENT[accent]
                            return (
                                <div key={label} style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: 8, padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: 4 }}>
                                    <span style={{ fontSize: 10, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                        {label}
                                    </span>
                                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: a.text, fontFamily: mono }}>
                                        {value}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* ── Set panels ── */}
                {sets.map(({ title: setTitle, items: setItems, accent = "blue" }) => {
                    const a = ACCENT[accent]
                    return (
                        <div key={setTitle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: 11, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    {setTitle}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: a.text, background: a.chip, border: `1px solid ${a.border}`, borderRadius: 4, padding: "1px 6px" }}>
                                    {setItems.length}
                                </span>
                                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 36 }}>
                                {setItems.length === 0 && (
                                    <span style={{ color: "var(--text)", fontSize: 12, opacity: 0.5, alignSelf: "center" }}>empty</span>
                                )}
                                {setItems.map((char, idx) => (
                                    <div key={`${char}-${idx}`} style={{ padding: "4px 14px", background: a.chip, border: `1px solid ${a.border}`, borderRadius: 6, color: a.text, fontSize: 13, fontWeight: 700, fontFamily: mono, letterSpacing: "0.05em" }}>
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {/* ── Custom extra ── */}
                {extra}

            </div>
        </div>
    )
}