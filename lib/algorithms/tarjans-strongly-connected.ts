import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const tarjansStronglyConnected: AlgorithmDefinition = {
  id: 'tarjans-strongly-connected',
  title: 'Tarjan Strongly Connected Components',
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Tarjan algorithm finds all Strongly Connected Components (SCCs) in a directed graph in O(V+E). It uses DFS with a discovery-time array and low-link values. When a node is its own root (disc[u] == low[u]), it pops the stack to form an SCC.',
  tags: ['tarjan', 'SCC', 'strongly connected', 'DFS', 'graph'],

  code: {
    pseudocode: `function tarjan(V, adj):
  disc = [-1] * V, low = [0] * V
  onStack = [false] * V, stack = []
  timer = 0, sccs = []
  function dfs(u):
    disc[u] = low[u] = timer++
    stack.push(u), onStack[u] = true
    for each v in adj[u]:
      if disc[v] == -1: dfs(v)
      if onStack[v]: low[u] = min(low[u], low[v])
    if disc[u] == low[u]:
      scc = [], pop until u
      sccs.append(scc)
  for each u: if disc[u]==-1: dfs(u)
  return sccs`,

    python: `def tarjan(V, adj):
    disc = [-1] * V
    low = [0] * V
    on_stack = [False] * V
    stack = []
    timer = [0]
    sccs = []
    def dfs(u):
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        stack.append(u)
        on_stack[u] = True
        for v in adj[u]:
            if disc[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif on_stack[v]:
                low[u] = min(low[u], disc[v])
        if disc[u] == low[u]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == u: break
            sccs.append(scc)
    for u in range(V):
        if disc[u] == -1: dfs(u)
    return sccs`,

    javascript: `function tarjan(V, adj) {
  const disc = new Array(V).fill(-1);
  const low = new Array(V).fill(0);
  const onStack = new Array(V).fill(false);
  const stack = [];
  let timer = 0;
  const sccs = [];
  function dfs(u) {
    disc[u] = low[u] = timer++;
    stack.push(u); onStack[u] = true;
    for (const v of adj[u]) {
      if (disc[v] === -1) { dfs(v); low[u] = Math.min(low[u], low[v]); }
      else if (onStack[v]) low[u] = Math.min(low[u], disc[v]);
    }
    if (disc[u] === low[u]) {
      const scc = [];
      while (true) { const w = stack.pop(); onStack[w] = false; scc.push(w); if (w === u) break; }
      sccs.push(scc);
    }
  }
  for (let u = 0; u < V; u++) if (disc[u] === -1) dfs(u);
  return sccs;
}`,

    java: `public List<List<Integer>> tarjan(int V, List<List<Integer>> adj) {
    int[] disc = new int[V], low = new int[V];
    Arrays.fill(disc, -1);
    boolean[] onStack = new boolean[V];
    Deque<Integer> stack = new ArrayDeque<>();
    List<List<Integer>> sccs = new ArrayList<>();
    int[] timer = {0};
    for (int u = 0; u < V; u++)
        if (disc[u] == -1) dfs(u, adj, disc, low, onStack, stack, timer, sccs);
    return sccs;
}`,
  },

  defaultInput: {
    V: 5,
    edges: [1, 0, 0, 2, 2, 1, 0, 3, 3, 4],
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
      label: 'Directed Edges (u,v pairs)',
      type: 'array',
      defaultValue: [1, 0, 0, 2, 2, 1, 0, 3, 3, 4],
      placeholder: '1,0,0,2,...',
      helperText: 'Flat list of directed u->v edge pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) {
      adj[edgeFlat[i]].push(edgeFlat[i + 1]);
    }

    const disc: number[] = new Array(V).fill(-1);
    const low: number[] = new Array(V).fill(0);
    const onStack: boolean[] = new Array(V).fill(false);
    const stack: number[] = [];
    let timer = 0;
    const sccs: number[][] = [];
    const sccOf: number[] = new Array(V).fill(-1);

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: low.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          sccOf[i] >= 0 ? 'sorted' : i === active ? 'active' : onStack[i] ? 'pointer' : disc[i] >= 0 ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `d${disc[i] < 0 ? '?' : disc[i]}`])),
    });

    function dfs(u: number) {
      disc[u] = low[u] = timer++;
      stack.push(u);
      onStack[u] = true;

      steps.push({
        line: 6,
        explanation: `Visit ${u}: disc[${u}]=low[${u}]=${disc[u]}. Push to stack: [${stack.join(',')}].`,
        variables: { u, disc: disc[u], low: low[u], stack: [...stack] },
        visualization: makeViz(u),
      });

      for (const v of adj[u]) {
        if (disc[v] === -1) {
          dfs(v);
          low[u] = Math.min(low[u], low[v]);
          steps.push({
            line: 10,
            explanation: `Back at ${u}: low[${u}] = min(low[${u}], low[${v}]) = ${low[u]}.`,
            variables: { u, v, 'low[u]': low[u], 'low[v]': low[v] },
            visualization: makeViz(u),
          });
        } else if (onStack[v]) {
          low[u] = Math.min(low[u], disc[v]);
          steps.push({
            line: 10,
            explanation: `${u}->${v} back edge. low[${u}] = min(low[${u}], disc[${v}]) = ${low[u]}.`,
            variables: { u, v, 'low[u]': low[u], 'disc[v]': disc[v] },
            visualization: makeViz(u),
          });
        }
      }

      if (disc[u] === low[u]) {
        const scc: number[] = [];
        while (true) {
          const w = stack.pop()!;
          onStack[w] = false;
          scc.push(w);
          sccOf[w] = sccs.length;
          if (w === u) break;
        }
        sccs.push(scc);
        steps.push({
          line: 12,
          explanation: `SCC found rooted at ${u}: [${scc.join(', ')}]. Total SCCs = ${sccs.length}.`,
          variables: { scc, totalSCCs: sccs.length },
          visualization: makeViz(u),
        });
      }
    }

    steps.push({
      line: 1,
      explanation: `Starting Tarjan SCC on ${V} vertices.`,
      variables: { V },
      visualization: makeViz(-1),
    });

    for (let u = 0; u < V; u++) {
      if (disc[u] === -1) dfs(u);
    }

    steps.push({
      line: 14,
      explanation: `Tarjan complete. Found ${sccs.length} SCC(s): ${sccs.map(s => `[${s.join(',')}]`).join(', ')}.`,
      variables: { sccs },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default tarjansStronglyConnected;
