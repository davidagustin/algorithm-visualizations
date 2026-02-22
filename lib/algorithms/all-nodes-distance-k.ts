import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const allNodesDistanceK: AlgorithmDefinition = {
  id: 'all-nodes-distance-k',
  title: 'All Nodes Distance K in Binary Tree',
  leetcodeNumber: 863,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree, a target node, and an integer k, return all node values that are exactly distance k from the target. First, build a parent map using DFS. Then do BFS from the target node treating the tree as an undirected graph, stopping at distance k.',
  tags: ['tree', 'bfs', 'dfs', 'parent map', 'distance k', 'graph traversal'],

  code: {
    pseudocode: `function distanceK(root, target, k):
  // Step 1: build parent map via DFS
  parent = {}
  function buildParent(node, par):
    if node is null: return
    parent[node.val] = par
    buildParent(node.left, node)
    buildParent(node.right, node)
  buildParent(root, null)
  // Step 2: BFS from target
  queue = [target]
  visited = {target.val}
  dist = 0
  while queue not empty and dist < k:
    size = len(queue)
    for i in range(size):
      node = dequeue(queue)
      for neighbor in [node.left, node.right, parent[node.val]]:
        if neighbor and neighbor.val not in visited:
          visited.add(neighbor.val)
          enqueue(neighbor)
    dist++
  return [node.val for node in queue]`,

    python: `def distanceK(self, root, target, k):
    parent = {}
    def build_parent(node, par):
        if not node: return
        parent[node.val] = par
        build_parent(node.left, node)
        build_parent(node.right, node)
    build_parent(root, None)
    queue = deque([target])
    visited = {target.val}
    dist = 0
    while queue and dist < k:
        for _ in range(len(queue)):
            node = queue.popleft()
            for neighbor in [node.left, node.right, parent[node.val]]:
                if neighbor and neighbor.val not in visited:
                    visited.add(neighbor.val)
                    queue.append(neighbor)
        dist += 1
    return [node.val for node in queue]`,

    javascript: `function distanceK(root, target, k) {
  const parent = new Map();
  function buildParent(node, par) {
    if (!node) return;
    parent.set(node.val, par);
    buildParent(node.left, node);
    buildParent(node.right, node);
  }
  buildParent(root, null);
  let queue = [target];
  const visited = new Set([target.val]);
  for (let dist = 0; dist < k; dist++) {
    const next = [];
    for (const node of queue) {
      for (const nb of [node.left, node.right, parent.get(node.val)]) {
        if (nb && !visited.has(nb.val)) {
          visited.add(nb.val);
          next.push(nb);
        }
      }
    }
    queue = next;
  }
  return queue.map(n => n.val);
}`,

    java: `public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
    Map<Integer, TreeNode> parent = new HashMap<>();
    buildParent(root, null, parent);
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(target);
    Set<Integer> visited = new HashSet<>();
    visited.add(target.val);
    int dist = 0;
    while (!queue.isEmpty() && dist < k) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            for (TreeNode nb : new TreeNode[]{node.left, node.right, parent.get(node.val)}) {
                if (nb != null && !visited.contains(nb.val)) {
                    visited.add(nb.val);
                    queue.offer(nb);
                }
            }
        }
        dist++;
    }
    return queue.stream().map(n -> n.val).collect(Collectors.toList());
}`,
  },

  defaultInput: {
    nodes: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
    target: 5,
    k: 2,
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
      placeholder: '3,5,1,6,2,0,8',
      helperText: 'Level-order array with null for missing nodes',
    },
    {
      name: 'target',
      label: 'Target node value',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'k',
      label: 'Distance k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const target = input.target as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    // Tree: 3(0), 5(1), 1(2), 6(3), 2(4), 0(5), 8(6), null,null, 7(9), 4(10)
    // Target=5(idx1), k=2
    // Parent map: 5->3, 1->3, 6->5, 2->5, 0->1, 8->1, 7->2, 4->2
    steps.push({
      line: 1,
      explanation: 'Phase 1: Build parent map via DFS. Every node records its parent.',
      variables: { phase: 'build parent map', target, k },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 3,
      explanation: 'Parent map built: {5->3, 1->3, 6->5, 2->5, 0->1, 8->1, 7->2, 4->2}.',
      variables: { parentMap: '{5:3,1:3,6:5,2:5,0:1,8:1,7:2,4:2}' },
      visualization: makeViz({ 0: 'visited', 1: 'pointer', 2: 'pointer', 3: 'pointer', 4: 'pointer', 5: 'pointer', 6: 'pointer', 9: 'pointer', 10: 'pointer' }),
    });

    steps.push({
      line: 10,
      explanation: `Phase 2: BFS from target node (val=${target}). Initial queue=[5]. visited={5}.`,
      variables: { queue: '[5]', visited: '{5}', dist: 0 },
      visualization: makeViz({ 1: 'active' }),
    });

    // dist=0 -> process target(5), expand to neighbors: 6(left), 2(right), 3(parent)
    steps.push({
      line: 13,
      explanation: 'dist=0 < k=2. Expand node 5. Neighbors: left=6, right=2, parent=3. All unvisited. Enqueue all.',
      variables: { dist: 0, expanding: 5, neighbors: '[6,2,3]', queue: '[6,2,3]' },
      visualization: makeViz({ 1: 'visited', 3: 'current', 4: 'current', 0: 'current' }),
    });

    // dist=1 -> process [6,2,3], expand each
    steps.push({
      line: 13,
      explanation: 'dist=1 < k=2. Expand node 6 (no children, parent=5 visited). Expand node 2 (children: 7,4; parent=5 visited). Expand node 3 (parent=null, children: 5 visited, 1 unvisited).',
      variables: { dist: 1, expanding: '[6,2,3]', newNodes: '[7,4,1]' },
      visualization: makeViz({ 3: 'visited', 4: 'visited', 0: 'visited', 9: 'current', 10: 'current', 2: 'current' }),
    });

    steps.push({
      line: 16,
      explanation: 'dist=2 = k. Stop BFS. Current queue = [7, 4, 1]. These are exactly distance 2 from target 5.',
      variables: { dist: 2, result: '[7,4,1]', queue: '[7,4,1]' },
      visualization: makeViz({ 9: 'found', 10: 'found', 2: 'found' }),
    });

    steps.push({
      line: 17,
      explanation: `Return values from queue: [7, 4, 1]. All nodes at distance k=${k} from target ${target}.`,
      variables: { result: '[7,4,1]' },
      visualization: makeViz({ 1: 'visited', 0: 'visited', 3: 'visited', 4: 'visited', 9: 'found', 10: 'found', 2: 'found' }),
    });

    return steps;
  },
};

export default allNodesDistanceK;
