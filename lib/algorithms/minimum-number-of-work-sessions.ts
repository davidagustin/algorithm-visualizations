import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumNumberOfWorkSessions: AlgorithmDefinition = {
  id: 'minimum-number-of-work-sessions',
  title: 'Minimum Number of Work Sessions to Finish the Tasks',
  leetcodeNumber: 1986,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given tasks with durations and a session length limit, find the minimum number of work sessions to complete all tasks. Tasks can be split across sessions but not split within. Uses bitmask DP: dp[mask] = minimum sessions and remaining time in last session.',
  tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
  code: {
    pseudocode: `function minSessions(tasks, sessionTime):
  n = length(tasks)
  dp[mask] = (min sessions, time remaining in last session)
  dp[0] = (1, sessionTime)
  for mask from 0 to 2^n - 1:
    for i from 0 to n-1:
      if mask has bit i: continue
      (sessions, remaining) = dp[mask]
      if remaining >= tasks[i]:
        dp[mask|(1<<i)] = min via (sessions, remaining-tasks[i])
      else:
        dp[mask|(1<<i)] = min via (sessions+1, sessionTime-tasks[i])
  return dp[(1<<n)-1].sessions`,
    python: `def minSessions(tasks, sessionTime):
    n = len(tasks)
    INF = (float('inf'), 0)
    dp = [INF] * (1 << n)
    dp[0] = (1, sessionTime)
    for mask in range(1 << n):
        if dp[mask] == INF: continue
        sessions, remaining = dp[mask]
        for i in range(n):
            if mask >> i & 1: continue
            nm = mask | (1 << i)
            if remaining >= tasks[i]:
                cand = (sessions, remaining - tasks[i])
            else:
                cand = (sessions + 1, sessionTime - tasks[i])
            if cand < dp[nm]:
                dp[nm] = cand
    return dp[(1 << n) - 1][0]`,
    javascript: `function minSessions(tasks, sessionTime) {
  const n = tasks.length;
  const dp = new Array(1<<n).fill(null).map(()=>[Infinity,0]);
  dp[0] = [1, sessionTime];
  for (let mask=0;mask<(1<<n);mask++) {
    if (dp[mask][0]===Infinity) continue;
    const [sessions, remaining] = dp[mask];
    for (let i=0;i<n;i++) {
      if (mask>>i&1) continue;
      const nm = mask|(1<<i);
      const cand = remaining>=tasks[i]
        ? [sessions, remaining-tasks[i]]
        : [sessions+1, sessionTime-tasks[i]];
      if (cand[0]<dp[nm][0]||(cand[0]===dp[nm][0]&&cand[1]>dp[nm][1]))
        dp[nm]=cand;
    }
  }
  return dp[(1<<n)-1][0];
}`,
    java: `public int minSessions(int[] tasks, int sessionTime) {
    int n = tasks.length;
    int[][] dp = new int[1<<n][2];
    for (int[] r:dp) {r[0]=Integer.MAX_VALUE/2;r[1]=0;}
    dp[0][0]=1; dp[0][1]=sessionTime;
    for (int mask=0;mask<(1<<n);mask++) {
        if (dp[mask][0]==Integer.MAX_VALUE/2) continue;
        for (int i=0;i<n;i++) {
            if ((mask>>i&1)!=0) continue;
            int nm=mask|(1<<i);
            int s,r;
            if (dp[mask][1]>=tasks[i]){s=dp[mask][0];r=dp[mask][1]-tasks[i];}
            else{s=dp[mask][0]+1;r=sessionTime-tasks[i];}
            if (s<dp[nm][0]||(s==dp[nm][0]&&r>dp[nm][1])){dp[nm][0]=s;dp[nm][1]=r;}
        }
    }
    return dp[(1<<n)-1][0];
}`,
  },
  defaultInput: { tasks: [1, 2, 3], sessionTime: 3 },
  inputFields: [
    {
      name: 'tasks',
      label: 'Task Durations',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Duration of each task (max 5 tasks)',
    },
    {
      name: 'sessionTime',
      label: 'Session Time Limit',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum duration per work session',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tasks = (input.tasks as number[]).slice(0, 5);
    const sessionTime = input.sessionTime as number;
    const n = tasks.length;
    const size = 1 << n;
    const INF = 99999;

    // dp[mask] = [sessions, remaining] encoded as single number: sessions * 1000 + remaining
    const dp: (number | null)[] = new Array(size).fill(null);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function encode(sessions: number, remaining: number): number {
      return sessions * 1000 + remaining;
    }
    function getSessions(v: number): number { return Math.floor(v / 1000); }
    function getRemaining(v: number): number { return v % 1000; }

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if (dp[mask] !== null) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.map(v => v === null ? null : getSessions(v as number)), highlights, labels };
    }

    dp[0] = encode(1, sessionTime);
    steps.push({
      line: 1,
      explanation: `tasks=${JSON.stringify(tasks)}, sessionTime=${sessionTime}. dp[mask]=sessions to complete tasks in mask. dp[0]=1 session (empty).`,
      variables: { tasks, sessionTime },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if (dp[mask] === null) continue;
      const sessions = getSessions(dp[mask] as number);
      const remaining = getRemaining(dp[mask] as number);

      for (let i = 0; i < n; i++) {
        if (mask >> i & 1) continue;
        const nm = mask | (1 << i);
        let candSessions: number, candRemaining: number;
        if (remaining >= tasks[i]) {
          candSessions = sessions;
          candRemaining = remaining - tasks[i];
        } else {
          candSessions = sessions + 1;
          candRemaining = sessionTime - tasks[i];
        }

        const betterThanCurrent =
          dp[nm] === null ||
          candSessions < getSessions(dp[nm] as number) ||
          (candSessions === getSessions(dp[nm] as number) && candRemaining > getRemaining(dp[nm] as number));

        if (betterThanCurrent) {
          dp[nm] = encode(candSessions, candRemaining);
          steps.push({
            line: 9,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, add task[${i}]=${tasks[i]}: ${remaining>=tasks[i]?'fits in current session':'new session'}. dp[${nm.toString(2).padStart(n,'0')}]=sessions=${candSessions}.`,
            variables: { mask, i, tasks_i: tasks[i], sessions: candSessions, remaining: candRemaining },
            visualization: makeViz(nm, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    const result = dp[fullMask] === null ? INF : getSessions(dp[fullMask] as number);
    steps.push({
      line: 11,
      explanation: `Minimum work sessions to complete all tasks: ${result}.`,
      variables: { result },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default minimumNumberOfWorkSessions;
