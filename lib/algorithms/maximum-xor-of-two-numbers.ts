import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumXorOfTwoNumbers: AlgorithmDefinition = {
  id: 'maximum-xor-of-two-numbers',
  title: 'Maximum XOR of Two Numbers in an Array',
  leetcodeNumber: 421,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given an integer array, return the maximum XOR of any two elements. Build the answer greedily bit by bit from the most significant bit. For each bit position, check if there exist two numbers whose XOR has that bit set by inserting prefixes into a hash set and checking complements.',
  tags: ['bit manipulation', 'trie', 'hash set', 'greedy'],

  code: {
    pseudocode: `function findMaximumXOR(nums):
  max_xor = 0
  mask = 0
  for i from 31 down to 0:
    mask |= (1 << i)
    prefixes = set of (n & mask) for n in nums
    candidate = max_xor | (1 << i)
    for prefix in prefixes:
      if (candidate ^ prefix) in prefixes:
        max_xor = candidate
        break
  return max_xor`,

    python: `def findMaximumXOR(nums):
    max_xor = 0
    mask = 0
    for i in range(31, -1, -1):
        mask |= (1 << i)
        prefixes = {n & mask for n in nums}
        candidate = max_xor | (1 << i)
        for prefix in prefixes:
            if candidate ^ prefix in prefixes:
                max_xor = candidate
                break
    return max_xor`,

    javascript: `function findMaximumXOR(nums) {
  let maxXor = 0, mask = 0;
  for (let i = 31; i >= 0; i--) {
    mask |= (1 << i);
    const prefixes = new Set(nums.map(n => n & mask));
    const candidate = maxXor | (1 << i);
    for (const p of prefixes) {
      if (prefixes.has(candidate ^ p)) { maxXor = candidate; break; }
    }
  }
  return maxXor;
}`,

    java: `public int findMaximumXOR(int[] nums) {
    int maxXor = 0, mask = 0;
    for (int i = 31; i >= 0; i--) {
        mask |= (1 << i);
        Set<Integer> set = new HashSet<>();
        for (int n : nums) set.add(n & mask);
        int candidate = maxXor | (1 << i);
        for (int p : set) {
            if (set.contains(candidate ^ p)) { maxXor = candidate; break; }
        }
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
      helperText: 'Non-negative integers',
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
      explanation: `Find maximum XOR of any two numbers in [${nums.join(', ')}]. Build greedily from most significant bit.`,
      variables: { maxXor: 0, mask: 0 },
      visualization: makeViz({}, {}),
    });

    let maxXor = 0;
    let mask = 0;
    const maxBit = 4; // limit to 5 bits for visualization clarity

    for (let i = maxBit; i >= 0; i--) {
      mask |= (1 << i);
      const prefixes = new Set(nums.map(n => n & mask));
      const candidate = maxXor | (1 << i);

      steps.push({
        line: 4,
        explanation: `Bit ${i}: mask = ${mask.toString(2).padStart(5,'0')}. Candidate = ${candidate} (try setting bit ${i}). Check if achievable.`,
        variables: { bit: i, mask, candidate, maxXor, prefixes: [...prefixes] },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, idx) => [idx, 'active'])),
          Object.fromEntries(nums.map((n, idx) => [idx, (n & mask).toString(2)]))
        ),
      });

      let achieved = false;
      for (const p of prefixes) {
        if (prefixes.has(candidate ^ p)) {
          maxXor = candidate;
          achieved = true;
          steps.push({
            line: 8,
            explanation: `Prefix ${p.toString(2)} XOR complement ${(candidate ^ p).toString(2)} both exist. Bit ${i} achievable! maxXor = ${maxXor}.`,
            variables: { prefix: p, complement: candidate ^ p, maxXor, bit: i },
            visualization: makeViz(
              Object.fromEntries(nums.map((n, idx) => [idx, (n & mask) === p || (n & mask) === (candidate ^ p) ? 'found' : 'default'])),
              {}
            ),
          });
          break;
        }
      }
      if (!achieved) {
        steps.push({
          line: 8,
          explanation: `Bit ${i} not achievable. maxXor stays ${maxXor}.`,
          variables: { bit: i, maxXor },
          visualization: makeViz({}, {}),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Maximum XOR = ${maxXor} (binary: ${maxXor.toString(2)}).`,
      variables: { result: maxXor },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default maximumXorOfTwoNumbers;
