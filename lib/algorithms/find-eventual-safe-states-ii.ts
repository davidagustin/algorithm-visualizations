import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findEventualSafeStatesIi: AlgorithmDefinition = {
  id: 'find-eventual-safe-states-ii',
  title: 'Find Eventual Safe States',
  leetcodeNumber: 802,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a directed graph, a node is "safe" if every path from it eventually leads to a terminal node (no outgoing edges) without entering a cycle. Return all safe nodes in sorted order. Approach: reverse the graph, then use topological sort on reversed graph starting from terminal nodes.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'DFS'],
  code: {
    pseudocode: `function eventualSafeNodes(graph):
  n = len(graph)
  reverseGraph = reverse all edges
  outDegree = out-degree of each node in original
  // terminal nodes have outDegree 0
  queue = nodes with outDegree 0
  safe = set()
  while queue:
    node = queue.dequeue()
    safe.add(node)
    for prev in reverseGraph[node]:
      outDegree[prev]--
      if outDegree[prev] == 0:
        queue.add(prev)
  return sorted(safe)`,
    python: `def eventualSafeNodes(graph):
    n = len(graph)
    reverse = [[] for _ in range(n)]
    outDegree = [len(graph[i]) for i in range(n)]
    for i, neighbors in enumerate(graph):
        for nb in neighbors:
            reverse[nb].append(i)
    q = deque(i for i in range(n) if outDegree[i] == 0)
    safe = set()
    while q:
        node = q.popleft()
        safe.add(node)
        for prev in reverse[node]:
            outDegree[prev] -= 1
            if outDegree[prev] == 0:
                q.append(prev)
    return sorted(safe)`,
    javascript: `function eventualSafeNodes(graph) {
  const n = graph.length;
  const reverse = Array.from({length: n}, () => []);
  const outDegree = graph.map(nb => nb.length);
  for (let i = 0; i < n; i++)
    for (const nb of graph[i]) reverse[nb].push(i);
  const queue = [], safe = new Set();
  for (let i = 0; i < n; i++) if (!outDegree[i]) queue.push(i);
  while (queue.length) {
    const node = queue.shift();
    safe.add(node);
    for (const prev of reverse[node]) {
      if (--outDegree[prev] === 0) queue.push(prev);
    }
  }
  return [...safe].sort((a,b)=>a-b);
}`,
    java: `public List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    List<List<Integer>> rev = new ArrayList<>();
    int[] outDeg = new int[n];
    for (int i = 0; i < n; i++) { rev.add(new ArrayList<>()); outDeg[i] = graph[i].length; }
    for (int i = 0; i < n; i++) for (int nb : graph[i]) rev.get(nb).add(i);
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (outDeg[i] == 0) q.add(i);
    Set<Integer> safe = new TreeSet<>();
    while (!q.isEmpty()) {
        int node = q.poll(); safe.add(node);
        for (int prev : rev.get(node)) if (--outDeg[prev] == 0) q.add(prev);
    }
    return new ArrayList<>(safe);
}`,
  },
  defaultInput: {
    graph: [[1, 2], [2, 3], [5], [0], [5], [], []],
  },
  inputFields: [
    {
      name: 'graph',
      label: 'Adjacency List',
      type: 'array',
      defaultValue: [[1, 2], [2, 3], [5], [0], [5], [], []],
      placeholder: '[[1,2],[2,3],[5],[0],[5],[],[]]',
      helperText: 'graph[i] = list of nodes reachable from node i',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const graph = input.graph as number[][];
    const n = graph.length;
    const steps: AlgorithmStep[] = [];

    const reverse: number[][] = Array.from({ length: n }, () => []);
    const outDegree = graph.map(nb => nb.length);
    for (let i = 0; i < n; i++) for (const nb of graph[i]) reverse[nb].push(i);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      safe: number[],
      queue: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...outDegree],
        highlights,
        labels,
        auxData: {
          label: 'Eventual Safe States',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Safe Nodes', value: safe.length > 0 ? safe.join(', ') : 'none yet' },
            { key: 'Out-Degrees', value: outDegree.map((d, i) => `${i}:${d}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Reverse graph edges. Out-degrees: [${outDegree.join(', ')}]. Terminal nodes (out-degree 0) are safe.`,
      variables: { outDegree: [...outDegree] },
      visualization: makeViz(
        Object.fromEntries(outDegree.map((d, i) => [i, d === 0 ? 'found' : 'default'])),
        Object.fromEntries(outDegree.map((d, i) => [i, `n${i}:out${d}`])),
        [],
        []
      ),
    });

    const queue: number[] = [];
    const safe = new Set<number>();
    for (let i = 0; i < n; i++) if (outDegree[i] === 0) queue.push(i);

    steps.push({
      line: 6,
      explanation: `Terminal nodes (no outgoing edges): [${queue.join(', ')}]. These are definitely safe. Start BFS.`,
      variables: { terminals: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(outDegree.map((d, i) => [i, `n${i}:out${d}`])),
        [...queue],
        [...queue]
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      safe.add(node);

      steps.push({
        line: 8,
        explanation: `Mark node ${node} as SAFE. Check predecessors: [${reverse[node].join(', ')}].`,
        variables: { node, safe: [...safe] },
        visualization: makeViz(
          { ...Object.fromEntries([...safe].map(s => [s, 'found'])), [node]: 'active' },
          Object.fromEntries(outDegree.map((d, i) => [i, `n${i}:out${d}`])),
          [...safe],
          [...queue]
        ),
      });

      for (const prev of reverse[node]) {
        outDegree[prev]--;
        if (outDegree[prev] === 0) queue.push(prev);

        steps.push({
          line: 11,
          explanation: `Predecessor ${prev}: out-degree -> ${outDegree[prev]}${outDegree[prev] === 0 ? '. All paths from it lead to safe nodes. Enqueue!' : '.'}`,
          variables: { prev, newOutDegree: outDegree[prev] },
          visualization: makeViz(
            { ...Object.fromEntries([...safe].map(s => [s, 'found'])), [node]: 'active', [prev]: outDegree[prev] === 0 ? 'comparing' : 'visited' },
            Object.fromEntries(outDegree.map((d, i) => [i, `n${i}:out${d}`])),
            [...safe],
            [...queue]
          ),
        });
      }
    }

    const safeArr = [...safe].sort((a, b) => a - b);
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = safe.has(i) ? 'found' : 'mismatch';

    steps.push({
      line: 14,
      explanation: `Safe nodes: [${safeArr.join(', ')}]. Unsafe nodes (in cycles or lead to cycles): [${Array.from({ length: n }, (_, i) => i).filter(i => !safe.has(i)).join(', ')}].`,
      variables: { safeNodes: safeArr },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, safe.has(i) ? 'safe' : 'unsafe'])),
        safeArr,
        []
      ),
    });

    return steps;
  },
};

export default findEventualSafeStatesIi;
