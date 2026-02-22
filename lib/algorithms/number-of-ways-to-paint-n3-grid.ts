import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfWaysToPaintN3Grid: AlgorithmDefinition = {
  id: 'number-of-ways-to-paint-n3-grid',
  title: 'Number of Ways to Paint N x 3 Grid',
  leetcodeNumber: 1411,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count the number of ways to color an n x 3 grid with 3 colors such that no two adjacent cells (horizontally or vertically) share the same color. Uses pattern-based DP: each row can be one of two pattern types - ABA (e.g. 1-2-1) or ABC (e.g. 1-2-3). Track how patterns transition between rows.',
  tags: ['dynamic programming', 'state compression', 'combinatorics', 'math'],

  code: {
    pseudocode: `function numOfWays(n):
  // ABA pattern: 6 valid rows (like 1-2-1, 2-1-2, etc.)
  // ABC pattern: 6 valid rows (like 1-2-3, 1-3-2, etc.)
  // ABA -> ABA: 3 transitions each
  // ABA -> ABC: 2 transitions each
  // ABC -> ABA: 2 transitions each
  // ABC -> ABC: 2 transitions each
  aba = 6, abc = 6
  for i from 2 to n:
    new_aba = 3*aba + 2*abc
    new_abc = 2*aba + 2*abc
    aba = new_aba % MOD
    abc = new_abc % MOD
  return (aba + abc) % MOD`,
    python: `def numOfWays(n: int) -> int:
    MOD = 10**9 + 7
    aba, abc = 6, 6
    for _ in range(n - 1):
        aba, abc = (3*aba + 2*abc) % MOD, (2*aba + 2*abc) % MOD
    return (aba + abc) % MOD`,
    javascript: `function numOfWays(n) {
  const MOD = 1000000007n;
  let aba = 6n, abc = 6n;
  for (let i = 1; i < n; i++) {
    [aba, abc] = [(3n*aba + 2n*abc) % MOD, (2n*aba + 2n*abc) % MOD];
  }
  return Number((aba + abc) % MOD);
}`,
    java: `public int numOfWays(int n) {
    long MOD = 1_000_000_007L;
    long aba = 6, abc = 6;
    for (int i = 1; i < n; i++) {
        long newAba = (3*aba + 2*abc) % MOD;
        long newAbc = (2*aba + 2*abc) % MOD;
        aba = newAba; abc = newAbc;
    }
    return (int)((aba + abc) % MOD);
}`,
  },

  defaultInput: {
    n: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N (rows)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of rows in the N x 3 grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;
    const display = Math.min(n, 8);

    const abaArr: number[] = [];
    const abcArr: number[] = [];

    steps.push({
      line: 1,
      explanation: `Paint N=${n} x 3 Grid. Two row pattern types: ABA (like 1-2-1, 6 variants) and ABC (like 1-2-3, 6 variants).`,
      variables: { n, initial_ABA: 6, initial_ABC: 6 },
      visualization: {
        type: 'array',
        array: [1, 2, 1],
        highlights: { 0: 'active', 1: 'comparing', 2: 'active' },
        labels: { 0: 'A', 1: 'B', 2: 'A' },
      },
    });

    steps.push({
      line: 3,
      explanation: 'Transitions per row: ABA->ABA=3, ABA->ABC=2, ABC->ABA=2, ABC->ABC=2. These are the valid color-change counts.',
      variables: { 'ABA->ABA': 3, 'ABA->ABC': 2, 'ABC->ABA': 2, 'ABC->ABC': 2 },
      visualization: {
        type: 'array',
        array: [3, 2, 2, 2],
        highlights: { 0: 'found', 1: 'active', 2: 'active', 3: 'comparing' },
        labels: { 0: 'AA', 1: 'AB', 2: 'BA', 3: 'BB' },
      },
    });

    let aba = 6;
    let abc = 6;
    abaArr.push(aba);
    abcArr.push(abc);

    for (let i = 1; i < display; i++) {
      const newAba = (3 * aba + 2 * abc) % MOD;
      const newAbc = (2 * aba + 2 * abc) % MOD;
      aba = newAba;
      abc = newAbc;
      abaArr.push(aba);
      abcArr.push(abc);

      steps.push({
        line: 8,
        explanation: `Row ${i + 1}: ABA_ways=${aba} (3*prev_aba + 2*prev_abc), ABC_ways=${abc} (2*prev_aba + 2*prev_abc).`,
        variables: { row: i + 1, ABA_ways: aba, ABC_ways: abc, total: (aba + abc) % MOD },
        visualization: {
          type: 'array',
          array: abaArr.slice(0, i + 1),
          highlights: { [i]: 'found' },
          labels: { [i]: `aba=${aba}` },
        },
      });
    }

    // Continue to n if needed
    for (let i = display; i < n; i++) {
      const newAba = (3 * aba + 2 * abc) % MOD;
      const newAbc = (2 * aba + 2 * abc) % MOD;
      aba = newAba;
      abc = newAbc;
    }

    const result = (aba + abc) % MOD;
    steps.push({
      line: 11,
      explanation: `For n=${n} rows: ABA=${aba}, ABC=${abc}. Total = (${aba} + ${abc}) % MOD = ${result}.`,
      variables: { n, ABA_final: aba, ABC_final: abc, result },
      visualization: {
        type: 'array',
        array: [aba % 100, abc % 100, result % 100],
        highlights: { 0: 'active', 1: 'comparing', 2: 'found' },
        labels: { 0: `ABA`, 1: `ABC`, 2: `total` },
      },
    });

    return steps;
  },
};

export default numberOfWaysToPaintN3Grid;
