import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const palindromeNumber: AlgorithmDefinition = {
  id: 'palindrome-number',
  title: 'Palindrome Number',
  leetcodeNumber: 9,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an integer x, return true if x is a palindrome (reads the same forwards and backwards). Negative numbers are not palindromes. Solve without converting to a string by reversing the second half of the number.',
  tags: ['math', 'number theory'],

  code: {
    pseudocode: `function isPalindrome(x):
  if x < 0 or (x % 10 == 0 and x != 0):
    return false
  reversed = 0
  while x > reversed:
    reversed = reversed * 10 + x % 10
    x = x / 10 (integer)
  return x == reversed or x == reversed / 10`,

    python: `def isPalindrome(x: int) -> bool:
    if x < 0 or (x != 0 and x % 10 == 0):
        return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10`,

    javascript: `function isPalindrome(x) {
  if (x < 0 || (x !== 0 && x % 10 === 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + x % 10;
    x = Math.floor(x / 10);
  }
  return x === rev || x === Math.floor(rev / 10);
}`,

    java: `public boolean isPalindrome(int x) {
    if (x < 0 || (x != 0 && x % 10 == 0)) return false;
    int rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return x == rev || x == rev / 10;
}`,
  },

  defaultInput: {
    x: 121,
  },

  inputFields: [
    {
      name: 'x',
      label: 'Number',
      type: 'number',
      defaultValue: 121,
      placeholder: '121',
      helperText: 'Integer to check for palindrome property',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const xInput = input.x as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: ${xInput}. Reverse the second half and compare with the first half.`,
      variables: { x: xInput },
      visualization: {
        type: 'array',
        array: String(xInput).split('').map(Number),
        highlights: {},
        labels: Object.fromEntries(String(xInput).split('').map((c, i) => [i, c])),
      },
    });

    if (xInput < 0 || (xInput !== 0 && xInput % 10 === 0)) {
      steps.push({
        line: 2,
        explanation: `${xInput < 0 ? 'Negative numbers' : 'Numbers ending in 0 (except 0 itself)'} cannot be palindromes. Return false.`,
        variables: { x: xInput, result: false },
        visualization: {
          type: 'array',
          array: String(xInput).split('').map(Number),
          highlights: Object.fromEntries(String(xInput).split('').map((_, i) => [i, 'mismatch'])),
          labels: Object.fromEntries(String(xInput).split('').map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    let x = xInput;
    let rev = 0;

    steps.push({
      line: 3,
      explanation: `x=${x} is non-negative and does not end in 0. Start reversing the second half.`,
      variables: { x, rev: 0 },
      visualization: {
        type: 'array',
        array: [x, rev],
        highlights: { 0: 'active', 1: 'pointer' },
        labels: { 0: 'x', 1: 'rev' },
      },
    });

    let iteration = 0;
    while (x > rev) {
      iteration++;
      const digit = x % 10;
      rev = rev * 10 + digit;
      x = Math.floor(x / 10);

      steps.push({
        line: 5,
        explanation: `Iteration ${iteration}: Take last digit ${digit} from x. rev = rev*10 + ${digit} = ${rev}. x becomes ${x}.`,
        variables: { iteration, digit, x, rev },
        visualization: {
          type: 'array',
          array: [x, rev],
          highlights: { 0: 'comparing', 1: 'active' },
          labels: { 0: `x=${x}`, 1: `rev=${rev}` },
        },
      });
    }

    const isEvenLength = x === rev;
    const isOddLength = x === Math.floor(rev / 10);
    const result = isEvenLength || isOddLength;

    steps.push({
      line: 7,
      explanation: `Loop done. x=${x}, rev=${rev}. Check: x==rev (even length)? ${isEvenLength}. x==rev/10 (odd length)? ${isOddLength}. Palindrome: ${result}.`,
      variables: { x, rev, isEvenLength, isOddLength, result },
      visualization: {
        type: 'array',
        array: [x, rev],
        highlights: { 0: result ? 'found' : 'mismatch', 1: result ? 'found' : 'mismatch' },
        labels: { 0: `x=${x}`, 1: `rev=${rev}` },
      },
    });

    return steps;
  },
};

export default palindromeNumber;
