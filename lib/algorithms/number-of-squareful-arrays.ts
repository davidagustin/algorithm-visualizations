import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSquarefulArrays: AlgorithmDefinition = {
  id: 'number-of-squareful-arrays',
  title: 'Number of Squareful Arrays',
  leetcodeNumber: 996,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'An array is squareful if the sum of every pair of adjacent elements is a perfect square. Given an integer array nums, return the number of permutations of nums that are squareful. Use backtracking with duplicate pruning: sort first, skip duplicates at the same position level.',
  tags: ['backtracking', 'math', 'permutation', 'recursion'],

  code: {
    pseudocode: `function numSquarefulPerms(nums):
  sort(nums)
  count = 0
  used = array of false
  function isPerfectSquare(n):
    s = floor(sqrt(n))
    return s*s == n
  function backtrack(path):
    if len(path) == len(nums): count += 1; return
    for i in 0..len(nums)-1:
      if used[i]: continue
      if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue
      if path and not isPerfectSquare(path[-1] + nums[i]): continue
      used[i] = true; path.append(nums[i])
      backtrack(path)
      used[i] = false; path.pop()
  backtrack([])
  return count`,
    python: `def numSquarefulPerms(nums: list[int]) -> int:
    nums.sort()
    n, count, used = len(nums), 0, [False] * len(nums)
    def isSquare(x): return int(x**0.5)**2 == x
    def bt(path):
        nonlocal count
        if len(path) == n: count += 1; return
        for i in range(n):
            if used[i]: continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue
            if path and not isSquare(path[-1] + nums[i]): continue
            used[i] = True; path.append(nums[i])
            bt(path)
            used[i] = False; path.pop()
    bt([])
    return count`,
    javascript: `function numSquarefulPerms(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length, used = new Array(n).fill(false);
  const isSquare = x => Math.sqrt(x) === Math.floor(Math.sqrt(x));
  let count = 0;
  function bt(path) {
    if (path.length === n) { count++; return; }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
      if (path.length && !isSquare(path[path.length-1] + nums[i])) continue;
      used[i] = true; path.push(nums[i]);
      bt(path);
      used[i] = false; path.pop();
    }
  }
  bt([]);
  return count;
}`,
    java: `public int numSquarefulPerms(int[] nums) {
    Arrays.sort(nums);
    boolean[] used = new boolean[nums.length];
    int[] count = {0};
    backtrack(nums, used, new ArrayList<>(), count);
    return count[0];
}
private boolean isSquare(int n) { int s = (int)Math.sqrt(n); return s*s == n; }
private void backtrack(int[] nums, boolean[] used, List<Integer> path, int[] count) {
    if (path.size() == nums.length) { count[0]++; return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i] || (i > 0 && nums[i] == nums[i-1] && !used[i-1])) continue;
        if (!path.isEmpty() && !isSquare(path.get(path.size()-1) + nums[i])) continue;
        used[i] = true; path.add(nums[i]);
        backtrack(nums, used, path, count);
        used[i] = false; path.remove(path.size()-1);
    }
}`,
  },

  defaultInput: { nums: [1, 17, 8] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 17, 8],
      placeholder: '1,17,8',
      helperText: 'Array of integers to permute',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const used = new Array(n).fill(false);
    let count = 0;

    function isSquare(x: number): boolean {
      const s = Math.floor(Math.sqrt(x));
      return s * s === x;
    }

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count squareful permutations of [${nums.join(', ')}]. A permutation is squareful if every adjacent pair sums to a perfect square.`,
      variables: { nums, sorted: true },
      visualization: makeViz(nums, {}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    function backtrack(path: number[]) {
      if (path.length === n) {
        count++;
        const h: Record<number, string> = {};
        path.forEach((_, i) => { h[i] = 'found'; });
        steps.push({
          line: 8,
          explanation: `Squareful permutation #${count}: [${path.join(', ')}]. All adjacent sums are perfect squares.`,
          variables: { permutation: [...path], count },
          visualization: makeViz([...path], h, Object.fromEntries(path.map((v, i) => [i, String(v)]))),
        });
        return;
      }

      for (let i = 0; i < n; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
        if (path.length > 0 && !isSquare(path[path.length - 1] + nums[i])) {
          if (steps.length < 20) {
            steps.push({
              line: 11,
              explanation: `Skip nums[${i}]=${nums[i]}: ${path[path.length - 1]} + ${nums[i]} = ${path[path.length - 1] + nums[i]} is not a perfect square.`,
              variables: { last: path[path.length - 1], next: nums[i], sum: path[path.length - 1] + nums[i] },
              visualization: makeViz(nums, { [i]: 'mismatch' }, Object.fromEntries(nums.map((v, j) => [j, String(v)]))),
            });
          }
          continue;
        }

        used[i] = true;
        path.push(nums[i]);

        if (steps.length < 25) {
          const h: Record<number, string> = {};
          path.forEach((_, pi) => { h[pi] = pi === path.length - 1 ? 'active' : 'visited'; });
          const sum = path.length > 1 ? path[path.length - 2] + path[path.length - 1] : 0;
          steps.push({
            line: 12,
            explanation: `Place ${nums[i]} at position ${path.length - 1}. ${path.length > 1 ? `Sum ${path[path.length - 2]} + ${nums[i]} = ${sum} = ${Math.floor(Math.sqrt(sum))}^2.` : 'First element.'}`,
            variables: { placed: nums[i], position: path.length - 1, path: [...path] },
            visualization: makeViz([...path], h, Object.fromEntries(path.map((v, pi) => [pi, String(v)]))),
          });
        }

        backtrack(path);
        used[i] = false;
        path.pop();
      }
    }

    backtrack([]);

    steps.push({
      line: 18,
      explanation: `Total squareful permutations: ${count}.`,
      variables: { result: count },
      visualization: makeViz(nums, {}, Object.fromEntries(nums.map((v, i) => [i, String(v)]))),
    });

    return steps;
  },
};

export default numberOfSquarefulArrays;
