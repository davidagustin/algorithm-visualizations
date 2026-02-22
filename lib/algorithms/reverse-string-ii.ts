import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const reverseStringIi: AlgorithmDefinition = {
  id: 'reverse-string-ii',
  title: 'Reverse String II',
  leetcodeNumber: 541,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string s and integer k, reverse the first k characters for every 2k characters. If fewer than k characters remain, reverse all. If between k and 2k remain, reverse the first k only.',
  tags: ['string', 'two pointers', 'simulation'],

  code: {
    pseudocode: `function reverseStr(s, k):
  arr = s.toCharArray()
  for i from 0 to n step 2k:
    left = i
    right = min(i + k - 1, n - 1)
    reverse arr[left..right]
  return arr.join("")`,

    python: `def reverseStr(s: str, k: int) -> str:
    arr = list(s)
    for i in range(0, len(arr), 2 * k):
        arr[i:i+k] = arr[i:i+k][::-1]
    return ''.join(arr)`,

    javascript: `function reverseStr(s, k) {
  const arr = s.split('');
  for (let i = 0; i < arr.length; i += 2 * k) {
    let left = i, right = Math.min(i + k - 1, arr.length - 1);
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++; right--;
    }
  }
  return arr.join('');
}`,

    java: `public String reverseStr(String s, int k) {
    char[] arr = s.toCharArray();
    for (int i = 0; i < arr.length; i += 2 * k) {
        int left = i, right = Math.min(i + k - 1, arr.length - 1);
        while (left < right) {
            char tmp = arr[left];
            arr[left++] = arr[right];
            arr[right--] = tmp;
        }
    }
    return new String(arr);
}`,
  },

  defaultInput: {
    s: 'abcdefgh',
    k: 3,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcdefgh',
      placeholder: 'abcdefgh',
      helperText: 'Input string to process',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of characters to reverse in each 2k window',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const arr = s.split('');
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Input: "${s}", k=${k}. Process every 2k=${2 * k} characters, reversing first k=${k}.`,
      variables: { s, k, step: 2 * k },
      visualization: {
        type: 'array',
        array: arr as unknown as number[],
        highlights: {},
        labels: Object.fromEntries(arr.map((c, i) => [i, c])),
      },
    });

    for (let i = 0; i < n; i += 2 * k) {
      let left = i;
      let right = Math.min(i + k - 1, n - 1);

      steps.push({
        line: 3,
        explanation: `Window starting at index ${i}: reverse indices ${left} to ${right} (first k=${k} chars in this window).`,
        variables: { windowStart: i, left, right },
        visualization: {
          type: 'array',
          array: arr as unknown as number[],
          highlights: {
            ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, j) => [left + j, 'active'])),
          },
          labels: {
            [left]: 'L',
            [right]: 'R',
            ...Object.fromEntries(arr.map((c, idx) => [idx, c])),
          },
        },
      });

      while (left < right) {
        steps.push({
          line: 6,
          explanation: `Swap arr[${left}]="${arr[left]}" and arr[${right}]="${arr[right]}"`,
          variables: { left, right, swapping: `"${arr[left]}" <-> "${arr[right]}"` },
          visualization: {
            type: 'array',
            array: arr as unknown as number[],
            highlights: { [left]: 'swapping', [right]: 'swapping' },
            labels: Object.fromEntries(arr.map((c, idx) => [idx, c])),
          },
        });

        const tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
        right--;
      }

      steps.push({
        line: 6,
        explanation: `After reversing window ${i}: "${arr.join('')}"`,
        variables: { current: arr.join('') },
        visualization: {
          type: 'array',
          array: arr as unknown as number[],
          highlights: {
            ...Object.fromEntries(Array.from({ length: Math.min(i + k, n) - i }, (_, j) => [i + j, 'sorted'])),
          },
          labels: Object.fromEntries(arr.map((c, idx) => [idx, c])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Final result: "${arr.join('')}"`,
      variables: { result: arr.join('') },
      visualization: {
        type: 'array',
        array: arr as unknown as number[],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(arr.map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default reverseStringIi;
