import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findModeInBst: AlgorithmDefinition = {
  id: 'find-mode-in-bst',
  title: 'Find Mode in Binary Search Tree',
  leetcodeNumber: 501,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST with possible duplicates, find all modes (most frequently occurring elements). Use inorder traversal which visits nodes in sorted order. Track current value, current count, and maximum count. When count exceeds max, update result.',
  tags: ['tree', 'BST', 'inorder', 'mode', 'frequency'],

  code: {
    pseudocode: `function findMode(root):
  maxCount = 0, curCount = 0, curVal = null
  modes = []
  inorder(root):
    if node.val == curVal: curCount++
    else: curCount = 1, curVal = node.val
    if curCount > maxCount:
      maxCount = curCount, modes = [curVal]
    elif curCount == maxCount:
      modes.append(curVal)
  return modes`,

    python: `def findMode(root):
    max_count = cur_count = 0
    cur_val = None
    modes = []

    def inorder(node):
        nonlocal max_count, cur_count, cur_val, modes
        if not node: return
        inorder(node.left)
        if node.val == cur_val:
            cur_count += 1
        else:
            cur_count = 1
            cur_val = node.val
        if cur_count > max_count:
            max_count = cur_count
            modes = [cur_val]
        elif cur_count == max_count:
            modes.append(cur_val)
        inorder(node.right)

    inorder(root)
    return modes`,

    javascript: `function findMode(root) {
  let maxCount = 0, curCount = 0, curVal = null;
  const modes = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    curCount = node.val === curVal ? curCount + 1 : 1;
    curVal = node.val;
    if (curCount > maxCount) { maxCount = curCount; modes.length = 0; modes.push(curVal); }
    else if (curCount === maxCount) modes.push(curVal);
    inorder(node.right);
  }
  inorder(root);
  return modes;
}`,

    java: `public int[] findMode(TreeNode root) {
    List<Integer> modes = new ArrayList<>();
    int[] state = {0, 0, Integer.MIN_VALUE}; // maxCount, curCount, curVal
    inorder(root, modes, state);
    return modes.stream().mapToInt(i -> i).toArray();
}`,
  },

  defaultInput: {
    tree: [1, null, 2, null, null, 2],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [1, null, 2, null, null, 2],
      placeholder: '1,null,2,null,null,2',
      helperText: 'Level-order BST that may contain duplicates',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find mode(s) in BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Perform inorder traversal to visit nodes in sorted order.`,
      variables: { maxCount: 0, curCount: 0, curVal: null, modes: '[]' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: {},
      },
    });

    let maxCount = 0;
    let curCount = 0;
    let curVal: number | null = null;
    const modes: number[] = [];
    const visitOrder: number[] = [];

    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);

      const val = tree[pos] as number;
      visitOrder.push(pos);

      if (val === curVal) {
        curCount++;
      } else {
        curCount = 1;
        curVal = val;
      }

      steps.push({
        line: 4,
        explanation: `Visit node ${val}. ${val === (visitOrder.length > 1 ? tree[visitOrder[visitOrder.length - 2]] : null) ? `Same as previous, curCount = ${curCount}` : `New value, curCount reset to 1`}. maxCount = ${maxCount}.`,
        variables: { val, curCount, maxCount, curVal, modes: JSON.stringify(modes) },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, 'visited'])),
            [pos]: 'active',
            ...Object.fromEntries(
              visitOrder.filter(p => modes.includes(tree[p] as number)).map(p => [p, 'found'])
            ),
          },
        },
      });

      if (curCount > maxCount) {
        maxCount = curCount;
        modes.length = 0;
        modes.push(val);
        steps.push({
          line: 7,
          explanation: `curCount ${curCount} > maxCount. New max! maxCount = ${maxCount}, modes = [${modes}].`,
          variables: { val, curCount, maxCount, modes: JSON.stringify(modes) },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visitOrder.map(p => [p, tree[p] === val ? 'found' : 'visited'])),
              [pos]: 'found',
            },
          },
        });
      } else if (curCount === maxCount) {
        modes.push(val);
        steps.push({
          line: 9,
          explanation: `curCount ${curCount} equals maxCount. Add ${val} to modes. modes = [${modes}].`,
          variables: { val, curCount, maxCount, modes: JSON.stringify(modes) },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visitOrder.map(p => [p, 'visited'])),
              [pos]: 'found',
            },
          },
        });
      }

      inorder(2 * pos + 2);
    }

    inorder(0);

    steps.push({
      line: 10,
      explanation: `Mode search complete. Modes (most frequent values): [${modes.join(', ')}] with count ${maxCount}.`,
      variables: { result: JSON.stringify(modes), maxCount },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(
          visitOrder.map(p => [p, modes.includes(tree[p] as number) ? 'found' : 'visited'])
        ),
      },
    });

    return steps;
  },
};

export default findModeInBst;
