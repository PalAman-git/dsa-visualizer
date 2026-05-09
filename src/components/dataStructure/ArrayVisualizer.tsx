import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

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
    pointers = []
}: Props<T>) => {

    return (

        <div className="flex justify-center">

            {items.map((item, idx) => {

                const isHighlighted =
                    highlightedIndices.includes(idx);

                return (

                    <motion.div
                        layout
                        key={idx}
                        className={`
                            relative
                            border border-orange-200
                            text-black
                            w-12 h-12
                            flex items-center justify-center
                            text-xl
                            ${foundIndex === idx
                                ? "bg-green-200"
                                : isHighlighted
                                    ? "bg-orange-200"
                                    : "bg-white"}
                        `}
                    >

                        {String(item)}

                        {pointers.map((pointer, pIdx) => {

                            if (pointer.index !== idx) {
                                return null;
                            }

                            const sameIndexPointers =
                                pointers.filter(
                                    p => p.index === idx
                                );

                            const currentPointerIndex =
                                sameIndexPointers.findIndex(
                                    p => p.label === pointer.label
                                );

                            let offset = 0;

                            if (sameIndexPointers.length === 2) {

                                offset =
                                    currentPointerIndex === 0
                                        ? -10
                                        : 10;
                            }

                            else if (sameIndexPointers.length === 3) {

                                const positions = [-18, 0, 18];

                                offset =
                                    positions[currentPointerIndex];
                            }

                            return (

                                <div
                                    key={pIdx}

                                    className={`
                absolute
                left-1/2
                flex flex-col items-center
                text-sm
                font-semibold
                ${pointer.color ?? "text-black"}
                ${pointer.position === "bottom"
                                            ? "-bottom-8"
                                            : "-top-8"
                                        }
            `}

                                    style={{
                                        transform:
                                            `translateX(calc(-50% + ${offset}px))`
                                    }}
                                >

                                    {
                                        pointer.position === "bottom"
                                            ? (
                                                <>
                                                    <ArrowUp
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />

                                                    <span>
                                                        {pointer.label}
                                                    </span>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <span>
                                                        {pointer.label}
                                                    </span>

                                                    <ArrowDown
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />
                                                </>
                                            )
                                    }

                                </div>

                            );

                        })}

                    </motion.div>

                );
            })}

        </div>

    );
};

export default ArrayVisualizer;