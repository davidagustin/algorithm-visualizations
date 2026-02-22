import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllPermutations: AlgorithmDefinition = {
  id: 'find-all-permutations',
  title: 'Find All Permutations',
  leetcodeNumber: 46,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct integers, return all possible permutations. We use swap-based backtracking: fix each element at the current position by swapping, recurse for the remaining positions, then swap back (backtrack).',
  tags: ['Backtracking', 'Recursion'],
  code: {
    pseudocode: `function permute(nums):
  result = []
  backtrack(nums, 0, result)
  return result

function backtrack(nums, start, result):
  if start == nums.length:
    result.append(copy of nums)
    return
  for i from start to nums.length-1:
    swap nums[start] and nums[i]
    backtrack(nums, start+1, result)
    swap nums[start] and nums[i]`,
    python: `def permute(nums):
    result = []
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    backtrack(0)
    return result`,
    javascript: `function permute(nums) {
  const result = [];
  function backtrack(start) {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }
    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }
  backtrack(0);
  return result;
}`,
    java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, result);
    return result;
}
void backtrack(int[] nums, int start, List<List<Integer>> result) {
    if (start == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int n : nums) perm.add(n);
        result.add(perm);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        int temp = nums[start]; nums[start] = nums[i]; nums[i] = temp;
        backtrack(nums, start + 1, result);
        temp = nums[start]; nums[start] = nums[i]; nums[i] = temp;
    }
}`,
  },
  defaultInput: { nums: [1, 2, 3] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: 'e.g. 1,2,3',
      helperText: 'Array of distinct integers to permute.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    function makeViz(startIdx: number, swapI: number | null, swapJ: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < nums.length; i++) {
        labels[i] = `[${i}]`;
        if (i < startIdx) {
          highlights[i] = 'sorted'; // fixed positions
        }
      }
      if (swapI !== null) highlights[swapI] = 'swapping';
      if (swapJ !== null) highlights[swapJ] = 'swapping';
      return {
        type: 'array',
        array: nums.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Permutations Found',
          entries: result.length > 0
            ? result.map((p, i) => ({ key: `${i + 1}`, value: `[${p.join(', ')}]` }))
            : [{ key: '-', value: 'none yet' }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Generate all permutations of [${nums.join(', ')}]. Use swap-based backtracking.`,
      variables: { nums: nums.slice(), n: nums.length },
      visualization: makeViz(0, null, null),
    });

    function backtrack(start: number): void {
      if (start === nums.length) {
        result.push(nums.slice());
        steps.push({
          line: 6,
          explanation: `All positions fixed. Found permutation: [${nums.join(', ')}]. Total: ${result.length}.`,
          variables: { permutation: nums.slice(), count: result.length },
          visualization: {
            type: 'array',
            array: nums.slice(),
            highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(nums.map((_, i) => [i, `[${i}]`])),
            auxData: {
              label: 'Permutations Found',
              entries: result.map((p, i) => ({ key: `${i + 1}`, value: `[${p.join(', ')}]` })),
            },
          },
        });
        return;
      }

      for (let i = start; i < nums.length; i++) {
        // Swap
        steps.push({
          line: 9,
          explanation: `Position ${start}: swap nums[${start}]=${nums[start]} with nums[${i}]=${nums[i]}${start === i ? ' (same position, no change)' : ''}.`,
          variables: { start, i, before: nums.slice() },
          visualization: makeViz(start, start, i),
        });

        [nums[start], nums[i]] = [nums[i], nums[start]];

        steps.push({
          line: 10,
          explanation: `After swap: [${nums.join(', ')}]. Fixed positions 0..${start}. Recurse for position ${start + 1}.`,
          variables: { start, array: nums.slice() },
          visualization: makeViz(start + 1, null, null),
        });

        backtrack(start + 1);

        // Swap back
        [nums[start], nums[i]] = [nums[i], nums[start]];

        if (start !== i) {
          steps.push({
            line: 11,
            explanation: `Backtrack: swap back nums[${start}] and nums[${i}]. Array restored to [${nums.join(', ')}].`,
            variables: { start, i, after: nums.slice() },
            visualization: makeViz(start, null, null),
          });
        }
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `All ${result.length} permutations generated.`,
      variables: { totalPermutations: result.length },
      visualization: {
        type: 'array',
        array: nums.slice(),
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        auxData: {
          label: `All ${result.length} Permutations`,
          entries: result.map((p, i) => ({ key: `${i + 1}`, value: `[${p.join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default findAllPermutations;
