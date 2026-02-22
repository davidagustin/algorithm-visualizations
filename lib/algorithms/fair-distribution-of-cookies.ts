import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const fairDistributionOfCookies: AlgorithmDefinition = {
  id: 'fair-distribution-of-cookies',
  title: 'Fair Distribution of Cookies',
  leetcodeNumber: 2305,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given cookie bags and k children, distribute all bags to minimize the maximum cookies any child receives (unfairness). Uses bitmask DP: subSum[mask]=total cookies in bags of mask, dp[i][mask]=min unfairness distributing bags in mask to i children.',
  tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
  code: {
    pseudocode: `function distributeCookies(cookies, k):
  n = length(cookies)
  subSum[mask] = sum of cookies[i] for each bit i in mask
  dp[k][2^n]: dp[i][mask] = min unfairness
  dp[0][0] = 0
  for i from 1 to k:
    for mask from 0 to 2^n-1:
      dp[i][mask] = INF
      for sub = mask; sub > 0; sub = (sub-1)&mask:
        dp[i][mask] = min(dp[i][mask], max(dp[i-1][mask^sub], subSum[sub]))
  return dp[k][(1<<n)-1]`,
    python: `def distributeCookies(cookies, k):
    n = len(cookies)
    sub_sum = [0] * (1 << n)
    for mask in range(1 << n):
        for i in range(n):
            if mask & (1 << i):
                sub_sum[mask] += cookies[i]
    dp = [[float('inf')] * (1 << n) for _ in range(k + 1)]
    dp[0][0] = 0
    for i in range(1, k + 1):
        for mask in range(1 << n):
            sub = mask
            while sub:
                dp[i][mask] = min(dp[i][mask],
                    max(dp[i-1][mask^sub], sub_sum[sub]))
                sub = (sub - 1) & mask
    return dp[k][(1 << n) - 1]`,
    javascript: `function distributeCookies(cookies, k) {
  const n = cookies.length;
  const subSum = new Array(1 << n).fill(0);
  for (let mask = 0; mask < (1 << n); mask++)
    for (let i = 0; i < n; i++)
      if (mask & (1 << i)) subSum[mask] += cookies[i];
  const dp = Array.from({length:k+1},()=>new Array(1<<n).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= k; i++)
    for (let mask = 0; mask < (1 << n); mask++)
      for (let sub = mask; sub > 0; sub = (sub-1)&mask)
        dp[i][mask] = Math.min(dp[i][mask], Math.max(dp[i-1][mask^sub], subSum[sub]));
  return dp[k][(1<<n)-1];
}`,
    java: `public int distributeCookies(int[] cookies, int k) {
    int n = cookies.length;
    int[] subSum = new int[1 << n];
    for (int mask=0;mask<(1<<n);mask++)
        for (int i=0;i<n;i++)
            if ((mask>>i&1)!=0) subSum[mask]+=cookies[i];
    int[][] dp = new int[k+1][1<<n];
    for (int[] r:dp) Arrays.fill(r,Integer.MAX_VALUE/2);
    dp[0][0]=0;
    for (int i=1;i<=k;i++)
        for (int mask=0;mask<(1<<n);mask++)
            for (int sub=mask;sub>0;sub=(sub-1)&mask)
                dp[i][mask]=Math.min(dp[i][mask],Math.max(dp[i-1][mask^sub],subSum[sub]));
    return dp[k][(1<<n)-1];
}`,
  },
  defaultInput: { cookies: [8, 15, 10, 20, 8], k: 2 },
  inputFields: [
    {
      name: 'cookies',
      label: 'Cookie Bag Sizes',
      type: 'array',
      defaultValue: [8, 15, 10, 20, 8],
      placeholder: '8,15,10,20,8',
      helperText: 'Number of cookies in each bag (max 5 bags)',
    },
    {
      name: 'k',
      label: 'Number of Children (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of children',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cookies = (input.cookies as number[]).slice(0, 5);
    const k = Math.min(input.k as number, cookies.length);
    const n = cookies.length;
    const size = 1 << n;
    const INF = 99999;

    const subSum: number[] = new Array(size).fill(0);
    for (let mask = 0; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) subSum[mask] += cookies[i];
      }
    }

    const dpFlat: (number | null)[] = new Array((k + 1) * size).fill(INF);
    const labels: string[] = [];
    for (let child = 0; child <= k; child++) {
      for (let mask = 0; mask < size; mask++) {
        labels.push(`c${child}:${mask.toString(2).padStart(n,'0')}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function idxF(child: number, mask: number): number { return child * size + mask; }
    function getV(child: number, mask: number): number { return dpFlat[idxF(child, mask)] as number; }
    function setV(child: number, mask: number, v: number): void { dpFlat[idxF(child, mask)] = v; }

    function makeViz(activeIdxF: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < (k + 1) * size; i++) {
        if ((dpFlat[i] as number) < INF) highlights[i] = 'found';
      }
      if (activeIdxF !== null) highlights[activeIdxF] = 'active';
      return { type: 'dp-table', values: dpFlat.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    setV(0, 0, 0);
    steps.push({
      line: 1,
      explanation: `cookies=${JSON.stringify(cookies)}, k=${k}. dp[child][mask]=min unfairness. dp[0][0]=0.`,
      variables: { cookies, k, n },
      visualization: makeViz(idxF(0, 0)),
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
          if (mask > 0 && (mask === size - 1 || i === k)) {
            steps.push({
              line: 8,
              explanation: `children=${i}, mask=${mask.toString(2).padStart(n,'0')}: min max cookies=${best}.`,
              variables: { children: i, mask, best },
              visualization: makeViz(idxF(i, mask)),
            });
          }
        }
      }
    }

    const result = getV(k, size - 1);
    steps.push({
      line: 10,
      explanation: `Minimum unfairness (max cookies any child gets): ${result}.`,
      variables: { result },
      visualization: makeViz(idxF(k, size - 1)),
    });

    return steps;
  },
};

export default fairDistributionOfCookies;
