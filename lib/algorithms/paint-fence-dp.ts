import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const paintFenceDP: AlgorithmDefinition = {
  id: 'paint-fence-dp',
  title: 'Paint Fence',
  leetcodeNumber: 276,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count ways to paint n fence posts with k colors so that at most 2 adjacent posts have the same color. DP: same[i] = ways last two posts are same color, diff[i] = ways last two posts differ. same[i] = diff[i-1], diff[i] = (same[i-1] + diff[i-1]) * (k-1).',
  tags: ['Dynamic Programming', 'State Machine', 'Combinatorics'],
  code: {
    pseudocode: `function numWays(n, k):
  if n == 0: return 0
  if n == 1: return k
  same = k
  diff = k * (k - 1)
  for i from 3 to n:
    newSame = diff
    newDiff = (same + diff) * (k - 1)
    same, diff = newSame, newDiff
  return same + diff`,
    python: `def numWays(n, k):
    if n == 0: return 0
    if n == 1: return k
    same = k
    diff = k * (k - 1)
    for i in range(3, n + 1):
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
        int temp = diff;
        diff = (same + diff) * (k - 1);
        same = temp;
    }
    return same + diff;
}`,
  },
  defaultInput: { n: 4, k: 2 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Posts (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: 'e.g. 4',
      helperText: 'Number of fence posts to paint',
    },
    {
      name: 'k',
      label: 'Number of Colors (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of available colors',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'n=0, no posts to paint. Return 0.',
        variables: { n, k, result: 0 },
        visualization: { type: 'dp-table', values: [0], highlights: { 0: 'active' }, labels: ['result'] },
      });
      return steps;
    }

    if (n === 1) {
      steps.push({
        line: 2,
        explanation: `n=1, only one post. Can paint with any of k=${k} colors. Return ${k}.`,
        variables: { n, k, result: k },
        visualization: { type: 'dp-table', values: [k], highlights: { 0: 'active' }, labels: ['result'] },
      });
      return steps;
    }

    let same = k;
    let diff = k * (k - 1);
    const labels = ['same', 'diff', 'total'];

    function makeViz(activeIdx: number): DPVisualization {
      const total = same + diff;
      const highlights: Record<number, string> = {};
      highlights[0] = activeIdx === 0 ? 'active' : 'found';
      highlights[1] = activeIdx === 1 ? 'active' : 'found';
      highlights[2] = activeIdx === 2 ? 'active' : 'comparing';
      return { type: 'dp-table', values: [same, diff, total], highlights, labels };
    }

    steps.push({
      line: 3,
      explanation: `n=${n}, k=${k}. Base: same=${k} (both posts same color: k choices), diff=${k*(k-1)} (posts differ: k*(k-1) choices).`,
      variables: { n, k, same, diff },
      visualization: makeViz(-1),
    });

    for (let i = 3; i <= n; i++) {
      const newSame = diff;
      const newDiff = (same + diff) * (k - 1);

      steps.push({
        line: 6,
        explanation: `Post ${i}: newSame=${newSame} (= prev diff), newDiff=(${same}+${diff})*(${k}-1)=${newDiff}.`,
        variables: { post: i, newSame, newDiff },
        visualization: makeViz(-1),
      });

      same = newSame;
      diff = newDiff;

      steps.push({
        line: 7,
        explanation: `After post ${i}: same=${same}, diff=${diff}, total=${same + diff}.`,
        variables: { same, diff, total: same + diff },
        visualization: makeViz(2),
      });
    }

    const result = same + diff;
    steps.push({
      line: 8,
      explanation: `Return same+diff = ${same}+${diff} = ${result}. Total ways to paint ${n} posts with ${k} colors.`,
      variables: { result },
      visualization: makeViz(2),
    });

    return steps;
  },
};

export default paintFenceDP;
