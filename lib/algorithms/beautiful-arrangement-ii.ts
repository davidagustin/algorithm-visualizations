import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const beautifulArrangementII: AlgorithmDefinition = {
  id: 'beautiful-arrangement-ii',
  title: 'Beautiful Arrangement II',
  leetcodeNumber: 667,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Construct an array using integers 1 to n such that there are exactly k distinct absolute differences between adjacent elements. Use a greedy interleaving strategy: first k+1 elements alternate max/min to create k distinct diffs, then fill remaining in sorted order.',
  tags: ['Dynamic Programming', 'Array', 'Greedy', 'Construction'],
  code: {
    pseudocode: `function constructArray(n, k):
  result = []
  lo = 1, hi = k + 1
  for i from 0 to k:
    if i % 2 == 0: result.append(lo++)
    else: result.append(hi--)
  for i from k+1 to n-1:
    result.append(k + 1 + (i - k))
  return result`,
    python: `def constructArray(n, k):
    result = []
    lo, hi = 1, k + 1
    for i in range(k + 1):
        if i % 2 == 0:
            result.append(lo)
            lo += 1
        else:
            result.append(hi)
            hi -= 1
    for i in range(k + 2, n + 1):
        result.append(i)
    return result`,
    javascript: `function constructArray(n, k) {
  const result = [];
  let lo = 1, hi = k + 1;
  for (let i = 0; i <= k; i++) {
    if (i % 2 === 0) result.push(lo++);
    else result.push(hi--);
  }
  for (let i = k + 2; i <= n; i++) result.push(i);
  return result;
}`,
    java: `public int[] constructArray(int n, int k) {
    int[] result = new int[n];
    int lo = 1, hi = k + 1;
    for (int i = 0; i <= k; i++) {
        if (i % 2 == 0) result[i] = lo++;
        else result[i] = hi--;
    }
    for (int i = k + 1; i < n; i++) result[i] = i + 1;
    return result;
}`,
  },
  defaultInput: { n: 7, k: 4 },
  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Array uses integers 1 to n',
    },
    {
      name: 'k',
      label: 'K (distinct differences)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of distinct adjacent differences required',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 10);
    const k = Math.min(input.k as number, n - 1);
    const result: (number | null)[] = new Array(n).fill(null);
    const labels: string[] = Array.from({ length: n }, (_, i) => `pos${i}`);
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (result[i] !== null) highlights[i] = 'found';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: result.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `n=${n}, k=${k}. Strategy: alternate high/low for first k+1 positions to get k distinct diffs, then fill remaining sequentially.`,
      variables: { n, k },
      visualization: makeViz(null),
    });

    let lo = 1, hi = k + 1;
    for (let i = 0; i <= k; i++) {
      if (i % 2 === 0) {
        result[i] = lo++;
      } else {
        result[i] = hi--;
      }
      const diff = i > 0 ? Math.abs((result[i] as number) - (result[i-1] as number)) : 0;
      steps.push({
        line: 4,
        explanation: `pos[${i}]=${result[i]} (${i%2===0?'lo':'hi'}). ${i>0?`diff=${diff}`:'first element'}.`,
        variables: { i, 'result[i]': result[i], lo, hi, diff },
        visualization: makeViz(i),
      });
    }

    for (let i = k + 2; i <= n; i++) {
      result[i - 1] = i;
      const diff = Math.abs((result[i-1] as number) - (result[i-2] as number));
      steps.push({
        line: 7,
        explanation: `pos[${i-1}]=${i} (sequential fill). diff with prev=${diff}.`,
        variables: { i: i-1, 'result[i-1]': i, diff },
        visualization: makeViz(i - 1),
      });
    }

    const diffs = new Set<number>();
    for (let i = 1; i < n; i++) {
      diffs.add(Math.abs((result[i] as number) - (result[i-1] as number)));
    }
    steps.push({
      line: 9,
      explanation: `Result=${JSON.stringify(result)}. Distinct diffs=${JSON.stringify([...diffs])} (count=${diffs.size}). k=${k} achieved.`,
      variables: { result: result.slice(), distinctDiffs: [...diffs], count: diffs.size },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default beautifulArrangementII;
