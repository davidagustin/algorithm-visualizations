import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfVerticesToReachAll: AlgorithmDefinition = {
  id: 'minimum-number-of-vertices-to-reach-all',
  title: 'Minimum Number of Vertices to Reach All Nodes',
  leetcodeNumber: 1557,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a DAG, find the smallest set of vertices from which all nodes are reachable. The key insight: any node with in-degree > 0 can be reached from some other node, so it doesn\'t need to be in the starting set. Only nodes with in-degree 0 cannot be reached from any other node, so they must all be in the starting set.',
  tags: ['Graph', 'Topological Sort', 'In-Degree'],
  code: {
    pseudocode: `function findSmallestSetOfVertices(n, edges):
  inDegree = [0] * n
  for each [u, v] in edges:
    inDegree[v] += 1
  result = []
  for i in 0..n-1:
    if inDegree[i] == 0:
      result.append(i)
  return result`,
    python: `def findSmallestSetOfVertices(n, edges):
    inDegree = [0] * n
    for u, v in edges:
        inDegree[v] += 1
    return [i for i in range(n) if inDegree[i] == 0]`,
    javascript: `function findSmallestSetOfVertices(n, edges) {
  const inDegree = new Array(n).fill(0);
  for (const [u, v] of edges) inDegree[v]++;
  return inDegree.map((d,i) => d===0 ? i : -1).filter(x => x !== -1);
}`,
    java: `public List<Integer> findSmallestSetOfVertices(int n, List<List<Integer>> edges) {
    int[] inDegree = new int[n];
    for (List<Integer> e : edges) inDegree.get(e.get(1))++;
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) res.add(i);
    return res;
}`,
  },
  defaultInput: {
    n: 6,
    edges: [[0, 1], [0, 2], [2, 5], [3, 4], [3, 2]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Nodes labeled 0 to n-1',
    },
    {
      name: 'edges',
      label: 'Directed Edges [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [0, 2], [2, 5], [3, 4], [3, 2]],
      placeholder: '[[0,1],[0,2],[2,5],[3,4],[3,2]]',
      helperText: 'Directed edges in the DAG',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      result: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...inDegree],
        highlights,
        labels,
        auxData: {
          label: 'Min Vertices to Reach All',
          entries: [
            { key: 'Starting Set', value: result.length > 0 ? result.join(', ') : 'computing...' },
            { key: 'In-Degree 0', value: inDegree.filter(d => d === 0).length + ' nodes' },
            { key: 'Insight', value: 'Only in-degree=0 nodes needed' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `DAG with ${n} nodes. Initialize in-degree array to all zeros. Process ${edges.length} edges.`,
      variables: { n, edges: edges.length },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:0`])),
        []
      ),
    });

    for (const [u, v] of edges) {
      inDegree[v]++;

      steps.push({
        line: 3,
        explanation: `Edge ${u}->${v}: in-degree[${v}]=${inDegree[v]}. Node ${v} can be reached from ${u}, so it doesn't need to be a start.`,
        variables: { u, v, inDegree: [...inDegree] },
        visualization: makeViz(
          { [u]: 'active', [v]: 'comparing' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:${inDegree[i]}`])),
          []
        ),
      });
    }

    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) {
        result.push(i);

        steps.push({
          line: 6,
          explanation: `Node ${i} has in-degree 0: no edge points to it. It MUST be in the starting set.`,
          variables: { node: i, result: [...result] },
          visualization: makeViz(
            { ...Object.fromEntries(result.map(r => [r, 'found'])), [i]: 'active' },
            Object.fromEntries(Array.from({ length: n }, (_, j) => [j, `n${j}:${inDegree[j]}`])),
            [...result]
          ),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `Node ${i} has in-degree ${inDegree[i]}: reachable from other nodes. NOT needed in starting set.`,
          variables: { node: i, inDegree: inDegree[i] },
          visualization: makeViz(
            { ...Object.fromEntries(result.map(r => [r, 'found'])), [i]: 'visited' },
            Object.fromEntries(Array.from({ length: n }, (_, j) => [j, `n${j}:${inDegree[j]}`])),
            [...result]
          ),
        });
      }
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = result.includes(i) ? 'found' : 'sorted';
    }

    steps.push({
      line: 8,
      explanation: `Minimum starting set: [${result.join(', ')}]. These ${result.length} nodes with in-degree 0 can reach all ${n} nodes.`,
      variables: { result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, result.includes(i) ? 'START' : `n${i}`])),
        [...result]
      ),
    });

    return steps;
  },
};

export default minimumNumberOfVerticesToReachAll;
