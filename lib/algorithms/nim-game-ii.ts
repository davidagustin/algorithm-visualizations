import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nimGameII: AlgorithmDefinition = {
  id: 'nim-game-ii',
  title: 'Nim Game II (LC 292)',
  leetcodeNumber: 292,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given n stones, two players alternately remove 1, 2, or 3 stones. The player who takes the last stone wins. You can win iff n mod 4 != 0.',
  tags: ['Math', 'Game Theory', 'Nim'],
  code: {
    pseudocode: `function canWinNim(n):
  # You win iff n is not a multiple of 4
  return n mod 4 != 0`,
    python: `def canWinNim(n: int) -> bool:
    return n % 4 != 0`,
    javascript: `function canWinNim(n) {
  return n % 4 !== 0;
}`,
    java: `public boolean canWinNim(int n) {
    return n % 4 != 0;
}`,
  },
  defaultInput: { n: 13 },
  inputFields: [
    {
      name: 'n',
      label: 'n (stones)',
      type: 'number',
      defaultValue: 13,
      placeholder: 'e.g. 13',
      helperText: 'Number of stones (1-20)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.max(1, input.n as number);
    const capped = Math.min(n, 20);
    const steps: AlgorithmStep[] = [];

    // Build win/lose table for positions 1..capped
    const canWin: boolean[] = new Array(capped + 1).fill(false);
    for (let i = 1; i <= capped; i++) {
      for (let take = 1; take <= 3 && take <= i; take++) {
        if (!canWin[i - take]) { canWin[i] = true; break; }
      }
    }

    const makeViz = (active: number): ArrayVisualization => {
      const arr = Array.from({ length: capped }, (_, i) => i + 1);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < capped; i++) {
        highlights[i] = canWin[i + 1] ? 'found' : 'swapping';
        labels[i] = canWin[i + 1] ? 'W' : 'L';
        if (i + 1 === active) highlights[i] = 'active';
      }
      return { type: 'array', array: arr, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Nim Game: ${n} stones, take 1-3 each turn, last stone wins. Pattern repeats every 4.`,
      variables: { n },
      visualization: makeViz(-1),
    });

    for (let i = 1; i <= Math.min(capped, 12); i++) {
      const rem = i % 4;
      steps.push({
        line: 2,
        explanation: `n=${i}: ${i}%4=${rem}. ${canWin[i] ? 'WIN' : 'LOSE'} — ${canWin[i] ? 'can always leave opponent a multiple of 4.' : 'opponent can always win.'}`,
        variables: { n: i, mod4: rem, canWin: canWin[i] },
        visualization: makeViz(i),
      });
    }

    const result = n % 4 !== 0;
    steps.push({
      line: 3,
      explanation: `For n=${n}: ${n}%4=${n % 4}. You ${result ? 'WIN' : 'LOSE'} with optimal play.`,
      variables: { n, mod4: n % 4, result },
      visualization: {
        type: 'array',
        array: [n, n % 4],
        highlights: { 0: 'active', 1: result ? 'sorted' : 'swapping' },
        labels: { 0: 'n', 1: result ? 'WIN' : 'LOSE' },
      },
    });

    return steps;
  },
};

export default nimGameII;
