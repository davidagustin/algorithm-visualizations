import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseOnlyLetters: AlgorithmDefinition = {
  id: 'reverse-only-letters',
  title: 'Reverse Only Letters',
  leetcodeNumber: 917,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string s, reverse the string but keep non-letter characters in their original positions. Use two pointers from both ends: skip non-letter characters, then swap letters.',
  tags: ['string', 'two pointers'],

  code: {
    pseudocode: `function reverseOnlyLetters(s):
  arr = list(s)
  left = 0, right = len(arr) - 1
  while left < right:
    while left < right and arr[left] is not letter:
      left++
    while left < right and arr[right] is not letter:
      right--
    swap arr[left] and arr[right]
    left++, right--
  return arr.join("")`,

    python: `def reverseOnlyLetters(s: str) -> str:
    arr = list(s)
    left, right = 0, len(arr) - 1
    while left < right:
        while left < right and not arr[left].isalpha():
            left += 1
        while left < right and not arr[right].isalpha():
            right -= 1
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return ''.join(arr)`,

    javascript: `function reverseOnlyLetters(s) {
  const arr = s.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z]/.test(arr[left])) left++;
    while (left < right && !/[a-zA-Z]/.test(arr[right])) right--;
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
  return arr.join('');
}`,

    java: `public String reverseOnlyLetters(String s) {
    char[] arr = s.toCharArray();
    int left = 0, right = arr.length - 1;
    while (left < right) {
        while (left < right && !Character.isLetter(arr[left])) left++;
        while (left < right && !Character.isLetter(arr[right])) right--;
        char tmp = arr[left]; arr[left] = arr[right]; arr[right] = tmp;
        left++; right--;
    }
    return new String(arr);
}`,
  },

  defaultInput: {
    s: 'a-bC-dEf-ghIj',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'a-bC-dEf-ghIj',
      placeholder: 'a-bC-dEf-ghIj',
      helperText: 'String with letters and non-letter characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const arr = s.split('');

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr] as unknown as number[],
      highlights,
      labels,
    });

    const isLetter = (c: string) => /[a-zA-Z]/.test(c);

    steps.push({
      line: 1,
      explanation: `Reverse only letters in "${s}". Initialize left=0, right=${arr.length - 1}.`,
      variables: { s, left: 0, right: arr.length - 1 },
      visualization: makeViz({ 0: 'pointer', [arr.length - 1]: 'pointer' }, { 0: 'L', [arr.length - 1]: 'R' }),
    });

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
      while (left < right && !isLetter(arr[left])) {
        steps.push({
          line: 4,
          explanation: `arr[${left}]="${arr[left]}" is not a letter. Skip: left++.`,
          variables: { left, char: arr[left] },
          visualization: makeViz({ [left]: 'visited' }, { [left]: 'skip' }),
        });
        left++;
      }

      while (left < right && !isLetter(arr[right])) {
        steps.push({
          line: 6,
          explanation: `arr[${right}]="${arr[right]}" is not a letter. Skip: right--.`,
          variables: { right, char: arr[right] },
          visualization: makeViz({ [right]: 'visited' }, { [right]: 'skip' }),
        });
        right--;
      }

      if (left < right) {
        steps.push({
          line: 7,
          explanation: `Swap letters: arr[${left}]="${arr[left]}" <-> arr[${right}]="${arr[right]}".`,
          variables: { left, right, leftChar: arr[left], rightChar: arr[right] },
          visualization: makeViz({ [left]: 'swapping', [right]: 'swapping' }, { [left]: 'L', [right]: 'R' }),
        });

        const tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
        right--;

        steps.push({
          line: 8,
          explanation: `After swap: "${arr.join('')}". Move left++, right--.`,
          variables: { left, right, current: arr.join('') },
          visualization: makeViz({ [left - 1]: 'sorted', [right + 1]: 'sorted' }, { [left]: 'L', [right]: 'R' }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Result: "${arr.join('')}". Letters reversed, non-letters stay in place.`,
      variables: { result: arr.join('') },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default reverseOnlyLetters;
