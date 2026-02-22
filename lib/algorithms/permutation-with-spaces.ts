import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const permutationWithSpaces: AlgorithmDefinition = {
  id: 'permutation-with-spaces',
  title: 'Permutation of a String with Spaces',
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string, generate all permutations by inserting a space before each character (except the first). For a string of length n, this produces 2^(n-1) permutations. Uses backtracking to explore both choices at each position: include a space before the character or not.',
  tags: ['backtracking', 'string', 'recursion', 'enumeration', 'permutation'],

  code: {
    pseudocode: `function permutationsWithSpaces(str):
  result = []
  backtrack(str, 1, [str[0]], result)
  return result

function backtrack(str, index, current, result):
  if index == length(str):
    result.push(join(current))
    return
  char = str[index]
  current.push(char)
  backtrack(str, index+1, current, result)
  current.pop()
  current.push(' ')
  current.push(char)
  backtrack(str, index+1, current, result)
  current.pop()
  current.pop()`,

    python: `def permutationsWithSpaces(s: str) -> list[str]:
    result = []
    def backtrack(index, current):
        if index == len(s):
            result.append(''.join(current))
            return
        char = s[index]
        # Without space
        current.append(char)
        backtrack(index + 1, current)
        current.pop()
        # With space before char
        current.append(' ')
        current.append(char)
        backtrack(index + 1, current)
        current.pop()
        current.pop()
    backtrack(1, [s[0]])
    return result`,

    javascript: `function permutationsWithSpaces(str) {
  const result = [];
  function backtrack(index, current) {
    if (index === str.length) {
      result.push(current.join(''));
      return;
    }
    const char = str[index];
    // Without space
    current.push(char);
    backtrack(index + 1, current);
    current.pop();
    // With space
    current.push(' ', char);
    backtrack(index + 1, current);
    current.pop(); current.pop();
  }
  backtrack(1, [str[0]]);
  return result;
}`,

    java: `public List<String> permutationsWithSpaces(String str) {
    List<String> result = new ArrayList<>();
    backtrack(str, 1, new StringBuilder(String.valueOf(str.charAt(0))), result);
    return result;
}
private void backtrack(String str, int index, StringBuilder current, List<String> result) {
    if (index == str.length()) { result.add(current.toString()); return; }
    char ch = str.charAt(index);
    current.append(ch);
    backtrack(str, index + 1, current, result);
    current.deleteCharAt(current.length() - 1);
    current.append(' '); current.append(ch);
    backtrack(str, index + 1, current, result);
    current.deleteCharAt(current.length() - 1);
    current.deleteCharAt(current.length() - 1);
}`,
  },

  defaultInput: {
    str: 'ABC',
  },

  inputFields: [
    {
      name: 'str',
      label: 'Input String',
      type: 'string',
      defaultValue: 'ABC',
      placeholder: 'ABC',
      helperText: 'String to generate space permutations for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str = (input.str as string).toUpperCase();
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    steps.push({
      line: 1,
      explanation: `Generating all space permutations of "${str}". At each of ${str.length - 1} interior positions, choose: add space or not. Total: 2^${str.length - 1} = ${Math.pow(2, str.length - 1)} strings.`,
      variables: { input: str, totalStrings: Math.pow(2, str.length - 1) },
      visualization: {
        type: 'array',
        array: str.split('').map((_, i) => i),
        highlights: {},
        labels: str.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function backtrack(index: number, current: string[]) {
      if (index === str.length) {
        const perm = current.join('');
        result.push(perm);

        steps.push({
          line: 7,
          explanation: `Complete permutation: "${perm}". Total found: ${result.length}.`,
          variables: { permutation: perm, count: result.length },
          visualization: {
            type: 'array',
            array: str.split('').map((_, i) => i),
            highlights: str.split('').reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: str.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
          },
        });
        return;
      }

      const char = str[index];

      current.push(char);
      steps.push({
        line: 10,
        explanation: `Position ${index}: add "${char}" WITHOUT space. Current: "${current.join('')}"`,
        variables: { position: index, char, choice: 'no space', current: current.join('') },
        visualization: {
          type: 'array',
          array: str.split('').map((_, i) => i),
          highlights: { [index]: 'active' },
          labels: str.split('').reduce((acc, c, i) => ({
            ...acc,
            [i]: i < index ? c : i === index ? `${c}(no sp)` : c,
          }), {} as Record<number, string>),
        },
      });
      backtrack(index + 1, current);
      current.pop();

      current.push(' ', char);
      steps.push({
        line: 13,
        explanation: `Position ${index}: add " ${char}" WITH space. Current: "${current.join('')}"`,
        variables: { position: index, char, choice: 'with space', current: current.join('') },
        visualization: {
          type: 'array',
          array: str.split('').map((_, i) => i),
          highlights: { [index]: 'comparing' },
          labels: str.split('').reduce((acc, c, i) => ({
            ...acc,
            [i]: i < index ? c : i === index ? `${c}(sp)` : c,
          }), {} as Record<number, string>),
        },
      });
      backtrack(index + 1, current);
      current.pop();
      current.pop();
    }

    backtrack(1, [str[0]]);

    steps.push({
      line: 4,
      explanation: `All ${result.length} permutations with spaces: [${result.map(s => `"${s}"`).join(', ')}]`,
      variables: { total: result.length, result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: result.reduce((acc, s, i) => ({ ...acc, [i]: s }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default permutationWithSpaces;
