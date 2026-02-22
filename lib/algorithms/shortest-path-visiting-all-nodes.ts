import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPathVisitingAllNodes: AlgorithmDefinition = {
  id: 'shortest-path-visiting-all-nodes',
  title: 'Shortest Path Visiting All Nodes',
  leetcodeNumber: 847,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an undirected graph, find the shortest path that visits every node. You may start from any node and revisit nodes and edges. BFS with bitmask state (node, visitedBitmask) tracks which nodes have been visited. The answer is found when bitmask equals all 1s.',
  tags: ['bfs', 'graph', 'bitmask', 'shortest path', 'state compression'],

  code: {
    pseudocode: `function shortestPathLength(graph):
  n = len(graph)
  fullMask = (1 << n) - 1
  queue = [(node, 1 << node, 0) for each node]
  visited = {(node, 1 << node) for each node}
  while queue not empty:
    node, mask, dist = dequeue()
    if mask == fullMask: return dist
    for neighbor in graph[node]:
      newMask = mask | (1 << neighbor)
      if (neighbor, newMask) not in visited:
        visited.add((neighbor, newMask))
        enqueue((neighbor, newMask, dist+1))
  return -1`,

    python: `from collections import deque

def shortestPathLength(graph):
    n = len(graph)
    if n == 1: return 0
    full_mask = (1 << n) - 1
    queue = deque()
    visited = set()
    for i in range(n):
        queue.append((i, 1 << i, 0))
        visited.add((i, 1 << i))
    while queue:
        node, mask, dist = queue.popleft()
        for nei in graph[node]:
            new_mask = mask | (1 << nei)
            if new_mask == full_mask: return dist + 1
            if (nei, new_mask) not in visited:
                visited.add((nei, new_mask))
                queue.append((nei, new_mask, dist + 1))
    return -1`,

    javascript: `function shortestPathLength(graph) {
  const n = graph.length;
  if (n === 1) return 0;
  const fullMask = (1 << n) - 1;
  const queue = [];
  const visited = new Set();
  for (let i = 0; i < n; i++) {
    queue.push([i, 1 << i, 0]);
    visited.add(i + ',' + (1 << i));
  }
  while (queue.length) {
    const [node, mask, dist] = queue.shift();
    for (const nei of graph[node]) {
      const newMask = mask | (1 << nei);
      if (newMask === fullMask) return dist + 1;
      const key = nei + ',' + newMask;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([nei, newMask, dist + 1]);
      }
    }
  }
  return -1;
}`,

    java: `public int shortestPathLength(int[][] graph) {
    int n = graph.length;
    if (n == 1) return 0;
    int fullMask = (1 << n) - 1;
    Queue<int[]> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    for (int i = 0; i < n; i++) {
        queue.offer(new int[]{i, 1 << i, 0});
        visited.add(i + "," + (1 << i));
    }
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int node = cur[0], mask = cur[1], dist = cur[2];
        for (int nei : graph[node]) {
            int newMask = mask | (1 << nei);
            if (newMask == fullMask) return dist + 1;
            String key = nei + "," + newMask;
            if (!visited.contains(key)) {
                visited.add(key);
                queue.offer(new int[]{nei, newMask, dist + 1});
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    graph: [[1,2,3],[0],[0],[0]],
  },

  inputFields: [
    {
      name: 'graph',
      label: 'Graph (adjacency list)',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Adjacency list represented as neighbors of node 0',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const graph = input.graph as number[][];
    const steps: AlgorithmStep[] = [];
    const n = graph.length;
    const fullMask = (1 << n) - 1;

    steps.push({
      line: 1,
      explanation: `Graph has ${n} nodes. Need to visit all nodes. Full mask (all visited) = ${fullMask} (binary: ${fullMask.toString(2).padStart(n, '0')}).`,
      variables: { n, fullMask: fullMask.toString(2).padStart(n, '0') },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'active'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}`])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 4,
      explanation: `Initialize BFS from ALL nodes simultaneously (since we can start anywhere). Each initial state has mask = single node visited.`,
      variables: { initialStates: n },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => 1 << i),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'pointer'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `mask${i}`])),
      } as ArrayVisualization,
    });

    const queue: [number, number, number][] = [];
    const visited = new Set<string>();
    for (let i = 0; i < n; i++) {
      queue.push([i, 1 << i, 0]);
      visited.add(`${i},${1 << i}`);
    }

    while (queue.length > 0) {
      const [node, mask, dist] = queue.shift()!;

      steps.push({
        line: 6,
        explanation: `At node ${node}, visited mask: ${mask.toString(2).padStart(n, '0')} (${mask}), distance: ${dist}. ${mask === fullMask ? 'All visited!' : 'Not all visited yet.'}`,
        variables: { node, mask: mask.toString(2).padStart(n, '0'), distance: dist },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => (mask >> i) & 1),
          highlights: { [node]: 'active' },
          labels: Object.fromEntries(
            Array.from({ length: n }, (_, i) => [i, (mask >> i) & 1 ? 'visited' : 'unvisited'])
          ),
        } as ArrayVisualization,
      });

      for (const nei of graph[node]) {
        const newMask = mask | (1 << nei);
        if (newMask === fullMask) {
          steps.push({
            line: 8,
            explanation: `Moving to node ${nei} completes all ${n} nodes! Shortest path length: ${dist + 1}.`,
            variables: { result: dist + 1, finalNode: nei },
            visualization: {
              type: 'array',
              array: Array.from({ length: n }, () => 1),
              highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
              labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'visited'])),
            } as ArrayVisualization,
          });
          return steps;
        }
        const key = `${nei},${newMask}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nei, newMask, dist + 1]);
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 11,
      explanation: 'BFS complete. Shortest path visiting all nodes found.',
      variables: { visited: visited.size },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, () => 1),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted'])),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default shortestPathVisitingAllNodes;
