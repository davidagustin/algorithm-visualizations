import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const combinationsOfASum: AlgorithmDefinition = {
  id: 'combinations-of-a-sum',
  title: 'Combinations of a Sum',
  leetcodeNumber: 39,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct candidate numbers and a target, find all unique combinations where the candidates sum to the target. Each number may be used unlimited times. We use backtracking, starting from each candidate and allowing repeated use of the same element.',
  tags: ['Backtracking', 'Recursion'],
  code: {
    pseudocode: `function combinationSum(candidates, target):
  result = []
  backtrack(candidates, target, 0, [], result)
  return result

function backtrack(candidates, remaining, start, current, result):
  if remaining == 0:
    result.append(copy of current)
    return
  if remaining < 0: return
  for i from start to candidates.length-1:
    current.append(candidates[i])
    backtrack(candidates, remaining - candidates[i],
              i, current, result)
    current.pop()`,
    python: `def combinationSum(candidates, target):
    result = []
    def backtrack(remaining, start, current):
        if remaining == 0:
            result.append(current[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                continue
            current.append(candidates[i])
            backtrack(remaining - candidates[i], i, current)
            current.pop()
    backtrack(target, 0, [])
    return result`,
    javascript: `function combinationSum(candidates, target) {
  const result = [];
  function backtrack(remaining, start, current) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) continue;
      current.push(candidates[i]);
      backtrack(remaining - candidates[i], i, current);
      current.pop();
    }
  }
  backtrack(target, 0, []);
  return result;
}`,
    java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), result);
    return result;
}
void backtrack(int[] cand, int remaining, int start,
               List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = start; i < cand.length; i++) {
        if (cand[i] > remaining) continue;
        current.add(cand[i]);
        backtrack(cand, remaining - cand[i], i, current, result);
        current.remove(current.size() - 1);
    }
}`,
  },
  defaultInput: { candidates: [2, 3, 6, 7], target: 7 },
  inputFields: [
    {
      name: 'candidates',
      label: 'Candidates',
      type: 'array',
      defaultValue: [2, 3, 6, 7],
      placeholder: 'e.g. 2,3,6,7',
      helperText: 'Array of distinct positive integers.',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Target sum to reach.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const candidates = (input.candidates as number[]).slice();
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function makeViz(activeIdx: number | null, remaining: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < candidates.length; i++) {
        labels[i] = String(candidates[i]);
      }
      if (activeIdx !== null) {
        highlights[activeIdx] = 'active';
      }
      return {
        type: 'array',
        array: candidates.slice(),
        highlights,
        labels,
        auxData: {
          label: 'State',
          entries: [
            { key: 'Current', value: `[${current.join(', ')}]` },
            { key: 'Sum', value: `${target - remaining}` },
            { key: 'Remaining', value: `${remaining}` },
            { key: 'Combos found', value: `${result.length}` },
            ...result.map((c, i) => ({ key: `  #${i + 1}`, value: `[${c.join(', ')}]` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find all combinations of [${candidates.join(', ')}] that sum to ${target}. Each number can be used multiple times.`,
      variables: { candidates: candidates.slice(), target },
      visualization: makeViz(null, target),
    });

    function backtrack(remaining: number, start: number): void {
      if (remaining === 0) {
        result.push(current.slice());
        steps.push({
          line: 7,
          explanation: `Remaining = 0. Found combination: [${current.join(', ')}]! Total: ${result.length}.`,
          variables: { combination: current.slice(), count: result.length },
          visualization: {
            type: 'array',
            array: candidates.slice(),
            highlights: Object.fromEntries(candidates.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(candidates.map((v, i) => [i, String(v)])),
            auxData: {
              label: 'State',
              entries: [
                { key: 'Current', value: `[${current.join(', ')}]` },
                { key: 'FOUND!', value: `combo #${result.length}` },
                ...result.map((c, i) => ({ key: `  #${i + 1}`, value: `[${c.join(', ')}]` })),
              ],
            },
          },
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) {
          steps.push({
            line: 10,
            explanation: `candidates[${i}]=${candidates[i]} > remaining ${remaining}. Skip.`,
            variables: { candidate: candidates[i], remaining },
            visualization: makeViz(i, remaining),
          });
          continue;
        }

        current.push(candidates[i]);

        steps.push({
          line: 11,
          explanation: `Add candidates[${i}]=${candidates[i]}. Current: [${current.join(', ')}], remaining: ${remaining - candidates[i]}.`,
          variables: { candidate: candidates[i], current: current.slice(), remaining: remaining - candidates[i] },
          visualization: makeViz(i, remaining - candidates[i]),
        });

        backtrack(remaining - candidates[i], i);

        current.pop();

        steps.push({
          line: 13,
          explanation: `Backtrack: remove ${candidates[i]}. Current: [${current.length === 0 ? '' : current.join(', ')}], remaining: ${remaining}.`,
          variables: { removed: candidates[i], current: current.slice(), remaining },
          visualization: makeViz(i, remaining),
        });
      }
    }

    backtrack(target, 0);

    steps.push({
      line: 3,
      explanation: `All combinations found. ${result.length} combination(s) sum to ${target}.`,
      variables: { totalCombinations: result.length, target },
      visualization: {
        type: 'array',
        array: candidates.slice(),
        highlights: Object.fromEntries(candidates.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(candidates.map((v, i) => [i, String(v)])),
        auxData: {
          label: `All ${result.length} Combinations`,
          entries: result.map((c, i) => ({ key: `#${i + 1}`, value: `[${c.join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default combinationsOfASum;
