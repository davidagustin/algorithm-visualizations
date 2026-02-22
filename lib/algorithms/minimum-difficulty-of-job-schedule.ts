import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumDifficultyOfJobSchedule: AlgorithmDefinition = {
  id: 'minimum-difficulty-of-job-schedule',
  title: 'Minimum Difficulty of a Job Schedule',
  leetcodeNumber: 1335,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n jobs with difficulties and d days, schedule at least one job per day. The difficulty of a day equals the hardest job done that day. Minimize the total difficulty across all days. Uses 2D DP: dp[day][i] = min difficulty using first i jobs over given number of days. Must complete jobs in order.',
  tags: ['dynamic programming', 'array', 'scheduling'],

  code: {
    pseudocode: `function minDifficulty(jobs, d):
  n = len(jobs)
  if n < d: return -1
  dp = 2D array, dp[0][0] = 0, rest INF
  for day in 1..d:
    for i in day..n:
      maxDiff = 0
      for j from i down to day:
        maxDiff = max(maxDiff, jobs[j-1])
        dp[day][i] = min(dp[day][i], dp[day-1][j-1] + maxDiff)
  return dp[d][n]`,

    python: `def minDifficulty(jobDifficulty, d):
    n = len(jobDifficulty)
    if n < d: return -1
    INF = float('inf')
    dp = [[INF]*(n+1) for _ in range(d+1)]
    dp[0][0] = 0
    for day in range(1, d+1):
        for i in range(day, n+1):
            maxD = 0
            for j in range(i, day-1, -1):
                maxD = max(maxD, jobDifficulty[j-1])
                if dp[day-1][j-1] < INF:
                    dp[day][i] = min(dp[day][i], dp[day-1][j-1] + maxD)
    return dp[d][n] if dp[d][n] < INF else -1`,

    javascript: `function minDifficulty(jobDifficulty, d) {
  const n = jobDifficulty.length;
  if (n < d) return -1;
  const INF = Infinity;
  const dp = Array.from({length:d+1}, ()=>new Array(n+1).fill(INF));
  dp[0][0] = 0;
  for (let day = 1; day <= d; day++) {
    for (let i = day; i <= n; i++) {
      let maxD = 0;
      for (let j = i; j >= day; j--) {
        maxD = Math.max(maxD, jobDifficulty[j-1]);
        if (dp[day-1][j-1] < INF)
          dp[day][i] = Math.min(dp[day][i], dp[day-1][j-1] + maxD);
      }
    }
  }
  return dp[d][n] < INF ? dp[d][n] : -1;
}`,

    java: `public int minDifficulty(int[] jd, int d) {
    int n = jd.length;
    if (n < d) return -1;
    int INF = Integer.MAX_VALUE/2;
    int[][] dp = new int[d+1][n+1];
    for (int[] r : dp) Arrays.fill(r, INF);
    dp[0][0] = 0;
    for (int day = 1; day <= d; day++) {
        for (int i = day; i <= n; i++) {
            int maxD = 0;
            for (int j = i; j >= day; j--) {
                maxD = Math.max(maxD, jd[j-1]);
                if (dp[day-1][j-1] < INF)
                    dp[day][i] = Math.min(dp[day][i], dp[day-1][j-1]+maxD);
            }
        }
    }
    return dp[d][n] < INF ? dp[d][n] : -1;
}`,
  },

  defaultInput: {
    jobDifficulty: [6, 5, 4, 3, 2, 1],
    d: 2,
  },

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
      placeholder: '2',
      helperText: 'Number of days to schedule jobs (at least 1 job per day)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const jobs = input.jobDifficulty as number[];
    const d = input.d as number;
    const steps: AlgorithmStep[] = [];
    const n = jobs.length;

    if (n < d) {
      steps.push({
        line: 1,
        explanation: `Cannot schedule: ${n} jobs but need at least ${d} jobs (1 per day). Return -1.`,
        variables: { n, d, answer: -1 },
        visualization: { type: 'array', array: jobs, highlights: {}, labels: {} },
      });
      return steps;
    }

    const INF = 1e9;
    const dp: number[][] = Array.from({ length: d + 1 }, () => new Array(n + 1).fill(INF));
    dp[0][0] = 0;

    steps.push({
      line: 1,
      explanation: `Schedule ${n} jobs over ${d} days. dp[day][i] = min difficulty using first i jobs in given days. dp[0][0]=0, rest=INF.`,
      variables: { n, d },
      visualization: {
        type: 'array',
        array: jobs,
        highlights: {},
        labels: Object.fromEntries(jobs.map((v, i) => [i, `j${i + 1}=${v}`])),
      },
    });

    for (let day = 1; day <= d; day++) {
      for (let i = day; i <= n; i++) {
        let maxD = 0;
        for (let j = i; j >= day; j--) {
          maxD = Math.max(maxD, jobs[j - 1]);
          if (dp[day - 1][j - 1] < INF) {
            dp[day][i] = Math.min(dp[day][i], dp[day - 1][j - 1] + maxD);
          }
        }
      }

      const rowDisplay = dp[day].map(v => v >= INF ? 'INF' : v).slice(0, n + 1);
      steps.push({
        line: 5,
        explanation: `Day ${day}: Computed dp[${day}][*]. Best schedule using ${day} day(s) for each job count: [${rowDisplay.join(', ')}].`,
        variables: { day, dpRow: rowDisplay },
        visualization: {
          type: 'dp-table' as const,
          values: dp[day].slice(0, n + 1).map(v => v >= INF ? null : v),
          highlights: Object.fromEntries(
            dp[day].slice(0, n + 1).map((_, i) => [i, i === n ? 'found' : 'active'])
          ),
          labels: Array.from({ length: n + 1 }, (_, i) => `d${day},i${i}`),
        },
      });
    }

    const ans = dp[d][n] < INF ? dp[d][n] : -1;
    steps.push({
      line: 9,
      explanation: `Minimum total difficulty of job schedule over ${d} days: ${ans}.`,
      variables: { answer: ans },
      visualization: {
        type: 'array',
        array: jobs,
        highlights: {},
        labels: Object.fromEntries(jobs.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default minimumDifficultyOfJobSchedule;
