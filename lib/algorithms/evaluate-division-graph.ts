import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const evaluateDivisionGraph: AlgorithmDefinition = {
  id: 'evaluate-division-graph',
  title: 'Evaluate Division (Graph)',
  leetcodeNumber: 399,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given equations like A/B = k, evaluate division queries. Build a weighted directed graph where edge A->B has weight k and B->A has weight 1/k. For each query, DFS from the source to the target, multiplying edge weights along the path. Return -1 if no path exists.',
  tags: ['dfs', 'graph', 'weighted graph', 'bfs'],

  code: {
    pseudocode: `function calcEquation(equations, values, queries):
  graph = build weighted directed graph
  for each (A, B, k) in equations:
    graph[A][B] = k
    graph[B][A] = 1/k

  dfs(src, dst, visited):
    if src not in graph: return -1
    if src == dst: return 1.0
    visited.add(src)
    for (neighbor, weight) in graph[src]:
      if neighbor not in visited:
        result = dfs(neighbor, dst, visited)
        if result != -1: return weight * result
    return -1

  for each query (C, D):
    answer = dfs(C, D, {})`,

    python: `from collections import defaultdict

def calcEquation(equations, values, queries):
    graph = defaultdict(dict)
    for (A, B), k in zip(equations, values):
        graph[A][B] = k
        graph[B][A] = 1 / k

    def dfs(src, dst, visited):
        if src not in graph: return -1.0
        if src == dst: return 1.0
        visited.add(src)
        for neighbor, weight in graph[src].items():
            if neighbor not in visited:
                result = dfs(neighbor, dst, visited)
                if result != -1.0:
                    return weight * result
        return -1.0

    return [dfs(C, D, set()) for C, D in queries]`,

    javascript: `function calcEquation(equations, values, queries) {
  const graph = {};
  for (let i = 0; i < equations.length; i++) {
    const [A, B] = equations[i], k = values[i];
    if (!graph[A]) graph[A] = {};
    if (!graph[B]) graph[B] = {};
    graph[A][B] = k;
    graph[B][A] = 1 / k;
  }
  function dfs(src, dst, visited) {
    if (!graph[src]) return -1;
    if (src === dst) return 1;
    visited.add(src);
    for (const [nei, w] of Object.entries(graph[src])) {
      if (!visited.has(nei)) {
        const res = dfs(nei, dst, visited);
        if (res !== -1) return w * res;
      }
    }
    return -1;
  }
  return queries.map(([C, D]) => dfs(C, D, new Set()));
}`,

    java: `public double[] calcEquation(List<List<String>> eq, double[] vals, List<List<String>> q) {
    Map<String, Map<String, Double>> graph = new HashMap<>();
    for (int i = 0; i < eq.size(); i++) {
        String A = eq.get(i).get(0), B = eq.get(i).get(1);
        graph.computeIfAbsent(A, k->new HashMap<>()).put(B, vals[i]);
        graph.computeIfAbsent(B, k->new HashMap<>()).put(A, 1.0/vals[i]);
    }
    double[] res = new double[q.size()];
    for (int i = 0; i < q.size(); i++) {
        res[i] = dfs(graph, q.get(i).get(0), q.get(i).get(1), new HashSet<>());
    }
    return res;
}
double dfs(Map<String,Map<String,Double>> g, String s, String d, Set<String> vis) {
    if(!g.containsKey(s)) return -1;
    if(s.equals(d)) return 1;
    vis.add(s);
    for(Map.Entry<String,Double> e:g.get(s).entrySet()){
        if(!vis.contains(e.getKey())){
            double r=dfs(g,e.getKey(),d,vis);
            if(r!=-1) return e.getValue()*r;
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    equations: [['a', 'b'], ['b', 'c']],
    values: [2.0, 3.0],
    queries: [['a', 'c'], ['b', 'a'], ['a', 'e'], ['a', 'a'], ['x', 'x']],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Equation Values',
      type: 'array',
      defaultValue: [2.0, 3.0],
      placeholder: '2.0,3.0',
      helperText: 'k values for each equation A/B=k',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const equations = input.equations as string[][];
    const values = input.values as number[];
    const queries = input.queries as string[][];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Build weighted directed graph from ${equations.length} equation(s). Each A/B=k gives edge A->B with weight k and B->A with weight 1/k.`,
      variables: { equations: equations.length, queries: queries.length },
      visualization: {
        type: 'array',
        array: values,
        highlights: Object.fromEntries(values.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(equations.map(([a, b], i) => [i, `${a}/${b}=${values[i]}`])),
      } as ArrayVisualization,
    });

    const graph: Record<string, Record<string, number>> = {};
    for (let i = 0; i < equations.length; i++) {
      const [A, B] = equations[i];
      const k = values[i];
      if (!graph[A]) graph[A] = {};
      if (!graph[B]) graph[B] = {};
      graph[A][B] = k;
      graph[B][A] = 1 / k;
      steps.push({
        line: 3,
        explanation: `Add edges: ${A}->${B} = ${k}, ${B}->${A} = ${(1 / k).toFixed(4)}.`,
        variables: { A, B, k, reverse: 1 / k },
        visualization: {
          type: 'array',
          array: values.slice(0, i + 1),
          highlights: { [i]: 'comparing' },
          labels: { [i]: `${A}/${B}` },
        } as ArrayVisualization,
      });
    }

    function dfs(src: string, dst: string, visited: Set<string>): number {
      if (!graph[src]) return -1;
      if (src === dst) return 1;
      visited.add(src);
      for (const [nei, w] of Object.entries(graph[src])) {
        if (!visited.has(nei)) {
          const res = dfs(nei, dst, visited);
          if (res !== -1) return w * res;
        }
      }
      return -1;
    }

    const answers: number[] = [];
    for (const [C, D] of queries) {
      const ans = dfs(C, D, new Set<string>());
      answers.push(ans);
      steps.push({
        line: 10,
        explanation: `Query ${C}/${D}: DFS finds path with result = ${ans === -1 ? 'no path (-1)' : ans.toFixed(4)}.`,
        variables: { query: `${C}/${D}`, result: ans },
        visualization: {
          type: 'array',
          array: answers,
          highlights: { [answers.length - 1]: ans === -1 ? 'mismatch' : 'found' },
          labels: { [answers.length - 1]: `${C}/${D}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 12,
      explanation: `All ${queries.length} queries answered: [${answers.map(a => a === -1 ? -1 : a.toFixed(2)).join(', ')}].`,
      variables: { answers: answers.map(a => a === -1 ? -1 : parseFloat(a.toFixed(4))).join(',') },
      visualization: {
        type: 'array',
        array: answers.map(a => parseFloat(a.toFixed(2))),
        highlights: Object.fromEntries(answers.map((a, i) => [i, a === -1 ? 'mismatch' : 'found'])),
        labels: Object.fromEntries(queries.map(([c, d], i) => [i, `${c}/${d}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default evaluateDivisionGraph;
