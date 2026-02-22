import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const summaryRanges: AlgorithmDefinition = {
  id: 'summary-ranges',
  title: 'Summary Ranges',
  leetcodeNumber: 228,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a sorted unique integer array, return the smallest sorted list of ranges that cover all the numbers. A range is represented as "a->b" if it spans more than one number, or just "a" if it is a single number. Scan through the array tracking the start of each range.',
  tags: ['array', 'ranges', 'sorted', 'string'],

  code: {
    pseudocode: `function summaryRanges(nums):
  ranges = []
  i = 0
  while i < length(nums):
    start = nums[i]
    while i+1 < length(nums) and nums[i+1] == nums[i]+1:
      i = i + 1
    if nums[i] == start:
      ranges.append(str(start))
    else:
      ranges.append(str(start) + "->" + str(nums[i]))
    i = i + 1
  return ranges`,

    python: `def summaryRanges(nums: list[int]) -> list[str]:
    ranges = []
    i = 0
    while i < len(nums):
        start = nums[i]
        while i + 1 < len(nums) and nums[i + 1] == nums[i] + 1:
            i += 1
        if nums[i] == start:
            ranges.append(str(start))
        else:
            ranges.append(f"{start}->{nums[i]}")
        i += 1
    return ranges`,

    javascript: `function summaryRanges(nums) {
  const ranges = [];
  let i = 0;
  while (i < nums.length) {
    const start = nums[i];
    while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
      i++;
    }
    if (nums[i] === start) {
      ranges.push(String(start));
    } else {
      ranges.push(start + "->" + nums[i]);
    }
    i++;
  }
  return ranges;
}`,

    java: `public List<String> summaryRanges(int[] nums) {
    List<String> ranges = new ArrayList<>();
    int i = 0;
    while (i < nums.length) {
        int start = nums[i];
        while (i + 1 < nums.length && nums[i + 1] == nums[i] + 1) {
            i++;
        }
        if (nums[i] == start) {
            ranges.add(String.valueOf(start));
        } else {
            ranges.add(start + "->" + nums[i]);
        }
        i++;
    }
    return ranges;
}`,
  },

  defaultInput: {
    nums: [0, 1, 2, 4, 5, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Unique Array',
      type: 'array',
      defaultValue: [0, 1, 2, 4, 5, 7],
      placeholder: '0,1,2,4,5,7',
      helperText: 'Comma-separated sorted unique integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const ranges: string[] = [];

    if (nums.length === 0) {
      steps.push({
        line: 1,
        explanation: 'Array is empty, return empty ranges list.',
        variables: { result: [] },
        visualization: { type: 'array', array: [], highlights: {}, labels: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty ranges list and start scanning from index 0.',
      variables: { ranges: '[]', i: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      },
    });

    let i = 0;
    while (i < nums.length) {
      const start = nums[i];
      const startIdx = i;

      steps.push({
        line: 4,
        explanation: `Range begins at index ${i}, value = ${start}.`,
        variables: { i, start, ranges: JSON.stringify(ranges) },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'pointer' },
          labels: { [i]: 'start' },
        },
      });

      while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
        i++;
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${nums[i]} is consecutive. Extend range to index ${i}.`,
          variables: { i, currentRangeEnd: nums[i], start },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [startIdx]: 'pointer', [i]: 'active' },
            labels: { [startIdx]: 'start', [i]: 'end' },
          },
        });
      }

      const rangeStr = nums[i] === start ? String(start) : `${start}->${nums[i]}`;
      ranges.push(rangeStr);

      steps.push({
        line: 9,
        explanation: `Range ends at index ${i}, value = ${nums[i]}. Added range "${rangeStr}".`,
        variables: { i, rangeAdded: rangeStr, ranges: JSON.stringify(ranges) },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [startIdx]: 'found', [i]: 'found' },
          labels: { [startIdx]: 'start', [i]: 'end' },
        },
      });

      i++;
    }

    steps.push({
      line: 11,
      explanation: `All ranges identified: ${JSON.stringify(ranges)}.`,
      variables: { result: JSON.stringify(ranges) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default summaryRanges;
