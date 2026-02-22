import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfProvinces: AlgorithmDefinition = {
  id: 'number-of-provinces',
  title: 'Number of Provinces',
  leetcodeNumber: 547,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an adjacency matrix representing friendships between n cities, find the number of provinces (connected components). Each province is a group of directly or indirectly connected cities. Uses DFS from each unvisited city to explore its entire connected component.',
  tags: ['graph', 'dfs', 'union find', 'connected components', 'adjacency matrix'],

  code: {
    pseudocode: `function findCircleNum(isConnected):
  n = number of cities
  visited = array of false
  provinces = 0
  for city from 0 to n-1:
    if not visited[city]:
      dfs(city, isConnected, visited)
      provinces += 1
  return provinces

function dfs(city, isConnected, visited):
  visited[city] = true
  for each neighbor:
    if isConnected[city][neighbor] == 1 and not visited:
      dfs(neighbor, ...)`,

    python: `def findCircleNum(isConnected):
    n = len(isConnected)
    visited = [False] * n
    def dfs(city):
        visited[city] = True
        for neighbor in range(n):
            if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                dfs(neighbor)
    provinces = 0
    for city in range(n):
        if not visited[city]:
            dfs(city)
            provinces += 1
    return provinces`,

    javascript: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  function dfs(city) {
    visited[city] = true;
    for (let nb = 0; nb < n; nb++) {
      if (isConnected[city][nb] === 1 && !visited[nb]) dfs(nb);
    }
  }
  let provinces = 0;
  for (let city = 0; city < n; city++) {
    if (!visited[city]) { dfs(city); provinces++; }
  }
  return provinces;
}`,

    java: `public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    boolean[] visited = new boolean[n];
    int provinces = 0;
    for (int city = 0; city < n; city++) {
        if (!visited[city]) { dfs(isConnected, visited, city); provinces++; }
    }
    return provinces;
}
void dfs(int[][] g, boolean[] vis, int city) {
    vis[city] = true;
    for (int nb = 0; nb < g.length; nb++)
        if (g[city][nb]==1 && !vis[nb]) dfs(g,vis,nb);
}`,
  },

  defaultInput: {
    isConnected: [1, 1, 0, 1, 1, 0, 0, 0, 1],
    n: 3,
  },

  inputFields: [
    {
      name: 'isConnected',
      label: 'Adjacency matrix (flattened NxN)',
      type: 'array',
      defaultValue: [1, 1, 0, 1, 1, 0, 0, 0, 1],
      placeholder: '1,1,0,1,1,0,0,0,1',
      helperText: 'Flattened NxN adjacency matrix',
    },
    {
      name: 'n',
      label: 'Number of Cities N',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.isConnected as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const isConnected = flat.slice(0, n * n);
    while (isConnected.length < n * n) isConnected.push(0);

    const visited = new Array(n).fill(false);
    const cities = Array.from({ length: n }, (_, i) => i);
    const provinceMap = new Array(n).fill(-1);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: cities,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find provinces (connected components) among ${n} cities using DFS. Adjacency matrix is ${n}x${n}.`,
      variables: { n },
      visualization: makeViz({}, cities.reduce((acc, c) => { acc[c] = `city${c}`; return acc; }, {} as Record<number, string>)),
    });

    let provinces = 0;

    function dfs(city: number, prov: number) {
      visited[city] = true;
      provinceMap[city] = prov;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (visited[i]) { hl[i] = 'found'; lb[i] = `P${provinceMap[i]}`; }
      }
      hl[city] = 'active';
      lb[city] = `P${prov}`;

      steps.push({
        line: 10,
        explanation: `DFS: Visit city ${city} and assign to province ${prov}.`,
        variables: { city, province: prov },
        visualization: makeViz(hl, lb),
      });

      for (let nb = 0; nb < n; nb++) {
        if (isConnected[city * n + nb] === 1 && !visited[nb]) {
          const nhl: Record<number, string> = {};
          const nlb: Record<number, string> = {};
          for (let i = 0; i < n; i++) {
            if (visited[i]) { nhl[i] = 'found'; nlb[i] = `P${provinceMap[i]}`; }
          }
          nhl[city] = 'active';
          nlb[city] = `P${prov}`;
          nhl[nb] = 'comparing';
          nlb[nb] = 'connected';

          steps.push({
            line: 11,
            explanation: `City ${city} is connected to city ${nb}. DFS into city ${nb}.`,
            variables: { from: city, to: nb, province: prov },
            visualization: makeViz(nhl, nlb),
          });

          dfs(nb, prov);
        }
      }
    }

    for (let city = 0; city < n; city++) {
      if (!visited[city]) {
        steps.push({
          line: 5,
          explanation: `City ${city} not yet visited. Start DFS for new province ${provinces}.`,
          variables: { city, newProvince: provinces },
          visualization: makeViz(
            { [city]: 'active' },
            { [city]: `start P${provinces}` }
          ),
        });

        dfs(city, provinces);
        provinces++;
      }
    }

    steps.push({
      line: 6,
      explanation: `All cities visited. Total provinces (connected components) = ${provinces}.`,
      variables: { result: provinces },
      visualization: makeViz(
        cities.reduce((acc, c) => { acc[c] = 'sorted'; return acc; }, {} as Record<number, string>),
        cities.reduce((acc, c) => { acc[c] = `P${provinceMap[c]}`; return acc; }, {} as Record<number, string>)
      ),
    });

    return steps;
  },
};

export default numberOfProvinces;
