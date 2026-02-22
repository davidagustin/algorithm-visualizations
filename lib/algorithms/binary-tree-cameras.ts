import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryTreeCameras: AlgorithmDefinition = {
  id: 'binary-tree-cameras',
  title: 'Binary Tree Cameras',
  leetcodeNumber: 968,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a binary tree, place cameras on tree nodes. Each camera monitors its parent, itself, and its immediate children. Return the minimum number of cameras needed to monitor all nodes. Uses a greedy DFS approach: place cameras bottom-up, only when a child is uncovered. State: 0 = uncovered, 1 = has camera, 2 = covered.',
  tags: ['tree', 'dfs', 'greedy', 'dynamic programming'],

  code: {
    pseudocode: `function minCameraCover(root):
  cameras = 0
  # States: 0=uncovered, 1=has camera, 2=covered no camera

  function dfs(node):
    if node is null: return 2  # null treated as covered
    left = dfs(node.left)
    right = dfs(node.right)
    if left == 0 or right == 0:
      cameras += 1
      return 1  # place camera here
    if left == 1 or right == 1:
      return 2  # covered by child camera
    return 0  # uncovered, parent must cover

  if dfs(root) == 0:
    cameras += 1
  return cameras`,
    python: `def minCameraCover(root):
    cameras = [0]
    def dfs(node):
        if not node: return 2
        l, r = dfs(node.left), dfs(node.right)
        if l == 0 or r == 0:
            cameras[0] += 1
            return 1
        if l == 1 or r == 1:
            return 2
        return 0
    if dfs(root) == 0:
        cameras[0] += 1
    return cameras[0]`,
    javascript: `function minCameraCover(root) {
  let cameras = 0;
  function dfs(node) {
    if (!node) return 2;
    const l = dfs(node.left), r = dfs(node.right);
    if (l === 0 || r === 0) { cameras++; return 1; }
    if (l === 1 || r === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cameras++;
  return cameras;
}`,
    java: `int cameras = 0;
public int minCameraCover(TreeNode root) {
    if (dfs(root) == 0) cameras++;
    return cameras;
}
private int dfs(TreeNode node) {
    if (node == null) return 2;
    int l = dfs(node.left), r = dfs(node.right);
    if (l == 0 || r == 0) { cameras++; return 1; }
    if (l == 1 || r == 1) return 2;
    return 0;
}`,
  },

  defaultInput: {
    nums: [0, 0, 0, 0, 0],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [0, 0, 0, 0, 0],
      placeholder: '0,0,0,0,0',
      helperText: 'Level-order binary tree (all 0 means all valid nodes)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Start greedy DFS from bottom up. State: 0=uncovered, 1=has camera, 2=covered. Null nodes return 2 (treated as covered).',
      variables: { cameras: 0 },
      visualization: makeViz({}, {}),
    });

    let cameras = 0;
    const stateLabels: Record<number, string> = {};
    const stateColors: Record<number, string> = {};

    function getChildren(i: number): [number | null, number | null] {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      return [l < nums.length ? l : null, r < nums.length ? r : null];
    }

    function dfs(idx: number): number {
      if (idx === null || idx >= nums.length) return 2;
      const [li, ri] = getChildren(idx);
      const left = dfs(li!);
      const right = dfs(ri!);

      let state: number;
      if (left === 0 || right === 0) {
        cameras++;
        state = 1;
        stateLabels[idx] = 'CAM';
        stateColors[idx] = 'found';
        steps.push({
          line: 8,
          explanation: `Node[${idx}] has uncovered child. Place camera here. cameras=${cameras}. State=1 (has camera).`,
          variables: { nodeIdx: idx, leftState: left, rightState: right, cameras },
          visualization: makeViz({ ...stateColors }, { ...stateLabels }),
        });
      } else if (left === 1 || right === 1) {
        state = 2;
        stateLabels[idx] = 'COV';
        stateColors[idx] = 'sorted';
        steps.push({
          line: 11,
          explanation: `Node[${idx}] is covered by child camera. State=2 (covered, no camera needed).`,
          variables: { nodeIdx: idx, leftState: left, rightState: right, cameras },
          visualization: makeViz({ ...stateColors }, { ...stateLabels }),
        });
      } else {
        state = 0;
        stateLabels[idx] = 'UNC';
        stateColors[idx] = 'mismatch';
        steps.push({
          line: 12,
          explanation: `Node[${idx}] is uncovered. Children are covered but have no cameras. Parent must cover this node. State=0.`,
          variables: { nodeIdx: idx, leftState: left, rightState: right, cameras },
          visualization: makeViz({ ...stateColors }, { ...stateLabels }),
        });
      }
      return state;
    }

    const rootState = dfs(0);

    if (rootState === 0) {
      cameras++;
      stateColors[0] = 'found';
      stateLabels[0] = 'CAM';
      steps.push({
        line: 14,
        explanation: `Root is uncovered. Place camera at root. cameras=${cameras}.`,
        variables: { rootState, cameras },
        visualization: makeViz({ ...stateColors }, { ...stateLabels }),
      });
    }

    steps.push({
      line: 15,
      explanation: `Minimum cameras needed: ${cameras}.`,
      variables: { result: cameras },
      visualization: makeViz({ ...stateColors }, { ...stateLabels }),
    });

    return steps;
  },
};

export default binaryTreeCameras;
