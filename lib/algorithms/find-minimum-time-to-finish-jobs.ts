import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const findMinimumTimeToFinishJobs: AlgorithmDefinition = {
  id: 'find-minimum-time-to-finish-jobs',
  title: 'Find Minimum Time to Finish All Jobs',
  leetcodeNumber: 1723,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given jobs and k workers, assign all jobs to workers to minimize the maximum working time of any worker. Uses bitmask DP: precompute subset sums, then dp[i][mask] = min max-time using i workers to handle jobs in mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Binary Search', 'Backtracking'],
  code: {
    pseudocode: `function minimumTimeRequired(jobs, k):
  n = length(jobs)
  subSum[mask] = total time for jobs in mask
  dp[i][mask] = min max time using i workers for jobs in mask
  dp[0][0] = 0
  for i from 1 to k:
    for mask from 0 to 2^n - 1:
      dp[i][mask] = INF
      for sub = mask; sub > 0; sub = (sub-1) & mask:
        dp[i][mask] = min(dp[i][mask], max(dp[i-1][mask^sub], subSum[sub]))
  return dp[k][(1<<n)-1]`,
    python: `def minimumTimeRequired(jobs, k):
    n = len(jobs)
    sub_sum = [0] * (1 << n)
    for mask in range(1 << n):
        for i in range(n):
            if mask & (1 << i):
                sub_sum[mask] += jobs[i]
    dp = [[float('inf')] * (1 << n) for _ in range(k + 1)]
    dp[0][0] = 0
    for i in range(1, k + 1):
        for mask in range(1 << n):
            sub = mask
            while sub:
                dp[i][mask] = min(dp[i][mask],
                    max(dp[i-1][mask ^ sub], sub_sum[sub]))
                sub = (sub - 1) & mask
    return dp[k][(1 << n) - 1]`,
    javascript: `function minimumTimeRequired(jobs, k) {
  const n = jobs.length;
  const subSum = new Array(1 << n).fill(0);
  for (let mask = 0; mask < (1 << n); mask++)
    for (let i = 0; i < n; i++)
      if (mask & (1 << i)) subSum[mask] += jobs[i];
  const dp = Array.from({length:k+1},()=>new Array(1<<n).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= k; i++) {
    for (let mask = 0; mask < (1 << n); mask++) {
      for (let sub = mask; sub > 0; sub = (sub-1)&mask) {
        dp[i][mask] = Math.min(dp[i][mask],
          Math.max(dp[i-1][mask^sub], subSum[sub]));
      }
    }
  }
  return dp[k][(1<<n)-1];
}`,
    java: `public int minimumTimeRequired(int[] jobs, int k) {
    int n = jobs.length;
    int[] subSum = new int[1<<n];
    for (int mask=0;mask<(1<<n);mask++)
        for (int i=0;i<n;i++)
            if ((mask>>i&1)!=0) subSum[mask]+=jobs[i];
    int[][] dp = new int[k+1][1<<n];
    for (int[] r:dp) Arrays.fill(r, Integer.MAX_VALUE/2);
    dp[0][0]=0;
    for (int i=1;i<=k;i++)
        for (int mask=0;mask<(1<<n);mask++)
            for (int sub=mask;sub>0;sub=(sub-1)&mask)
                dp[i][mask]=Math.min(dp[i][mask],
                    Math.max(dp[i-1][mask^sub],subSum[sub]));
    return dp[k][(1<<n)-1];
}`,
  },
  defaultInput: { jobs: [3, 2, 3], k: 3 },
  inputFields: [
    {
      name: 'jobs',
      label: 'Job Durations',
      type: 'array',
      defaultValue: [3, 2, 3],
      placeholder: '3,2,3',
      helperText: 'Duration of each job (max 5 jobs)',
    },
    {
      name: 'k',
      label: 'Number of Workers (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of workers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const jobs = (input.jobs as number[]).slice(0, 5);
    const k = Math.min(input.k as number, jobs.length);
    const n = jobs.length;
    const size = 1 << n;

    const subSum: number[] = new Array(size).fill(0);
    for (let mask = 0; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) subSum[mask] += jobs[i];
      }
    }

    const INF = 99999;
    const dpFlat: (number | null)[] = new Array((k + 1) * size).fill(INF);
    const labels: string[] = [];
    for (let worker = 0; worker <= k; worker++) {
      for (let mask = 0; mask < size; mask++) {
        labels.push(`w${worker}:${mask.toString(2).padStart(n,'0')}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function idxFlat(worker: number, mask: number): number { return worker * size + mask; }
    function getV(worker: number, mask: number): number { return dpFlat[idxFlat(worker, mask)] as number; }
    function setV(worker: number, mask: number, v: number): void { dpFlat[idxFlat(worker, mask)] = v; }

    function makeViz(activeIdxF: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < (k+1)*size; i++) {
        if ((dpFlat[i] as number) < INF) highlights[i] = 'found';
      }
      if (activeIdxF !== null) highlights[activeIdxF] = 'active';
      return { type: 'dp-table', values: dpFlat.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    setV(0, 0, 0);
    steps.push({
      line: 1,
      explanation: `jobs=${JSON.stringify(jobs)}, k=${k}. dp[workers][mask]=min max-time. dp[0][0]=0.`,
      variables: { jobs, k, n },
      visualization: makeViz(idxFlat(0, 0)),
    });

    for (let i = 1; i <= k; i++) {
      for (let mask = 0; mask < size; mask++) {
        let best = INF;
        for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
          const prev = getV(i - 1, mask ^ sub);
          if (prev < INF) {
            const val = Math.max(prev, subSum[sub]);
            if (val < best) best = val;
          }
          if (sub === 0) break;
        }
        if (best < INF) {
          setV(i, mask, best);
          if (mask === size - 1 || mask === (size >> 1)) {
            steps.push({
              line: 8,
              explanation: `workers=${i}, mask=${mask.toString(2).padStart(n,'0')}: best max-time=${best}.`,
              variables: { workers: i, mask, best },
              visualization: makeViz(idxFlat(i, mask)),
            });
          }
        }
      }
    }

    const result = getV(k, size - 1);
    steps.push({
      line: 10,
      explanation: `dp[${k}][${(size-1).toString(2).padStart(n,'0')}]=${result}. Minimum time to finish all jobs with ${k} workers: ${result}.`,
      variables: { result },
      visualization: makeViz(idxFlat(k, size - 1)),
    });

    return steps;
  },
};

export default findMinimumTimeToFinishJobs;
