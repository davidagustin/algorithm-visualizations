import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validPerfectSquare: AlgorithmDefinition = {
  id: 'valid-perfect-square',
  title: 'Valid Perfect Square',
  leetcodeNumber: 367,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given a positive integer num, return true if it is a perfect square without using built-in square root functions. Binary search checks if any integer mid in [1, num] satisfies mid*mid == num. Eliminates half the search space each iteration.',
  tags: ['binary search', 'math'],

  code: {
    pseudocode: `function isPerfectSquare(num):
  left = 1
  right = num
  while left <= right:
    mid = (left + right) / 2
    square = mid * mid
    if square == num:
      return true
    else if square < num:
      left = mid + 1
    else:
      right = mid - 1
  return false`,

    python: `def isPerfectSquare(num: int) -> bool:
    left, right = 1, num
    while left <= right:
        mid = (left + right) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            left = mid + 1
        else:
            right = mid - 1
    return False`,

    javascript: `function isPerfectSquare(num) {
  let left = 1, right = num;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    else if (sq < num) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}`,

    java: `public boolean isPerfectSquare(int num) {
    long left = 1, right = num;
    while (left <= right) {
        long mid = (left + right) / 2;
        long sq = mid * mid;
        if (sq == num) return true;
        else if (sq < num) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}`,
  },

  defaultInput: {
    num: 16,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number',
      type: 'number',
      defaultValue: 16,
      placeholder: '16',
      helperText: 'Positive integer to check if it is a perfect square',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as number;
    const steps: AlgorithmStep[] = [];

    const maxSearch = Math.min(num, 25);
    const searchSpace = Array.from({ length: maxSearch }, (_, i) => i + 1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: searchSpace,
      highlights,
      labels,
    });

    let left = 1;
    let right = maxSearch;

    steps.push({
      line: 1,
      explanation: `Check if ${num} is a perfect square. Binary search on [1, ${maxSearch}].`,
      variables: { left, right, num },
      visualization: makeViz(
        { 0: 'pointer', [right - 1]: 'pointer' },
        { 0: 'L', [right - 1]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const square = mid * mid;

      steps.push({
        line: 4,
        explanation: `mid=${mid}, mid*mid=${square}. Compare with num=${num}.`,
        variables: { left, right, mid, square, num },
        visualization: makeViz(
          { [left - 1]: 'active', [right - 1]: 'active', [mid - 1]: 'comparing' },
          { [left - 1]: 'L', [right - 1]: 'R', [mid - 1]: `${mid}^2=${square}` }
        ),
      });

      if (square === num) {
        steps.push({
          line: 7,
          explanation: `${mid}*${mid}=${square} equals num=${num}. It is a perfect square! Return true.`,
          variables: { mid, square, result: true },
          visualization: makeViz(
            { [mid - 1]: 'found' },
            { [mid - 1]: `sqrt=${mid}` }
          ),
        });
        return steps;
      } else if (square < num) {
        steps.push({
          line: 9,
          explanation: `${square} < ${num}. Square root is larger. Move left to ${mid + 1}.`,
          variables: { left, right, mid, square, num },
          visualization: makeViz(
            { [mid - 1]: 'mismatch', [right - 1]: 'pointer' },
            { [mid - 1]: 'too small', [right - 1]: 'R' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 11,
          explanation: `${square} > ${num}. Square root is smaller. Move right to ${mid - 1}.`,
          variables: { left, right, mid, square, num },
          visualization: makeViz(
            { [left - 1]: 'pointer', [mid - 1]: 'mismatch' },
            { [left - 1]: 'L', [mid - 1]: 'too big' }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 12,
      explanation: `Search complete. No integer squares to ${num}. Not a perfect square. Return false.`,
      variables: { result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default validPerfectSquare;
