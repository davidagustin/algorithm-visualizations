import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const allPathsSourceToTarget: AlgorithmDefinition = {
  id: 'all-paths-source-to-target',
  title: 'All Paths Source to Target',
  leetcodeNumber: 797,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a DAG (Directed Acyclic Graph) with n nodes (0 to n-1), return all paths from node 0 to node n-1. Use DFS with backtracking: at each node, try all outgoing edges and record paths that reach the target.',
  tags: ['Graph', 'DFS', 'Backtracking', 'DAG'],
  code: {
    pseudocode: `function allPathsSourceTarget(graph):
  target = len(graph) - 1
  results = []
  path = [0]
  dfs(graph, 0, target, path, results)
  return results

function dfs(graph, node, target, path, results):
  if node == target:
    results.append(path[:])
    return
  for neighbor in graph[node]:
    path.append(neighbor)
    dfs(graph, neighbor, target, path, results)
    path.pop()`,
    python: `def allPathsSourceTarget(graph):
    target = len(graph) - 1
    results = []
    def dfs(node, path):
        if node == target:
            results.append(path[:])
            return
        for nb in graph[node]:
            path.append(nb)
            dfs(nb, path)
            path.pop()
    dfs(0, [0])
    return results`,
    javascript: `function allPathsSourceTarget(graph) {
  const target = graph.length - 1, results = [];
  function dfs(node, path) {
    if (node === target) { results.push([...path]); return; }
    for (const nb of graph[node]) {
      path.push(nb);
      dfs(nb, path);
      path.pop();
    }
  }
  dfs(0, [0]);
  return results;
}`,
    java: `public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    List<List<Integer>> res=new ArrayList<>();
    List<Integer> path=new ArrayList<>();path.add(0);
    dfs(graph,0,path,res);
    return res;
}
void dfs(int[][]g,int node,List<Integer>path,List<List<Integer>>res){
    if(node==g.length-1){res.add(new ArrayList<>(path));return;}
    for(int nb:g[node]){path.add(nb);dfs(g,nb,path,res);path.remove(path.size()-1);}
}`,
  },
  defaultInput: {
    graph: [[1, 2], [3], [3], []],
  },
  inputFields: [
    {
      name: 'graph',
      label: 'Adjacency List',
      type: 'array',
      defaultValue: [[1, 2], [3], [3], []],
      placeholder: '[[1,2],[3],[3],[]]',
      helperText: 'graph[i] = list of neighbors of node i. Last node is target.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const graph = input.graph as number[][];
    const n = graph.length;
    const target = n - 1;
    const steps: AlgorithmStep[] = [];
    const allPaths: number[][] = [];

    function makeViz(
      highlights: Record<number, string>,
      currentPath: number[],
      foundPaths: number[][]
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `n${i}→[${graph[i].join(',')}]`;
      }
      return {
        type: 'array',
        array: graph.map(neighbors => neighbors.length),
        highlights,
        labels,
        auxData: {
          label: 'DFS Paths',
          entries: [
            { key: 'Current path', value: currentPath.join(' → ') || '—' },
            { key: 'Paths found', value: String(foundPaths.length) },
            { key: 'All paths', value: foundPaths.map(p => p.join('→')).join(' | ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find all paths from node 0 to node ${target} in a ${n}-node DAG. Array shows number of outgoing edges per node. DFS with backtracking.`,
      variables: { n, target },
      visualization: makeViz({ 0: 'active', [target]: 'pointer' }, [], []),
    });

    const path: number[] = [0];

    function dfs(node: number) {
      if (node === target) {
        const found = [...path];
        allPaths.push(found);
        const hl: Record<number, string> = {};
        for (const p of path) hl[p] = 'found';
        steps.push({
          line: 9,
          explanation: `Reached target node ${target}! Path found: [${path.join(' → ')}]. Total paths: ${allPaths.length}.`,
          variables: { path: [...path], pathsFound: allPaths.length },
          visualization: makeViz(hl, [...path], [...allPaths]),
        });
        return;
      }

      const hl: Record<number, string> = {};
      for (const p of path) hl[p] = 'active';
      steps.push({
        line: 13,
        explanation: `At node ${node}. Current path: [${path.join(' → ')}]. Neighbors: [${graph[node].join(', ')}].`,
        variables: { node, path: [...path], neighbors: graph[node] },
        visualization: makeViz(hl, [...path], [...allPaths]),
      });

      for (const nb of graph[node]) {
        path.push(nb);
        const hl2: Record<number, string> = {};
        for (const p of path) hl2[p] = 'comparing';
        steps.push({
          line: 14,
          explanation: `Explore edge ${node} → ${nb}. Path so far: [${path.join(' → ')}].`,
          variables: { from: node, to: nb },
          visualization: makeViz(hl2, [...path], [...allPaths]),
        });
        dfs(nb);
        path.pop();
        const hl3: Record<number, string> = {};
        for (const p of path) hl3[p] = 'active';
        steps.push({
          line: 15,
          explanation: `Backtrack: remove ${nb} from path. Back to node ${node}. Path: [${path.join(' → ')}].`,
          variables: { backtrackFrom: nb, returnTo: node },
          visualization: makeViz(hl3, [...path], [...allPaths]),
        });
      }
    }

    dfs(0);

    steps.push({
      line: 6,
      explanation: `All ${allPaths.length} paths from 0 to ${target}: ${allPaths.map(p => '[' + p.join('→') + ']').join(', ')}.`,
      variables: { result: allPaths },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
        [],
        [...allPaths]
      ),
    });

    return steps;
  },
};

export default allPathsSourceToTarget;
