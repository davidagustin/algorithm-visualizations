import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximumCompatibilityScoreSum: AlgorithmDefinition = {
  id: 'maximum-compatibility-score-sum',
  title: 'Maximum Compatibility Score Sum',
  leetcodeNumber: 1947,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given student and mentor answer arrays, assign each student to exactly one mentor to maximize the total compatibility score. Compatibility = number of matching answers. Uses bitmask DP over mentor assignments.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function maxCompatibilitySum(students, mentors):
  m = number of students/mentors
  compat[i][j] = matching answers between student i and mentor j
  dp = array of size 2^m, fill 0
  for mask from 0 to 2^m - 1:
    i = popcount(mask)  // student index
    if i >= m: continue
    for j from 0 to m-1:
      if mask has bit j: continue
      dp[mask | (1<<j)] = max(dp[mask|(1<<j)], dp[mask] + compat[i][j])
  return max(dp)`,
    python: `def maxCompatibilitySum(students, mentors):
    m = len(students)
    compat = [[sum(s==t for s,t in zip(st,me)) for me in mentors] for st in students]
    dp = [0] * (1 << m)
    for mask in range(1 << m):
        i = bin(mask).count('1')
        if i >= m: continue
        for j in range(m):
            if mask & (1 << j): continue
            dp[mask|(1<<j)] = max(dp[mask|(1<<j)], dp[mask]+compat[i][j])
    return max(dp)`,
    javascript: `function maxCompatibilitySum(students, mentors) {
  const m = students.length;
  const compat = students.map(s => mentors.map(me =>
    s.reduce((cnt, v, k) => cnt + (v === me[k] ? 1 : 0), 0)
  ));
  const dp = new Array(1 << m).fill(0);
  for (let mask = 0; mask < (1 << m); mask++) {
    const i = Integer.bitCount(mask);
    if (i >= m) continue;
    for (let j = 0; j < m; j++) {
      if (mask & (1 << j)) continue;
      dp[mask|(1<<j)] = Math.max(dp[mask|(1<<j)], dp[mask]+compat[i][j]);
    }
  }
  return Math.max(...dp);
}`,
    java: `public int maxCompatibilitySum(int[][] students, int[][] mentors) {
    int m = students.length, n = students[0].length;
    int[][] compat = new int[m][m];
    for (int i=0;i<m;i++) for (int j=0;j<m;j++)
        for (int k=0;k<n;k++) if (students[i][k]==mentors[j][k]) compat[i][j]++;
    int[] dp = new int[1<<m];
    for (int mask=0;mask<(1<<m);mask++) {
        int i = Integer.bitCount(mask);
        if (i>=m) continue;
        for (int j=0;j<m;j++) {
            if ((mask&(1<<j))!=0) continue;
            dp[mask|(1<<j)] = Math.max(dp[mask|(1<<j)], dp[mask]+compat[i][j]);
        }
    }
    return Arrays.stream(dp).max().getAsInt();
}`,
  },
  defaultInput: {
    students: [[0, 0], [0, 0], [0, 0]],
    mentors: [[1, 1], [1, 0], [0, 0]],
  },
  inputFields: [
    {
      name: 'students',
      label: 'Students (JSON)',
      type: 'string',
      defaultValue: '[[0,0],[0,0],[0,0]]',
      placeholder: '[[0,0],[1,1]]',
      helperText: 'JSON 2D array of student answers (0/1)',
    },
    {
      name: 'mentors',
      label: 'Mentors (JSON)',
      type: 'string',
      defaultValue: '[[1,1],[1,0],[0,0]]',
      placeholder: '[[1,1],[0,1]]',
      helperText: 'JSON 2D array of mentor answers (0/1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let students: number[][], mentors: number[][];
    try {
      students = JSON.parse(input.students as string) as number[][];
      mentors = JSON.parse(input.mentors as string) as number[][];
    } catch {
      students = [[0, 0], [0, 0], [0, 0]];
      mentors = [[1, 1], [1, 0], [0, 0]];
    }
    const m = Math.min(students.length, mentors.length, 4);
    const studS = students.slice(0, m);
    const mentS = mentors.slice(0, m);
    const size = 1 << m;

    const compat: number[][] = studS.map(s =>
      mentS.map(me => s.reduce((cnt, v, k) => cnt + (v === me[k] ? 1 : 0), 0))
    );

    const dp: (number | null)[] = new Array(size).fill(0);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(m, '0')
    );
    const steps: AlgorithmStep[] = [];

    function popcount(x: number): number { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) > 0) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `m=${m} students/mentors. Compatibility scores computed. dp[mentorMask]=max score assigning students to mentors in mask.`,
      variables: { m, compat },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      const studentIdx = popcount(mask);
      if (studentIdx >= m) continue;
      for (let j = 0; j < m; j++) {
        if (mask & (1 << j)) continue;
        const newMask = mask | (1 << j);
        const val = (dp[mask] as number) + compat[studentIdx][j];
        if (val > (dp[newMask] as number)) {
          dp[newMask] = val;
          steps.push({
            line: 7,
            explanation: `mask=${mask.toString(2).padStart(m,'0')}, student=${studentIdx}->mentor=${j}: compat=${compat[studentIdx][j]}. dp[${newMask.toString(2).padStart(m,'0')}]=${dp[newMask]}.`,
            variables: { mask, studentIdx, mentor: j, compat: compat[studentIdx][j], 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const result = Math.max(...(dp as number[]));
    const bestMask = (dp as number[]).indexOf(result);
    steps.push({
      line: 9,
      explanation: `Maximum compatibility score sum: ${result}.`,
      variables: { result },
      visualization: makeViz(bestMask, null),
    });

    return steps;
  },
};

export default maximumCompatibilityScoreSum;
