import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumXorWithTrie: AlgorithmDefinition = {
  id: 'maximum-xor-with-trie',
  title: 'Maximum XOR of Two Numbers in an Array (Trie)',
  leetcodeNumber: 421,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Find the maximum XOR of any two numbers in an array. Build a binary trie where each number is inserted as a 32-bit binary string. To find max XOR for each number, greedily traverse the trie choosing the opposite bit (1 vs 0) at each level to maximize the XOR result. This gives O(n) query time after O(n) build.',
  tags: ['trie', 'binary trie', 'bit manipulation', 'greedy'],

  code: {
    pseudocode: `function findMaximumXOR(nums):
  build binary trie from all nums
  maxXor = 0
  for num in nums:
    xor = 0, node = root
    for bit from 31 to 0:
      curBit = (num >> bit) & 1
      want = 1 - curBit
      if want in node:
        xor |= (1 << bit)
        node = node[want]
      else:
        node = node[curBit]
    maxXor = max(maxXor, xor)
  return maxXor`,

    python: `def findMaximumXOR(nums):
    max_xor = 0
    mask = 0
    for i in range(31, -1, -1):
        mask |= 1 << i
        prefixes = {num & mask for num in nums}
        candidate = max_xor | (1 << i)
        if any(candidate ^ p in prefixes for p in prefixes):
            max_xor = candidate
    return max_xor`,

    javascript: `function findMaximumXOR(nums) {
  const root = [null, null];
  for (const num of nums) {
    let node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node[bit]) node[bit] = [null, null];
      node = node[bit];
    }
  }
  let maxXor = 0;
  for (const num of nums) {
    let xor = 0, node = root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1, want = 1 - bit;
      if (node[want]) { xor |= (1 << i); node = node[want]; }
      else node = node[bit];
    }
    maxXor = Math.max(maxXor, xor);
  }
  return maxXor;
}`,

    java: `public int findMaximumXOR(int[] nums) {
    int[][] trie = new int[32*nums.length][2];
    int size = 1;
    for (int num : nums) {
        int node = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (trie[node][bit] == 0) trie[node][bit] = size++;
            node = trie[node][bit];
        }
    }
    int maxXor = 0;
    for (int num : nums) {
        int node = 0, xor = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1, want = 1 - bit;
            if (trie[node][want] != 0) { xor |= (1 << i); node = trie[node][want]; }
            else node = trie[node][bit];
        }
        maxXor = Math.max(maxXor, xor);
    }
    return maxXor;
}`,
  },

  defaultInput: {
    nums: [3, 10, 5, 25, 2, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 10, 5, 25, 2, 8],
      placeholder: '3,10,5,25,2,8',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const BITS = 5; // Use fewer bits for visualization clarity

    steps.push({
      line: 1,
      explanation: `Build binary trie from nums=[${nums.join(', ')}]. Each number inserted bit by bit (MSB first).`,
      variables: { nums: `[${nums.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}(${v.toString(2).padStart(BITS, '0')})`])),
      },
    });

    // Simple binary trie using nested arrays
    type TrieNode = [TrieNode | null, TrieNode | null];
    const root: TrieNode = [null, null];

    for (const num of nums) {
      let node = root;
      for (let i = BITS - 1; i >= 0; i--) {
        const bit = (num >> i) & 1;
        if (!node[bit]) node[bit] = [null, null];
        node = node[bit]!;
      }
    }

    steps.push({
      line: 2,
      explanation: `Trie built with ${nums.length} numbers. Now query each number greedily to find max XOR.`,
      variables: { numbers: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, v.toString(2).padStart(BITS, '0')])),
      },
    });

    let maxXor = 0;

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];
      let xor = 0;
      let node = root;

      steps.push({
        line: 4,
        explanation: `Find max XOR for num=${num} (${num.toString(2).padStart(BITS, '0')}). Traverse trie greedily.`,
        variables: { num, binary: num.toString(2).padStart(BITS, '0') },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [ni]: 'active' },
          labels: Object.fromEntries(nums.map((v, i) => [i, i === ni ? `${v}*` : `${v}`])),
        },
      });

      for (let i = BITS - 1; i >= 0; i--) {
        const bit = (num >> i) & 1;
        const want = 1 - bit;
        if (node[want]) {
          xor |= (1 << i);
          node = node[want]!;
          steps.push({
            line: 8,
            explanation: `Bit ${i}: num bit=${bit}, want opposite=${want}. Branch ${want} exists! xor bit set. xor so far=${xor}(${xor.toString(2).padStart(BITS, '0')}).`,
            variables: { bit: i, numBit: bit, want, xor, binary: xor.toString(2).padStart(BITS, '0') },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [ni]: 'found' },
              labels: Object.fromEntries(nums.map((v, j) => [j, j === ni ? `xor=${xor}` : `${v}`])),
            },
          });
        } else {
          node = node[bit]!;
          steps.push({
            line: 10,
            explanation: `Bit ${i}: num bit=${bit}, want opposite=${want}. Branch ${want} absent. Take ${bit} instead. xor unchanged=${xor}.`,
            variables: { bit: i, numBit: bit, want, xor },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [ni]: 'comparing' },
              labels: Object.fromEntries(nums.map((v, j) => [j, j === ni ? `xor=${xor}` : `${v}`])),
            },
          });
        }
      }

      if (xor > maxXor) {
        maxXor = xor;
        steps.push({
          line: 11,
          explanation: `New max XOR found: ${maxXor} from num=${num} paired with another number in the trie.`,
          variables: { maxXor, num },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [ni]: 'found' },
            labels: Object.fromEntries(nums.map((v, j) => [j, j === ni ? `maxXor=${maxXor}` : `${v}`])),
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Maximum XOR = ${maxXor}.`,
      variables: { result: maxXor },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: { 0: `Result: ${maxXor}` },
      },
    });

    return steps;
  },
};

export default maximumXorWithTrie;
