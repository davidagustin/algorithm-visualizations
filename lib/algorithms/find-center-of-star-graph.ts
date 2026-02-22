import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findCenterOfStarGraph: AlgorithmDefinition = {
  id: 'find-center-of-star-graph',
  title: 'Find Center of Star Graph',
  leetcodeNumber: 1791,
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Given a star graph with n nodes and n-1 edges, find the center node. In a star graph, the center node is connected to every other node. The center node appears in every edge, so simply check which node appears in both the first and second edge.',
  tags: ['graph', 'degree', 'star graph', 'center'],

  code: {
    pseudocode: `function findCenter(edges):
  // The center appears in every edge
  // Check if edges[0][0] appears in edges[1]
  if edges[0][0] == edges[1][0] or edges[0][0] == edges[1][1]:
    return edges[0][0]
  return edges[0][1]`,

    python: `def findCenter(edges):
    if edges[0][0] == edges[1][0] or edges[0][0] == edges[1][1]:
        return edges[0][0]
    return edges[0][1]`,

    javascript: `function findCenter(edges) {
  if (edges[0][0] === edges[1][0] || edges[0][0] === edges[1][1]) {
    return edges[0][0];
  }
  return edges[0][1];
}`,

    java: `public int findCenter(int[][] edges) {
    if (edges[0][0] == edges[1][0] || edges[0][0] == edges[1][1]) {
        return edges[0][0];
    }
    return edges[0][1];
}`,
  },

  defaultInput: {
    edgesFlat: [1, 2, 2, 3, 4, 2, 5, 2],
  },

  inputFields: [
    {
      name: 'edgesFlat',
      label: 'Edges (flattened pairs)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 4, 2, 5, 2],
      placeholder: '1,2,2,3,4,2,5,2',
      helperText: 'Star graph edge pairs [u1,v1,u2,v2,...]. Node 2 is the center.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edgesFlat = input.edgesFlat as number[];
    const steps: AlgorithmStep[] = [];

    const edges: [number, number][] = [];
    for (let i = 0; i + 1 < edgesFlat.length; i += 2) {
      edges.push([edgesFlat[i], edgesFlat[i + 1]]);
    }

    if (edges.length === 0) return steps;

    // Count degree to find the actual center for visualization
    const degree: Record<number, number> = {};
    const nodeSet = new Set<number>();
    for (const [u, v] of edges) {
      degree[u] = (degree[u] || 0) + 1;
      degree[v] = (degree[v] || 0) + 1;
      nodeSet.add(u);
      nodeSet.add(v);
    }

    const nodes = [...nodeSet].sort((a, b) => a - b);
    const nodeIdx: Record<number, number> = {};
    nodes.forEach((node, i) => { nodeIdx[node] = i; });

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nodes,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Star graph with ${edges.length} edges. The center appears in EVERY edge. Nodes: [${nodes.join(', ')}].`,
      variables: { nodes: nodes.join(','), edgeCount: edges.length },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 2,
      explanation: `Key insight: the center must appear in both edge[0] and edge[1]. Edge[0]=[${edges[0][0]},${edges[0][1]}], Edge[1]=[${edges[1][0]},${edges[1][1]}].`,
      variables: { edge0: edges[0], edge1: edges[1] },
      visualization: makeViz(
        { [nodeIdx[edges[0][0]]]: 'active', [nodeIdx[edges[0][1]]]: 'active' },
        { [nodeIdx[edges[0][0]]]: 'e0.0', [nodeIdx[edges[0][1]]]: 'e0.1' }
      ),
    });

    const e00 = edges[0][0];
    const e01 = edges[0][1];
    const e10 = edges[1][0];
    const e11 = edges[1][1];

    steps.push({
      line: 3,
      explanation: `Check if edges[0][0]=${e00} appears in edge[1]=[${e10},${e11}].`,
      variables: { 'edges[0][0]': e00, 'edges[1]': [e10, e11] },
      visualization: makeViz(
        { [nodeIdx[e00]]: 'comparing', [nodeIdx[e10]]: 'comparing', [nodeIdx[e11]]: 'comparing' },
        { [nodeIdx[e00]]: `${e00}?`, [nodeIdx[e10]]: `${e10}`, [nodeIdx[e11]]: `${e11}` }
      ),
    });

    let center: number;
    if (e00 === e10 || e00 === e11) {
      center = e00;
      steps.push({
        line: 4,
        explanation: `Yes! edges[0][0]=${e00} is in edge[1]. The center is node ${center}.`,
        variables: { center, reason: `${e00} appears in both edge[0] and edge[1]` },
        visualization: makeViz(
          { [nodeIdx[center]]: 'found' },
          { [nodeIdx[center]]: 'CENTER' }
        ),
      });
    } else {
      center = e01;
      steps.push({
        line: 5,
        explanation: `No. edges[0][0]=${e00} is NOT in edge[1]. So edges[0][1]=${e01} must be the center.`,
        variables: { center, reason: `${e01} appears in both edge[0] and edge[1]` },
        visualization: makeViz(
          { [nodeIdx[center]]: 'found' },
          { [nodeIdx[center]]: 'CENTER' }
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `Center node is ${center}. It connects to all ${edges.length} other nodes (degree=${degree[center]}).`,
      variables: { center, degree: degree[center] },
      visualization: makeViz(
        nodes.reduce((acc, node, i) => {
          acc[i] = node === center ? 'sorted' : 'visited';
          return acc;
        }, {} as Record<number, string>),
        { [nodeIdx[center]]: `center=${center}` }
      ),
    });

    return steps;
  },
};

export default findCenterOfStarGraph;
