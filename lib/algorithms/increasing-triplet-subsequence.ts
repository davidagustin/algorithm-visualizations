import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const increasingTripletSubsequence: AlgorithmDefinition = {
  id: 'increasing-triplet-subsequence',
  title: 'Increasing Triplet Subsequence',
  leetcodeNumber: 334,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Determine if there exist indices i < j < k such that nums[i] < nums[j] < nums[k]. Greedy: maintain the smallest first element (first) and smallest second element (second). If any number exceeds second, a triplet exists.',
  tags: ['greedy', 'array'],

  code: {
    pseudocode: `function increasingTriplet(nums):
  first = infinity, second = infinity
  for each num in nums:
    if num <= first:
      first = num
    elif num <= second:
      second = num
    else:
      return true  // triplet found
  return false`,

    python: `def increasingTriplet(nums: list[int]) -> bool:
    first = second = float('inf')
    for num in nums:
        if num <= first:
            first = num
        elif num <= second:
            second = num
        else:
            return True
    return False`,

    javascript: `function increasingTriplet(nums) {
  let first = Infinity, second = Infinity;
  for (const num of nums) {
    if (num <= first) first = num;
    else if (num <= second) second = num;
    else return true;
  }
  return false;
}`,

    java: `public boolean increasingTriplet(int[] nums) {
    int first = Integer.MAX_VALUE, second = Integer.MAX_VALUE;
    for (int num : nums) {
        if (num <= first) first = num;
        else if (num <= second) second = num;
        else return true;
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [2, 1, 5, 0, 4, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 5, 0, 4, 6],
      placeholder: '2,1,5,0,4,6',
      helperText: 'Array of integers to search for an increasing triplet',
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

    let first = Infinity;
    let second = Infinity;

    steps.push({
      line: 1,
      explanation: 'Initialize first=infinity, second=infinity. We greedily track the smallest possible first and second elements of a triplet.',
      variables: { first: 'inf', second: 'inf' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];

      if (num <= first) {
        const prev = first === Infinity ? 'inf' : first;
        first = num;
        steps.push({
          line: 3,
          explanation: `nums[${i}]=${num} <= first=${prev}. Update first=${num}. This is the new smallest candidate for position 1 of the triplet.`,
          variables: { i, num, first, second: second === Infinity ? 'inf' : second },
          visualization: makeViz(
            { [i]: 'active' },
            { [i]: 'first=' + num }
          ),
        });
      } else if (num <= second) {
        const prev = second === Infinity ? 'inf' : second;
        second = num;
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${num} > first=${first} but <= second=${prev}. Update second=${num}. We now have two increasing values.`,
          variables: { i, num, first, second },
          visualization: makeViz(
            { [i]: 'comparing' },
            { [i]: 'second=' + num }
          ),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `nums[${i}]=${num} > first=${first} and > second=${second}. Triplet found! (values: ${first}, ${second}, ${num}). Return true.`,
          variables: { i, num, first, second, result: true },
          visualization: makeViz(
            { [i]: 'found' },
            { [i]: 'TRIPLET!' }
          ),
        });
        return steps;
      }
    }

    steps.push({
      line: 8,
      explanation: `Scanned entire array. No increasing triplet found. Return false.`,
      variables: { result: false, first: first === Infinity ? 'inf' : first, second: second === Infinity ? 'inf' : second },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])),
        {}
      ),
    });

    return steps;
  },
};

export default increasingTripletSubsequence;
