import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const populatingNextRightPointers: AlgorithmDefinition = {
  id: 'populating-next-right-pointers',
  title: 'Populating Next Right Pointers in Each Node',
  leetcodeNumber: 116,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a perfect binary tree, populate each node\'s next pointer to point to the next right node at the same level. If there is no next right node, the next pointer should be set to null. We process level by level using the already-connected nodes of the previous level as a "linked list" to find siblings and cousins.',
  tags: ['Tree', 'BFS', 'Linked List'],
  code: {
    pseudocode: `function connect(root):
  if root is null: return null
  leftmost = root
  while leftmost.left != null:
    curr = leftmost
    while curr != null:
      curr.left.next = curr.right
      if curr.next != null:
        curr.right.next = curr.next.left
      curr = curr.next
    leftmost = leftmost.left
  return root`,
    python: `def connect(root):
    if not root:
        return None
    leftmost = root
    while leftmost.left:
        curr = leftmost
        while curr:
            curr.left.next = curr.right
            if curr.next:
                curr.right.next = curr.next.left
            curr = curr.next
        leftmost = leftmost.left
    return root`,
    javascript: `function connect(root) {
  if (!root) return null;
  let leftmost = root;
  while (leftmost.left) {
    let curr = leftmost;
    while (curr) {
      curr.left.next = curr.right;
      if (curr.next) curr.right.next = curr.next.left;
      curr = curr.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}`,
    java: `public Node connect(Node root) {
    if (root == null) return null;
    Node leftmost = root;
    while (leftmost.left != null) {
        Node curr = leftmost;
        while (curr != null) {
            curr.left.next = curr.right;
            if (curr.next != null)
                curr.right.next = curr.next.left;
            curr = curr.next;
        }
        leftmost = leftmost.left;
    }
    return root;
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Perfect Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Must be a perfect binary tree (all leaves at same level, all internal nodes have 2 children).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIndices: number[], extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      for (const idx of activeIndices) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Return null.',
        variables: { root: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Connect next right pointers in perfect binary tree. Start at root (${tree[0]}).`,
      variables: { root: tree[0] },
      visualization: makeViz([0]),
    });

    // Process level by level
    let level = 0;
    let levelStart = 0;

    while (levelStart < tree.length && tree[levelStart] != null) {
      const levelSize = Math.pow(2, level);
      const levelIndices: number[] = [];

      for (let i = 0; i < levelSize; i++) {
        const idx = levelStart + i;
        if (idx < tree.length && tree[idx] != null) levelIndices.push(idx);
      }

      steps.push({
        line: 4,
        explanation: `Level ${level}: processing ${levelIndices.length} node(s): [${levelIndices.map(i => tree[i]).join(', ')}].`,
        variables: { level, nodes: levelIndices.map(i => tree[i]) },
        visualization: makeViz(levelIndices),
      });

      for (let i = 0; i < levelIndices.length; i++) {
        const idx = levelIndices[i];
        const val = tree[idx] as number;
        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;

        if (leftIdx < tree.length && tree[leftIdx] != null) {
          steps.push({
            line: 6,
            explanation: `Connect ${tree[leftIdx]}.next → ${tree[rightIdx] ?? 'null'} (children of node ${val}).`,
            variables: { parent: val, left: tree[leftIdx], right: tree[rightIdx] },
            visualization: makeViz([leftIdx, rightIdx], { [idx]: 'visited' }),
          });
        }

        if (i + 1 < levelIndices.length) {
          const nextIdx = levelIndices[i + 1];
          const nextLeftIdx = 2 * nextIdx + 1;
          if (rightIdx < tree.length && tree[rightIdx] != null &&
              nextLeftIdx < tree.length && tree[nextLeftIdx] != null) {
            steps.push({
              line: 7,
              explanation: `Connect ${tree[rightIdx]}.next → ${tree[nextLeftIdx]} (cross-parent connection).`,
              variables: { from: tree[rightIdx], to: tree[nextLeftIdx] },
              visualization: makeViz([rightIdx, nextLeftIdx], { [idx]: 'visited', [nextIdx]: 'comparing' }),
            });
          }
        }
      }

      levelStart += levelSize;
      level++;

      if (levelStart < tree.length && tree[levelStart] == null) break;
    }

    // Final visualization: highlight all connections
    const allHighlights: Record<number, string> = {};
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] != null) allHighlights[i] = 'found';
    }

    steps.push({
      line: 10,
      explanation: `All next pointers connected! Each node points to its next right neighbor at the same level.`,
      variables: { done: true },
      visualization: { type: 'tree', nodes: tree.slice(), highlights: allHighlights },
    });

    return steps;
  },
};

export default populatingNextRightPointers;
