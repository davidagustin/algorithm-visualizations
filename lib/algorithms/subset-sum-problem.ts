import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const subsetSumProblem: AlgorithmDefinition = {
  id: 'subset-sum-problem',
  title: 'Subset Sum Problem',
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a set of non-negative integers and a target sum, find all subsets that sum exactly to the target. Uses backtracking with sorting and pruning: if the current element exceeds the remaining target, all larger elements can be skipped. Records every subset that achieves the exact sum.',
  tags: ['backtracking', 'array', 'recursion', 'subset', 'sum'],

  code: {
    pseudocode: `function subsetSum(nums, target):
  result = []
  sort(nums)
  backtrack(nums, 0, [], 0, target, result)
  return result

function backtrack(nums, start, current, currentSum, target, result):
  if currentSum == target:
    result.push(copy of current)
    return
  if currentSum > target: return (pruned)
  for i from start to len(nums)-1:
    if currentSum + nums[i] > target: break (sorted so all remaining are bigger)
    current.push(nums[i])
    backtrack(nums, i+1, current, currentSum+nums[i], target, result)
    current.pop()`,

    python: `def subsetSum(nums: list[int], target: int) -> list[list[int]]:
    nums.sort()
    result = []
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(list(current))
            return
        for i in range(start, len(nums)):
            if current_sum + nums[i] > target:
                break
            current.append(nums[i])
            backtrack(i + 1, current, current_sum + nums[i])
            current.pop()
    backtrack(0, [], 0)
    return result`,

    javascript: `function subsetSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  function backtrack(start, current, currentSum) {
    if (currentSum === target) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < nums.length; i++) {
      if (currentSum + nums[i] > target) break;
      current.push(nums[i]);
      backtrack(i + 1, current, currentSum + nums[i]);
      current.pop();
    }
  }
  backtrack(0, [], 0);
  return result;
}`,

    java: `public List<List<Integer>> subsetSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), 0, target, result);
    return result;
}
private void backtrack(int[] nums, int start, List<Integer> current,
                       int currentSum, int target, List<List<Integer>> result) {
    if (currentSum == target) { result.add(new ArrayList<>(current)); return; }
    for (int i = start; i < nums.length; i++) {
        if (currentSum + nums[i] > target) break;
        current.add(nums[i]);
        backtrack(nums, i + 1, current, currentSum + nums[i], target, result);
        current.remove(current.size() - 1);
    }
}`,
  },

  defaultInput: {
    nums: [3, 34, 4, 12, 5, 2],
    target: 9,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Set of Numbers',
      type: 'array',
      defaultValue: [3, 34, 4, 12, 5, 2],
      placeholder: '3,34,4,12,5,2',
      helperText: 'Comma-separated non-negative integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Target sum to find subsets for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])].sort((a, b) => a - b);
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Finding all subsets of [${nums.join(', ')}] that sum to ${target}. Sorted for pruning efficiency.`,
      variables: { nums, target },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: nums.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
      },
    });

    function backtrack(start: number, current: number[], currentSum: number) {
      if (currentSum === target) {
        result.push([...current]);
        steps.push({
          line: 8,
          explanation: `Found subset summing to ${target}: [${current.join(', ')}]. Total found: ${result.length}.`,
          variables: { subset: [...current], sum: currentSum, totalFound: result.length },
          visualization: {
            type: 'array',
            array: nums,
            highlights: nums.reduce((acc, v, i) => ({
              ...acc,
              [i]: current.includes(v) ? 'found' : 'default',
            }), {}),
            labels: nums.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
          },
        });
        return;
      }

      for (let i = start; i < nums.length; i++) {
        if (currentSum + nums[i] > target) {
          steps.push({
            line: 11,
            explanation: `Prune: ${currentSum} + ${nums[i]} = ${currentSum + nums[i]} > ${target}. All elements from index ${i} onward are too large (sorted).`,
            variables: { element: nums[i], currentSum, wouldBe: currentSum + nums[i], target },
            visualization: {
              type: 'array',
              array: nums,
              highlights: nums.reduce((acc, _, j) => ({ ...acc, [j]: j >= i ? 'mismatch' : 'default' }), {}),
              labels: nums.reduce((acc, v, j) => ({ ...acc, [j]: j >= i ? 'pruned' : `${v}` }), {} as Record<number, string>),
            },
          });
          break;
        }

        current.push(nums[i]);

        steps.push({
          line: 12,
          explanation: `Include nums[${i}]=${nums[i]}. Path: [${current.join(', ')}], sum=${currentSum + nums[i]}, remaining=${target - currentSum - nums[i]}.`,
          variables: { included: nums[i], path: [...current], newSum: currentSum + nums[i], remaining: target - currentSum - nums[i] },
          visualization: {
            type: 'array',
            array: nums,
            highlights: { [i]: 'active' },
            labels: nums.reduce((acc, v, j) => ({ ...acc, [j]: current.includes(v) ? `${v}*` : `${v}` }), {} as Record<number, string>),
          },
        });

        backtrack(i + 1, current, currentSum + nums[i]);
        current.pop();

        steps.push({
          line: 14,
          explanation: `Exclude nums[${i}]=${nums[i]} and backtrack. Path: [${current.join(', ')}]`,
          variables: { excluded: nums[i], path: [...current], currentSum },
          visualization: {
            type: 'array',
            array: nums,
            highlights: { [i]: 'comparing' },
            labels: nums.reduce((acc, v, j) => ({ ...acc, [j]: `${v}` }), {} as Record<number, string>),
          },
        });
      }
    }

    backtrack(0, [], 0);

    steps.push({
      line: 5,
      explanation: `Subset sum complete. Found ${result.length} subset(s) summing to ${target}: [${result.map(s => `[${s.join(',')}]`).join(', ')}]`,
      variables: { target, subsets: result, count: result.length },
      visualization: {
        type: 'array',
        array: nums,
        highlights: nums.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: { 0: `${result.length} subset(s)` },
      },
    });

    return steps;
  },
};

export default subsetSumProblem;
