import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumDifficultyOfJobScheduleII: AlgorithmDefinition = {
  id: 'minimum-difficulty-of-job-schedule-ii',
  title: 'Minimum Difficulty of a Job Schedule',
  leetcodeNumber: 1335,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Schedule n jobs over d days such that each day completes at least one job in order. Day difficulty = max job difficulty that day. Minimize total difficulty. dp[i][j] = min difficulty completing first j jobs in i days. For each day boundary k, dp[i][j] = min(dp[i-1][k] + max(jobs[k..j-1])).',
  tags: ['Dynamic Programming', 'State Machine', 'Scheduling'],
  code: {
    pseudocode: `function minDifficulty(jobDifficulty, d):
  n = length(jobDifficulty)
  if n < d: return -1
  dp[i][j] = min cost for i days covering first j jobs
  dp[0][0] = 0, others = Infinity
  for day from 1 to d:
    for j from day to n:
      maxDiff = 0
      for k from j-1 down to day-1:
        maxDiff = max(maxDiff, jobDifficulty[k])
        dp[day][j] = min(dp[day][j], dp[day-1][k] + maxDiff)
  return dp[d][n]`,
    python: `def minDifficulty(jobDifficulty, d):
    n = len(jobDifficulty)
    if n < d: return -1
    INF = float('inf')
    dp = [[INF]*(n+1) for _ in range(d+1)]
    dp[0][0] = 0
    for day in range(1, d+1):
        for j in range(day, n+1):
            maxD = 0
            for k in range(j-1, day-2, -1):
                maxD = max(maxD, jobDifficulty[k])
                if dp[day-1][k] < INF:
                    dp[day][j] = min(dp[day][j], dp[day-1][k]+maxD)
    return dp[d][n] if dp[d][n] < INF else -1`,
    javascript: `function minDifficulty(jobDifficulty, d) {
  const n = jobDifficulty.length;
  if (n < d) return -1;
  const INF = 1e9;
  const dp = Array.from({length:d+1},()=>new Array(n+1).fill(INF));
  dp[0][0] = 0;
  for (let day = 1; day <= d; day++)
    for (let j = day; j <= n; j++) {
      let maxD = 0;
      for (let k = j-1; k >= day-1; k--) {
        maxD = Math.max(maxD, jobDifficulty[k]);
        if (dp[day-1][k] < INF)
          dp[day][j] = Math.min(dp[day][j], dp[day-1][k] + maxD);
      }
    }
  return dp[d][n] < INF ? dp[d][n] : -1;
}`,
    java: `public int minDifficulty(int[] jobDifficulty, int d) {
    int n = jobDifficulty.length;
    if (n < d) return -1;
    int INF = Integer.MAX_VALUE/2;
    int[][] dp = new int[d+1][n+1];
    for (int[] row : dp) Arrays.fill(row, INF);
    dp[0][0] = 0;
    for (int day = 1; day <= d; day++)
        for (int j = day; j <= n; j++) {
            int maxD = 0;
            for (int k = j-1; k >= day-1; k--) {
                maxD = Math.max(maxD, jobDifficulty[k]);
                if (dp[day-1][k] < INF)
                    dp[day][j] = Math.min(dp[day][j], dp[day-1][k]+maxD);
            }
        }
    return dp[d][n] < INF ? dp[d][n] : -1;
}`,
  },
  defaultInput: { jobDifficulty: [6, 5, 4, 3, 2, 1], d: 2 },
  inputFields: [
    {
      name: 'jobDifficulty',
      label: 'Job Difficulties',
      type: 'array',
      defaultValue: [6, 5, 4, 3, 2, 1],
      placeholder: '6,5,4,3,2,1',
      helperText: 'Difficulty of each job (must be done in order)',
    },
    {
      name: 'd',
      label: 'Number of Days (d)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of days to schedule all jobs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const jobDifficulty = input.jobDifficulty as number[];
    const d = input.d as number;
    const n = jobDifficulty.length;
    const steps: AlgorithmStep[] = [];

    if (n < d) {
      steps.push({
        line: 2,
        explanation: `n=${n} < d=${d}: Cannot schedule, need at least one job per day. Return -1.`,
        variables: { n, d, result: -1 },
        visualization: { type: 'dp-table', values: [-1], highlights: { 0: 'mismatch' }, labels: ['result'] },
      });
      return steps;
    }

    const INF = 999999;
    const dp: number[][] = Array.from({ length: d + 1 }, () => new Array(n + 1).fill(INF));
    dp[0][0] = 0;

    // Show dp[day][n] column for each day
    const dpLine: number[] = new Array(d + 1).fill(INF);
    dpLine[0] = 0;
    const labels: string[] = Array.from({ length: d + 1 }, (_, i) => `day${i}`);

    function makeViz(activeDay: number): DPVisualization {
      const vals: (number | null)[] = dpLine.map(v => v === INF ? null : v);
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= d; i++) {
        if (i === activeDay) highlights[i] = 'active';
        else if (dpLine[i] < INF) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: vals, highlights, labels };
    }

    steps.push({
      line: 3,
      explanation: `${n} jobs, ${d} days. dp[day][j] = min total difficulty for first j jobs over day days. dp[0][0]=0.`,
      variables: { n, d, jobDifficulty },
      visualization: makeViz(0),
    });

    for (let day = 1; day <= d; day++) {
      for (let j = day; j <= n; j++) {
        let maxD = 0;
        for (let k = j - 1; k >= day - 1; k--) {
          maxD = Math.max(maxD, jobDifficulty[k]);
          if (dp[day - 1][k] < INF) {
            dp[day][j] = Math.min(dp[day][j], dp[day - 1][k] + maxD);
          }
        }
      }
      dpLine[day] = dp[day][n];

      steps.push({
        line: 9,
        explanation: `Day ${day} complete: dp[${day}][${n}]=${dp[day][n] === INF ? 'INF' : dp[day][n]}. Min difficulty scheduling all ${n} jobs over ${day} days.`,
        variables: { day, 'dp[day][n]': dp[day][n] === INF ? 'INF' : dp[day][n] },
        visualization: makeViz(day),
      });
    }

    const result = dp[d][n] < INF ? dp[d][n] : -1;
    steps.push({
      line: 10,
      explanation: `Answer = dp[${d}][${n}] = ${result}. Minimum difficulty schedule over ${d} days.`,
      variables: { result },
      visualization: makeViz(d),
    });

    return steps;
  },
};

export default minimumDifficultyOfJobScheduleII;
