import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfSmallerIi: AlgorithmDefinition = {
  id: 'count-of-smaller-ii',
  title: 'Count of Smaller Numbers After Self II',
  leetcodeNumber: 315,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums, return an array counts where counts[i] is the number of smaller elements to the right of nums[i]. Uses a modified merge sort that tracks indices to count inversions, achieving O(n log n) time complexity.',
  tags: ['Merge Sort', 'Binary Indexed Tree', 'Divide and Conquer'],
  code: {
    pseudocode: `function countSmaller(nums):
  counts = [0] * n
  indices = [0, 1, ..., n-1]
  mergeSort(indices):
    if len <= 1: return
    mid = len // 2
    mergeSort(left)
    mergeSort(right)
    merge with counting:
      for each i in left:
        counts[i] += # elements from right already placed
  return counts`,
    python: `def countSmaller(nums):
    n = len(nums)
    counts = [0] * n
    indices = list(range(n))
    def merge(lo, hi):
        if hi - lo <= 0: return
        mid = (lo + hi) // 2
        merge(lo, mid); merge(mid+1, hi)
        right_count = 0
        i, j = lo, mid+1
        temp = []
        while i <= mid and j <= hi:
            if nums[indices[j]] < nums[indices[i]]:
                right_count += 1; temp.append(indices[j]); j += 1
            else:
                counts[indices[i]] += right_count; temp.append(indices[i]); i += 1
        while i <= mid:
            counts[indices[i]] += right_count; temp.append(indices[i]); i += 1
        while j <= hi:
            temp.append(indices[j]); j += 1
        indices[lo:hi+1] = temp
    merge(0, n-1)
    return counts`,
    javascript: `function countSmaller(nums) {
  const n=nums.length, counts=new Array(n).fill(0);
  const indices=[...Array(n).keys()];
  function merge(lo,hi) {
    if(hi-lo<=0)return;
    const mid=(lo+hi)>>1;
    merge(lo,mid); merge(mid+1,hi);
    let rc=0,i=lo,j=mid+1;const temp=[];
    while(i<=mid&&j<=hi) {
      if(nums[indices[j]]<nums[indices[i]]){rc++;temp.push(indices[j++]);}
      else{counts[indices[i]]+=rc;temp.push(indices[i++]);}
    }
    while(i<=mid){counts[indices[i]]+=rc;temp.push(indices[i++]);}
    while(j<=hi)temp.push(indices[j++]);
    indices.splice(lo,hi-lo+1,...temp);
  }
  merge(0,n-1);
  return counts;
}`,
    java: `public List<Integer> countSmaller(int[] nums) {
    int n=nums.length;
    int[] counts=new int[n], idx=new int[n];
    for(int i=0;i<n;i++) idx[i]=i;
    merge(nums,idx,counts,0,n-1);
    List<Integer> res=new ArrayList<>();
    for(int c:counts) res.add(c);
    return res;
}`,
  },
  defaultInput: { nums: [5, 2, 6, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 2, 6, 1],
      placeholder: '5,2,6,1',
      helperText: 'Input array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const counts: number[] = new Array(n).fill(0);

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Count Smaller After Self',
          entries: [
            { key: 'Counts So Far', value: counts.join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count elements smaller to the right. Array: [${nums.join(', ')}]. Uses merge sort on indices.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    for (let i = n - 1; i >= 0; i--) {
      let cnt = 0;
      for (let j = i + 1; j < n; j++) {
        if (nums[j] < nums[i]) cnt++;
      }
      counts[i] = cnt;
      const h: Record<number, string> = { [i]: 'active' };
      const l: Record<number, string> = { [i]: `<${cnt}` };
      for (let j = i + 1; j < n; j++) {
        h[j] = nums[j] < nums[i] ? 'found' : 'visited';
      }
      steps.push({
        line: 6,
        explanation: `nums[${i}]=${nums[i]}: found ${cnt} smaller elements to the right. counts[${i}] = ${cnt}.`,
        variables: { i, value: nums[i], smallerCount: cnt },
        visualization: makeViz(h, l),
      });
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalH[i] = 'sorted';
      finalL[i] = String(counts[i]);
    }
    steps.push({
      line: 10,
      explanation: `Done. Counts = [${counts.join(', ')}]. Each counts[i] = number of smaller elements to the right of nums[i].`,
      variables: { result: [...counts] },
      visualization: makeViz(finalH, finalL),
    });

    return steps;
  },
};

export default countOfSmallerIi;
