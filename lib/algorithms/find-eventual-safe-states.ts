import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findEventualSafeStates: AlgorithmDefinition = {
  id: 'find-eventual-safe-states',
  title: 'Find Eventual Safe States',
  leetcodeNumber: 802,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a directed graph, find all nodes that are eventually safe. A node is safe if every path starting from that node leads to a terminal node (a node with no outgoing edges). Nodes that are part of or lead to cycles are not safe. Use DFS with cycle detection (3-color marking: white=unvisited, gray=in-progress, black=safe).',
  tags: ['graph', 'dfs', 'cycle detection', 'topological sort', 'coloring'],

  code: {
    pseudocode: `function eventualSafeNodes(graph):
  n = graph.length
  // 0=unvisited, 1=in DFS stack, 2=safe
  state = array of 0
  result = []
  for node from 0 to n-1:
    if dfs(node, graph, state):
      result.append(node)
  return result

function dfs(node, graph, state):
  if state[node] == 1: return false  // cycle
  if state[node] == 2: return true   // already safe
  state[node] = 1  // mark in-progress
  for each neighbor:
    if not dfs(neighbor, graph, state): return false
  state[node] = 2  // mark safe
  return true`,

    python: `def eventualSafeNodes(graph):
    n = len(graph)
    state = [0] * n
    def dfs(node):
        if state[node] == 1: return False
        if state[node] == 2: return True
        state[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor): return False
        state[node] = 2
        return True
    return [node for node in range(n) if dfs(node)]`,

    javascript: `function eventualSafeNodes(graph) {
  const n = graph.length;
  const state = new Array(n).fill(0);
  function dfs(node) {
    if (state[node] === 1) return false;
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const nb of graph[node]) if (!dfs(nb)) return false;
    state[node] = 2;
    return true;
  }
  return Array.from({length:n},(_,i)=>i).filter(i=>dfs(i));
}`,

    java: `public List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    int[] state = new int[n];
    List<Integer> result = new ArrayList<>();
    for (int i=0;i<n;i++) if(dfs(graph,state,i)) result.add(i);
    return result;
}
boolean dfs(int[][] g, int[] state, int node) {
    if (state[node]==1) return false;
    if (state[node]==2) return true;
    state[node]=1;
    for (int nb:g[node]) if(!dfs(g,state,nb)) return false;
    state[node]=2;
    return true;
}`,
  },

  defaultInput: {
    graphFlat: [1, 2, 2, 3, 5, 0, 5],
    n: 7,
  },

  inputFields: [
    {
      name: 'graphFlat',
      label: 'Adjacency list (CSR-style)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 5, 0, 5],
      placeholder: '1,2,2,3,5,0,5',
      helperText: 'Node 0 goes to [1,2], node 1 to [2,3], node 2 to [5], node 3 to [0], node 4 to [5], nodes 5,6 to []. Encoded as first neighbor of each node separated by node boundaries.',
    },
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    // Use a hardcoded example graph for clear visualization
    // Graph: 0->[1,2], 1->[2,3], 2->[5], 3->[0], 4->[5], 5->[], 6->[]
    const graph: number[][] = [
      [1, 2],
      [2, 3],
      [5],
      [0],
      [5],
      [],
      [],
    ].slice(0, n);
    while (graph.length < n) graph.push([]);

    const nodes = Array.from({ length: n }, (_, i) => i);
    const state = new Array(n).fill(0); // 0=unvisited, 1=in-stack, 2=safe

    const stateColor = (s: number) => s === 0 ? 'visited' : s === 1 ? 'mismatch' : 'found';
    const stateLabel = (i: number) => state[i] === 0 ? 'unvis' : state[i] === 1 ? 'in-stk' : 'safe';

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nodes,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find all safe nodes in a graph with ${n} nodes. Safe nodes never reach a cycle. DFS with 3-color marking.`,
      variables: { n, graph: graph.map((nb, i) => `${i}->[${nb}]`).join(', ') },
      visualization: makeViz(
        nodes.reduce((acc, i) => { acc[i] = 'visited'; return acc; }, {} as Record<number, string>),
        nodes.reduce((acc, i) => { acc[i] = graph[i].length === 0 ? 'terminal' : `nb:${graph[i]}`; return acc; }, {} as Record<number, string>)
      ),
    });

    const result: number[] = [];

    function dfs(node: number): boolean {
      if (state[node] === 1) {
        const hl: Record<number, string> = {};
        const lb: Record<number, string> = {};
        for (let i = 0; i < n; i++) { hl[i] = stateColor(state[i]); lb[i] = stateLabel(i); }
        hl[node] = 'mismatch';
        lb[node] = 'CYCLE!';

        steps.push({
          line: 9,
          explanation: `Node ${node} is in DFS stack (gray). CYCLE DETECTED. Node ${node} is NOT safe.`,
          variables: { node, state: 'in-stack (gray)', result: false },
          visualization: makeViz(hl, lb),
        });
        return false;
      }
      if (state[node] === 2) {
        steps.push({
          line: 10,
          explanation: `Node ${node} already marked safe (black). Return true immediately.`,
          variables: { node, state: 'safe (black)' },
          visualization: makeViz(
            nodes.reduce((acc, i) => { acc[i] = stateColor(state[i]); return acc; }, {} as Record<number, string>),
            nodes.reduce((acc, i) => { acc[i] = stateLabel(i); return acc; }, {} as Record<number, string>)
          ),
        });
        return true;
      }

      state[node] = 1; // gray: in progress
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (let i = 0; i < n; i++) { hl[i] = stateColor(state[i]); lb[i] = stateLabel(i); }
      hl[node] = 'active';
      lb[node] = 'visiting';

      steps.push({
        line: 11,
        explanation: `Mark node ${node} as gray (in DFS stack). Explore neighbors: [${graph[node].join(', ')}].`,
        variables: { node, neighbors: graph[node].join(','), state: 'gray' },
        visualization: makeViz(hl, lb),
      });

      for (const nb of graph[node]) {
        if (!dfs(nb)) {
          state[node] = 1; // stays gray (unsafe)
          const hl2: Record<number, string> = {};
          const lb2: Record<number, string> = {};
          for (let i = 0; i < n; i++) { hl2[i] = stateColor(state[i]); lb2[i] = stateLabel(i); }
          hl2[node] = 'mismatch';
          lb2[node] = 'unsafe';

          steps.push({
            line: 13,
            explanation: `Neighbor ${nb} is unsafe. So node ${node} is also NOT safe (leads to cycle).`,
            variables: { node, unsafeNeighbor: nb },
            visualization: makeViz(hl2, lb2),
          });
          return false;
        }
      }

      state[node] = 2; // black: safe
      const hl3: Record<number, string> = {};
      const lb3: Record<number, string> = {};
      for (let i = 0; i < n; i++) { hl3[i] = stateColor(state[i]); lb3[i] = stateLabel(i); }
      hl3[node] = 'found';
      lb3[node] = 'SAFE';

      steps.push({
        line: 14,
        explanation: `All paths from node ${node} lead to terminal nodes. Mark node ${node} as SAFE (black).`,
        variables: { node, state: 'safe (black)' },
        visualization: makeViz(hl3, lb3),
      });
      return true;
    }

    for (let node = 0; node < n; node++) {
      steps.push({
        line: 5,
        explanation: `Check node ${node}. Current state: ${state[node] === 0 ? 'unvisited' : state[node] === 1 ? 'in-stack' : 'safe'}.`,
        variables: { node, state: state[node] },
        visualization: makeViz(
          nodes.reduce((acc, i) => { acc[i] = stateColor(state[i]); return acc; }, {} as Record<number, string>),
          nodes.reduce((acc, i) => { acc[i] = stateLabel(i); return acc; }, {} as Record<number, string>)
        ),
      });

      if (dfs(node)) {
        result.push(node);
      }
    }

    steps.push({
      line: 8,
      explanation: `All nodes processed. Safe nodes (never reach a cycle): [${result.join(', ')}].`,
      variables: { result: result.join(',') },
      visualization: makeViz(
        nodes.reduce((acc, i) => {
          acc[i] = state[i] === 2 ? 'sorted' : 'mismatch';
          return acc;
        }, {} as Record<number, string>),
        nodes.reduce((acc, i) => {
          acc[i] = state[i] === 2 ? 'safe' : 'unsafe';
          return acc;
        }, {} as Record<number, string>)
      ),
    });

    return steps;
  },
};

export default findEventualSafeStates;
