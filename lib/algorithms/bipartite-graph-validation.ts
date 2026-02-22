import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bipartiteGraphValidation: AlgorithmDefinition = {
  id: 'bipartite-graph-validation',
  title: 'Bipartite Graph Validation',
  leetcodeNumber: 785,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an undirected graph represented as an adjacency list, determine if it is bipartite. A graph is bipartite if nodes can be colored with two colors such that no two adjacent nodes share the same color. We use BFS with 2-coloring.',
  tags: ['Graph', 'BFS', 'DFS'],
  code: {
    pseudocode: `function isBipartite(graph):
  n = length(graph)
  color = array of size n, all -1
  for each node from 0 to n-1:
    if color[node] == -1:
      color[node] = 0
      queue = [node]
      while queue not empty:
        curr = queue.dequeue()
        for neighbor in graph[curr]:
          if color[neighbor] == -1:
            color[neighbor] = 1 - color[curr]
            queue.enqueue(neighbor)
          else if color[neighbor] == color[curr]:
            return false
  return true`,
    python: `def isBipartite(graph):
    n = len(graph)
    color = [-1] * n
    for node in range(n):
        if color[node] == -1:
            color[node] = 0
            queue = deque([node])
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
  for (let node = 0; node < n; node++) {
    if (color[node] === -1) {
      color[node] = 0;
      const queue = [node];
      while (queue.length > 0) {
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
  }
  return true;
}`,
    java: `public boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int node = 0; node < n; node++) {
        if (color[node] == -1) {
            color[node] = 0;
            Queue<Integer> queue = new LinkedList<>();
            queue.add(node);
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
    }
    return true;
}`,
  },
  defaultInput: {
    graph: [[1, 3], [0, 2], [1, 3], [0, 2]],
  },
  inputFields: [
    {
      name: 'graph',
      label: 'Adjacency List',
      type: 'array',
      defaultValue: [[1, 3], [0, 2], [1, 3], [0, 2]],
      placeholder: '[[1,3],[0,2],[1,3],[0,2]]',
      helperText: 'graph[i] = list of neighbors of node i (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const graph = input.graph as number[][];
    const n = graph.length;
    const steps: AlgorithmStep[] = [];
    const color: number[] = new Array(n).fill(-1);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (color[i] === 0) baseHighlights[i] = 'found';
        else if (color[i] === 1) baseHighlights[i] = 'pointer';
      }
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'Node Colors',
          entries: color.map((c, i) => ({
            key: `Node ${i}`,
            value: c === -1 ? 'uncolored' : c === 0 ? 'RED' : 'BLUE',
          })),
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Graph has ${n} nodes. Initialize all colors to -1 (uncolored). Try to 2-color each component.`,
      variables: { n, color: [...color] },
      visualization: makeViz({}, {}),
    });

    for (let node = 0; node < n; node++) {
      if (color[node] === -1) {
        color[node] = 0;
        const queue: number[] = [node];

        steps.push({
          line: 5,
          explanation: `Node ${node} uncolored. Start BFS, color it RED (0).`,
          variables: { node, color: [...color] },
          visualization: makeViz({ [node]: 'active' }, { [node]: 'start' }),
        });

        while (queue.length > 0) {
          const curr = queue.shift()!;

          steps.push({
            line: 8,
            explanation: `Dequeue node ${curr} (color: ${color[curr] === 0 ? 'RED' : 'BLUE'}). Check its neighbors: [${graph[curr].join(', ')}].`,
            variables: { curr, currColor: color[curr], neighbors: graph[curr] },
            visualization: makeViz({ [curr]: 'active' }, { [curr]: 'cur' }),
          });

          for (const neighbor of graph[curr]) {
            if (color[neighbor] === -1) {
              color[neighbor] = 1 - color[curr];
              queue.push(neighbor);

              steps.push({
                line: 10,
                explanation: `Node ${neighbor} uncolored. Assign ${color[neighbor] === 0 ? 'RED' : 'BLUE'} (opposite of node ${curr}).`,
                variables: { curr, neighbor, neighborColor: color[neighbor] },
                visualization: makeViz(
                  { [curr]: 'active', [neighbor]: 'comparing' },
                  { [curr]: 'cur', [neighbor]: 'new' }
                ),
              });
            } else if (color[neighbor] === color[curr]) {
              steps.push({
                line: 12,
                explanation: `Conflict! Node ${neighbor} has same color as node ${curr} (both ${color[curr] === 0 ? 'RED' : 'BLUE'}). Graph is NOT bipartite.`,
                variables: { curr, neighbor, sameColor: color[curr] },
                visualization: makeViz(
                  { [curr]: 'mismatch', [neighbor]: 'mismatch' },
                  { [curr]: 'X', [neighbor]: 'X' }
                ),
              });

              steps.push({
                line: 13,
                explanation: 'Return false. The graph cannot be 2-colored.',
                variables: { result: false },
                visualization: makeViz(
                  { [curr]: 'mismatch', [neighbor]: 'mismatch' },
                  {}
                ),
              });
              return steps;
            } else {
              steps.push({
                line: 11,
                explanation: `Node ${neighbor} already colored ${color[neighbor] === 0 ? 'RED' : 'BLUE'}, different from node ${curr}. No conflict.`,
                variables: { curr, neighbor, currColor: color[curr], neighborColor: color[neighbor] },
                visualization: makeViz(
                  { [curr]: 'active', [neighbor]: 'visited' },
                  { [curr]: 'cur' }
                ),
              });
            }
          }
        }
      }
    }

    // All components checked
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = color[i] === 0 ? 'found' : 'pointer';
    }
    steps.push({
      line: 14,
      explanation: 'All nodes successfully 2-colored with no conflicts. The graph IS bipartite. Return true.',
      variables: { result: true, color: [...color] },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default bipartiteGraphValidation;
