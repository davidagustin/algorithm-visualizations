import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countingSortVisualization: AlgorithmDefinition = {
  id: 'counting-sort-visualization',
  title: 'Counting Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Counting sort counts occurrences of each element and uses prefix sums to place elements in sorted order. Time: O(n+k), Space: O(k) where k is the range of values.',
  tags: ['Sorting', 'Counting Sort', 'Non-comparative', 'Linear Time'],
  code: {
    pseudocode: `function countingSort(arr, maxVal):
  count = new array[maxVal+1] filled with 0
  for x in arr: count[x]++
  for i = 1 to maxVal: count[i] += count[i-1]
  output = new array[n]
  for i = n-1 down to 0:
    output[count[arr[i]]-1] = arr[i]
    count[arr[i]]--
  return output`,
    python: `def counting_sort(arr):
    if not arr: return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for x in arr: count[x] += 1
    for i in range(1, max_val + 1):
        count[i] += count[i-1]
    output = [0] * len(arr)
    for i in range(len(arr)-1, -1, -1):
        output[count[arr[i]]-1] = arr[i]
        count[arr[i]] -= 1
    return output`,
    javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (const x of arr) count[x]++;
  for (let i = 1; i <= max; i++) count[i] += count[i-1];
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[--count[arr[i]]] = arr[i];
  }
  return output;
}`,
    java: `public int[] countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    for (int x : arr) count[x]++;
    for (int i = 1; i <= max; i++) count[i] += count[i-1];
    int[] output = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[--count[arr[i]]] = arr[i];
    }
    return output;
}`,
  },
  defaultInput: { nums: [4, 2, 2, 8, 3, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 2, 8, 3, 3, 1],
      placeholder: '4,2,2,8,3,3,1',
      helperText: 'Comma-separated non-negative integers (small range)',
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
      ...(auxEntries ? { auxData: { label: 'Counting Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin counting sort on [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    const maxVal = Math.max(...nums);
    const count = new Array(maxVal + 1).fill(0);

    // Count occurrences
    for (let i = 0; i < n; i++) {
      count[nums[i]]++;
      steps.push({
        line: 3,
        explanation: `Count arr[${i}]=${nums[i]}. count[${nums[i]}]=${count[nums[i]]}.`,
        variables: { index: i, value: nums[i], count: [...count] },
        visualization: makeViz(nums, { [i]: 'active' }, { [i]: String(nums[i]) },
          [{ key: 'Counting', value: `arr[${i}]=${nums[i]}` }, { key: 'count[]', value: count.slice(0, maxVal + 1).join(',') }]),
      });
    }

    // Prefix sums
    for (let i = 1; i <= maxVal; i++) {
      count[i] += count[i - 1];
    }

    steps.push({
      line: 4,
      explanation: `Prefix sum count array: [${count.join(', ')}]. count[i] = number of elements <= i.`,
      variables: { count: [...count] },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'comparing'])),
        {},
        [{ key: 'Prefix count', value: count.join(',') }],
      ),
    });

    // Build output
    const output = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      output[--count[nums[i]]] = nums[i];
    }

    steps.push({
      line: 6,
      explanation: `Place elements using count array. Output: [${output.join(', ')}].`,
      variables: { output: [...output] },
      visualization: makeViz(output,
        Object.fromEntries(output.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Output', value: output.join(', ') }],
      ),
    });

    steps.push({
      line: 1,
      explanation: `Counting sort complete! Sorted: [${output.join(', ')}].`,
      variables: { result: [...output] },
      visualization: makeViz(output,
        Object.fromEntries(output.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: output.join(', ') }],
      ),
    });

    return steps;
  },
};

export default countingSortVisualization;
