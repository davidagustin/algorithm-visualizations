import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximumProfitInJobSchedulingII: AlgorithmDefinition = {
  id: 'maximum-profit-in-job-scheduling-ii',
  title: 'Maximum Profit in Job Scheduling',
  leetcodeNumber: 1235,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given jobs with start, end, and profit, find maximum profit scheduling non-overlapping jobs. Sort by end time. dp[i] = max profit considering first i jobs. For each job, binary search for last non-overlapping job, then dp[i] = max(dp[i-1], dp[lastNonOverlap] + profit[i]).',
  tags: ['Dynamic Programming', 'Binary Search', 'Interval Scheduling'],
  code: {
    pseudocode: `function jobScheduling(startTime, endTime, profit):
  jobs = sort by endTime
  dp = [0] * (n+1)
  for i from 1 to n:
    lo = binary search largest j where endTime[j-1] <= startTime[i-1]
    dp[i] = max(dp[i-1], dp[lo] + profit[i-1])
  return dp[n]`,
    python: `def jobScheduling(startTime, endTime, profit):
    jobs = sorted(zip(endTime, startTime, profit))
    ends = [0] + [j[0] for j in jobs]
    dp = [0] * (len(jobs)+1)
    for i, (e, s, p) in enumerate(jobs, 1):
        lo = bisect_right(ends, s)
        dp[i] = max(dp[i-1], dp[lo] + p)
    return dp[-1]`,
    javascript: `function jobScheduling(startTime, endTime, profit) {
  const jobs = startTime.map((s,i)=>[endTime[i],s,profit[i]])
                         .sort((a,b)=>a[0]-b[0]);
  const ends = [0, ...jobs.map(j=>j[0])];
  const dp = new Array(jobs.length+1).fill(0);
  for (let i = 1; i <= jobs.length; i++) {
    const [e, s, p] = jobs[i-1];
    let lo = 0, hi = i-1;
    while (lo < hi) {
      const mid = (lo+hi+1)>>1;
      if (ends[mid] <= s) lo = mid; else hi = mid-1;
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
    int[] ends = new int[n+1];
    for (int i = 0; i < n; i++) ends[i+1] = jobs[i][0];
    for (int i = 1; i <= n; i++) {
        int lo = Arrays.binarySearch(ends, 0, i, jobs[i-1][1]);
        if (lo < 0) lo = -lo - 2;
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
      helperText: 'Profit earned from completing each job',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startTime = input.startTime as number[];
    const endTime = input.endTime as number[];
    const profit = input.profit as number[];
    const n = startTime.length;
    const steps: AlgorithmStep[] = [];

    const jobs: [number, number, number][] = startTime.map((s, i) => [endTime[i], s, profit[i]]);
    jobs.sort((a, b) => a[0] - b[0]);

    const ends: number[] = [0, ...jobs.map(j => j[0])];
    const dp: number[] = new Array(n + 1).fill(0);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Sort ${n} jobs by end time. Jobs (end, start, profit): ${jobs.map(j => `(${j[0]},${j[1]},${j[2]})`).join(', ')}.`,
      variables: { n, jobs },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= n; i++) {
      const [, s, p] = jobs[i - 1];
      let lo = 0;
      let hi = i - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (ends[mid] <= s) lo = mid;
        else hi = mid - 1;
      }

      dp[i] = Math.max(dp[i - 1], dp[lo] + p);

      steps.push({
        line: 5,
        explanation: `Job ${i} (end=${jobs[i-1][0]}, start=${s}, profit=${p}): lastNonOverlap=dp[${lo}]=${dp[lo]}. dp[${i}]=max(dp[${i-1}]=${dp[i-1]}, ${dp[lo]}+${p})=${dp[i]}.`,
        variables: { job: i, start: s, end: jobs[i-1][0], profit: p, lastNonOverlap: lo, 'dp[i]': dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 6,
      explanation: `Answer = dp[${n}] = ${dp[n]}. Maximum profit from non-overlapping jobs.`,
      variables: { result: dp[n] },
      visualization: makeViz(n),
    });

    return steps;
  },
};

export default maximumProfitInJobSchedulingII;
