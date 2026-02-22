import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const evaluateDivision: AlgorithmDefinition = {
  id: 'evaluate-division',
  title: 'Evaluate Division',
  leetcodeNumber: 399,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given equations like A/B = k and queries like C/D = ?, find each query result. Build a weighted directed graph where an edge A→B has weight k and B→A has weight 1/k. Answer each query using DFS/BFS from source to target, multiplying edge weights along the path.',
  tags: ['Graph', 'DFS', 'BFS', 'Weighted Graph'],
  code: {
    pseudocode: `function calcEquation(equations, values, queries):
  graph = build weighted directed graph
  for each [A, B], value in zip(equations, values):
    graph[A][B] = value
    graph[B][A] = 1/value
  for each [C, D] in queries:
    if C or D not in graph: result = -1
    elif C == D: result = 1
    else: result = dfs(graph, C, D, visited={})
  return results

function dfs(graph, src, dst, visited):
  if dst in graph[src]: return graph[src][dst]
  for neighbor, weight in graph[src]:
    if neighbor not in visited:
      visited.add(neighbor)
      val = dfs(graph, neighbor, dst, visited)
      if val != -1: return weight * val
  return -1`,
    python: `def calcEquation(equations, values, queries):
    graph = defaultdict(dict)
    for (A, B), val in zip(equations, values):
        graph[A][B] = val
        graph[B][A] = 1/val
    def dfs(src, dst, visited):
        if dst in graph[src]: return graph[src][dst]
        for nb, w in graph[src].items():
            if nb not in visited:
                visited.add(nb)
                val = dfs(nb, dst, visited)
                if val != -1: return w * val
        return -1
    results = []
    for C, D in queries:
        if C not in graph or D not in graph: results.append(-1)
        elif C == D: results.append(1.0)
        else: results.append(dfs(C, D, {C}))
    return results`,
    javascript: `function calcEquation(equations, values, queries) {
  const graph = new Map();
  const addEdge = (a, b, w) => { if(!graph.has(a)) graph.set(a,new Map()); graph.get(a).set(b,w); };
  for (let i=0;i<equations.length;i++) {
    const [A,B]=equations[i]; addEdge(A,B,values[i]); addEdge(B,A,1/values[i]);
  }
  function dfs(src, dst, visited) {
    if (!graph.has(src)) return -1;
    if (graph.get(src).has(dst)) return graph.get(src).get(dst);
    for (const [nb, w] of graph.get(src)) {
      if (!visited.has(nb)) {
        visited.add(nb);
        const val = dfs(nb, dst, visited);
        if (val !== -1) return w * val;
      }
    }
    return -1;
  }
  return queries.map(([C,D]) => {
    if (!graph.has(C)||!graph.has(D)) return -1;
    if (C===D) return 1;
    return dfs(C, D, new Set([C]));
  });
}`,
    java: `public double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
    Map<String,Map<String,Double>> graph=new HashMap<>();
    for(int i=0;i<equations.size();i++){String A=equations.get(i).get(0),B=equations.get(i).get(1);double v=values[i];graph.computeIfAbsent(A,k->new HashMap<>()).put(B,v);graph.computeIfAbsent(B,k->new HashMap<>()).put(A,1/v);}
    double[]res=new double[queries.size()];
    for(int i=0;i<queries.size();i++){String C=queries.get(i).get(0),D=queries.get(i).get(1);if(!graph.containsKey(C)||!graph.containsKey(D)) res[i]=-1;else if(C.equals(D)) res[i]=1;else res[i]=dfs(graph,C,D,new HashSet<>());}
    return res;
}
double dfs(Map<String,Map<String,Double>> g,String src,String dst,Set<String> vis){
    if(g.get(src).containsKey(dst)) return g.get(src).get(dst);
    for(Map.Entry<String,Double> e:g.get(src).entrySet()){if(vis.add(e.getKey())){double v=dfs(g,e.getKey(),dst,vis);if(v!=-1) return e.getValue()*v;}}
    return -1;
}`,
  },
  defaultInput: {
    equations: [['a', 'b'], ['b', 'c']],
    values: [2.0, 3.0],
    queries: [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a']],
  },
  inputFields: [
    {
      name: 'equations',
      label: 'Equations [[A,B],...]',
      type: 'array',
      defaultValue: [['a', 'b'], ['b', 'c']],
      placeholder: '[["a","b"],["b","c"]]',
      helperText: 'Each pair [A,B] means A/B = value',
    },
    {
      name: 'values',
      label: 'Values',
      type: 'array',
      defaultValue: [2.0, 3.0],
      placeholder: '[2.0, 3.0]',
      helperText: 'Division results for each equation',
    },
    {
      name: 'queries',
      label: 'Queries [[C,D],...]',
      type: 'array',
      defaultValue: [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a']],
      placeholder: '[["a","c"],["b","a"]]',
      helperText: 'Pairs to evaluate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const equations = input.equations as string[][];
    const values = input.values as number[];
    const queries = input.queries as string[][];
    const steps: AlgorithmStep[] = [];

    // Build graph
    const graph = new Map<string, Map<string, number>>();
    const addEdge = (a: string, b: string, w: number) => {
      if (!graph.has(a)) graph.set(a, new Map());
      graph.get(a)!.set(b, w);
    };
    for (let i = 0; i < equations.length; i++) {
      const [A, B] = equations[i];
      addEdge(A, B, values[i]);
      addEdge(B, A, 1 / values[i]);
    }

    const allNodes = [...graph.keys()].sort();
    const nodeToIdx: Record<string, number> = {};
    allNodes.forEach((node, i) => { nodeToIdx[node] = i; });
    const n = allNodes.length;

    const results: number[] = new Array(queries.length).fill(-1);

    function makeViz(
      highlights: Record<number, string>,
      queryIdx: number,
      src: string,
      dst: string,
      result: number | null
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) labels[i] = allNodes[i];
      return {
        type: 'array',
        array: new Array(n).fill(0),
        highlights,
        labels,
        auxData: {
          label: 'Division Graph DFS',
          entries: [
            { key: 'Query', value: `${src} / ${dst}` },
            { key: 'Query #', value: `${queryIdx + 1} / ${queries.length}` },
            { key: 'Result', value: result !== null ? (result === -1 ? '-1' : result.toFixed(5)) : '...' },
            { key: 'All Results', value: results.map(r => r === -1 ? '-1' : r.toFixed(2)).join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build weighted directed graph from ${equations.length} equations. Each edge A→B has weight A/B, B→A has weight B/A.`,
      variables: { nodes: allNodes },
      visualization: makeViz({}, 0, '', '', null),
    });

    function dfs(
      src: string,
      dst: string,
      visited: Set<string>,
      product: number
    ): number {
      if (!graph.has(src)) return -1;
      if (graph.get(src)!.has(dst)) return product * graph.get(src)!.get(dst)!;
      for (const [nb, w] of graph.get(src)!) {
        if (!visited.has(nb)) {
          visited.add(nb);
          const val = dfs(nb, dst, visited, product * w);
          if (val !== -1) return val;
        }
      }
      return -1;
    }

    for (let qi = 0; qi < queries.length; qi++) {
      const [C, D] = queries[qi];
      let res: number;

      const hlSrc: Record<number, string> = {};
      const hlDst: Record<number, string> = {};
      if (nodeToIdx[C] !== undefined) hlSrc[nodeToIdx[C]] = 'active';
      if (nodeToIdx[D] !== undefined) hlDst[nodeToIdx[D]] = 'pointer';

      steps.push({
        line: 9,
        explanation: `Query ${qi + 1}: ${C} / ${D}. DFS from '${C}' to '${D}' multiplying edge weights.`,
        variables: { src: C, dst: D },
        visualization: makeViz({ ...hlSrc, ...hlDst }, qi, C, D, null),
      });

      if (!graph.has(C) || !graph.has(D)) {
        res = -1;
        steps.push({
          line: 10,
          explanation: `'${C}' or '${D}' not in graph. Cannot evaluate — return -1.`,
          variables: { src: C, dst: D, result: -1 },
          visualization: makeViz({ ...hlSrc, ...hlDst }, qi, C, D, -1),
        });
      } else if (C === D) {
        res = 1;
        steps.push({
          line: 11,
          explanation: `Source equals destination ('${C}'/'${D}'). Any value divided by itself is 1.0.`,
          variables: { result: 1 },
          visualization: makeViz({ [nodeToIdx[C]]: 'found' }, qi, C, D, 1),
        });
      } else {
        res = dfs(C, D, new Set([C]), 1);
        const hl: Record<number, string> = {};
        if (nodeToIdx[C] !== undefined) hl[nodeToIdx[C]] = res !== -1 ? 'found' : 'mismatch';
        if (nodeToIdx[D] !== undefined) hl[nodeToIdx[D]] = res !== -1 ? 'found' : 'mismatch';
        steps.push({
          line: 17,
          explanation: `DFS ${C}→${D} result: ${res === -1 ? 'no path (-1)' : res.toFixed(5)}.`,
          variables: { src: C, dst: D, result: res },
          visualization: makeViz(hl, qi, C, D, res),
        });
      }

      results[qi] = res;
    }

    steps.push({
      line: 18,
      explanation: `All ${queries.length} queries evaluated: [${results.map(r => r === -1 ? '-1' : r.toFixed(5)).join(', ')}].`,
      variables: { results: [...results] },
      visualization: makeViz(
        Object.fromEntries(allNodes.map((_, i) => [i, 'found'])),
        queries.length - 1,
        queries[queries.length - 1][0],
        queries[queries.length - 1][1],
        results[results.length - 1]
      ),
    });

    return steps;
  },
};

export default evaluateDivision;
