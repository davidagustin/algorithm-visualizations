import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const decodedStringAtIndex: AlgorithmDefinition = {
  id: 'decoded-string-at-index',
  title: 'Decoded String at Index',
  leetcodeNumber: 880,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'An encoded string is built by reading characters left to right: letters are appended, digits d repeat the current string d times. Find the k-th character of the fully decoded string (1-indexed) without fully decoding it. Work backwards: compute the decoded length at each position, then trace back to find which character maps to position k.',
  tags: ['stack', 'string', 'reverse traversal', 'math'],

  code: {
    pseudocode: `function decodeAtIndex(s, k):
  size = 0
  // Compute total decoded length
  for each char c in s:
    if c is digit:
      size *= int(c)
    else:
      size += 1
  // Trace backwards
  for i = len(s)-1 downto 0:
    k = k % size
    if k == 0 and s[i] is letter:
      return s[i]
    if s[i] is digit:
      size /= int(s[i])
    else:
      size -= 1`,

    python: `def decodeAtIndex(s: str, k: int) -> str:
    size = 0
    for c in s:
        if c.isdigit():
            size *= int(c)
        else:
            size += 1
    for c in reversed(s):
        k %= size
        if k == 0 and c.isalpha():
            return c
        if c.isdigit():
            size //= int(c)
        else:
            size -= 1
    return ''`,

    javascript: `function decodeAtIndex(s, k) {
  let size = 0;
  for (const c of s) {
    if (c >= '0') size = /\\d/.test(c) ? size * +c : size + 1;
  }
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s[i];
    k %= size;
    if (k === 0 && isNaN(+c)) return c;
    if (!isNaN(+c)) size = Math.floor(size / +c);
    else size--;
  }
  return '';
}`,

    java: `public String decodeAtIndex(String s, int k) {
    long size = 0;
    for (char c : s.toCharArray())
        size = Character.isDigit(c) ? size * (c - '0') : size + 1;
    for (int i = s.length() - 1; i >= 0; i--) {
        char c = s.charAt(i);
        k %= size;
        if (k == 0 && Character.isLetter(c)) return String.valueOf(c);
        if (Character.isDigit(c)) size /= (c - '0');
        else size--;
    }
    return "";
}`,
  },

  defaultInput: {
    s: 'leet2code3',
    k: 10,
  },

  inputFields: [
    {
      name: 's',
      label: 'Encoded String',
      type: 'string',
      defaultValue: 'leet2code3',
      placeholder: 'leet2code3',
      helperText: 'String with letters and digits (digits are repeat counts)',
    },
    {
      name: 'k',
      label: 'Index K (1-based)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: '1-based index of the character to find',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const sizesForward: number[] = [];
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `s = "${s}", k = ${k}. First, compute decoded size at each position.`,
      variables: { s, k },
      visualization: makeViz(-1, 'idle'),
    });

    // Forward pass: compute sizes
    let size = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (/\d/.test(c)) {
        size *= parseInt(c);
      } else {
        size++;
      }
      sizesForward.push(size);
      stack.length = 0;
      stack.push(`size=${size}`);

      steps.push({
        line: 4,
        explanation: `s[${i}]="${c}": decoded length = ${size}.`,
        variables: { i, char: c, decodedSize: size },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 9,
      explanation: `Forward pass done. Total decoded length = ${size}. Now trace backwards with k=${k}.`,
      variables: { totalSize: size, k },
      visualization: makeViz(s.length - 1, 'idle'),
    });

    // Backward pass
    let kk = k;
    let result = '';
    for (let i = s.length - 1; i >= 0; i--) {
      const c = s[i];
      kk = kk % size;

      stack.length = 0;
      stack.push(`i=${i}`, `c=${c}`, `k=${kk}`, `sz=${size}`);

      if (kk === 0 && /[a-zA-Z]/.test(c)) {
        result = c;
        steps.push({
          line: 12,
          explanation: `k%size = ${kk} = 0 and s[${i}]="${c}" is a letter. Answer is "${c}".`,
          variables: { i, char: c, k: kk, size },
          visualization: makeViz(i, 'match'),
        });
        break;
      }

      if (/\d/.test(c)) {
        size = Math.floor(size / parseInt(c));
        steps.push({
          line: 15,
          explanation: `s[${i}]="${c}" is a digit. Undo repeat: size /= ${c} = ${size}. k = ${kk}.`,
          variables: { i, char: c, k: kk, size },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        size--;
        steps.push({
          line: 17,
          explanation: `s[${i}]="${c}" is a letter. Undo append: size-- = ${size}. k = ${kk}.`,
          variables: { i, char: c, k: kk, size },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    steps.push({
      line: 18,
      explanation: `Result: the ${k}th character of the decoded string is "${result}".`,
      variables: { result },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default decodedStringAtIndex;
