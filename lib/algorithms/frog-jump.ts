import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const frogJump: AlgorithmDefinition = {
  id: 'frog-jump',
  title: 'Frog Jump',
  leetcodeNumber: 403,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A frog wants to cross a river by jumping on stones. If the frog made its last jump of k units, it may jump k-1, k, or k+1 units next. Determine if the frog can reach the last stone. Uses a hash map of sets: for each stone, track all possible jump sizes that can reach it.',
  tags: ['dynamic programming', 'hash map', 'depth-first search'],

  code: {
    pseudocode: `function canCross(stones):
  stoneSet = map of stone -> set of jump sizes
  stoneSet[0] = {0}
  for each stone s in stones:
    for each jumpSize k in stoneSet[s]:
      for nextJump in [k-1, k, k+1]:
        if nextJump > 0 and s+nextJump in stoneSet:
          stoneSet[s+nextJump].add(nextJump)
  return stoneSet[last stone] is not empty`,

    python: `def canCross(stones):
    dp = {s: set() for s in stones}
    dp[0].add(0)
    for s in stones:
        for k in dp[s]:
            for nk in [k-1, k, k+1]:
                if nk > 0 and s + nk in dp:
                    dp[s + nk].add(nk)
    return bool(dp[stones[-1]])`,

    javascript: `function canCross(stones) {
  const dp = new Map(stones.map(s => [s, new Set()]));
  dp.get(0).add(0);
  for (const s of stones) {
    for (const k of dp.get(s)) {
      for (const nk of [k-1, k, k+1]) {
        if (nk > 0 && dp.has(s + nk)) dp.get(s + nk).add(nk);
      }
    }
  }
  return dp.get(stones[stones.length-1]).size > 0;
}`,

    java: `public boolean canCross(int[] stones) {
    Map<Integer, Set<Integer>> dp = new HashMap<>();
    for (int s : stones) dp.put(s, new HashSet<>());
    dp.get(0).add(0);
    for (int s : stones) {
        for (int k : dp.get(s)) {
            for (int nk : new int[]{k-1, k, k+1}) {
                if (nk > 0 && dp.containsKey(s + nk)) dp.get(s + nk).add(nk);
            }
        }
    }
    return !dp.get(stones[stones.length-1]).isEmpty();
}`,
  },

  defaultInput: {
    stones: [0, 1, 3, 5, 6, 8, 12, 17],
  },

  inputFields: [
    {
      name: 'stones',
      label: 'Stone Positions',
      type: 'array',
      defaultValue: [0, 1, 3, 5, 6, 8, 12, 17],
      placeholder: '0,1,3,5,6,8,12,17',
      helperText: 'Sorted list of stone positions (must start at 0)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[];
    const steps: AlgorithmStep[] = [];
    const n = stones.length;
    const dp = new Map<number, Set<number>>(stones.map(s => [s, new Set<number>()]));
    dp.get(0)!.add(0);

    const makeViz = (activeStone: number, reachable: Set<number>) => ({
      type: 'array' as const,
      array: stones,
      highlights: Object.fromEntries(
        stones.map((s, i) => [i, s === activeStone ? 'active' : reachable.has(s) ? 'found' : dp.get(s)!.size > 0 ? 'visited' : 'default'])
      ),
      labels: Object.fromEntries(
        stones.map((s, i) => [i, dp.get(s)!.size > 0 ? `{${[...dp.get(s)!].join(',')}}` : ''])
      ),
    });

    steps.push({
      line: 1,
      explanation: `Initialize: stone 0 can be reached with jump size 0. Map each stone to the set of jump sizes that can reach it.`,
      variables: { stonesCount: n, lastStone: stones[n - 1] },
      visualization: makeViz(0, new Set()),
    });

    for (let si = 0; si < n; si++) {
      const s = stones[si];
      const jumps = dp.get(s)!;
      if (jumps.size === 0) continue;

      const reachable = new Set<number>();
      for (const k of jumps) {
        for (const nk of [k - 1, k, k + 1]) {
          if (nk > 0 && dp.has(s + nk)) {
            dp.get(s + nk)!.add(nk);
            reachable.add(s + nk);
          }
        }
      }

      steps.push({
        line: 5,
        explanation: `At stone position ${s} with possible jump sizes [${[...jumps].join(', ')}]. Can reach stones: [${[...reachable].join(', ')}].`,
        variables: { currentStone: s, jumpSizes: [...jumps], reachableNext: [...reachable] },
        visualization: makeViz(s, reachable),
      });
    }

    const canReach = dp.get(stones[n - 1])!.size > 0;
    steps.push({
      line: 9,
      explanation: `Result: The frog ${canReach ? 'CAN' : 'CANNOT'} cross the river. Last stone has ${dp.get(stones[n - 1])!.size} valid jump approach(es).`,
      variables: { canCross: canReach, lastStoneJumps: [...dp.get(stones[n - 1])!] },
      visualization: makeViz(stones[n - 1], new Set([stones[n - 1]])),
    });

    return steps;
  },
};

export default frogJump;
