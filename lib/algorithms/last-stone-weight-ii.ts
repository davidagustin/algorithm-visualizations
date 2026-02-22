import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const lastStoneWeightIi: AlgorithmDefinition = {
  id: 'last-stone-weight-ii',
  title: 'Last Stone Weight II',
  leetcodeNumber: 1049,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Partition stones into two groups to minimize the absolute difference of their sums. Equivalent to finding the subset sum closest to total/2. Uses a boolean DP set: for each stone, update reachable sums. Answer is total - 2 * (best reachable sum <= total/2).',
  tags: ['dynamic programming', 'subset sum', 'array', 'knapsack'],

  code: {
    pseudocode: `function lastStoneWeightII(stones):
  total = sum(stones)
  target = total // 2
  dp = set {0}
  for stone in stones:
    dp = {s + stone for s in dp} | dp
    // keep only sums <= target
  best = max(s for s in dp if s <= target)
  return total - 2 * best`,

    python: `def lastStoneWeightII(stones):
    total = sum(stones)
    target = total // 2
    dp = {0}
    for stone in stones:
        dp = {s + stone for s in dp} | dp
    best = max(s for s in dp if s <= target)
    return total - 2 * best`,

    javascript: `function lastStoneWeightII(stones) {
  const total = stones.reduce((a,b)=>a+b,0);
  const target = total>>1;
  let dp = new Set([0]);
  for (const stone of stones) {
    const ndp = new Set(dp);
    for (const s of dp) if (s+stone<=target) ndp.add(s+stone);
    dp = ndp;
  }
  const best = Math.max(...dp);
  return total - 2*best;
}`,

    java: `public int lastStoneWeightII(int[] stones) {
    int total = 0;
    for (int s : stones) total += s;
    int target = total/2;
    boolean[] dp = new boolean[target+1];
    dp[0] = true;
    for (int stone : stones) {
        for (int j=target; j>=stone; j--) {
            dp[j] = dp[j] || dp[j-stone];
        }
    }
    for (int j=target; j>=0; j--) {
        if (dp[j]) return total-2*j;
    }
    return 0;
}`,
  },

  defaultInput: {
    stones: [2, 7, 4, 1, 8, 1],
  },

  inputFields: [
    {
      name: 'stones',
      label: 'Stone Weights',
      type: 'array',
      defaultValue: [2, 7, 4, 1, 8, 1],
      placeholder: '2,7,4,1,8,1',
      helperText: 'Weights of stones to smash',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[];
    const steps: AlgorithmStep[] = [];
    const total = stones.reduce((a, b) => a + b, 0);
    const target = Math.floor(total / 2);

    const dp = new Set<number>([0]);

    steps.push({
      line: 1,
      explanation: `Stones: [${stones.join(', ')}]. Total=${total}, target=${target} (half total). Find largest subset sum <= ${target}.`,
      variables: { total, target, reachableSums: [0] },
      visualization: {
        type: 'array',
        array: stones,
        highlights: {},
        labels: Object.fromEntries(stones.map((v, i) => [i, `${v}`])),
      },
    });

    for (let si = 0; si < stones.length; si++) {
      const stone = stones[si];
      const toAdd: number[] = [];
      for (const s of dp) {
        if (s + stone <= target) toAdd.push(s + stone);
      }
      for (const v of toAdd) dp.add(v);

      const reachable = [...dp].sort((a, b) => a - b);
      steps.push({
        line: 4,
        explanation: `Added stone ${stone} (index ${si + 1}/${stones.length}). Reachable sums <= ${target}: [${reachable.join(', ')}].`,
        variables: { stone, stoneIndex: si + 1, reachableSums: reachable, count: reachable.length },
        visualization: {
          type: 'array',
          array: reachable,
          highlights: { [reachable.length - 1]: 'active' },
          labels: Object.fromEntries(reachable.map((v, i) => [i, `${v}`])),
        },
      });
    }

    const best = Math.max(...dp);
    const ans = total - 2 * best;

    steps.push({
      line: 7,
      explanation: `Best subset sum <= ${target} is ${best}. Min difference = total - 2*best = ${total} - 2*${best} = ${ans}.`,
      variables: { best, total, answer: ans },
      visualization: {
        type: 'array',
        array: [...dp].sort((a, b) => a - b),
        highlights: { [[...dp].sort((a, b) => a - b).indexOf(best)]: 'found' },
        labels: {},
      },
    });

    return steps;
  },
};

export default lastStoneWeightIi;
