import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestPathInDag: AlgorithmDefinition = {
  id: 'longest-path-in-dag',
  title: 'Longest Path in DAG',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the longest path in a Directed Acyclic Graph (DAG). Use topological sort (Kahn\'s algorithm) to process nodes in order. For each node dequeued, update the longest distance to all its neighbors. The answer is the maximum value in the distance array after processing all nodes.',
  tags: ['Graph', 'Topological Sort', 'DAG', 'Dynamic Programming'],
  code: {
    pseudocode: `function longestPath(n, edges):
  inDegree = [0] * n
  adj = adjacency list
  for (u, v) in edges:
    adj[u].append(v)
    inDegree[v]++
  dist = [0] * n
  queue = nodes with inDegree 0
  while queue:
    node = queue.dequeue()
    for neighbor in adj[node]:
      dist[neighbor] = max(dist[neighbor], dist[node]+1)
      inDegree[neighbor]--
      if inDegree[neighbor] == 0:
        queue.enqueue(neighbor)
  return max(dist)`,
    python: `def longestPath(n, edges):
    inDegree = [0] * n
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        inDegree[v] += 1
    dist = [0] * n
    q = deque(i for i in range(n) if inDegree[i] == 0)
    while q:
        node = q.popleft()
        for nb in adj[node]:
            dist[nb] = max(dist[nb], dist[node] + 1)
            inDegree[nb] -= 1
            if inDegree[nb] == 0:
                q.append(nb)
    return max(dist)`,
    javascript: `function longestPath(n, edges) {
  const inDegree = new Array(n).fill(0);
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { adj[u].push(v); inDegree[v]++; }
  const dist = new Array(n).fill(0);
  const queue = [];
  for (let i = 0; i < n; i++) if (!inDegree[i]) queue.push(i);
  while (queue.length) {
    const node = queue.shift();
    for (const nb of adj[node]) {
      dist[nb] = Math.max(dist[nb], dist[node] + 1);
      if (--inDegree[nb] === 0) queue.push(nb);
    }
  }
  return Math.max(...dist);
}`,
    java: `public int longestPath(int n, int[][] edges) {
    int[] inDegree = new int[n];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); inDegree[e[1]]++; }
    int[] dist = new int[n];
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) q.add(i);
    while (!q.isEmpty()) {
        int node = q.poll();
        for (int nb : adj.get(node)) {
            dist[nb] = Math.max(dist[nb], dist[node] + 1);
            if (--inDegree[nb] == 0) q.add(nb);
        }
    }
    return Arrays.stream(dist).max().getAsInt();
}`,
  },
  defaultInput: {
    n: 6,
    edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Nodes labeled 0 to n-1',
    },
    {
      name: 'edges',
      label: 'Directed Edges [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]],
      placeholder: '[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]]',
      helperText: 'Directed edges (u -> v) in a DAG',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) { adj[u].push(v); inDegree[v]++; }

    const dist = new Array(n).fill(0);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...dist],
        highlights,
        labels,
        auxData: {
          label: 'Longest DAG Path',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Max Dist', value: String(Math.max(...dist)) },
            { key: 'InDegrees', value: inDegree.map((d, i) => `${i}:${d}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build DAG with ${n} nodes and ${edges.length} edges. In-degrees: [${inDegree.join(', ')}].`,
      variables: { n, edges: edges.length, inDegree: [...inDegree] },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d0`])),
        []
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

    const qHighlights: Record<number, string> = {};
    for (const q of queue) qHighlights[q] = 'active';

    steps.push({
      line: 7,
      explanation: `Source nodes (in-degree 0): [${queue.join(', ')}]. Start BFS from them with distance 0.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        qHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d${dist[i]}`])),
        [...queue]
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;

      steps.push({
        line: 9,
        explanation: `Dequeue node ${node} (dist=${dist[node]}). Neighbors: [${adj[node].join(', ')}].`,
        variables: { node, dist: dist[node] },
        visualization: makeViz(
          { [node]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d${dist[i]}`])),
          [...queue]
        ),
      });

      for (const nb of adj[node]) {
        const newDist = dist[node] + 1;
        if (newDist > dist[nb]) {
          dist[nb] = newDist;
        }
        inDegree[nb]--;
        if (inDegree[nb] === 0) queue.push(nb);

        steps.push({
          line: 11,
          explanation: `Update dist[${nb}] = max(${dist[nb]}, dist[${node}]+1) = ${dist[nb]}. In-degree[${nb}]=${inDegree[nb]}${inDegree[nb] === 0 ? '. Enqueue!' : '.'}`,
          variables: { node, nb, newDist: dist[nb] },
          visualization: makeViz(
            { [node]: 'found', [nb]: inDegree[nb] === 0 ? 'active' : 'comparing' },
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d${dist[i]}`])),
            [...queue]
          ),
        });
      }
    }

    const maxDist = Math.max(...dist);
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = dist[i] === maxDist ? 'found' : 'sorted';
    }

    steps.push({
      line: 16,
      explanation: `Longest path in DAG has length ${maxDist}. Nodes at max distance: [${dist.map((d, i) => d === maxDist ? i : -1).filter(x => x >= 0).join(', ')}].`,
      variables: { longestPath: maxDist, dist: [...dist] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:${dist[i]}`])),
        []
      ),
    });

    return steps;
  },
};

export default longestPathInDag;
