import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumXorWithElement: AlgorithmDefinition = {
  id: 'maximum-xor-with-element',
  title: 'Maximum XOR With an Element From Array',
  leetcodeNumber: 1707,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given an array nums and queries [xi, mi], for each query find the maximum XOR of xi with any element from nums that is <= mi. Use an offline approach: sort both nums and queries by the constraint value. Process queries in order, inserting nums <= mi into a binary trie as each query arrives, then greedily find the max XOR by choosing opposite bits.',
  tags: ['trie', 'bit manipulation', 'sorting', 'offline query', 'xor'],

  code: {
    pseudocode: `function maximizeXor(nums, queries):
  sort nums
  indexed_queries = sorted(enumerate(queries), key=lambda q: q[1][1])
  trie = BinaryTrie()
  ni = 0
  answers = [-1] * len(queries)

  for qi, (x, mi) in indexed_queries:
    while ni < len(nums) and nums[ni] <= mi:
      trie.insert(nums[ni])
      ni++
    if trie is not empty:
      answers[qi] = trie.maxXOR(x)
  return answers`,

    python: `def maximizeXor(nums, queries):
    nums.sort()
    qidx = sorted(range(len(queries)), key=lambda i: queries[i][1])
    trie = [None, None]
    def insert(n):
        node = trie
        for b in range(31, -1, -1):
            bit = (n >> b) & 1
            if not node[bit]: node[bit] = [None, None]
            node = node[bit]
    def query(n):
        node = trie
        xor = 0
        for b in range(31, -1, -1):
            bit = (n >> b) & 1
            want = 1 - bit
            if node[want]: node = node[want]; xor |= (1 << b)
            elif node[bit]: node = node[bit]
            else: return -1
        return xor
    ni = 0; ans = [-1] * len(queries)
    for qi in qidx:
        x, mi = queries[qi]
        while ni < len(nums) and nums[ni] <= mi:
            insert(nums[ni]); ni += 1
        if trie[0] or trie[1]: ans[qi] = query(x)
    return ans`,

    javascript: `function maximizeXor(nums, queries) {
  nums.sort((a, b) => a - b);
  const qidx = queries.map((_, i) => i).sort((a, b) => queries[a][1] - queries[b][1]);
  const root = [null, null];
  function insert(n) {
    let node = root;
    for (let b = 31; b >= 0; b--) {
      const bit = (n >> b) & 1;
      if (!node[bit]) node[bit] = [null, null];
      node = node[bit];
    }
  }
  function query(n) {
    let node = root, xor = 0;
    for (let b = 31; b >= 0; b--) {
      const bit = (n >> b) & 1, want = 1 - bit;
      if (node[want]) { node = node[want]; xor |= (1 << b); }
      else if (node[bit]) { node = node[bit]; }
      else return -1;
    }
    return xor;
  }
  let ni = 0; const ans = new Array(queries.length).fill(-1);
  for (const qi of qidx) {
    const [x, mi] = queries[qi];
    while (ni < nums.length && nums[ni] <= mi) insert(nums[ni++]);
    if (root[0] || root[1]) ans[qi] = query(x);
  }
  return ans;
}`,

    java: `// Offline sort + binary trie approach`,
  },

  defaultInput: {
    nums: [0, 1, 2, 3, 4],
    queries: [[3, 1], [1, 3], [5, 6]],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array nums',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4],
      placeholder: '0,1,2,3,4',
      helperText: 'The nums array',
    },
    {
      name: 'queries',
      label: 'Queries [[x, m]]',
      type: 'array',
      defaultValue: [[3, 1], [1, 3], [5, 6]],
      placeholder: '[[3,1],[1,3],[5,6]]',
      helperText: 'Each query is [x, m]: maximize x XOR element where element <= m',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice().sort((a, b) => a - b);
    const queries = input.queries as [number, number][];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort nums: [${nums.join(', ')}]. Sort queries by constraint mi. This allows us to insert eligible nums into the trie as we process each query.`,
      variables: { nums: nums.join(', '), queries: queries.length },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'active'])), Object.fromEntries(nums.map((v, i) => [i, v.toString()]))),
    });

    const qidx = queries.map((_, i) => i).sort((a, b) => queries[a][1] - queries[b][1]);

    steps.push({
      line: 3,
      explanation: `Sorted query order by mi: [${qidx.map((i) => `q${i}(mi=${queries[i][1]})`).join(', ')}]. Process cheapest constraint first.`,
      variables: { sortedOrder: qidx.join(', ') },
      visualization: makeViz(qidx.map((i) => queries[i][1]), Object.fromEntries(qidx.map((_, i) => [i, 'active'])), Object.fromEntries(qidx.map((i, idx) => [idx, `q${i}`]))),
    });

    // Simple trie simulation for small numbers
    const insertedNums: number[] = [];
    const ans: number[] = new Array(queries.length).fill(-1);
    let ni = 0;

    for (const qi of qidx) {
      const [x, mi] = queries[qi];

      while (ni < nums.length && nums[ni] <= mi) {
        insertedNums.push(nums[ni]);
        steps.push({
          line: 6,
          explanation: `Insert ${nums[ni]} into trie (${nums[ni]} <= ${mi}). Trie now has: [${insertedNums.join(', ')}].`,
          variables: { inserted: nums[ni], constraint: mi, trieSIze: insertedNums.length },
          visualization: makeViz(insertedNums, { [insertedNums.length - 1]: 'active' }, Object.fromEntries(insertedNums.map((v, i) => [i, v.toString()]))),
        });
        ni++;
      }

      if (insertedNums.length > 0) {
        ans[qi] = Math.max(...insertedNums.map((v) => v ^ x));
        steps.push({
          line: 9,
          explanation: `Query q${qi}: x=${x}, mi=${mi}. Max XOR of ${x} with any value in [${insertedNums.join(', ')}] = ${ans[qi]}.`,
          variables: { x, mi, maxXOR: ans[qi] },
          visualization: makeViz(insertedNums.map((v) => v ^ x), Object.fromEntries(insertedNums.map((v, i) => [i, (v ^ x) === ans[qi] ? 'found' : 'default'])), Object.fromEntries(insertedNums.map((v, i) => [i, `${v}^${x}=${v ^ x}`]))),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `Query q${qi}: x=${x}, mi=${mi}. No nums <= ${mi} yet, answer is -1.`,
          variables: { x, mi, answer: -1 },
          visualization: makeViz(nums, { 0: 'mismatch' }, Object.fromEntries(nums.map((v, i) => [i, v.toString()]))),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Final answers: [${ans.join(', ')}]. Each query answered by the binary trie max XOR search.`,
      variables: { answers: ans.join(', ') },
      visualization: makeViz(ans.map((v) => Math.max(0, v)), Object.fromEntries(ans.map((v, i) => [i, v >= 0 ? 'found' : 'mismatch'])), Object.fromEntries(ans.map((v, i) => [i, v.toString()]))),
    });

    return steps;
  },
};

export default maximumXorWithElement;
