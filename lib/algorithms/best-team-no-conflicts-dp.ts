import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTeamNoConflictsDp: AlgorithmDefinition = {
  id: 'best-team-no-conflicts-dp',
  title: 'Best Team With No Conflicts (DP)',
  leetcodeNumber: 1626,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given scores and ages of players, find the highest score team with no conflicts (no younger player has higher score than older). Sort by age then score, then apply LIS-style DP where dp[i] = max score selecting players up to i where player i is included.',
  tags: ['dynamic programming', 'sorting', 'lis', 'greedy'],

  code: {
    pseudocode: `function bestTeamScore(scores, ages):
  players = sorted by (age, score)
  dp[i] = max team score ending at player i
  for i in 0..n-1:
    dp[i] = scores[i]
    for j in 0..i-1:
      if scores[j] <= scores[i]:  // no conflict
        dp[i] = max(dp[i], dp[j] + scores[i])
  return max(dp)`,
    python: `def bestTeamScore(scores: list[int], ages: list[int]) -> int:
    players = sorted(zip(ages, scores))
    n = len(players)
    dp = [p[1] for p in players]
    for i in range(n):
        for j in range(i):
            if players[j][1] <= players[i][1]:
                dp[i] = max(dp[i], dp[j]+players[i][1])
    return max(dp)`,
    javascript: `function bestTeamScore(scores, ages) {
  const players=[...scores.map((s,i)=>[ages[i],s])].sort((a,b)=>a[0]===b[0]?a[1]-b[1]:a[0]-b[0]);
  const n=players.length,dp=players.map(p=>p[1]);
  for(let i=0;i<n;i++)for(let j=0;j<i;j++)
    if(players[j][1]<=players[i][1])dp[i]=Math.max(dp[i],dp[j]+players[i][1]);
  return Math.max(...dp);
}`,
    java: `public int bestTeamScore(int[] scores, int[] ages) {
    int n=scores.length;
    int[][] players=new int[n][2];
    for(int i=0;i<n;i++){players[i][0]=ages[i];players[i][1]=scores[i];}
    Arrays.sort(players,(a,b)->a[0]==b[0]?a[1]-b[1]:a[0]-b[0]);
    int[] dp=new int[n];
    for(int i=0;i<n;i++){
        dp[i]=players[i][1];
        for(int j=0;j<i;j++)
            if(players[j][1]<=players[i][1])dp[i]=Math.max(dp[i],dp[j]+players[i][1]);
    }
    return Arrays.stream(dp).max().getAsInt();
}`,
  },

  defaultInput: {
    scores: [4, 5, 6, 5],
    ages: [2, 1, 2, 1],
  },

  inputFields: [
    {
      name: 'scores',
      label: 'Scores',
      type: 'array',
      defaultValue: [4, 5, 6, 5],
      placeholder: '4,5,6,5',
      helperText: 'Player scores',
    },
    {
      name: 'ages',
      label: 'Ages',
      type: 'array',
      defaultValue: [2, 1, 2, 1],
      placeholder: '2,1,2,1',
      helperText: 'Player ages',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const scores = input.scores as number[];
    const ages = input.ages as number[];
    const steps: AlgorithmStep[] = [];

    const players: [number, number][] = scores.map((s, i) => [ages[i], s]);
    players.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `Sort players by (age, score): ${players.map(p => '[age=' + p[0] + ',score=' + p[1] + ']').join(', ')}.`,
      variables: { players: JSON.stringify(players) },
      visualization: {
        type: 'array',
        array: players.map(p => p[1]),
        highlights: {},
        labels: players.reduce((a, p, i) => ({ ...a, [i]: `age=${p[0]}` }), {}),
      } as ArrayVisualization,
    });

    const n = players.length;
    const dp: number[] = players.map(p => p[1]);

    steps.push({
      line: 3,
      explanation: `Initialize dp[i] = score of player i: [${dp}].`,
      variables: { dp: JSON.stringify(dp) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (players[j][1] <= players[i][1]) {
          const candidate = dp[j] + players[i][1];
          if (candidate > dp[i]) {
            dp[i] = candidate;
            steps.push({
              line: 7,
              explanation: `Player j=${j}(score=${players[j][1]}) <= player i=${i}(score=${players[i][1]}). No conflict. dp[${i}] = dp[${j}] + ${players[i][1]} = ${dp[i]}.`,
              variables: { i, j, 'dp[i]': dp[i] },
              visualization: {
                type: 'array',
                array: [...dp],
                highlights: { [i]: 'active', [j]: 'found' },
                labels: { [i]: `dp=${dp[i]}`, [j]: `dp=${dp[j]}` },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    const result = Math.max(...dp);
    steps.push({
      line: 9,
      explanation: `Best team score = max(dp) = ${result}.`,
      variables: { dp: JSON.stringify(dp), result },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { [dp.indexOf(result)]: 'found' },
        labels: { [dp.indexOf(result)]: `max=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default bestTeamNoConflictsDp;
