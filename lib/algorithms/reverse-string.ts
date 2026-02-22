import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseString: AlgorithmDefinition = {
  id: 'reverse-string',
  title: 'Reverse String',
  leetcodeNumber: 344,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Write a function that reverses a string in-place. The input is given as an array of characters. You must do it in-place with O(1) extra memory using two pointers from both ends.',
  tags: ['two pointers', 'string', 'in-place', 'swap'],

  code: {
    pseudocode: `function reverseString(s):
  left = 0
  right = length(s) - 1
  while left < right:
    swap(s[left], s[right])
    left = left + 1
    right = right - 1`,

    python: `def reverseString(s: list[str]) -> None:
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,

    javascript: `function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}`,

    java: `public void reverseString(char[] s) {
    int left = 0, right = s.length - 1;
    while (left < right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}`,
  },

  defaultInput: {
    s: [72, 101, 108, 108, 111],
  },

  inputFields: [
    {
      name: 's',
      label: 'Character Array (as ASCII codes)',
      type: 'array',
      defaultValue: [72, 101, 108, 108, 111],
      placeholder: '72,101,108,108,111',
      helperText: 'ASCII codes for characters (H=72, e=101, l=108, o=111)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = [...(input.s as number[])];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    const toChar = (code: number) => String.fromCharCode(code);

    steps.push({
      line: 1,
      explanation: `Reverse array [${s.join(', ')}] (chars: ${s.map(toChar).join('')}). Two pointers swap from outside in.`,
      variables: { s: [...s], chars: s.map(toChar).join('') },
      visualization: makeViz(s, {}, {}),
    });

    let left = 0;
    let right = s.length - 1;

    steps.push({
      line: 2,
      explanation: `Initialize left = 0, right = ${right}. We'll swap elements until pointers meet.`,
      variables: { left, right },
      visualization: makeViz(s, { [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      steps.push({
        line: 4,
        explanation: `Swap s[${left}] = ${s[left]} (${toChar(s[left])}) with s[${right}] = ${s[right]} (${toChar(s[right])}).`,
        variables: { left, right, 's[left]': s[left], 's[right]': s[right] },
        visualization: makeViz(s, { [left]: 'swapping', [right]: 'swapping' }, { [left]: 'L', [right]: 'R' }),
      });

      const temp = s[left];
      s[left] = s[right];
      s[right] = temp;

      steps.push({
        line: 5,
        explanation: `Swapped! Array is now [${s.join(', ')}] (${s.map(toChar).join('')}). Move pointers inward.`,
        variables: { left, right, 's[left]': s[left], 's[right]': s[right] },
        visualization: makeViz(s, { [left]: 'found', [right]: 'found' }, { [left]: 'done', [right]: 'done' }),
      });

      left++;
      right--;

      if (left <= right) {
        steps.push({
          line: 6,
          explanation: `Advance: left = ${left}, right = ${right}. Continue swapping.`,
          variables: { left, right },
          visualization: makeViz(s, { [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Pointers met. String fully reversed: [${s.join(', ')}] (${s.map(toChar).join('')}).`,
      variables: { result: [...s], chars: s.map(toChar).join('') },
      visualization: makeViz(s, Object.fromEntries(s.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default reverseString;
