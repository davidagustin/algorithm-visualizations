import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const permutationsII: AlgorithmDefinition = {
  id: 'permutations-ii',
  title: 'Permutations II',
  leetcodeNumber: 47,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of numbers that may contain duplicates, return all unique permutations. Sort the array first, then use a "used" boolean array during backtracking. To avoid duplicate permutations, skip a number if it equals the previous number and the previous number was not used in the current path.',
  tags: ['Backtracking', 'Recursion', 'Array'],
  code: {
    pseudocode: `function permuteUnique(nums):
  sort(nums)
  result = []
  used = array of false with length n
  backtrack(nums, used, [], result)
  return result

function backtrack(nums, used, current, result):
  if current.length == nums.length:
    result.append(copy of current)
    return
  for i from 0 to nums.length-1:
    if used[i]: continue
    if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue
    used[i] = true
    current.append(nums[i])
    backtrack(nums, used, current, result)
    used[i] = false
    current.pop()`,
    python: `def permuteUnique(nums):
    nums.sort()
    result = []
    used = [False] * len(nums)
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        for i in range(len(nums)):
            if used[i]: continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            used[i] = False
            current.pop()
    backtrack([])
    return result`,
    javascript: `function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const result = [], used = new Array(nums.length).fill(false);
  function backtrack(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
      used[i] = true;
      current.push(nums[i]);
      backtrack(current);
      used[i] = false;
      current.pop();
    }
  }
  backtrack([]);
  return result;
}`,
    java: `public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), result);
    return result;
}
void backtrack(int[] nums, boolean[] used,
               List<Integer> current, List<List<Integer>> result) {
    if (current.size() == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
        used[i] = true;
        current.add(nums[i]);
        backtrack(nums, used, current, result);
        used[i] = false;
        current.remove(current.size() - 1);
    }
}`,
  },
  defaultInput: { nums: [1, 1, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 1, 2],
      placeholder: 'e.g. 1,1,2',
      helperText: 'Array of integers (may contain duplicates)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice().sort((a, b) => a - b);
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const current: number[] = [];
    const used: boolean[] = new Array(n).fill(false);

    function makeViz(activeIdx: number | null, skipIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = String(nums[i]);
        if (used[i]) highlights[i] = 'visited';
        else if (i === activeIdx) highlights[i] = 'active';
        else if (i === skipIdx) highlights[i] = 'mismatch';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: nums.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Permutation State',
          entries: [
            { key: 'Current', value: `[${current.join(', ')}]` },
            { key: 'Used', value: `[${used.map(u => u ? '1' : '0').join(', ')}]` },
            { key: 'Unique perms', value: String(result.length) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort nums: [${nums.join(', ')}]. Generate all unique permutations. Skip same-value elements at same position to avoid duplicates.`,
      variables: { nums: nums.slice() },
      visualization: makeViz(null, null),
    });

    function backtrack(): void {
      if (current.length === n) {
        result.push(current.slice());
        steps.push({
          line: 9,
          explanation: `Permutation complete: [${current.join(', ')}]. Total unique: ${result.length}.`,
          variables: { permutation: current.slice(), total: result.length },
          visualization: {
            type: 'array',
            array: nums.slice(),
            highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
            auxData: {
              label: 'Permutation Found!',
              entries: [
                { key: 'Permutation', value: `[${current.join(', ')}]` },
                { key: 'Total unique', value: String(result.length) },
              ],
            },
          },
        });
        return;
      }

      for (let i = 0; i < n; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
          steps.push({
            line: 13,
            explanation: `Skip nums[${i}]=${nums[i]}: same as nums[${i - 1}]=${nums[i - 1]} and used[${i - 1}]=false. Avoids duplicate permutation.`,
            variables: { i, val: nums[i] },
            visualization: makeViz(null, i),
          });
          continue;
        }

        used[i] = true;
        current.push(nums[i]);
        steps.push({
          line: 14,
          explanation: `Pick nums[${i}]=${nums[i]}. Current: [${current.join(', ')}]. Mark used[${i}]=true.`,
          variables: { i, val: nums[i], current: current.slice() },
          visualization: makeViz(i, null),
        });

        backtrack();

        used[i] = false;
        current.pop();
        steps.push({
          line: 17,
          explanation: `Backtrack: unuse nums[${i}]=${nums[i]}. Current: [${current.join(', ')}].`,
          variables: { i, val: nums[i], current: current.slice() },
          visualization: makeViz(null, null),
        });
      }
    }

    backtrack();

    steps.push({
      line: 3,
      explanation: `All done. Found ${result.length} unique permutation(s) of [${nums.join(', ')}].`,
      variables: { total: result.length },
      visualization: {
        type: 'array',
        array: nums.slice(),
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        auxData: {
          label: `All ${result.length} Unique Permutations`,
          entries: result.map((p, i) => ({ key: `#${i + 1}`, value: `[${p.join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default permutationsII;
