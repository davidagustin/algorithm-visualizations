import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const parallelCoursesBitmask: AlgorithmDefinition = {
  id: 'parallel-courses-bitmask',
  title: 'Parallel Courses (Bitmask DP)',
  leetcodeNumber: 1136,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given course prerequisites as a DAG, find the minimum number of semesters to complete all courses. Each semester you can take any subset of courses whose prerequisites are met. Uses bitmask DP where dp[mask] = minimum semesters to complete courses in mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Topological Sort', 'Graph', 'Bit Manipulation'],
  code: {
    pseudocode: `function minSemesters(n, relations):
  prereqs[j] = bitmask of courses required before j
  dp = array of size 2^n, fill INF
  dp[0] = 0
  for mask from 0 to 2^n - 1:
    if dp[mask] == INF: continue
    available = courses whose prereqs are all in mask
    for each nonempty sub of available:
      dp[mask | sub] = min(dp[mask|sub], dp[mask] + 1)
  return dp[(1<<n)-1] if reachable else -1`,
    python: `def minSemesters(n, relations):
    prereqs = [0] * n
    for u, v in relations:
        prereqs[v-1] |= 1 << (u-1)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] == float('inf'): continue
        avail = 0
        for i in range(n):
            if not (mask >> i & 1) and (prereqs[i] & mask) == prereqs[i]:
                avail |= 1 << i
        sub = avail
        while sub:
            dp[mask | sub] = min(dp[mask | sub], dp[mask] + 1)
            sub = (sub - 1) & avail
    return dp[(1<<n)-1] if dp[(1<<n)-1] < float('inf') else -1`,
    javascript: `function minSemesters(n, relations) {
  const prereqs = new Array(n).fill(0);
  for (const [u,v] of relations) prereqs[v-1] |= 1<<(u-1);
  const dp = new Array(1<<n).fill(Infinity);
  dp[0] = 0;
  for (let mask=0;mask<(1<<n);mask++) {
    if (dp[mask]===Infinity) continue;
    let avail=0;
    for (let i=0;i<n;i++)
      if (!(mask>>i&1)&&(prereqs[i]&mask)===prereqs[i]) avail|=1<<i;
    for (let sub=avail;sub>0;sub=(sub-1)&avail)
      dp[mask|sub]=Math.min(dp[mask|sub],dp[mask]+1);
  }
  return dp[(1<<n)-1]===Infinity?-1:dp[(1<<n)-1];
}`,
    java: `public int minSemesters(int n, int[][] relations) {
    int[] prereqs = new int[n];
    for (int[] r:relations) prereqs[r[1]-1]|=1<<(r[0]-1);
    int[] dp = new int[1<<n];
    Arrays.fill(dp, Integer.MAX_VALUE/2);
    dp[0]=0;
    for (int mask=0;mask<(1<<n);mask++) {
        if (dp[mask]==Integer.MAX_VALUE/2) continue;
        int avail=0;
        for (int i=0;i<n;i++)
            if ((mask>>i&1)==0&&(prereqs[i]&mask)==prereqs[i]) avail|=1<<i;
        for (int sub=avail;sub>0;sub=(sub-1)&avail)
            dp[mask|sub]=Math.min(dp[mask|sub],dp[mask]+1);
    }
    return dp[(1<<n)-1]==Integer.MAX_VALUE/2?-1:dp[(1<<n)-1];
}`,
  },
  defaultInput: { n: 4, relations: [[1, 2], [2, 3], [3, 4]] },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Courses (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Courses numbered 1 to n (max 5)',
    },
    {
      name: 'relations',
      label: 'Prerequisites (JSON)',
      type: 'string',
      defaultValue: '[[1,2],[2,3],[3,4]]',
      placeholder: '[[1,2],[2,3]]',
      helperText: 'JSON array of [prerequisite, course] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 5);
    let relations: number[][];
    try {
      relations = JSON.parse(input.relations as string) as number[][];
    } catch {
      relations = [[1, 2], [2, 3]];
    }

    const prereqs: number[] = new Array(n).fill(0);
    for (const [u, v] of relations) {
      if (u >= 1 && u <= n && v >= 1 && v <= n) {
        prereqs[v - 1] |= 1 << (u - 1);
      }
    }

    const size = 1 << n;
    const INF = 99999;
    const dp: (number | null)[] = new Array(size).fill(INF);
    dp[0] = 0;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

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
      explanation: `n=${n} courses, prereqs=${JSON.stringify(prereqs.map(p=>p.toString(2).padStart(n,'0')))}. dp[mask]=min semesters to complete courses in mask. dp[0]=0.`,
      variables: { n, prereqs },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) >= INF) continue;
      let avail = 0;
      for (let i = 0; i < n; i++) {
        if (!(mask >> i & 1) && (prereqs[i] & mask) === prereqs[i]) {
          avail |= 1 << i;
        }
      }
      for (let sub = avail; sub > 0; sub = (sub - 1) & avail) {
        const nm = mask | sub;
        if ((dp[mask] as number) + 1 < (dp[nm] as number)) {
          dp[nm] = (dp[mask] as number) + 1;
          steps.push({
            line: 9,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, take courses ${sub.toString(2).padStart(n,'0')}: dp[${nm.toString(2).padStart(n,'0')}]=${dp[nm]} semesters.`,
            variables: { mask, sub, nm, 'dp[nm]': dp[nm] },
            visualization: makeViz(nm, mask),
          });
        }
        if (sub === 0) break;
      }
    }

    const fullMask = size - 1;
    const result = (dp[fullMask] as number) >= INF ? -1 : dp[fullMask];
    steps.push({
      line: 11,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. Minimum semesters: ${result}.`,
      variables: { result },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default parallelCoursesBitmask;
