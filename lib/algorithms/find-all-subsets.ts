import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllSubsets: AlgorithmDefinition = {
  id: 'find-all-subsets',
  title: 'Find All Subsets',
  leetcodeNumber: 78,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct integers, return all possible subsets (the power set). For each element, we choose to include or exclude it, building subsets recursively. This generates 2^n subsets total.',
  tags: ['Backtracking', 'Recursion', 'Bit Manipulation'],
  code: {
    pseudocode: `function subsets(nums):
  result = []
  backtrack(nums, 0, [], result)
  return result

function backtrack(nums, index, current, result):
  result.append(copy of current)
  for i from index to nums.length-1:
    current.append(nums[i])
    backtrack(nums, i+1, current, result)
    current.pop()`,
    python: `def subsets(nums):
    result = []
    def backtrack(index, current):
        result.append(current[:])
        for i in range(index, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result`,
    javascript: `function subsets(nums) {
  const result = [];
  function backtrack(index, current) {
    result.push([...current]);
    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}
void backtrack(int[] nums, int index, List<Integer> current,
               List<List<Integer>> result) {
    result.add(new ArrayList<>(current));
    for (int i = index; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.remove(current.size() - 1);
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
      helperText: 'Array of distinct integers.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function makeViz(activeIdx: number | null, action: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < nums.length; i++) {
        labels[i] = String(nums[i]);
        if (current.includes(nums[i])) {
          highlights[i] = 'found';
        }
      }
      if (activeIdx !== null) {
        highlights[activeIdx] = action === 'include' ? 'active' : 'comparing';
      }
      return {
        type: 'array',
        array: nums.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Subsets Found',
          entries: result.length > 0
            ? result.map((s, i) => ({ key: `${i + 1}`, value: s.length === 0 ? '[]' : `[${s.join(', ')}]` }))
            : [{ key: '-', value: 'none yet' }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Generate all subsets of [${nums.join(', ')}]. Total expected: 2^${nums.length} = ${Math.pow(2, nums.length)} subsets.`,
      variables: { nums: nums.slice(), n: nums.length },
      visualization: makeViz(null, ''),
    });

    function backtrack(index: number): void {
      // Record the current subset
      result.push(current.slice());

      steps.push({
        line: 6,
        explanation: `Record current subset: [${current.length === 0 ? '' : current.join(', ')}]. Total subsets so far: ${result.length}.`,
        variables: { current: current.slice(), count: result.length, index },
        visualization: makeViz(null, ''),
      });

      for (let i = index; i < nums.length; i++) {
        steps.push({
          line: 8,
          explanation: `Include nums[${i}]=${nums[i]} in current subset. Current becomes [${[...current, nums[i]].join(', ')}].`,
          variables: { including: nums[i], index: i },
          visualization: makeViz(i, 'include'),
        });

        current.push(nums[i]);
        backtrack(i + 1);
        current.pop();

        steps.push({
          line: 10,
          explanation: `Backtrack: remove ${nums[i]}. Current back to [${current.length === 0 ? '' : current.join(', ')}].`,
          variables: { removed: nums[i], current: current.slice() },
          visualization: makeViz(i, 'exclude'),
        });
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `All ${result.length} subsets generated (2^${nums.length} = ${result.length}).`,
      variables: { totalSubsets: result.length },
      visualization: {
        type: 'array',
        array: nums.slice(),
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        auxData: {
          label: `All ${result.length} Subsets`,
          entries: result.map((s, i) => ({ key: `${i + 1}`, value: s.length === 0 ? '[]' : `[${s.join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default findAllSubsets;
