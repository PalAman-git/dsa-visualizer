import { useEffect, useState } from "react"
import { generateSlidingWindowStates } from "@/algorithms/SlidingWindow"
import ArrayVisualizer from "@/components/dataStructure/ArrayVisualizer";

type State = {
    i: number;
    j: number;
    sum: number;
    window: number[];
}

const SlidingWindow = () => {
    const nums = [1, 2, 3, 4, 5];
    const k = 7;
    const states: State[] = generateSlidingWindowStates(nums, k);

    const [step, setStep] = useState(0);
    const [time, setTime] = useState(2000);
    const current = states[step];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(prev => {
                if (prev < states.length - 1) {
                    return prev + 1;
                }

                return prev;
            });
        }, time);

        return () => clearInterval(timer);
    }, [time]);

    return (
        <div className="p-10">

            <ArrayVisualizer
                items={nums}
                highlightedIndices={
                    Array.from(
                        { length: current.j - current.i + 1 },
                        (_, k) => current.i + k
                    )
                }
                pointers={[
                    {
                        index: current.i,
                        label: "i",
                        position: "bottom"
                    },
                    {
                        index: current.j,
                        label: "j",
                        position: "top"
                    }
                ]}
            />
            <div className="mt-10 text-2xl">Sum: {current.sum}</div>

            <button
                className="mt-4 px-4 py-2 bg-black text-white rounded"
                onClick={() => {
                    if (step < states.length - 1) {
                        setStep(step + 1);
                    }
                }}
            >
                Next
            </button>

            <button
                className="mt-4 ml-4 px-4 py-2 bg-black text-white rounded"
                onClick={() => setTime(time + 1000)}
            >
                +1 s
            </button>

        </div>
    )
}

export default SlidingWindow