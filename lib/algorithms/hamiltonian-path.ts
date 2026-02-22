import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const hamiltonianPath: AlgorithmDefinition = {
  id: 'hamiltonian-path',
  title: 'Hamiltonian Path with Backtracking',
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'A Hamiltonian path visits every vertex exactly once. Finding one is NP-complete. Uses backtracking: maintain a path and visited set, try extending the path to unvisited neighbors, backtrack when stuck. A Hamiltonian circuit additionally returns to the start vertex.',
  tags: ['Hamiltonian path', 'backtracking', 'NP-complete', 'graph', 'exhaustive search'],

  code: {
    pseudocode: `function hamiltonianPath(V, adj):
  visited = [false]*V
  path = [0]
  visited[0] = true
  function solve(pos):
    if pos == V: return true // all visited
    last = path[pos-1]
    for each v in adj[last]:
      if not visited[v]:
        path.append(v)
        visited[v] = true
        if solve(pos+1): return true
        path.removeLast()
        visited[v] = false // backtrack
    return false
  return solve(1), path`,

    python: `def hamiltonian_path(V, adj):
    visited = [False] * V
    path = [0]
    visited[0] = True
    def solve(pos):
        if pos == V: return True
        last = path[-1]
        for v in adj[last]:
            if not visited[v]:
                path.append(v)
                visited[v] = True
                if solve(pos+1): return True
                path.pop()
                visited[v] = False
        return False
    if solve(1):
        return path
    return []`,

    javascript: `function hamiltonianPath(V, adj) {
  const visited = new Array(V).fill(false);
  const path = [0];
  visited[0] = true;
  function solve(pos) {
    if (pos === V) return true;
    const last = path[pos - 1];
    for (const v of adj[last]) {
      if (!visited[v]) {
        path.push(v); visited[v] = true;
        if (solve(pos + 1)) return true;
        path.pop(); visited[v] = false;
      }
    }
    return false;
  }
  return solve(1) ? path : [];
}`,

    java: `public List<Integer> hamiltonianPath(int V, List<List<Integer>> adj) {
    boolean[] visited = new boolean[V];
    List<Integer> path = new ArrayList<>();
    path.add(0); visited[0] = true;
    if (solve(V, adj, visited, path, 1)) return path;
    return Collections.emptyList();
}
boolean solve(int V, List<List<Integer>> adj, boolean[] visited, List<Integer> path, int pos) {
    if (pos == V) return true;
    int last = path.get(path.size()-1);
    for (int v : adj.get(last)) {
        if (!visited[v]) {
            path.add(v); visited[v]=true;
            if (solve(V,adj,visited,path,pos+1)) return true;
            path.remove(path.size()-1); visited[v]=false;
        }
    }
    return false;
}`,
  },

  defaultInput: {
    V: 5,
    edges: [0, 1, 0, 3, 1, 2, 1, 3, 2, 4, 3, 4],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'edges',
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 0, 3, 1, 2, 1, 3, 2, 4, 3, 4],
      placeholder: '0,1,0,3,...',
      helperText: 'Flat list of undirected edge pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) {
      const u = edgeFlat[i], v = edgeFlat[i + 1];
      adj[u].push(v); adj[v].push(u);
    }

    const visited: boolean[] = new Array(V).fill(false);
    const path: number[] = [0];
    visited[0] = true;
    let found = false;
    let backtrackCount = 0;

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: V }, (_, i) => i),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          path.includes(i) ? (i === active ? 'active' : 'found') : visited[i] ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [i, path.includes(i) ? 'p' + path.indexOf(i) : 'v' + i])
      ),
    });

    steps.push({
      line: 1,
      explanation: `Find Hamiltonian path in graph with ${V} vertices. Start from vertex 0.`,
      variables: { V, start: 0 },
      visualization: makeViz(0),
    });

    function solve(pos: number): boolean {
      if (pos === V) return true;

      const last = path[pos - 1];

      for (const v of adj[last]) {
        if (!visited[v]) {
          path.push(v);
          visited[v] = true;

          steps.push({
            line: 8,
            explanation: `Extend path to vertex ${v}. Path so far: [${path.join('->')}]. Position ${pos}/${V - 1}.`,
            variables: { path: [...path], position: pos, vertex: v },
            visualization: makeViz(v),
          });

          if (solve(pos + 1)) return true;

          backtrackCount++;
          path.pop();
          visited[v] = false;

          steps.push({
            line: 11,
            explanation: `Backtrack from vertex ${v}. No Hamiltonian path through here. Backtracks: ${backtrackCount}.`,
            variables: { backtrackedFrom: v, path: [...path], backtracks: backtrackCount },
            visualization: makeViz(last),
          });
        }
      }

      return false;
    }

    found = solve(1);

    steps.push({
      line: 13,
      explanation: found
        ? `Hamiltonian path found: [${path.join(' -> ')}]. All ${V} vertices visited exactly once.`
        : `No Hamiltonian path exists in this graph after ${backtrackCount} backtracks.`,
      variables: { found, path: found ? path : [], backtracks: backtrackCount },
      visualization: {
        type: 'array',
        array: found ? path : Array.from({ length: V }, (_, i) => i),
        highlights: Object.fromEntries(
          (found ? path : Array.from({ length: V }, (_, i) => i)).map((_, i) => [i, found ? 'sorted' : 'mismatch'])
        ),
        labels: Object.fromEntries(
          (found ? path : Array.from({ length: V }, (_, i) => i)).map((v, i) => [i, 'v' + String(v)])
        ),
      },
    });

    return steps;
  },
};

export default hamiltonianPath;
