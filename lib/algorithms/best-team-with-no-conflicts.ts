import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const bestTeamWithNoConflicts: AlgorithmDefinition = {
  id: 'best-team-with-no-conflicts',
  title: 'Best Team With No Conflicts',
  leetcodeNumber: 1626,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given arrays of scores and ages for players, form a team with maximum total score such that for any two players on the team, if one is older, their score must be at least as high (no conflicts). Sort players by age then score, and apply a Longest Increasing Subsequence-style DP on scores.',
  tags: ['dynamic programming', 'sorting', 'LIS variant'],

  code: {
    pseudocode: `function bestTeamScore(scores, ages):
  players = sort by (age, score)
  n = len(players)
  dp = [player.score for player in players]
  for i from 1 to n-1:
    for j from 0 to i-1:
      if players[j].score <= players[i].score:
        dp[i] = max(dp[i], dp[j] + players[i].score)
  return max(dp)`,

    python: `def bestTeamScore(scores, ages):
    players = sorted(zip(ages, scores))
    n = len(players)
    dp = [p[1] for p in players]
    for i in range(n):
        for j in range(i):
            if players[j][1] <= players[i][1]:
                dp[i] = max(dp[i], dp[j] + players[i][1])
    return max(dp)`,

    javascript: `function bestTeamScore(scores, ages) {
  const players = ages.map((a,i) => [a, scores[i]]).sort((x,y) => x[0]-y[0] || x[1]-y[1]);
  const n = players.length;
  const dp = players.map(p => p[1]);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (players[j][1] <= players[i][1]) {
        dp[i] = Math.max(dp[i], dp[j] + players[i][1]);
      }
    }
  }
  return Math.max(...dp);
}`,

    java: `public int bestTeamScore(int[] scores, int[] ages) {
    int n = scores.length;
    int[][] players = new int[n][2];
    for (int i = 0; i < n; i++) players[i] = new int[]{ages[i], scores[i]};
    Arrays.sort(players, (a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = players[i][1];
        for (int j = 0; j < i; j++) {
            if (players[j][1] <= players[i][1])
                dp[i] = Math.max(dp[i], dp[j] + players[i][1]);
        }
    }
    return Arrays.stream(dp).max().getAsInt();
}`,
  },

  defaultInput: {
    scores: [1, 3, 5, 10, 15],
    ages: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'scores',
      label: 'Player Scores',
      type: 'array',
      defaultValue: [1, 3, 5, 10, 15],
      placeholder: '1,3,5,10,15',
      helperText: 'Scores of each player',
    },
    {
      name: 'ages',
      label: 'Player Ages',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Ages of each player',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const scores = input.scores as number[];
    const ages = input.ages as number[];
    const steps: AlgorithmStep[] = [];

    const players = ages.map((a, i) => [a, scores[i]] as [number, number]);
    players.sort((x, y) => x[0] !== y[0] ? x[0] - y[0] : x[1] - y[1]);
    const n = players.length;
    const dp = players.map(p => p[1]);

    steps.push({
      line: 1,
      explanation: `Sort ${n} players by (age, score): ${players.map(p => `(age=${p[0]}, score=${p[1]})`).join(', ')}. dp[i] = max team score ending at player i.`,
      variables: { n, players: players.map(p => ({ age: p[0], score: p[1] })) },
      visualization: {
        type: 'array',
        array: players.map(p => p[1]),
        highlights: {},
        labels: Object.fromEntries(players.map((p, i) => [i, `a${p[0]}`])),
      },
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (players[j][1] <= players[i][1]) {
          dp[i] = Math.max(dp[i], dp[j] + players[i][1]);
        }
      }

      steps.push({
        line: 5,
        explanation: `Player ${i + 1} (age=${players[i][0]}, score=${players[i][1]}): dp[${i}]=${dp[i]}. Best team score ending here.`,
        variables: { playerIndex: i + 1, age: players[i][0], score: players[i][1], dpValue: dp[i] },
        visualization: {
          type: 'array',
          array: [...dp],
          highlights: { [i]: 'found' },
          labels: Object.fromEntries(players.map((p, idx) => [idx, `a${p[0]}`])),
        },
      });
    }

    const ans = Math.max(...dp);
    const bestIdx = dp.indexOf(ans);
    steps.push({
      line: 7,
      explanation: `Maximum team score: ${ans} (best team ends at player index ${bestIdx + 1} with age=${players[bestIdx][0]}).`,
      variables: { answer: ans },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { [bestIdx]: 'found' },
        labels: Object.fromEntries(players.map((p, i) => [i, `a${p[0]}`])),
      },
    });

    return steps;
  },
};

export default bestTeamWithNoConflicts;
