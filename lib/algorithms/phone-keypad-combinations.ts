import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const phoneKeypadCombinations: AlgorithmDefinition = {
  id: 'phone-keypad-combinations',
  title: 'Phone Keypad Combinations',
  leetcodeNumber: 17,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string of digits 2-9, return all possible letter combinations that the digits could represent on a phone keypad. We use backtracking: for each digit, try all its mapped letters and recurse to the next digit.',
  tags: ['Backtracking', 'Recursion', 'String'],
  code: {
    pseudocode: `mapping = {
  '2':'abc', '3':'def', '4':'ghi',
  '5':'jkl', '6':'mno', '7':'pqrs',
  '8':'tuv', '9':'wxyz'
}

function letterCombinations(digits):
  if digits is empty: return []
  result = []
  backtrack(digits, 0, "", result)
  return result

function backtrack(digits, index, current, result):
  if index == digits.length:
    result.append(current)
    return
  for letter in mapping[digits[index]]:
    backtrack(digits, index+1, current+letter, result)`,
    python: `def letterCombinations(digits):
    if not digits:
        return []
    mapping = {
        '2':'abc','3':'def','4':'ghi',
        '5':'jkl','6':'mno','7':'pqrs',
        '8':'tuv','9':'wxyz'
    }
    result = []
    def backtrack(index, current):
        if index == len(digits):
            result.append(current)
            return
        for letter in mapping[digits[index]]:
            backtrack(index + 1, current + letter)
    backtrack(0, "")
    return result`,
    javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const mapping = {
    '2':'abc','3':'def','4':'ghi',
    '5':'jkl','6':'mno','7':'pqrs',
    '8':'tuv','9':'wxyz'
  };
  const result = [];
  function backtrack(index, current) {
    if (index === digits.length) {
      result.push(current);
      return;
    }
    for (const letter of mapping[digits[index]]) {
      backtrack(index + 1, current + letter);
    }
  }
  backtrack(0, "");
  return result;
}`,
    java: `public List<String> letterCombinations(String digits) {
    List<String> result = new ArrayList<>();
    if (digits.isEmpty()) return result;
    String[] mapping = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    backtrack(digits, 0, new StringBuilder(), mapping, result);
    return result;
}
void backtrack(String digits, int index, StringBuilder current,
               String[] mapping, List<String> result) {
    if (index == digits.length()) {
        result.add(current.toString());
        return;
    }
    for (char letter : mapping[digits.charAt(index) - '0'].toCharArray()) {
        current.append(letter);
        backtrack(digits, index + 1, current, mapping, result);
        current.deleteCharAt(current.length() - 1);
    }
}`,
  },
  defaultInput: { digits: '23' },
  inputFields: [
    {
      name: 'digits',
      label: 'Digits',
      type: 'string',
      defaultValue: '23',
      placeholder: 'e.g. 23',
      helperText: 'String of digits 2-9.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const digits = input.digits as string;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    const mapping: Record<string, string> = {
      '2': 'abc', '3': 'def', '4': 'ghi',
      '5': 'jkl', '6': 'mno', '7': 'pqrs',
      '8': 'tuv', '9': 'wxyz',
    };

    function makeViz(digitIdx: number, letterIdx: number | null, current: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < digits.length; i++) {
        labels[i] = `${digits[i]} (${mapping[digits[i]] || ''})`;
        if (i < digitIdx) {
          highlights[i] = 'found';
        } else if (i === digitIdx) {
          highlights[i] = 'active';
        }
      }

      return {
        type: 'array',
        array: digits.split('').map(d => parseInt(d)),
        highlights,
        labels,
        auxData: {
          label: 'State',
          entries: [
            { key: 'Building', value: `"${current}"` },
            { key: 'Digit', value: digitIdx < digits.length ? `${digits[digitIdx]} -> [${(mapping[digits[digitIdx]] || '').split('').join(', ')}]` : 'done' },
            { key: 'Combos', value: `${result.length}` },
            ...result.slice(-8).map((c, i) => ({ key: `  ${result.length - 8 + i + 1 > 0 ? result.length - Math.min(8, result.length) + i + 1 : i + 1}`, value: `"${c}"` })),
          ],
        },
      };
    }

    if (digits.length === 0) {
      steps.push({
        line: 7,
        explanation: 'Empty digit string. Return empty list.',
        variables: { result: [] },
        visualization: { type: 'array', array: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 7,
      explanation: `Generate letter combinations for digits "${digits}". Map: ${digits.split('').map(d => `${d}->[${mapping[d]}]`).join(', ')}.`,
      variables: { digits, mapping: digits.split('').map(d => ({ digit: d, letters: mapping[d] })) },
      visualization: makeViz(0, null, ''),
    });

    function backtrack(index: number, current: string): void {
      if (index === digits.length) {
        result.push(current);
        steps.push({
          line: 13,
          explanation: `All digits processed. Add "${current}" to results. Total: ${result.length}.`,
          variables: { combination: current, count: result.length },
          visualization: makeViz(index, null, current),
        });
        return;
      }

      const digit = digits[index];
      const letters = mapping[digit] || '';

      for (let li = 0; li < letters.length; li++) {
        const letter = letters[li];

        steps.push({
          line: 15,
          explanation: `Digit '${digit}' (index ${index}): try letter '${letter}'. Building: "${current}${letter}".`,
          variables: { digit, letter, current: current + letter, digitIndex: index },
          visualization: makeViz(index, li, current + letter),
        });

        backtrack(index + 1, current + letter);

        if (li < letters.length - 1) {
          steps.push({
            line: 15,
            explanation: `Backtrack from '${letter}'. Try next letter for digit '${digit}'.`,
            variables: { digit, backtrackFrom: letter, current },
            visualization: makeViz(index, null, current),
          });
        }
      }
    }

    backtrack(0, '');

    steps.push({
      line: 9,
      explanation: `All ${result.length} letter combinations generated for "${digits}".`,
      variables: { totalCombinations: result.length },
      visualization: {
        type: 'array',
        array: digits.split('').map(d => parseInt(d)),
        highlights: Object.fromEntries(digits.split('').map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(digits.split('').map((d, i) => [i, `${d} (${mapping[d]})`])),
        auxData: {
          label: `All ${result.length} Combinations`,
          entries: result.map((c, i) => ({ key: `${i + 1}`, value: `"${c}"` })),
        },
      },
    });

    return steps;
  },
};

export default phoneKeypadCombinations;
