import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const plusOne: AlgorithmDefinition = {
  id: 'plus-one',
  title: 'Plus One',
  leetcodeNumber: 66,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given a number represented as an array of digits, increment it by one and return the result as an array. Traverse from the rightmost digit: if it is less than 9, increment and return. Otherwise set it to 0 and carry over. If all digits were 9, prepend a 1.',
  tags: ['Array', 'Math'],
  code: {
    pseudocode: `function plusOne(digits):
  for i from len-1 down to 0:
    if digits[i] < 9:
      digits[i] += 1
      return digits
    digits[i] = 0
  return [1] + digits`,
    python: `def plusOne(digits):
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits`,
    javascript: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
}`,
    java: `public int[] plusOne(int[] digits) {
    for (int i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    int[] result = new int[digits.length + 1];
    result[0] = 1;
    return result;
}`,
  },
  defaultInput: { digits: [1, 2, 9] },
  inputFields: [
    {
      name: 'digits',
      label: 'Digits Array',
      type: 'array',
      defaultValue: [1, 2, 9],
      placeholder: '1,2,9',
      helperText: 'Array of digits representing a non-negative integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const digits = [...(input.digits as number[])];
    const steps: AlgorithmStep[] = [];
    const n = digits.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr: number[],
      action: string,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Plus One',
        entries: [
          { key: 'Number', value: arr.join('') },
          { key: 'Action', value: action },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Add 1 to the number ${digits.join('')}. Traverse from the rightmost digit, carrying over as needed.`,
      variables: { digits: [...digits] },
      visualization: makeViz({}, {}, digits, 'Initial'),
    });

    for (let i = n - 1; i >= 0; i--) {
      if (digits[i] < 9) {
        steps.push({
          line: 3,
          explanation: `digits[${i}] = ${digits[i]} < 9. Increment it to ${digits[i] + 1}. No carry needed — return result.`,
          variables: { i, 'digits[i]': digits[i] },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: 'curr' }, digits, `Check digit ${i}`),
        });

        digits[i]++;

        steps.push({
          line: 4,
          explanation: `digits[${i}] incremented to ${digits[i]}. Result: [${digits.join(', ')}].`,
          variables: { i, 'digits[i]': digits[i], result: [...digits] },
          visualization: makeViz(
            Object.fromEntries(digits.map((_, k) => [k, k === i ? 'found' : 'sorted'])),
            { [i]: `+1` },
            digits,
            'Done',
          ),
        });

        return steps;
      }

      steps.push({
        line: 5,
        explanation: `digits[${i}] = ${digits[i]} = 9. Set to 0 and carry the 1 to the left.`,
        variables: { i, 'digits[i]': digits[i] },
        visualization: makeViz({ [i]: 'swapping' }, { [i]: 'carry' }, digits, `Set [${i}]=0, carry`),
      });

      digits[i] = 0;
    }

    // All digits were 9
    const result = [1, ...digits];

    steps.push({
      line: 6,
      explanation: `All digits were 9. Prepend 1 to get [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(result.map((_, k) => [k, k === 0 ? 'active' : 'sorted'])),
        { 0: 'new' },
        result,
        'Prepend 1',
      ),
    });

    return steps;
  },
};

export default plusOne;
