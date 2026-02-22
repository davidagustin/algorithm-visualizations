import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shuffleTheArray: AlgorithmDefinition = {
  id: 'shuffle-the-array',
  title: 'Shuffle the Array',
  leetcodeNumber: 1470,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an array nums of 2n elements in the form [x1, x2, ..., xn, y1, y2, ..., yn], return the array in the form [x1, y1, x2, y2, ..., xn, yn]. Interleave the first half and second half of the array by picking one element from each half alternately.',
  tags: ['array', 'interleave', 'simulation'],

  code: {
    pseudocode: `function shuffle(nums, n):
  result = []
  for i in 0..n-1:
    result.append(nums[i])
    result.append(nums[n+i])
  return result`,
    python: `def shuffle(nums, n):
    result = []
    for i in range(n):
        result.append(nums[i])
        result.append(nums[n + i])
    return result`,
    javascript: `function shuffle(nums, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(nums[i]);
    result.push(nums[n + i]);
  }
  return result;
}`,
    java: `public int[] shuffle(int[] nums, int n) {
    int[] result = new int[2 * n];
    for (int i = 0; i < n; i++) {
        result[2*i] = nums[i];
        result[2*i+1] = nums[n+i];
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 5, 1, 3, 4, 7],
    n: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array (2n elements)',
      type: 'array',
      defaultValue: [2, 5, 1, 3, 4, 7],
      placeholder: '2,5,1,3,4,7',
      helperText: 'Array of 2n elements split into two halves',
    },
    {
      name: 'n',
      label: 'n (half length)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Half the array length',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = (input.n as number) || Math.floor(nums.length / 2);
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Interleave first half [${nums.slice(0, n).join(', ')}] with second half [${nums.slice(n).join(', ')}].`,
      variables: { n, firstHalf: nums.slice(0, n).join(', '), secondHalf: nums.slice(n).join(', ') },
      visualization: makeViz(
        nums,
        {
          ...Object.fromEntries(nums.slice(0, n).map((_, i) => [i, 'active'])),
          ...Object.fromEntries(nums.slice(n).map((_, i) => [n + i, 'comparing'])),
        },
        { 0: 'x1', [n]: 'y1' }
      ),
    });

    for (let i = 0; i < n; i++) {
      const xi = nums[i];
      const yi = nums[n + i];

      result.push(xi);
      steps.push({
        line: 3,
        explanation: `Take x${i + 1} = nums[${i}] = ${xi} from first half. Append to result.`,
        variables: { i, xi, yi, resultLen: result.length },
        visualization: makeViz(
          nums,
          { [i]: 'found' },
          { [i]: `x${i + 1}` }
        ),
      });

      result.push(yi);
      steps.push({
        line: 4,
        explanation: `Take y${i + 1} = nums[${n + i}] = ${yi} from second half. Append to result. Result so far: [${result.join(', ')}].`,
        variables: { i, xi, yi, result: result.join(', ') },
        visualization: makeViz(
          [...result, ...new Array(2 * n - result.length).fill(0)],
          { [result.length - 2]: 'active', [result.length - 1]: 'active' },
          { [result.length - 2]: `x${i + 1}`, [result.length - 1]: `y${i + 1}` }
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Shuffled array: [${result.join(', ')}].`,
      variables: { result: result.join(', ') },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default shuffleTheArray;
