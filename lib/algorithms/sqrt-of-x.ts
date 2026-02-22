import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sqrtOfX: AlgorithmDefinition = {
  id: 'sqrt-of-x',
  title: 'Sqrt(x)',
  leetcodeNumber: 69,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Compute the integer square root of x (floor of the true square root) using binary search. The answer lies in [0, x]. At each mid, check if mid*mid <= x < (mid+1)*(mid+1). Achieves O(log x) time without using built-in sqrt functions.',
  tags: ['binary search', 'math', 'integer square root'],

  code: {
    pseudocode: `function mySqrt(x):
  if x < 2: return x
  left = 1, right = x / 2
  while left <= right:
    mid = left + (right - left) / 2
    if mid * mid == x:
      return mid
    elif mid * mid < x:
      left = mid + 1
    else:
      right = mid - 1
  return right`,

    python: `def mySqrt(x: int) -> int:
    if x < 2:
        return x
    left, right = 1, x // 2
    while left <= right:
        mid = left + (right - left) // 2
        if mid * mid == x:
            return mid
        elif mid * mid < x:
            left = mid + 1
        else:
            right = mid - 1
    return right`,

    javascript: `function mySqrt(x) {
  if (x < 2) return x;
  let left = 1, right = Math.floor(x / 2);
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (mid * mid === x) return mid;
    else if (mid * mid < x) left = mid + 1;
    else right = mid - 1;
  }
  return right;
}`,

    java: `public int mySqrt(int x) {
    if (x < 2) return x;
    long left = 1, right = x / 2;
    while (left <= right) {
        long mid = left + (right - left) / 2;
        if (mid * mid == x) return (int) mid;
        else if (mid * mid < x) left = mid + 1;
        else right = mid - 1;
    }
    return (int) right;
}`,
  },

  defaultInput: {
    x: 36,
  },

  inputFields: [
    {
      name: 'x',
      label: 'x',
      type: 'number',
      defaultValue: 36,
      placeholder: '36',
      helperText: 'Non-negative integer to compute sqrt of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];

    // Visualize a range 1..floor(x/2) as the search space
    const maxRight = Math.max(1, Math.floor(x / 2));
    const rangeSize = Math.min(maxRight, 20);
    const arr = Array.from({ length: rangeSize }, (_, i) => i + 1);
    const eliminated = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      eliminated.forEach((idx) => { merged[idx] = 'visited'; });
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return {
        type: 'array',
        array: arr,
        highlights: merged,
        labels,
        auxData: {
          label: 'Search Space [1 .. x/2]',
          entries: [
            { key: 'x', value: String(x) },
            { key: 'search range', value: `[1, ${maxRight}]` },
          ],
        },
      };
    };

    if (x < 2) {
      steps.push({
        line: 2,
        explanation: `x=${x} < 2, sqrt(${x}) = ${x} trivially.`,
        variables: { x, result: x },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    let left = 1;
    let right = maxRight;

    steps.push({
      line: 3,
      explanation: `Binary search on [1, ${right}] (= floor(${x}/2)). sqrt(${x}) must be in this range.`,
      variables: { left, right, x },
      visualization: makeViz(
        { [left - 1]: 'pointer', [Math.min(right - 1, rangeSize - 1)]: 'pointer' },
        { [left - 1]: 'L', [Math.min(right - 1, rangeSize - 1)]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const sq = mid * mid;
      const midIdx = Math.min(mid - 1, rangeSize - 1);

      steps.push({
        line: 5,
        explanation: `mid = ${mid}, mid^2 = ${sq}. Compare with x = ${x}.`,
        variables: { left, right, mid, 'mid*mid': sq, x },
        visualization: makeViz(
          {
            [Math.min(left - 1, rangeSize - 1)]: 'pointer',
            [Math.min(right - 1, rangeSize - 1)]: 'pointer',
            [midIdx]: 'active',
          },
          {
            [Math.min(left - 1, rangeSize - 1)]: 'L',
            [Math.min(right - 1, rangeSize - 1)]: 'R',
            [midIdx]: 'mid',
          }
        ),
      });

      if (sq === x) {
        steps.push({
          line: 6,
          explanation: `${mid}^2 = ${sq} == x = ${x}. Exact square root found: ${mid}.`,
          variables: { result: mid },
          visualization: makeViz({ [midIdx]: 'found' }, { [midIdx]: `sqrt` }),
        });
        return steps;
      } else if (sq < x) {
        steps.push({
          line: 8,
          explanation: `${mid}^2 = ${sq} < ${x}. sqrt > ${mid}. Move left up: left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: makeViz({ [midIdx]: 'comparing' }, { [midIdx]: 'too small' }),
        });
        for (let i = left - 1; i <= midIdx; i++) eliminated.add(i);
        left = mid + 1;
      } else {
        steps.push({
          line: 10,
          explanation: `${mid}^2 = ${sq} > ${x}. sqrt < ${mid}. Move right down: right = ${mid - 1}.`,
          variables: { left, right: mid - 1 },
          visualization: makeViz({ [midIdx]: 'comparing' }, { [midIdx]: 'too large' }),
        });
        for (let i = midIdx; i <= Math.min(right - 1, rangeSize - 1); i++) eliminated.add(i);
        right = mid - 1;
      }
    }

    steps.push({
      line: 11,
      explanation: `left > right. Floor of sqrt(${x}) = right = ${right}. (${right}^2=${right * right} <= ${x} < ${right + 1}^2=${(right + 1) * (right + 1)})`,
      variables: { result: right, 'right^2': right * right, '(right+1)^2': (right + 1) * (right + 1) },
      visualization: makeViz(
        { [Math.min(right - 1, rangeSize - 1)]: 'found' },
        { [Math.min(right - 1, rangeSize - 1)]: `floor` }
      ),
    });

    return steps;
  },
};

export default sqrtOfX;
