import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const createSortedArrayThroughInstructions: AlgorithmDefinition = {
  id: 'create-sorted-array-through-instructions',
  title: 'Create Sorted Array through Instructions',
  leetcodeNumber: 1649,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Insert each element of instructions into a sorted array. The cost to insert instructions[i] is min(count of elements < instructions[i], count of elements > instructions[i]) already in the array. Return total cost mod 1e9+7. Use a BIT for O(log n) counting.',
  tags: ['Binary Indexed Tree', 'Segment Tree', 'Merge Sort', 'Array'],
  code: {
    pseudocode: `function createSortedArray(instructions):
  MOD = 1e9 + 7
  maxVal = max(instructions)
  bit = BIT of size maxVal + 1
  total = 0, count = 0

  for x in instructions:
    less = query(x - 1)       // elements < x
    greater = count - query(x) // elements > x
    total = (total + min(less, greater)) % MOD
    update(x, +1)
    count++

  return total`,
    python: `class Solution:
    def createSortedArray(self, instructions):
        MOD = 10**9 + 7
        maxVal = max(instructions)
        bit = [0] * (maxVal + 2)
        def update(i):
            while i <= maxVal:
                bit[i] += 1
                i += i & (-i)
        def query(i):
            s = 0
            while i > 0:
                s += bit[i]
                i -= i & (-i)
            return s
        total, cnt = 0, 0
        for x in instructions:
            less = query(x - 1)
            greater = cnt - query(x)
            total = (total + min(less, greater)) % MOD
            update(x)
            cnt += 1
        return total`,
    javascript: `var createSortedArray = function(instructions) {
  const MOD = 1e9+7;
  const maxVal = Math.max(...instructions);
  const bit = new Array(maxVal+2).fill(0);
  const update = i => { for(;i<=maxVal;i+=i&-i) bit[i]++; };
  const query = i => { let s=0; for(;i>0;i-=i&-i) s+=bit[i]; return s; };
  let total=0, cnt=0;
  for (const x of instructions) {
    const less = query(x-1);
    const greater = cnt - query(x);
    total = (total + Math.min(less,greater)) % MOD;
    update(x); cnt++;
  }
  return total;
};`,
    java: `class Solution {
    int[] bit; int maxVal;
    public int createSortedArray(int[] instructions) {
        final int MOD = (int)1e9+7;
        maxVal = Arrays.stream(instructions).max().getAsInt();
        bit = new int[maxVal+2];
        long total=0; int cnt=0;
        for (int x : instructions) {
            int less=query(x-1), greater=cnt-query(x);
            total=(total+Math.min(less,greater))%MOD;
            update(x); cnt++;
        }
        return (int)total;
    }
    void update(int i){for(;i<=maxVal;i+=i&-i)bit[i]++;}
    int query(int i){int s=0;for(;i>0;i-=i&-i)s+=bit[i];return s;}
}`,
  },
  defaultInput: { instructions: [1,5,6,2] },
  inputFields: [
    { name: 'instructions', label: 'Instructions', type: 'array', defaultValue: [1,5,6,2], placeholder: '1,5,6,2', helperText: 'Values to insert' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const instructions = input.instructions as number[];
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;

    const maxVal = Math.max(...instructions);
    const bit = new Array(maxVal + 2).fill(0);
    const update = (i: number) => { for (; i <= maxVal; i += i & -i) bit[i]++; };
    const query = (i: number) => { let s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };

    steps.push({
      line: 1,
      explanation: `Build sorted array from instructions=[${instructions.join(',')}]. Cost = sum of min(less, greater) at each insert.`,
      variables: { instructions },
      visualization: { type: 'array', array: instructions, highlights: {}, labels: {} },
    });

    let total = 0, cnt = 0;
    const costsArr: number[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const x = instructions[i];
      const less = x > 1 ? query(x - 1) : 0;
      const greater = cnt - query(x);
      const cost = Math.min(less, greater);
      total = (total + cost) % MOD;
      costsArr.push(cost);
      update(x);
      cnt++;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j <= i; j++) {
        highlights[j] = j === i ? 'active' : 'visited';
        labels[j] = `c=${costsArr[j]}`;
      }

      steps.push({
        line: 8,
        explanation: `Insert ${x}: less=${less}, greater=${greater}, cost=min(${less},${greater})=${cost}. Running total=${total}`,
        variables: { x, less, greater, cost, total, cnt },
        visualization: { type: 'array', array: instructions.slice(0, i+1), highlights, labels },
      });
    }

    steps.push({
      line: 12,
      explanation: `Total cost: ${total} (mod 1e9+7)`,
      variables: { total },
      visualization: {
        type: 'array',
        array: costsArr,
        highlights: Object.fromEntries(costsArr.map((_, i) => [i, 'found'])),
        labels: { 0: `total=${total}` },
      },
    });

    return steps;
  },
};

export default createSortedArrayThroughInstructions;
