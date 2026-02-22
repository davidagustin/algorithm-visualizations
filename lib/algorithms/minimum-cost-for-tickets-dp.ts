import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostForTicketsDp: AlgorithmDefinition = {
  id: 'minimum-cost-for-tickets-dp',
  title: 'Minimum Cost For Tickets - DP',
  leetcodeNumber: 983,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given travel days and costs for 1-day, 7-day, and 30-day passes, find the minimum total cost. dp[i] = minimum cost to travel through day i. On non-travel days dp[i] = dp[i-1]. On travel days try all three pass options and take the minimum.',
  tags: ['dynamic programming', 'greedy', 'array'],

  code: {
    pseudocode: `function mincostTickets(days, costs):
  lastDay = days[-1]
  travelDays = set(days)
  dp = array of size lastDay+1, dp[0] = 0
  for i from 1 to lastDay:
    if i not in travelDays:
      dp[i] = dp[i-1]
    else:
      dp[i] = min(
        dp[i-1] + costs[0],
        dp[max(0, i-7)] + costs[1],
        dp[max(0, i-30)] + costs[2]
      )
  return dp[lastDay]`,
    python: `def mincostTickets(days: list[int], costs: list[int]) -> int:
    last = days[-1]
    travel = set(days)
    dp = [0] * (last + 1)
    for i in range(1, last + 1):
        if i not in travel:
            dp[i] = dp[i-1]
        else:
            dp[i] = min(
                dp[i-1] + costs[0],
                dp[max(0, i-7)] + costs[1],
                dp[max(0, i-30)] + costs[2]
            )
    return dp[last]`,
    javascript: `function mincostTickets(days, costs) {
  const last = days[days.length - 1];
  const travel = new Set(days);
  const dp = new Array(last + 1).fill(0);
  for (let i = 1; i <= last; i++) {
    if (!travel.has(i)) {
      dp[i] = dp[i-1];
    } else {
      dp[i] = Math.min(
        dp[i-1] + costs[0],
        dp[Math.max(0, i-7)] + costs[1],
        dp[Math.max(0, i-30)] + costs[2]
      );
    }
  }
  return dp[last];
}`,
    java: `public int mincostTickets(int[] days, int[] costs) {
    int last = days[days.length - 1];
    Set<Integer> travel = new HashSet<>();
    for (int d : days) travel.add(d);
    int[] dp = new int[last + 1];
    for (int i = 1; i <= last; i++) {
        if (!travel.contains(i)) {
            dp[i] = dp[i-1];
        } else {
            dp[i] = Math.min(dp[i-1] + costs[0],
                     Math.min(dp[Math.max(0, i-7)] + costs[1],
                              dp[Math.max(0, i-30)] + costs[2]));
        }
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
      helperText: 'Days you plan to travel',
    },
    {
      name: 'costs',
      label: 'Costs [1-day, 7-day, 30-day]',
      type: 'array',
      defaultValue: [2, 7, 15],
      placeholder: '2,7,15',
      helperText: 'Cost for 1-day, 7-day, and 30-day passes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const days = input.days as number[];
    const costs = input.costs as number[];
    const steps: AlgorithmStep[] = [];

    const last = days[days.length - 1];
    const travel = new Set(days);
    const dp = new Array(last + 1).fill(0);

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.slice(0, Math.min(dpArr.length, 25)),
      highlights,
      labels: Object.fromEntries(dpArr.slice(0, 25).map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 3,
      explanation: `Travel days: [${days.join(',')}]. Pass costs: 1-day=$${costs[0]}, 7-day=$${costs[1]}, 30-day=$${costs[2]}.`,
      variables: { lastDay: last, numTravelDays: days.length },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= last; i++) {
      if (!travel.has(i)) {
        dp[i] = dp[i - 1];
        if (i <= 24) {
          steps.push({
            line: 7,
            explanation: `Day ${i}: not a travel day. dp[${i}] = dp[${i - 1}] = ${dp[i]}.`,
            variables: { day: i, 'dp[i]': dp[i] },
            visualization: makeViz([...dp], { [Math.min(i, 24)]: 'default' }),
          });
        }
      } else {
        const opt1 = dp[i - 1] + costs[0];
        const opt7 = dp[Math.max(0, i - 7)] + costs[1];
        const opt30 = dp[Math.max(0, i - 30)] + costs[2];
        dp[i] = Math.min(opt1, opt7, opt30);
        const chosen = dp[i] === opt1 ? '1-day' : dp[i] === opt7 ? '7-day' : '30-day';
        if (i <= 24) {
          steps.push({
            line: 8,
            explanation: `Day ${i}: travel day. 1-day=$${opt1}, 7-day=$${opt7}, 30-day=$${opt30}. Best: ${chosen} pass. dp[${i}] = ${dp[i]}.`,
            variables: { day: i, opt1, opt7, opt30, 'dp[i]': dp[i], bestPass: chosen },
            visualization: makeViz([...dp], { [Math.min(i, 24)]: 'found' }),
          });
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `Minimum cost to cover all travel days = dp[${last}] = ${dp[last]}.`,
      variables: { result: dp[last] },
      visualization: makeViz([...dp], { [Math.min(last, 24)]: 'found' }),
    });

    return steps;
  },
};

export default minimumCostForTicketsDp;
