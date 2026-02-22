import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const mergeTwoBinaryTrees: AlgorithmDefinition = {
  id: 'merge-two-binary-trees',
  title: 'Merge Two Binary Trees',
  leetcodeNumber: 617,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given two binary trees root1 and root2, merge them into a new binary tree. The merge rule is: if two nodes overlap, sum their values; otherwise use the existing node. We use recursive DFS: at each position, if both nodes exist, sum them; if only one exists, use it; if neither exists, return null.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function mergeTrees(root1, root2):
  if root1 is null: return root2
  if root2 is null: return root1
  root1.val += root2.val
  root1.left = mergeTrees(root1.left, root2.left)
  root1.right = mergeTrees(root1.right, root2.right)
  return root1`,
    python: `def mergeTrees(root1, root2):
    if not root1:
        return root2
    if not root2:
        return root1
    root1.val += root2.val
    root1.left = mergeTrees(root1.left, root2.left)
    root1.right = mergeTrees(root1.right, root2.right)
    return root1`,
    javascript: `function mergeTrees(root1, root2) {
  if (!root1) return root2;
  if (!root2) return root1;
  root1.val += root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  return root1;
}`,
    java: `public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
    if (root1 == null) return root2;
    if (root2 == null) return root1;
    root1.val += root2.val;
    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);
    return root1;
}`,
  },
  defaultInput: { tree1: [1, 3, 2, 5], tree2: [2, 1, 3, null, 4, null, 7] },
  inputFields: [
    {
      name: 'tree1',
      label: 'Tree 1 (level-order)',
      type: 'tree',
      defaultValue: [1, 3, 2, 5],
      placeholder: 'e.g. 1,3,2,5',
      helperText: 'First binary tree. Use null for missing nodes.',
    },
    {
      name: 'tree2',
      label: 'Tree 2 (level-order)',
      type: 'tree',
      defaultValue: [2, 1, 3, null, 4, null, 7],
      placeholder: 'e.g. 2,1,3,null,4,null,7',
      helperText: 'Second binary tree. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = (input.tree1 as (number | null)[]).slice();
    const tree2 = (input.tree2 as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    // Build the merged tree
    const merged: (number | null)[] = [];
    const mergedHighlights: Record<number, string> = {};

    function setMerged(idx: number, val: number | null): void {
      while (merged.length <= idx) merged.push(null);
      merged[idx] = val;
    }

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const [k, v] of Object.entries(mergedHighlights)) highlights[Number(k)] = v;
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: merged.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Merge two binary trees by summing overlapping nodes. Tree1 root=${tree1[0] ?? 'null'}, Tree2 root=${tree2[0] ?? 'null'}.`,
      variables: { tree1Root: tree1[0], tree2Root: tree2[0] },
      visualization: { type: 'tree', nodes: tree1.slice(), highlights: {} },
    });

    function dfs(idx1: number, idx2: number, mergedIdx: number): void {
      const v1 = idx1 < tree1.length ? tree1[idx1] : null;
      const v2 = idx2 < tree2.length ? tree2[idx2] : null;

      if (v1 == null && v2 == null) {
        setMerged(mergedIdx, null);
        return;
      }

      if (v1 == null) {
        // Use tree2 subtree
        function copyTree2(from: number, to: number): void {
          if (from >= tree2.length || tree2[from] == null) {
            setMerged(to, null);
            return;
          }
          setMerged(to, tree2[from]);
          mergedHighlights[to] = 'comparing';
          copyTree2(2 * from + 1, 2 * to + 1);
          copyTree2(2 * from + 2, 2 * to + 2);
        }
        copyTree2(idx2, mergedIdx);
        steps.push({
          line: 2,
          explanation: `Tree1 node is null, Tree2 has ${v2}. Use Tree2's subtree as-is.`,
          variables: { tree1: null, tree2: v2 },
          visualization: makeViz(mergedIdx),
        });
        return;
      }

      if (v2 == null) {
        // Use tree1 subtree
        function copyTree1(from: number, to: number): void {
          if (from >= tree1.length || tree1[from] == null) {
            setMerged(to, null);
            return;
          }
          setMerged(to, tree1[from]);
          mergedHighlights[to] = 'comparing';
          copyTree1(2 * from + 1, 2 * to + 1);
          copyTree1(2 * from + 2, 2 * to + 2);
        }
        copyTree1(idx1, mergedIdx);
        steps.push({
          line: 3,
          explanation: `Tree2 node is null, Tree1 has ${v1}. Use Tree1's subtree as-is.`,
          variables: { tree1: v1, tree2: null },
          visualization: makeViz(mergedIdx),
        });
        return;
      }

      const sum = v1 + v2;
      setMerged(mergedIdx, sum);
      mergedHighlights[mergedIdx] = 'found';

      steps.push({
        line: 4,
        explanation: `Both nodes exist: Tree1=${v1}, Tree2=${v2}. Merged value = ${v1} + ${v2} = ${sum}.`,
        variables: { tree1: v1, tree2: v2, merged: sum },
        visualization: makeViz(mergedIdx),
      });

      steps.push({
        line: 5,
        explanation: `Recurse into left children of both trees.`,
        variables: { currentMergedNode: sum },
        visualization: makeViz(mergedIdx),
      });
      dfs(2 * idx1 + 1, 2 * idx2 + 1, 2 * mergedIdx + 1);

      steps.push({
        line: 6,
        explanation: `Recurse into right children of both trees.`,
        variables: { currentMergedNode: sum },
        visualization: makeViz(mergedIdx),
      });
      dfs(2 * idx1 + 2, 2 * idx2 + 2, 2 * mergedIdx + 2);
    }

    dfs(0, 0, 0);

    steps.push({
      line: 7,
      explanation: `Merge complete! Merged tree: [${merged.map(v => v ?? 'null').join(', ')}].`,
      variables: { mergedTree: merged },
      visualization: {
        type: 'tree',
        nodes: merged.slice(),
        highlights: Object.fromEntries(
          merged.map((_, i) => [i, 'found']).filter(([i]) => merged[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default mergeTwoBinaryTrees;
