import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const studentAttendanceRecordIi: AlgorithmDefinition = {
  id: 'student-attendance-record-ii',
  title: 'Student Attendance Record II',
  leetcodeNumber: 552,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count the number of attendance records of length n that make a student eligible for an award. A record is eligible if it has at most one "A" (Absent) and no more than two consecutive "L" (Late). Uses DP with states tracking absences and trailing lates. Answer is modulo 10^9+7.',
  tags: ['dynamic programming', 'combinatorics', 'modular arithmetic'],

  code: {
    pseudocode: `function checkRecord(n):
  MOD = 1e9+7
  // dp[a][l] = ways with a absences and l trailing lates
  dp = {(0,0):1}
  for each day:
    ndp = new map
    for (a,l),v in dp:
      ndp[a][0] += v        // add 'P' present
      if a < 1: ndp[a+1][0] += v  // add 'A' absent
      if l < 2: ndp[a][l+1] += v  // add 'L' late
  return sum of all ndp values`,

    python: `def checkRecord(n):
    MOD = 10**9 + 7
    # dp[a][l]: a = absences (0 or 1), l = trailing lates (0,1,2)
    dp = [[0]*3 for _ in range(2)]
    dp[0][0] = 1
    for _ in range(n):
        ndp = [[0]*3 for _ in range(2)]
        for a in range(2):
            for l in range(3):
                if not dp[a][l]: continue
                ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD  # P
                if a < 1: ndp[a+1][0] = (ndp[a+1][0] + dp[a][l]) % MOD  # A
                if l < 2: ndp[a][l+1] = (ndp[a][l+1] + dp[a][l]) % MOD  # L
        dp = ndp
    return sum(dp[a][l] for a in range(2) for l in range(3)) % MOD`,

    javascript: `function checkRecord(n) {
  const MOD = 1e9 + 7;
  let dp = Array.from({length:2}, () => new Array(3).fill(0));
  dp[0][0] = 1;
  for (let i = 0; i < n; i++) {
    const ndp = Array.from({length:2}, () => new Array(3).fill(0));
    for (let a = 0; a < 2; a++) for (let l = 0; l < 3; l++) {
      if (!dp[a][l]) continue;
      ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD;
      if (a < 1) ndp[a+1][0] = (ndp[a+1][0] + dp[a][l]) % MOD;
      if (l < 2) ndp[a][l+1] = (ndp[a][l+1] + dp[a][l]) % MOD;
    }
    dp = ndp;
  }
  let ans = 0;
  for (let a = 0; a < 2; a++) for (let l = 0; l < 3; l++) ans = (ans + dp[a][l]) % MOD;
  return ans;
}`,

    java: `public int checkRecord(int n) {
    int MOD = 1_000_000_007;
    long[][] dp = new long[2][3];
    dp[0][0] = 1;
    for (int i = 0; i < n; i++) {
        long[][] ndp = new long[2][3];
        for (int a = 0; a < 2; a++) for (int l = 0; l < 3; l++) {
            ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD;
            if (a < 1) ndp[a+1][0] = (ndp[a+1][0] + dp[a][l]) % MOD;
            if (l < 2) ndp[a][l+1] = (ndp[a][l+1] + dp[a][l]) % MOD;
        }
        dp = ndp;
    }
    long ans = 0;
    for (long[] row : dp) for (long v : row) ans = (ans + v) % MOD;
    return (int)ans;
}`,
  },

  defaultInput: {
    n: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Record Length (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Length of the attendance record (1 <= n <= 100)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    let dp = Array.from({ length: 2 }, () => new Array(3).fill(0)) as number[][];
    dp[0][0] = 1;

    const makeDP = () => {
      // Flatten dp[2][3] into a 6-element array: [dp[0][0], dp[0][1], dp[0][2], dp[1][0], dp[1][1], dp[1][2]]
      const values: (number | null)[] = [dp[0][0], dp[0][1], dp[0][2], dp[1][0], dp[1][1], dp[1][2]];
      const highlights: Record<number, string> = {
        0: dp[0][0] > 0 ? 'active' : 'default',
        1: dp[0][1] > 0 ? 'active' : 'default',
        2: dp[0][2] > 0 ? 'active' : 'default',
        3: dp[1][0] > 0 ? 'found' : 'default',
        4: dp[1][1] > 0 ? 'found' : 'default',
        5: dp[1][2] > 0 ? 'found' : 'default',
      };
      const labels = ['A0L0', 'A0L1', 'A0L2', 'A1L0', 'A1L1', 'A1L2'];
      return { type: 'dp-table' as const, values, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Initialize DP table. dp[a][l] = number of valid sequences with a absences and l trailing lates. Start: dp[0][0]=1.`,
      variables: { n, day: 0, total: 1 },
      visualization: makeDP(),
    });

    const limit = Math.min(n, 5);
    for (let day = 1; day <= limit; day++) {
      const ndp = Array.from({ length: 2 }, () => new Array(3).fill(0)) as number[][];
      for (let a = 0; a < 2; a++) {
        for (let l = 0; l < 3; l++) {
          if (!dp[a][l]) continue;
          ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD;
          if (a < 1) ndp[a + 1][0] = (ndp[a + 1][0] + dp[a][l]) % MOD;
          if (l < 2) ndp[a][l + 1] = (ndp[a][l + 1] + dp[a][l]) % MOD;
        }
      }
      dp = ndp;
      const total = dp.flat().reduce((s, v) => (s + v) % MOD, 0);
      steps.push({
        line: 8,
        explanation: `After day ${day}: Added P (present), A (absent if allowed), L (late if <2 consecutive). Total valid sequences so far: ${total}.`,
        variables: { day, totalSequences: total },
        visualization: makeDP(),
      });
    }

    if (n > limit) {
      for (let day = limit + 1; day <= n; day++) {
        const ndp = Array.from({ length: 2 }, () => new Array(3).fill(0)) as number[][];
        for (let a = 0; a < 2; a++) {
          for (let l = 0; l < 3; l++) {
            if (!dp[a][l]) continue;
            ndp[a][0] = (ndp[a][0] + dp[a][l]) % MOD;
            if (a < 1) ndp[a + 1][0] = (ndp[a + 1][0] + dp[a][l]) % MOD;
            if (l < 2) ndp[a][l + 1] = (ndp[a][l + 1] + dp[a][l]) % MOD;
          }
        }
        dp = ndp;
      }
    }

    const ans = dp.flat().reduce((s, v) => (s + v) % MOD, 0);
    steps.push({
      line: 10,
      explanation: `Final answer: ${ans} valid attendance records of length ${n} make a student eligible for an award.`,
      variables: { n, answer: ans },
      visualization: makeDP(),
    });

    return steps;
  },
};

export default studentAttendanceRecordIi;
