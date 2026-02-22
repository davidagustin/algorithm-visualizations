import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfVertices: AlgorithmDefinition = {
  id: 'minimum-number-of-vertices',
  title: 'Minimum Number of Vertices to Reach All Nodes',
  leetcodeNumber: 1557,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a directed acyclic graph (DAG) with n nodes and a list of directed edges, find the smallest set of vertices from which all nodes are reachable. Any node with in-degree 0 (no incoming edges) must be in the set because no other node can reach it.',
  tags: ['graph', 'dag', 'in-degree', 'directed graph'],

  code: {
    pseudocode: `function findSmallestSetOfVertices(n, edges):
  hasIncoming = set of all nodes with in-degree > 0
  for each [src, dst] in edges:
    hasIncoming.add(dst)
  result = []
  for node from 0 to n-1:
    if node not in hasIncoming:
      result.append(node)
  return result`,

    python: `def findSmallestSetOfVertices(n, edges):
    has_incoming = set()
    for src, dst in edges:
        has_incoming.add(dst)
    return [node for node in range(n) if node not in has_incoming]`,

    javascript: `function findSmallestSetOfVertices(n, edges) {
  const hasIncoming = new Set();
  for (const [src, dst] of edges) {
    hasIncoming.add(dst);
  }
  return Array.from({length: n}, (_, i) => i).filter(i => !hasIncoming.has(i));
}`,

    java: `public List<Integer> findSmallestSetOfVertices(int n, List<List<Integer>> edges) {
    Set<Integer> hasIncoming = new HashSet<>();
    for (List<Integer> edge : edges) {
        hasIncoming.add(edge.get(1));
    }
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (!hasIncoming.contains(i)) result.add(i);
    }
    return result;
}`,
  },

  defaultInput: {
    n: 6,
    edgesFlat: [0, 1, 0, 2, 2, 5, 3, 4, 4, 2],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'edgesFlat',
      label: 'Directed Edges (flattened pairs)',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 2, 5, 3, 4, 4, 2],
      placeholder: '0,1,0,2,2,5,3,4,4,2',
      helperText: 'Directed edge pairs [src1,dst1,src2,dst2,...]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edgesFlat = input.edgesFlat as number[];
    const steps: AlgorithmStep[] = [];

    const edges: [number, number][] = [];
    for (let i = 0; i + 1 < edgesFlat.length; i += 2) {
      edges.push([edgesFlat[i], edgesFlat[i + 1]]);
    }

    const nodes = Array.from({ length: n }, (_, i) => i);
    const hasIncoming = new Set<number>();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nodes,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find the minimum set of vertices to reach all nodes in a DAG with ${n} nodes and ${edges.length} directed edges. Nodes with no incoming edges MUST be in the result.`,
      variables: { n, edgeCount: edges.length },
      visualization: makeViz({}, {}),
    });

    for (const [src, dst] of edges) {
      hasIncoming.add(dst);
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[src] = 'active';
      lb[src] = 'src';
      hl[dst] = 'comparing';
      lb[dst] = 'has-in';

      steps.push({
        line: 3,
        explanation: `Edge ${src} -> ${dst}. Node ${dst} has an incoming edge. Mark it as reachable from another node.`,
        variables: { src, dst, hasIncoming: [...hasIncoming].join(',') },
        visualization: makeViz(hl, lb),
      });
    }

    steps.push({
      line: 4,
      explanation: `Nodes with incoming edges: {${[...hasIncoming].join(', ')}}. Nodes WITHOUT incoming edges must start our traversal.`,
      variables: { hasIncoming: [...hasIncoming] },
      visualization: makeViz(
        nodes.reduce((acc, node) => { acc[node] = hasIncoming.has(node) ? 'visited' : 'pointer'; return acc; }, {} as Record<number, string>),
        nodes.reduce((acc, node) => { acc[node] = hasIncoming.has(node) ? 'in>0' : 'in=0'; return acc; }, {} as Record<number, string>)
      ),
    });

    const result: number[] = [];
    for (let node = 0; node < n; node++) {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[node] = 'active';

      if (!hasIncoming.has(node)) {
        result.push(node);
        hl[node] = 'found';
        lb[node] = 'in result';

        steps.push({
          line: 7,
          explanation: `Node ${node} has no incoming edges. It must be in the starting set. Add to result.`,
          variables: { node, result: [...result] },
          visualization: makeViz(hl, lb),
        });
      } else {
        lb[node] = 'skip';
        steps.push({
          line: 6,
          explanation: `Node ${node} has incoming edges. It can be reached by another node. Skip.`,
          variables: { node, hasIncoming: true },
          visualization: makeViz(hl, lb),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (const r of result) finalHl[r] = 'sorted';

    steps.push({
      line: 8,
      explanation: `Minimum starting vertices: [${result.join(', ')}]. From these nodes, all ${n} nodes are reachable.`,
      variables: { result: result.join(','), size: result.length },
      visualization: makeViz(finalHl, result.reduce((acc, r) => { acc[r] = 'result'; return acc; }, {} as Record<number, string>)),
    });

    return steps;
  },
};

export default minimumNumberOfVertices;
