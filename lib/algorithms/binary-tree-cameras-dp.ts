import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeCameras: AlgorithmDefinition = {
  id: 'binary-tree-cameras-dp',
  title: 'Binary Tree Cameras',
  leetcodeNumber: 968,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Place cameras on tree nodes to monitor every node. A camera at node v monitors v, its parent, and its children. Minimize the number of cameras. Use DP with three states per node: 0 = not covered, 1 = has camera, 2 = covered (no camera). Post-order DFS: leaves return 0 (not covered), forcing parent to place a camera.',
  tags: ['Tree', 'Dynamic Programming', 'Greedy', 'DFS'],
  code: {
    pseudocode: `function minCameraCover(root):
  cameras = 0
  function dfs(node):
    if null: return 2  # null nodes are "covered"
    left = dfs(node.left)
    right = dfs(node.right)
    if left == 0 or right == 0:
      cameras++; return 1  # must place camera
    if left == 1 or right == 1:
      return 2  # covered by child camera
    return 0  # not yet covered, let parent handle
  if dfs(root) == 0: cameras++
  return cameras`,
    python: `def minCameraCover(root):
    self.cameras = 0
    def dfs(node):
        if not node: return 2
        left, right = dfs(node.left), dfs(node.right)
        if left == 0 or right == 0:
            self.cameras += 1
            return 1
        if left == 1 or right == 1:
            return 2
        return 0
    if dfs(root) == 0:
        self.cameras += 1
    return self.cameras`,
    javascript: `function minCameraCover(root) {
  let cameras = 0;
  function dfs(node) {
    if (!node) return 2;
    const left = dfs(node.left), right = dfs(node.right);
    if (left === 0 || right === 0) { cameras++; return 1; }
    if (left === 1 || right === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cameras++;
  return cameras;
}`,
    java: `public int minCameraCover(TreeNode root) {
    int[] cameras = {0};
    if (dfs(root, cameras) == 0) cameras[0]++;
    return cameras[0];
}
private int dfs(TreeNode node, int[] cameras) {
    if (node == null) return 2;
    int left = dfs(node.left, cameras), right = dfs(node.right, cameras);
    if (left == 0 || right == 0) { cameras[0]++; return 1; }
    if (left == 1 || right == 1) return 2;
    return 0;
}`,
  },
  defaultInput: { tree: [0, 0, null, 0, 0] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [0, 0, null, 0, 0],
      placeholder: 'e.g. 0,0,null,0,0',
      helperText: 'Node values (all 0). Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let cameras = 0;
    const stateMap: Record<number, number> = {};
    const stateLabel = ['not-covered', 'has-camera', 'covered'];

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const [k, v] of Object.entries(stateMap)) {
        const idx = Number(k);
        if (v === 1) highlights[idx] = 'found';
        else if (v === 2) highlights[idx] = 'visited';
        else highlights[idx] = 'comparing';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Binary Tree Cameras: minimize cameras to cover all nodes. States: 0=not-covered, 1=has-camera, 2=covered. Use post-order DFS.',
      variables: { cameras: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 2;

      const val = tree[idx];
      steps.push({
        line: 4,
        explanation: `Visit node ${val} at index ${idx} (post-order: process children first).`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const left = dfs(leftIdx);
      const right = dfs(rightIdx);

      let state: number;
      if (left === 0 || right === 0) {
        cameras++;
        state = 1;
        stateMap[idx] = state;
        steps.push({
          line: 7,
          explanation: `Node ${val}: child is uncovered (left=${left}, right=${right}). Place camera here! cameras=${cameras}. State=1.`,
          variables: { node: val, left, right, cameras, state: stateLabel[state] },
          visualization: makeViz(idx),
        });
      } else if (left === 1 || right === 1) {
        state = 2;
        stateMap[idx] = state;
        steps.push({
          line: 9,
          explanation: `Node ${val}: covered by child camera (left=${left}, right=${right}). State=2 (covered).`,
          variables: { node: val, left, right, cameras, state: stateLabel[state] },
          visualization: makeViz(idx),
        });
      } else {
        state = 0;
        stateMap[idx] = state;
        steps.push({
          line: 10,
          explanation: `Node ${val}: both children covered but no child camera. State=0 (not covered, let parent handle).`,
          variables: { node: val, left, right, cameras, state: stateLabel[state] },
          visualization: makeViz(idx),
        });
      }
      return state;
    }

    const rootState = dfs(0);
    if (rootState === 0) {
      cameras++;
      steps.push({
        line: 11,
        explanation: `Root is uncovered (state=0). Place a camera at root. cameras=${cameras}.`,
        variables: { rootState, cameras },
        visualization: makeViz(0),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done! Minimum cameras needed = ${cameras}.`,
      variables: { answer: cameras },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default binaryTreeCameras;
