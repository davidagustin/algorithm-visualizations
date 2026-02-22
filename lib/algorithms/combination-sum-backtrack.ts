import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const combinationSumBacktrack: AlgorithmDefinition = {
  id: 'combination-sum-backtrack',
  title: 'Combination Sum (Backtracking)',
  leetcodeNumber: 39,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct integers and a target, find all unique combinations that sum to the target. Each number may be used multiple times. Use backtracking: at each step either include the current candidate (and recurse with the same candidate) or skip to the next. Sort candidates first to enable early termination.',
  tags: ['backtracking', 'array', 'recursion'],

  code: {
    pseudocode: `function combinationSum(candidates, target):
  sort(candidates)
  results = []
  function backtrack(start, current, remaining):
    if remaining == 0:
      results.append(copy of current)
      return
    for i in start..len(candidates)-1:
      if candidates[i] > remaining: break
      current.append(candidates[i])
      backtrack(i, current, remaining - candidates[i])
      current.pop()
  backtrack(0, [], target)
  return results`,
    python: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    res = []
    def bt(start, cur, rem):
        if rem == 0: res.append(cur[:]); return
        for i in range(start, len(candidates)):
            if candidates[i] > rem: break
            cur.append(candidates[i])
            bt(i, cur, rem - candidates[i])
            cur.pop()
    bt(0, [], target)
    return res`,
    javascript: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  function bt(start, cur, rem) {
    if (rem === 0) { res.push([...cur]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > rem) break;
      cur.push(candidates[i]);
      bt(i, cur, rem - candidates[i]);
      cur.pop();
    }
  }
  bt(0, [], target);
  return res;
}`,
    java: `public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> res = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), res);
    return res;
}
private void backtrack(int[] cands, int rem, int start, List<Integer> cur, List<List<Integer>> res) {
    if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
    for (int i = start; i < cands.length; i++) {
        if (cands[i] > rem) break;
        cur.add(cands[i]); backtrack(cands, rem-cands[i], i, cur, res); cur.remove(cur.size()-1);
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
      placeholder: '2,3,6,7',
      helperText: 'Distinct positive integers',
    },
    {
      name: 'target',
      label: 'Target',
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
    const results: number[][] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: candidates,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find all combinations from [${candidates.join(', ')}] that sum to ${target}. Numbers can repeat. Sorted for early pruning.`,
      variables: { candidates, target },
      visualization: makeViz({}, Object.fromEntries(candidates.map((v, i) => [i, String(v)]))),
    });

    function backtrack(start: number, current: number[], remaining: number) {
      if (remaining === 0) {
        results.push([...current]);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        candidates.forEach((v, i) => {
          if (current.includes(v)) { h[i] = 'found'; l[i] = String(v); }
          else { l[i] = String(v); }
        });
        steps.push({
          line: 4,
          explanation: `Found combination: [${current.join(', ')}] sums to ${target}. Total found: ${results.length}.`,
          variables: { combination: [...current], sum: target, totalFound: results.length },
          visualization: makeViz(h, l),
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) {
          steps.push({
            line: 7,
            explanation: `${candidates[i]} > remaining ${remaining}. All further candidates also too large. Prune this branch.`,
            variables: { candidate: candidates[i], remaining, pruned: true },
            visualization: makeViz({ [i]: 'mismatch' }, Object.fromEntries(candidates.map((v, j) => [j, String(v)]))),
          });
          break;
        }

        current.push(candidates[i]);

        if (steps.length < 30) {
          const h: Record<number, string> = {};
          h[i] = 'active';
          steps.push({
            line: 8,
            explanation: `Add ${candidates[i]} to combination. Remaining: ${remaining} - ${candidates[i]} = ${remaining - candidates[i]}. Current: [${current.join(', ')}].`,
            variables: { added: candidates[i], remaining: remaining - candidates[i], current: [...current] },
            visualization: makeViz(h, Object.fromEntries(candidates.map((v, j) => [j, String(v)]))),
          });
        }

        backtrack(i, current, remaining - candidates[i]);
        current.pop();
      }
    }

    backtrack(0, [], target);

    steps.push({
      line: 11,
      explanation: `Backtracking complete. Found ${results.length} combinations summing to ${target}: ${results.map(r => '[' + r.join(',') + ']').join(', ')}.`,
      variables: { target, results, totalCombinations: results.length },
      visualization: makeViz({}, Object.fromEntries(candidates.map((v, i) => [i, String(v)]))),
    });

    return steps;
  },
};

export default combinationSumBacktrack;
