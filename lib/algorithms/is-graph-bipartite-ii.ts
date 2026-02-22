import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const isGraphBipartiteIi: AlgorithmDefinition = {
  id: 'is-graph-bipartite-ii',
  title: 'Is Graph Bipartite? (BFS)',
  leetcodeNumber: 785,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Determine if a graph is bipartite using BFS coloring. A graph is bipartite if we can split its nodes into two groups such that every edge connects a node from one group to a node from the other. BFS assigns alternating colors (0 and 1) and checks for conflicts.',
  tags: ['graph', 'bfs', 'bipartite', 'coloring'],

  code: {
    pseudocode: `function isBipartite(graph):
  color = array of -1 (uncolored)
  for each node 0..n-1:
    if color[node] != -1: continue
    queue = [node]
    color[node] = 0
    while queue not empty:
      curr = queue.dequeue()
      for each neighbor of curr:
        if color[neighbor] == -1:
          color[neighbor] = 1 - color[curr]
          queue.enqueue(neighbor)
        elif color[neighbor] == color[curr]:
          return false
  return true`,

    python: `def isBipartite(graph):
    n = len(graph)
    color = [-1] * n
    for start in range(n):
        if color[start] != -1:
            continue
        queue = deque([start])
        color[start] = 0
        while queue:
            curr = queue.popleft()
            for neighbor in graph[curr]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[curr]
                    queue.append(neighbor)
                elif color[neighbor] == color[curr]:
                    return False
    return True`,

    javascript: `function isBipartite(graph) {
  const n = graph.length;
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    const queue = [start];
    color[start] = 0;
    while (queue.length) {
      const curr = queue.shift();
      for (const neighbor of graph[curr]) {
        if (color[neighbor] === -1) {
          color[neighbor] = 1 - color[curr];
          queue.push(neighbor);
        } else if (color[neighbor] === color[curr]) {
          return false;
        }
      }
    }
  }
  return true;
}`,

    java: `public boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        Queue<Integer> queue = new LinkedList<>();
        queue.add(start);
        color[start] = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            for (int neighbor : graph[curr]) {
                if (color[neighbor] == -1) {
                    color[neighbor] = 1 - color[curr];
                    queue.add(neighbor);
                } else if (color[neighbor] == color[curr]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
  },

  defaultInput: {
    nodes: [0, 1, 2, 3],
    edgesFlat: [0, 1, 1, 2, 2, 3, 3, 0],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Node Indices',
      type: 'array',
      defaultValue: [0, 1, 2, 3],
      placeholder: '0,1,2,3',
      helperText: 'List of node indices (0-based)',
    },
    {
      name: 'edgesFlat',
      label: 'Edges (flattened pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 2, 3, 3, 0],
      placeholder: '0,1,1,2,2,3,3,0',
      helperText: 'Edge pairs: [u1,v1,u2,v2,...]. 4-cycle is bipartite.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = input.nodes as number[];
    const edgesFlat = input.edgesFlat as number[];
    const steps: AlgorithmStep[] = [];

    const n = nodes.length;
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i + 1 < edgesFlat.length; i += 2) {
      const u = edgesFlat[i];
      const v = edgesFlat[i + 1];
      if (u < n && v < n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }

    const color: number[] = new Array(n).fill(-1);
    let bipartite = true;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nodes,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize color array with -1 (uncolored) for all ${n} nodes.`,
      variables: { n, color: JSON.stringify(color) },
      visualization: makeViz({}, nodes.reduce((a, _, i) => { a[i] = 'uncolored'; return a; }, {} as Record<number, string>)),
    });

    for (let start = 0; start < n && bipartite; start++) {
      if (color[start] !== -1) continue;

      const queueArr: number[] = [start];
      color[start] = 0;

      steps.push({
        line: 4,
        explanation: `Start BFS from node ${start}. Assign color 0 (group A).`,
        variables: { start, color: JSON.stringify(color), queue: [start] },
        visualization: makeViz(
          { [start]: 'active' },
          { [start]: 'C:0' }
        ),
      });

      while (queueArr.length > 0 && bipartite) {
        const curr = queueArr.shift()!;
        const hl: Record<number, string> = {};
        const lb: Record<number, string> = {};

        for (let i = 0; i < n; i++) {
          if (color[i] === 0) { hl[i] = 'pointer'; lb[i] = 'G:A'; }
          else if (color[i] === 1) { hl[i] = 'sorted'; lb[i] = 'G:B'; }
        }
        hl[curr] = 'active';
        lb[curr] = 'curr';

        steps.push({
          line: 7,
          explanation: `Dequeue node ${curr} (color=${color[curr]}). Check neighbors: [${adj[curr].join(', ')}].`,
          variables: { current: curr, colorOfCurr: color[curr], queue: JSON.stringify(queueArr) },
          visualization: makeViz(hl, lb),
        });

        for (const neighbor of adj[curr]) {
          const nhl = { ...hl };
          const nlb = { ...lb };
          nhl[neighbor] = 'comparing';
          nlb[neighbor] = 'nbr';

          if (color[neighbor] === -1) {
            color[neighbor] = 1 - color[curr];
            queueArr.push(neighbor);
            nhl[neighbor] = color[neighbor] === 0 ? 'pointer' : 'sorted';
            nlb[neighbor] = `C:${color[neighbor]}`;

            steps.push({
              line: 9,
              explanation: `Node ${neighbor} uncolored. Assign color ${color[neighbor]} (opposite of ${curr}). Enqueue node ${neighbor}.`,
              variables: { neighbor, assignedColor: color[neighbor], queue: JSON.stringify(queueArr) },
              visualization: makeViz(nhl, nlb),
            });
          } else if (color[neighbor] === color[curr]) {
            bipartite = false;
            nhl[neighbor] = 'mismatch';
            nlb[neighbor] = 'CONFLICT';

            steps.push({
              line: 11,
              explanation: `Node ${neighbor} has same color ${color[neighbor]} as current node ${curr}. CONFLICT! Graph is NOT bipartite.`,
              variables: { neighbor, conflictColor: color[neighbor], result: false },
              visualization: makeViz(nhl, nlb),
            });
          } else {
            steps.push({
              line: 10,
              explanation: `Node ${neighbor} already has color ${color[neighbor]} (different from ${curr}). No conflict, edge is valid.`,
              variables: { neighbor, neighborColor: color[neighbor], currentColor: color[curr] },
              visualization: makeViz(nhl, nlb),
            });
          }
        }
      }
    }

    const finalHl: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHl[i] = bipartite ? 'found' : 'mismatch';
    }

    steps.push({
      line: 12,
      explanation: `BFS complete. Graph is ${bipartite ? 'BIPARTITE' : 'NOT bipartite'}.`,
      variables: { result: bipartite },
      visualization: makeViz(finalHl, { 0: `ans=${bipartite}` }),
    });

    return steps;
  },
};

export default isGraphBipartiteIi;
