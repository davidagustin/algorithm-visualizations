import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpGameGreedyIii: AlgorithmDefinition = {
  id: 'jump-game-greedy-iii',
  title: 'Jump Game (Greedy - Can Reach End)',
  leetcodeNumber: 55,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array of non-negative integers representing jump lengths, determine if you can reach the last index from index 0. Greedy approach: track the farthest index reachable. If at any point the current index exceeds the farthest reachable, return false. Otherwise return true.',
  tags: ['greedy', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function canJump(nums):
  farthest = 0
  for i from 0 to n-1:
    if i > farthest: return false
    farthest = max(farthest, i + nums[i])
  return true`,

    python: `def canJump(nums: list[int]) -> bool:
    farthest = 0
    for i, n in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + n)
    return True`,

    javascript: `function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}`,

    java: `public boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;
        farthest = Math.max(farthest, i + nums[i]);
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
      label: 'Jump Lengths',
      type: 'array',
      defaultValue: [2, 3, 1, 1, 4],
      placeholder: '2,3,1,1,4',
      helperText: 'Max jump length at each position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Initialize farthest=0. Track the farthest index we can reach as we scan left to right.`,
      variables: { farthest: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'active' } as Record<number, string>,
        labels: { 0: 'start' } as Record<number, string>,
      },
    });

    let farthest = 0;

    for (let i = 0; i < n; i++) {
      if (i > farthest) {
        steps.push({
          line: 3,
          explanation: `Index ${i} > farthest=${farthest}. This position is unreachable. Return false.`,
          variables: { i, farthest, result: false },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: {
              ...Object.fromEntries(Array.from({ length: farthest + 1 }, (_, j) => [j, 'found'])),
              [i]: 'mismatch',
            } as Record<number, string>,
            labels: { [farthest]: 'max reach', [i]: 'blocked' } as Record<number, string>,
          },
        });
        return steps;
      }

      const reach = i + nums[i];
      const prevFarthest = farthest;
      farthest = Math.max(farthest, reach);

      steps.push({
        line: 4,
        explanation: `Index ${i}: jump=${nums[i]}, can reach index ${reach}. farthest = max(${prevFarthest}, ${reach}) = ${farthest}.`,
        variables: { i, 'nums[i]': nums[i], reach, farthest },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {
            [i]: 'active',
            [Math.min(farthest, n - 1)]: 'found',
          } as Record<number, string>,
          labels: {
            [i]: 'i',
            [Math.min(farthest, n - 1)]: `far=${farthest}`,
          } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `Scanned all indices. farthest=${farthest} >= last index ${n - 1}. Can reach the end. Return true.`,
      variables: { farthest, result: true },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: { [n - 1]: 'END' } as Record<number, string>,
      },
    });

    return steps;
  },
};

export default jumpGameGreedyIii;
