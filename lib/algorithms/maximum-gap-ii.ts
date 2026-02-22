import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumGapIi: AlgorithmDefinition = {
  id: 'maximum-gap-ii',
  title: 'Maximum Gap II',
  leetcodeNumber: 164,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an unsorted array, find the maximum difference between successive elements in its sorted form. Must run in O(n) time and space. Uses bucket sort (radix sort variant): create n+1 buckets, place each element in a bucket, then check gaps between consecutive non-empty buckets.',
  tags: ['Sorting', 'Bucket Sort', 'Radix Sort', 'Array'],
  code: {
    pseudocode: `function maximumGap(nums):
  if n < 2: return 0
  minVal, maxVal = min(nums), max(nums)
  bucketSize = max(1, (maxVal-minVal)//(n-1))
  buckets = [(inf, -inf)] * numBuckets
  for num in nums:
    idx = (num - minVal) // bucketSize
    buckets[idx] = (min, max) updated
  maxGap = 0
  prev = minVal
  for (bMin, bMax) in buckets:
    if empty: skip
    maxGap = max(maxGap, bMin - prev)
    prev = bMax
  return maxGap`,
    python: `def maximumGap(nums):
    if len(nums) < 2: return 0
    mn, mx = min(nums), max(nums)
    if mn == mx: return 0
    n = len(nums)
    size = max(1, (mx-mn)//(n-1))
    count = (mx-mn)//size + 1
    buckets = [[float('inf'), float('-inf')] for _ in range(count)]
    for num in nums:
        i = (num-mn)//size
        buckets[i][0] = min(buckets[i][0], num)
        buckets[i][1] = max(buckets[i][1], num)
    prev = mn; maxGap = 0
    for bMin, bMax in buckets:
        if bMin == float('inf'): continue
        maxGap = max(maxGap, bMin-prev)
        prev = bMax
    return maxGap`,
    javascript: `function maximumGap(nums) {
  if (nums.length < 2) return 0;
  const mn=Math.min(...nums), mx=Math.max(...nums);
  if (mn===mx) return 0;
  const n=nums.length, size=Math.max(1,Math.floor((mx-mn)/(n-1)));
  const cnt=Math.floor((mx-mn)/size)+1;
  const bMin=new Array(cnt).fill(Infinity), bMax=new Array(cnt).fill(-Infinity);
  for (const num of nums) {
    const i=Math.floor((num-mn)/size);
    bMin[i]=Math.min(bMin[i],num); bMax[i]=Math.max(bMax[i],num);
  }
  let prev=mn, maxGap=0;
  for (let i=0;i<cnt;i++) {
    if (bMin[i]===Infinity) continue;
    maxGap=Math.max(maxGap,bMin[i]-prev);
    prev=bMax[i];
  }
  return maxGap;
}`,
    java: `public int maximumGap(int[] nums) {
    if (nums.length<2) return 0;
    int mn=nums[0],mx=nums[0];
    for (int n:nums){mn=Math.min(mn,n);mx=Math.max(mx,n);}
    if (mn==mx) return 0;
    int n=nums.length,size=Math.max(1,(mx-mn)/(n-1));
    int cnt=(mx-mn)/size+1;
    int[] bMin=new int[cnt],bMax=new int[cnt];
    Arrays.fill(bMin,Integer.MAX_VALUE); Arrays.fill(bMax,Integer.MIN_VALUE);
    for (int num:nums){int i=(num-mn)/size;bMin[i]=Math.min(bMin[i],num);bMax[i]=Math.max(bMax[i],num);}
    int prev=mn,maxGap=0;
    for (int i=0;i<cnt;i++){if(bMin[i]==Integer.MAX_VALUE)continue;maxGap=Math.max(maxGap,bMin[i]-prev);prev=bMax[i];}
    return maxGap;
}`,
  },
  defaultInput: { nums: [3, 6, 9, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 6, 9, 1],
      placeholder: '3,6,9,1',
      helperText: 'Unsorted array of non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, maxGap: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Maximum Gap (Bucket Sort)',
          entries: [{ key: 'Max Gap', value: String(maxGap) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find maximum gap between successive sorted elements. Array: [${nums.join(', ')}]. Use bucket sort for O(n).`,
      variables: { n },
      visualization: makeViz({}, {}, 0),
    });

    if (n < 2) {
      steps.push({ line: 2, explanation: 'Array has fewer than 2 elements. Max gap = 0.', variables: { result: 0 }, visualization: makeViz({}, {}, 0) });
      return steps;
    }

    const mn = Math.min(...nums);
    const mx = Math.max(...nums);
    const size = Math.max(1, Math.floor((mx - mn) / (n - 1)));
    const cnt = Math.floor((mx - mn) / size) + 1;

    const bMin: number[] = new Array(cnt).fill(Infinity);
    const bMax: number[] = new Array(cnt).fill(-Infinity);

    const h0: Record<number, string> = {};
    for (let i = 0; i < n; i++) h0[i] = 'visited';
    steps.push({
      line: 4,
      explanation: `Range: [${mn}, ${mx}]. Bucket size = ${size}. Number of buckets = ${cnt}.`,
      variables: { mn, mx, bucketSize: size, bucketCount: cnt },
      visualization: makeViz(h0, {}, 0),
    });

    for (let i = 0; i < n; i++) {
      const num = nums[i];
      const idx = Math.floor((num - mn) / size);
      bMin[idx] = Math.min(bMin[idx], num);
      bMax[idx] = Math.max(bMax[idx], num);
      const h: Record<number, string> = { [i]: 'active' };
      steps.push({
        line: 7,
        explanation: `Place nums[${i}]=${num} into bucket ${idx}. Bucket ${idx}: [${bMin[idx]}, ${bMax[idx]}].`,
        variables: { index: i, value: num, bucket: idx },
        visualization: makeViz(h, { [i]: `B${idx}` }, 0),
      });
    }

    let prev = mn;
    let maxGap = 0;
    for (let b = 0; b < cnt; b++) {
      if (bMin[b] === Infinity) continue;
      const gap = bMin[b] - prev;
      if (gap > maxGap) maxGap = gap;
      prev = bMax[b];
    }

    const sorted = [...nums].sort((a, b) => a - b);
    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalH[i] = 'sorted';
      finalL[i] = String(sorted[i]);
    }

    steps.push({
      line: 14,
      explanation: `Bucket scan complete. Sorted order: [${sorted.join(', ')}]. Maximum gap between successive elements = ${maxGap}.`,
      variables: { result: maxGap, sortedArray: sorted },
      visualization: makeViz(finalH, finalL, maxGap),
    });

    return steps;
  },
};

export default maximumGapIi;
