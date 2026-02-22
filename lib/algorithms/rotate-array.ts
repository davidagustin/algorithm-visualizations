import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateArray: AlgorithmDefinition = {
  id: 'rotate-array',
  title: 'Rotate Array',
  leetcodeNumber: 189,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an integer array, rotate it to the right by k steps in-place with O(1) extra space. Strategy: reverse the entire array, then reverse the first k elements, then reverse the remaining elements.',
  tags: ['two pointers', 'array', 'in-place', 'reverse'],

  code: {
    pseudocode: `function rotate(nums, k):
  n = length(nums)
  k = k mod n
  reverse(nums, 0, n-1)
  reverse(nums, 0, k-1)
  reverse(nums, k, n-1)

function reverse(nums, start, end):
  while start < end:
    swap(nums[start], nums[end])
    start++; end--`,

    python: `def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k %= n
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)`,

    javascript: `function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const reverse = (start, end) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++; end--;
    }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
}`,

    java: `public void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}
private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++; end--;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: '1,2,3,4,5,6,7',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Rotation Steps (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of steps to rotate right',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const kRaw = input.k as number;
    const n = nums.length;
    const k = ((kRaw % n) + n) % n;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Rotate [${nums.join(', ')}] right by k = ${kRaw} steps. Effective k = ${kRaw} mod ${n} = ${k}.`,
      variables: { nums: [...nums], k, n },
      visualization: makeViz(nums, {}, {}),
    });

    // Step 1: Reverse entire array
    steps.push({
      line: 4,
      explanation: `Step 1: Reverse entire array (indices 0 to ${n - 1}).`,
      variables: { phase: 'reverse all', start: 0, end: n - 1 },
      visualization: makeViz(nums, { 0: 'pointer', [n - 1]: 'pointer' }, { 0: 'start', [n - 1]: 'end' }),
    });

    let lo = 0, hi = n - 1;
    while (lo < hi) {
      steps.push({
        line: 9,
        explanation: `Swap nums[${lo}] = ${nums[lo]} with nums[${hi}] = ${nums[hi]}.`,
        variables: { lo, hi },
        visualization: makeViz(nums, { [lo]: 'swapping', [hi]: 'swapping' }, { [lo]: 's', [hi]: 'e' }),
      });
      [nums[lo], nums[hi]] = [nums[hi], nums[lo]];
      lo++; hi--;
    }

    steps.push({
      line: 4,
      explanation: `After reversing all: [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'active'])), {}),
    });

    // Step 2: Reverse first k
    steps.push({
      line: 5,
      explanation: `Step 2: Reverse first k = ${k} elements (indices 0 to ${k - 1}).`,
      variables: { phase: 'reverse first k', start: 0, end: k - 1 },
      visualization: makeViz(nums, { 0: 'pointer', [k - 1]: 'pointer' }, { 0: 'start', [k - 1]: 'end' }),
    });

    lo = 0; hi = k - 1;
    while (lo < hi) {
      steps.push({
        line: 9,
        explanation: `Swap nums[${lo}] = ${nums[lo]} with nums[${hi}] = ${nums[hi]}.`,
        variables: { lo, hi },
        visualization: makeViz(nums, { [lo]: 'swapping', [hi]: 'swapping' }, { [lo]: 's', [hi]: 'e' }),
      });
      [nums[lo], nums[hi]] = [nums[hi], nums[lo]];
      lo++; hi--;
    }

    steps.push({
      line: 5,
      explanation: `After reversing first ${k}: [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz(
        nums,
        { ...Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'found'])) },
        {}
      ),
    });

    // Step 3: Reverse remaining
    steps.push({
      line: 6,
      explanation: `Step 3: Reverse remaining elements (indices ${k} to ${n - 1}).`,
      variables: { phase: 'reverse rest', start: k, end: n - 1 },
      visualization: makeViz(nums, { [k]: 'pointer', [n - 1]: 'pointer' }, { [k]: 'start', [n - 1]: 'end' }),
    });

    lo = k; hi = n - 1;
    while (lo < hi) {
      steps.push({
        line: 9,
        explanation: `Swap nums[${lo}] = ${nums[lo]} with nums[${hi}] = ${nums[hi]}.`,
        variables: { lo, hi },
        visualization: makeViz(nums, { [lo]: 'swapping', [hi]: 'swapping' }, { [lo]: 's', [hi]: 'e' }),
      });
      [nums[lo], nums[hi]] = [nums[hi], nums[lo]];
      lo++; hi--;
    }

    steps.push({
      line: 6,
      explanation: `Done! Rotated array: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default rotateArray;
