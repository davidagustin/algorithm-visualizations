import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const verbalArithmeticPuzzle: AlgorithmDefinition = {
  id: 'verbal-arithmetic-puzzle',
  title: 'Verbal Arithmetic Puzzle',
  leetcodeNumber: 1307,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given an equation of words (SEND + MORE = MONEY), determine if it can be solved by assigning digits 0-9 to each letter uniquely such that the equation holds. No word can have a leading zero. Use backtracking column by column from right to left, pruning invalid assignments early.',
  tags: ['backtracking', 'math', 'hash map', 'constraint satisfaction'],

  code: {
    pseudocode: `function isSolvable(words, result):
  chars = unique letters in words + result
  isLeading = set of first letters that cannot be 0
  charList = list(chars)
  used = set of used digits
  assign = map char -> digit
  function backtrack(idx, col, carry):
    if col == maxLen:
      return carry == 0
    if idx == len(charList):
      total = carry
      for word: if col < len(word): total += assign[word[-1-col]]
      if assign[result[-1-col]] != total % 10: return false
      return backtrack(0, col+1, total // 10)
    c = charList[idx]
    for digit in 0..9:
      if digit not in used and not (digit==0 and c in isLeading):
        assign[c] = digit; used.add(digit)
        if backtrack(idx+1, col, carry): return true
        del assign[c]; used.remove(digit)
    return false
  return backtrack(0, 0, 0)`,
    python: `def isSolvable(words: list[str], result: str) -> bool:
    all_words = words + [result]
    chars = list(set(''.join(all_words)))
    leading = {w[0] for w in all_words if len(w) > 1}
    assign, used = {}, set()
    def bt(idx, col, carry):
        max_len = max(len(w) for w in all_words)
        if col == max_len: return carry == 0
        if idx == len(chars):
            total = carry
            for w in words:
                if col < len(w): total += assign[w[~col]]
            if assign[result[~col]] != total % 10: return False
            return bt(0, col+1, total // 10)
        c = chars[idx]
        for d in range(10):
            if d not in used and not (d == 0 and c in leading):
                assign[c] = d; used.add(d)
                if bt(idx+1, col, carry): return True
                del assign[c]; used.discard(d)
        return False
    return bt(0, 0, 0)`,
    javascript: `function isSolvable(words, result) {
  const allWords = [...words, result];
  const chars = [...new Set(allWords.join(''))];
  const leading = new Set(allWords.filter(w => w.length > 1).map(w => w[0]));
  const assign = {}, used = new Set();
  const maxLen = Math.max(...allWords.map(w => w.length));
  function bt(idx, col, carry) {
    if (col === maxLen) return carry === 0;
    if (idx === chars.length) {
      let total = carry;
      for (const w of words) if (col < w.length) total += assign[w[w.length-1-col]];
      if (assign[result[result.length-1-col]] !== total % 10) return false;
      return bt(0, col+1, Math.floor(total/10));
    }
    const c = chars[idx];
    for (let d = 0; d <= 9; d++) {
      if (!used.has(d) && !(d===0 && leading.has(c))) {
        assign[c]=d; used.add(d);
        if (bt(idx+1, col, carry)) return true;
        delete assign[c]; used.delete(d);
      }
    }
    return false;
  }
  return bt(0, 0, 0);
}`,
    java: `public boolean isSolvable(String[] words, String result) {
    // Collect unique chars, detect leading chars, then backtrack
    // Full implementation uses column-by-column backtracking with pruning
    return backtrack(words, result, new int[26], new boolean[10], 0, 0, 0);
}`,
  },

  defaultInput: { words: ['SEND', 'MORE'], result: 'MONEY' },

  inputFields: [
    {
      name: 'words',
      label: 'Addend Words',
      type: 'array',
      defaultValue: ['SEND', 'MORE'],
      placeholder: 'SEND,MORE',
      helperText: 'Words on the left side of the equation',
    },
    {
      name: 'result',
      label: 'Result Word',
      type: 'string',
      defaultValue: 'MONEY',
      placeholder: 'MONEY',
      helperText: 'Word on the right side of the equation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const result = input.result as string;
    const steps: AlgorithmStep[] = [];

    const allWords = [...words, result];
    const uniqueChars = [...new Set(allWords.join(''))].sort();
    const leadingChars = new Set(allWords.filter(w => w.length > 1).map(w => w[0]));

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Verbal arithmetic: ${words.join(' + ')} = ${result}. Assign digits 0-9 to letters ${uniqueChars.join(', ')} so equation holds. Leading letters [${[...leadingChars].join(', ')}] cannot be 0.`,
      variables: { equation: `${words.join('+')}=${result}`, uniqueLetters: uniqueChars, leadingLetters: [...leadingChars] },
      visualization: makeViz(uniqueChars.map((_, i) => i), {}, Object.fromEntries(uniqueChars.map((c, i) => [i, c]))),
    });

    const assign: Record<string, number> = {};
    const used = new Set<number>();
    const maxLen = Math.max(...allWords.map(w => w.length));
    let found = false;

    function backtrack(idx: number, col: number, carry: number): boolean {
      if (col === maxLen) return carry === 0;
      if (idx === uniqueChars.length) {
        let total = carry;
        for (const w of words) {
          if (col < w.length) total += assign[w[w.length - 1 - col]];
        }
        const resChar = result[result.length - 1 - col];
        if (assign[resChar] !== total % 10) return false;
        return backtrack(0, col + 1, Math.floor(total / 10));
      }

      const c = uniqueChars[idx];

      for (let d = 0; d <= 9; d++) {
        if (used.has(d)) continue;
        if (d === 0 && leadingChars.has(c)) continue;

        assign[c] = d;
        used.add(d);

        if (steps.length < 25) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          uniqueChars.forEach((ch, i) => {
            if (assign[ch] !== undefined) { h[i] = i === idx ? 'active' : 'visited'; l[i] = `${ch}=${assign[ch]}`; }
            else { l[i] = ch; }
          });
          steps.push({
            line: 17,
            explanation: `Try ${c}=${d}. ${d === 0 && leadingChars.has(c) ? 'Skipped (leading zero).' : 'Testing assignment.'}`,
            variables: { letter: c, digit: d, col, carry, assignments: { ...assign } },
            visualization: makeViz(uniqueChars.map((_, i) => i), h, l),
          });
        }

        if (backtrack(idx + 1, col, carry)) {
          found = true;
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          uniqueChars.forEach((ch, i) => { h[i] = 'found'; l[i] = `${ch}=${assign[ch]}`; });
          steps.push({
            line: 5,
            explanation: `Solution found! Assignment: ${uniqueChars.map(ch => `${ch}=${assign[ch]}`).join(', ')}.`,
            variables: { solution: { ...assign }, valid: true },
            visualization: makeViz(uniqueChars.map((_, i) => i), h, l),
          });
          return true;
        }

        delete assign[c];
        used.delete(d);
      }
      return false;
    }

    const solvable = backtrack(0, 0, 0);

    steps.push({
      line: 20,
      explanation: `Puzzle is ${solvable ? 'SOLVABLE' : 'UNSOLVABLE'}. ${solvable ? `Valid digit assignment found.` : 'No valid assignment exists.'}`,
      variables: { solvable, equation: `${words.join('+')}=${result}` },
      visualization: makeViz(uniqueChars.map((_, i) => i), {}, Object.fromEntries(uniqueChars.map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default verbalArithmeticPuzzle;
