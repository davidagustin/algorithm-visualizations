import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const criticalConnectionsInNetworkII: AlgorithmDefinition = {
  id: 'critical-connections-in-network-ii',
  title: 'Critical Connections in a Network II',
  leetcodeNumber: 1192,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find all critical connections (bridges) in a network. A bridge is an edge whose removal increases the number of connected components. Uses Tarjan\'s bridge-finding algorithm with DFS timestamps (discovery and low values).',
  tags: ['Graph', 'DFS', 'Tarjan', 'Bridge Finding'],
  code: {
    pseudocode: `function criticalConnections(n, connections):
  build adjacency list
  disc = [-1] * n, low = [-1] * n
  timer = 0, bridges = []
  function dfs(u, parent):
    disc[u] = low[u] = timer++
    for v in adj[u]:
      if v == parent: continue
      if disc[v] == -1:
        dfs(v, u)
        low[u] = min(low[u], low[v])
        if low[v] > disc[u]: bridges.add([u,v])
      else:
        low[u] = min(low[u], disc[v])
  for i in 0..n-1:
    if disc[i] == -1: dfs(i, -1)
  return bridges`,
    python: `def criticalConnections(n, connections):
    adj = defaultdict(list)
    for u, v in connections:
        adj[u].append(v)
        adj[v].append(u)
    disc = [-1] * n
    low = [-1] * n
    bridges = []
    timer = [0]
    def dfs(u, parent):
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        for v in adj[u]:
            if v == parent: continue
            if disc[v] == -1:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append([u, v])
            else:
                low[u] = min(low[u], disc[v])
    dfs(0, -1)
    return bridges`,
    javascript: `function criticalConnections(n, connections) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of connections) {
    adj[u].push(v); adj[v].push(u);
  }
  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges = [];
  let timer = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  }
  dfs(0, -1);
  return bridges;
}`,
    java: `public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (List<Integer> c : connections) {
        adj.get(c.get(0)).add(c.get(1));
        adj.get(c.get(1)).add(c.get(0));
    }
    int[] disc = new int[n], low = new int[n];
    Arrays.fill(disc, -1);
    List<List<Integer>> bridges = new ArrayList<>();
    dfs(0, -1, disc, low, new int[]{0}, adj, bridges);
    return bridges;
}
void dfs(int u, int par, int[] disc, int[] low, int[] timer, List<List<Integer>>[] adj, List<List<Integer>> br) {
    disc[u] = low[u] = timer[0]++;
    for (int v : adj[u]) {
        if (v == par) continue;
        if (disc[v] == -1) {
            dfs(v, u, disc, low, timer, adj, br);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) br.add(Arrays.asList(u, v));
        } else low[u] = Math.min(low[u], disc[v]);
    }
}`,
  },
  defaultInput: {
    n: 4,
    connections: [[0,1],[1,2],[2,0],[1,3]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'connections',
      label: 'Connections [u, v]',
      type: 'array',
      defaultValue: [[0,1],[1,2],[2,0],[1,3]],
      placeholder: '[[0,1],[1,2]]',
      helperText: 'Undirected edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const connections = input.connections as number[][];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of connections) {
      adj[u].push(v);
      adj[v].push(u);
    }

    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(-1);
    const bridges: number[][] = [];
    let timer = 0;

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: [...disc],
        highlights,
        labels: Object.fromEntries(disc.map((d, i) => [i, `n${i} d=${d === -1 ? '-' : d} l=${low[i] === -1 ? '-' : low[i]}`])),
        auxData: {
          label: "Tarjan's Bridge Finding",
          entries: [
            { key: 'Timer', value: String(timer) },
            { key: 'Bridges', value: bridges.length > 0 ? bridges.map(b => `[${b[0]}-${b[1]}]`).join(', ') : 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize Tarjan's bridge finding. disc[] = discovery time, low[] = lowest reachable disc. All -1 initially.`,
      variables: { n, edges: connections.length },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        'Not started'
      ),
    });

    function dfs(u: number, parent: number) {
      disc[u] = low[u] = timer++;
      const h: Record<number, string> = {};
      for (let i = 0; i < n; i++) h[i] = disc[i] === -1 ? 'default' : 'visited';
      steps.push({
        line: 6,
        explanation: `Visit node ${u}: disc[${u}]=low[${u}]=${disc[u]}.`,
        variables: { u, disc: disc[u], low: low[u] },
        visualization: makeViz({ ...h, [u]: 'active' }, `Visiting node ${u}`),
      });

      for (const v of adj[u]) {
        if (v === parent) continue;
        if (disc[v] === -1) {
          dfs(v, u);
          const prevLow = low[u];
          low[u] = Math.min(low[u], low[v]);
          const isBridge = low[v] > disc[u];
          if (isBridge) {
            bridges.push([u, v]);
          }
          const h2: Record<number, string> = {};
          for (let i = 0; i < n; i++) h2[i] = disc[i] === -1 ? 'default' : 'visited';
          steps.push({
            line: 10,
            explanation: `Back from DFS(${v}). low[${u}] updated from ${prevLow} to ${low[u]}. ${isBridge ? `Bridge found: [${u}-${v}] because low[${v}]=${low[v]} > disc[${u}]=${disc[u]}` : `Not a bridge: low[${v}]=${low[v]} <= disc[${u}]=${disc[u]}`}`,
            variables: { u, v, lowU: low[u], lowV: low[v], discU: disc[u], isBridge },
            visualization: makeViz(
              { ...h2, [u]: isBridge ? 'mismatch' : 'found', [v]: 'comparing' },
              isBridge ? `Bridge: [${u}-${v}]` : 'Not a bridge'
            ),
          });
        } else {
          const prevLow = low[u];
          low[u] = Math.min(low[u], disc[v]);
          const h2: Record<number, string> = {};
          for (let i = 0; i < n; i++) h2[i] = disc[i] === -1 ? 'default' : 'visited';
          steps.push({
            line: 12,
            explanation: `Node ${v} already visited (disc[${v}]=${disc[v]}). Update low[${u}] = min(${prevLow}, ${disc[v]}) = ${low[u]}.`,
            variables: { u, v, discV: disc[v], lowU: low[u] },
            visualization: makeViz({ ...h2, [u]: 'active', [v]: 'pointer' }, `Back edge ${u}->${v}`),
          });
        }
      }
    }

    for (let i = 0; i < n; i++) {
      if (disc[i] === -1) dfs(i, -1);
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 15,
      explanation: `Complete. Found ${bridges.length} bridge(s): ${bridges.length > 0 ? bridges.map(b => `[${b[0]}-${b[1]}]`).join(', ') : 'none'}.`,
      variables: { bridges },
      visualization: makeViz(finalH, `${bridges.length} bridge(s) found`),
    });

    return steps;
  },
};

export default criticalConnectionsInNetworkII;
