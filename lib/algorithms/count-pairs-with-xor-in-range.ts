import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPairsWithXorInRange: AlgorithmDefinition = {
  id: 'count-pairs-with-xor-in-range',
  title: 'Count Pairs With XOR in a Range',
  leetcodeNumber: 1803,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Count the number of pairs (i, j) with i < j such that low <= nums[i] XOR nums[j] <= high. Use a binary trie: for each number inserted, count how many previously inserted numbers give XOR < high+1 and subtract those giving XOR < low. This bit-by-bit counting in the trie runs in O(n * 32) time.',
  tags: ['trie', 'bit manipulation', 'counting', 'xor'],

  code: {
    pseudocode: `function countPairs(nums, low, high):
  trie = BinaryTrie with counts
  answer = 0
  for num in nums:
    answer += countLess(trie, num, high + 1)
    answer -= countLess(trie, num, low)
    trie.insert(num)
  return answer

countLess(trie, x, limit):
  count = 0
  node = root
  for bit from 31 down to 0:
    xBit = (x >> bit) & 1
    lBit = (limit >> bit) & 1
    if lBit == 1:
      if node.children[xBit]: count += node.children[xBit].count
      node = node.children[1 - xBit]
    else:
      node = node.children[xBit]
    if node is None: break
  return count`,

    python: `def countPairs(nums, low, high):
    trie = {}  # simplified as dict
    def insert(n):
        node = trie
        for b in range(14, -1, -1):
            bit = (n >> b) & 1
            if bit not in node: node[bit] = {'count': 0}
            node[bit]['count'] += 1
            node = node[bit]
    def count_less(x, limit):
        node = trie; cnt = 0
        for b in range(14, -1, -1):
            xb = (x >> b) & 1; lb = (limit >> b) & 1
            if lb:
                if xb in node: cnt += node[xb].get('count', 0)
                nxt = 1 - xb
            else:
                nxt = xb
            if nxt not in node: break
            node = node[nxt]
        return cnt
    ans = 0
    for n in nums:
        ans += count_less(n, high + 1) - count_less(n, low)
        insert(n)
    return ans`,

    javascript: `function countPairs(nums, low, high) {
  class TrieNode { constructor() { this.ch = [null, null]; this.cnt = 0; } }
  const root = new TrieNode();
  function insert(n) {
    let node = root;
    for (let b = 14; b >= 0; b--) {
      const bit = (n >> b) & 1;
      if (!node.ch[bit]) node.ch[bit] = new TrieNode();
      node = node.ch[bit]; node.cnt++;
    }
  }
  function countLess(x, limit) {
    let node = root, cnt = 0;
    for (let b = 14; b >= 0; b--) {
      const xb = (x >> b) & 1, lb = (limit >> b) & 1;
      if (lb) {
        if (node.ch[xb]) cnt += node.ch[xb].cnt;
        node = node.ch[1 - xb];
      } else { node = node.ch[xb]; }
      if (!node) break;
    }
    return cnt;
  }
  let ans = 0;
  for (const n of nums) {
    ans += countLess(n, high + 1) - countLess(n, low); insert(n);
  }
  return ans;
}`,

    java: `// Binary trie with subtree counts for range XOR counting`,
  },

  defaultInput: {
    nums: [1, 4, 2, 7],
    low: 2,
    high: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 4, 2, 7],
      placeholder: '1,4,2,7',
      helperText: 'Array of integers',
    },
    {
      name: 'low',
      label: 'Low',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Lower bound of XOR range (inclusive)',
    },
    {
      name: 'high',
      label: 'High',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Upper bound of XOR range (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const low = input.low as number;
    const high = input.high as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count pairs (i,j) where ${low} <= nums[i] XOR nums[j] <= ${high}. Array: [${nums.join(', ')}]. Use binary trie with subtree counts.`,
      variables: { nums: nums.join(', '), low, high },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'active'])), Object.fromEntries(nums.map((v, i) => [i, v.toString()]))),
    });

    let answer = 0;
    const insertedNums: number[] = [];

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];

      // Count pairs using brute force (correct for small inputs, illustrates the concept)
      let countHigh = 0;
      let countLow2 = 0;
      for (const prev of insertedNums) {
        const xorVal = prev ^ num;
        if (xorVal < high + 1) countHigh++;
        if (xorVal < low) countLow2++;
      }
      const contribution = countHigh - countLow2;
      answer += contribution;

      steps.push({
        line: 4,
        explanation: `Process nums[${ni}] = ${num}. Among previously inserted [${insertedNums.join(', ')}], pairs with XOR <= ${high}: ${countHigh}, pairs with XOR < ${low}: ${countLow2}. New pairs in range: ${contribution}. Running total: ${answer}.`,
        variables: { num, countHigh, countLow2, contribution, runningTotal: answer },
        visualization: makeViz(
          insertedNums.map((v) => v ^ num),
          Object.fromEntries(insertedNums.map((v, i) => {
            const xv = v ^ num;
            return [i, xv >= low && xv <= high ? 'found' : 'default'];
          })),
          Object.fromEntries(insertedNums.map((v, i) => [i, `${v}^${num}=${v ^ num}`]))
        ),
      });

      insertedNums.push(num);

      steps.push({
        line: 8,
        explanation: `Inserted ${num} into binary trie. Trie now has: [${insertedNums.join(', ')}].`,
        variables: { inserted: num, trieSize: insertedNums.length },
        visualization: makeViz(insertedNums, { [insertedNums.length - 1]: 'active' }, Object.fromEntries(insertedNums.map((v, i) => [i, v.toString()]))),
      });
    }

    steps.push({
      line: 9,
      explanation: `Total pairs with XOR in range [${low}, ${high}]: ${answer}.`,
      variables: { answer, low, high },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'found'])), Object.fromEntries(nums.map((v, i) => [i, v.toString()]))),
    });

    return steps;
  },
};

export default countPairsWithXorInRange;
