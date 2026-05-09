import { generateFindInSortedArrayStates, type State } from "@/algorithms/BinarySearch/findInSortedArray";
import ActionPanel from "@/components/controls/ActionPanel";
import ArrayVisualizer from "@/components/dataStructure/ArrayVisualizer";
import { useState } from "react";

const FindInSortedArray = () => {
    const nums = [2, 5, 9, 11, 20, 21, 23, 25, 27, 33, 37, 39, 40, 48, 55, 70, 81, 82, 89, 90,];
    const k = 40;

    const question = "Find a number in Sorted Array";

    const states: State[] = generateFindInSortedArrayStates(nums, k);

    const [step, setStep] = useState(0);
    const current = states[step];


    return (
        <div className="p-10">
            <div className="flex justify-center items-center gap-4 mb-10">

                <ArrayVisualizer
                    items={nums}
                    highlightedIndices={[current.mid]}
                    foundIndex={current.found ? current.mid : -1}
                    pointers={[
                        {
                            index: current.i,
                            label: "i",
                            position: 'bottom',
                            color: "text-blue-500"
                        },
                        {
                            index: current.mid,
                            label: "mid",
                            position: 'top',
                            color: "text-green-500"
                        },
                        {
                            index: current.j,
                            label: 'j',
                            position: 'bottom',
                            color: "text-red-500"
                        }
                    ]}
                />
                <span className="h-12 text-xl w-12 flex justify-center items-center border-green-200 border">{k}</span> :Target
            </div>

                <ActionPanel step={step} statesLength={states.length} setStep={setStep} />
        </div>
    )
}

export default FindInSortedArray