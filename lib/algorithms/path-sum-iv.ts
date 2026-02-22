import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pathSumIv: AlgorithmDefinition = {
  id: 'path-sum-iv',
  title: 'Path Sum IV',
  leetcodeNumber: 666,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'A binary tree is encoded as an array where each element is a 3-digit number: hundreds digit = depth (1-4), tens digit = position (1-based), units digit = value. Find the sum of all root-to-leaf path sums. Decode the array into a hash map keyed by (depth, position), then DFS from root using the map to compute each path sum.',
  tags: ['tree', 'dfs', 'hash map', 'encoding'],

  code: {
    pseudocode: `function pathSum(nums):
  if nums is empty: return 0
  map = {}  # (depth, pos) -> value
  for num in nums:
    depth = num // 100
    pos = (num % 100) // 10
    val = num % 10
    map[(depth, pos)] = val

  result = 0

  function dfs(depth, pos, pathSum):
    nonlocal result
    key = (depth, pos)
    if key not in map: return
    pathSum += map[key]
    leftKey = (depth+1, 2*pos-1)
    rightKey = (depth+1, 2*pos)
    if leftKey not in map and rightKey not in map:
      result += pathSum  # leaf node
      return
    dfs(depth+1, 2*pos-1, pathSum)
    dfs(depth+1, 2*pos, pathSum)

  dfs(1, 1, 0)
  return result`,
    python: `def pathSum(nums):
    if not nums: return 0
    mp = {}
    for num in nums:
        d, p, v = num // 100, (num % 100) // 10, num % 10
        mp[(d, p)] = v
    res = 0
    def dfs(d, p, s):
        nonlocal res
        if (d, p) not in mp: return
        s += mp[(d, p)]
        lk, rk = (d+1, 2*p-1), (d+1, 2*p)
        if lk not in mp and rk not in mp:
            res += s; return
        dfs(d+1, 2*p-1, s); dfs(d+1, 2*p, s)
    dfs(1, 1, 0)
    return res`,
    javascript: `function pathSum(nums) {
  if (!nums.length) return 0;
  const mp = new Map();
  for (const num of nums) {
    const d = Math.floor(num / 100);
    const p = Math.floor((num % 100) / 10);
    mp.set(\`\${d},\${p}\`, num % 10);
  }
  let res = 0;
  function dfs(d, p, s) {
    const key = \`\${d},\${p}\`;
    if (!mp.has(key)) return;
    s += mp.get(key);
    const lk = \`\${d+1},\${2*p-1}\`, rk = \`\${d+1},\${2*p}\`;
    if (!mp.has(lk) && !mp.has(rk)) { res += s; return; }
    dfs(d+1, 2*p-1, s); dfs(d+1, 2*p, s);
  }
  dfs(1, 1, 0);
  return res;
}`,
    java: `public int pathSum(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    Map<Integer, Integer> map = new HashMap<>();
    for (int num : nums) map.put(num / 10, num % 10);
    int[] res = {0};
    dfs(map, 11, 0, res);
    return res[0];
}
private void dfs(Map<Integer,Integer> map, int key, int sum, int[] res) {
    if (!map.containsKey(key)) return;
    sum += map.get(key);
    int d = key / 10, p = key % 10;
    int l = (d+1)*10 + 2*p-1, r = (d+1)*10 + 2*p;
    if (!map.containsKey(l) && !map.containsKey(r)) { res[0] += sum; return; }
    dfs(map, l, sum, res); dfs(map, r, sum, res);
}`,
  },

  defaultInput: {
    nums: [113, 215, 221],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Encoded Tree (3-digit: DPV)',
      type: 'array',
      defaultValue: [113, 215, 221],
      placeholder: '113,215,221',
      helperText: 'Each number: hundreds=depth, tens=position, units=value',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Decode ${nums.length} encoded nodes. Format: hundreds=depth, tens=position, units=value. Build map then DFS for path sums.`,
      variables: { numNodes: nums.length },
      visualization: makeViz(nums, {}, {}),
    });

    // Decode
    const nodeMap: Map<string, number> = new Map();
    const decoded: { depth: number; pos: number; val: number }[] = [];

    for (let i = 0; i < nums.length; i++) {
      const depth = Math.floor(nums[i] / 100);
      const pos = Math.floor((nums[i] % 100) / 10);
      const val = nums[i] % 10;
      nodeMap.set(`${depth},${pos}`, val);
      decoded.push({ depth, pos, val });

      steps.push({
        line: 4,
        explanation: `Decode nums[${i}]=${nums[i]}: depth=${depth}, position=${pos}, value=${val}. Map key="${depth},${pos}" -> ${val}.`,
        variables: { encoded: nums[i], depth, position: pos, value: val },
        visualization: makeViz(nums, { [i]: 'active' }, { [i]: `d${depth}p${pos}v${val}` }),
      });
    }

    let result = 0;

    function dfs(depth: number, pos: number, pathSum: number) {
      const key = `${depth},${pos}`;
      if (!nodeMap.has(key)) return;
      const val = nodeMap.get(key)!;
      pathSum += val;

      const lKey = `${depth + 1},${2 * pos - 1}`;
      const rKey = `${depth + 1},${2 * pos}`;
      const isLeaf = !nodeMap.has(lKey) && !nodeMap.has(rKey);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      const nodeIdx = decoded.findIndex(d => d.depth === depth && d.pos === pos);
      if (nodeIdx >= 0) {
        highlights[nodeIdx] = isLeaf ? 'found' : 'active';
        labels[nodeIdx] = `sum=${pathSum}`;
      }

      steps.push({
        line: isLeaf ? 18 : 16,
        explanation: `DFS at (depth=${depth}, pos=${pos}, val=${val}): pathSum=${pathSum}. ${isLeaf ? 'LEAF node! Add ' + pathSum + ' to result.' : 'Continue to children.'}`,
        variables: { depth, pos, val, pathSum, isLeaf, result: result + (isLeaf ? pathSum : 0) },
        visualization: makeViz(nums, highlights, labels),
      });

      if (isLeaf) {
        result += pathSum;
      } else {
        dfs(depth + 1, 2 * pos - 1, pathSum);
        dfs(depth + 1, 2 * pos, pathSum);
      }
    }

    dfs(1, 1, 0);

    steps.push({
      line: 22,
      explanation: `Sum of all root-to-leaf path sums = ${result}.`,
      variables: { result },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default pathSumIv;
