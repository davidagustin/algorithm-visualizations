import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const longestZigzagPath: AlgorithmDefinition = {
  id: 'longest-zigzag-path',
  title: 'Longest ZigZag Path in a Binary Tree',
  leetcodeNumber: 1372,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the length of the longest zigzag path. A zigzag path alternates between going left and right. At each node, track the maximum zigzag length if the last move was left or right. If we continue in the opposite direction, length increases by 1. If we reset direction, length restarts.',
  tags: ['tree', 'DFS', 'dynamic programming', 'zigzag', 'path'],

  code: {
    pseudocode: `function longestZigZag(root):
  maxLen = 0
  function dfs(node, lastDir, length):
    if node is null: return
    maxLen = max(maxLen, length)
    if lastDir == 'left':
      dfs(node.left, 'left', 1)      // reset
      dfs(node.right, 'right', length + 1)  // extend
    else:
      dfs(node.left, 'left', length + 1)   // extend
      dfs(node.right, 'right', 1)     // reset
  dfs(root, 'left', 0)
  dfs(root, 'right', 0)
  return maxLen`,

    python: `def longestZigZag(root):
    max_len = 0
    def dfs(node, went_left, length):
        nonlocal max_len
        if not node: return
        max_len = max(max_len, length)
        if went_left:
            dfs(node.left, True, 1)
            dfs(node.right, False, length + 1)
        else:
            dfs(node.left, True, length + 1)
            dfs(node.right, False, 1)
    dfs(root, True, 0)
    dfs(root, False, 0)
    return max_len`,

    javascript: `function longestZigZag(root) {
  let maxLen = 0;
  function dfs(node, wentLeft, length) {
    if (!node) return;
    maxLen = Math.max(maxLen, length);
    if (wentLeft) {
      dfs(node.left, true, 1);
      dfs(node.right, false, length + 1);
    } else {
      dfs(node.left, true, length + 1);
      dfs(node.right, false, 1);
    }
  }
  dfs(root, true, 0);
  dfs(root, false, 0);
  return maxLen;
}`,

    java: `public int longestZigZag(TreeNode root) {
    int[] maxLen = {0};
    dfs(root, true, 0, maxLen);
    dfs(root, false, 0, maxLen);
    return maxLen[0];
}
private void dfs(TreeNode node, boolean wentLeft, int length, int[] maxLen) {
    if (node == null) return;
    maxLen[0] = Math.max(maxLen[0], length);
    if (wentLeft) {
        dfs(node.left, true, 1, maxLen);
        dfs(node.right, false, length + 1, maxLen);
    } else {
        dfs(node.left, true, length + 1, maxLen);
        dfs(node.right, false, 1, maxLen);
    }
}`,
  },

  defaultInput: {
    tree: [1, null, 1, null, null, 1, 1, null, null, null, null, null, null, null, 1],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [1, null, 1, null, null, 1, 1, null, null, null, null, null, null, null, 1],
      placeholder: '1,null,1,null,null,1,1',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find longest zigzag path in tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Track direction (left/right) and current length.`,
      variables: { maxLen: 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    let maxLen = 0;
    const bestPath: number[] = [];
    let currentBestPath: number[] = [];

    function dfs(pos: number, wentLeft: boolean, length: number, path: number[]): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;

      const val = tree[pos] as number;
      path.push(pos);

      if (length > maxLen) {
        maxLen = length;
        currentBestPath = [...path];
      }

      const leftPos = 2 * pos + 1;
      const rightPos = 2 * pos + 2;

      steps.push({
        line: 3,
        explanation: `Node ${val} at pos ${pos}, came from ${wentLeft ? 'left direction' : 'right direction'}, current zigzag length = ${length}. maxLen = ${maxLen}.`,
        variables: { val, wentLeft, length, maxLen },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(currentBestPath.map(p => [p, 'found'])),
            ...Object.fromEntries(path.slice(0, -1).map(p => [p, 'active'])),
            [pos]: length > 0 ? 'active' : 'comparing',
          },
        },
      });

      if (wentLeft) {
        // Last move was left (we came from parent going left to get here)
        // To zigzag, go right from here
        if (rightPos < tree.length && tree[rightPos] !== null && tree[rightPos] !== undefined) {
          steps.push({
            line: 6,
            explanation: `Going right from ${val} to extend zigzag (length ${length} -> ${length + 1}). Going left would reset to 1.`,
            variables: { direction: 'right extends', newLength: length + 1 },
            visualization: {
              type: 'tree',
              nodes: [...tree] as number[],
              highlights: { [pos]: 'active', [rightPos]: 'comparing' },
            },
          });
        }
        dfs(leftPos, true, 1, [...path]);  // reset
        dfs(rightPos, false, length + 1, [...path]); // extend
      } else {
        // Last move was right, to zigzag go left
        if (leftPos < tree.length && tree[leftPos] !== null && tree[leftPos] !== undefined) {
          steps.push({
            line: 8,
            explanation: `Going left from ${val} to extend zigzag (length ${length} -> ${length + 1}). Going right would reset to 1.`,
            variables: { direction: 'left extends', newLength: length + 1 },
            visualization: {
              type: 'tree',
              nodes: [...tree] as number[],
              highlights: { [pos]: 'active', [leftPos]: 'comparing' },
            },
          });
        }
        dfs(leftPos, true, length + 1, [...path]); // extend
        dfs(rightPos, false, 1, [...path]); // reset
      }

      path.pop();
    }

    dfs(0, true, 0, []);
    dfs(0, false, 0, []);

    steps.push({
      line: 12,
      explanation: `Longest zigzag path = ${maxLen}. Best path positions: [${currentBestPath.join(' -> ')}].`,
      variables: { result: maxLen, bestPath: JSON.stringify(currentBestPath) },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(currentBestPath.map(p => [p, 'found'])),
      },
    });

    return steps;
  },
};

export default longestZigzagPath;
