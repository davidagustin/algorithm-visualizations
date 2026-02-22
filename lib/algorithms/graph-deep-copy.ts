import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const graphDeepCopy: AlgorithmDefinition = {
  id: 'graph-deep-copy',
  title: 'Graph Deep Copy',
  leetcodeNumber: 133,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors. We use BFS with a hash map to track original-to-clone mappings.',
  tags: ['Graph', 'BFS', 'DFS', 'Hash Map'],
  code: {
    pseudocode: `function cloneGraph(node):
  if node is null: return null
  visited = { node: new Node(node.val) }
  queue = [node]
  while queue is not empty:
    current = queue.dequeue()
    for neighbor in current.neighbors:
      if neighbor not in visited:
        visited[neighbor] = new Node(neighbor.val)
        queue.enqueue(neighbor)
      visited[current].neighbors.add(visited[neighbor])
  return visited[node]`,
    python: `def cloneGraph(node):
    if not node:
        return None
    visited = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        current = queue.popleft()
        for neighbor in current.neighbors:
            if neighbor not in visited:
                visited[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            visited[current].neighbors.append(visited[neighbor])
    return visited[node]`,
    javascript: `function cloneGraph(node) {
  if (!node) return null;
  const visited = new Map();
  visited.set(node, new Node(node.val));
  const queue = [node];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const neighbor of current.neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, new Node(neighbor.val));
        queue.push(neighbor);
      }
      visited.get(current).neighbors.push(visited.get(neighbor));
    }
  }
  return visited.get(node);
}`,
    java: `public Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> visited = new HashMap<>();
    visited.put(node, new Node(node.val));
    Queue<Node> queue = new LinkedList<>();
    queue.add(node);
    while (!queue.isEmpty()) {
        Node current = queue.poll();
        for (Node neighbor : current.neighbors) {
            if (!visited.containsKey(neighbor)) {
                visited.put(neighbor, new Node(neighbor.val));
                queue.add(neighbor);
            }
            visited.get(current).neighbors.add(visited.get(neighbor));
        }
    }
    return visited.get(node);
}`,
  },
  defaultInput: {
    adjList: [[2, 4], [1, 3], [2, 4], [1, 3]],
  },
  inputFields: [
    {
      name: 'adjList',
      label: 'Adjacency List',
      type: 'array',
      defaultValue: [[2, 4], [1, 3], [2, 4], [1, 3]],
      placeholder: '[[2,4],[1,3],[2,4],[1,3]]',
      helperText: 'Adjacency list where adjList[i] is neighbors of node i+1 (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const adjList = input.adjList as number[][];
    const n = adjList.length;
    const steps: AlgorithmStep[] = [];

    const nodeValues = Array.from({ length: n }, (_, i) => i + 1);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      cloned: Set<number>,
      queueNodes: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...nodeValues],
        highlights,
        labels,
        auxData: {
          label: 'Clone Status',
          entries: [
            { key: 'Cloned', value: cloned.size > 0 ? [...cloned].sort((a, b) => a - b).join(', ') : 'none' },
            { key: 'Queue', value: queueNodes.length > 0 ? queueNodes.join(', ') : 'empty' },
          ],
        },
      };
    }

    const cloned = new Set<number>();
    const queue: number[] = [];

    // Step: Start with node 1
    steps.push({
      line: 1,
      explanation: `Graph has ${n} nodes. Starting BFS clone from node 1.`,
      variables: { n, adjList },
      visualization: makeViz({}, {}, cloned, queue),
    });

    // Step: Clone start node and add to queue
    const startNode = 1;
    cloned.add(startNode);
    queue.push(startNode);
    steps.push({
      line: 3,
      explanation: `Clone node ${startNode} and add to queue. visited = {${startNode}: clone(${startNode})}.`,
      variables: { current: startNode, cloned: [...cloned], queue: [...queue] },
      visualization: makeViz(
        { [startNode - 1]: 'found' },
        { [startNode - 1]: 'start' },
        cloned,
        queue
      ),
    });

    // BFS loop
    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = adjList[current - 1];

      steps.push({
        line: 5,
        explanation: `Dequeue node ${current}. Processing its neighbors: [${neighbors.join(', ')}].`,
        variables: { current, neighbors, queue: [...queue] },
        visualization: makeViz(
          { [current - 1]: 'active' },
          { [current - 1]: 'cur' },
          cloned,
          queue
        ),
      });

      for (const neighbor of neighbors) {
        if (!cloned.has(neighbor)) {
          cloned.add(neighbor);
          queue.push(neighbor);

          const highlights: Record<number, string> = { [current - 1]: 'active', [neighbor - 1]: 'comparing' };
          steps.push({
            line: 8,
            explanation: `Node ${neighbor} not yet cloned. Create clone and enqueue it.`,
            variables: { current, neighbor, cloned: [...cloned], queue: [...queue] },
            visualization: makeViz(
              highlights,
              { [current - 1]: 'cur', [neighbor - 1]: 'new' },
              cloned,
              queue
            ),
          });
        } else {
          const highlights: Record<number, string> = { [current - 1]: 'active', [neighbor - 1]: 'visited' };
          steps.push({
            line: 10,
            explanation: `Node ${neighbor} already cloned. Link clone(${current}) -> clone(${neighbor}).`,
            variables: { current, neighbor },
            visualization: makeViz(
              highlights,
              { [current - 1]: 'cur', [neighbor - 1]: 'linked' },
              cloned,
              queue
            ),
          });
        }
      }
    }

    // Final step
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'found';
    steps.push({
      line: 11,
      explanation: `BFS complete. All ${n} nodes cloned. Return the clone of node 1.`,
      variables: { totalCloned: cloned.size },
      visualization: makeViz(finalHighlights, {}, cloned, []),
    });

    return steps;
  },
};

export default graphDeepCopy;
