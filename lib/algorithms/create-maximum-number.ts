import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const createMaximumNumber: AlgorithmDefinition = {
  id: 'create-maximum-number',
  title: 'Create Maximum Number',
  leetcodeNumber: 321,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given two integer arrays nums1 and nums2 of lengths m and n, create the maximum number of length k by picking digits from both arrays while maintaining relative order. For each split i+j=k, use monotonic stack to find best i-digit subsequence from each array, then merge the two.',
  tags: ['Stack', 'Monotonic Stack', 'Greedy', 'Hard'],
  code: {
    pseudocode: `function maxNumber(nums1, nums2, k):
  result = []
  for i from max(0, k-n) to min(k, m):
    j = k - i
    sub1 = maxSubsequence(nums1, i)  // best i digits from nums1
    sub2 = maxSubsequence(nums2, j)  // best j digits from nums2
    merged = merge(sub1, sub2)
    result = max(result, merged)
  return result

function maxSubsequence(nums, k):
  drop = len(nums) - k
  stack = []
  for n in nums:
    while stack and drop > 0 and stack.top < n:
      stack.pop(); drop--
    stack.push(n)
  return stack[:k]`,
    python: `def maxNumber(nums1, nums2, k):
    def pick(nums, k):
        drop = len(nums) - k
        stack = []
        for n in nums:
            while stack and drop > 0 and stack[-1] < n:
                stack.pop(); drop -= 1
            stack.append(n)
        return stack[:k]
    def merge(a, b):
        result = []
        while a or b:
            if a >= b:
                result.append(a.pop(0))
            else:
                result.append(b.pop(0))
        return result
    best = []
    for i in range(max(0, k-len(nums2)), min(k, len(nums1))+1):
        cand = merge(pick(nums1, i), pick(nums2, k-i))
        if cand > best: best = cand
    return best`,
    javascript: `function maxNumber(nums1, nums2, k) {
  const pick = (nums, k) => {
    let drop = nums.length - k;
    const stack = [];
    for (const n of nums) {
      while (stack.length && drop > 0 && stack[stack.length-1] < n) {
        stack.pop(); drop--;
      }
      stack.push(n);
    }
    return stack.slice(0, k);
  };
  const merge = (a, b) => {
    const result = [];
    let i = 0, j = 0;
    while (i < a.length || j < b.length) {
      if (a.slice(i) >= b.slice(j)) result.push(a[i++]);
      else result.push(b[j++]);
    }
    return result;
  };
  let best = [];
  for (let i = Math.max(0, k-nums2.length); i <= Math.min(k, nums1.length); i++) {
    const cand = merge(pick(nums1, i), pick(nums2, k-i));
    if (cand.join('') > best.join('')) best = cand;
  }
  return best;
}`,
    java: `public int[] maxNumber(int[] nums1, int[] nums2, int k) {
    int[] best = new int[k];
    for (int i = Math.max(0, k-nums2.length); i <= Math.min(k, nums1.length); i++) {
        int[] cand = merge(pick(nums1, i), pick(nums2, k-i));
        if (compare(cand, 0, best, 0) > 0) best = cand;
    }
    return best;
}`,
  },
  defaultInput: { nums1: [3, 4, 6, 5], nums2: [9, 1, 2, 5, 8, 3], k: 5 },
  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [3, 4, 6, 5],
      placeholder: 'e.g. 3,4,6,5',
      helperText: 'First array of digits',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [9, 1, 2, 5, 8, 3],
      placeholder: 'e.g. 9,1,2,5,8,3',
      helperText: 'Second array of digits',
    },
    {
      name: 'k',
      label: 'Length k',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Length of result number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = (input.nums1 as number[]).slice();
    const nums2 = (input.nums2 as number[]).slice();
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const pick = (nums: number[], count: number): number[] => {
      let drop = nums.length - count;
      const st: number[] = [];
      for (const n of nums) {
        while (st.length > 0 && drop > 0 && st[st.length - 1] < n) {
          st.pop();
          drop--;
        }
        st.push(n);
      }
      return st.slice(0, count);
    };

    const merge = (a: number[], b: number[]): number[] => {
      const result: number[] = [];
      let i = 0, j = 0;
      while (i < a.length || j < b.length) {
        const aStr = a.slice(i).join('');
        const bStr = b.slice(j).join('');
        if (aStr >= bStr) result.push(a[i++]);
        else result.push(b[j++]);
      }
      return result;
    };

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: nums1.concat(nums2).map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums1=[${nums1.join(',')}], nums2=[${nums2.join(',')}], k=${k}. Try all splits i+j=k.`,
      variables: { k, m: nums1.length, n: nums2.length },
      visualization: makeViz(-1, 'idle'),
    });

    let best: number[] = [];
    const iMin = Math.max(0, k - nums2.length);
    const iMax = Math.min(k, nums1.length);

    for (let i = iMin; i <= iMax; i++) {
      const j = k - i;
      const sub1 = pick(nums1, i);
      const sub2 = pick(nums2, j);

      stack.length = 0;
      stack.push(`split ${i}+${j}`);
      stack.push(`sub1=[${sub1.join(',')}]`);
      stack.push(`sub2=[${sub2.join(',')}]`);

      steps.push({
        line: 3,
        explanation: `Split i=${i}, j=${j}. Best ${i} from nums1: [${sub1.join(',')}]. Best ${j} from nums2: [${sub2.join(',')}].`,
        variables: { i, j, sub1: [...sub1], sub2: [...sub2] },
        visualization: makeViz(i, 'push'),
      });

      const merged = merge(sub1, sub2);
      const isBetter = merged.join('') > best.join('');
      if (isBetter) best = merged;

      stack.push(`merged=[${merged.join(',')}]`);

      steps.push({
        line: 5,
        explanation: `Merged: [${merged.join(',')}]. ${isBetter ? 'New best!' : 'Not better than current best.'}`,
        variables: { merged: [...merged], best: [...best] },
        visualization: makeViz(i, isBetter ? 'match' : 'idle'),
      });
    }

    steps.push({
      line: 7,
      explanation: `Done. Maximum number of length ${k}: [${best.join(', ')}].`,
      variables: { result: [...best] },
      visualization: makeViz(nums1.length - 1, 'match'),
    });

    return steps;
  },
};

export default createMaximumNumber;
