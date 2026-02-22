import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const androidUnlockPatterns: AlgorithmDefinition = {
  id: 'android-unlock-patterns',
  title: 'Android Unlock Patterns',
  leetcodeNumber: 351,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Count the number of valid Android unlock patterns using keys 1-9 that connect m to n keys. A pattern is invalid if it jumps over an unvisited key. Use backtracking: track visited keys and a skip table that defines which key must be visited when moving between two non-adjacent keys.',
  tags: ['backtracking', 'dynamic programming', 'bitmask'],

  code: {
    pseudocode: `function numberOfPatterns(m, n):
  skip = precompute skip table for all pairs
  visited = array of 9 false
  count = 0
  function dfs(curr, remaining):
    if remaining < 0: return 0
    if remaining == 0: return 1
    visited[curr] = true
    result = 0
    for next in 1..9:
      if not visited[next] and (skip[curr][next] == 0 or visited[skip[curr][next]]):
        result += dfs(next, remaining-1)
    visited[curr] = false
    return result
  for length in m..n:
    count += dfs(1, length-1) * 4  // corners
    count += dfs(2, length-1) * 4  // edges
    count += dfs(5, length-1)      // center
  return count`,
    python: `def numberOfPatterns(m: int, n: int) -> int:
    skip = [[0]*10 for _ in range(10)]
    skip[1][3]=skip[3][1]=2; skip[1][7]=skip[7][1]=4
    skip[3][9]=skip[9][3]=6; skip[7][9]=skip[9][7]=8
    skip[1][9]=skip[9][1]=skip[3][7]=skip[7][3]=5
    skip[2][8]=skip[8][2]=5; skip[4][6]=skip[6][4]=5
    visited = [False] * 10
    def dfs(curr, rem):
        if rem < 0: return 0
        if rem == 0: return 1
        visited[curr] = True
        res = sum(dfs(nxt, rem-1) for nxt in range(1,10)
                  if not visited[nxt] and (skip[curr][nxt]==0 or visited[skip[curr][nxt]]))
        visited[curr] = False
        return res
    return sum(dfs(1,l-1)*4 + dfs(2,l-1)*4 + dfs(5,l-1) for l in range(m,n+1))`,
    javascript: `function numberOfPatterns(m, n) {
  const skip = Array.from({length: 10}, () => new Array(10).fill(0));
  skip[1][3]=skip[3][1]=2; skip[1][7]=skip[7][1]=4;
  skip[3][9]=skip[9][3]=6; skip[7][9]=skip[9][7]=8;
  skip[1][9]=skip[9][1]=skip[3][7]=skip[7][3]=5;
  skip[2][8]=skip[8][2]=5; skip[4][6]=skip[6][4]=5;
  const visited = new Array(10).fill(false);
  function dfs(curr, rem) {
    if (rem < 0) return 0;
    if (rem === 0) return 1;
    visited[curr] = true;
    let res = 0;
    for (let nxt = 1; nxt <= 9; nxt++) {
      if (!visited[nxt] && (!skip[curr][nxt] || visited[skip[curr][nxt]])) res += dfs(nxt, rem-1);
    }
    visited[curr] = false;
    return res;
  }
  let count = 0;
  for (let l = m; l <= n; l++) count += dfs(1,l-1)*4 + dfs(2,l-1)*4 + dfs(5,l-1);
  return count;
}`,
    java: `public int numberOfPatterns(int m, int n) {
    int[][] skip = new int[10][10];
    skip[1][3]=skip[3][1]=2; skip[1][7]=skip[7][1]=4;
    skip[3][9]=skip[9][3]=6; skip[7][9]=skip[9][7]=8;
    skip[1][9]=skip[9][1]=skip[3][7]=skip[7][3]=5;
    skip[2][8]=skip[8][2]=5; skip[4][6]=skip[6][4]=5;
    boolean[] visited = new boolean[10];
    int count = 0;
    for (int l = m; l <= n; l++) count += dfs(1,l-1,skip,visited)*4 + dfs(2,l-1,skip,visited)*4 + dfs(5,l-1,skip,visited);
    return count;
}`,
  },

  defaultInput: { m: 1, n: 1 },

  inputFields: [
    {
      name: 'm',
      label: 'Minimum Keys (m)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Minimum number of keys in pattern',
    },
    {
      name: 'n',
      label: 'Maximum Keys (n)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Maximum number of keys in pattern',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const skip: number[][] = Array.from({ length: 10 }, () => new Array(10).fill(0));
    skip[1][3] = skip[3][1] = 2; skip[1][7] = skip[7][1] = 4;
    skip[3][9] = skip[9][3] = 6; skip[7][9] = skip[9][7] = 8;
    skip[1][9] = skip[9][1] = skip[3][7] = skip[7][3] = 5;
    skip[2][8] = skip[8][2] = 5; skip[4][6] = skip[6][4] = 5;

    const visited = new Array(10).fill(false);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: keys,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count valid Android unlock patterns using ${m} to ${n} keys. Keys 1-9 arranged in 3x3 grid. Moving between non-adjacent keys requires the middle key to be visited.`,
      variables: { m, n },
      visualization: makeViz({}, Object.fromEntries(keys.map((k, i) => [i, String(k)]))),
    });

    steps.push({
      line: 2,
      explanation: 'Skip table: 1->3 requires 2, 1->9 requires 5, 2->8 requires 5, etc. Moving diagonally or across requires intermediate key already visited.',
      variables: { examples: '1-3 needs 2, 1-9 needs 5, 4-6 needs 5' },
      visualization: makeViz(
        { 0: 'active', 2: 'active', 1: 'visited' },
        Object.fromEntries(keys.map((k, i) => [i, String(k)]))
      ),
    });

    let totalCount = 0;

    function dfs(curr: number, rem: number, depth: number): number {
      if (rem < 0) return 0;
      if (rem === 0) return 1;
      visited[curr] = true;
      let res = 0;
      for (let nxt = 1; nxt <= 9; nxt++) {
        if (!visited[nxt] && (!skip[curr][nxt] || visited[skip[curr][nxt]])) {
          res += dfs(nxt, rem - 1, depth + 1);
        }
      }
      visited[curr] = false;
      return res;
    }

    for (let length = m; length <= n; length++) {
      const corners = dfs(1, length - 1, 0) * 4;
      const edges = dfs(2, length - 1, 0) * 4;
      const center = dfs(5, length - 1, 0);
      const lengthTotal = corners + edges + center;
      totalCount += lengthTotal;

      steps.push({
        line: 15,
        explanation: `Length ${length} patterns: corners(1,3,7,9)=${corners / 4} x 4 = ${corners}, edges(2,4,6,8)=${edges / 4} x 4 = ${edges}, center(5)=${center}. Total for length ${length}: ${lengthTotal}.`,
        variables: { length, cornersEach: corners / 4, edgesEach: edges / 4, center, lengthTotal, runningTotal: totalCount },
        visualization: makeViz(
          Object.fromEntries(keys.map((_, i) => [i, i === 0 || i === 2 || i === 6 || i === 8 ? 'active' : i === 4 ? 'found' : 'visited'])),
          Object.fromEntries(keys.map((k, i) => [i, String(k)]))
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `Total valid unlock patterns with ${m} to ${n} keys: ${totalCount}.`,
      variables: { m, n, totalPatterns: totalCount },
      visualization: makeViz({}, Object.fromEntries(keys.map((k, i) => [i, String(k)]))),
    });

    return steps;
  },
};

export default androidUnlockPatterns;
