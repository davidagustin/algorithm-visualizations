import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const diStringMatch: AlgorithmDefinition = {
  id: 'di-string-match',
  title: 'DI String Match',
  leetcodeNumber: 942,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string s of length n containing only "I" (increase) and "D" (decrease), return a permutation of [0, 1, ..., n] that satisfies: for I use the current minimum, for D use the current maximum. This greedy approach guarantees valid ordering.',
  tags: ['string', 'greedy', 'two pointers'],

  code: {
    pseudocode: `function diStringMatch(s):
  lo = 0, hi = len(s)
  result = []
  for char in s:
    if char == 'I':
      result.append(lo)
      lo++
    else:
      result.append(hi)
      hi--
  result.append(lo)  // lo == hi at this point
  return result`,

    python: `def diStringMatch(s: str) -> list[int]:
    lo, hi = 0, len(s)
    result = []
    for c in s:
        if c == 'I':
            result.append(lo); lo += 1
        else:
            result.append(hi); hi -= 1
    result.append(lo)
    return result`,

    javascript: `function diStringMatch(s) {
  let lo = 0, hi = s.length;
  const result = [];
  for (const c of s) {
    if (c === 'I') result.push(lo++);
    else result.push(hi--);
  }
  result.push(lo);
  return result;
}`,

    java: `public int[] diStringMatch(String s) {
    int lo = 0, hi = s.length();
    int[] result = new int[s.length() + 1];
    for (int i = 0; i < s.length(); i++) {
        result[i] = s.charAt(i) == 'I' ? lo++ : hi--;
    }
    result[s.length()] = lo;
    return result;
}`,
  },

  defaultInput: {
    s: 'IDID',
  },

  inputFields: [
    {
      name: 's',
      label: 'DI String',
      type: 'string',
      defaultValue: 'IDID',
      placeholder: 'IDID',
      helperText: 'String of I and D characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build permutation from "${s}". lo=0, hi=${s.length}. For I take lo, for D take hi.`,
      variables: { s, lo: 0, hi: s.length },
      visualization: makeViz({}, {}),
    });

    let lo = 0;
    let hi = s.length;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (c === 'I') {
        steps.push({
          line: 4,
          explanation: `s[${i}]='I': append lo=${lo} to result. lo++ => ${lo + 1}.`,
          variables: { i, char: c, appended: lo, newLo: lo + 1, hi },
          visualization: makeViz({ [i]: 'found' }, { [i]: `lo=${lo}` }),
        });
        result.push(lo);
        lo++;
      } else {
        steps.push({
          line: 7,
          explanation: `s[${i}]='D': append hi=${hi} to result. hi-- => ${hi - 1}.`,
          variables: { i, char: c, appended: hi, lo, newHi: hi - 1 },
          visualization: makeViz({ [i]: 'active' }, { [i]: `hi=${hi}` }),
        });
        result.push(hi);
        hi--;
      }
    }

    result.push(lo);
    steps.push({
      line: 9,
      explanation: `Append final lo=${lo} (== hi at this point). Result: [${result.join(', ')}].`,
      variables: { finalValue: lo, result: result.join(',') },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default diStringMatch;
