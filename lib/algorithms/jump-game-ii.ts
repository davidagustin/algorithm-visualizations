import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpGameIi: AlgorithmDefinition = {
  id: 'jump-game-ii',
  title: 'Jump Game II',
  leetcodeNumber: 45,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array nums where nums[i] is the maximum jump length from index i, return the minimum number of jumps to reach the last index. Greedy/DP approach: track current reach boundary and farthest reachable position, incrementing jumps whenever the boundary is crossed.',
  tags: ['dynamic programming', 'greedy', 'array', 'BFS-like'],

  code: {
    pseudocode: `function jump(nums):
  jumps = 0, currentEnd = 0, farthest = 0
  for i from 0 to n-2:
    farthest = max(farthest, i + nums[i])
    if i == currentEnd:
      jumps++
      currentEnd = farthest
      if currentEnd >= n-1: break
  return jumps`,

    python: `def jump(nums: list[int]) -> int:
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
            if current_end >= len(nums) - 1:
                break
    return jumps`,

    javascript: `function jump(nums) {
  let jumps = 0, currentEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
      if (currentEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}`,

    java: `public int jump(int[] nums) {
    int jumps = 0, currentEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            if (currentEnd >= nums.length - 1) break;
        }
    }
    return jumps;
}`,
  },

  defaultInput: { nums: [2, 3, 1, 1, 4] },

  inputFields: [
    {
      name: 'nums',
      label: 'Jump Lengths',
      type: 'array',
      defaultValue: [2, 3, 1, 1, 4],
      placeholder: '2,3,1,1,4',
      helperText: 'Maximum jump length at each position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;

    const makeViz = (i: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels: { [i]: 'i', [currentEnd]: 'end' },
    });

    steps.push({
      line: 2,
      explanation: `Initialize: jumps=0, currentEnd=0, farthest=0. Array has ${n} elements.`,
      variables: { jumps, currentEnd, farthest },
      visualization: makeViz(0, { 0: 'active' }),
    });

    for (let i = 0; i < n - 1; i++) {
      const reach = i + nums[i];
      farthest = Math.max(farthest, reach);

      steps.push({
        line: 4,
        explanation: `i=${i}, nums[i]=${nums[i]}: can reach index ${reach}. farthest=${farthest}.`,
        variables: { i, 'nums[i]': nums[i], reach, farthest, jumps },
        visualization: makeViz(i, { [i]: 'active', [Math.min(reach, n - 1)]: 'pointer' }),
      });

      if (i === currentEnd) {
        jumps++;
        currentEnd = farthest;

        steps.push({
          line: 6,
          explanation: `Reached boundary (i=${i}==currentEnd). Make jump #${jumps}. New currentEnd = farthest = ${currentEnd}.`,
          variables: { i, jumps, currentEnd, farthest },
          visualization: makeViz(i, { [i]: 'found', [Math.min(currentEnd, n - 1)]: 'sorted' }),
        });

        if (currentEnd >= n - 1) {
          steps.push({
            line: 8,
            explanation: `currentEnd=${currentEnd} >= last index ${n - 1}. Can reach the end! Break early.`,
            variables: { jumps, currentEnd },
            visualization: makeViz(i, Object.fromEntries(nums.map((_, k) => [k, k <= currentEnd ? 'found' : 'default']))),
          });
          break;
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum number of jumps to reach the end = ${jumps}.`,
      variables: { result: jumps },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: { [n - 1]: 'end' },
      },
    });

    return steps;
  },
};

export default jumpGameIi;
