import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const serializeAndDeserializeBinaryTreeII: AlgorithmDefinition = {
  id: 'serialize-and-deserialize-binary-tree-ii',
  title: 'Serialize and Deserialize Binary Tree II',
  leetcodeNumber: 297,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Design an algorithm to serialize a binary tree to a string and deserialize it back using BFS (level-order). During serialization each level is recorded with null markers. Deserialization rebuilds by pairing each node with its children tokens.',
  tags: ['Tree', 'BFS', 'Design', 'String'],
  code: {
    pseudocode: `function serialize(root):
  if root is null: return ""
  queue = [root]; result = []
  while queue not empty:
    node = queue.dequeue()
    if node is null: result.append("null")
    else:
      result.append(node.val)
      queue.enqueue(node.left, node.right)
  return result.join(",")

function deserialize(data):
  tokens = data.split(","); root = new Node(tokens[0])
  queue = [root]; i = 1
  while queue not empty:
    node = queue.dequeue()
    if tokens[i] != "null": node.left = new Node(tokens[i]); queue.enqueue(node.left)
    i++
    if tokens[i] != "null": node.right = new Node(tokens[i]); queue.enqueue(node.right)
    i++
  return root`,
    python: `from collections import deque
def serialize(root):
    if not root: return ""
    q, res = deque([root]), []
    while q:
        node = q.popleft()
        if node:
            res.append(str(node.val))
            q.append(node.left); q.append(node.right)
        else:
            res.append("null")
    return ",".join(res)

def deserialize(data):
    if not data: return None
    tokens = data.split(",")
    root = TreeNode(int(tokens[0]))
    q = deque([root]); i = 1
    while q:
        node = q.popleft()
        if tokens[i] != "null":
            node.left = TreeNode(int(tokens[i])); q.append(node.left)
        i += 1
        if tokens[i] != "null":
            node.right = TreeNode(int(tokens[i])); q.append(node.right)
        i += 1
    return root`,
    javascript: `function serialize(root) {
  if (!root) return "";
  const q = [root], res = [];
  while (q.length) {
    const node = q.shift();
    if (node) { res.push(node.val); q.push(node.left, node.right); }
    else res.push("null");
  }
  return res.join(",");
}
function deserialize(data) {
  if (!data) return null;
  const tokens = data.split(",");
  const root = new TreeNode(+tokens[0]);
  const q = [root]; let i = 1;
  while (q.length) {
    const node = q.shift();
    if (tokens[i] !== "null") { node.left = new TreeNode(+tokens[i]); q.push(node.left); }
    i++;
    if (tokens[i] !== "null") { node.right = new TreeNode(+tokens[i]); q.push(node.right); }
    i++;
  }
  return root;
}`,
    java: `public String serialize(TreeNode root) {
    if (root == null) return "";
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root); StringBuilder sb = new StringBuilder();
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        if (node == null) { sb.append("null,"); continue; }
        sb.append(node.val + ",");
        q.add(node.left); q.add(node.right);
    }
    return sb.toString();
}`,
  },
  defaultInput: { tree: [1, 2, 3, null, null, 4, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, null, null, 4, 5],
      placeholder: 'e.g. 1,2,3,null,null,4,5',
      helperText: 'Level-order with null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights: { ...highlights, ...(activeIdx !== null ? { [activeIdx]: 'active' } : {}) } };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Serialized form: "".',
        variables: { serialized: '' },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    // BFS serialize
    const tokens: string[] = [];
    const queue: number[] = [0];
    const visited: Record<number, string> = {};

    steps.push({
      line: 1,
      explanation: `Begin BFS serialization from root ${tree[0]}.`,
      variables: { root: tree[0] },
      visualization: makeViz(0, {}),
    });

    while (queue.length > 0) {
      const idx = queue.shift()!;
      if (idx >= tree.length || tree[idx] == null) {
        tokens.push('null');
        steps.push({
          line: 7,
          explanation: `Node is null. Append "null". Tokens: [${tokens.join(',')}].`,
          variables: { tokens: tokens.slice() },
          visualization: { type: 'tree', nodes: tree.slice(), highlights: { ...visited } },
        });
        continue;
      }
      const val = tree[idx] as number;
      tokens.push(String(val));
      visited[idx] = 'visited';
      steps.push({
        line: 6,
        explanation: `Visit node ${val}. Append "${val}". Enqueue children. Tokens so far: [${tokens.join(',')}].`,
        variables: { node: val, tokens: tokens.slice() },
        visualization: makeViz(idx, { ...visited }),
      });
      queue.push(2 * idx + 1, 2 * idx + 2);
    }

    const serializedStr = tokens.join(',');
    steps.push({
      line: 9,
      explanation: `Serialization done: "${serializedStr}".`,
      variables: { serialized: serializedStr },
      visualization: { type: 'tree', nodes: tree.slice(), highlights: Object.fromEntries(tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)) },
    });

    return steps;
  },
};

export default serializeAndDeserializeBinaryTreeII;
