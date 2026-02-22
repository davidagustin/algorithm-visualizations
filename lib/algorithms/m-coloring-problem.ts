import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const mColoringProblem: AlgorithmDefinition = {
  id: 'm-coloring-problem',
  title: 'M-Coloring Problem',
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an undirected graph and M colors, determine if the graph can be colored using at most M colors such that no two adjacent vertices share the same color. Uses backtracking to assign colors to vertices one at a time, checking that no adjacent vertex has the same color before proceeding.',
  tags: ['backtracking', 'graph', 'coloring', 'recursion', 'constraint satisfaction'],

  code: {
    pseudocode: `function graphColoring(graph, m, n):
  colors = array of 0, length n
  if backtrack(graph, m, colors, 0, n): return colors
  return "Not possible"

function backtrack(graph, m, colors, vertex, n):
  if vertex == n: return true
  for color from 1 to m:
    if isSafe(graph, colors, vertex, color):
      colors[vertex] = color
      if backtrack(graph, m, colors, vertex+1, n): return true
      colors[vertex] = 0
  return false

function isSafe(graph, colors, vertex, color):
  for each neighbor of vertex:
    if colors[neighbor] == color: return false
  return true`,

    python: `def graphColoring(graph, m):
    n = len(graph)
    colors = [0] * n
    def is_safe(vertex, color):
        for neighbor in range(n):
            if graph[vertex][neighbor] and colors[neighbor] == color:
                return False
        return True
    def backtrack(vertex):
        if vertex == n:
            return True
        for color in range(1, m + 1):
            if is_safe(vertex, color):
                colors[vertex] = color
                if backtrack(vertex + 1):
                    return True
                colors[vertex] = 0
        return False
    return backtrack(0), colors`,

    javascript: `function graphColoring(graph, m) {
  const n = graph.length;
  const colors = new Array(n).fill(0);
  function isSafe(vertex, color) {
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (graph[vertex][neighbor] && colors[neighbor] === color) return false;
    }
    return true;
  }
  function backtrack(vertex) {
    if (vertex === n) return true;
    for (let color = 1; color <= m; color++) {
      if (isSafe(vertex, color)) {
        colors[vertex] = color;
        if (backtrack(vertex + 1)) return true;
        colors[vertex] = 0;
      }
    }
    return false;
  }
  return backtrack(0) ? colors : null;
}`,

    java: `public boolean graphColoring(int[][] graph, int m, int[] colors, int vertex) {
    if (vertex == graph.length) return true;
    for (int color = 1; color <= m; color++) {
        if (isSafe(graph, colors, vertex, color)) {
            colors[vertex] = color;
            if (graphColoring(graph, m, colors, vertex + 1)) return true;
            colors[vertex] = 0;
        }
    }
    return false;
}
private boolean isSafe(int[][] graph, int[] colors, int v, int c) {
    for (int i = 0; i < graph.length; i++)
        if (graph[v][i] == 1 && colors[i] == c) return false;
    return true;
}`,
  },

  defaultInput: {
    graph: [[0,1,1,1],[1,0,1,0],[1,1,0,1],[1,0,1,0]],
    m: 3,
  },

  inputFields: [
    {
      name: 'm',
      label: 'Number of Colors (M)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum number of colors available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const graph = (input.graph as number[][]) || [[0,1,1,1],[1,0,1,0],[1,1,0,1],[1,0,1,0]];
    const n = graph.length;
    const steps: AlgorithmStep[] = [];
    const colors = new Array(n).fill(0);
    const colorNames = ['', 'Red', 'Green', 'Blue', 'Yellow', 'Purple'];

    steps.push({
      line: 1,
      explanation: `Graph with ${n} vertices. Using at most ${m} colors. Adjacency matrix provided. Will try to color each vertex.`,
      variables: { vertices: n, maxColors: m },
      visualization: {
        type: 'array',
        array: new Array(n).fill(0),
        highlights: {},
        labels: new Array(n).fill(0).reduce((acc, _, i) => ({ ...acc, [i]: `V${i}` }), {} as Record<number, string>),
      },
    });

    function isSafe(vertex: number, color: number): boolean {
      for (let neighbor = 0; neighbor < n; neighbor++) {
        if (graph[vertex][neighbor] && colors[neighbor] === color) return false;
      }
      return true;
    }

    let found = false;

    function backtrack(vertex: number): boolean {
      if (vertex === n) {
        found = true;
        steps.push({
          line: 4,
          explanation: `All vertices colored! Solution: [${colors.map((c, i) => `V${i}:${colorNames[c] || c}`).join(', ')}]`,
          variables: { coloring: [...colors], solution: colors.map((c, i) => `V${i}=${colorNames[c] || c}`) },
          visualization: {
            type: 'array',
            array: [...colors],
            highlights: colors.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: colors.reduce((acc, c, i) => ({ ...acc, [i]: `V${i}:${colorNames[c] || c}` }), {} as Record<number, string>),
          },
        });
        return true;
      }

      for (let color = 1; color <= m; color++) {
        if (isSafe(vertex, color)) {
          colors[vertex] = color;

          steps.push({
            line: 9,
            explanation: `Assign color ${colorNames[color] || color} to vertex V${vertex}. No adjacent vertex has this color. Colors so far: [${colors.slice(0, vertex + 1).map((c, i) => `V${i}:${colorNames[c] || c}`).join(', ')}]`,
            variables: { vertex, color: colorNames[color] || color, colorsAssigned: vertex + 1 },
            visualization: {
              type: 'array',
              array: [...colors],
              highlights: { [vertex]: 'active' },
              labels: colors.reduce((acc, c, i) => ({
                ...acc,
                [i]: c > 0 ? `V${i}:${colorNames[c] || c}` : `V${i}:?`,
              }), {} as Record<number, string>),
            },
          });

          if (backtrack(vertex + 1)) return true;

          colors[vertex] = 0;

          steps.push({
            line: 11,
            explanation: `Backtrack: color ${colorNames[color] || color} for V${vertex} leads to conflict later. Try next color.`,
            variables: { vertex, removedColor: colorNames[color] || color },
            visualization: {
              type: 'array',
              array: [...colors],
              highlights: { [vertex]: 'mismatch' },
              labels: colors.reduce((acc, c, i) => ({
                ...acc,
                [i]: c > 0 ? `V${i}:${colorNames[c] || c}` : `V${i}:?`,
              }), {} as Record<number, string>),
            },
          });
        } else {
          steps.push({
            line: 14,
            explanation: `Color ${colorNames[color] || color} unsafe for V${vertex}: adjacent vertex already has this color.`,
            variables: { vertex, unsafeColor: colorNames[color] || color, reason: 'adjacent conflict' },
            visualization: {
              type: 'array',
              array: [...colors],
              highlights: { [vertex]: 'comparing' },
              labels: colors.reduce((acc, c, i) => ({
                ...acc,
                [i]: c > 0 ? `V${i}:${colorNames[c] || c}` : `V${i}:?`,
              }), {} as Record<number, string>),
            },
          });
        }
      }

      return false;
    }

    backtrack(0);

    if (!found) {
      steps.push({
        line: 3,
        explanation: `Cannot color this graph with ${m} colors such that no adjacent vertices share a color.`,
        variables: { result: false, m },
        visualization: {
          type: 'array',
          array: new Array(n).fill(0),
          highlights: new Array(n).fill(0).reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default mColoringProblem;
