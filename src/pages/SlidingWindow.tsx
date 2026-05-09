import { useState } from "react"
import { generateSlidingWindowStates } from "@/algorithms/SlidingWindow"
import ArrayVisualizer from "@/components/dataStructure/ArrayVisualizer";
import ActionPanel from "@/components/controls/ActionPanel";

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
    const current = states[step];

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

            <ActionPanel step={step} setStep={setStep} statesLength={states.length} />

        </div>
    )
}

export default SlidingWindow