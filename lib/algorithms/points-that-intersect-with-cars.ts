import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pointsThatIntersectWithCars: AlgorithmDefinition = {
  id: 'points-that-intersect-with-cars',
  title: 'Points That Intersect With Cars',
  leetcodeNumber: 2848,
  difficulty: 'Easy',
  category: 'Interval',
  description:
    'Given cars on a number line (each occupying interval [start, end]), count distinct integer points covered by at least one car. Merge intervals then count total length. Sort by start, merge overlapping, sum (end-start+1) of each merged interval. O(n log n) time.',
  tags: ['Intervals', 'Sorting', 'Greedy'],
  code: {
    pseudocode: `function numberOfPoints(nums):
  sort nums by start
  merged = [nums[0]]
  for [s, e] in nums[1:]:
    if s <= merged.last.end:
      merged.last.end = max(merged.last.end, e)
    else:
      merged.push([s, e])
  return sum(e - s + 1 for [s, e] in merged)`,
    python: `def numberOfPoints(nums):
    nums.sort()
    merged = [nums[0][:]]
    for s, e in nums[1:]:
        if s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return sum(e - s + 1 for s, e in merged)`,
    javascript: `function numberOfPoints(nums) {
  nums.sort((a, b) => a[0] - b[0]);
  const merged = [nums[0].slice()];
  for (let i = 1; i < nums.length; i++) {
    const [s, e] = nums[i];
    const last = merged[merged.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged.reduce((acc, [s, e]) => acc + e - s + 1, 0);
}`,
    java: `public int numberOfPoints(List<List<Integer>> nums) {
    nums.sort((a, b) -> a.get(0) - b.get(0));
    int[][] arr = nums.stream().map(l -> new int[]{l.get(0),l.get(1)}).toArray(int[][]::new);
    List<int[]> merged = new ArrayList<>();
    merged.add(arr[0].clone());
    for (int i = 1; i < arr.length; i++) {
        int[] last = merged.get(merged.size()-1);
        if (arr[i][0] <= last[1]) last[1] = Math.max(last[1], arr[i][1]);
        else merged.add(arr[i].clone());
    }
    return merged.stream().mapToInt(iv -> iv[1]-iv[0]+1).sum();
}`,
  },
  defaultInput: { nums: [[3, 6], [1, 5], [4, 7]] },
  inputFields: [
    {
      name: 'nums',
      label: 'Car Intervals',
      type: 'array',
      defaultValue: [[3, 6], [1, 5], [4, 7]],
      placeholder: '[[3,6],[1,5],[4,7]]',
      helperText: 'Array of [start, end] car intervals on number line',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.nums as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[0] - b[0]);
    const flat = raw.flat();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Coverage', entries: auxEntries } } : {}),
    });

    steps.push({ line: 2, explanation: `Sort by start: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) }, visualization: makeViz({}, {}) });

    const merged: number[][] = [[raw[0][0], raw[0][1]]];
    steps.push({ line: 3, explanation: `Init merged with [${raw[0][0]},${raw[0][1]}].`,
      variables: { merged: merged.map(iv => [...iv]) },
      visualization: makeViz({ 0: 'found', 1: 'found' }, {},
        merged.map((iv, k) => ({ key: `M${k}`, value: `[${iv[0]},${iv[1]}]` }))) });

    for (let i = 1; i < raw.length; i++) {
      const [s, e] = raw[i];
      const ci = i * 2;
      const last = merged[merged.length - 1];
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; }

      steps.push({ line: 5,
        explanation: `[${s},${e}] vs last [${last[0]},${last[1]}]: ${s} <= ${last[1]}? ${s <= last[1]}.`,
        variables: { s, e, lastEnd: last[1] },
        visualization: makeViz(hl, { [ci]: `s=${s}` },
          merged.map((iv, k) => ({ key: `M${k}`, value: `[${iv[0]},${iv[1]}]` }))) });

      if (s <= last[1]) {
        last[1] = Math.max(last[1], e);
        steps.push({ line: 6, explanation: `Overlap. Extend to [${last[0]},${last[1]}].`,
          variables: { merged: merged.map(iv => [...iv]) },
          visualization: makeViz({ ...hl, [ci]: 'swapping', [ci + 1]: 'swapping' }, {},
            merged.map((iv, k) => ({ key: `M${k}`, value: `[${iv[0]},${iv[1]}]` }))) });
      } else {
        merged.push([s, e]);
        steps.push({ line: 8, explanation: `No overlap. New interval [${s},${e}].`,
          variables: { merged: merged.map(iv => [...iv]) },
          visualization: makeViz({ ...hl, [ci]: 'found', [ci + 1]: 'found' }, {},
            merged.map((iv, k) => ({ key: `M${k}`, value: `[${iv[0]},${iv[1]}]` }))) });
      }
    }

    const total = merged.reduce((acc, [s, e]) => acc + e - s + 1, 0);
    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 9, explanation: `Count covered points: ${merged.map(iv => `(${iv[1]}-${iv[0]}+1)=${iv[1]-iv[0]+1}`).join('+')} = ${total}.`,
      variables: { totalPoints: total },
      visualization: makeViz(finalHl, {}, [...merged.map((iv, k) => ({ key: `M${k}`, value: `[${iv[0]},${iv[1]}]` })),
        { key: 'Total', value: String(total) }]) });

    return steps;
  },
};

export default pointsThatIntersectWithCars;
