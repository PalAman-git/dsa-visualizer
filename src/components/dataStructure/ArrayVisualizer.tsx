import { motion, LayoutGroup } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

type Pointer = {
    index: number;
    label: string;
    position?: "top" | "bottom";
    color?: string;
};

type Props<T> = {
    items: T[];
    highlightedIndices?: number[];
    foundIndex?: number;
    pointers?: Pointer[];
};

const ArrayVisualizer = <T,>({
    items,
    highlightedIndices = [],
    foundIndex,
    pointers = [],
}: Props<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cellOffsets, setCellOffsets] = useState<number[]>([]);

    const measureCells = useCallback(() => {
        if (!containerRef.current) return;
        const cells = containerRef.current.querySelectorAll<HTMLElement>("[data-cell]");
        const containerLeft = containerRef.current.getBoundingClientRect().left;
        const offsets = Array.from(cells).map(
            (cell) =>
                cell.getBoundingClientRect().left -
                containerLeft +
                cell.offsetWidth / 2
        );
        setCellOffsets(offsets);
    }, []);

    useEffect(() => { measureCells(); }, [items.length, measureCells]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(() => measureCells());
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [measureCells]);

    const getPointerOffset = (pointer: Pointer): number => {
        const siblings = pointers.filter(
            (p) =>
                p.index === pointer.index &&
                (p.position ?? "top") === (pointer.position ?? "top")
        );
        if (siblings.length === 1) return 0;
        const myIdx = siblings.findIndex((p) => p.label === pointer.label);
        if (siblings.length === 2) return myIdx === 0 ? -10 : 10;
        return ([-18, 0, 18] as number[])[myIdx] ?? 0;
    };

    const renderPointers = (position: "top" | "bottom") =>
        pointers
            .filter((p) => (p.position ?? "top") === position)
            .map((pointer) => {
                const estimatedCellWidth = containerRef.current
                    ? containerRef.current.offsetWidth / items.length
                    : 40;
                const centerX =
                    cellOffsets[pointer.index] ??
                    pointer.index * estimatedCellWidth + estimatedCellWidth / 2;
                const offset = getPointerOffset(pointer);

                // Extract a raw CSS color from the Tailwind class if provided,
                // else fall back to the theme accent
                const colorMap: Record<string, string> = {
                    "text-blue-500":   "#3b82f6",
                    "text-purple-500": "var(--accent)",
                    "text-red-500":    "#ef4444",
                    "text-green-500":  "#22c55e",
                };
                const resolvedColor = pointer.color
                    ? (colorMap[pointer.color] ?? pointer.color)
                    : "var(--text-h)";

                return (
                    <motion.div
                        key={pointer.label}
                        layoutId={`pointer-${pointer.label}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`
                            absolute flex flex-col items-center
                            text-[10px] sm:text-xs font-bold tracking-wider whitespace-nowrap
                            ${position === "top" ? "bottom-0" : "top-0"}
                        `}
                        style={{
                            left: centerX + offset,
                            transform: "translateX(-50%)",
                            color: resolvedColor,
                            fontFamily: "var(--mono)",
                        }}
                    >
                        {position === "top" ? (
                            <>
                                <span>{pointer.label}</span>
                                <ArrowDown size={11} strokeWidth={2.5} />
                            </>
                        ) : (
                            <>
                                <ArrowUp size={11} strokeWidth={2.5} />
                                <span>{pointer.label}</span>
                            </>
                        )}
                    </motion.div>
                );
            });

    return (
        <LayoutGroup>
            <div className="w-full" style={{ fontFamily: "var(--mono)" }}>
                <div className="relative flex flex-col items-stretch">

                    {/* Top pointer row */}
                    <div className="relative h-7 sm:h-8">
                        {renderPointers("top")}
                    </div>

                    {/* Array cells */}
                    <div ref={containerRef} className="flex" style={{ borderRadius: "4px", overflow: "hidden" }}>
                        {items.map((item, idx) => {
                            const isHighlighted = highlightedIndices.includes(idx);
                            const isFound = foundIndex === idx;

                            let bg = "var(--bg)";
                            let color = "var(--text)";
                            let borderColor = "var(--border)";

                            if (isFound) {
                                bg = "rgba(34,197,94,0.12)";
                                color = "#16a34a";
                                borderColor = "#22c55e";
                            } else if (isHighlighted) {
                                bg = "var(--accent-bg)";
                                color = "var(--accent)";
                                borderColor = "var(--accent-border)";
                            }

                            return (
                                <motion.div
                                    layout
                                    key={idx}
                                    data-cell
                                    className="relative flex-1 min-w-0 flex items-center justify-center text-[11px] sm:text-sm font-medium transition-colors duration-150"
                                    style={{
                                        height: "2.5rem",
                                        background: bg,
                                        color,
                                        borderTop: `1px solid ${borderColor}`,
                                        borderBottom: `1px solid ${borderColor}`,
                                        borderRight: `1px solid ${borderColor}`,
                                        borderLeft: idx === 0 ? `1px solid ${borderColor}` : "none",
                                    }}
                                >
                                    {String(item)}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Index row */}
                    <div className="flex">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className="flex-1 min-w-0 flex items-center justify-center pt-1"
                                style={{
                                    fontSize: "9px",
                                    color: "var(--text)",
                                    fontFamily: "var(--mono)",
                                    opacity: 0.5,
                                }}
                            >
                                {idx}
                            </div>
                        ))}
                    </div>

                    {/* Bottom pointer row */}
                    <div className="relative h-7 sm:h-8">
                        {renderPointers("bottom")}
                    </div>

                </div>
            </div>
        </LayoutGroup>
    );
};

export default ArrayVisualizer;