import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const waysToMakeFairArray: AlgorithmDefinition = {
  id: 'ways-to-make-fair-array',
  title: 'Ways to Make a Fair Array',
  leetcodeNumber: 1664,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of integers, count the number of indices where removing that element makes the resulting array fair. A fair array has equal sum of elements at even and odd indices. Use prefix sums of even/odd indexed elements to efficiently compute balance after each removal.',
  tags: ['dynamic programming', 'prefix sum', 'array', 'counting'],

  code: {
    pseudocode: `function waysToMakeFair(nums):
  n = len(nums)
  totalEven = sum of nums at even indices
  totalOdd = sum of nums at odd indices
  count = 0
  prefEven = prefOdd = 0
  for i from 0 to n-1:
    if i is even: totalEven -= nums[i]
    else: totalOdd -= nums[i]
    if prefEven + totalOdd == prefOdd + totalEven: count++
    if i is even: prefEven += nums[i]
    else: prefOdd += nums[i]
  return count`,
    python: `def waysToMakeFair(nums):
    n = len(nums)
    totalEven = sum(nums[i] for i in range(0,n,2))
    totalOdd = sum(nums[i] for i in range(1,n,2))
    count = prefEven = prefOdd = 0
    for i,v in enumerate(nums):
        if i%2==0: totalEven-=v
        else: totalOdd-=v
        if prefEven+totalOdd==prefOdd+totalEven: count+=1
        if i%2==0: prefEven+=v
        else: prefOdd+=v
    return count`,
    javascript: `function waysToMakeFair(nums) {
  const n = nums.length;
  let totalEven = 0, totalOdd = 0;
  for (let i = 0; i < n; i++) (i%2===0 ? totalEven : totalOdd) && (totalEven += i%2===0 ? nums[i] : 0, totalOdd += i%2===1 ? nums[i] : 0);
  totalEven = nums.filter((_,i)=>i%2===0).reduce((a,b)=>a+b,0);
  totalOdd = nums.filter((_,i)=>i%2===1).reduce((a,b)=>a+b,0);
  let count=0, prefEven=0, prefOdd=0;
  for (let i=0;i<n;i++) {
    if (i%2===0) totalEven-=nums[i]; else totalOdd-=nums[i];
    if (prefEven+totalOdd===prefOdd+totalEven) count++;
    if (i%2===0) prefEven+=nums[i]; else prefOdd+=nums[i];
  }
  return count;
}`,
    java: `public int waysToMakeFair(int[] nums) {
    int n=nums.length, totalEven=0, totalOdd=0;
    for (int i=0;i<n;i++) if(i%2==0) totalEven+=nums[i]; else totalOdd+=nums[i];
    int count=0,prefEven=0,prefOdd=0;
    for (int i=0;i<n;i++) {
        if(i%2==0) totalEven-=nums[i]; else totalOdd-=nums[i];
        if(prefEven+totalOdd==prefOdd+totalEven) count++;
        if(i%2==0) prefEven+=nums[i]; else prefOdd+=nums[i];
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [2, 1, 6, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 6, 4],
      placeholder: '2,1,6,4',
      helperText: 'Array of integers to check fair removal indices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    let totalEven = 0, totalOdd = 0;
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) totalEven += nums[i];
      else totalOdd += nums[i];
    }

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Array: [${nums.join(', ')}]. Total even-index sum = ${totalEven}, odd-index sum = ${totalOdd}.`,
      variables: { totalEven, totalOdd, count: 0 },
      visualization: makeViz([...nums], {}, {}),
    });

    let count = 0, prefEven = 0, prefOdd = 0;
    const fairIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) totalEven -= nums[i];
      else totalOdd -= nums[i];

      const leftEven = prefEven;
      const leftOdd = prefOdd;
      const rightEven = totalOdd; // right even becomes right odd after removal
      const rightOdd = totalEven; // right odd becomes right even after removal

      const newEvenSum = leftEven + rightEven;
      const newOddSum = leftOdd + rightOdd;
      const isFair = newEvenSum === newOddSum;

      if (isFair) { count++; fairIndices.push(i); }

      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hi[i] = isFair ? 'found' : 'active';
      lb[i] = isFair ? 'fair' : 'skip';

      steps.push({
        line: 8,
        explanation: `Remove index ${i} (value ${nums[i]}): new even sum=${newEvenSum}, odd sum=${newOddSum}. Fair: ${isFair}. Count=${count}`,
        variables: { index: i, value: nums[i], newEvenSum, newOddSum, isFair, count },
        visualization: makeViz([...nums], hi, lb),
      });

      if (i % 2 === 0) prefEven += nums[i];
      else prefOdd += nums[i];
    }

    const finalHi: Record<number, string> = {};
    const finalLb: Record<number, string> = {};
    for (const idx of fairIndices) { finalHi[idx] = 'found'; finalLb[idx] = 'fair'; }

    steps.push({
      line: 13,
      explanation: `Total fair removal indices = ${count}. Fair at positions: [${fairIndices.join(', ')}]`,
      variables: { answer: count, fairIndices },
      visualization: makeViz([...nums], finalHi, finalLb),
    });

    return steps;
  },
};

export default waysToMakeFairArray;
