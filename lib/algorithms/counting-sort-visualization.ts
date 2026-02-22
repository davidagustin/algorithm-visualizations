import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countingSortVisualization: AlgorithmDefinition = {
  id: 'counting-sort-visualization',
  title: 'Counting Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Sort integers by counting occurrences of each value. Compute a count array, accumulate prefix sums to get positions, then place each element at its correct index. O(n + k) time and space where k is the range of values. Non-comparison based sorting.',
  tags: ['sorting', 'counting', 'non-comparison', 'linear time', 'integer'],

  code: {
    pseudocode: `function countingSort(arr):
  k = max(arr) + 1
  count = array of zeros, size k
  for x in arr: count[x]++
  // Prefix sum
  for i = 1 to k-1:
    count[i] += count[i-1]
  // Place in output
  output = array of zeros, size n
  for i = n-1 down to 0:
    x = arr[i]
    output[count[x] - 1] = x
    count[x]--
  return output`,

    python: `def counting_sort(arr):
    if not arr: return arr
    k = max(arr) + 1
    count = [0] * k
    for x in arr:
        count[x] += 1
    for i in range(1, k):
        count[i] += count[i - 1]
    output = [0] * len(arr)
    for i in range(len(arr) - 1, -1, -1):
        x = arr[i]
        output[count[x] - 1] = x
        count[x] -= 1
    return output`,

    javascript: `function countingSort(arr) {
  const k = Math.max(...arr) + 1;
  const count = new Array(k).fill(0);
  for (const x of arr) count[x]++;
  for (let i = 1; i < k; i++) count[i] += count[i - 1];
  const output = new Array(arr.length).fill(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    const x = arr[i];
    output[count[x] - 1] = x;
    count[x]--;
  }
  return output;
}`,

    java: `public int[] countingSort(int[] arr) {
    int k = Arrays.stream(arr).max().getAsInt() + 1;
    int[] count = new int[k];
    for (int x : arr) count[x]++;
    for (int i = 1; i < k; i++) count[i] += count[i - 1];
    int[] output = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[--count[arr[i]]] = arr[i];
    }
    return output;
}`,
  },

  defaultInput: {
    arr: [4, 2, 2, 8, 3, 3, 1],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [4, 2, 2, 8, 3, 3, 1],
      placeholder: '4,2,2,8,3,3,1',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;

    if (n === 0) return steps;

    const k = Math.max(...arr) + 1;
    const count = new Array(k).fill(0);

    steps.push({
      line: 1,
      explanation: `Counting sort on [${arr.join(', ')}]. Max value = ${k - 1}, so count array has ${k} slots.`,
      variables: { array: [...arr], k },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
        auxData: { label: 'Count Array', entries: Array.from({ length: k }, (_, i) => ({ key: String(i), value: '0' })) },
      },
    });

    // Phase 1: Count occurrences
    for (let idx = 0; idx < n; idx++) {
      const x = arr[idx];
      count[x]++;

      steps.push({
        line: 4,
        explanation: `arr[${idx}] = ${x}: increment count[${x}] to ${count[x]}.`,
        variables: { index: idx, value: x, 'count[x]': count[x] },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [idx]: 'active' },
          labels: { [idx]: `${x}` },
          auxData: {
            label: 'Count Array',
            entries: Array.from({ length: k }, (_, i) => ({ key: String(i), value: String(count[i]) })),
          },
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `Counting complete. Now compute prefix sums to get final positions.`,
      variables: { count: [...count] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
        auxData: {
          label: 'Count Array (raw)',
          entries: Array.from({ length: k }, (_, i) => ({ key: String(i), value: String(count[i]) })),
        },
      },
    });

    // Phase 2: Prefix sums
    for (let i = 1; i < k; i++) {
      count[i] += count[i - 1];
      steps.push({
        line: 6,
        explanation: `Prefix sum: count[${i}] = count[${i - 1}] + count[${i}] = ${count[i]}. Means ${i} should go up to index ${count[i] - 1}.`,
        variables: { i, 'count[i]': count[i] },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: {},
          labels: {},
          auxData: {
            label: 'Count Array (prefix sums)',
            entries: Array.from({ length: k }, (_, j) => ({ key: String(j), value: String(count[j]) })),
          },
        },
      });
    }

    // Phase 3: Place elements
    const output = new Array(n).fill(0);
    const countSnapshot = [...count];

    for (let i = n - 1; i >= 0; i--) {
      const x = arr[i];
      const pos = count[x] - 1;
      output[pos] = x;
      count[x]--;

      steps.push({
        line: 10,
        explanation: `Place arr[${i}]=${x} at output[${pos}]. count[${x}] now ${count[x]}.`,
        variables: { i, value: x, outputIndex: pos },
        visualization: {
          type: 'array',
          array: [...output],
          highlights: { [pos]: 'swapping' },
          labels: { [pos]: `${x}` },
          auxData: {
            label: 'Output Array (building)',
            entries: output.map((v, j) => ({ key: String(j), value: v === 0 && !output.slice(0, j + 1).some((_, p) => p === j && output[p] !== 0) ? '-' : String(v) })),
          },
        },
      });
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 12,
      explanation: `Counting sort complete! Sorted array: [${output.join(', ')}].`,
      variables: { result: output },
      visualization: { type: 'array', array: output, highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default countingSortVisualization;
