import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const parallelCoursesIi: AlgorithmDefinition = {
  id: 'parallel-courses-ii',
  title: 'Parallel Courses II',
  leetcodeNumber: 1494,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find the minimum number of semesters to complete all courses where you can take at most k courses per semester and prerequisites must be satisfied. Uses bitmask DP: dp[mask] = minimum semesters to complete the set of courses represented by mask. For each mask, find all available courses (prerequisites met) and try all subsets of size at most k.',
  tags: ['graph', 'bitmask DP', 'topological sort', 'dynamic programming', 'hard'],

  code: {
    pseudocode: `function minNumberOfSemesters(n, relations, k):
  pre[i] = bitmask of prerequisites for course i
  dp[mask] = min semesters to complete courses in mask
  dp[0] = 0
  for mask in 0 to (1<<n)-1:
    if dp[mask] == INF: continue
    // find available courses (prereqs met)
    available = 0
    for i in 0..n-1:
      if course i not in mask and pre[i] subset of mask:
        available |= (1<<i)
    // try all subsets of available of size <= k
    sub = available
    while sub > 0:
      if popcount(sub) <= k:
        dp[mask|sub] = min(dp[mask|sub], dp[mask]+1)
      sub = (sub-1) & available
  return dp[(1<<n)-1]`,

    python: `def minNumberOfSemesters(n, relations, k):
    pre=[0]*n
    for a,b in relations: pre[b-1]|=(1<<(a-1))
    INF=float('inf')
    dp=[INF]*(1<<n); dp[0]=0
    for mask in range(1<<n):
        if dp[mask]==INF: continue
        avail=0
        for i in range(n):
            if not(mask>>i&1) and (pre[i]&mask)==pre[i]:
                avail|=(1<<i)
        sub=avail
        while sub:
            if bin(sub).count('1')<=k:
                dp[mask|sub]=min(dp[mask|sub],dp[mask]+1)
            sub=(sub-1)&avail
    return dp[(1<<n)-1]`,

    javascript: `function minNumberOfSemesters(n, relations, k) {
  const pre=new Array(n).fill(0);
  for(const[a,b] of relations) pre[b-1]|=(1<<(a-1));
  const INF=Infinity, dp=new Array(1<<n).fill(INF); dp[0]=0;
  for(let mask=0;mask<(1<<n);mask++) {
    if(dp[mask]===INF) continue;
    let avail=0;
    for(let i=0;i<n;i++)
      if(!(mask>>i&1)&&(pre[i]&mask)===pre[i]) avail|=(1<<i);
    for(let sub=avail;sub>0;sub=(sub-1)&avail)
      if(sub.toString(2).split('').filter(c=>c==='1').length<=k)
        dp[mask|sub]=Math.min(dp[mask|sub],dp[mask]+1);
  }
  return dp[(1<<n)-1];
}`,

    java: `public int minNumberOfSemesters(int n, int[][] relations, int k) {
    int[] pre=new int[n];
    for(int[]r:relations) pre[r[1]-1]|=(1<<(r[0]-1));
    int[]dp=new int[1<<n]; Arrays.fill(dp,Integer.MAX_VALUE); dp[0]=0;
    for(int mask=0;mask<(1<<n);mask++){
        if(dp[mask]==Integer.MAX_VALUE) continue;
        int avail=0;
        for(int i=0;i<n;i++) if((mask>>i&1)==0&&(pre[i]&mask)==pre[i]) avail|=(1<<i);
        for(int sub=avail;sub>0;sub=(sub-1)&avail)
            if(Integer.bitCount(sub)<=k) dp[mask|sub]=Math.min(dp[mask|sub],dp[mask]+1);
    }
    return dp[(1<<n)-1];
}`,
  },

  defaultInput: {
    n: 4,
    relations: [[2,1],[3,1],[1,4]],
    k: 2,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Courses labeled 1 to n (max 15)',
    },
    {
      name: 'k',
      label: 'Max Courses per Semester',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum courses allowed per semester',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const relations = input.relations as number[][];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const pre = new Array(n).fill(0);
    for (const [a, b] of relations) {
      pre[b - 1] |= 1 << (a - 1);
    }

    steps.push({
      line: 2,
      explanation: `Prerequisites bitmasks: [${pre.map((p, i) => `course${i + 1}:${p.toString(2).padStart(n, '0')}`).join(', ')}]. k=${k} max per semester.`,
      variables: { prerequisites: pre.join(', '), k, n },
      visualization: {
        type: 'array',
        array: pre,
        highlights: {},
        labels: Object.fromEntries(pre.map((_, i) => [i, `pre[${i + 1}]`])),
      },
    });

    const INF = 10000;
    const dp = new Array(1 << n).fill(INF);
    dp[0] = 0;

    const totalMasks = 1 << n;
    let processedCount = 0;

    for (let mask = 0; mask < totalMasks; mask++) {
      if (dp[mask] === INF) continue;
      processedCount++;

      // Find available courses
      let avail = 0;
      for (let i = 0; i < n; i++) {
        if (!(mask >> i & 1) && (pre[i] & mask) === pre[i]) {
          avail |= 1 << i;
        }
      }

      if (avail === 0) continue;

      const takenCourses = mask.toString(2).split('').filter(c => c === '1').length;
      const availCourses: number[] = [];
      for (let i = 0; i < n; i++) {
        if (avail >> i & 1) availCourses.push(i + 1);
      }

      if (processedCount <= 4) {
        steps.push({
          line: 6,
          explanation: `dp[${mask.toString(2).padStart(n, '0')}]=${dp[mask]} semesters. Available courses (prereqs met): [${availCourses.join(', ')}]. Try subsets of size <= ${k}.`,
          variables: { mask: mask.toString(2), semesters: dp[mask], available: availCourses.join(', ') },
          visualization: {
            type: 'array',
            array: Array.from({ length: Math.min(totalMasks, 8) }, (_, i) => (dp[i] === INF ? 999 : dp[i])),
            highlights: { [mask % 8]: 'active' },
            labels: { [mask % 8]: `m=${mask}` },
          },
        });
      }

      // Try all subsets
      for (let sub = avail; sub > 0; sub = (sub - 1) & avail) {
        const bits = sub.toString(2).split('').filter(c => c === '1').length;
        if (bits <= k) {
          const newMask = mask | sub;
          if (dp[mask] + 1 < dp[newMask]) {
            dp[newMask] = dp[mask] + 1;
          }
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Bitmask DP complete. Minimum semesters = dp[${((1 << n) - 1).toString(2)}] = ${dp[(1 << n) - 1]}.`,
      variables: { result: dp[(1 << n) - 1], allCoursesMask: (1 << n) - 1 },
      visualization: {
        type: 'array',
        array: dp.slice(0, Math.min(8, dp.length)).map(d => (d === INF ? 999 : d)),
        highlights: { [Math.min(7, (1 << n) - 1)]: 'found' },
        labels: { [Math.min(7, (1 << n) - 1)]: `ans=${dp[(1 << n) - 1]}` },
      },
    });

    return steps;
  },
};

export default parallelCoursesIi;
