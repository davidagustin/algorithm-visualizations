import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const advantageShuffle: AlgorithmDefinition = {
  id: 'advantage-shuffle',
  title: 'Advantage Shuffle',
  leetcodeNumber: 870,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given arrays nums1 and nums2, rearrange nums1 to maximize the number of positions where nums1[i] > nums2[i]. Greedy: sort nums1; for each nums2 element (largest first), if the largest remaining nums1 element beats it, assign it; otherwise assign the smallest (sacrifice it).',
  tags: ['greedy', 'sorting', 'two pointers', 'array'],

  code: {
    pseudocode: `function advantageCount(nums1, nums2):
  sort nums1
  indices = sort indices of nums2 by value desc
  result = array of size n
  lo = 0, hi = n - 1
  for each idx in indices (largest nums2 first):
    if nums1[hi] > nums2[idx]:
      result[idx] = nums1[hi]; hi--
    else:
      result[idx] = nums1[lo]; lo++
  return result`,

    python: `def advantageCount(nums1: list[int], nums2: list[int]) -> list[int]:
    nums1.sort()
    indices = sorted(range(len(nums2)), key=lambda i: -nums2[i])
    result = [0] * len(nums1)
    lo, hi = 0, len(nums1) - 1
    for idx in indices:
        if nums1[hi] > nums2[idx]:
            result[idx] = nums1[hi]; hi -= 1
        else:
            result[idx] = nums1[lo]; lo += 1
    return result`,

    javascript: `function advantageCount(nums1, nums2) {
  nums1.sort((a, b) => a - b);
  const indices = [...Array(nums2.length).keys()].sort((a, b) => nums2[b] - nums2[a]);
  const result = new Array(nums1.length);
  let lo = 0, hi = nums1.length - 1;
  for (const idx of indices) {
    if (nums1[hi] > nums2[idx]) result[idx] = nums1[hi--];
    else result[idx] = nums1[lo++];
  }
  return result;
}`,

    java: `public int[] advantageCount(int[] nums1, int[] nums2) {
    Arrays.sort(nums1);
    Integer[] indices = new Integer[nums2.length];
    for (int i = 0; i < nums2.length; i++) indices[i] = i;
    Arrays.sort(indices, (a, b) -> nums2[b] - nums2[a]);
    int[] result = new int[nums1.length];
    int lo = 0, hi = nums1.length - 1;
    for (int idx : indices) {
        if (nums1[hi] > nums2[idx]) result[idx] = nums1[hi--];
        else result[idx] = nums1[lo++];
    }
    return result;
}`,
  },

  defaultInput: {
    nums1: [2, 7, 11, 15],
    nums2: [1, 10, 4, 11],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'nums1 (to rearrange)',
      type: 'array',
      defaultValue: [2, 7, 11, 15],
      placeholder: '2,7,11,15',
      helperText: 'Array to rearrange for maximum advantage',
    },
    {
      name: 'nums2',
      label: 'nums2 (target)',
      type: 'array',
      defaultValue: [1, 10, 4, 11],
      placeholder: '1,10,4,11',
      helperText: 'Reference array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1Raw = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums1Raw.length;

    const nums1 = [...nums1Raw].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sort nums1: [${nums1.join(', ')}]. nums2: [${nums2.join(', ')}].`,
      variables: { sortedNums1: nums1.join(','), nums2: nums2.join(',') },
      visualization: {
        type: 'array',
        array: [...nums1],
        highlights: Object.fromEntries(nums1.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    const indices = Array.from({ length: n }, (_, i) => i).sort((a, b) => nums2[b] - nums2[a]);

    steps.push({
      line: 2,
      explanation: `Sort nums2 indices by value descending: [${indices.join(', ')}] => values [${indices.map(i => nums2[i]).join(', ')}]. Process largest nums2 values first.`,
      variables: { sortedIndices: indices.join(','), nums2Values: indices.map(i => nums2[i]).join(',') },
      visualization: {
        type: 'array',
        array: indices.map(i => nums2[i]),
        highlights: { 0: 'active' },
        labels: { 0: 'largest' },
      },
    });

    const result = new Array(n).fill(0);
    let lo = 0;
    let hi = n - 1;

    steps.push({
      line: 3,
      explanation: `Initialize lo=${lo} (smallest nums1), hi=${hi} (largest nums1).`,
      variables: { lo, hi, 'nums1[lo]': nums1[lo], 'nums1[hi]': nums1[hi] },
      visualization: {
        type: 'array',
        array: [...nums1],
        highlights: { [lo]: 'pointer', [hi]: 'active' },
        labels: { [lo]: 'lo', [hi]: 'hi' },
      },
    });

    for (let k = 0; k < indices.length; k++) {
      const idx = indices[k];
      if (nums1[hi] > nums2[idx]) {
        result[idx] = nums1[hi];
        steps.push({
          line: 7,
          explanation: `nums2[${idx}]=${nums2[idx]}: nums1[hi]=${nums1[hi]} beats it. Assign nums1[hi] to result[${idx}]. hi=${hi - 1}.`,
          variables: { idx, 'nums2[idx]': nums2[idx], 'nums1[hi]': nums1[hi], lo, hi },
          visualization: {
            type: 'array',
            array: [...nums1],
            highlights: { [hi]: 'found', [lo]: 'pointer' },
            labels: { [hi]: 'assign', [lo]: 'lo' },
          },
        });
        hi--;
      } else {
        result[idx] = nums1[lo];
        steps.push({
          line: 9,
          explanation: `nums2[${idx}]=${nums2[idx]}: nums1[hi]=${nums1[hi]} cannot beat it. Sacrifice nums1[lo]=${nums1[lo]} at result[${idx}]. lo=${lo + 1}.`,
          variables: { idx, 'nums2[idx]': nums2[idx], 'nums1[lo]': nums1[lo], lo, hi },
          visualization: {
            type: 'array',
            array: [...nums1],
            highlights: { [lo]: 'mismatch', [hi]: 'active' },
            labels: { [lo]: 'sacrifice', [hi]: 'hi' },
          },
        });
        lo++;
      }
    }

    steps.push({
      line: 10,
      explanation: `Result: [${result.join(', ')}]. Beats nums2 at: ${result.map((v, i) => v > nums2[i] ? i : -1).filter(i => i >= 0).length} positions.`,
      variables: { result: result.join(','), advantages: result.filter((v, i) => v > nums2[i]).length },
      visualization: {
        type: 'array',
        array: [...result],
        highlights: Object.fromEntries(result.map((v, i) => [i, v > nums2[i] ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(result.map((v, i) => [i, v > nums2[i] ? 'win' : 'lose'])),
      },
    });

    return steps;
  },
};

export default advantageShuffle;
