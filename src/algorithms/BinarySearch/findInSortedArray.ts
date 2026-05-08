export type State = {
    i: number;
    j: number;
    mid: number;

    found: boolean;
}

export function generateFindInSortedArrayStates(nums: number[], target: number): State[] {
    let states: State[] = [];

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        states.push({
            i: left,
            j: right,
            mid: mid,
            found: false,
        })

        if (nums[mid] === target) {
            states.push({
                i: left,
                j: right,
                mid: mid,
                found: true,
            })

            break;
        } else if (nums[mid] > target) {
            right = mid - 1;

            states.push({
                i: left,
                j: right,
                mid: mid,
                found: false
            })
        } else if (nums[mid] < target) {
            left = mid + 1;

            states.push({
                i: left,
                j: right,
                mid: mid,
                found: false,
            })
        }

    }

    return states;
}