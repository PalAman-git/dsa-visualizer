import SlidingWindow
from "@/pages/SlidingWindow";

import LongestUniqueSubstring
from "@/pages/LongestUniqueSubstring";

import FindInSortedArray from "@/pages/BinarySearch/FindInSortedArray";

export const algorithms = [

    {
        category: "Sliding Window",

        items: [
            {
                id: "sliding-window",

                label: "Fixed Window Sum",

                component: <SlidingWindow />
            },

            {
                id: "longest-unique",

                label:
                    "Longest Unique Substring",

                component:
                    <LongestUniqueSubstring />
            }
        ]
    },
    {
        category:"Binary Search",

        items:[
            {
                id: "find-element-in-sorted-array",
                label: "Find Element in Sorted Array",
                component: <FindInSortedArray />
            }
        ]
    }

];