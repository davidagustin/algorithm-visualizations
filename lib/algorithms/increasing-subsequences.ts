import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const increasingSubsequences: AlgorithmDefinition = {
  id: 'increasing-subsequences',
  title: 'Non-decreasing Subsequences',
  leetcodeNumber: 491,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an integer array, return all the different possible non-decreasing subsequences of the array with at least two elements. Uses backtracking with a set at each recursion level to avoid duplicates without sorting the array (since sorting would change the structure).',
  tags: ['backtracking', 'array', 'hash set', 'recursion', 'subsequence'],

  code: {
    pseudocode: `function findSubsequences(nums):
  result = []
  backtrack(nums, 0, [], result)
  return result

function backtrack(nums, start, current, result):
  if length(current) >= 2:
    result.push(copy of current)
  seen = set()
  for i from start to len(nums)-1:
    if nums[i] in seen: continue (skip duplicate at this level)
    if current is empty or nums[i] >= current[-1]:
      seen.add(nums[i])
      current.push(nums[i])
      backtrack(nums, i+1, current, result)
      current.pop()`,

    python: `def findSubsequences(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start, current):
        if len(current) >= 2:
            result.append(list(current))
        seen = set()
        for i in range(start, len(nums)):
            if nums[i] in seen:
                continue
            if not current or nums[i] >= current[-1]:
                seen.add(nums[i])
                current.append(nums[i])
                backtrack(i + 1, current)
                current.pop()
    backtrack(0, [])
    return result`,

    javascript: `function findSubsequences(nums) {
  const result = [];
  function backtrack(start, current) {
    if (current.length >= 2) result.push([...current]);
    const seen = new Set();
    for (let i = start; i < nums.length; i++) {
      if (seen.has(nums[i])) continue;
      if (!current.length || nums[i] >= current[current.length - 1]) {
        seen.add(nums[i]);
        current.push(nums[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }
  }
  backtrack(0, []);
  return result;
}`,

    java: `public List<List<Integer>> findSubsequences(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}
private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    if (current.size() >= 2) result.add(new ArrayList<>(current));
    Set<Integer> seen = new HashSet<>();
    for (int i = start; i < nums.length; i++) {
        if (seen.contains(nums[i])) continue;
        if (current.isEmpty() || nums[i] >= current.get(current.size() - 1)) {
            seen.add(nums[i]);
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }
}`,
  },

  defaultInput: {
    nums: [4, 6, 7, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 6, 7, 7],
      placeholder: '4,6,7,7',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Finding all non-decreasing subsequences of [${nums.join(', ')}] with at least 2 elements. Cannot sort - must track duplicates per level.`,
      variables: { nums, minLength: 2 },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: nums.reduce((acc, _, i) => ({ ...acc, [i]: `${nums[i]}` }), {} as Record<number, string>),
      },
    });

    function backtrack(start: number, current: number[]) {
      if (current.length >= 2) {
        result.push([...current]);
        steps.push({
          line: 7,
          explanation: `Valid subsequence: [${current.join(', ')}]. Non-decreasing and length >= 2. Total: ${result.length}.`,
          variables: { subsequence: [...current], totalFound: result.length },
          visualization: {
            type: 'array',
            array: nums,
            highlights: nums.reduce((acc, v, i) => ({
              ...acc,
              [i]: current.includes(v) ? 'found' : 'default',
            }), {}),
            labels: nums.reduce((acc, _, i) => ({ ...acc, [i]: `${nums[i]}` }), {} as Record<number, string>),
          },
        });
      }

      const seen = new Set<number>();

      for (let i = start; i < nums.length; i++) {
        if (seen.has(nums[i])) {
          steps.push({
            line: 10,
            explanation: `Skip nums[${i}]=${nums[i]}: already used at this recursion level. Avoids duplicate subsequences.`,
            variables: { index: i, value: nums[i], reason: 'duplicate at level', seen: Array.from(seen) },
            visualization: {
              type: 'array',
              array: nums,
              highlights: { [i]: 'mismatch' },
              labels: nums.reduce((acc, _, j) => ({ ...acc, [j]: `${nums[j]}` }), {} as Record<number, string>),
            },
          });
          continue;
        }

        if (current.length === 0 || nums[i] >= current[current.length - 1]) {
          seen.add(nums[i]);
          current.push(nums[i]);

          steps.push({
            line: 12,
            explanation: `Add nums[${i}]=${nums[i]} to current [${current.slice(0,-1).join(', ')}]. Non-decreasing condition met (${nums[i]} >= ${current[current.length - 2] ?? '-inf'}).`,
            variables: { index: i, added: nums[i], current: [...current], start },
            visualization: {
              type: 'array',
              array: nums,
              highlights: { [i]: 'active' },
              labels: nums.reduce((acc, _, j) => ({ ...acc, [j]: `${nums[j]}` }), {} as Record<number, string>),
            },
          });

          backtrack(i + 1, current);
          current.pop();
        } else {
          steps.push({
            line: 11,
            explanation: `Skip nums[${i}]=${nums[i]}: less than last element in path (${current[current.length - 1]}). Would break non-decreasing order.`,
            variables: { index: i, value: nums[i], lastInPath: current[current.length - 1] },
            visualization: {
              type: 'array',
              array: nums,
              highlights: { [i]: 'comparing' },
              labels: nums.reduce((acc, _, j) => ({ ...acc, [j]: `${nums[j]}` }), {} as Record<number, string>),
            },
          });
        }
      }
    }

    backtrack(0, []);

    steps.push({
      line: 4,
      explanation: `Found ${result.length} unique non-decreasing subsequences: [${result.map(s => `[${s.join(',')}]`).join(', ')}]`,
      variables: { total: result.length, result },
      visualization: {
        type: 'array',
        array: nums,
        highlights: nums.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: { 0: `${result.length} found` },
      },
    });

    return steps;
  },
};

export default increasingSubsequences;
