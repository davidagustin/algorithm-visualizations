import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const paintFence: AlgorithmDefinition = {
  id: 'paint-fence',
  title: 'Paint Fence',
  leetcodeNumber: 276,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given n fence posts and k colors, count the number of ways to paint them such that no more than 2 adjacent posts have the same color. Track two DP values: same (last two posts match) and diff (last two posts differ). At each step, diff = (k-1) * (same + diff), same = diff from previous step.',
  tags: ['dynamic programming', 'combinatorics', 'counting'],

  code: {
    pseudocode: `function numWays(n, k):
  if n == 0: return 0
  if n == 1: return k
  same = k, diff = k*(k-1)
  for i from 3 to n:
    new_same = diff
    new_diff = (same + diff) * (k - 1)
    same = new_same
    diff = new_diff
  return same + diff`,

    python: `def numWays(n: int, k: int) -> int:
    if n == 0: return 0
    if n == 1: return k
    same = k
    diff = k * (k - 1)
    for _ in range(3, n + 1):
        same, diff = diff, (same + diff) * (k - 1)
    return same + diff`,

    javascript: `function numWays(n, k) {
  if (n === 0) return 0;
  if (n === 1) return k;
  let same = k, diff = k * (k - 1);
  for (let i = 3; i <= n; i++) {
    [same, diff] = [diff, (same + diff) * (k - 1)];
  }
  return same + diff;
}`,

    java: `public int numWays(int n, int k) {
    if (n == 0) return 0;
    if (n == 1) return k;
    int same = k, diff = k * (k - 1);
    for (int i = 3; i <= n; i++) {
        int newSame = diff;
        int newDiff = (same + diff) * (k - 1);
        same = newSame;
        diff = newDiff;
    }
    return same + diff;
}`,
  },

  defaultInput: { n: 4, k: 3 },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Posts (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of fence posts',
    },
    {
      name: 'k',
      label: 'Number of Colors (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of available colors',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    if (n === 0) {
      steps.push({
        line: 2,
        explanation: 'n=0: no fence posts, return 0.',
        variables: { result: 0 },
        visualization: { type: 'dp-table', values: [0], highlights: {}, labels: ['result'] },
      });
      return steps;
    }

    if (n === 1) {
      steps.push({
        line: 3,
        explanation: `n=1: one post, paint it any of ${k} colors. Return ${k}.`,
        variables: { result: k },
        visualization: { type: 'dp-table', values: [k], highlights: { 0: 'found' }, labels: ['post1'] },
      });
      return steps;
    }

    let same = k;
    let diff = k * (k - 1);

    const tableValues = [same + diff];
    steps.push({
      line: 4,
      explanation: `n=2: same=${same} (both posts same color: k ways), diff=${diff} (different colors: k*(k-1) ways). Total=${same + diff}.`,
      variables: { post: 2, same, diff, total: same + diff },
      visualization: {
        type: 'dp-table',
        values: [same, diff],
        highlights: { 0: 'active', 1: 'active' },
        labels: ['same', 'diff'],
      },
    });

    for (let i = 3; i <= n; i++) {
      const newSame = diff;
      const newDiff = (same + diff) * (k - 1);
      same = newSame;
      diff = newDiff;
      tableValues.push(same + diff);

      steps.push({
        line: 7,
        explanation: `Post ${i}: new_same = prev_diff = ${same} (extend matching pair); new_diff = (prev_same + prev_diff) * (k-1) = ${newSame + newDiff / (k - 1)} * ${k - 1} = ${diff}. Total=${same + diff}.`,
        variables: { post: i, same, diff, total: same + diff },
        visualization: {
          type: 'dp-table',
          values: [...tableValues],
          highlights: { [tableValues.length - 1]: 'active' },
          labels: tableValues.map((_, idx) => `post${idx + 2}`),
        } as DPVisualization,
      });
    }

    steps.push({
      line: 9,
      explanation: `Total ways to paint ${n} posts with ${k} colors (no 3 in a row same) = same + diff = ${same} + ${diff} = ${same + diff}.`,
      variables: { n, k, same, diff, result: same + diff },
      visualization: {
        type: 'dp-table',
        values: [same, diff],
        highlights: { 0: 'found', 1: 'found' },
        labels: ['same', 'diff'],
      },
    });

    return steps;
  },
};

export default paintFence;
