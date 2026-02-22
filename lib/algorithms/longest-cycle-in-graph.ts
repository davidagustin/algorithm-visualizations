import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestCycleInGraph: AlgorithmDefinition = {
  id: 'longest-cycle-in-graph',
  title: 'Longest Cycle in a Graph',
  leetcodeNumber: 2360,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a directed graph where each node has at most one outgoing edge, find the length of the longest cycle. Uses iterative DFS with a visited-time map: when we reach a node that was visited in the current traversal, the cycle length is the difference in visit times.',
  tags: ['cycle detection', 'directed graph', 'DFS', 'functional graph', 'graph'],

  code: {
    pseudocode: `function longestCycle(edges):
  n = len(edges)
  visited = [0]*n // 0=unvisited
  ans = -1
  time = 1
  for each start node u:
    if visited[u] != 0: continue
    t = time
    node = u
    while node != -1 and visited[node] == 0:
      visited[node] = time++
      node = edges[node]
    if node != -1 and visited[node] >= t:
      ans = max(ans, time - visited[node])
  return ans`,

    python: `def longestCycle(edges):
    n = len(edges)
    visited = [0] * n
    ans = -1
    time = 1
    for u in range(n):
        if visited[u]: continue
        t = time
        node = u
        while node != -1 and not visited[node]:
            visited[node] = time
            time += 1
            node = edges[node]
        if node != -1 and visited[node] >= t:
            ans = max(ans, time - visited[node])
    return ans`,

    javascript: `function longestCycle(edges) {
  const n = edges.length;
  const visited = new Array(n).fill(0);
  let ans = -1, time = 1;
  for (let u = 0; u < n; u++) {
    if (visited[u]) continue;
    const t = time;
    let node = u;
    while (node !== -1 && !visited[node]) {
      visited[node] = time++;
      node = edges[node];
    }
    if (node !== -1 && visited[node] >= t) {
      ans = Math.max(ans, time - visited[node]);
    }
  }
  return ans;
}`,

    java: `public int longestCycle(int[] edges) {
    int n = edges.length;
    int[] visited = new int[n];
    int ans = -1, time = 1;
    for (int u = 0; u < n; u++) {
        if (visited[u] != 0) continue;
        int t = time, node = u;
        while (node != -1 && visited[node] == 0) {
            visited[node] = time++;
            node = edges[node];
        }
        if (node != -1 && visited[node] >= t)
            ans = Math.max(ans, time - visited[node]);
    }
    return ans;
}`,
  },

  defaultInput: {
    edges: [3, 3, 4, 2, 3],
  },

  inputFields: [
    {
      name: 'edges',
      label: 'Edge Array (edges[i] = next node, -1 if none)',
      type: 'array',
      defaultValue: [3, 3, 4, 2, 3],
      placeholder: '3,3,4,2,3',
      helperText: 'edges[i] is the single outgoing neighbor of node i, or -1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edges = input.edges as number[];
    const n = edges.length;
    const steps: AlgorithmStep[] = [];

    const visited: number[] = new Array(n).fill(0);
    let ans = -1;
    let time = 1;

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: visited.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: n }, (_, i) => [
          i,
          i === active ? 'active' : visited[i] > 0 ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `->${ edges[i] === -1 ? 'X' : edges[i]}`])),
    });

    steps.push({
      line: 1,
      explanation: `Longest cycle in functional graph (each node has at most 1 outgoing edge). Edges: [${edges.join(', ')}].`,
      variables: { n, edges: [...edges] },
      visualization: makeViz(-1),
    });

    for (let u = 0; u < n; u++) {
      if (visited[u]) continue;

      const t = time;
      let node = u;
      const pathStart = time;

      steps.push({
        line: 7,
        explanation: `Start traversal from node ${u} at time ${t}.`,
        variables: { startNode: u, time: t },
        visualization: makeViz(u),
      });

      while (node !== -1 && !visited[node]) {
        visited[node] = time;
        steps.push({
          line: 9,
          explanation: `Visit node ${node} at time ${time}. Next: ${edges[node] === -1 ? 'none' : edges[node]}.`,
          variables: { node, time, next: edges[node] },
          visualization: makeViz(node),
        });
        time++;
        node = edges[node];
      }

      if (node !== -1 && visited[node] >= t) {
        const cycleLen = time - visited[node];
        if (cycleLen > ans) ans = cycleLen;
        steps.push({
          line: 11,
          explanation: `Cycle detected! Node ${node} was visited at time ${visited[node]}. Cycle length = ${time} - ${visited[node]} = ${cycleLen}. Best so far = ${ans}.`,
          variables: { node, cycleStart: visited[node], cycleLength: cycleLen, best: ans },
          visualization: makeViz(node),
        });
      } else {
        steps.push({
          line: 11,
          explanation: `Traversal from ${u} ended. No new cycle found (node=${node === -1 ? 'none' : node}).`,
          variables: { startNode: u },
          visualization: makeViz(u),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Longest cycle length = ${ans === -1 ? 'no cycle found' : ans}.`,
      variables: { result: ans },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default longestCycleInGraph;
