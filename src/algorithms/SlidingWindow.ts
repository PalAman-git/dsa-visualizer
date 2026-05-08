export function generateSlidingWindowStates(
    nums:number[],
    k:number
){
    const states = [];

    let i=0;
    let sum = 0;

    for(let j=0;j<nums.length;j++){
        sum += nums[j];

        states.push({
            i,
            j,
            sum,
            window:nums.slice(i,j+1)
        });

        while(sum >= k){
            //storing the 

            sum -= nums[i];
            i++;

            states.push({
                i,
                j,
                sum,
                window:nums.slice(i,j+1)
            });
        }
    }

    return states;
}