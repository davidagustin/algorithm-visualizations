import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumProfitJobSchedulingDp: AlgorithmDefinition = {
  id: 'maximum-profit-job-scheduling-dp',
  title: 'Maximum Profit in Job Scheduling (DP)',
  leetcodeNumber: 1235,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n jobs with startTime, endTime, profit, find max profit scheduling non-overlapping jobs. Sort by endTime. dp[i] = max profit considering first i jobs. For each job, binary search for latest non-overlapping job, then take max of skip or include.',
  tags: ['dynamic programming', 'binary search', 'sorting', 'interval scheduling'],

  code: {
    pseudocode: `function jobScheduling(startTime, endTime, profit):
  jobs = sorted by endTime
  dp[0] = 0 (no jobs selected)
  for i in 1..n:
    // option 1: skip job i
    dp[i] = dp[i-1]
    // option 2: include job i, binary search for last non-overlapping
    k = latest j where jobs[j].end <= jobs[i].start
    dp[i] = max(dp[i], dp[k] + jobs[i].profit)
  return dp[n]`,
    python: `def jobScheduling(startTime, endTime, profit) -> int:
    jobs = sorted(zip(endTime, startTime, profit))
    n = len(jobs)
    dp = [0]*(n+1)
    ends = [0]+[j[0] for j in jobs]
    for i in range(1,n+1):
        end, start, p = jobs[i-1]
        # binary search for last job ending <= start
        lo, hi = 0, i-1
        while lo < hi:
            mid = (lo+hi+1)//2
            if ends[mid] <= start: lo = mid
            else: hi = mid-1
        dp[i] = max(dp[i-1], dp[lo]+p)
    return dp[n]`,
    javascript: `function jobScheduling(startTime, endTime, profit) {
  const jobs=startTime.map((_,i)=>[endTime[i],startTime[i],profit[i]]).sort((a,b)=>a[0]-b[0]);
  const n=jobs.length,dp=new Array(n+1).fill(0);
  const ends=[0,...jobs.map(j=>j[0])];
  for(let i=1;i<=n;i++){
    const[end,start,p]=jobs[i-1];
    let lo=0,hi=i-1;
    while(lo<hi){const mid=(lo+hi+1)>>1;if(ends[mid]<=start)lo=mid;else hi=mid-1;}
    dp[i]=Math.max(dp[i-1],dp[lo]+p);
  }
  return dp[n];
}`,
    java: `public int jobScheduling(int[] s, int[] e, int[] p) {
    int n=s.length;
    int[][] jobs=new int[n][3];
    for(int i=0;i<n;i++){jobs[i][0]=e[i];jobs[i][1]=s[i];jobs[i][2]=p[i];}
    Arrays.sort(jobs,(a,b)->a[0]-b[0]);
    int[] dp=new int[n+1],ends=new int[n+1];
    for(int i=1;i<=n;i++) ends[i]=jobs[i-1][0];
    for(int i=1;i<=n;i++){
        int lo=0,hi=i-1;
        while(lo<hi){int mid=(lo+hi+1)/2;if(ends[mid]<=jobs[i-1][1])lo=mid;else hi=mid-1;}
        dp[i]=Math.max(dp[i-1],dp[lo]+jobs[i-1][2]);
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
      helperText: 'Job start times',
    },
    {
      name: 'endTime',
      label: 'End Times',
      type: 'array',
      defaultValue: [3, 4, 5, 6],
      placeholder: '3,4,5,6',
      helperText: 'Job end times',
    },
    {
      name: 'profit',
      label: 'Profits',
      type: 'array',
      defaultValue: [50, 10, 40, 70],
      placeholder: '50,10,40,70',
      helperText: 'Job profits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startTime = input.startTime as number[];
    const endTime = input.endTime as number[];
    const profit = input.profit as number[];
    const steps: AlgorithmStep[] = [];

    const jobs: [number, number, number][] = startTime.map((_, i) => [endTime[i], startTime[i], profit[i]]);
    jobs.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `${jobs.length} jobs sorted by endTime: ${jobs.map(j => '[s=' + j[1] + ',e=' + j[0] + ',p=' + j[2] + ']').join(', ')}.`,
      variables: { jobs: JSON.stringify(jobs) },
      visualization: {
        type: 'array',
        array: jobs.map(j => j[2]),
        highlights: {},
        labels: jobs.reduce((a, j, i) => ({ ...a, [i]: `p=${j[2]}` }), {}),
      } as ArrayVisualization,
    });

    const n = jobs.length;
    const dp: number[] = new Array(n + 1).fill(0);
    const ends: number[] = [0, ...jobs.map(j => j[0])];

    steps.push({
      line: 2,
      explanation: `dp[0]=0 (base). ends=[${ends}] for binary search.`,
      variables: { dp: JSON.stringify(dp) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { 0: 'found' },
        labels: { 0: 'dp[0]=0' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= n; i++) {
      const [end, start, p] = jobs[i - 1];
      let lo = 0, hi = i - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (ends[mid] <= start) lo = mid;
        else hi = mid - 1;
      }
      const prev = dp[i];
      dp[i] = Math.max(dp[i - 1], dp[lo] + p);
      steps.push({
        line: 7,
        explanation: `Job ${i}: end=${end}, start=${start}, p=${p}. Last non-overlap: dp[${lo}]=${dp[lo]}. dp[${i}]=max(dp[${i - 1}]=${dp[i - 1]}, ${dp[lo]}+${p}=${dp[lo] + p})=${dp[i]}.`,
        variables: { i, lo, 'dp[i]': dp[i] },
        visualization: {
          type: 'array',
          array: [...dp].slice(0, i + 1),
          highlights: { [i]: 'active', [lo]: 'found' },
          labels: { [i]: `dp=${dp[i]}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 9,
      explanation: `Max profit = dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: {
        type: 'array',
        array: [...dp].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `ans=${dp[n]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumProfitJobSchedulingDp;
