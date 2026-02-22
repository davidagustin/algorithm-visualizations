import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wiggleSortII: AlgorithmDefinition = {
  id: 'wiggle-sort-ii',
  title: 'Wiggle Sort II',
  leetcodeNumber: 324,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 324: Reorder array so nums[0] < nums[1] > nums[2] < nums[3]... Sort the array, then interleave: smaller half fills even indices, larger half fills odd indices.',
  tags: ['Sorting', 'Array', 'Wiggle', 'Interleave'],
  code: {
    pseudocode: `function wiggleSort(nums):
  sorted = sort(nums)
  n = nums.length
  mid = (n-1) / 2
  for i = 0 to n-1:
    if i % 2 == 0:
      nums[i] = sorted[mid--]
    else:
      nums[i] = sorted[n-1-(i-1)/2]`,
    python: `def wiggleSort(nums):
    sorted_nums = sorted(nums)
    n = len(nums)
    mid = (n - 1) // 2
    right = n - 1
    for i in range(n):
        if i % 2 == 0:
            nums[i] = sorted_nums[mid]
            mid -= 1
        else:
            nums[i] = sorted_nums[right]
            right -= 1`,
    javascript: `function wiggleSort(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  let mid = Math.floor((n - 1) / 2);
  let right = n - 1;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) nums[i] = sorted[mid--];
    else nums[i] = sorted[right--];
  }
}`,
    java: `public void wiggleSort(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int n = nums.length;
    int mid = (n - 1) / 2, right = n - 1;
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) nums[i] = sorted[mid--];
        else nums[i] = sorted[right--];
    }
}`,
  },
  defaultInput: { nums: [1, 5, 1, 1, 6, 4] },
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
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Wiggle Sort II', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Wiggle sort [${nums.join(', ')}]. Goal: nums[0] < nums[1] > nums[2] < nums[3]...`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    const sorted = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 2,
      explanation: `Sort array: [${sorted.join(', ')}]. Split into smaller half [0..mid] and larger half [mid+1..n-1].`,
      variables: { sorted: [...sorted] },
      visualization: makeViz(sorted,
        Object.fromEntries(sorted.map((_, i) => [i, i < Math.floor((n - 1) / 2) + 1 ? 'pointer' : 'comparing'])),
        {},
        [{ key: 'Sorted', value: sorted.join(',') }],
      ),
    });

    let mid = Math.floor((n - 1) / 2);
    let right = n - 1;
    const result = new Array(n);

    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) {
        result[i] = sorted[mid];
        steps.push({
          line: 6,
          explanation: `Even index ${i}: place smaller element sorted[${mid}]=${sorted[mid]}.`,
          variables: { i, value: sorted[mid], mid },
          visualization: makeViz(result.map(v => v ?? 0),
            { [i]: 'pointer' },
            { [i]: String(sorted[mid]) },
            [{ key: 'Even idx', value: `${i}←${sorted[mid]}` }]),
        });
        mid--;
      } else {
        result[i] = sorted[right];
        steps.push({
          line: 8,
          explanation: `Odd index ${i}: place larger element sorted[${right}]=${sorted[right]}.`,
          variables: { i, value: sorted[right], right },
          visualization: makeViz(result.map(v => v ?? 0),
            { [i]: 'active' },
            { [i]: String(sorted[right]) },
            [{ key: 'Odd idx', value: `${i}←${sorted[right]}` }]),
        });
        right--;
      }
    }

    for (let i = 0; i < n; i++) nums[i] = result[i];

    steps.push({
      line: 1,
      explanation: `Wiggle sort complete! [${nums.join(', ')}]. Verify: each even<odd>even.`,
      variables: { result: [...nums] },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? 'pointer' : 'active'])),
        Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? '<' : '>'])),
        [{ key: 'Wiggle', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default wiggleSortII;
