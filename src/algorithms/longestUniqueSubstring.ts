export type State = {
    i: number;
    j: number;

    currentWindow: string;
    seen: string[];
    maxLen: number;
    duplicate?: string;
};

export function generateLongestUniqueSubstringStates(s:string) :State[]{
    const states: State[] = [];

    let i = 0;
    let maxLen = 0;

    const set = new Set<string>();

    for(let j=0;j<s.length;j++){
        while(set.has(s[j])){

            states.push({
                i,
                j,
                currentWindow:s.slice(i,j),
                seen:[...set],
                maxLen,
                duplicate:s[j]
            });

            set.delete(s[i]);
            i++;
        }

        set.add(s[j]);

        maxLen = Math.max(maxLen,j-i+1);

        states.push({
            i,
            j,
            currentWindow:s.slice(i,j+1),
            seen:[...set],
            maxLen
        })
    }

    return states;
}