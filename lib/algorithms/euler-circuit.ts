import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const eulerCircuit: AlgorithmDefinition = {
  id: 'euler-circuit',
  title: 'Euler Circuit in Graph',
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'An Euler circuit is a path that visits every edge exactly once and returns to the starting vertex. A graph has an Euler circuit if and only if every vertex has even degree and the graph is connected. Uses Hierholzer algorithm: repeatedly extend the circuit and splice in sub-circuits at vertices with unused edges.',
  tags: ['Euler circuit', 'Hierholzer', 'DFS', 'edge traversal', 'graph'],

  code: {
    pseudocode: `function eulerCircuit(V, adj):
  // Check: all vertices have even degree
  for each u: if deg(u) % 2 != 0: return "No Euler circuit"
  circuit = []
  stack = [0]
  while stack not empty:
    u = stack.top
    if adj[u] not empty:
      v = adj[u].pop()
      remove reverse edge v->u
      stack.push(v)
    else:
      circuit.prepend(u)
      stack.pop()
  return circuit`,

    python: `def euler_circuit(V, edges):
    adj = [[] for _ in range(V)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    for u in range(V):
        if len(adj[u]) % 2 != 0: return []
    circuit = []
    stack = [0]
    while stack:
        u = stack[-1]
        if adj[u]:
            v = adj[u].pop()
            adj[v].remove(u)
            stack.append(v)
        else:
            circuit.append(stack.pop())
    return circuit[::-1]`,

    javascript: `function eulerCircuit(V, edges) {
  const adj = Array.from({length:V},()=>[]);
  for (const [u,v] of edges) { adj[u].push(v); adj[v].push(u); }
  for (let u=0;u<V;u++) if(adj[u].length%2!==0) return [];
  const circuit=[], stack=[0];
  while (stack.length) {
    const u=stack[stack.length-1];
    if (adj[u].length) {
      const v=adj[u].pop();
      const ri=adj[v].lastIndexOf(u);
      if(ri!==-1)adj[v].splice(ri,1);
      stack.push(v);
    } else {
      circuit.unshift(stack.pop());
    }
  }
  return circuit;
}`,

    java: `public int[] eulerCircuit(int V, int[][] edges) {
    List<Integer>[] adj = new List[V];
    for(int i=0;i<V;i++) adj[i]=new ArrayList<>();
    for(int[] e:edges){adj[e[0]].add(e[1]);adj[e[1]].add(e[0]);}
    for(int u=0;u<V;u++) if(adj[u].size()%2!=0) return new int[0];
    Deque<Integer> stack=new ArrayDeque<>();
    LinkedList<Integer> circuit=new LinkedList<>();
    stack.push(0);
    while(!stack.isEmpty()){
        int u=stack.peek();
        if(!adj[u].isEmpty()){
            int v=adj[u].remove(adj[u].size()-1);
            adj[v].remove(Integer.valueOf(u));
            stack.push(v);
        } else { circuit.addFirst(stack.pop()); }
    }
    return circuit.stream().mapToInt(x->x).toArray();
}`,
  },

  defaultInput: {
    V: 4,
    edges: [0, 1, 0, 2, 1, 2, 1, 3, 2, 3],
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
      name: 'edges',
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 1, 2, 1, 3, 2, 3],
      placeholder: '0,1,0,2,...',
      helperText: 'Flat list of undirected edge pairs. All degrees must be even.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const edgePairs: [number, number][] = [];
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) edgePairs.push([edgeFlat[i], edgeFlat[i + 1]]);

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (const [u, v] of edgePairs) { adj[u].push(v); adj[v].push(u); }

    const degrees = adj.map(a => a.length);
    const hasEuler = degrees.every(d => d % 2 === 0);

    const makeViz = (stack: number[], circuit: number[]): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: V }, (_, i) => adj[i].length),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          circuit.includes(i) ? 'sorted' : stack.includes(i) ? 'active' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `deg=${adj[i].length}`])),
    });

    steps.push({
      line: 1,
      explanation: `Check Euler circuit conditions. Degrees: [${degrees.join(', ')}]. All even: ${hasEuler}.`,
      variables: { degrees, hasEulerCircuit: hasEuler },
      visualization: makeViz([], []),
    });

    if (!hasEuler) {
      steps.push({
        line: 2,
        explanation: 'Not all vertices have even degree. Euler circuit does not exist.',
        variables: { oddDegreeVertices: degrees.map((d, i) => d % 2 !== 0 ? i : -1).filter(i => i !== -1) },
        visualization: makeViz([], []),
      });
      return steps;
    }

    const circuit: number[] = [];
    const stack: number[] = [0];

    steps.push({
      line: 5,
      explanation: 'All degrees are even. Starting Hierholzer algorithm from vertex 0.',
      variables: { start: 0 },
      visualization: makeViz([0], []),
    });

    while (stack.length > 0) {
      const u = stack[stack.length - 1];

      if (adj[u].length > 0) {
        const v = adj[u].pop()!;
        const ri = adj[v].lastIndexOf(u);
        if (ri !== -1) adj[v].splice(ri, 1);

        stack.push(v);
        steps.push({
          line: 8,
          explanation: `At vertex ${u}: traverse edge to ${v}. Stack: [${stack.join('->')}]. Remaining edges at ${u}: ${adj[u].length}.`,
          variables: { u, v, stackSize: stack.length },
          visualization: makeViz([...stack], [...circuit]),
        });
      } else {
        const popped = stack.pop()!;
        circuit.unshift(popped);
        steps.push({
          line: 11,
          explanation: `Vertex ${popped} has no more edges. Add to circuit front. Circuit: [${circuit.join('->')}].`,
          variables: { vertex: popped, circuit: [...circuit] },
          visualization: makeViz([...stack], [...circuit]),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Euler circuit found: [${circuit.join(' -> ')}]. Visits all ${edgePairs.length} edges exactly once.`,
      variables: { eulerCircuit: circuit, edgeCount: edgePairs.length },
      visualization: {
        type: 'array',
        array: circuit.slice(0, V),
        highlights: Object.fromEntries(circuit.slice(0, V).map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(circuit.slice(0, V).map((v, i) => [i, 'v' + String(v)])),
      },
    });

    return steps;
  },
};

export default eulerCircuit;
