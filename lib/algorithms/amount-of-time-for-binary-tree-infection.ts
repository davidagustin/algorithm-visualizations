import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const amountOfTimeForBinaryTreeInfection: AlgorithmDefinition = {
  id: 'amount-of-time-for-binary-tree-infection',
  title: 'Amount of Time for Binary Tree to Be Infected',
  leetcodeNumber: 2385,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree and a start node value, each minute the infection spreads from infected nodes to adjacent nodes (parent, left child, right child). Return the number of minutes needed to infect the entire tree. Convert the tree to an undirected graph, then BFS from the start node counting levels until all nodes are visited.',
  tags: ['tree', 'bfs', 'graph', 'dfs'],

  code: {
    pseudocode: `function amountOfTime(root, start):
  # Build adjacency list (convert tree to graph)
  graph = {}
  function buildGraph(node, parent):
    if node is null: return
    if parent: graph[node.val].add(parent.val); graph[parent.val].add(node.val)
    buildGraph(node.left, node)
    buildGraph(node.right, node)
  buildGraph(root, null)

  # BFS from start
  queue = [start]
  visited = {start}
  time = -1
  while queue not empty:
    time += 1
    next_queue = []
    for node in queue:
      for neighbor in graph[node]:
        if neighbor not in visited:
          visited.add(neighbor)
          next_queue.append(neighbor)
    queue = next_queue
  return time`,
    python: `def amountOfTime(root, start):
    from collections import defaultdict, deque
    graph = defaultdict(set)
    def build(node, parent):
        if not node: return
        if parent:
            graph[node.val].add(parent.val)
            graph[parent.val].add(node.val)
        build(node.left, node)
        build(node.right, node)
    build(root, None)
    q, visited, time = deque([start]), {start}, -1
    while q:
        time += 1
        for _ in range(len(q)):
            node = q.popleft()
            for nb in graph[node]:
                if nb not in visited:
                    visited.add(nb); q.append(nb)
    return time`,
    javascript: `function amountOfTime(root, start) {
  const graph = new Map();
  function build(node, parent) {
    if (!node) return;
    if (!graph.has(node.val)) graph.set(node.val, new Set());
    if (parent) {
      graph.get(node.val).add(parent.val);
      graph.get(parent.val).add(node.val);
    }
    build(node.left, node);
    build(node.right, node);
  }
  build(root, null);
  let queue = [start], visited = new Set([start]), time = -1;
  while (queue.length) {
    time++;
    const next = [];
    for (const node of queue)
      for (const nb of graph.get(node) || [])
        if (!visited.has(nb)) { visited.add(nb); next.push(nb); }
    queue = next;
  }
  return time;
}`,
    java: `public int amountOfTime(TreeNode root, int start) {
    Map<Integer, Set<Integer>> graph = new HashMap<>();
    buildGraph(root, null, graph);
    Queue<Integer> q = new LinkedList<>();
    q.offer(start);
    Set<Integer> visited = new HashSet<>();
    visited.add(start);
    int time = -1;
    while (!q.isEmpty()) {
        time++;
        int size = q.size();
        while (size-- > 0) {
            int node = q.poll();
            for (int nb : graph.getOrDefault(node, new HashSet<>()))
                if (visited.add(nb)) q.offer(nb);
        }
    }
    return time;
}`,
  },

  defaultInput: {
    nums: [1, 5, 3, 0, 4, 10, 6, 9, 2],
    start: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 5, 3, 0, 4, 10, 6, 9, 2],
      placeholder: '1,5,3,0,4,10,6,9,2',
      helperText: 'Level-order binary tree (0 = null node)',
    },
    {
      name: 'start',
      label: 'Start Node Value',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Value of the initially infected node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const start = input.start as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    // Build index map: value -> index
    const valToIdx: Map<number, number> = new Map();
    nums.forEach((v, i) => { if (v !== 0) valToIdx.set(v, i); });

    // Build adjacency by index
    const adj: Map<number, number[]> = new Map();
    nums.forEach((v, i) => {
      if (v === 0) return;
      if (!adj.has(i)) adj.set(i, []);
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      const parent = Math.floor((i - 1) / 2);
      if (l < nums.length && nums[l] !== 0) {
        adj.get(i)!.push(l);
        if (!adj.has(l)) adj.set(l, []);
        adj.get(l)!.push(i);
      }
      if (r < nums.length && nums[r] !== 0) {
        adj.get(i)!.push(r);
        if (!adj.has(r)) adj.set(r, []);
        adj.get(r)!.push(i);
      }
      if (i > 0) {
        if (!adj.has(parent)) adj.set(parent, []);
        if (!adj.get(parent)!.includes(i)) adj.get(parent)!.push(i);
        if (!adj.get(i)!.includes(parent)) adj.get(i)!.push(parent);
      }
    });

    steps.push({
      line: 1,
      explanation: `Build undirected graph from tree. Start infection at node value ${start}. BFS will spread infection level by level.`,
      variables: { start, nodes: nums.filter(v => v !== 0).length },
      visualization: makeViz({}, {}),
    });

    const startIdx = valToIdx.get(start)!;
    const visited = new Set<number>([startIdx]);
    let queue = [startIdx];
    let time = -1;

    while (queue.length > 0) {
      time++;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      visited.forEach(idx => { highlights[idx] = 'sorted'; });
      queue.forEach(idx => { highlights[idx] = time === 0 ? 'found' : 'active'; labels[idx] = `t=${time}`; });

      steps.push({
        line: 13,
        explanation: `Minute ${time}: infection spreads to ${queue.length} node(s): [${queue.map(i => nums[i]).join(', ')}]. Total infected: ${visited.size}.`,
        variables: { minute: time, infecting: queue.map(i => nums[i]), totalInfected: visited.size },
        visualization: makeViz(highlights, labels),
      });

      const next: number[] = [];
      for (const idx of queue) {
        for (const nb of (adj.get(idx) || [])) {
          if (!visited.has(nb)) {
            visited.add(nb);
            next.push(nb);
          }
        }
      }
      queue = next;
    }

    const finalHighlights: Record<number, string> = {};
    nums.forEach((v, i) => { if (v !== 0) finalHighlights[i] = 'found'; });

    steps.push({
      line: 19,
      explanation: `All ${visited.size} nodes infected. Total time needed: ${time} minute(s).`,
      variables: { result: time },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default amountOfTimeForBinaryTreeInfection;
