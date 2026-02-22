import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpGameGreedy: AlgorithmDefinition = {
  id: 'jump-game-greedy',
  title: 'Jump Game (Greedy)',
  leetcodeNumber: 55,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array where each element represents the maximum jump length from that position, determine if you can reach the last index. The greedy approach tracks the farthest reachable index as we iterate, stopping early if the current position is unreachable.',
  tags: ['greedy', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function canJump(nums):
  maxReach = 0
  for i = 0 to length(nums) - 1:
    if i > maxReach:
      return false
    maxReach = max(maxReach, i + nums[i])
  return true`,

    python: `def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True`,

    javascript: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,

    java: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}`,
  },

  defaultInput: {
    nums: [2, 3, 1, 1, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Jump Array',
      type: 'array',
      defaultValue: [2, 3, 1, 1, 4],
      placeholder: '2,3,1,1,4',
      helperText: 'Each value is the max jump length from that index',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      line: 2,
      explanation: 'Initialize maxReach = 0. We track the farthest index we can reach so far.',
      variables: { maxReach: 0, i: '-' },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }),
    });

    let maxReach = 0;

    for (let i = 0; i < n; i++) {
      if (i > maxReach) {
        steps.push({
          line: 4,
          explanation: `Index ${i} is beyond maxReach (${maxReach}). This position is unreachable. Return false.`,
          variables: { i, maxReach, 'nums[i]': nums[i] },
          visualization: makeViz(
            { [i]: 'mismatch', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])) },
            { [i]: 'stuck', [maxReach]: 'max' }
          ),
        });
        return steps;
      }

      const newReach = i + nums[i];
      const prevMax = maxReach;
      maxReach = Math.max(maxReach, newReach);

      steps.push({
        line: 5,
        explanation: `At index ${i} (value=${nums[i]}): can reach up to index ${newReach}. maxReach updated from ${prevMax} to ${maxReach}.`,
        variables: { i, 'nums[i]': nums[i], newReach, maxReach },
        visualization: makeViz(
          {
            [i]: 'active',
            ...(maxReach < n ? { [maxReach]: 'found' } : {}),
          },
          { [i]: 'i', [Math.min(maxReach, n - 1)]: 'max' }
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `Finished iterating. maxReach = ${maxReach} which covers the last index ${n - 1}. Return true.`,
      variables: { maxReach, lastIndex: n - 1, result: true },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, k) => [k, 'sorted'])),
        { [n - 1]: 'end' }
      ),
    });

    return steps;
  },
};

export default jumpGameGreedy;
