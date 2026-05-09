import { generateFindInSortedArrayStates, type State } from "@/algorithms/BinarySearch/findInSortedArray";
import ArrayVisualizer from "@/components/dataStructure/ArrayVisualizer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FindInSortedArray = () => {
    const nums = [2, 5, 9, 11, 20, 21, 23, 25, 27, 33, 37, 39, 40, 48, 55, 70, 81, 82, 89, 90,];
    const k = 38;

    const states: State[] = generateFindInSortedArrayStates(nums, k);

    const [step, setStep] = useState(0);
    const current = states[step];


    return (
        <div className="p-10">
            <div className="flex justify-center items-center gap-4">

                <ArrayVisualizer
                    items={nums}
                    highlightedIndices={[current.mid]}
                    pointers={[
                        {
                            index: current.i,
                            label: "left",
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
                            label: 'right',
                            position: 'bottom',
                            color: "text-red-500"
                        }
                    ]}
                />
                <span className="h-16 text-xl w-16 flex justify-center items-center border-green-200 border">{k}</span> :Target
            </div>

            <div className="mt-10">
                <span className="text-orange-400">{current.found ? "Mid == Target" : "Mid != Target"}</span>
            </div>

            <div className="flex justify-center gap-4 mt-10">

                <Button onClick={() => {
                    setStep((prev) => {
                        if (prev > 0) {
                            return prev - 1;
                        }
                        return prev;
                    })
                }}>
                    Prev
                </Button>
                <Button onClick={() => {
                    setStep((prev) => {
                        if (prev < states.length - 1) {
                            return prev + 1;
                        }
                        return prev;
                    })
                }}>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default FindInSortedArray