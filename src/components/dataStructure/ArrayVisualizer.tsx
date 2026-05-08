import { motion } from "framer-motion";

type Pointer = {
    index: number;
    label: string;
    position?: "top" | "bottom";
};

type Props<T> = {
    items: T[];

    highlightedIndices?: number[];

    pointers?: Pointer[];
};

const ArrayVisualizer = <T,>({
    items,
    highlightedIndices = [],
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
                            w-16 h-16
                            flex items-center justify-center
                            text-xl
                            ${
                                isHighlighted
                                    ? "bg-orange-200"
                                    : "bg-white"
                            }
                        `}
                    >

                        {String(item)}

                        {pointers.map((pointer, pIdx) => (

                            pointer.index === idx && (

                                <div
                                    key={pIdx}
                                    className={`
                                        absolute text-sm
                                        ${
                                            pointer.position === "bottom"
                                                ? "-bottom-6"
                                                : "-top-6"
                                        }
                                    `}
                                >
                                    {pointer.label}
                                </div>

                            )

                        ))}

                    </motion.div>

                );
            })}

        </div>

    );
};

export default ArrayVisualizer;