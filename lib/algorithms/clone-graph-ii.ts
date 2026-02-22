import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cloneGraphIi: AlgorithmDefinition = {
  id: 'clone-graph-ii',
  title: 'Clone Graph (BFS)',
  leetcodeNumber: 133,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Uses BFS to traverse all nodes and build clones level by level, mapping original nodes to their clones using a hash map.',
  tags: ['graph', 'bfs', 'hash map', 'clone', 'deep copy'],

  code: {
    pseudocode: `function cloneGraph(node):
  if node is null: return null
  map = {}
  queue = [node]
  map[node] = new Node(node.val)
  while queue not empty:
    curr = queue.dequeue()
    for each neighbor of curr:
      if neighbor not in map:
        map[neighbor] = new Node(neighbor.val)
        queue.enqueue(neighbor)
      map[curr].neighbors.add(map[neighbor])
  return map[node]`,

    python: `def cloneGraph(node):
    if not node:
        return None
    mp = {}
    queue = deque([node])
    mp[node] = Node(node.val)
    while queue:
        curr = queue.popleft()
        for neighbor in curr.neighbors:
            if neighbor not in mp:
                mp[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            mp[curr].neighbors.append(mp[neighbor])
    return mp[node]`,

    javascript: `function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  const queue = [node];
  map.set(node, new Node(node.val));
  while (queue.length) {
    const curr = queue.shift();
    for (const neighbor of curr.neighbors) {
      if (!map.has(neighbor)) {
        map.set(neighbor, new Node(neighbor.val));
        queue.push(neighbor);
      }
      map.get(curr).neighbors.push(map.get(neighbor));
    }
  }
  return map.get(node);
}`,

    java: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> map = new HashMap<>();
    Queue<Node> queue = new LinkedList<>();
    queue.add(node);
    map.put(node, new Node(node.val));
    while (!queue.isEmpty()) {
        Node curr = queue.poll();
        for (Node neighbor : curr.neighbors) {
            if (!map.containsKey(neighbor)) {
                map.put(neighbor, new Node(neighbor.val));
                queue.add(neighbor);
            }
            map.get(curr).neighbors.add(map.get(neighbor));
        }
    }
    return map.get(node);
}`,
  },

  defaultInput: {
    nodeCount: 4,
    edges: [1, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'nodeCount',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Nodes labeled 1 to N in a cycle graph',
    },
    {
      name: 'edges',
      label: 'Node Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Values of nodes 1..N in order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodeCount = input.nodeCount as number;
    const steps: AlgorithmStep[] = [];

    // Build adjacency for a cycle graph: 1-2-3-...-N-1
    // Represent state as array of node indices (0-based internally)
    const n = Math.max(1, Math.min(nodeCount, 6));
    const nodeVals = Array.from({ length: n }, (_, i) => i + 1);

    // Build cycle adjacency list
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      adj[i].push(next);
      adj[next].push(i);
    }

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: nodeVals,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start BFS clone from node 1. Graph has ${n} nodes arranged in a cycle.`,
      variables: { queue: '[1]', cloned: '{}', current: 'node 1' },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }),
    });

    const visited = new Set<number>();
    const queue: number[] = [0];
    visited.add(0);
    const cloneMap: Record<number, number> = { 0: nodeVals[0] };

    steps.push({
      line: 4,
      explanation: `Initialize BFS queue with node 1. Create clone of node 1.`,
      variables: { queue: JSON.stringify([0]), cloneMap: JSON.stringify(cloneMap) },
      visualization: makeViz({ 0: 'current' }, { 0: 'queued' }),
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[curr] = 'active';
      labels[curr] = 'curr';

      steps.push({
        line: 6,
        explanation: `Dequeue node ${curr + 1}. Process its neighbors: [${adj[curr].map(x => x + 1).join(', ')}].`,
        variables: { current: curr + 1, queue: JSON.stringify(queue.map(x => x + 1)), visited: JSON.stringify([...visited].map(x => x + 1)) },
        visualization: makeViz(highlights, labels),
      });

      for (const neighbor of adj[curr]) {
        const nh: Record<number, string> = { ...highlights };
        const nl: Record<number, string> = { ...labels };
        nh[neighbor] = 'comparing';
        nl[neighbor] = 'nbr';

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          cloneMap[neighbor] = nodeVals[neighbor];
          nh[neighbor] = 'found';
          nl[neighbor] = 'new clone';

          steps.push({
            line: 8,
            explanation: `Neighbor ${neighbor + 1} not yet cloned. Create clone of node ${neighbor + 1} and enqueue it.`,
            variables: { neighbor: neighbor + 1, cloneCreated: nodeVals[neighbor], queue: JSON.stringify(queue.map(x => x + 1)) },
            visualization: makeViz(nh, nl),
          });
        } else {
          steps.push({
            line: 10,
            explanation: `Neighbor ${neighbor + 1} already cloned. Link clone of node ${curr + 1} to clone of node ${neighbor + 1}.`,
            variables: { neighbor: neighbor + 1, alreadyCloned: true },
            visualization: makeViz(nh, nl),
          });
        }
      }
    }

    const allHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) allHighlights[i] = 'sorted';

    steps.push({
      line: 11,
      explanation: `BFS complete. All ${n} nodes have been cloned with their edges. Return clone of start node.`,
      variables: { clonedNodes: n, result: 'clone of node 1' },
      visualization: makeViz(allHighlights, { 0: 'result' }),
    });

    return steps;
  },
};

export default cloneGraphIi;
