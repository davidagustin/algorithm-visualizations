import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subsetsWithDuplicates: AlgorithmDefinition = {
  id: 'subsets-with-duplicates',
  title: 'Subsets II',
  leetcodeNumber: 90,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an integer array that may contain duplicates, return all possible unique subsets (the power set). Sort the array first, then use backtracking. To avoid duplicate subsets, skip an element at a given recursion level if it equals the previous element and the previous element was not skipped.',
  tags: ['Backtracking', 'Recursion', 'Array'],
  code: {
    pseudocode: `function subsetsWithDup(nums):
  sort(nums)
  result = [[]]
  backtrack(nums, 0, [], result)
  return result

function backtrack(nums, start, current, result):
  for i from start to nums.length-1:
    if i > start and nums[i] == nums[i-1]: continue  // skip dup
    current.append(nums[i])
    result.append(copy of current)
    backtrack(nums, i+1, current, result)
    current.pop()`,
    python: `def subsetsWithDup(nums):
    nums.sort()
    result = [[]]
    def backtrack(start, current):
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i-1]:
                continue
            current.append(nums[i])
            result.append(current[:])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result`,
    javascript: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [[]];
  function backtrack(start, current) {
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      current.push(nums[i]);
      result.push([...current]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    java: `public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    result.add(new ArrayList<>());
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}
void backtrack(int[] nums, int start, List<Integer> current,
               List<List<Integer>> result) {
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i-1]) continue;
        current.add(nums[i]);
        result.add(new ArrayList<>(current));
        backtrack(nums, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}`,
  },
  defaultInput: { nums: [1, 2, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 2, 2],
      placeholder: 'e.g. 1,2,2',
      helperText: 'Array of integers (may contain duplicates)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice().sort((a, b) => a - b);
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [[]];
    const current: number[] = [];

    function makeViz(activeIdx: number | null, skipIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = String(nums[i]);
        if (i === activeIdx) highlights[i] = 'active';
        else if (i === skipIdx) highlights[i] = 'visited';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: nums.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Subset State',
          entries: [
            { key: 'Current subset', value: `[${current.join(', ')}]` },
            { key: 'Subsets found', value: String(result.length) },
            ...result.slice(-4).map((s, i) => ({ key: `  #${result.length - Math.min(4, result.length) + i + 1}`, value: `[${s.join(', ')}]` || '[]' })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort nums: [${nums.join(', ')}]. Generate all unique subsets. Start with empty subset [].`,
      variables: { nums: nums.slice() },
      visualization: makeViz(null, null),
    });

    function backtrack(start: number): void {
      for (let i = start; i < n; i++) {
        if (i > start && nums[i] === nums[i - 1]) {
          steps.push({
            line: 8,
            explanation: `Skip nums[${i}]=${nums[i]}: same as nums[${i - 1}]=${nums[i - 1]} at this level. Avoids duplicate subset.`,
            variables: { i, val: nums[i], reason: 'duplicate' },
            visualization: makeViz(null, i),
          });
          continue;
        }

        current.push(nums[i]);
        result.push(current.slice());

        steps.push({
          line: 9,
          explanation: `Add nums[${i}]=${nums[i]}. New subset [${current.join(', ')}] recorded. Total subsets: ${result.length}.`,
          variables: { i, val: nums[i], current: current.slice(), total: result.length },
          visualization: makeViz(i, null),
        });

        backtrack(i + 1);

        current.pop();
        steps.push({
          line: 11,
          explanation: `Backtrack: remove ${nums[i]}. Current: [${current.join(', ')}]. Continue at level ${start}.`,
          variables: { removed: nums[i], current: current.slice() },
          visualization: makeViz(null, null),
        });
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `All done. Found ${result.length} unique subset(s) of [${nums.join(', ')}].`,
      variables: { total: result.length },
      visualization: {
        type: 'array',
        array: nums.slice(),
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        auxData: {
          label: `All ${result.length} Unique Subsets`,
          entries: result.map((s, i) => ({ key: `#${i + 1}`, value: s.length === 0 ? '[]' : `[${s.join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default subsetsWithDuplicates;
