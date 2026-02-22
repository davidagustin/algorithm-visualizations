import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const combinationSumII: AlgorithmDefinition = {
  id: 'combination-sum-ii',
  title: 'Combination Sum II',
  leetcodeNumber: 40,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a collection of candidate numbers (may contain duplicates) and a target, find all unique combinations where the candidates sum to target. Each number may only be used once. Sort the candidates first, then use backtracking skipping duplicates at the same recursion level.',
  tags: ['Backtracking', 'Recursion', 'Array'],
  code: {
    pseudocode: `function combinationSum2(candidates, target):
  sort(candidates)
  result = []
  backtrack(candidates, target, 0, [], result)
  return result

function backtrack(candidates, remaining, start, current, result):
  if remaining == 0:
    result.append(copy of current)
    return
  for i from start to candidates.length-1:
    if i > start and candidates[i] == candidates[i-1]: skip  // skip duplicates
    if candidates[i] > remaining: break
    current.append(candidates[i])
    backtrack(candidates, remaining - candidates[i], i+1, current, result)
    current.pop()`,
    python: `def combinationSum2(candidates, target):
    candidates.sort()
    result = []
    def backtrack(remaining, start, current):
        if remaining == 0:
            result.append(current[:])
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i-1]:
                continue
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(remaining - candidates[i], i + 1, current)
            current.pop()
    backtrack(target, 0, [])
    return result`,
    javascript: `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const result = [];
  function backtrack(remaining, start, current) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > remaining) break;
      current.push(candidates[i]);
      backtrack(remaining - candidates[i], i + 1, current);
      current.pop();
    }
  }
  backtrack(target, 0, []);
  return result;
}`,
    java: `public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
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
        if (i > start && cand[i] == cand[i-1]) continue;
        if (cand[i] > remaining) break;
        current.add(cand[i]);
        backtrack(cand, remaining - cand[i], i + 1, current, result);
        current.remove(current.size() - 1);
    }
}`,
  },
  defaultInput: { candidates: [10, 1, 2, 7, 6, 1, 5], target: 8 },
  inputFields: [
    {
      name: 'candidates',
      label: 'Candidates',
      type: 'array',
      defaultValue: [10, 1, 2, 7, 6, 1, 5],
      placeholder: 'e.g. 10,1,2,7,6,1,5',
      helperText: 'Array of positive integers (may contain duplicates)',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 8,
      placeholder: 'e.g. 8',
      helperText: 'Target sum to reach using each element at most once',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const candidates = (input.candidates as number[]).slice().sort((a, b) => a - b);
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function makeViz(activeIdx: number | null, remaining: number, skipped: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < candidates.length; i++) {
        labels[i] = String(candidates[i]);
        if (i === activeIdx) highlights[i] = 'active';
        else if (i === skipped) highlights[i] = 'visited';
        else highlights[i] = 'default';
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
            { key: 'Remaining', value: String(remaining) },
            { key: 'Found', value: String(result.length) },
            ...result.slice(-3).map((c, i) => ({ key: `  #${result.length - Math.min(3, result.length) + i + 1}`, value: `[${c.join(', ')}]` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort candidates: [${candidates.join(', ')}]. Target = ${target}. Each number used once; skip duplicates at same level.`,
      variables: { candidates: candidates.slice(), target },
      visualization: makeViz(null, target, null),
    });

    function backtrack(remaining: number, start: number): void {
      if (remaining === 0) {
        result.push(current.slice());
        steps.push({
          line: 8,
          explanation: `Remaining = 0. Found: [${current.join(', ')}]! Total: ${result.length}.`,
          variables: { combination: current.slice(), total: result.length },
          visualization: {
            type: 'array',
            array: candidates.slice(),
            highlights: Object.fromEntries(candidates.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(candidates.map((v, i) => [i, String(v)])),
            auxData: {
              label: 'Combination Found!',
              entries: [
                { key: 'Combination', value: `[${current.join(', ')}]` },
                { key: 'Total found', value: String(result.length) },
              ],
            },
          },
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        if (i > start && candidates[i] === candidates[i - 1]) {
          steps.push({
            line: 11,
            explanation: `Skip candidates[${i}]=${candidates[i]}: duplicate of candidates[${i - 1}]=${candidates[i - 1]} at same level.`,
            variables: { i, val: candidates[i], reason: 'duplicate' },
            visualization: makeViz(null, remaining, i),
          });
          continue;
        }
        if (candidates[i] > remaining) {
          steps.push({
            line: 12,
            explanation: `candidates[${i}]=${candidates[i]} > remaining ${remaining}. Break (array sorted, no need to continue).`,
            variables: { i, val: candidates[i], remaining },
            visualization: makeViz(i, remaining, null),
          });
          break;
        }

        current.push(candidates[i]);
        steps.push({
          line: 13,
          explanation: `Add candidates[${i}]=${candidates[i]}. Current: [${current.join(', ')}], remaining: ${remaining - candidates[i]}.`,
          variables: { i, val: candidates[i], current: current.slice(), remaining: remaining - candidates[i] },
          visualization: makeViz(i, remaining - candidates[i], null),
        });

        backtrack(remaining - candidates[i], i + 1);

        current.pop();
        steps.push({
          line: 15,
          explanation: `Backtrack: remove ${candidates[i]}. Current: [${current.join(', ')}]. Try next.`,
          variables: { removed: candidates[i], current: current.slice(), remaining },
          visualization: makeViz(i, remaining, null),
        });
      }
    }

    backtrack(target, 0);

    steps.push({
      line: 3,
      explanation: `Done. Found ${result.length} unique combination(s) summing to ${target}.`,
      variables: { total: result.length },
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

export default combinationSumII;
