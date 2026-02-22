import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const letterCombinationsOfPhoneNumberIi: AlgorithmDefinition = {
  id: 'letter-combinations-of-phone-number-ii',
  title: 'Letter Combinations of a Phone Number II (Iterative)',
  leetcodeNumber: 17,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string containing digits from 2-9, return all possible letter combinations the number could represent using iterative BFS-style expansion rather than recursive DFS. Each digit maps to letters on a phone keypad. Build combinations level by level.',
  tags: ['backtracking', 'string', 'iterative', 'bfs', 'phone keypad'],

  code: {
    pseudocode: `function letterCombinations(digits):
  if digits is empty: return []
  map = {2:abc, 3:def, 4:ghi, 5:jkl, 6:mno, 7:pqrs, 8:tuv, 9:wxyz}
  result = [""]
  for each digit in digits:
    nextLevel = []
    for each combo in result:
      for each letter in map[digit]:
        nextLevel.push(combo + letter)
    result = nextLevel
  return result`,

    python: `def letterCombinations(digits: str) -> list[str]:
    if not digits:
        return []
    phone_map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    result = ['']
    for digit in digits:
        next_level = []
        for combo in result:
            for letter in phone_map[digit]:
                next_level.append(combo + letter)
        result = next_level
    return result`,

    javascript: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const phoneMap = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  let result = [''];
  for (const digit of digits) {
    const nextLevel = [];
    for (const combo of result) {
      for (const letter of phoneMap[digit]) {
        nextLevel.push(combo + letter);
      }
    }
    result = nextLevel;
  }
  return result;
}`,

    java: `public List<String> letterCombinations(String digits) {
    if (digits.isEmpty()) return new ArrayList<>();
    Map<Character, String> phoneMap = Map.of(
        '2', "abc", '3', "def", '4', "ghi", '5', "jkl",
        '6', "mno", '7', "pqrs", '8', "tuv", '9', "wxyz"
    );
    List<String> result = new ArrayList<>(List.of(""));
    for (char digit : digits.toCharArray()) {
        List<String> nextLevel = new ArrayList<>();
        for (String combo : result) {
            for (char letter : phoneMap.get(digit).toCharArray()) {
                nextLevel.add(combo + letter);
            }
        }
        result = nextLevel;
    }
    return result;
}`,
  },

  defaultInput: {
    digits: '23',
  },

  inputFields: [
    {
      name: 'digits',
      label: 'Digit String',
      type: 'string',
      defaultValue: '23',
      placeholder: '23',
      helperText: 'String of digits from 2-9',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const digits = input.digits as string;
    const steps: AlgorithmStep[] = [];

    const phoneMap: Record<string, string> = {
      '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
      '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
    };

    if (!digits || digits.length === 0) {
      steps.push({
        line: 2,
        explanation: 'Input is empty, return empty array.',
        variables: { digits: '', result: [] },
        visualization: {
          type: 'array',
          array: [],
          highlights: {},
          labels: {},
        },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Starting iterative letter combinations for digits "${digits}". Initialize result with empty string as seed.`,
      variables: { digits, result: [''] },
      visualization: {
        type: 'array',
        array: digits.split('').map(Number),
        highlights: {},
        labels: {},
      },
    });

    let result: string[] = [''];

    for (let di = 0; di < digits.length; di++) {
      const digit = digits[di];
      const letters = phoneMap[digit];

      steps.push({
        line: 5,
        explanation: `Processing digit "${digit}" which maps to letters "${letters}". Current combinations: [${result.map(s => s === '' ? '""' : `"${s}"`).join(', ')}]`,
        variables: { digit, letters, currentCombos: result.length, digitIndex: di },
        visualization: {
          type: 'array',
          array: digits.split('').map(Number),
          highlights: { [di]: 'active' },
          labels: { [di]: 'digit' },
        },
      });

      const nextLevel: string[] = [];

      for (const combo of result) {
        for (const letter of letters) {
          const newCombo = combo + letter;
          nextLevel.push(newCombo);

          steps.push({
            line: 8,
            explanation: `Extending "${combo === '' ? '(empty)' : combo}" with letter "${letter}" -> "${newCombo}"`,
            variables: { currentCombo: combo || '(empty)', letter, newCombo, nextLevelSize: nextLevel.length },
            visualization: {
              type: 'array',
              array: digits.split('').map(Number),
              highlights: { [di]: 'comparing' },
              labels: { [di]: `+${letter}` },
            },
          });
        }
      }

      result = nextLevel;

      steps.push({
        line: 10,
        explanation: `Finished digit "${digit}". Level now has ${result.length} combinations: [${result.slice(0, 6).map(s => `"${s}"`).join(', ')}${result.length > 6 ? '...' : ''}]`,
        variables: { digit, combinationsCount: result.length },
        visualization: {
          type: 'array',
          array: digits.split('').map(Number),
          highlights: { [di]: 'sorted' },
          labels: { [di]: 'done' },
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `All digits processed. Final result: ${result.length} combinations: [${result.map(s => `"${s}"`).join(', ')}]`,
      variables: { totalCombinations: result.length, result },
      visualization: {
        type: 'array',
        array: digits.split('').map(Number),
        highlights: digits.split('').reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: {},
      },
    });

    return steps;
  },
};

export default letterCombinationsOfPhoneNumberIi;
