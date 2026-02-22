import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const serializeDeserializeBinaryTree: AlgorithmDefinition = {
  id: 'serialize-deserialize-binary-tree',
  title: 'Serialize/Deserialize Binary Tree',
  leetcodeNumber: 297,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Design an algorithm to serialize a binary tree to a string and deserialize it back. We use preorder traversal with null markers. Serialize visits each node in preorder, appending values and "null" for missing children. Deserialize reads tokens in the same order to reconstruct.',
  tags: ['Tree', 'Design', 'String'],
  code: {
    pseudocode: `function serialize(root):
  if root is null: return "null"
  return root.val + "," + serialize(root.left)
       + "," + serialize(root.right)

function deserialize(data):
  tokens = data.split(",")
  index = 0
  return buildTree()

function buildTree():
  if tokens[index] == "null":
    index++; return null
  node = new Node(tokens[index])
  index++
  node.left = buildTree()
  node.right = buildTree()
  return node`,
    python: `def serialize(root):
    if not root:
        return "null"
    return (str(root.val) + "," +
            serialize(root.left) + "," +
            serialize(root.right))

def deserialize(data):
    tokens = data.split(",")
    idx = [0]
    def build():
        if tokens[idx[0]] == "null":
            idx[0] += 1
            return None
        node = TreeNode(int(tokens[idx[0]]))
        idx[0] += 1
        node.left = build()
        node.right = build()
        return node
    return build()`,
    javascript: `function serialize(root) {
  if (!root) return "null";
  return root.val + "," + serialize(root.left)
       + "," + serialize(root.right);
}
function deserialize(data) {
  const tokens = data.split(",");
  let idx = 0;
  function build() {
    if (tokens[idx] === "null") { idx++; return null; }
    const node = new TreeNode(parseInt(tokens[idx++]));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}`,
    java: `public String serialize(TreeNode root) {
    if (root == null) return "null";
    return root.val + "," + serialize(root.left)
         + "," + serialize(root.right);
}
int idx = 0;
public TreeNode deserialize(String data) {
    String[] tokens = data.split(",");
    idx = 0;
    return build(tokens);
}
TreeNode build(String[] tokens) {
    if (tokens[idx].equals("null")) { idx++; return null; }
    TreeNode node = new TreeNode(Integer.parseInt(tokens[idx++]));
    node.left = build(tokens);
    node.right = build(tokens);
    return node;
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
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const serialized: string[] = [];
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null, phase: string): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'visited';
        }
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = phase === 'serialize' ? 'active' : 'found';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty. Serialized form: "null".',
        variables: { serialized: 'null' },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start serialization of tree with root = ${tree[0]}. Using preorder traversal with null markers.`,
      variables: { root: tree[0] },
      visualization: makeViz(0, 'serialize'),
    });

    // Serialize phase
    function serialize(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) {
        serialized.push('null');
        steps.push({
          line: 2,
          explanation: `Node at index ${idx} is null. Append "null". Serialized so far: [${serialized.join(',')}].`,
          variables: { serialized: serialized.slice() },
          visualization: makeViz(null, 'serialize'),
        });
        return;
      }

      const val = tree[idx] as number;
      serialized.push(String(val));
      visited.add(idx);

      steps.push({
        line: 3,
        explanation: `Serialize node ${val} (index ${idx}). Append "${val}". Serialized so far: [${serialized.join(',')}].`,
        variables: { node: val, serialized: serialized.slice() },
        visualization: makeViz(idx, 'serialize'),
      });

      serialize(2 * idx + 1);
      serialize(2 * idx + 2);
    }

    serialize(0);

    const serializedStr = serialized.join(',');

    steps.push({
      line: 4,
      explanation: `Serialization complete! Result: "${serializedStr}".`,
      variables: { serialized: serializedStr },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          [...visited].map(i => [i, 'found'])
        ),
      },
    });

    // Deserialize phase
    steps.push({
      line: 6,
      explanation: `Now deserialize: "${serializedStr}". Split into tokens and rebuild using preorder.`,
      variables: { tokens: serialized.slice() },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    const resultTree: (number | null)[] = [];
    function ensureSize(idx: number): void {
      while (resultTree.length <= idx) resultTree.push(null);
    }

    let tokenIdx = 0;
    const tokens = serialized.slice();

    function deserialize(treeIdx: number): void {
      if (tokenIdx >= tokens.length) return;

      const token = tokens[tokenIdx];
      tokenIdx++;

      if (token === 'null') {
        steps.push({
          line: 10,
          explanation: `Token "${token}" at position ${tokenIdx - 1}. This is null, no node created.`,
          variables: { token, tokenIndex: tokenIdx - 1 },
          visualization: { type: 'tree', nodes: resultTree.slice(), highlights: {} },
        });
        return;
      }

      const val = parseInt(token);
      ensureSize(treeIdx);
      resultTree[treeIdx] = val;

      steps.push({
        line: 11,
        explanation: `Token "${token}" at position ${tokenIdx - 1}. Create node ${val} at tree index ${treeIdx}.`,
        variables: { token, val, treeIndex: treeIdx },
        visualization: {
          type: 'tree',
          nodes: resultTree.slice(),
          highlights: { [treeIdx]: 'found' },
        },
      });

      deserialize(2 * treeIdx + 1);
      deserialize(2 * treeIdx + 2);
    }

    deserialize(0);

    steps.push({
      line: 15,
      explanation: `Deserialization complete! Tree has been fully reconstructed from "${serializedStr}".`,
      variables: { reconstructedTree: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(
          resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default serializeDeserializeBinaryTree;
