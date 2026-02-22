import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const longPressedName: AlgorithmDefinition = {
  id: 'long-pressed-name',
  title: 'Long Pressed Name',
  leetcodeNumber: 925,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given a name and typed string, determine if typed could have been produced by long-pressing some characters in name. Each character in name appears in typed in order, but may appear more times due to long pressing.',
  tags: ['two pointers', 'string'],

  code: {
    pseudocode: `function isLongPressedName(name, typed):
  i = 0 (pointer for name)
  for j from 0 to len(typed)-1:
    if i < len(name) and name[i] == typed[j]:
      i++
    elif j == 0 or typed[j] != typed[j-1]:
      return false
  return i == len(name)`,

    python: `def isLongPressedName(name: str, typed: str) -> bool:
    i = 0
    for j, c in enumerate(typed):
        if i < len(name) and name[i] == c:
            i += 1
        elif j == 0 or c != typed[j - 1]:
            return False
    return i == len(name)`,

    javascript: `function isLongPressedName(name, typed) {
  let i = 0;
  for (let j = 0; j < typed.length; j++) {
    if (i < name.length && name[i] === typed[j]) {
      i++;
    } else if (j === 0 || typed[j] !== typed[j - 1]) {
      return false;
    }
  }
  return i === name.length;
}`,

    java: `public boolean isLongPressedName(String name, String typed) {
    int i = 0;
    for (int j = 0; j < typed.length(); j++) {
        if (i < name.length() && name.charAt(i) == typed.charAt(j)) {
            i++;
        } else if (j == 0 || typed.charAt(j) != typed.charAt(j - 1)) {
            return false;
        }
    }
    return i == name.length();
}`,
  },

  defaultInput: {
    name: 'alex',
    typed: 'aaleex',
  },

  inputFields: [
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      defaultValue: 'alex',
      placeholder: 'alex',
      helperText: 'The name being typed',
    },
    {
      name: 'typed',
      label: 'Typed String',
      type: 'string',
      defaultValue: 'aaleex',
      placeholder: 'aaleex',
      helperText: 'The actual typed string (may have long-pressed characters)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const name = input.name as string;
    const typed = input.typed as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `name="${name}", typed="${typed}". Use two pointers: i for name, j for typed.`,
      variables: { name, typed, i: 0, j: 0 },
      visualization: {
        type: 'array',
        array: typed.split('').map((_, idx) => idx),
        highlights: {},
        labels: Object.fromEntries(typed.split('').map((c, idx) => [idx, c])),
      },
    });

    let i = 0;

    for (let j = 0; j < typed.length; j++) {
      const c = typed[j];

      if (i < name.length && name[i] === c) {
        steps.push({
          line: 4,
          explanation: `j=${j}: typed[j]="${c}" matches name[${i}]="${name[i]}". Advance name pointer i to ${i + 1}.`,
          variables: { i, j, nameChar: name[i], typedChar: c, matched: true },
          visualization: {
            type: 'array',
            array: typed.split('').map((_, idx) => idx),
            highlights: {
              [j]: 'found',
              ...Object.fromEntries(Array.from({ length: j }, (_, k) => [k, 'sorted'])),
            },
            labels: Object.fromEntries(typed.split('').map((ch, idx) => [idx, ch])),
          },
        });
        i++;
      } else if (j === 0 || c !== typed[j - 1]) {
        steps.push({
          line: 6,
          explanation: `j=${j}: typed[j]="${c}" does NOT match name[${i}]="${i < name.length ? name[i] : 'end'}" and is not a repeat of previous char. Return false.`,
          variables: { i, j, nameChar: i < name.length ? name[i] : 'done', typedChar: c, result: false },
          visualization: {
            type: 'array',
            array: typed.split('').map((_, idx) => idx),
            highlights: {
              [j]: 'mismatch',
              ...Object.fromEntries(Array.from({ length: j }, (_, k) => [k, 'sorted'])),
            },
            labels: Object.fromEntries(typed.split('').map((ch, idx) => [idx, ch])),
          },
        });
        return steps;
      } else {
        steps.push({
          line: 5,
          explanation: `j=${j}: typed[j]="${c}" is a repeat of typed[${j - 1}]="${typed[j - 1]}" (long press). Accept and continue.`,
          variables: { i, j, typedChar: c, prevTyped: typed[j - 1], longPress: true },
          visualization: {
            type: 'array',
            array: typed.split('').map((_, idx) => idx),
            highlights: {
              [j]: 'active',
              [j - 1]: 'active',
              ...Object.fromEntries(Array.from({ length: j - 1 }, (_, k) => [k, 'sorted'])),
            },
            labels: Object.fromEntries(typed.split('').map((ch, idx) => [idx, ch])),
          },
        });
      }
    }

    const result = i === name.length;
    steps.push({
      line: 7,
      explanation: `Finished typed. name pointer i=${i}, name length=${name.length}. ${result ? 'All name chars matched. Return true.' : 'Not all name chars matched. Return false.'}`,
      variables: { i, nameLength: name.length, result },
      visualization: {
        type: 'array',
        array: typed.split('').map((_, idx) => idx),
        highlights: Object.fromEntries(typed.split('').map((_, idx) => [idx, result ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(typed.split('').map((c, idx) => [idx, c])),
      },
    });

    return steps;
  },
};

export default longPressedName;
