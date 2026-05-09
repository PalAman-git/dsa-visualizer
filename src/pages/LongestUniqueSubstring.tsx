import { useState } from "react";
import ArrayVisualizer from "../components/dataStructure/ArrayVisualizer";
import { generateLongestUniqueSubstringStates, type State } from "../algorithms/longestUniqueSubstring";
import ActionPanel from "@/components/controls/ActionPanel";

const LongestUniqueSubstring = () => {
    const s = "abcdcdabbbef";
    const chars = s.split("");

    const states: State[] = generateLongestUniqueSubstringStates(s);
    const [step, setStep] = useState(0);
    const current = states[step];

    return (
        <div className="p-10">
            <ActionPanel className="mb-10" setStep={setStep} step={step} statesLength={states.length}/>

            <ArrayVisualizer
                items={chars}
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
                        position: "bottom",
                        color:"text-blue-500"
                    },
                    {
                        index: current.j,
                        label: "j",
                        position: "top",
                        color:"text-red-500"
                    }
                ]}
            />
            <div className="mt-10 text-2xl">

                Window:
                {current.currentWindow}

            </div>

            <div className="mt-4 text-2xl">

                Max Length:
                {current.maxLen}

            </div>

            <div className="mt-10">

                <div className="text-xl mb-4">
                    HashSet
                </div>

                <div className="flex justify-center gap-4">

                    {current.seen.map((char, idx) => (

                        <div
                            key={idx}
                            className="
                    px-4 py-2
                    bg-blue-400
                    text-white
                    rounded
                "
                        >
                            {char}
                        </div>

                    ))}

                </div>

            </div>
            
        </div>
    )
}

export default LongestUniqueSubstring