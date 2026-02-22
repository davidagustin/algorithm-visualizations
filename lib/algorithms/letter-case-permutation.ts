import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const letterCasePermutation: AlgorithmDefinition = {
  id: 'letter-case-permutation',
  title: 'Letter Case Permutation',
  leetcodeNumber: 784,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string, return all possible strings you can generate by changing each letter to either lowercase or uppercase. Digits remain unchanged. Uses backtracking to explore both cases for each letter character at each position.',
  tags: ['backtracking', 'string', 'recursion', 'bit manipulation', 'permutation'],

  code: {
    pseudocode: `function letterCasePermutation(s):
  result = []
  backtrack(s, 0, result)
  return result

function backtrack(s, index, result):
  if index == length(s):
    result.push(s)
    return
  if s[index] is letter:
    s[index] = lowercase(s[index])
    backtrack(s, index+1, result)
    s[index] = uppercase(s[index])
    backtrack(s, index+1, result)
  else:
    backtrack(s, index+1, result)`,

    python: `def letterCasePermutation(s: str) -> list[str]:
    result = []
    def backtrack(chars, i):
        if i == len(chars):
            result.append(''.join(chars))
            return
        if chars[i].isalpha():
            chars[i] = chars[i].lower()
            backtrack(chars, i + 1)
            chars[i] = chars[i].upper()
            backtrack(chars, i + 1)
        else:
            backtrack(chars, i + 1)
    backtrack(list(s), 0)
    return result`,

    javascript: `function letterCasePermutation(s) {
  const result = [];
  const chars = s.split('');
  function backtrack(i) {
    if (i === chars.length) {
      result.push(chars.join(''));
      return;
    }
    if (chars[i].match(/[a-zA-Z]/)) {
      chars[i] = chars[i].toLowerCase();
      backtrack(i + 1);
      chars[i] = chars[i].toUpperCase();
      backtrack(i + 1);
    } else {
      backtrack(i + 1);
    }
  }
  backtrack(0);
  return result;
}`,

    java: `public List<String> letterCasePermutation(String s) {
    List<String> result = new ArrayList<>();
    backtrack(s.toCharArray(), 0, result);
    return result;
}
private void backtrack(char[] chars, int i, List<String> result) {
    if (i == chars.length) { result.add(new String(chars)); return; }
    if (Character.isLetter(chars[i])) {
        chars[i] = Character.toLowerCase(chars[i]);
        backtrack(chars, i + 1, result);
        chars[i] = Character.toUpperCase(chars[i]);
        backtrack(chars, i + 1, result);
    } else {
        backtrack(chars, i + 1, result);
    }
}`,
  },

  defaultInput: {
    s: 'a1b',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'a1b',
      placeholder: 'a1b',
      helperText: 'String with letters and digits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];
    const chars = s.split('');

    steps.push({
      line: 1,
      explanation: `Starting letter case permutation for "${s}". Letters will branch into lowercase and uppercase. Digits stay fixed.`,
      variables: { input: s, length: s.length },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i),
        highlights: {},
        labels: chars.reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function backtrack(i: number) {
      if (i === chars.length) {
        const perm = chars.join('');
        result.push(perm);
        steps.push({
          line: 8,
          explanation: `Complete permutation: "${perm}". Total found: ${result.length}`,
          variables: { permutation: perm, total: result.length },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: chars.reduce((acc, _, idx) => ({ ...acc, [idx]: 'found' }), {}),
            labels: chars.reduce((acc, c, idx) => ({ ...acc, [idx]: c }), {} as Record<number, string>),
          },
        });
        return;
      }

      if (chars[i].match(/[a-zA-Z]/)) {
        chars[i] = chars[i].toLowerCase();
        steps.push({
          line: 11,
          explanation: `Position ${i} is letter. Trying lowercase "${chars[i]}". Current state: "${chars.join('')}"`,
          variables: { index: i, char: chars[i], case: 'lower', current: chars.join('') },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'active' },
            labels: chars.reduce((acc, c, idx) => ({ ...acc, [idx]: c }), {} as Record<number, string>),
          },
        });
        backtrack(i + 1);

        chars[i] = chars[i].toUpperCase();
        steps.push({
          line: 13,
          explanation: `Backtrack to position ${i}. Now trying uppercase "${chars[i]}". Current state: "${chars.join('')}"`,
          variables: { index: i, char: chars[i], case: 'upper', current: chars.join('') },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'comparing' },
            labels: chars.reduce((acc, c, idx) => ({ ...acc, [idx]: c }), {} as Record<number, string>),
          },
        });
        backtrack(i + 1);

        chars[i] = chars[i].toLowerCase();
      } else {
        steps.push({
          line: 15,
          explanation: `Position ${i} is digit "${chars[i]}". No branching needed, move forward.`,
          variables: { index: i, char: chars[i], type: 'digit' },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'sorted' },
            labels: chars.reduce((acc, c, idx) => ({ ...acc, [idx]: c }), {} as Record<number, string>),
          },
        });
        backtrack(i + 1);
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `All permutations generated. Total: ${result.length} combinations: [${result.map(r => `"${r}"`).join(', ')}]`,
      variables: { total: result.length, result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: result.reduce((acc, r, i) => ({ ...acc, [i]: r }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default letterCasePermutation;
