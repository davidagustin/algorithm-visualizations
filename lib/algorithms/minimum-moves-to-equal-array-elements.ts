import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumMovesToEqualArrayElements: AlgorithmDefinition = {
  id: 'minimum-moves-to-equal-array-elements',
  title: 'Minimum Moves to Equal Array Elements',
  leetcodeNumber: 453,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an integer array, in one move you increment n-1 elements by 1 (equivalently, decrement one element by 1). Find the minimum number of moves to make all elements equal. The answer is the sum of all elements minus n times the minimum element, because each move is equivalent to decreasing one element by 1.',
  tags: ['array', 'math'],

  code: {
    pseudocode: `function minMoves(nums):
  minVal = min(nums)
  moves = 0
  for x in nums:
    moves += x - minVal
  return moves`,
    python: `def minMoves(nums):
    min_val = min(nums)
    return sum(x - min_val for x in nums)`,
    javascript: `function minMoves(nums) {
  const minVal = Math.min(...nums);
  return nums.reduce((acc, x) => acc + x - minVal, 0);
}`,
    java: `public int minMoves(int[] nums) {
    int minVal = Arrays.stream(nums).min().getAsInt();
    int moves = 0;
    for (int x : nums) moves += x - minVal;
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
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const minVal = Math.min(...nums);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum value in array: ${minVal}. Incrementing n-1 elements by 1 is the same as decrementing one element by 1 toward the minimum.`,
      variables: { minVal },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v === minVal ? 'found' : 'default'])),
        {}
      ),
    });

    let moves = 0;
    for (let i = 0; i < nums.length; i++) {
      const contribution = nums[i] - minVal;
      moves += contribution;
      steps.push({
        line: 4,
        explanation: `nums[${i}] = ${nums[i]}. Steps to reduce to min: ${nums[i]} - ${minVal} = ${contribution}. Total moves so far: ${moves}.`,
        variables: { index: i, value: nums[i], minVal, contribution, totalMoves: moves },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `-${contribution}` }
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Minimum moves to make all elements equal: ${moves}. Each element needs to decrease to the minimum value.`,
      variables: { result: moves, targetValue: minVal },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default minimumMovesToEqualArrayElements;
