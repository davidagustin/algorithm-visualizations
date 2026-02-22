import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stepByStepDirectionsBinaryTree: AlgorithmDefinition = {
  id: 'step-by-step-directions-binary-tree',
  title: 'Step-By-Step Directions From a Binary Tree Node to Another',
  leetcodeNumber: 2096,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree and two node values startValue and destValue, find the shortest path from start to destination. Return directions as a string of "L", "R", "U" characters. Find paths from root to start and destination, remove the common prefix (LCA), then prepend "U" for each step up from start to LCA and append the path from LCA to destination.',
  tags: ['tree', 'dfs', 'lca', 'string'],

  code: {
    pseudocode: `function getDirections(root, start, dest):
  pathToStart = []
  pathToDest = []

  function findPath(node, target, path):
    if node is null: return false
    if node.val == target: return true
    path.push('L')
    if findPath(node.left, target, path): return true
    path.pop()
    path.push('R')
    if findPath(node.right, target, path): return true
    path.pop()
    return false

  findPath(root, start, pathToStart)
  findPath(root, dest, pathToDest)

  # Remove common prefix (LCA)
  i = 0
  while i < len(pathToStart) and i < len(pathToDest)
        and pathToStart[i] == pathToDest[i]:
    i++

  return 'U' * (len(pathToStart) - i) + pathToDest[i:]`,
    python: `def getDirections(root, startValue, destValue):
    def find(node, val, path):
        if not node: return False
        if node.val == val: return True
        path.append('L')
        if find(node.left, val, path): return True
        path.pop()
        path.append('R')
        if find(node.right, val, path): return True
        path.pop()
        return False
    ps, pd = [], []
    find(root, startValue, ps)
    find(root, destValue, pd)
    i = 0
    while i < len(ps) and i < len(pd) and ps[i] == pd[i]:
        i += 1
    return 'U' * (len(ps) - i) + ''.join(pd[i:])`,
    javascript: `function getDirections(root, startValue, destValue) {
  function find(node, val, path) {
    if (!node) return false;
    if (node.val === val) return true;
    path.push('L');
    if (find(node.left, val, path)) return true;
    path.pop();
    path.push('R');
    if (find(node.right, val, path)) return true;
    path.pop();
    return false;
  }
  const ps = [], pd = [];
  find(root, startValue, ps);
  find(root, destValue, pd);
  let i = 0;
  while (i < ps.length && i < pd.length && ps[i] === pd[i]) i++;
  return 'U'.repeat(ps.length - i) + pd.slice(i).join('');
}`,
    java: `public String getDirections(TreeNode root, int startValue, int destValue) {
    List<Character> ps = new ArrayList<>(), pd = new ArrayList<>();
    find(root, startValue, ps);
    find(root, destValue, pd);
    int i = 0;
    while (i < ps.size() && i < pd.size() && ps.get(i).equals(pd.get(i))) i++;
    StringBuilder sb = new StringBuilder();
    for (int j = i; j < ps.size(); j++) sb.append('U');
    for (int j = i; j < pd.size(); j++) sb.append(pd.get(j));
    return sb.toString();
}`,
  },

  defaultInput: {
    nums: [5, 1, 2, 3, 0, 6, 4],
    start: 3,
    dest: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [5, 1, 2, 3, 0, 6, 4],
      placeholder: '5,1,2,3,0,6,4',
      helperText: 'Level-order binary tree',
    },
    {
      name: 'start',
      label: 'Start Node Value',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Value of the start node',
    },
    {
      name: 'dest',
      label: 'Destination Node Value',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Value of the destination node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const startVal = input.start as number;
    const destVal = input.dest as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find path from node ${startVal} to node ${destVal}. Strategy: find paths from root to each, then use LCA to compute directions.`,
      variables: { start: startVal, dest: destVal },
      visualization: makeViz({}, {}),
    });

    const pathToStart: string[] = [];
    const pathToDest: string[] = [];
    const startIndices: number[] = [];
    const destIndices: number[] = [];

    function findPath(idx: number, target: number, path: string[], pathIndices: number[]): boolean {
      if (idx >= nums.length || nums[idx] === 0) return false;
      pathIndices.push(idx);
      if (nums[idx] === target) return true;
      path.push('L');
      if (findPath(2 * idx + 1, target, path, pathIndices)) return true;
      path.pop();
      pathIndices.pop();

      pathIndices.push(idx);
      path.push('R');
      if (findPath(2 * idx + 2, target, path, pathIndices)) return true;
      path.pop();
      pathIndices.pop();

      return false;
    }

    findPath(0, startVal, pathToStart, startIndices);
    findPath(0, destVal, pathToDest, destIndices);

    const startHighlights: Record<number, string> = {};
    const startLabels: Record<number, string> = {};
    startIndices.forEach((idx, pos) => {
      startHighlights[idx] = pos === startIndices.length - 1 ? 'found' : 'active';
      startLabels[idx] = pathToStart.slice(0, pos).join('') || 'root';
    });

    steps.push({
      line: 14,
      explanation: `Path from root to start (${startVal}): [${pathToStart.join(', ')}] through nodes [${startIndices.map(i => nums[i]).join(' -> ')}].`,
      variables: { pathToStart: pathToStart.join(''), startIndices: startIndices.map(i => nums[i]) },
      visualization: makeViz(startHighlights, startLabels),
    });

    const destHighlights: Record<number, string> = {};
    const destLabels: Record<number, string> = {};
    destIndices.forEach((idx, pos) => {
      destHighlights[idx] = pos === destIndices.length - 1 ? 'found' : 'visiting';
      destLabels[idx] = pathToDest.slice(0, pos).join('') || 'root';
    });

    steps.push({
      line: 15,
      explanation: `Path from root to dest (${destVal}): [${pathToDest.join(', ')}] through nodes [${destIndices.map(i => nums[i]).join(' -> ')}].`,
      variables: { pathToDest: pathToDest.join(''), destIndices: destIndices.map(i => nums[i]) },
      visualization: makeViz(destHighlights, destLabels),
    });

    let i = 0;
    while (i < pathToStart.length && i < pathToDest.length && pathToStart[i] === pathToDest[i]) i++;

    const lcaIdx = i > 0 ? startIndices[i - 1] : 0;
    const upSteps = 'U'.repeat(pathToStart.length - i);
    const downPath = pathToDest.slice(i).join('');
    const result = upSteps + downPath;

    steps.push({
      line: 19,
      explanation: `Common prefix length = ${i}. LCA is node ${nums[lcaIdx]}. Go up ${pathToStart.length - i} steps, then down path "${downPath}".`,
      variables: { commonPrefixLen: i, lcaNode: nums[lcaIdx], upSteps, downPath },
      visualization: makeViz(
        { ...startHighlights, ...destHighlights, [lcaIdx]: 'comparing' },
        { [lcaIdx]: 'LCA' }
      ),
    });

    steps.push({
      line: 21,
      explanation: `Result directions: "${result}". "${upSteps}" = go up to LCA, "${downPath}" = go down to destination.`,
      variables: { result, upCount: pathToStart.length - i, downPath },
      visualization: makeViz(
        Object.fromEntries([...startIndices, ...destIndices].map(idx => [idx, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default stepByStepDirectionsBinaryTree;
