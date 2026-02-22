import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const serializeAndDeserializeBST: AlgorithmDefinition = {
  id: 'serialize-and-deserialize-bst',
  title: 'Serialize and Deserialize BST',
  leetcodeNumber: 449,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Serialize a BST to a string using preorder traversal (no nulls needed — BST property lets us reconstruct). Deserialize by inserting values back in preorder sequence, using BST bounds to place each node correctly.',
  tags: ['Tree', 'BST', 'Design', 'Preorder'],
  code: {
    pseudocode: `function serialize(root):
  if root is null: return ""
  return root.val + " " + serialize(root.left) + serialize(root.right)

function deserialize(data):
  tokens = data.split(" ").filter(non-empty)
  index = 0
  return build(-INF, INF)

function build(min, max):
  if index >= len or tokens[index] not in (min,max): return null
  val = tokens[index++]
  node = new Node(val)
  node.left = build(min, val)
  node.right = build(val, max)
  return node`,
    python: `def serialize(root):
    if not root: return ""
    return str(root.val) + " " + serialize(root.left) + serialize(root.right)

def deserialize(data):
    tokens = list(filter(None, data.split(" ")))
    idx = [0]
    def build(mn, mx):
        if idx[0] >= len(tokens): return None
        val = int(tokens[idx[0]])
        if val <= mn or val >= mx: return None
        idx[0] += 1
        node = TreeNode(val)
        node.left = build(mn, val)
        node.right = build(val, mx)
        return node
    return build(float('-inf'), float('inf'))`,
    javascript: `function serialize(root) {
  if (!root) return "";
  return root.val + " " + serialize(root.left) + serialize(root.right);
}
function deserialize(data) {
  const tokens = data.split(" ").filter(Boolean);
  let idx = 0;
  function build(min, max) {
    if (idx >= tokens.length) return null;
    const val = +tokens[idx];
    if (val <= min || val >= max) return null;
    idx++;
    const node = new TreeNode(val);
    node.left = build(min, val);
    node.right = build(val, max);
    return node;
  }
  return build(-Infinity, Infinity);
}`,
    java: `public String serialize(TreeNode root) {
    if (root == null) return "";
    return root.val + " " + serialize(root.left) + serialize(root.right);
}
int idx = 0; String[] tokens;
public TreeNode deserialize(String data) {
    tokens = data.split(" ");
    idx = 0;
    return build(Integer.MIN_VALUE, Integer.MAX_VALUE);
}
TreeNode build(int min, int max) {
    if (idx >= tokens.length || tokens[idx].isEmpty()) return null;
    int val = Integer.parseInt(tokens[idx]);
    if (val <= min || val >= max) return null;
    idx++;
    TreeNode node = new TreeNode(val);
    node.left = build(min, val);
    node.right = build(val, max);
    return node;
}`,
  },
  defaultInput: { tree: [4, 2, 6, 1, 3, 5, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [4, 2, 6, 1, 3, 5, 7],
      placeholder: 'e.g. 4,2,6,1,3,5,7',
      helperText: 'Must be a valid BST.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const tokens: string[] = [];
    const visited: Record<number, string> = {};

    function makeViz(activeIdx: number | null): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights: { ...visited, ...(activeIdx !== null ? { [activeIdx]: 'active' } : {}) } };
    }

    steps.push({
      line: 1,
      explanation: `Serialize BST using preorder traversal from root ${tree[0]}.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function serialize(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      const val = tree[idx] as number;
      tokens.push(String(val));
      visited[idx] = 'visited';
      steps.push({
        line: 3,
        explanation: `Preorder: visit ${val}. Tokens: [${tokens.join(' ')}].`,
        variables: { node: val, tokens: tokens.slice() },
        visualization: makeViz(idx),
      });
      serialize(2 * idx + 1);
      serialize(2 * idx + 2);
    }

    serialize(0);

    const serializedStr = tokens.join(' ');
    steps.push({
      line: 3,
      explanation: `BST serialized: "${serializedStr}". No nulls needed — BST property encodes structure.`,
      variables: { serialized: serializedStr },
      visualization: { type: 'tree', nodes: tree.slice(), highlights: Object.fromEntries(tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)) },
    });

    // Deserialize phase
    const resultTree: (number | null)[] = [];
    let tokenIdx = 0;

    function ensureSize(i: number): void {
      while (resultTree.length <= i) resultTree.push(null);
    }

    function deserialize(tIdx: number, min: number, max: number): void {
      if (tokenIdx >= tokens.length) return;
      const val = parseInt(tokens[tokenIdx]);
      if (val <= min || val >= max) return;
      tokenIdx++;
      ensureSize(tIdx);
      resultTree[tIdx] = val;
      steps.push({
        line: 12,
        explanation: `Insert ${val} at tree index ${tIdx} (bounds: ${min === -Infinity ? '-∞' : min} < val < ${max === Infinity ? '∞' : max}).`,
        variables: { val, treeIndex: tIdx, min, max },
        visualization: { type: 'tree', nodes: resultTree.slice(), highlights: { [tIdx]: 'found' } },
      });
      deserialize(2 * tIdx + 1, min, val);
      deserialize(2 * tIdx + 2, val, max);
    }

    steps.push({
      line: 7,
      explanation: `Deserialize "${serializedStr}" back to BST.`,
      variables: { tokens: tokens.slice() },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    deserialize(0, -Infinity, Infinity);

    steps.push({
      line: 14,
      explanation: 'BST deserialization complete!',
      variables: { tree: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default serializeAndDeserializeBST;
