import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfProvincesII: AlgorithmDefinition = {
  id: 'number-of-provinces-ii',
  title: 'Number of Provinces II',
  leetcodeNumber: 547,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n adjacency matrix isConnected where isConnected[i][j] = 1 means city i and j are directly connected, find the number of provinces (connected components). Solved with DFS traversal instead of Union-Find.',
  tags: ['Graph', 'DFS', 'Connected Components'],
  code: {
    pseudocode: `function findCircleNum(isConnected):
  n = len(isConnected)
  visited = [false] * n
  provinces = 0
  function dfs(city):
    visited[city] = true
    for neighbor in 0..n-1:
      if isConnected[city][neighbor]==1 and not visited[neighbor]:
        dfs(neighbor)
  for i in 0..n-1:
    if not visited[i]:
      dfs(i)
      provinces++
  return provinces`,
    python: `def findCircleNum(isConnected):
    n = len(isConnected)
    visited = [False] * n
    provinces = 0
    def dfs(city):
        visited[city] = True
        for nb in range(n):
            if isConnected[city][nb] == 1 and not visited[nb]:
                dfs(nb)
    for i in range(n):
        if not visited[i]:
            dfs(i)
            provinces += 1
    return provinces`,
    javascript: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  let provinces = 0;
  function dfs(city) {
    visited[city] = true;
    for (let nb = 0; nb < n; nb++) {
      if (isConnected[city][nb] === 1 && !visited[nb])
        dfs(nb);
    }
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i]) { dfs(i); provinces++; }
  }
  return provinces;
}`,
    java: `public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    boolean[] visited = new boolean[n];
    int provinces = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) { dfs(isConnected, visited, i); provinces++; }
    }
    return provinces;
}
void dfs(int[][] iC, boolean[] v, int c) {
    v[c] = true;
    for (int i = 0; i < iC.length; i++)
        if (iC[c][i] == 1 && !v[i]) dfs(iC, v, i);
}`,
  },
  defaultInput: {
    isConnected: [[1,1,0],[1,1,0],[0,0,1]],
  },
  inputFields: [
    {
      name: 'isConnected',
      label: 'Adjacency Matrix',
      type: 'array',
      defaultValue: [[1,1,0],[1,1,0],[0,0,1]],
      placeholder: '[[1,1,0],[1,1,0],[0,0,1]]',
      helperText: 'n x n matrix, 1=connected',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const isConnected = input.isConnected as number[][];
    const n = isConnected.length;
    const steps: AlgorithmStep[] = [];

    const visited = new Array(n).fill(false);
    let provinces = 0;
    const provinceMap = new Array(n).fill(-1);

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: provinceMap.map(p => p === -1 ? 0 : p + 1),
        highlights,
        labels: Object.fromEntries(provinceMap.map((p, i) => [i, `c${i}:${p === -1 ? 'unvisited' : `prov${p+1}`}`])),
        auxData: {
          label: 'Number of Provinces (DFS)',
          entries: [
            { key: 'Provinces Found', value: String(provinces) },
            { key: 'Visited', value: visited.map((v, i) => v ? i : null).filter(x => x !== null).join(', ') || 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} cities. DFS-based province finding. Visit each unvisited city and mark all reachable cities in same province.`,
      variables: { n },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        'Not started'
      ),
    });

    function dfs(city: number) {
      visited[city] = true;
      provinceMap[city] = provinces;
      const h: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        h[i] = !visited[i] ? 'default' : provinceMap[i] === provinces ? 'active' : 'sorted';
      }
      steps.push({
        line: 6,
        explanation: `DFS(${city}): Mark city ${city} as visited (province ${provinces + 1}).`,
        variables: { city, province: provinces + 1 },
        visualization: makeViz({ ...h, [city]: 'found' }, `Visiting city ${city}`),
      });
      for (let nb = 0; nb < n; nb++) {
        if (isConnected[city][nb] === 1 && !visited[nb]) {
          dfs(nb);
        }
      }
    }

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        provinces++;
        steps.push({
          line: 10,
          explanation: `City ${i} not yet visited. Start DFS for province ${provinces}.`,
          variables: { i, provinces },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: n }, (_, j) => [j, visited[j] ? 'sorted' : 'default'])),
            `Starting province ${provinces}`
          ),
        });
        dfs(i);
      }
    }

    const colorList = ['found', 'pointer', 'active', 'comparing', 'sorted'];
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = colorList[provinceMap[i] % colorList.length];

    steps.push({
      line: 12,
      explanation: `Done. Total provinces = ${provinces}.`,
      variables: { result: provinces },
      visualization: makeViz(finalH, `Result: ${provinces} provinces`),
    });

    return steps;
  },
};

export default numberOfProvincesII;
