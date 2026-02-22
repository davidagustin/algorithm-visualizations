import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const summaryRangesII: AlgorithmDefinition = {
  id: 'summary-ranges-ii',
  title: 'Summary Ranges II',
  leetcodeNumber: 228,
  difficulty: 'Easy',
  category: 'Interval',
  description:
    'Given a sorted unique integer array, return the smallest sorted list of ranges that cover all numbers. Consecutive numbers form a range "a->b"; single numbers produce "a". Iterate with a start pointer, advance end until gap, then record range. O(n) time.',
  tags: ['Intervals', 'Two Pointers', 'Array'],
  code: {
    pseudocode: `function summaryRanges(nums):
  result = []
  i = 0
  while i < n:
    start = nums[i]
    while i+1 < n and nums[i+1] == nums[i]+1:
      i++
    if nums[i] == start: result.push("start")
    else: result.push("start->nums[i]")
    i++
  return result`,
    python: `def summaryRanges(nums):
    res, i = [], 0
    while i < len(nums):
        start = nums[i]
        while i + 1 < len(nums) and nums[i+1] == nums[i] + 1:
            i += 1
        res.append(str(start) if nums[i] == start else f"{start}->{nums[i]}")
        i += 1
    return res`,
    javascript: `function summaryRanges(nums) {
  const res = [];
  let i = 0;
  while (i < nums.length) {
    const start = nums[i];
    while (i + 1 < nums.length && nums[i+1] === nums[i] + 1) i++;
    res.push(nums[i] === start ? \`\${start}\` : \`\${start}->\${nums[i]}\`);
    i++;
  }
  return res;
}`,
    java: `public List<String> summaryRanges(int[] nums) {
    List<String> res = new ArrayList<>();
    int i = 0;
    while (i < nums.length) {
        int start = nums[i];
        while (i + 1 < nums.length && nums[i+1] == nums[i] + 1) i++;
        res.add(nums[i] == start ? String.valueOf(start) : start + "->" + nums[i]);
        i++;
    }
    return res;
}`,
  },
  defaultInput: { nums: [0, 1, 2, 4, 5, 7] },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Unique Numbers',
      type: 'array',
      defaultValue: [0, 1, 2, 4, 5, 7],
      placeholder: '[0,1,2,4,5,7]',
      helperText: 'Sorted array of unique integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Ranges', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1, explanation: `Input: [${nums.join(', ')}]. Build summary ranges.`,
      variables: { nums }, visualization: makeViz({}, {}) });

    const result: string[] = [];
    let i = 0;

    while (i < nums.length) {
      const start = nums[i];
      const startIdx = i;
      const hl: Record<number, string> = { [i]: 'active' };

      steps.push({ line: 4, explanation: `Range starts at nums[${i}]=${start}.`,
        variables: { i, start },
        visualization: makeViz(hl, { [i]: `start=${start}` },
          result.map((r, k) => ({ key: `R${k}`, value: r }))) });

      while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
        i++;
        hl[i] = 'comparing';
        steps.push({ line: 5, explanation: `nums[${i}]=${nums[i]} continues range. Extend.`,
          variables: { i, current: nums[i] },
          visualization: makeViz({ ...hl }, { [startIdx]: `s=${start}`, [i]: `e=${nums[i]}` },
            result.map((r, k) => ({ key: `R${k}`, value: r }))) });
      }

      const range = nums[i] === start ? `${start}` : `${start}->${nums[i]}`;
      result.push(range);
      for (let j = startIdx; j <= i; j++) hl[j] = 'found';

      steps.push({ line: 7, explanation: `Range complete: "${range}". Push to result.`,
        variables: { range, result: [...result] },
        visualization: makeViz(hl, {},
          result.map((r, k) => ({ key: `R${k}`, value: r }))) });
      i++;
    }

    const finalHl: Record<number, string> = {};
    nums.forEach((_, j) => { finalHl[j] = 'found'; });
    steps.push({ line: 9, explanation: `Done. Summary ranges: [${result.map(r => `"${r}"`).join(', ')}].`,
      variables: { result },
      visualization: makeViz(finalHl, {}, result.map((r, k) => ({ key: `R${k}`, value: r }))) });

    return steps;
  },
};

export default summaryRangesII;
