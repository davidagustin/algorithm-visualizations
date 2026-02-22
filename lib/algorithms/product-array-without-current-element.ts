import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const productArrayWithoutCurrentElement: AlgorithmDefinition = {
  id: 'product-array-without-current-element',
  title: 'Product Array Without Current Element',
  leetcodeNumber: 238,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given an integer array nums, return an array answer where answer[i] is the product of all elements except nums[i], without using division. Use two passes: first build left products (product of all elements to the left), then multiply in right products (product of all elements to the right). O(n) time, O(1) extra space (output array not counted).',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function productExceptSelf(nums):
  n = length(nums)
  answer = array of size n
  answer[0] = 1
  for i from 1 to n-1:
    answer[i] = answer[i-1] * nums[i-1]
  rightProduct = 1
  for i from n-2 down to 0:
    rightProduct *= nums[i+1]
    answer[i] *= rightProduct
  return answer`,
    python: `def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]
    right_product = 1
    for i in range(n - 2, -1, -1):
        right_product *= nums[i + 1]
        answer[i] *= right_product
    return answer`,
    javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    answer[i] = answer[i - 1] * nums[i - 1];
  }
  let rightProduct = 1;
  for (let i = n - 2; i >= 0; i--) {
    rightProduct *= nums[i + 1];
    answer[i] *= rightProduct;
  }
  return answer;
}`,
    java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = answer[i - 1] * nums[i - 1];
    }
    int rightProduct = 1;
    for (int i = n - 2; i >= 0; i--) {
        rightProduct *= nums[i + 1];
        answer[i] *= rightProduct;
    }
    return answer;
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
    const answer = new Array(n).fill(1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...answer],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'State', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Compute product of all elements except self for [${nums.join(', ')}]. Two passes: left products, then right products.`,
      variables: { nums },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `nums[${i}]=${v}`])),
      },
    });

    // Left pass
    steps.push({
      line: 4,
      explanation: `Pass 1 (left products): answer[0] = 1. For each i, answer[i] = product of all nums to the left.`,
      variables: { answer: [...answer], pass: 'left' },
      visualization: makeViz({ 0: 'active' }, { 0: '1' }, [{ key: 'Pass', value: 'Left products' }]),
    });

    for (let i = 1; i < n; i++) {
      answer[i] = answer[i - 1] * nums[i - 1];

      steps.push({
        line: 6,
        explanation: `answer[${i}] = answer[${i - 1}](${answer[i - 1]}) * nums[${i - 1}](${nums[i - 1]}) = ${answer[i]}. This is the product of nums[0..${i - 1}].`,
        variables: { i, 'answer[i-1]': answer[i - 1], 'nums[i-1]': nums[i - 1], 'answer[i]': answer[i] },
        visualization: makeViz(
          { [i - 1]: 'comparing', [i]: 'active' },
          Object.fromEntries(answer.map((v, j) => [j, String(v)])),
          [{ key: 'Pass', value: 'Left products' }],
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `Left pass complete. answer = [${answer.join(', ')}]. Each entry has the product of all elements to its left.`,
      variables: { answer: [...answer] },
      visualization: makeViz(
        Object.fromEntries(answer.map((_, i) => [i, 'found'])),
        Object.fromEntries(answer.map((v, i) => [i, String(v)])),
        [{ key: 'Pass', value: 'Left complete' }],
      ),
    });

    // Right pass
    let rightProduct = 1;

    steps.push({
      line: 8,
      explanation: `Pass 2 (right products): rightProduct = 1. Traverse from right to left, multiplying in right products.`,
      variables: { rightProduct, pass: 'right' },
      visualization: makeViz(
        {},
        Object.fromEntries(answer.map((v, i) => [i, String(v)])),
        [{ key: 'Pass', value: 'Right products' }, { key: 'rightProduct', value: '1' }],
      ),
    });

    for (let i = n - 2; i >= 0; i--) {
      rightProduct *= nums[i + 1];
      answer[i] *= rightProduct;

      steps.push({
        line: 10,
        explanation: `rightProduct *= nums[${i + 1}](${nums[i + 1]}) = ${rightProduct}. answer[${i}] *= ${rightProduct} = ${answer[i]}.`,
        variables: { i, rightProduct, 'answer[i]': answer[i] },
        visualization: makeViz(
          { [i]: 'active', [i + 1]: 'comparing' },
          Object.fromEntries(answer.map((v, j) => [j, String(v)])),
          [{ key: 'rightProduct', value: String(rightProduct) }],
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `Done! answer = [${answer.join(', ')}]. Each answer[i] is the product of all elements except nums[i].`,
      variables: { result: [...answer] },
      visualization: makeViz(
        Object.fromEntries(answer.map((_, i) => [i, 'found'])),
        Object.fromEntries(answer.map((v, i) => [i, `${v}`])),
        [{ key: 'Result', value: `[${answer.join(', ')}]` }],
      ),
    });

    return steps;
  },
};

export default productArrayWithoutCurrentElement;
