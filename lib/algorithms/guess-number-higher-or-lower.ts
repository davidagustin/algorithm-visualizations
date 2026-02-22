import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const guessNumberHigherOrLower: AlgorithmDefinition = {
  id: 'guess-number-higher-or-lower',
  title: 'Guess Number Higher or Lower',
  leetcodeNumber: 374,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'A number guessing game where a secret number is picked. The guess API returns -1 if the guess is too high, 1 if too low, and 0 if correct. Binary search is used to find the secret number efficiently in O(log n) time.',
  tags: ['binary search', 'interactive'],

  code: {
    pseudocode: `function guessNumber(n):
  left = 1
  right = n
  while left <= right:
    mid = (left + right) / 2
    result = guess(mid)
    if result == 0:
      return mid
    else if result == 1:
      left = mid + 1
    else:
      right = mid - 1
  return -1`,

    python: `def guessNumber(n: int) -> int:
    left, right = 1, n
    while left <= right:
        mid = (left + right) // 2
        res = guess(mid)
        if res == 0:
            return mid
        elif res == 1:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,

    javascript: `function guessNumber(n) {
  let left = 1, right = n;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const res = guess(mid);
    if (res === 0) return mid;
    else if (res === 1) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,

    java: `public int guessNumber(int n) {
    int left = 1, right = n;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int res = guess(mid);
        if (res == 0) return mid;
        else if (res == 1) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 10,
    pick: 6,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Range (1 to n)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Upper bound of guessing range',
    },
    {
      name: 'pick',
      label: 'Secret Number',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'The secret number to guess (between 1 and n)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const pick = input.pick as number;
    const steps: AlgorithmStep[] = [];

    const range = Array.from({ length: n }, (_, i) => i + 1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: range,
      highlights,
      labels,
    });

    let left = 1;
    let right = n;

    steps.push({
      line: 1,
      explanation: `Start guessing game. Range is 1 to ${n}. Secret number is hidden.`,
      variables: { left, right, pick: '(hidden)' },
      visualization: makeViz(
        { 0: 'pointer', [n - 1]: 'pointer' },
        { 0: 'L', [n - 1]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midIdx = mid - 1;

      steps.push({
        line: 4,
        explanation: `Guess mid = ${mid}. Calling guess(${mid}).`,
        variables: { left, right, mid },
        visualization: makeViz(
          { [left - 1]: 'active', [right - 1]: 'active', [midIdx]: 'comparing' },
          { [left - 1]: 'L', [right - 1]: 'R', [midIdx]: `guess=${mid}` }
        ),
      });

      const result = mid === pick ? 0 : mid < pick ? 1 : -1;

      if (result === 0) {
        steps.push({
          line: 7,
          explanation: `guess(${mid}) returned 0. Correct! The secret number is ${mid}.`,
          variables: { left, right, mid, result: mid },
          visualization: makeViz(
            { [midIdx]: 'found' },
            { [midIdx]: `ans=${mid}` }
          ),
        });
        return steps;
      } else if (result === 1) {
        steps.push({
          line: 9,
          explanation: `guess(${mid}) returned 1 (too low). Secret is higher. Move left to ${mid + 1}.`,
          variables: { left, right, mid, guessResult: 1 },
          visualization: makeViz(
            { [midIdx]: 'mismatch', [right - 1]: 'pointer' },
            { [midIdx]: 'too low', [right - 1]: 'R' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 11,
          explanation: `guess(${mid}) returned -1 (too high). Secret is lower. Move right to ${mid - 1}.`,
          variables: { left, right, mid, guessResult: -1 },
          visualization: makeViz(
            { [left - 1]: 'pointer', [midIdx]: 'mismatch' },
            { [left - 1]: 'L', [midIdx]: 'too high' }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 12,
      explanation: 'Search complete. Secret number not found in range.',
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default guessNumberHigherOrLower;
