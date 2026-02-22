import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findNumbersWithEvenNumberOfDigits: AlgorithmDefinition = {
  id: 'find-numbers-with-even-number-of-digits',
  title: 'Find Numbers with Even Number of Digits',
  leetcodeNumber: 1295,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an array of integers, return how many of them have an even number of digits. Convert each number to a string to check its length, or use math to count digits. Numbers with 10-99, 1000-9999, 100000-999999 etc. have an even number of digits.',
  tags: ['array', 'math', 'digit counting'],

  code: {
    pseudocode: `function findNumbers(nums):
  count = 0
  for x in nums:
    digits = len(str(x))
    if digits % 2 == 0:
      count++
  return count`,
    python: `def findNumbers(nums):
    return sum(1 for x in nums if len(str(x)) % 2 == 0)`,
    javascript: `function findNumbers(nums) {
  return nums.filter(x => String(x).length % 2 === 0).length;
}`,
    java: `public int findNumbers(int[] nums) {
    int count = 0;
    for (int x : nums)
        if (String.valueOf(x).length() % 2 == 0) count++;
    return count;
}`,
  },

  defaultInput: {
    nums: [12, 345, 2, 6, 7896],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [12, 345, 2, 6, 7896],
      placeholder: '12,345,2,6,7896',
      helperText: 'Comma-separated positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count numbers with an even number of digits in [${nums.join(', ')}].`,
      variables: { array: nums.join(', '), count: 0 },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    for (let i = 0; i < nums.length; i++) {
      const digits = String(nums[i]).length;
      const isEven = digits % 2 === 0;
      if (isEven) count++;
      steps.push({
        line: 4,
        explanation: `nums[${i}] = ${nums[i]}. Digits = ${digits}. ${isEven ? `Even! count=${count}` : `Odd digits, skip.`}`,
        variables: { index: i, value: nums[i], digitCount: digits, isEven, count },
        visualization: makeViz(
          { [i]: isEven ? 'found' : 'comparing' },
          { [i]: `${digits}d` }
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `Numbers with even digit count: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, String(v).length % 2 === 0 ? 'found' : 'sorted'])),
        Object.fromEntries(nums.map((v, i) => [i, `${String(v).length}d`]))
      ),
    });

    return steps;
  },
};

export default findNumbersWithEvenNumberOfDigits;
