import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subsetsBacktrack: AlgorithmDefinition = {
  id: 'subsets-backtrack',
  title: 'Subsets (Backtracking)',
  leetcodeNumber: 78,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an integer array of unique elements, return all possible subsets (the power set). Use backtracking: at each recursive call, record the current subset as a result (since every state is valid), then try adding each remaining element. Starting index prevents duplicates. Total: 2^n subsets.',
  tags: ['backtracking', 'array', 'bit manipulation', 'recursion'],

  code: {
    pseudocode: `function subsets(nums):
  results = []
  function backtrack(start, current):
    results.append(copy of current)  // every state is a valid subset
    for i in start..len(nums)-1:
      current.append(nums[i])
      backtrack(i+1, current)
      current.pop()
  backtrack(0, [])
  return results`,
    python: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def bt(start, cur):
        res.append(cur[:])
        for i in range(start, len(nums)):
            cur.append(nums[i])
            bt(i + 1, cur)
            cur.pop()
    bt(0, [])
    return res`,
    javascript: `function subsets(nums) {
  const res = [];
  function bt(start, cur) {
    res.push([...cur]);
    for (let i = start; i < nums.length; i++) {
      cur.push(nums[i]);
      bt(i + 1, cur);
      cur.pop();
    }
  }
  bt(0, []);
  return res;
}`,
    java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}
private void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> res) {
    res.add(new ArrayList<>(cur));
    for (int i = start; i < nums.length; i++) {
        cur.add(nums[i]);
        backtrack(nums, i + 1, cur, res);
        cur.remove(cur.size() - 1);
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
      helperText: 'Unique integers to generate subsets for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const results: number[][] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nums,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Generate all subsets (power set) of [${nums.join(', ')}]. Total: 2^${nums.length} = ${Math.pow(2, nums.length)} subsets. Every state in backtracking is recorded.`,
      variables: { nums, totalSubsets: Math.pow(2, nums.length) },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    function backtrack(start: number, current: number[]) {
      results.push([...current]);

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      nums.forEach((v, i) => {
        if (current.includes(v) && nums.indexOf(v) < start) { h[i] = 'visited'; }
        l[i] = String(v);
      });

      if (steps.length < 40) {
        steps.push({
          line: 2,
          explanation: `Record subset #${results.length}: [${current.length > 0 ? current.join(', ') : 'empty'}]. ${results.length === 1 ? 'Empty set is always included.' : ''}`,
          variables: { subset: [...current], totalRecorded: results.length },
          visualization: makeViz(
            Object.fromEntries(nums.map((v, i) => [i, current.indexOf(v) >= 0 ? 'found' : 'default'])),
            l
          ),
        });
      }

      for (let i = start; i < nums.length; i++) {
        current.push(nums[i]);

        if (steps.length < 35) {
          const addH: Record<number, string> = {};
          const addL: Record<number, string> = {};
          nums.forEach((v, j) => {
            if (j < start || (j !== i && current.slice(0, -1).includes(v))) { addH[j] = 'visited'; }
            else if (j === i) { addH[j] = 'active'; }
            addL[j] = String(v);
          });
          steps.push({
            line: 3,
            explanation: `Extend: add nums[${i}]=${nums[i]}. Current subset: [${current.join(', ')}]. Recurse to add more elements starting from index ${i + 1}.`,
            variables: { added: nums[i], index: i, currentSubset: [...current] },
            visualization: makeViz(addH, addL),
          });
        }

        backtrack(i + 1, current);
        current.pop();

        if (steps.length < 40) {
          const popH: Record<number, string> = {};
          nums.forEach((_, j) => { if (current.indexOf(nums[j]) >= 0) popH[j] = 'visited'; });
          popH[i] = 'pointer';
          steps.push({
            line: 5,
            explanation: `Backtrack: remove nums[${i}]=${nums[i]}. Current: [${current.length > 0 ? current.join(', ') : 'empty'}]. Try next element.`,
            variables: { removed: nums[i], currentSubset: [...current] },
            visualization: makeViz(popH, Object.fromEntries(nums.map((v, j) => [j, String(v)]))),
          });
        }
      }
    }

    backtrack(0, []);

    steps.push({
      line: 7,
      explanation: `All ${results.length} subsets generated: ${results.map(s => '[' + (s.length > 0 ? s.join(',') : '') + ']').join(', ')}.`,
      variables: { totalSubsets: results.length, allSubsets: results },
      visualization: makeViz({}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    return steps;
  },
};

export default subsetsBacktrack;
