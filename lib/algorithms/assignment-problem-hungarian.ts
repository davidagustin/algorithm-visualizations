import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const assignmentProblemHungarian: AlgorithmDefinition = {
  id: 'assignment-problem-hungarian',
  title: 'Assignment Problem (Hungarian Algorithm)',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Assign n workers to n jobs to minimize total cost using the Hungarian Algorithm (bitmask DP). dp[mask] = minimum cost to assign workers 0..popcount(mask)-1 to jobs indicated by mask. Time: O(n^2 * 2^n).',
  tags: ['Dynamic Programming', 'Bitmask', 'Assignment Problem', 'Optimization', 'Bit Manipulation'],
  code: {
    pseudocode: `function hungarian(cost):
  n = number of workers/jobs
  dp = array of size 2^n, fill INF
  dp[0] = 0
  for mask from 0 to 2^n - 1:
    worker = popcount(mask)  // next worker
    if worker >= n: continue
    for job from 0 to n-1:
      if mask has bit job: continue
      dp[mask | (1<<job)] = min(dp[mask|(1<<job)],
                                dp[mask] + cost[worker][job])
  return dp[(1<<n)-1]`,
    python: `def hungarian(cost):
    n = len(cost)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        worker = bin(mask).count('1')
        if worker >= n: continue
        for job in range(n):
            if mask >> job & 1: continue
            dp[mask|(1<<job)] = min(dp[mask|(1<<job)],
                                    dp[mask]+cost[worker][job])
    return dp[(1<<n)-1]`,
    javascript: `function hungarian(cost) {
  const n = cost.length;
  const dp = new Array(1<<n).fill(Infinity);
  dp[0] = 0;
  for (let mask=0;mask<(1<<n);mask++) {
    let worker = 0;
    let tmp = mask;
    while (tmp) { worker += tmp&1; tmp>>=1; }
    if (worker>=n) continue;
    for (let job=0;job<n;job++) {
      if (mask>>job&1) continue;
      dp[mask|(1<<job)] = Math.min(dp[mask|(1<<job)],
                                    dp[mask]+cost[worker][job]);
    }
  }
  return dp[(1<<n)-1];
}`,
    java: `public int hungarian(int[][] cost) {
    int n = cost.length;
    int[] dp = new int[1<<n];
    Arrays.fill(dp, Integer.MAX_VALUE/2);
    dp[0]=0;
    for (int mask=0;mask<(1<<n);mask++) {
        int worker = Integer.bitCount(mask);
        if (worker>=n) continue;
        for (int job=0;job<n;job++) {
            if ((mask>>job&1)!=0) continue;
            dp[mask|(1<<job)] = Math.min(dp[mask|(1<<job)],
                                          dp[mask]+cost[worker][job]);
        }
    }
    return dp[(1<<n)-1];
}`,
  },
  defaultInput: { cost: [[9, 2, 7, 8], [6, 4, 3, 7], [5, 8, 1, 8], [7, 6, 9, 4]] },
  inputFields: [
    {
      name: 'cost',
      label: 'Cost Matrix (JSON)',
      type: 'string',
      defaultValue: '[[9,2,7,8],[6,4,3,7],[5,8,1,8],[7,6,9,4]]',
      placeholder: '[[1,2],[3,4]]',
      helperText: 'JSON n x n cost matrix (max 4x4)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let cost: number[][];
    try {
      cost = JSON.parse(input.cost as string) as number[][];
    } catch {
      cost = [[9, 2, 7, 8], [6, 4, 3, 7], [5, 8, 1, 8], [7, 6, 9, 4]];
    }
    const n = Math.min(cost.length, 4);
    const costN = cost.slice(0, n).map(row => row.slice(0, n));
    const size = 1 << n;
    const INF = 99999;

    const dp: (number | null)[] = new Array(size).fill(INF);
    dp[0] = 0;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function popcount(x: number): number { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) < INF) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `n=${n} workers/jobs. cost matrix provided. dp[mask]=min cost assigning workers to jobs in mask. dp[0]=0.`,
      variables: { n, cost: costN },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) >= INF) continue;
      const worker = popcount(mask);
      if (worker >= n) continue;
      for (let job = 0; job < n; job++) {
        if (mask >> job & 1) continue;
        const newMask = mask | (1 << job);
        const val = (dp[mask] as number) + costN[worker][job];
        if (val < (dp[newMask] as number)) {
          dp[newMask] = val;
          steps.push({
            line: 8,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, worker=${worker}->job=${job}: cost=${costN[worker][job]}. dp[${newMask.toString(2).padStart(n,'0')}]=${dp[newMask]}.`,
            variables: { mask, worker, job, cost: costN[worker][job], 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 10,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. Minimum assignment cost: ${dp[fullMask]}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default assignmentProblemHungarian;
