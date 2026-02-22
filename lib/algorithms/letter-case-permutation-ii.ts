import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const letterCasePermutationII: AlgorithmDefinition = {
  id: 'letter-case-permutation-ii',
  title: 'Letter Case Permutation II',
  leetcodeNumber: 784,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string, generate all possible strings by converting each letter to uppercase or lowercase. Digits remain unchanged. Use backtracking or BFS: at each character position, if it\'s a letter, branch into both cases. O(2^L * n) where L=number of letters.',
  tags: ['Backtracking', 'String', 'Bit Manipulation'],
  code: {
    pseudocode: `function letterCasePermutation(s):
  result = []
  backtrack(s, 0, result)
  return result

function backtrack(s, idx, result):
  if idx == len(s):
    result.append(s)
    return
  backtrack(s, idx+1, result)
  if s[idx].isLetter():
    toggle case of s[idx]
    backtrack(s, idx+1, result)
    toggle back`,
    python: `def letterCasePermutation(s):
    result = []
    def bt(chars, i):
        if i == len(chars):
            result.append(''.join(chars)); return
        bt(chars, i+1)
        if chars[i].isalpha():
            chars[i] = chars[i].swapcase()
            bt(chars, i+1)
            chars[i] = chars[i].swapcase()
    bt(list(s), 0)
    return result`,
    javascript: `function letterCasePermutation(s) {
  const result = [];
  function bt(chars, i) {
    if (i === chars.length) { result.push(chars.join('')); return; }
    bt(chars, i+1);
    if (chars[i].match(/[a-zA-Z]/)) {
      chars[i] = chars[i] === chars[i].toUpperCase() ? chars[i].toLowerCase() : chars[i].toUpperCase();
      bt(chars, i+1);
      chars[i] = chars[i] === chars[i].toUpperCase() ? chars[i].toLowerCase() : chars[i].toUpperCase();
    }
  }
  bt(s.split(''), 0);
  return result;
}`,
    java: `public List<String> letterCasePermutation(String s) {
    List<String> result = new ArrayList<>();
    backtrack(s.toCharArray(), 0, result);
    return result;
}
void backtrack(char[] s, int i, List<String> res) {
    if (i==s.length) { res.add(new String(s)); return; }
    backtrack(s, i+1, res);
    if (Character.isLetter(s[i])) {
        s[i]^=32;
        backtrack(s, i+1, res);
        s[i]^=32;
    }
}`,
  },
  defaultInput: { s: 'a1b2' },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'a1b2',
      placeholder: 'a1b2',
      helperText: 'String with letters and/or digits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string) || 'a1b2';
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    const bt = (chars: string[], i: number) => {
      if (i === chars.length) {
        result.push(chars.join(''));
        return;
      }
      bt(chars, i + 1);
      if (/[a-zA-Z]/.test(chars[i])) {
        chars[i] = chars[i] === chars[i].toUpperCase() ? chars[i].toLowerCase() : chars[i].toUpperCase();
        bt(chars, i + 1);
        chars[i] = chars[i] === chars[i].toUpperCase() ? chars[i].toLowerCase() : chars[i].toUpperCase();
      }
    };

    steps.push({
      line: 1,
      explanation: `letterCasePermutation("${s}"): Toggle each letter's case. Digits stay unchanged. Expected 2^${s.split('').filter(c => /[a-zA-Z]/.test(c)).length} = ${Math.pow(2, s.split('').filter(c => /[a-zA-Z]/.test(c)).length)} results.`,
      variables: { s, letterCount: s.split('').filter(c => /[a-zA-Z]/.test(c)).length },
      visualization: {
        type: 'array',
        array: s.split('').map(c => c.charCodeAt(0)),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, /[a-zA-Z]/.test(c) ? `'${c}'(letter)` : `'${c}'(digit)`])),
        auxData: { label: 'Letter Case Permutation', entries: [{ key: 'Input', value: s }, { key: 'Letters', value: String(s.split('').filter(c => /[a-zA-Z]/.test(c)).length) }] },
      },
    });

    bt(s.split(''), 0);

    for (let ri = 0; ri < result.length; ri++) {
      const perm = result[ri];
      steps.push({
        line: 7,
        explanation: `Permutation ${ri + 1}/${result.length}: "${perm}".`,
        variables: { permutation: perm, index: ri + 1 },
        visualization: {
          type: 'array',
          array: result.slice(0, ri + 1).map((_, i) => i + 1),
          highlights: { [ri]: 'found' },
          labels: Object.fromEntries(result.slice(0, ri + 1).map((p, i) => [i, p])),
          auxData: { label: 'Letter Case Permutation', entries: [{ key: 'Latest', value: perm }, { key: 'Total', value: String(ri + 1) }] },
        },
      });
    }

    steps.push({
      line: 3,
      explanation: `Done! All ${result.length} permutations: [${result.join(', ')}].`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((p, i) => [i, p])),
        auxData: { label: 'Letter Case Permutation', entries: [{ key: 'Total', value: String(result.length) }] },
      },
    });

    return steps;
  },
};

export default letterCasePermutationII;
