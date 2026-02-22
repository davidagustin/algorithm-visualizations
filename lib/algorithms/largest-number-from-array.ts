import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestNumberFromArray: AlgorithmDefinition = {
  id: 'largest-number-from-array',
  title: 'Largest Number',
  leetcodeNumber: 179,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Arrange non-negative integers to form the largest possible number. Key insight: compare two numbers a and b by checking whether concatenation "ab" > "ba". Sort using this custom comparator, then join the result. Handle the edge case where all numbers are 0.',
  tags: ['sorting', 'greedy', 'custom comparator', 'string', 'number'],

  code: {
    pseudocode: `function largestNumber(nums):
  strs = [str(x) for x in nums]
  sort strs with comparator:
    if a + b > b + a: a comes first
  if strs[0] == "0": return "0"
  return join(strs)`,

    python: `from functools import cmp_to_key

def largestNumber(nums: list[int]) -> str:
    strs = list(map(str, nums))
    def compare(a, b):
        if a + b > b + a: return -1
        elif a + b < b + a: return 1
        return 0
    strs.sort(key=cmp_to_key(compare))
    result = ''.join(strs)
    return '0' if result[0] == '0' else result`,

    javascript: `function largestNumber(nums) {
  const strs = nums.map(String);
  strs.sort((a, b) => (b + a) > (a + b) ? 1 : -1);
  if (strs[0] === '0') return '0';
  return strs.join('');
}`,

    java: `public String largestNumber(int[] nums) {
    String[] strs = new String[nums.length];
    for (int i = 0; i < nums.length; i++) strs[i] = String.valueOf(nums[i]);
    Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));
    if (strs[0].equals("0")) return "0";
    return String.join("", strs);
}`,
  },

  defaultInput: {
    nums: [3, 30, 34, 5, 9],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [3, 30, 34, 5, 9],
      placeholder: '3,30,34,5,9',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Largest number from [${nums.join(', ')}]. Convert to strings, then sort with custom comparator: prefer "ab" > "ba".`,
      variables: { nums: [...nums] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: nums.reduce((l, v, i) => ({ ...l, [i]: `"${v}"` }), {}),
      },
    });

    const strs = nums.map(String);

    steps.push({
      line: 2,
      explanation: `Strings: [${strs.map((s) => `"${s}"`).join(', ')}]. Will sort using: compare(a, b) → put a first if a+b > b+a.`,
      variables: { strings: [...strs] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: nums.reduce((h, _, i) => ({ ...h, [i]: 'active' }), {}),
        labels: strs.reduce((l, s, i) => ({ ...l, [i]: `"${s}"` }), {}),
      },
    });

    // Simulate a bubble-sort with the custom comparator for visibility
    const arr = [...strs];
    const origNums = arr.map(Number);

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const ab = arr[j] + arr[j + 1];
        const ba = arr[j + 1] + arr[j];

        steps.push({
          line: 3,
          explanation: `Compare arr[${j}]="${arr[j]}" and arr[${j + 1}]="${arr[j + 1]}". "${ab}" vs "${ba}": ${ab < ba ? `swap (${ba} is larger prefix)` : `keep order (${ab} is larger or equal)`}.`,
          variables: { a: arr[j], b: arr[j + 1], ab, ba, shouldSwap: ab < ba },
          visualization: {
            type: 'array',
            array: arr.map(Number),
            highlights: { [j]: 'comparing', [j + 1]: 'comparing' },
            labels: { [j]: `"${arr[j]}"`, [j + 1]: `"${arr[j + 1]}"` },
            auxData: {
              label: 'Concatenation Comparison',
              entries: [
                { key: `"${arr[j]}" + "${arr[j + 1]}"`, value: `"${ab}"` },
                { key: `"${arr[j + 1]}" + "${arr[j]}"`, value: `"${ba}"` },
                { key: 'Winner (larger)', value: ab >= ba ? `"${ab}"` : `"${ba}"` },
              ],
            },
          },
        });

        if (ab < ba) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          steps.push({
            line: 3,
            explanation: `Swap: "${arr[j + 1]}" moves before "${arr[j]}". Array now: [${arr.map((s) => `"${s}"`).join(', ')}].`,
            variables: { swapped: true, array: [...arr] },
            visualization: {
              type: 'array',
              array: arr.map(Number),
              highlights: { [j]: 'swapping', [j + 1]: 'swapping' },
              labels: { [j]: `"${arr[j]}"`, [j + 1]: `"${arr[j + 1]}"` },
            },
          });
        }
      }
    }

    const result = arr[0] === '0' ? '0' : arr.join('');

    steps.push({
      line: 5,
      explanation: `Sorted order: [${arr.map((s) => `"${s}"`).join(', ')}]. ${arr[0] === '0' ? 'All zeros — result is "0".' : `Concatenate → "${result}".`}`,
      variables: { sortedStrings: [...arr], result },
      visualization: {
        type: 'array',
        array: arr.map(Number),
        highlights: arr.reduce((h, _, i) => ({ ...h, [i]: 'sorted' }), {}),
        labels: arr.reduce((l, s, i) => ({ ...l, [i]: `"${s}"` }), {}),
        auxData: {
          label: 'Result',
          entries: [{ key: 'Largest Number', value: `"${result}"` }],
        },
      },
    });

    return steps;
  },
};

export default largestNumberFromArray;
