import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const radixSortVisualization: AlgorithmDefinition = {
  id: 'radix-sort-visualization',
  title: 'Radix Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Radix sort processes digits from least significant to most significant, using counting sort as a subroutine. Time: O(d*(n+k)) where d=digits, k=base. Non-comparative sort.',
  tags: ['Sorting', 'Radix Sort', 'Counting Sort', 'Non-comparative'],
  code: {
    pseudocode: `function radixSort(arr):
  max = max(arr)
  for exp = 1; max/exp > 0; exp *= 10:
    countSort(arr, exp)

function countSort(arr, exp):
  output = new array[n]
  count = new array[10] filled with 0
  for i in arr: count[(i/exp)%10]++
  for i = 1 to 9: count[i] += count[i-1]
  for i = n-1 down to 0:
    output[count[(arr[i]/exp)%10]-1] = arr[i]
    count[(arr[i]/exp)%10]--
  copy output to arr`,
    python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort(arr, exp)
        exp *= 10
    return arr

def counting_sort(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in arr: count[(i // exp) % 10] += 1
    for i in range(1, 10): count[i] += count[i-1]
    for i in range(n-1, -1, -1):
        idx = (arr[i] // exp) % 10
        output[count[idx]-1] = arr[i]
        count[idx] -= 1
    for i in range(n): arr[i] = output[i]`,
    javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }
  return arr;
}
function countingSort(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (const x of arr) count[Math.floor(x / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i-1];
  for (let i = n-1; i >= 0; i--) {
    const idx = Math.floor(arr[i] / exp) % 10;
    output[--count[idx]] = arr[i];
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
    java: `public void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10)
        countingSort(arr, exp);
}
private void countingSort(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10];
    for (int x : arr) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    for (int i = n-1; i >= 0; i--) {
        int idx = (arr[i] / exp) % 10;
        output[--count[idx]] = arr[i];
    }
    System.arraycopy(output, 0, arr, 0, n);
}`,
  },
  defaultInput: { nums: [170, 45, 75, 90, 802, 24, 2, 66] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [170, 45, 75, 90, 802, 24, 2, 66],
      placeholder: '170,45,75,90,802,24,2,66',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Radix Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin radix sort on [${nums.join(', ')}]. Sort digit by digit from LSD to MSD.`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    const maxVal = Math.max(...nums);
    let exp = 1;
    let pass = 1;

    while (Math.floor(maxVal / exp) > 0) {
      const digitName = exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : `${exp}s`;

      steps.push({
        line: 3,
        explanation: `Pass ${pass}: Sort by the ${digitName} digit (exp=${exp}).`,
        variables: { exp, pass, maxVal },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'active'])),
          Object.fromEntries(nums.map((v, i) => [i, String(Math.floor(v / exp) % 10)])),
          [{ key: 'Pass', value: String(pass) }, { key: 'Digit', value: digitName }],
        ),
      });

      const output = new Array(n);
      const count = new Array(10).fill(0);

      for (const x of nums) count[Math.floor(x / exp) % 10]++;

      steps.push({
        line: 8,
        explanation: `Count occurrences of each digit: [${count.join(', ')}].`,
        variables: { count: [...count], digit: digitName },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'comparing'])),
          Object.fromEntries(nums.map((v, i) => [i, String(Math.floor(v / exp) % 10)])),
          [{ key: 'Count', value: count.join(',') }],
        ),
      });

      for (let i = 1; i < 10; i++) count[i] += count[i - 1];

      for (let i = n - 1; i >= 0; i--) {
        const idx = Math.floor(nums[i] / exp) % 10;
        output[--count[idx]] = nums[i];
      }

      for (let i = 0; i < n; i++) nums[i] = output[i];

      steps.push({
        line: 12,
        explanation: `After sorting by ${digitName} digit: [${nums.join(', ')}].`,
        variables: { arr: [...nums], pass },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'found'])),
          {},
          [{ key: 'After pass', value: nums.join(', ') }],
        ),
      });

      exp *= 10;
      pass++;
    }

    steps.push({
      line: 1,
      explanation: `Radix sort complete! Sorted: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default radixSortVisualization;
