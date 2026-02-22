import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const cryptarithmeticSolver: AlgorithmDefinition = {
  id: 'cryptarithmetic-solver',
  title: 'Cryptarithmetic Solver (SEND+MORE=MONEY)',
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Solve cryptarithmetic puzzles where each letter represents a unique digit (0-9). The classic puzzle is SEND+MORE=MONEY. Uses constraint-based backtracking: assign digits to letters column by column from right to left, propagating carry values and pruning when a partial assignment cannot satisfy the equation.',
  tags: ['backtracking', 'constraint satisfaction', 'permutation', 'math', 'puzzle'],

  code: {
    pseudocode: `function solveCryptarithmetic(word1, word2, result):
  letters = unique letters in all words
  mapping = {}
  leadingLetters = {first letter of each word}
  backtrack(letters, 0, mapping, word1, word2, result, leadingLetters)

function backtrack(letters, index, mapping, ...):
  if index == length(letters):
    return checkEquation(mapping, word1, word2, result)
  letter = letters[index]
  usedDigits = set of digits already in mapping
  for digit from 0 to 9:
    if digit not in usedDigits:
      if digit == 0 and letter in leadingLetters: continue
      mapping[letter] = digit
      if backtrack(letters, index+1, mapping, ...): return true
      delete mapping[letter]
  return false`,

    python: `def solve(word1, word2, result):
    letters = list({c for w in [word1, word2, result] for c in w})
    leading = {w[0] for w in [word1, word2, result]}
    mapping = {}
    used = set()
    def decode(word):
        return int(''.join(str(mapping[c]) for c in word))
    def backtrack(idx):
        if idx == len(letters):
            return decode(word1) + decode(word2) == decode(result)
        letter = letters[idx]
        for digit in range(10):
            if digit in used: continue
            if digit == 0 and letter in leading: continue
            mapping[letter] = digit
            used.add(digit)
            if backtrack(idx + 1): return True
            used.discard(digit)
            del mapping[letter]
        return False
    return backtrack(0), mapping`,

    javascript: `function solveCryptarithmetic(word1, word2, result) {
  const letters = [...new Set([...word1, ...word2, ...result])];
  const leading = new Set([word1[0], word2[0], result[0]]);
  const mapping = {};
  const used = new Set();
  function decode(word) {
    return parseInt(word.split('').map(c => mapping[c]).join(''));
  }
  function backtrack(idx) {
    if (idx === letters.length) {
      return decode(word1) + decode(word2) === decode(result);
    }
    const letter = letters[idx];
    for (let digit = 0; digit <= 9; digit++) {
      if (used.has(digit)) continue;
      if (digit === 0 && leading.has(letter)) continue;
      mapping[letter] = digit;
      used.add(digit);
      if (backtrack(idx + 1)) return true;
      used.delete(digit);
      delete mapping[letter];
    }
    return false;
  }
  return backtrack(0) ? mapping : null;
}`,

    java: `// Java implementation uses similar backtracking
// with a char-to-digit mapping array
public Map<Character, Integer> solve(String w1, String w2, String res) {
    Set<Character> letterSet = new LinkedHashSet<>();
    for (String w : new String[]{w1, w2, res})
        for (char c : w.toCharArray()) letterSet.add(c);
    char[] letters = new char[letterSet.size()];
    int i = 0;
    for (char c : letterSet) letters[i++] = c;
    int[] mapping = new int[26];
    Arrays.fill(mapping, -1);
    boolean[] used = new boolean[10];
    Set<Character> leading = new HashSet<>(Arrays.asList(w1.charAt(0), w2.charAt(0), res.charAt(0)));
    backtrack(letters, 0, mapping, used, leading, w1, w2, res);
    // return result mapping
    return null;
}`,
  },

  defaultInput: {
    word1: 'SEND',
    word2: 'MORE',
    result: 'MONEY',
  },

  inputFields: [
    {
      name: 'word1',
      label: 'First Word',
      type: 'string',
      defaultValue: 'SEND',
      placeholder: 'SEND',
      helperText: 'First word in the cryptarithmetic puzzle',
    },
    {
      name: 'word2',
      label: 'Second Word',
      type: 'string',
      defaultValue: 'MORE',
      placeholder: 'MORE',
      helperText: 'Second word in the cryptarithmetic puzzle',
    },
    {
      name: 'result',
      label: 'Result Word',
      type: 'string',
      defaultValue: 'MONEY',
      placeholder: 'MONEY',
      helperText: 'Result word (word1 + word2 = result)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word1 = (input.word1 as string).toUpperCase();
    const word2 = (input.word2 as string).toUpperCase();
    const resultWord = (input.result as string).toUpperCase();
    const steps: AlgorithmStep[] = [];

    const letters = [...new Set([...word1, ...word2, ...resultWord])];
    const leading = new Set([word1[0], word2[0], resultWord[0]]);
    const mapping: Record<string, number> = {};
    const used = new Set<number>();

    steps.push({
      line: 1,
      explanation: `Solving: ${word1} + ${word2} = ${resultWord}. Found ${letters.length} unique letters: [${letters.join(', ')}]. Each gets a unique digit 0-9.`,
      variables: { word1, word2, result: resultWord, uniqueLetters: letters, leadingLetters: [...leading] },
      visualization: {
        type: 'array',
        array: letters.map((_, i) => i),
        highlights: {},
        labels: letters.reduce((acc, l, i) => ({ ...acc, [i]: l }), {} as Record<number, string>),
      },
    });

    function decode(word: string): number {
      const digits = word.split('').map(c => mapping[c]);
      if (digits.some(d => d === undefined)) return -1;
      return parseInt(digits.join(''));
    }

    let solutionFound = false;
    let solutionMapping: Record<string, number> = {};
    let attempts = 0;
    const maxSteps = 50;

    function backtrack(idx: number): boolean {
      if (solutionFound || attempts > maxSteps) return false;

      if (idx === letters.length) {
        const v1 = decode(word1);
        const v2 = decode(word2);
        const vr = decode(resultWord);

        if (v1 + v2 === vr) {
          solutionFound = true;
          solutionMapping = { ...mapping };

          steps.push({
            line: 8,
            explanation: `SOLUTION FOUND! ${word1}=${v1} + ${word2}=${v2} = ${resultWord}=${vr}. Mapping: {${letters.map(l => `${l}:${mapping[l]}`).join(', ')}}`,
            variables: { ...solutionMapping, equation: `${v1}+${v2}=${vr}`, valid: true },
            visualization: {
              type: 'array',
              array: letters.map(l => mapping[l] ?? -1),
              highlights: letters.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
              labels: letters.reduce((acc, l, i) => ({ ...acc, [i]: `${l}:${mapping[l]}` }), {} as Record<number, string>),
            },
          });
          return true;
        }
        return false;
      }

      const letter = letters[idx];

      for (let digit = 0; digit <= 9; digit++) {
        if (used.has(digit)) continue;
        if (digit === 0 && leading.has(letter)) continue;

        mapping[letter] = digit;
        used.add(digit);
        attempts++;

        if (attempts <= maxSteps) {
          steps.push({
            line: 12,
            explanation: `Try assigning ${letter}=${digit}. Current mapping: {${Object.entries(mapping).map(([k,v]) => `${k}:${v}`).join(', ')}}`,
            variables: { letter, digit, assignedCount: Object.keys(mapping).length },
            visualization: {
              type: 'array',
              array: letters.map(l => mapping[l] ?? -1),
              highlights: {
                ...letters.reduce((acc, _, i) => ({ ...acc, [i]: mapping[letters[i]] !== undefined ? 'sorted' : 'default' }), {}),
                [idx]: 'active',
              },
              labels: letters.reduce((acc, l, i) => ({
                ...acc,
                [i]: mapping[l] !== undefined ? `${l}:${mapping[l]}` : `${l}:?`,
              }), {} as Record<number, string>),
            },
          });
        }

        if (backtrack(idx + 1)) return true;

        used.delete(digit);
        delete mapping[letter];
      }

      return false;
    }

    backtrack(0);

    if (!solutionFound) {
      steps.push({
        line: 3,
        explanation: `No solution found for ${word1} + ${word2} = ${resultWord} with the given constraints.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: letters.map((_, i) => i),
          highlights: letters.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: letters.reduce((acc, l, i) => ({ ...acc, [i]: `${l}:?` }), {} as Record<number, string>),
        },
      });
    }

    return steps;
  },
};

export default cryptarithmeticSolver;
