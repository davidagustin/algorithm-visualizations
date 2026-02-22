import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const productOfArrayExceptSelfII: AlgorithmDefinition = {
  id: 'product-of-array-except-self-ii',
  title: 'Product of Array Except Self II',
  leetcodeNumber: 238,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Return an array where output[i] is the product of all elements except nums[i], without using division and in O(n). Use a left-prefix product pass then a right-suffix product pass. Each output[i] = leftProduct[i] * rightProduct[i].',
  tags: ['Prefix Sum', 'Array', 'Product'],
  code: {
    pseudocode: `function productExceptSelf(nums):
  n = len(nums)
  output = [1] * n
  # Left pass: output[i] = product of nums[0..i-1]
  left = 1
  for i from 0 to n-1:
    output[i] = left
    left *= nums[i]
  # Right pass: multiply by product of nums[i+1..n-1]
  right = 1
  for i from n-1 to 0:
    output[i] *= right
    right *= nums[i]
  return output`,
    python: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    output = [1] * n
    left = 1
    for i in range(n):
        output[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        output[i] *= right
        right *= nums[i]
    return output`,
    javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const output = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    output[i] = left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    output[i] *= right;
    right *= nums[i];
  }
  return output;
}`,
    java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] output = new int[n];
    Arrays.fill(output, 1);
    int left = 1;
    for (int i = 0; i < n; i++) { output[i] = left; left *= nums[i]; }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) { output[i] *= right; right *= nums[i]; }
    return output;
}`,
  },
  defaultInput: { nums: [1, 2, 3, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const output: number[] = new Array(n).fill(1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr?: number[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr ?? [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute product of array except self for [${nums.join(', ')}]. Two-pass approach: left prefix then right suffix.`,
      variables: { nums },
      visualization: makeViz({}, {}),
    });

    let left = 1;
    for (let i = 0; i < n; i++) {
      output[i] = left;
      steps.push({
        line: 6,
        explanation: `Left pass: output[${i}] = left product = ${left} (product of nums[0..${i - 1}]).`,
        variables: { i, left, 'output[i]': output[i] },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `L=${left}` },
          [...output],
        ),
      });
      left *= nums[i];
    }

    steps.push({
      line: 8,
      explanation: `After left pass: output = [${output.join(', ')}]. Now apply right suffix products.`,
      variables: { output: [...output] },
      visualization: makeViz(
        Object.fromEntries(output.map((_, i) => [i, 'visiting'])),
        {},
        [...output],
      ),
    });

    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
      output[i] *= right;
      steps.push({
        line: 11,
        explanation: `Right pass: output[${i}] *= right(${right}) → output[${i}] = ${output[i]}.`,
        variables: { i, right, 'output[i]': output[i] },
        visualization: makeViz(
          { [i]: 'found' },
          { [i]: `=${output[i]}` },
          [...output],
        ),
      });
      right *= nums[i];
    }

    steps.push({
      line: 13,
      explanation: `Done. output = [${output.join(', ')}].`,
      variables: { result: output },
      visualization: makeViz(
        Object.fromEntries(output.map((_, i) => [i, 'found'])),
        Object.fromEntries(output.map((v, i) => [i, String(v)])),
        [...output],
      ),
    });

    return steps;
  },
};

export default productOfArrayExceptSelfII;
