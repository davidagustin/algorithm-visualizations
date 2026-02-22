import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const graphColoring: AlgorithmDefinition = {
  id: 'graph-coloring',
  title: 'Graph Coloring with Backtracking',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Graph coloring assigns colors to vertices so no two adjacent vertices share the same color. Uses backtracking: try assigning a color to each vertex in order, skip if the color conflicts with a neighbor, and backtrack if no valid color exists. Finds the chromatic number or a valid k-coloring.',
  tags: ['graph coloring', 'backtracking', 'chromatic number', 'constraint satisfaction', 'graph'],

  code: {
    pseudocode: `function graphColoring(V, adj, k):
  colors = [0]*V // 0 = uncolored
  function isSafe(v, c):
    for each u in adj[v]:
      if colors[u] == c: return false
    return true
  function solve(v):
    if v == V: return true
    for c from 1 to k:
      if isSafe(v, c):
        colors[v] = c
        if solve(v+1): return true
        colors[v] = 0 // backtrack
    return false
  return solve(0), colors`,

    python: `def graph_coloring(V, adj, k):
    colors = [0] * V
    def is_safe(v, c):
        return all(colors[u] != c for u in adj[v])
    def solve(v):
        if v == V: return True
        for c in range(1, k+1):
            if is_safe(v, c):
                colors[v] = c
                if solve(v+1): return True
                colors[v] = 0
        return False
    success = solve(0)
    return success, colors`,

    javascript: `function graphColoring(V, adj, k) {
  const colors = new Array(V).fill(0);
  function isSafe(v, c) {
    return adj[v].every(u => colors[u] !== c);
  }
  function solve(v) {
    if (v === V) return true;
    for (let c = 1; c <= k; c++) {
      if (isSafe(v, c)) {
        colors[v] = c;
        if (solve(v + 1)) return true;
        colors[v] = 0;
      }
    }
    return false;
  }
  return { success: solve(0), colors };
}`,

    java: `public boolean graphColoring(int V, List<List<Integer>> adj, int k, int[] colors) {
    return solve(V, adj, k, colors, 0);
}
boolean solve(int V, List<List<Integer>> adj, int k, int[] colors, int v) {
    if (v == V) return true;
    for (int c = 1; c <= k; c++) {
        if (isSafe(adj, colors, v, c)) {
            colors[v] = c;
            if (solve(V, adj, k, colors, v+1)) return true;
            colors[v] = 0;
        }
    }
    return false;
}`,
  },

  defaultInput: {
    V: 4,
    k: 3,
    edges: [0, 1, 0, 2, 0, 3, 1, 2, 2, 3],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'k',
      label: 'Number of Colors',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'edges',
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 0, 3, 1, 2, 2, 3],
      placeholder: '0,1,0,2,...',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const k = input.k as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) {
      const u = edgeFlat[i], v = edgeFlat[i + 1];
      adj[u].push(v); adj[v].push(u);
    }

    const colors: number[] = new Array(V).fill(0);
    const colorNames = ['', 'Red', 'Green', 'Blue', 'Yellow', 'Purple'];

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: colors.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          i === active ? 'active' : colors[i] > 0 ? 'found' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, colors[i] > 0 ? colorNames[colors[i]] || `C${colors[i]}` : `v${i}`])),
    });

    function isSafe(v: number, c: number): boolean {
      return adj[v].every(u => colors[u] !== c);
    }

    steps.push({
      line: 1,
      explanation: `Graph coloring with ${k} colors on ${V} vertices. Try each color via backtracking.`,
      variables: { V, k },
      visualization: makeViz(-1),
    });

    function solve(v: number): boolean {
      if (v === V) return true;

      for (let c = 1; c <= k; c++) {
        if (isSafe(v, c)) {
          colors[v] = c;
          steps.push({
            line: 9,
            explanation: `Assign color ${colorNames[c] || c} to vertex ${v}. No conflict with neighbors.`,
            variables: { vertex: v, color: colorNames[c] || c, colors: [...colors] },
            visualization: makeViz(v),
          });

          if (solve(v + 1)) return true;

          steps.push({
            line: 11,
            explanation: `Backtrack: remove color from vertex ${v}. Try next color.`,
            variables: { vertex: v, removedColor: colorNames[c] || c },
            visualization: makeViz(v),
          });
          colors[v] = 0;
        } else {
          steps.push({
            line: 7,
            explanation: `Color ${colorNames[c] || c} conflicts for vertex ${v}. Neighbor already has this color.`,
            variables: { vertex: v, triedColor: colorNames[c] || c },
            visualization: makeViz(v),
          });
        }
      }

      return false;
    }

    const success = solve(0);

    steps.push({
      line: 12,
      explanation: success
        ? `Graph coloring successful with ${k} colors! Assignment: [${colors.map((c, i) => `v${i}:${colorNames[c] || c}`).join(', ')}].`
        : `No valid coloring exists with ${k} colors.`,
      variables: { success, colors: colors.map((c, i) => ({ vertex: i, color: colorNames[c] || 'none' })) },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default graphColoring;
