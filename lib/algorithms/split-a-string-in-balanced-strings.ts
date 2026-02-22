import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitAStringInBalancedStrings: AlgorithmDefinition = {
  id: 'split-a-string-in-balanced-strings',
  title: 'Split a String in Balanced Strings',
  leetcodeNumber: 1221,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Balanced strings have equal numbers of L and R characters. Given a balanced string s, split it into the maximum number of balanced substrings. Greedy: every time the running count of L equals the running count of R, we have found a balanced substring.',
  tags: ['string', 'greedy', 'counting'],

  code: {
    pseudocode: `function balancedStringSplit(s):
  count = 0
  balance = 0
  for char in s:
    if char == 'L': balance++
    else: balance--
    if balance == 0:
      count++
  return count`,

    python: `def balancedStringSplit(s: str) -> int:
    count = 0
    balance = 0
    for c in s:
        if c == 'L': balance += 1
        else: balance -= 1
        if balance == 0: count += 1
    return count`,

    javascript: `function balancedStringSplit(s) {
  let count = 0, balance = 0;
  for (const c of s) {
    if (c === 'L') balance++;
    else balance--;
    if (balance === 0) count++;
  }
  return count;
}`,

    java: `public int balancedStringSplit(String s) {
    int count = 0, balance = 0;
    for (char c : s.toCharArray()) {
        if (c == 'L') balance++;
        else balance--;
        if (balance == 0) count++;
    }
    return count;
}`,
  },

  defaultInput: {
    s: 'RLRRLLRLRL',
  },

  inputFields: [
    {
      name: 's',
      label: 'Balanced String',
      type: 'string',
      defaultValue: 'RLRRLLRLRL',
      placeholder: 'RLRRLLRLRL',
      helperText: 'String of R and L characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

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
      explanation: `Find maximum balanced LR substrings in "${s}". When balance reaches 0, we have a balanced substring.`,
      variables: { s, count: 0, balance: 0 },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    let balance = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === 'L') balance++;
      else balance--;

      steps.push({
        line: 4,
        explanation: `s[${i}]="${c}": balance ${c === 'L' ? 'increased' : 'decreased'} to ${balance}.${balance === 0 ? ' Balance is 0 => found a balanced substring!' : ''}`,
        variables: { i, char: c, balance, count },
        visualization: makeViz(
          { [i]: balance === 0 ? 'found' : 'active' },
          { [i]: `bal=${balance}` }
        ),
      });

      if (balance === 0) {
        count++;
        steps.push({
          line: 7,
          explanation: `Balance hit 0 at index ${i}. Increment count to ${count}. Start a new balanced substring.`,
          variables: { count, splitAt: i },
          visualization: makeViz({ [i]: 'sorted' }, { [i]: `split#${count}` }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Maximum balanced substrings: ${count}.`,
      variables: { result: count },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default splitAStringInBalancedStrings;
