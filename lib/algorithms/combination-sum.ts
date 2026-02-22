import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const combinationSum: AlgorithmDefinition = {
  id: 'combination-sum',
  title: 'Combination Sum (Tree Visualization)',
  leetcodeNumber: 39,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct integers and a target, find all unique combinations where the chosen numbers sum to target. Each number may be used unlimited times. Uses backtracking with a decision tree visualization showing which candidates are chosen at each level.',
  tags: ['backtracking', 'array', 'combination', 'recursion', 'tree'],

  code: {
    pseudocode: `function combinationSum(candidates, target):
  result = []
  sort(candidates)
  backtrack(0, [], 0, candidates, target, result)
  return result

function backtrack(start, current, currentSum, candidates, target, result):
  if currentSum == target:
    result.push(copy of current)
    return
  for i from start to len(candidates)-1:
    if candidates[i] > target - currentSum: break (pruning)
    current.push(candidates[i])
    backtrack(i, current, currentSum + candidates[i], candidates, target, result)
    current.pop()`,

    python: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    result = []
    candidates.sort()
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > target - current_sum:
                break
            current.append(candidates[i])
            backtrack(i, current, current_sum + candidates[i])
            current.pop()
    backtrack(0, [], 0)
    return result`,

    javascript: `function combinationSum(candidates, target) {
  const result = [];
  candidates.sort((a, b) => a - b);
  function backtrack(start, current, currentSum) {
    if (currentSum === target) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > target - currentSum) break;
      current.push(candidates[i]);
      backtrack(i, current, currentSum + candidates[i]);
      current.pop();
    }
  }
  backtrack(0, [], 0);
  return result;
}`,

    java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    Arrays.sort(candidates);
    backtrack(candidates, target, 0, new ArrayList<>(), 0, result);
    return result;
}
private void backtrack(int[] candidates, int target, int start,
                       List<Integer> current, int currentSum, List<List<Integer>> result) {
    if (currentSum == target) { result.add(new ArrayList<>(current)); return; }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > target - currentSum) break;
        current.add(candidates[i]);
        backtrack(candidates, target, i, current, currentSum + candidates[i], result);
        current.remove(current.size() - 1);
    }
}`,
  },

  defaultInput: {
    candidates: [2, 3, 6, 7],
    target: 7,
  },

  inputFields: [
    {
      name: 'candidates',
      label: 'Candidates',
      type: 'array',
      defaultValue: [2, 3, 6, 7],
      placeholder: '2,3,6,7',
      helperText: 'Comma-separated distinct integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Target sum to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const candidates = [...(input.candidates as number[])].sort((a, b) => a - b);
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Starting combination sum. Candidates sorted: [${candidates.join(', ')}], target=${target}.`,
      variables: { candidates, target, result: [] },
      visualization: {
        type: 'array',
        array: candidates,
        highlights: {},
        labels: {},
      },
    });

    function backtrack(start: number, current: number[], currentSum: number) {
      if (currentSum === target) {
        result.push([...current]);
        steps.push({
          line: 8,
          explanation: `Found valid combination: [${current.join(', ')}] sums to ${target}!`,
          variables: { current: [...current], currentSum, found: result.length },
          visualization: {
            type: 'array',
            array: candidates,
            highlights: candidates.reduce((acc, c, i) => current.includes(c) ? { ...acc, [i]: 'found' } : acc, {}),
            labels: candidates.reduce((acc, c, i) => current.includes(c) ? { ...acc, [i]: `x${current.filter(x => x === c).length}` } : acc, {} as Record<number, string>),
          },
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        if (candidates[i] > target - currentSum) {
          steps.push({
            line: 11,
            explanation: `Pruning: candidate ${candidates[i]} > remaining ${target - currentSum}. No need to check further.`,
            variables: { candidate: candidates[i], remaining: target - currentSum, current: [...current] },
            visualization: {
              type: 'array',
              array: candidates,
              highlights: { [i]: 'mismatch' },
              labels: { [i]: 'pruned' },
            },
          });
          break;
        }

        current.push(candidates[i]);

        steps.push({
          line: 12,
          explanation: `Choose ${candidates[i]}. Current path: [${current.join(', ')}], sum so far=${currentSum + candidates[i]}, remaining=${target - currentSum - candidates[i]}.`,
          variables: { chosen: candidates[i], current: [...current], newSum: currentSum + candidates[i], remaining: target - currentSum - candidates[i] },
          visualization: {
            type: 'array',
            array: candidates,
            highlights: { [i]: 'active' },
            labels: { [i]: 'chosen' },
          },
        });

        backtrack(i, current, currentSum + candidates[i]);
        current.pop();

        steps.push({
          line: 14,
          explanation: `Backtrack: remove ${candidates[i]} from path. Current path: [${current.join(', ')}]`,
          variables: { removed: candidates[i], current: [...current], currentSum },
          visualization: {
            type: 'array',
            array: candidates,
            highlights: { [i]: 'comparing' },
            labels: { [i]: 'back' },
          },
        });
      }
    }

    backtrack(0, [], 0);

    steps.push({
      line: 5,
      explanation: `Combination sum complete. Found ${result.length} combinations: [${result.map(c => `[${c.join(',')}]`).join(', ')}]`,
      variables: { target, totalFound: result.length, result },
      visualization: {
        type: 'array',
        array: candidates,
        highlights: candidates.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: {},
      },
    });

    return steps;
  },
};

export default combinationSum;
