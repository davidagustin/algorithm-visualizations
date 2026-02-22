import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumProfitInJobScheduling: AlgorithmDefinition = {
  id: 'maximum-profit-in-job-scheduling',
  title: 'Maximum Profit in Job Scheduling',
  leetcodeNumber: 1235,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n jobs with start times, end times, and profits, select non-overlapping jobs to maximize total profit. Sort jobs by end time, then use DP: dp[i] = max profit considering first i jobs. For each job, choose to take it (add its profit + best profit from jobs ending before it starts) or skip it.',
  tags: ['dynamic programming', 'binary search', 'sorting', 'interval scheduling'],

  code: {
    pseudocode: `function jobScheduling(startTime, endTime, profit):
  jobs = sort by endTime
  dp = [0] * (n+1)
  for i from 1 to n:
    // binary search for last job ending <= start of jobs[i]
    j = binarySearch(endTimes, jobs[i].start)
    dp[i] = max(dp[i-1], dp[j] + jobs[i].profit)
  return dp[n]`,

    python: `def jobScheduling(startTime, endTime, profit):
    import bisect
    jobs = sorted(zip(endTime, startTime, profit))
    ends = [j[0] for j in jobs]
    dp = [0] * (len(jobs) + 1)
    for i, (e, s, p) in enumerate(jobs, 1):
        j = bisect.bisect_right(ends, s, 0, i-1)
        dp[i] = max(dp[i-1], dp[j] + p)
    return dp[-1]`,

    javascript: `function jobScheduling(startTime, endTime, profit) {
  const jobs = startTime.map((s,i) => [endTime[i], s, profit[i]])
    .sort((a,b) => a[0]-b[0]);
  const ends = jobs.map(j => j[0]);
  const dp = new Array(jobs.length+1).fill(0);
  for (let i = 1; i <= jobs.length; i++) {
    const [e, s, p] = jobs[i-1];
    let lo=0, hi=i-1;
    while (lo < hi) {
      const mid = (lo+hi+1)>>1;
      if (ends[mid-1] <= s) lo=mid; else hi=mid-1;
    }
    dp[i] = Math.max(dp[i-1], dp[lo] + p);
  }
  return dp[jobs.length];
}`,

    java: `public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
    int n = startTime.length;
    int[][] jobs = new int[n][3];
    for (int i = 0; i < n; i++) jobs[i] = new int[]{endTime[i], startTime[i], profit[i]};
    Arrays.sort(jobs, (a,b)->a[0]-b[0]);
    int[] dp = new int[n+1];
    for (int i = 1; i <= n; i++) {
        int lo=0, hi=i-1, s=jobs[i-1][1];
        while (lo < hi) {
            int mid=(lo+hi+1)>>1;
            if (jobs[mid-1][0] <= s) lo=mid; else hi=mid-1;
        }
        dp[i] = Math.max(dp[i-1], dp[lo] + jobs[i-1][2]);
    }
    return dp[n];
}`,
  },

  defaultInput: {
    startTime: [1, 2, 3, 3],
    endTime: [3, 4, 5, 6],
    profit: [50, 10, 40, 70],
  },

  inputFields: [
    {
      name: 'startTime',
      label: 'Start Times',
      type: 'array',
      defaultValue: [1, 2, 3, 3],
      placeholder: '1,2,3,3',
      helperText: 'Start time of each job',
    },
    {
      name: 'endTime',
      label: 'End Times',
      type: 'array',
      defaultValue: [3, 4, 5, 6],
      placeholder: '3,4,5,6',
      helperText: 'End time of each job',
    },
    {
      name: 'profit',
      label: 'Profits',
      type: 'array',
      defaultValue: [50, 10, 40, 70],
      placeholder: '50,10,40,70',
      helperText: 'Profit of each job if selected',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startTime = input.startTime as number[];
    const endTime = input.endTime as number[];
    const profit = input.profit as number[];
    const steps: AlgorithmStep[] = [];

    const jobs = startTime.map((s, i) => [endTime[i], s, profit[i]] as [number, number, number]);
    jobs.sort((a, b) => a[0] - b[0]);
    const ends = jobs.map(j => j[0]);
    const n = jobs.length;
    const dp = new Array(n + 1).fill(0);

    steps.push({
      line: 1,
      explanation: `Sort ${n} jobs by end time: ${jobs.map(j => `[s=${j[1]},e=${j[0]},p=${j[2]}]`).join(' ')}. dp[i] = max profit from first i jobs.`,
      variables: { jobCount: n, sortedJobs: jobs.map(j => ({ start: j[1], end: j[0], profit: j[2] })) },
      visualization: {
        type: 'array',
        array: jobs.map(j => j[2]),
        highlights: {},
        labels: Object.fromEntries(jobs.map((j, i) => [i, `[${j[1]},${j[0]}]`])),
      },
    });

    for (let i = 1; i <= n; i++) {
      const [e, s, p] = jobs[i - 1];
      let lo = 0, hi = i - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (ends[mid - 1] <= s) lo = mid; else hi = mid - 1;
      }
      dp[i] = Math.max(dp[i - 1], dp[lo] + p);

      steps.push({
        line: 5,
        explanation: `Job ${i}: [start=${s}, end=${e}, profit=${p}]. Last compatible job index: ${lo}. dp[${i}] = max(dp[${i - 1}]=${dp[i - 1]}, dp[${lo}]=${dp[lo]}+${p}) = ${dp[i]}.`,
        variables: { jobIndex: i, start: s, end: e, profit: p, lastCompatible: lo, dpValue: dp[i] },
        visualization: {
          type: 'array',
          array: dp.slice(0, i + 1),
          highlights: { [i]: 'found', [lo]: 'active' },
          labels: Object.fromEntries(dp.slice(0, i + 1).map((_, idx) => [idx, `j${idx}`])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Maximum profit from non-overlapping jobs: dp[${n}] = ${dp[n]}.`,
      variables: { answer: dp[n] },
      visualization: {
        type: 'array',
        array: dp,
        highlights: { [n]: 'found' },
        labels: Object.fromEntries(dp.map((_, i) => [i, `dp[${i}]`])),
      },
    });

    return steps;
  },
};

export default maximumProfitInJobScheduling;
