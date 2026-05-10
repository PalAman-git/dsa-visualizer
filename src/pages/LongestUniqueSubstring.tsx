import { useState } from "react"
import { AlgoLayout } from "@/components/layout/AlgoLayout"
import { generateLongestUniqueSubstringStates, type State } from "../algorithms/longestUniqueSubstring"

const LongestUniqueSubstring = () => {
    const s = "abcdcdabbbef"
    const chars = s.split("")

    const states: State[] = generateLongestUniqueSubstringStates(s)
    const [step, setStep] = useState(0)
    const current = states[step]

    return (
        <AlgoLayout
            title="Longest Unique Substring"
            subtitle="slidingWindow(s)"
            items={chars}
            highlightedIndices={Array.from(
                { length: current.j - current.i + 1 },
                (_, k) => current.i + k
            )}
            pointers={[
                { index: current.i, label: "i", position: "bottom", color: "text-blue-500" },
                { index: current.j, label: "j", position: "top",    color: "text-red-500"  },
            ]}
            step={step}
            statesLength={states.length}
            setStep={setStep}
            stats={[
                { label: "i (left)",       value: current.i,             accent: "blue"    },
                { label: "j (right)",      value: current.j,             accent: "red"     },
                { label: "window length",  value: current.j - current.i + 1, accent: "purple" },
                { label: "max length",     value: current.maxLen,        accent: "green"   },
            ]}
            sets={[
                { title: "HashSet — seen chars", items: current.seen, accent: "blue" },
            ]}
        />
    )
}

export default LongestUniqueSubstring