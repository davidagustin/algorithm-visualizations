import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binarySubarraysWithSum: AlgorithmDefinition = {
  id: 'binary-subarrays-with-sum',
  title: 'Binary Subarrays With Sum',
  leetcodeNumber: 930,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal. Apply the sliding window identity: exactly(goal) = atMost(goal) - atMost(goal-1). The atMost function counts subarrays whose sum does not exceed a given limit by expanding right and shrinking left when the sum exceeds the limit.',
  tags: ['sliding window', 'prefix sum', 'hash map', 'binary array'],

  code: {
    pseudocode: `function numSubarraysWithSum(nums, goal):
  return atMost(nums, goal) - atMost(nums, goal - 1)

function atMost(nums, goal):
  if goal < 0: return 0
  left = 0
  currentSum = 0
  result = 0
  for right in range(len(nums)):
    currentSum += nums[right]
    while currentSum > goal:
      currentSum -= nums[left]
      left += 1
    result += right - left + 1
  return result`,

    python: `def numSubarraysWithSum(nums: list[int], goal: int) -> int:
    def atMost(g):
        if g < 0: return 0
        left = curr = result = 0
        for right, num in enumerate(nums):
            curr += num
            while curr > g:
                curr -= nums[left]
                left += 1
            result += right - left + 1
        return result
    return atMost(goal) - atMost(goal - 1)`,

    javascript: `function numSubarraysWithSum(nums, goal) {
  function atMost(g) {
    if (g < 0) return 0;
    let left = 0, curr = 0, result = 0;
    for (let right = 0; right < nums.length; right++) {
      curr += nums[right];
      while (curr > g) curr -= nums[left++];
      result += right - left + 1;
    }
    return result;
  }
  return atMost(goal) - atMost(goal - 1);
}`,

    java: `public int numSubarraysWithSum(int[] nums, int goal) {
    return atMost(nums, goal) - atMost(nums, goal - 1);
}
private int atMost(int[] nums, int g) {
    if (g < 0) return 0;
    int left = 0, curr = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        curr += nums[right];
        while (curr > g) curr -= nums[left++];
        result += right - left + 1;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 0, 1, 0, 1],
    goal: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1],
      placeholder: '1,0,1,0,1',
      helperText: 'Binary array of 0s and 1s',
    },
    {
      name: 'goal',
      label: 'Goal Sum',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const goal = input.goal as number;
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

    steps.push({
      line: 1,
      explanation: `Count binary subarrays with sum equal to goal=${goal}. Use: exactly(${goal}) = atMost(${goal}) - atMost(${goal - 1}).`,
      variables: { goal },
      visualization: makeViz({}, {}),
    });

    const atMost = (g: number): { count: number; trail: { left: number; right: number; sum: number; added: number }[] } => {
      if (g < 0) return { count: 0, trail: [] };
      let left = 0;
      let curr = 0;
      let result = 0;
      const trail: { left: number; right: number; sum: number; added: number }[] = [];
      for (let right = 0; right < nums.length; right++) {
        curr += nums[right];
        while (curr > g) {
          curr -= nums[left];
          left++;
        }
        const added = right - left + 1;
        result += added;
        trail.push({ left, right, sum: curr, added });
      }
      return { count: result, trail };
    };

    const { count: atMostGoal, trail: trailGoal } = atMost(goal);
    const { count: atMostGoalM1, trail: trailGoalM1 } = atMost(goal - 1);

    steps.push({
      line: 4,
      explanation: `Computing atMost(${goal}): subarrays with sum at most ${goal}.`,
      variables: { limit: goal },
      visualization: makeViz({}, {}),
    });

    for (const { left, right, sum, added } of trailGoal) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = nums[i] === 1 ? 'active' : 'comparing';
      }
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${goal}): right=${right}, left=${left}, windowSum=${sum}. Adding ${added} subarrays.`,
        variables: { left, right, sum, added, limit: goal },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 4,
      explanation: `atMost(${goal})=${atMostGoal}. Now computing atMost(${goal - 1}).`,
      variables: { atMostGoal, nextLimit: goal - 1 },
      visualization: makeViz({}, {}),
    });

    for (const { left, right, sum, added } of trailGoalM1) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = nums[i] === 1 ? 'found' : 'comparing';
      }
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${goal - 1}): right=${right}, left=${left}, windowSum=${sum}. Adding ${added} subarrays.`,
        variables: { left, right, sum, added, limit: goal - 1 },
        visualization: makeViz(highlights, labels),
      });
    }

    const result = atMostGoal - atMostGoalM1;

    steps.push({
      line: 2,
      explanation: `Done. Subarrays with sum exactly ${goal} = ${atMostGoal} - ${atMostGoalM1} = ${result}.`,
      variables: { atMostGoal, atMostGoalM1, result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default binarySubarraysWithSum;
