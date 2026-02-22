import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const permutationsBacktrack: AlgorithmDefinition = {
  id: 'permutations-backtrack',
  title: 'Permutations (Backtracking)',
  leetcodeNumber: 46,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of distinct integers, return all possible permutations. Use backtracking with a used-array to track which elements are already in the current permutation. For each position, try every unused element, mark it used, recurse, then unmark to backtrack.',
  tags: ['backtracking', 'array', 'recursion'],

  code: {
    pseudocode: `function permute(nums):
  results = []
  used = array of false
  function backtrack(current):
    if len(current) == len(nums):
      results.append(copy of current)
      return
    for i in 0..len(nums)-1:
      if not used[i]:
        used[i] = true
        current.append(nums[i])
        backtrack(current)
        current.pop()
        used[i] = false
  backtrack([])
  return results`,
    python: `def permute(nums: list[int]) -> list[list[int]]:
    res, used = [], [False] * len(nums)
    def bt(cur):
        if len(cur) == len(nums): res.append(cur[:]); return
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True; cur.append(nums[i])
                bt(cur)
                cur.pop(); used[i] = False
    bt([])
    return res`,
    javascript: `function permute(nums) {
  const res = [], used = new Array(nums.length).fill(false);
  function bt(cur) {
    if (cur.length === nums.length) { res.push([...cur]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true; cur.push(nums[i]);
        bt(cur);
        cur.pop(); used[i] = false;
      }
    }
  }
  bt([]);
  return res;
}`,
    java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), res);
    return res;
}
private void backtrack(int[] nums, boolean[] used, List<Integer> cur, List<List<Integer>> res) {
    if (cur.size() == nums.length) { res.add(new ArrayList<>(cur)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (!used[i]) {
            used[i] = true; cur.add(nums[i]);
            backtrack(nums, used, cur, res);
            cur.remove(cur.size()-1); used[i] = false;
        }
    }
}`,
  },

  defaultInput: { nums: [1, 2, 3] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Distinct integers to permute',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const results: number[][] = [];
    const used = new Array(nums.length).fill(false);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nums,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Generate all permutations of [${nums.join(', ')}]. Total: ${nums.length}! = ${Array.from({ length: nums.length }, (_, i) => i + 1).reduce((a, b) => a * b, 1)} permutations.`,
      variables: { nums, total: Array.from({ length: nums.length }, (_, i) => i + 1).reduce((a, b) => a * b, 1) },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    function backtrack(current: number[]) {
      if (current.length === nums.length) {
        results.push([...current]);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        nums.forEach((_, i) => { h[i] = 'found'; l[i] = String(current[i]); });
        steps.push({
          line: 4,
          explanation: `Permutation #${results.length}: [${current.join(', ')}]. All elements placed.`,
          variables: { permutation: [...current], count: results.length },
          visualization: makeViz(h, l),
        });
        return;
      }

      for (let i = 0; i < nums.length; i++) {
        if (!used[i]) {
          used[i] = true;
          current.push(nums[i]);

          if (steps.length < 35) {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            nums.forEach((v, j) => {
              if (used[j] && j !== i) { h[j] = 'visited'; l[j] = String(v); }
              else if (j === i) { h[j] = 'active'; l[j] = String(v); }
              else { h[j] = 'mismatch'; l[j] = String(v); }
            });
            steps.push({
              line: 8,
              explanation: `Place nums[${i}]=${nums[i]} at position ${current.length - 1}. Current permutation: [${current.join(', ')}].`,
              variables: { index: i, value: nums[i], position: current.length - 1, current: [...current] },
              visualization: makeViz(h, l),
            });
          }

          backtrack(current);
          current.pop();
          used[i] = false;

          if (steps.length < 40) {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            nums.forEach((v, j) => {
              if (used[j]) { h[j] = 'visited'; }
              l[j] = String(v);
            });
            h[i] = 'pointer';
            steps.push({
              line: 11,
              explanation: `Backtrack: unmark nums[${i}]=${nums[i]}. Restore and try next option.`,
              variables: { unmark: nums[i], current: [...current] },
              visualization: makeViz(h, l),
            });
          }
        }
      }
    }

    backtrack([]);

    steps.push({
      line: 13,
      explanation: `All ${results.length} permutations generated: ${results.map(p => '[' + p.join(',') + ']').join(', ')}.`,
      variables: { totalPermutations: results.length, results },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    return steps;
  },
};

export default permutationsBacktrack;
