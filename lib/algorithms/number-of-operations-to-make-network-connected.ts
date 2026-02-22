import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfOperationsToMakeNetworkConnected: AlgorithmDefinition = {
  id: 'number-of-operations-to-make-network-connected',
  title: 'Number of Operations to Make Network Connected',
  leetcodeNumber: 1319,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n computers and connections, find the minimum number of cable moves needed to connect all computers. If there are not enough cables (connections < n-1), return -1. Use union find to count components and extra edges. Extra edges can be used to bridge disconnected components.',
  tags: ['union find', 'graph', 'connected components'],

  code: {
    pseudocode: `function makeConnected(n, connections):
  if len(connections) < n - 1: return -1
  parent = [0..n-1]
  extras = 0
  components = n
  for each [u, v] in connections:
    pu, pv = find(u), find(v)
    if pu == pv:
      extras += 1  // redundant edge
    else:
      union(pu, pv)
      components -= 1
  return components - 1`,

    python: `def makeConnected(n, connections):
    if len(connections) < n - 1:
        return -1
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    extras = 0
    components = n
    for u, v in connections:
        pu, pv = find(u), find(v)
        if pu == pv:
            extras += 1
        else:
            parent[pu] = pv
            components -= 1
    return components - 1`,

    javascript: `function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  const parent = Array.from({length: n}, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let extras = 0, components = n;
  for (const [u, v] of connections) {
    const pu = find(u), pv = find(v);
    if (pu === pv) {
      extras++;
    } else {
      parent[pu] = pv;
      components--;
    }
  }
  return components - 1;
}`,

    java: `public int makeConnected(int n, int[][] connections) {
    if (connections.length < n - 1) return -1;
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int extras = 0, components = n;
    for (int[] c : connections) {
        int pu = find(parent, c[0]), pv = find(parent, c[1]);
        if (pu == pv) extras++;
        else { parent[pu] = pv; components--; }
    }
    return components - 1;
}`,
  },

  defaultInput: {
    n: 6,
    connections: [[0, 1], [0, 2], [0, 3], [1, 2], [4, 5]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Computers',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Total number of computers (nodes)',
    },
    {
      name: 'connections',
      label: 'Connections',
      type: 'array',
      defaultValue: [[0, 1], [0, 2], [0, 3], [1, 2], [4, 5]],
      placeholder: '[[0,1],[0,2]]',
      helperText: 'Pairs of connected computers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const connections = input.connections as number[][];
    const steps: AlgorithmStep[] = [];

    const makeViz = (par: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...par],
      highlights,
      labels,
    });

    if (connections.length < n - 1) {
      steps.push({
        line: 2,
        explanation: `Only ${connections.length} connections for ${n} computers. Need at least ${n - 1}. Return -1.`,
        variables: { connections: connections.length, needed: n - 1, result: -1 },
        visualization: makeViz(Array.from({ length: n }, (_, i) => i), {}, {}),
      });
      return steps;
    }

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    let extras = 0;
    let components = n;

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    steps.push({
      line: 3,
      explanation: `Initialize parent array. ${n} computers, each is its own component. Total components = ${n}.`,
      variables: { n, components, extras },
      visualization: makeViz([...parent], {}, Object.fromEntries(parent.map((_, i) => [i, String(i)]))),
    });

    for (const [u, v] of connections) {
      const pu = find(u);
      const pv = find(v);

      steps.push({
        line: 6,
        explanation: `Edge [${u}-${v}]: find(${u})=${pu}, find(${v})=${pv}. ${pu === pv ? 'Same component - extra edge!' : 'Different components - union them.'}`,
        variables: { u, v, findU: pu, findV: pv, extras, components },
        visualization: makeViz([...parent], { [u]: 'active', [v]: 'comparing' }, { [pu]: 'root-U', [pv]: 'root-V' }),
      });

      if (pu === pv) {
        extras++;
        steps.push({
          line: 9,
          explanation: `Nodes ${u} and ${v} already connected. extras = ${extras}.`,
          variables: { extras, components },
          visualization: makeViz([...parent], { [u]: 'found', [v]: 'found' }, { [u]: 'extra', [v]: 'extra' }),
        });
      } else {
        parent[pu] = pv;
        components--;
        steps.push({
          line: 11,
          explanation: `Union ${u} and ${v}. components reduced to ${components}.`,
          variables: { extras, components, 'parent[pu]': pv },
          visualization: makeViz([...parent], { [u]: 'visited', [v]: 'visited', [pu]: 'active' }, { [pu]: `-> ${pv}` }),
        });
      }
    }

    const result = components - 1;
    steps.push({
      line: 12,
      explanation: `${components} components remain. Need ${result} cable move(s) to connect them all.`,
      variables: { components, extras, result },
      visualization: makeViz([...parent], {}, Object.fromEntries(parent.map((v, i) => [i, `par:${v}`]))),
    });

    return steps;
  },
};

export default numberOfOperationsToMakeNetworkConnected;
