import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const numberOfMusicPlaylists: AlgorithmDefinition = {
  id: 'number-of-music-playlists',
  title: 'Number of Music Playlists',
  leetcodeNumber: 920,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count playlists of length goal using n unique songs, where each song is played at least once and a song can only be replayed after k other songs have played. Uses DP: dp[i][j] = number of playlists of length i using exactly j unique songs. Transitions: add a new song (n-j+1 choices) or replay an old one (max(j-k, 0) choices). Answer is modulo 10^9+7.',
  tags: ['dynamic programming', 'combinatorics', 'modular arithmetic'],

  code: {
    pseudocode: `function numMusicPlaylists(n, goal, k):
  MOD = 1e9+7
  dp = 2D array (goal+1) x (n+1), all 0
  dp[0][0] = 1
  for i from 1 to goal:
    for j from 1 to n:
      // add new song: (n-j+1) choices
      dp[i][j] += dp[i-1][j-1] * (n-j+1)
      // replay old song: max(0, j-k) choices
      dp[i][j] += dp[i-1][j] * max(0, j-k)
      dp[i][j] %= MOD
  return dp[goal][n]`,

    python: `def numMusicPlaylists(n, goal, k):
    MOD = 10**9+7
    dp = [[0]*(n+1) for _ in range(goal+1)]
    dp[0][0] = 1
    for i in range(1, goal+1):
        for j in range(1, n+1):
            dp[i][j] += dp[i-1][j-1]*(n-j+1)
            dp[i][j] += dp[i-1][j]*max(0,j-k)
            dp[i][j] %= MOD
    return dp[goal][n]`,

    javascript: `function numMusicPlaylists(n, goal, k) {
  const MOD = 1e9+7;
  const dp = Array.from({length:goal+1},()=>new Array(n+1).fill(0));
  dp[0][0] = 1;
  for (let i=1; i<=goal; i++) for (let j=1; j<=n; j++) {
    dp[i][j] = (dp[i-1][j-1]*(n-j+1) + dp[i-1][j]*Math.max(0,j-k)) % MOD;
  }
  return dp[goal][n];
}`,

    java: `public int numMusicPlaylists(int n, int goal, int k) {
    long MOD=1_000_000_007L;
    long[][]dp=new long[goal+1][n+1];
    dp[0][0]=1;
    for(int i=1;i<=goal;i++) for(int j=1;j<=n;j++){
        dp[i][j]=(dp[i-1][j-1]*(n-j+1)+dp[i-1][j]*Math.max(0,j-k))%MOD;
    }
    return (int)dp[goal][n];
}`,
  },

  defaultInput: {
    n: 3,
    goal: 3,
    k: 1,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Unique Songs (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Total number of unique songs available',
    },
    {
      name: 'goal',
      label: 'Playlist Length (goal)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Required length of the playlist',
    },
    {
      name: 'k',
      label: 'Cooldown (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Minimum songs between replays of the same song',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const goal = input.goal as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;

    const dp: number[][] = Array.from({ length: goal + 1 }, () => new Array(n + 1).fill(0));
    dp[0][0] = 1;

    steps.push({
      line: 1,
      explanation: `Count playlists: n=${n} songs, length=${goal}, cooldown k=${k}. dp[i][j] = playlists of length i with j unique songs. dp[0][0]=1.`,
      variables: { n, goal, k },
      visualization: {
        type: 'dp' as const,
        table: {
          headers: ['Length \\ Unique', ...Array.from({ length: n + 1 }, (_, j) => `j=${j}`)],
          rows: [
            {
              label: 'i=0',
              cells: [
                { value: 'i=0', highlight: 'default' as string },
                { value: 1, highlight: 'found' as string },
                ...Array.from({ length: n }, () => ({ value: 0, highlight: 'default' as string })),
              ],
            },
          ],
        },
      },
    });

    const tableRows: { label: string; cells: { value: string | number; highlight: string }[] }[] = [
      {
        label: 'i=0',
        cells: [
          { value: 'i=0', highlight: 'default' },
          { value: 1, highlight: 'found' },
          ...Array.from({ length: n }, () => ({ value: 0, highlight: 'default' })),
        ],
      },
    ];

    for (let i = 1; i <= goal; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = (dp[i - 1][j - 1] * (n - j + 1) + dp[i - 1][j] * Math.max(0, j - k)) % MOD;
      }

      tableRows.push({
        label: `i=${i}`,
        cells: [
          { value: `i=${i}`, highlight: 'default' },
          ...Array.from({ length: n + 1 }, (_, j) => ({
            value: dp[i][j],
            highlight: i === goal && j === n ? 'found' : dp[i][j] > 0 ? 'active' : 'default',
          })),
        ],
      });

      steps.push({
        line: 6,
        explanation: `Length ${i}: dp[${i}][j] for j=1..${n} = [${dp[i].slice(1).join(', ')}]. New song choices: (n-j+1). Replay choices: max(0, j-${k}).`,
        variables: { length: i, dpRow: dp[i].slice(1, n + 1) },
        visualization: {
          type: 'dp' as const,
          table: {
            headers: ['Length \\ Unique', ...Array.from({ length: n + 1 }, (_, j) => `j=${j}`)],
            rows: [...tableRows],
          },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Total valid playlists of length ${goal} using all ${n} songs: ${dp[goal][n]} (mod 10^9+7).`,
      variables: { answer: dp[goal][n], n, goal, k },
      visualization: {
        type: 'dp' as const,
        table: {
          headers: ['Length \\ Unique', ...Array.from({ length: n + 1 }, (_, j) => `j=${j}`)],
          rows: [...tableRows],
        },
      },
    });

    return steps;
  },
};

export default numberOfMusicPlaylists;
