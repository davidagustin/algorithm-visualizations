import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wiggleSortII: AlgorithmDefinition = {
  id: 'wiggle-sort-ii',
  title: 'Wiggle Sort II',
  leetcodeNumber: 324,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Reorder array so that nums[0] < nums[1] > nums[2] < nums[3]... Sort the array, then interleave: place the larger half at odd positions (descending) and the smaller half at even positions (descending). This ensures strict inequalities even with duplicates.',
  tags: ['sorting', 'wiggle', 'interleave', 'array', 'median'],

  code: {
    pseudocode: `function wiggleSort(nums):
  sorted = sort(nums)
  n = len(nums)
  mid = (n - 1) / 2
  // Place smaller half at even indices (0,2,4,...) in reverse
  // Place larger half at odd indices (1,3,5,...) in reverse
  j = mid
  for i = 0, 2, 4, ...:
    nums[i] = sorted[j--]
  j = n - 1
  for i = 1, 3, 5, ...:
    nums[i] = sorted[j--]`,

    python: `def wiggleSort(nums: list[int]) -> None:
    sorted_nums = sorted(nums)
    n = len(nums)
    mid = (n - 1) // 2
    # Fill even indices from smaller half (reversed)
    nums[::2] = sorted_nums[:mid+1][::-1]
    # Fill odd indices from larger half (reversed)
    nums[1::2] = sorted_nums[mid+1:][::-1]`,

    javascript: `function wiggleSort(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const mid = Math.floor((n - 1) / 2);
  let j = mid;
  for (let i = 0; i < n; i += 2) nums[i] = sorted[j--];
  j = n - 1;
  for (let i = 1; i < n; i += 2) nums[i] = sorted[j--];
}`,

    java: `public void wiggleSort(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int n = nums.length, mid = (n - 1) / 2;
    int j = mid;
    for (int i = 0; i < n; i += 2) nums[i] = sorted[j--];
    j = n - 1;
    for (int i = 1; i < n; i += 2) nums[i] = sorted[j--];
}`,
  },

  defaultInput: {
    nums: [1, 5, 1, 1, 6, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 5, 1, 1, 6, 4],
      placeholder: '1,5,1,1,6,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const nums = [...initial];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Wiggle sort II on [${nums.join(', ')}]. Goal: nums[0] < nums[1] > nums[2] < nums[3]...`,
      variables: { array: [...nums] },
      visualization: { type: 'array', array: [...nums], highlights: {}, labels: {} },
    });

    // Step 1: Sort
    const sorted = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 2,
      explanation: `Sort the array: [${sorted.join(', ')}]. We'll interleave smaller and larger halves.`,
      variables: { sorted: [...sorted] },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: sorted.reduce((h, _, i) => ({ ...h, [i]: 'sorted' }), {}),
        labels: {},
      },
    });

    const mid = Math.floor((n - 1) / 2);

    steps.push({
      line: 3,
      explanation: `mid = ${mid}. Smaller half (descending): [${sorted.slice(0, mid + 1).join(', ')}]. Larger half (descending): [${sorted.slice(mid + 1).join(', ')}].`,
      variables: { mid, smallerHalf: sorted.slice(0, mid + 1), largerHalf: sorted.slice(mid + 1) },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: {
          ...sorted.slice(0, mid + 1).reduce((h, _, i) => ({ ...h, [i]: 'active' }), {}),
          ...sorted.slice(mid + 1).reduce((h, _, i) => ({ ...h, [mid + 1 + i]: 'comparing' }), {}),
        },
        labels: { [0]: 'smaller half', [mid + 1]: 'larger half' },
      },
    });

    const result = new Array(n).fill(0);

    // Fill even indices with smaller half in reverse
    let j = mid;
    for (let i = 0; i < n; i += 2) {
      result[i] = sorted[j];

      steps.push({
        line: 7,
        explanation: `Even index ${i}: place sorted[${j}]=${sorted[j]} (smaller half, reversed). This is a "valley" position.`,
        variables: { i, j, value: sorted[j] },
        visualization: {
          type: 'array',
          array: [...result],
          highlights: { [i]: 'active', [j]: 'pointer' },
          labels: { [i]: `nums[${i}]`, [j]: `sorted[${j}]` },
        },
      });

      j--;
    }

    // Fill odd indices with larger half in reverse
    j = n - 1;
    for (let i = 1; i < n; i += 2) {
      result[i] = sorted[j];

      steps.push({
        line: 9,
        explanation: `Odd index ${i}: place sorted[${j}]=${sorted[j]} (larger half, reversed). This is a "peak" position.`,
        variables: { i, j, value: sorted[j] },
        visualization: {
          type: 'array',
          array: [...result],
          highlights: { [i]: 'comparing', [j]: 'pointer' },
          labels: { [i]: `nums[${i}]`, [j]: `sorted[${j}]` },
        },
      });

      j--;
    }

    // Verify wiggle property
    const wiggleHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) wiggleHL[i] = 'active'; // valleys
      else wiggleHL[i] = 'found';               // peaks
    }

    const wiggleLabels: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      wiggleLabels[i] = i % 2 === 0 ? 'valley' : 'peak';
    }

    steps.push({
      line: 10,
      explanation: `Wiggle sort complete! [${result.join(', ')}]. Valleys (even, blue) < Peaks (odd, green). Pattern: ${result.map((v, i) => i % 2 === 0 ? 'v' : 'p').join(',')}.`,
      variables: { result: [...result] },
      visualization: { type: 'array', array: result, highlights: wiggleHL, labels: wiggleLabels },
    });

    return steps;
  },
};

export default wiggleSortII;
