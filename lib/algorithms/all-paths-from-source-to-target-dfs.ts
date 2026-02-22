import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const allPathsFromSourceToTargetDfs: AlgorithmDefinition = {
  id: 'all-paths-from-source-to-target-dfs',
  title: 'All Paths From Source to Target (DFS)',
  leetcodeNumber: 797,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a directed acyclic graph (DAG), find all paths from node 0 to node n-1. DFS explores each path recursively, backtracking to explore alternatives. Since the graph is acyclic, no visited set is needed. Each time we reach n-1, we record the current path.',
  tags: ['dfs', 'graph', 'backtracking', 'dag', 'all paths'],

  code: {
    pseudocode: `function allPathsSourceTarget(graph):
  n = len(graph)
  result = []
  path = [0]

  dfs(node):
    if node == n-1:
      result.append(path.copy())
      return
    for neighbor in graph[node]:
      path.append(neighbor)
      dfs(neighbor)
      path.pop()  // backtrack

  dfs(0)
  return result`,

    python: `def allPathsSourceTarget(graph):
    n = len(graph)
    result = []
    path = [0]

    def dfs(node):
        if node == n - 1:
            result.append(path[:])
            return
        for nei in graph[node]:
            path.append(nei)
            dfs(nei)
            path.pop()

    dfs(0)
    return result`,

    javascript: `function allPathsSourceTarget(graph) {
  const n = graph.length;
  const result = [];
  const path = [0];

  function dfs(node) {
    if (node === n - 1) {
      result.push([...path]);
      return;
    }
    for (const nei of graph[node]) {
      path.push(nei);
      dfs(nei);
      path.pop();
    }
  }

  dfs(0);
  return result;
}`,

    java: `public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    int n = graph.length;
    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>(Arrays.asList(0));

    dfs(graph, 0, n-1, path, result);
    return result;
}

void dfs(int[][] graph, int node, int target, List<Integer> path, List<List<Integer>> result) {
    if (node == target) {
        result.add(new ArrayList<>(path));
        return;
    }
    for (int nei : graph[node]) {
        path.add(nei);
        dfs(graph, nei, target, path, result);
        path.remove(path.size() - 1);
    }
}`,
  },

  defaultInput: {
    graph: [[1,2],[3],[3],[]],
  },

  inputFields: [
    {
      name: 'graph',
      label: 'Graph (adjacency list)',
      type: 'array',
      defaultValue: [1, 2, 3, 3],
      placeholder: '1,2,3,3',
      helperText: 'Adjacency list as flat array (neighbors of 0, then 1, etc.)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const graph = input.graph as number[][];
    const steps: AlgorithmStep[] = [];
    const n = graph.length;

    steps.push({
      line: 1,
      explanation: `DAG with ${n} nodes. Find all paths from node 0 to node ${n - 1}. DFS with backtracking explores every path.`,
      variables: { n, source: 0, target: n - 1 },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { 0: 'active', [n - 1]: 'pointer' },
        labels: { 0: 'source', [n - 1]: 'target' },
      } as ArrayVisualization,
    });

    const result: number[][] = [];
    const path: number[] = [0];

    function dfs(node: number): void {
      steps.push({
        line: 7,
        explanation: `DFS at node ${node}. Current path: [${path.join(' -> ')}]. ${node === n - 1 ? 'Reached target!' : `Neighbors: [${graph[node].join(', ')}].`}`,
        variables: { node, path: path.join('->'), pathLen: path.length },
        visualization: {
          type: 'array',
          array: [...path, ...Array(n - path.length).fill(-1)],
          highlights: Object.fromEntries(path.map((v, i) => [i, i === path.length - 1 ? 'active' : 'visited'])),
          labels: Object.fromEntries(path.map((v, i) => [i, `node${v}`])),
        } as ArrayVisualization,
      });

      if (node === n - 1) {
        result.push([...path]);
        steps.push({
          line: 8,
          explanation: `Found path #${result.length}: [${path.join(' -> ')}]. Backtrack to explore more.`,
          variables: { pathFound: path.join('->'), totalPaths: result.length },
          visualization: {
            type: 'array',
            array: [...path],
            highlights: Object.fromEntries(path.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(path.map((v, i) => [i, `n${v}`])),
          } as ArrayVisualization,
        });
        return;
      }

      for (const nei of graph[node]) {
        path.push(nei);
        dfs(nei);
        path.pop();

        if (steps.length <= 18) {
          steps.push({
            line: 11,
            explanation: `Backtrack from node ${nei}. Path restored to: [${path.join(' -> ')}].`,
            variables: { backtrackedFrom: nei, pathNow: path.join('->') },
            visualization: {
              type: 'array',
              array: [...path, -1],
              highlights: Object.fromEntries(path.map((_, i) => [i, 'visited'])),
              labels: { [path.length]: 'backtrack' },
            } as ArrayVisualization,
          });
        }
      }
    }

    dfs(0);

    steps.push({
      line: 13,
      explanation: `DFS complete. Found ${result.length} path(s) from 0 to ${n - 1}: ${result.map(p => '[' + p.join('->') + ']').join(', ')}.`,
      variables: { totalPaths: result.length, paths: result.map(p => p.join('->')).join(' | ') },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default allPathsFromSourceToTargetDfs;
