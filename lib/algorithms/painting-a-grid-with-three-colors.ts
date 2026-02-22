import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const paintingAGridWithThreeColors: AlgorithmDefinition = {
  id: 'painting-a-grid-with-three-colors',
  title: 'Painting a Grid With Three Different Colors',
  leetcodeNumber: 1931,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count ways to paint an m x n grid with 3 colors such that no two adjacent cells (horizontal or vertical) share the same color. Use column-by-column bitmask DP. Each column pattern is a base-3 number; valid patterns have no two adjacent same-color cells vertically. Transition: two column patterns are compatible if no horizontal match.',
  tags: ['dynamic programming', 'bitmask', 'combinatorics'],

  code: {
    pseudocode: `function colorTheGrid(m, n):
  MOD = 1e9 + 7
  validPatterns = all m-length base-3 strings with no vertical repeats
  compatible[p] = patterns q where no column position has same color
  dp[p] = 1 for all valid p (first column)
  for col from 1 to n-1:
    newDp[q] = sum(dp[p] for p compatible with q)
    dp = newDp
  return sum(dp)`,
    python: `def colorTheGrid(m: int, n: int) -> int:
    MOD = 10**9 + 7
    def valid(mask):
        prev = -1
        for _ in range(m):
            c = mask % 3
            if c == prev: return False
            prev = c
            mask //= 3
        return True
    patterns = [p for p in range(3**m) if valid(p)]
    def compatible(a, b):
        for _ in range(m):
            if a % 3 == b % 3: return False
            a //= 3; b //= 3
        return True
    trans = {p: [q for q in patterns if compatible(p, q)] for p in patterns}
    dp = {p: 1 for p in patterns}
    for _ in range(n - 1):
        ndp = {q: 0 for q in patterns}
        for p in patterns:
            for q in trans[p]:
                ndp[q] = (ndp[q] + dp[p]) % MOD
        dp = ndp
    return sum(dp.values()) % MOD`,
    javascript: `function colorTheGrid(m, n) {
  const MOD = 1e9 + 7;
  const total = 3 ** m;
  const isValid = mask => {
    let prev = -1, k = mask;
    for (let i = 0; i < m; i++) {
      const c = k % 3;
      if (c === prev) return false;
      prev = c; k = Math.floor(k / 3);
    }
    return true;
  };
  const patterns = [];
  for (let p = 0; p < total; p++) if (isValid(p)) patterns.push(p);
  const compat = (a, b) => {
    for (let i = 0; i < m; i++) {
      if (a % 3 === b % 3) return false;
      a = Math.floor(a/3); b = Math.floor(b/3);
    }
    return true;
  };
  const trans = new Map(patterns.map(p => [p, patterns.filter(q => compat(p, q))]));
  let dp = new Map(patterns.map(p => [p, 1]));
  for (let col = 1; col < n; col++) {
    const ndp = new Map(patterns.map(p => [p, 0]));
    for (const p of patterns)
      for (const q of trans.get(p))
        ndp.set(q, (ndp.get(q) + dp.get(p)) % MOD);
    dp = ndp;
  }
  return [...dp.values()].reduce((a, b) => (a + b) % MOD, 0);
}`,
    java: `// See Python/JS for concise implementation`,
  },

  defaultInput: {
    m: 2,
    n: 3,
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in the grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;
    const total = Math.pow(3, m);

    const isValid = (mask: number): boolean => {
      let prev = -1;
      let k = mask;
      for (let i = 0; i < m; i++) {
        const c = k % 3;
        if (c === prev) return false;
        prev = c;
        k = Math.floor(k / 3);
      }
      return true;
    };

    const patterns: number[] = [];
    for (let p = 0; p < total; p++) {
      if (isValid(p)) patterns.push(p);
    }

    const compat = (a: number, b: number): boolean => {
      let aa = a;
      let bb = b;
      for (let i = 0; i < m; i++) {
        if (aa % 3 === bb % 3) return false;
        aa = Math.floor(aa / 3);
        bb = Math.floor(bb / 3);
      }
      return true;
    };

    const trans = new Map<number, number[]>(patterns.map(p => [p, patterns.filter(q => compat(p, q))]));

    steps.push({
      line: 3,
      explanation: `m=${m} rows, n=${n} cols. Valid column patterns (no vertical color repeat): ${patterns.length} out of ${total} possible.`,
      variables: { m, n, validPatterns: patterns.length },
      visualization: {
        type: 'array',
        array: [...patterns],
        highlights: Object.fromEntries(patterns.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(patterns.map((p, i) => [i, `p${p}`])),
      },
    });

    let dp = new Map<number, number>(patterns.map(p => [p, 1]));

    steps.push({
      line: 5,
      explanation: `Initialize: each valid column pattern has 1 way for column 0.`,
      variables: { numPatterns: patterns.length },
      visualization: {
        type: 'array',
        array: patterns.map(() => 1),
        highlights: Object.fromEntries(patterns.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(patterns.map((p, i) => [i, `p${p}`])),
      },
    });

    for (let col = 1; col < n; col++) {
      const ndp = new Map<number, number>(patterns.map(p => [p, 0]));
      for (const p of patterns) {
        for (const q of trans.get(p)!) {
          ndp.set(q, (ndp.get(q)! + dp.get(p)!) % MOD);
        }
      }
      dp = ndp;
      const total_ways = [...dp.values()].reduce((a, b) => (a + b) % MOD, 0);
      steps.push({
        line: 7,
        explanation: `After column ${col}: total ways so far = ${total_ways}.`,
        variables: { column: col, totalWays: total_ways },
        visualization: {
          type: 'array',
          array: [...dp.values()],
          highlights: { 0: 'found' },
          labels: Object.fromEntries([...dp.keys()].map((p, i) => [i, `p${p}`])),
        },
      });
    }

    const result = [...dp.values()].reduce((a, b) => (a + b) % MOD, 0);
    steps.push({
      line: 8,
      explanation: `Total valid colorings for ${m}x${n} grid with 3 colors = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...dp.values()],
        highlights: Object.fromEntries([...dp.values()].map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default paintingAGridWithThreeColors;
