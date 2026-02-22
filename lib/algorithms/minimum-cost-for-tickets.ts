import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumCostForTickets: AlgorithmDefinition = {
  id: 'minimum-cost-for-tickets',
  title: 'Minimum Cost For Tickets',
  leetcodeNumber: 983,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given travel days and ticket costs for 1-day, 7-day, and 30-day passes, find the minimum cost to travel on all given days. Uses DP over each day of the year: dp[i] = min cost to cover travel through day i. On non-travel days, cost equals previous day. On travel days, pick the cheapest of the three passes.',
  tags: ['dynamic programming', 'array', 'greedy'],

  code: {
    pseudocode: `function mincostTickets(days, costs):
  travelDays = set(days)
  last = days[-1]
  dp = array of size last+1
  for i in 1..last:
    if i not in travelDays:
      dp[i] = dp[i-1]
    else:
      dp[i] = min(
        dp[i-1] + costs[0],           // 1-day pass
        dp[max(0,i-7)] + costs[1],    // 7-day pass
        dp[max(0,i-30)] + costs[2]    // 30-day pass
      )
  return dp[last]`,

    python: `def mincostTickets(days, costs):
    travelDays = set(days)
    last = days[-1]
    dp = [0] * (last + 1)
    for i in range(1, last + 1):
        if i not in travelDays:
            dp[i] = dp[i-1]
        else:
            dp[i] = min(
                dp[i-1] + costs[0],
                dp[max(0,i-7)] + costs[1],
                dp[max(0,i-30)] + costs[2]
            )
    return dp[last]`,

    javascript: `function mincostTickets(days, costs) {
  const travelDays = new Set(days);
  const last = days[days.length-1];
  const dp = new Array(last+1).fill(0);
  for (let i = 1; i <= last; i++) {
    if (!travelDays.has(i)) {
      dp[i] = dp[i-1];
    } else {
      dp[i] = Math.min(
        dp[i-1] + costs[0],
        dp[Math.max(0,i-7)] + costs[1],
        dp[Math.max(0,i-30)] + costs[2]
      );
    }
  }
  return dp[last];
}`,

    java: `public int mincostTickets(int[] days, int[] costs) {
    Set<Integer> travel = new HashSet<>();
    for (int d : days) travel.add(d);
    int last = days[days.length-1];
    int[] dp = new int[last+1];
    for (int i = 1; i <= last; i++) {
        if (!travel.contains(i)) { dp[i] = dp[i-1]; continue; }
        dp[i] = Math.min(dp[i-1]+costs[0],
                 Math.min(dp[Math.max(0,i-7)]+costs[1],
                          dp[Math.max(0,i-30)]+costs[2]));
    }
    return dp[last];
}`,
  },

  defaultInput: {
    days: [1, 4, 6, 7, 8, 20],
    costs: [2, 7, 15],
  },

  inputFields: [
    {
      name: 'days',
      label: 'Travel Days',
      type: 'array',
      defaultValue: [1, 4, 6, 7, 8, 20],
      placeholder: '1,4,6,7,8,20',
      helperText: 'Days you need to travel (1-365)',
    },
    {
      name: 'costs',
      label: 'Ticket Costs [1-day, 7-day, 30-day]',
      type: 'array',
      defaultValue: [2, 7, 15],
      placeholder: '2,7,15',
      helperText: 'Cost of 1-day, 7-day, and 30-day passes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const days = input.days as number[];
    const costs = input.costs as number[];
    const steps: AlgorithmStep[] = [];

    const travelDays = new Set(days);
    const last = days[days.length - 1];
    const dp = new Array(last + 1).fill(0);

    steps.push({
      line: 1,
      explanation: `Travel days: [${days.join(', ')}]. Passes: 1-day=$${costs[0]}, 7-day=$${costs[1]}, 30-day=$${costs[2]}. dp[i]=min cost through day i.`,
      variables: { travelDays: days, costs, lastDay: last },
      visualization: {
        type: 'array',
        array: days,
        highlights: {},
        labels: Object.fromEntries(days.map((d, i) => [i, `d${d}`])),
      },
    });

    for (let i = 1; i <= last; i++) {
      if (!travelDays.has(i)) {
        dp[i] = dp[i - 1];
      } else {
        const opt1 = dp[i - 1] + costs[0];
        const opt7 = dp[Math.max(0, i - 7)] + costs[1];
        const opt30 = dp[Math.max(0, i - 30)] + costs[2];
        dp[i] = Math.min(opt1, opt7, opt30);

        if (days.includes(i)) {
          const displayDp = dp.filter((_, idx) => idx <= i && idx >= Math.max(0, i - 5));
          steps.push({
            line: 7,
            explanation: `Day ${i} (travel day): 1-day=$${opt1}, 7-day=$${opt7}, 30-day=$${opt30}. Best: $${dp[i]}.`,
            variables: { day: i, opt1day: opt1, opt7day: opt7, opt30day: opt30, chosen: dp[i] },
            visualization: {
              type: 'array',
              array: displayDp,
              highlights: { [displayDp.length - 1]: 'found' },
              labels: Object.fromEntries(displayDp.map((_, idx) => [idx, `d${Math.max(0, i - 5) + idx}`])),
            },
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Minimum cost to travel on all specified days: $${dp[last]}.`,
      variables: { answer: dp[last] },
      visualization: {
        type: 'array',
        array: days.map(d => dp[d]),
        highlights: { [days.length - 1]: 'found' },
        labels: Object.fromEntries(days.map((d, i) => [i, `d${d}`])),
      },
    });

    return steps;
  },
};

export default minimumCostForTickets;
