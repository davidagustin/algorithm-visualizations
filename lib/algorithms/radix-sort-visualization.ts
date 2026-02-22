import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const radixSortVisualization: AlgorithmDefinition = {
  id: 'radix-sort-visualization',
  title: 'Radix Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Non-comparison integer sort. Process digits from least significant to most significant (LSD). For each digit position, use counting sort as a stable subroutine to group elements by that digit. O(d*(n+k)) time where d is digits, k=10. Handles integers without comparisons.',
  tags: ['sorting', 'radix', 'non-comparison', 'LSD', 'digit', 'counting sort'],

  code: {
    pseudocode: `function radixSort(arr):
  max = max(arr)
  exp = 1  // 1, 10, 100, ...
  while max // exp > 0:
    countingSortByDigit(arr, exp)
    exp *= 10

function countingSortByDigit(arr, exp):
  n = len(arr)
  output = [0] * n
  count = [0] * 10
  for x in arr:
    digit = (x // exp) % 10
    count[digit]++
  for i = 1 to 9: count[i] += count[i-1]
  for i = n-1 down to 0:
    digit = (arr[i] // exp) % 10
    output[count[digit] - 1] = arr[i]
    count[digit]--
  arr[:] = output`,

    python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for x in arr:
        count[(x // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1
    arr[:] = output`,

    javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}
function countingSortByDigit(arr, exp) {
  const n = arr.length, output = new Array(n).fill(0), count = new Array(10).fill(0);
  for (const x of arr) count[Math.floor(x / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(arr[i] / exp) % 10;
    output[count[d] - 1] = arr[i];
    count[d]--;
  }
  arr.splice(0, n, ...output);
}`,

    java: `public void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);
}
private void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n], count = new int[10];
    for (int x : arr) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    System.arraycopy(output, 0, arr, 0, n);
}`,
  },

  defaultInput: {
    arr: [170, 45, 75, 90, 802, 24, 2, 66],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [170, 45, 75, 90, 802, 24, 2, 66],
      placeholder: '170,45,75,90,802,24,2,66',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;

    const maxVal = Math.max(...arr);
    const numDigits = maxVal === 0 ? 1 : Math.floor(Math.log10(maxVal)) + 1;

    const makeViz = (
      current: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      digitPos: string
    ): ArrayVisualization => ({
      type: 'array',
      array: current,
      highlights,
      labels,
      auxData: {
        label: `Sorting by ${digitPos} digit`,
        entries: current.map((v, i) => ({
          key: `arr[${i}]`,
          value: String(v),
        })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Radix sort on [${arr.join(', ')}]. Max = ${maxVal}, so ${numDigits} digit pass(es) needed (LSD to MSD).`,
      variables: { array: [...arr], maxVal, numDigits },
      visualization: makeViz(arr, {}, {}, 'units'),
    });

    const digitNames = ['units (1s)', 'tens (10s)', 'hundreds (100s)', 'thousands (1000s)'];

    let exp = 1;
    let passNum = 0;

    while (Math.floor(maxVal / exp) > 0) {
      passNum++;
      const digitName = digitNames[passNum - 1] || `10^${passNum - 1}`;

      // Show digits for this position
      const digits = arr.map((x) => Math.floor(x / exp) % 10);

      steps.push({
        line: 3,
        explanation: `Pass ${passNum}: Sort by ${digitName}. Extract digit = (value / ${exp}) % 10 for each element.`,
        variables: { pass: passNum, exp, digitName },
        visualization: makeViz(
          [...arr],
          arr.reduce((h, _, i) => ({ ...h, [i]: 'active' }), {}),
          digits.reduce((l, d, i) => ({ ...l, [i]: `d=${d}` }), {}),
          digitName
        ),
      });

      // Count
      const count = new Array(10).fill(0);
      for (const x of arr) count[Math.floor(x / exp) % 10]++;

      steps.push({
        line: 10,
        explanation: `Count occurrences of each digit (0-9): [${count.join(', ')}].`,
        variables: { count: [...count] },
        visualization: makeViz(
          [...arr],
          {},
          {},
          digitName
        ),
      });

      // Prefix sum
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];

      steps.push({
        line: 11,
        explanation: `Prefix sums: [${count.join(', ')}]. These give output positions for each digit.`,
        variables: { prefixCount: [...count] },
        visualization: makeViz([...arr], {}, {}, digitName),
      });

      // Place in output
      const output = new Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        const d = Math.floor(arr[i] / exp) % 10;
        const pos = count[d] - 1;
        output[pos] = arr[i];
        count[d]--;
      }

      arr.splice(0, n, ...output);

      steps.push({
        line: 15,
        explanation: `After sorting by ${digitName}: [${arr.join(', ')}]. Elements are stably sorted by this digit position.`,
        variables: { afterPass: [...arr], pass: passNum },
        visualization: makeViz(
          [...arr],
          arr.reduce((h, _, i) => ({ ...h, [i]: 'sorted' }), {}),
          {},
          digitName
        ),
      });

      exp *= 10;
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 5,
      explanation: `Radix sort complete after ${passNum} pass(es)! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default radixSortVisualization;
