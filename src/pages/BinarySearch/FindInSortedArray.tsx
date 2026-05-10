import { useState } from "react"
import { AlgoLayout } from "@/components/layout/AlgoLayout"
import { generateFindInSortedArrayStates, type State } from "@/algorithms/BinarySearch/findInSortedArray"

const FindInSortedArray = () => {
    const nums = [2, 5, 9, 11, 20, 21, 23, 25, 27, 33, 37, 39, 40, 48, 55, 70, 81, 82, 89, 90]
    const k = 40

    const states: State[] = generateFindInSortedArrayStates(nums, k)
    const [step, setStep] = useState(0)
    const current = states[step]

    const isFound = current.found
    const isLast = step === states.length - 1

    const statusMessage = isFound
        ? `✓ Found ${k} at index ${current.mid}`
        : isLast
            ? `✗ ${k} not found in array`
            : `Checking index ${current.mid} → nums[${current.mid}] = ${nums[current.mid]}`

    return (
        <AlgoLayout
            title="Binary Search"
            subtitle={`findInSortedArray(nums, ${k})`}
            items={nums}
            highlightedIndices={[current.mid]}
            foundIndex={current.found ? current.mid : -1}
            pointers={[
                { index: current.i,   label: "i",   position: "bottom", color: "text-blue-500"   },
                { index: current.mid, label: "mid", position: "top",    color: "text-purple-500" },
                { index: current.j,   label: "j",   position: "bottom", color: "text-red-500"    },
            ]}
            step={step}
            statesLength={states.length}
            setStep={setStep}
            meta={[
                { name: "target", value: k },
                { name: "n",      value: nums.length },
                { name: "step",   value: `${step + 1} / ${states.length}` },
                { name: "time",   value: "O(log n)" },
            ]}
            status={statusMessage}
            statusVariant={isFound ? "success" : isLast ? "error" : "info"}
            legend={[
                { label: "i",   desc: "left bound",          color: "#3b82f6"       },
                { label: "mid", desc: "midpoint (checking)", color: "var(--accent)" },
                { label: "j",   desc: "right bound",         color: "#ef4444"       },
                { label: "■",   desc: "found",               color: "#22c55e"       },
                { label: "■",   desc: "active mid",          color: "var(--accent)" },
            ]}
            stats={[
                { label: "i",         value: current.i,         accent: "blue"    },
                { label: "mid",       value: current.mid,       accent: "purple"  },
                { label: "j",         value: current.j,         accent: "red"     },
                { label: "nums[mid]", value: nums[current.mid], accent: "default" },
            ]}
        />
    )
}

export default FindInSortedArray