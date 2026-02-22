import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpToTheEnd: AlgorithmDefinition = {
  id: 'jump-to-the-end',
  title: 'Jump to the End (Jump Game)',
  leetcodeNumber: 55,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array where each element represents the maximum jump length from that position, determine if you can reach the last index. Greedily track the farthest reachable position. If at any point the current index exceeds the farthest reachable, return false. O(n) time.',
  tags: ['Greedy', 'Array'],
  code: {
    pseudocode: `function canJump(nums):
  maxReach = 0
  for i from 0 to n-1:
    if i > maxReach:
      return false
    maxReach = max(maxReach, i + nums[i])
    if maxReach >= n-1:
      return true
  return true`,
    python: `def canJump(nums):
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + nums[i])
        if max_reach >= len(nums) - 1:
            return True
    return True`,
    javascript: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
    java: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}`,
  },
  defaultInput: { nums: [2, 3, 1, 1, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Jump Array',
      type: 'array',
      defaultValue: [2, 3, 1, 1, 4],
      placeholder: '2,3,1,1,4',
      helperText: 'Each element is the max jump length from that position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      currentIdx: number,
      maxReach: number,
      highlights?: Record<number, string>,
    ): ArrayVisualization => {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};

      // Show reachable range
      for (let i = 0; i < n; i++) {
        if (i <= maxReach) {
          hl[i] = 'sorted'; // reachable
        }
      }

      // Override with any provided highlights
      if (highlights) {
        for (const [k, v] of Object.entries(highlights)) {
          hl[Number(k)] = v;
        }
      }

      // Current position
      if (currentIdx >= 0 && currentIdx < n) {
        hl[currentIdx] = 'active';
        lb[currentIdx] = 'curr';
      }

      // Max reach label
      if (maxReach < n) {
        lb[maxReach] = lb[maxReach] ? lb[maxReach] + ',max' : 'max';
      }

      return {
        type: 'array',
        array: [...nums],
        highlights: hl,
        labels: lb,
        auxData: {
          label: 'State',
          entries: [
            { key: 'Max Reach', value: String(maxReach) },
            { key: 'Target', value: String(n - 1) },
          ],
        },
      };
    };

    let maxReach = 0;

    steps.push({
      line: 2,
      explanation: `Can we reach index ${n - 1} from index 0? Array: [${nums.join(', ')}]. Start with maxReach=0.`,
      variables: { maxReach, target: n - 1 },
      visualization: makeViz(0, 0),
    });

    for (let i = 0; i < n; i++) {
      if (i > maxReach) {
        steps.push({
          line: 4,
          explanation: `Index ${i} > maxReach ${maxReach}. Cannot reach this position. Return false.`,
          variables: { i, maxReach, result: false },
          visualization: makeViz(i, maxReach, { [i]: 'mismatch' }),
        });
        return steps;
      }

      const oldMax = maxReach;
      maxReach = Math.max(maxReach, i + nums[i]);

      steps.push({
        line: 5,
        explanation: `At index ${i}, jump length = ${nums[i]}. Can reach up to ${i} + ${nums[i]} = ${i + nums[i]}. maxReach = max(${oldMax}, ${i + nums[i]}) = ${maxReach}.`,
        variables: { i, 'nums[i]': nums[i], reach: i + nums[i], maxReach },
        visualization: makeViz(i, maxReach),
      });

      if (maxReach >= n - 1) {
        steps.push({
          line: 7,
          explanation: `maxReach (${maxReach}) >= target (${n - 1}). Can reach the end! Return true.`,
          variables: { maxReach, target: n - 1, result: true },
          visualization: (() => {
            const hl: Record<number, string> = {};
            for (let j = 0; j < n; j++) hl[j] = 'found';
            hl[i] = 'active';
            hl[n - 1] = 'found';
            return {
              type: 'array' as const,
              array: [...nums],
              highlights: hl,
              labels: { [i]: 'curr', [n - 1]: 'goal' },
              auxData: { label: 'Result', entries: [{ key: 'Can Jump?', value: 'YES' }] },
            };
          })(),
        });
        return steps;
      }
    }

    steps.push({
      line: 8,
      explanation: `Traversed entire array. maxReach=${maxReach} >= ${n - 1}. Return true.`,
      variables: { result: true },
      visualization: makeViz(n - 1, maxReach),
    });

    return steps;
  },
};

export default jumpToTheEnd;
