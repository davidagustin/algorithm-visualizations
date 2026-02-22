import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxConsecutiveOnes: AlgorithmDefinition = {
  id: 'max-consecutive-ones',
  title: 'Max Consecutive Ones',
  leetcodeNumber: 485,
  difficulty: 'Easy',
  category: 'Sliding Window',
  description:
    'Given a binary array nums, return the maximum number of consecutive 1s in the array. Scan through the array tracking the current run of consecutive ones. Reset the counter when a 0 is encountered and update the global maximum after each element.',
  tags: ['array', 'sliding window', 'greedy'],

  code: {
    pseudocode: `function findMaxConsecutiveOnes(nums):
  maxCount = 0
  currentCount = 0
  for each num in nums:
    if num == 1:
      currentCount += 1
      maxCount = max(maxCount, currentCount)
    else:
      currentCount = 0
  return maxCount`,

    python: `def findMaxConsecutiveOnes(nums: list[int]) -> int:
    maxCount = 0
    currentCount = 0
    for num in nums:
        if num == 1:
            currentCount += 1
            maxCount = max(maxCount, currentCount)
        else:
            currentCount = 0
    return maxCount`,

    javascript: `function findMaxConsecutiveOnes(nums) {
  let maxCount = 0;
  let currentCount = 0;
  for (const num of nums) {
    if (num === 1) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0;
    }
  }
  return maxCount;
}`,

    java: `public int findMaxConsecutiveOnes(int[] nums) {
    int maxCount = 0, currentCount = 0;
    for (int num : nums) {
        if (num == 1) {
            currentCount++;
            maxCount = Math.max(maxCount, currentCount);
        } else {
            currentCount = 0;
        }
    }
    return maxCount;
}`,
  },

  defaultInput: {
    nums: [1, 1, 0, 1, 1, 1, 0, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 1, 0, 1, 1, 1, 0, 1],
      placeholder: '1,1,0,1,1,1',
      helperText: 'Array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let maxCount = 0;
    let currentCount = 0;

    steps.push({
      line: 1,
      explanation: `Start scanning binary array of length ${nums.length}. Track consecutive ones.`,
      variables: { maxCount: 0, currentCount: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];

      if (num === 1) {
        currentCount++;
        const prevMax = maxCount;
        maxCount = Math.max(maxCount, currentCount);

        steps.push({
          line: 5,
          explanation: `Index ${i}: value is 1. Increment currentCount to ${currentCount}. maxCount=${maxCount}.`,
          variables: { index: i, value: num, currentCount, maxCount },
          visualization: makeViz(
            { [i]: maxCount > prevMax ? 'found' : 'active' },
            { [i]: String(currentCount) }
          ),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Index ${i}: value is 0. Reset currentCount to 0. maxCount stays at ${maxCount}.`,
          variables: { index: i, value: num, currentCount: 0, maxCount },
          visualization: makeViz(
            { [i]: 'mismatch' },
            { [i]: '0' }
          ),
        });
        currentCount = 0;
      }
    }

    steps.push({
      line: 9,
      explanation: `Scan complete. Maximum consecutive ones = ${maxCount}.`,
      variables: { maxCount },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxConsecutiveOnes;
