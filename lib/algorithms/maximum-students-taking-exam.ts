import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximumStudentsTakingExam: AlgorithmDefinition = {
  id: 'maximum-students-taking-exam',
  title: 'Maximum Students Taking Exam',
  leetcodeNumber: 1349,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a classroom grid where some seats are broken, find the maximum number of students that can take exam without cheating. Students cannot sit adjacent (left/right) or diagonally adjacent to another student. Uses bitmask DP row by row.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Matrix'],
  code: {
    pseudocode: `function maxStudents(seats):
  m = rows, n = cols
  valid[i] = bitmask of valid seats in row i
  dp = map from mask to count
  dp[0] = 0
  for each row i:
    newDp = {}
    for each prev mask in dp:
      for each cur mask:
        if cur fits in valid[i] and no two adjacent in cur:
          if no conflict between cur and prev:
            newDp[cur] = max(newDp[cur], dp[prev] + popcount(cur))
    dp = newDp
  return max values in dp`,
    python: `def maxStudents(seats):
    m, n = len(seats), len(seats[0])
    valid = [0] * m
    for i in range(m):
        for j in range(n):
            if seats[i][j] == '.':
                valid[i] |= 1 << j
    dp = {0: 0}
    for i in range(m):
        new_dp = {}
        for prev, cnt in dp.items():
            for cur in range(1 << n):
                if cur & valid[i] != cur: continue
                if cur & (cur >> 1): continue
                if (cur & (prev << 1)) or (cur & (prev >> 1)): continue
                key = cur
                new_dp[key] = max(new_dp.get(key,0), cnt + bin(cur).count('1'))
        dp = new_dp
    return max(dp.values())`,
    javascript: `function maxStudents(seats) {
  const m = seats.length, n = seats[0].length;
  const valid = new Array(m).fill(0);
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (seats[i][j] === '.') valid[i] |= 1 << j;
  let dp = new Map([[0, 0]]);
  for (let i = 0; i < m; i++) {
    const newDp = new Map();
    for (const [prev, cnt] of dp) {
      for (let cur = 0; cur < (1 << n); cur++) {
        if ((cur & valid[i]) !== cur) continue;
        if (cur & (cur >> 1)) continue;
        if ((cur & (prev << 1)) || (cur & (prev >> 1))) continue;
        const val = cnt + Integer.bitCount(cur);
        newDp.set(cur, Math.max(newDp.get(cur) || 0, val));
      }
    }
    dp = newDp;
  }
  return Math.max(...dp.values());
}`,
    java: `public int maxStudents(char[][] seats) {
    int m = seats.length, n = seats[0].length;
    int[] valid = new int[m];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (seats[i][j] == '.') valid[i] |= 1 << j;
    int[][] dp = new int[m + 1][1 << n];
    for (int[] r : dp) Arrays.fill(r, -1);
    dp[0][0] = 0;
    int ans = 0;
    for (int i = 0; i < m; i++)
        for (int prev = 0; prev < (1 << n); prev++) {
            if (dp[i][prev] < 0) continue;
            for (int cur = 0; cur < (1 << n); cur++) {
                if ((cur & valid[i]) != cur) continue;
                if ((cur & (cur >> 1)) != 0) continue;
                if ((cur & (prev << 1)) != 0 || (cur & (prev >> 1)) != 0) continue;
                dp[i+1][cur] = Math.max(dp[i+1][cur], dp[i][prev] + Integer.bitCount(cur));
                ans = Math.max(ans, dp[i+1][cur]);
            }
        }
    return ans;
}`,
  },
  defaultInput: {
    seats: [['#', '.', '#', '#', '.', '#'], ['.', '#', '#', '#', '#', '.'], ['#', '.', '#', '#', '.', '#']],
  },
  inputFields: [
    {
      name: 'seats',
      label: 'Seats Grid (JSON)',
      type: 'string',
      defaultValue: '[["#",".","#","#",".","#"],[".","#","#","#","#","."],[["#",".","#","#",".","#"]]',
      placeholder: '[[".","."],[".","."]]',
      helperText: 'JSON 2D array: "." = available, "#" = broken',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const seats = input.seats as string[][];
    const m = Math.min(seats.length, 3);
    const n = Math.min(seats[0]?.length || 4, 4);
    const valid: number[] = [];
    for (let i = 0; i < m; i++) {
      let v = 0;
      for (let j = 0; j < n; j++) {
        if (seats[i]?.[j] === '.') v |= 1 << j;
      }
      valid.push(v);
    }

    const size = 1 << n;
    const totalStates = m * size;
    const dp: (number | null)[] = new Array(totalStates).fill(null);
    const labels: string[] = [];
    for (let i = 0; i < m; i++) {
      for (let mask = 0; mask < size; mask++) {
        labels.push(`r${i}:${mask.toString(2).padStart(n,'0')}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function popcount(x: number): number {
      let c = 0; while (x) { c += x & 1; x >>= 1; } return c;
    }

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let idx = 0; idx < totalStates; idx++) {
        if (dp[idx] !== null) highlights[idx] = 'found';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    dp[0] = 0;
    steps.push({
      line: 1,
      explanation: `m=${m} rows, n=${n} cols. valid rows=[${valid.map(v=>v.toString(2).padStart(n,'0'))}]. dp[row*size+mask]=max students.`,
      variables: { m, n, valid },
      visualization: makeViz(0),
    });

    for (let i = 0; i < m; i++) {
      const prevRow = i === 0 ? [0] : Array.from({ length: size }, (_, k) => k).filter(k => dp[(i - 1) * size + k] !== null);
      for (const prev of prevRow) {
        const prevCnt = i === 0 ? 0 : (dp[(i - 1) * size + prev] as number);
        for (let cur = 0; cur < size; cur++) {
          if ((cur & valid[i]) !== cur) continue;
          if (cur & (cur >> 1)) continue;
          if ((cur & (prev << 1)) || (cur & (prev >> 1))) continue;
          const val = prevCnt + popcount(cur);
          const idx = i * size + cur;
          if (dp[idx] === null || val > (dp[idx] as number)) {
            dp[idx] = val;
            steps.push({
              line: 9,
              explanation: `Row ${i}, cur=${cur.toString(2).padStart(n,'0')} fits. Students so far: ${val}.`,
              variables: { row: i, cur, prev, val },
              visualization: makeViz(idx),
            });
          }
        }
      }
    }

    let maxVal = 0;
    let maxIdx = 0;
    for (let mask = 0; mask < size; mask++) {
      const idx = (m - 1) * size + mask;
      if (dp[idx] !== null && (dp[idx] as number) > maxVal) {
        maxVal = dp[idx] as number;
        maxIdx = idx;
      }
    }

    steps.push({
      line: 12,
      explanation: `Maximum students that can take exam: ${maxVal}.`,
      variables: { result: maxVal },
      visualization: makeViz(maxIdx),
    });

    return steps;
  },
};

export default maximumStudentsTakingExam;
