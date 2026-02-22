import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumOperationsBinaryArray: AlgorithmDefinition = {
  id: 'minimum-operations-binary-array',
  title: 'Minimum Operations to Make Binary Array Elements Equal to One I',
  leetcodeNumber: 3191,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a binary array, in one operation you can flip 3 consecutive elements. Find the minimum number of operations to make all elements 1, or return -1 if impossible. Greedy approach: scan left to right and whenever we find a 0, flip the next 3 elements. If a 0 remains in the last 2 positions, it is impossible.',
  tags: ['greedy', 'array', 'sliding window', 'binary'],

  code: {
    pseudocode: `function minOperations(nums):
  n = length(nums)
  ops = 0
  for i from 0 to n-3:
    if nums[i] == 0:
      flip nums[i], nums[i+1], nums[i+2]
      ops++
  if nums[n-2] == 0 or nums[n-1] == 0:
    return -1
  return ops`,

    python: `def minOperations(nums: list[int]) -> int:
    n = len(nums)
    ops = 0
    for i in range(n - 2):
        if nums[i] == 0:
            nums[i] ^= 1
            nums[i + 1] ^= 1
            nums[i + 2] ^= 1
            ops += 1
    if nums[-1] == 0 or nums[-2] == 0:
        return -1
    return ops`,

    javascript: `function minOperations(nums) {
  const n = nums.length;
  let ops = 0;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] === 0) {
      nums[i] ^= 1;
      nums[i + 1] ^= 1;
      nums[i + 2] ^= 1;
      ops++;
    }
  }
  if (nums[n - 1] === 0 || nums[n - 2] === 0) return -1;
  return ops;
}`,

    java: `public int minOperations(int[] nums) {
    int n = nums.length, ops = 0;
    for (int i = 0; i < n - 2; i++) {
        if (nums[i] == 0) {
            nums[i] ^= 1;
            nums[i + 1] ^= 1;
            nums[i + 2] ^= 1;
            ops++;
        }
    }
    if (nums[n - 1] == 0 || nums[n - 2] == 0) return -1;
    return ops;
}`,
  },

  defaultInput: {
    nums: [0, 1, 1, 1, 0, 0],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [0, 1, 1, 1, 0, 0],
      placeholder: '0,1,1,1,0,0',
      helperText: 'Comma-separated 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Start with binary array [${nums.join(', ')}]. Scan left to right; when we see a 0, flip 3 consecutive elements starting there.`,
      variables: { nums: [...nums], ops: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    let ops = 0;

    for (let i = 0; i < n - 2; i++) {
      if (nums[i] === 0) {
        steps.push({
          line: 4,
          explanation: `Found 0 at index ${i}. Flip elements at indices ${i}, ${i + 1}, ${i + 2}.`,
          variables: { i, 'nums[i]': nums[i], ops },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active', [i + 1]: 'comparing', [i + 2]: 'comparing' } as Record<number, string>,
            labels: { [i]: 'flip' } as Record<number, string>,
          },
        });

        nums[i] ^= 1;
        nums[i + 1] ^= 1;
        nums[i + 2] ^= 1;
        ops++;

        steps.push({
          line: 5,
          explanation: `After flip: [${nums.join(', ')}]. Operations so far: ${ops}.`,
          variables: { i, nums: [...nums], ops },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'found', [i + 1]: 'found', [i + 2]: 'found' } as Record<number, string>,
            labels: { [i]: '1', [i + 1]: `${nums[i + 1]}`, [i + 2]: `${nums[i + 2]}` } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 3,
          explanation: `Index ${i} is already 1. Move on.`,
          variables: { i, 'nums[i]': nums[i] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'sorted' } as Record<number, string>,
            labels: {},
          },
        });
      }
    }

    if (nums[n - 1] === 0 || nums[n - 2] === 0) {
      steps.push({
        line: 7,
        explanation: `Cannot fix remaining 0s in last 2 positions. Return -1 (impossible).`,
        variables: { result: -1 },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [n - 2]: 'mismatch', [n - 1]: 'mismatch' } as Record<number, string>,
          labels: {},
        },
      });
      return steps;
    }

    steps.push({
      line: 8,
      explanation: `All elements are 1. Minimum operations: ${ops}.`,
      variables: { result: ops },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumOperationsBinaryArray;
