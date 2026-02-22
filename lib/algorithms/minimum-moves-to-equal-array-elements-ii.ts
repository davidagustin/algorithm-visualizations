import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumMovesToEqualArrayElementsIi: AlgorithmDefinition = {
  id: 'minimum-moves-to-equal-array-elements-ii',
  title: 'Minimum Moves to Equal Array Elements II',
  leetcodeNumber: 462,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an integer array, in one move you increment or decrement one element by 1. Find the minimum number of moves to make all elements equal. The optimal target is the median of the array. Sort the array, find the median, then sum the absolute differences of each element from the median.',
  tags: ['array', 'math', 'sorting', 'median'],

  code: {
    pseudocode: `function minMoves2(nums):
  sort(nums)
  median = nums[len(nums) // 2]
  moves = 0
  for x in nums:
    moves += abs(x - median)
  return moves`,
    python: `def minMoves2(nums):
    nums.sort()
    median = nums[len(nums) // 2]
    return sum(abs(x - median) for x in nums)`,
    javascript: `function minMoves2(nums) {
  nums.sort((a, b) => a - b);
  const median = nums[Math.floor(nums.length / 2)];
  return nums.reduce((acc, x) => acc + Math.abs(x - median), 0);
}`,
    java: `public int minMoves2(int[] nums) {
    Arrays.sort(nums);
    int median = nums[nums.length / 2];
    int moves = 0;
    for (int x : nums) moves += Math.abs(x - median);
    return moves;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsRaw = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Original array: [${numsRaw.join(', ')}]. Sort to find the median.`,
      variables: { array: numsRaw.join(', ') },
      visualization: makeViz(numsRaw, {}, {}),
    });

    const sorted = [...numsRaw].sort((a, b) => a - b);
    steps.push({
      line: 2,
      explanation: `Sorted array: [${sorted.join(', ')}]. The optimal meeting point minimizing total distance is the median.`,
      variables: { sorted: sorted.join(', ') },
      visualization: makeViz(sorted, Object.fromEntries(sorted.map((_, i) => [i, 'sorted'])), {}),
    });

    const medIdx = Math.floor(sorted.length / 2);
    const median = sorted[medIdx];
    steps.push({
      line: 3,
      explanation: `Median is at index ${medIdx}: value ${median}. All elements will move toward ${median}.`,
      variables: { medianIndex: medIdx, median },
      visualization: makeViz(sorted, { [medIdx]: 'found' }, { [medIdx]: 'median' }),
    });

    let moves = 0;
    for (let i = 0; i < sorted.length; i++) {
      const diff = Math.abs(sorted[i] - median);
      moves += diff;
      steps.push({
        line: 5,
        explanation: `sorted[${i}] = ${sorted[i]}. |${sorted[i]} - ${median}| = ${diff}. Total moves: ${moves}.`,
        variables: { index: i, value: sorted[i], median, diff, totalMoves: moves },
        visualization: makeViz(sorted, { [i]: 'active', [medIdx]: 'found' }, { [i]: `|${diff}|`, [medIdx]: 'median' }),
      });
    }

    steps.push({
      line: 6,
      explanation: `Minimum moves to make all elements equal using median as target: ${moves}.`,
      variables: { result: moves, median },
      visualization: makeViz(sorted, Object.fromEntries(sorted.map((_, i) => [i, 'sorted'])), { [medIdx]: 'median' }),
    });

    return steps;
  },
};

export default minimumMovesToEqualArrayElementsIi;
