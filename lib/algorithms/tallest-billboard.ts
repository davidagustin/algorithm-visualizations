import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const tallestBillboard: AlgorithmDefinition = {
  id: 'tallest-billboard',
  title: 'Tallest Billboard',
  leetcodeNumber: 956,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'You have a collection of steel rods. Weld some into two supports of equal height to hold a billboard. Find the largest possible height. Uses DP where dp[diff] = maximum height of the taller support when the difference between supports is "diff". For each rod, update states by adding it to taller, shorter, or neither support.',
  tags: ['dynamic programming', 'array', 'subset sum'],

  code: {
    pseudocode: `function tallestBillboard(rods):
  dp = {0: 0}  // diff -> max taller support height
  for rod in rods:
    newDp = copy of dp
    for diff, tall in dp:
      // add rod to taller support
      newDp[diff+rod] = max(newDp[diff+rod], tall+rod)
      // add rod to shorter support
      newDiff = abs(diff - rod)
      newTall = tall if diff >= rod else tall + rod - diff
      newDp[newDiff] = max(newDp[newDiff], newTall)
    dp = newDp
  return dp[0]`,

    python: `def tallestBillboard(rods):
    dp = {0: 0}
    for rod in rods:
        ndp = dict(dp)
        for diff, tall in dp.items():
            ndp[diff + rod] = max(ndp.get(diff+rod, 0), tall + rod)
            ndiff = abs(diff - rod)
            ntall = tall if diff >= rod else tall + rod - diff
            ndp[ndiff] = max(ndp.get(ndiff, 0), ntall)
        dp = ndp
    return dp.get(0, 0)`,

    javascript: `function tallestBillboard(rods) {
  let dp = new Map([[0, 0]]);
  for (const rod of rods) {
    const ndp = new Map(dp);
    for (const [diff, tall] of dp) {
      ndp.set(diff+rod, Math.max(ndp.get(diff+rod)||0, tall+rod));
      const ndiff = Math.abs(diff-rod);
      const ntall = diff >= rod ? tall : tall + rod - diff;
      ndp.set(ndiff, Math.max(ndp.get(ndiff)||0, ntall));
    }
    dp = ndp;
  }
  return dp.get(0) || 0;
}`,

    java: `public int tallestBillboard(int[] rods) {
    Map<Integer, Integer> dp = new HashMap<>();
    dp.put(0, 0);
    for (int rod : rods) {
        Map<Integer, Integer> ndp = new HashMap<>(dp);
        for (Map.Entry<Integer,Integer> e : dp.entrySet()) {
            int diff = e.getKey(), tall = e.getValue();
            ndp.merge(diff + rod, tall + rod, Math::max);
            int ndiff = Math.abs(diff - rod);
            int ntall = diff >= rod ? tall : tall + rod - diff;
            ndp.merge(ndiff, ntall, Math::max);
        }
        dp = ndp;
    }
    return dp.getOrDefault(0, 0);
}`,
  },

  defaultInput: {
    rods: [1, 2, 3, 6],
  },

  inputFields: [
    {
      name: 'rods',
      label: 'Rod Lengths',
      type: 'array',
      defaultValue: [1, 2, 3, 6],
      placeholder: '1,2,3,6',
      helperText: 'Lengths of steel rods available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rods = input.rods as number[];
    const steps: AlgorithmStep[] = [];

    let dp = new Map<number, number>([[0, 0]]);

    const makeViz = (currentRod: number, rodIdx: number, dpState: Map<number, number>) => {
      const diffs = [...dpState.keys()].sort((a, b) => a - b).slice(0, 8);
      return {
        type: 'dp' as const,
        table: {
          headers: ['Diff (|h1-h2|)', 'Max Taller Height'],
          rows: diffs.map(d => ({
            label: `diff=${d}`,
            cells: [
              { value: d, highlight: d === 0 ? 'found' : 'default' as string },
              { value: dpState.get(d)!, highlight: d === 0 ? 'found' : 'active' as string },
            ],
          })),
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Tallest Billboard DP. State: dp[diff] = max height of taller support when the two supports differ by "diff". Initially dp[0]=0.`,
      variables: { rods, dpSize: 1 },
      visualization: makeViz(-1, -1, dp),
    });

    for (let ri = 0; ri < rods.length; ri++) {
      const rod = rods[ri];
      const ndp = new Map(dp);

      for (const [diff, tall] of dp) {
        const newVal1 = (ndp.get(diff + rod) ?? 0);
        if (tall + rod > newVal1) ndp.set(diff + rod, tall + rod);

        const ndiff = Math.abs(diff - rod);
        const ntall = diff >= rod ? tall : tall + rod - diff;
        const newVal2 = (ndp.get(ndiff) ?? 0);
        if (ntall > newVal2) ndp.set(ndiff, ntall);
      }

      dp = ndp;

      steps.push({
        line: 4,
        explanation: `Processed rod of length ${rod} (rod ${ri + 1}/${rods.length}). Updated DP: ${dp.size} diff states. Current best equal-height: ${dp.get(0) ?? 0}.`,
        variables: { rod, rodIndex: ri + 1, bestHeight: dp.get(0) ?? 0, dpSize: dp.size },
        visualization: makeViz(rod, ri, dp),
      });
    }

    const ans = dp.get(0) ?? 0;
    steps.push({
      line: 9,
      explanation: `Final answer: dp[0] = ${ans}. The tallest billboard supported by two equal-height supports has height ${ans}.`,
      variables: { answer: ans },
      visualization: makeViz(-1, -1, dp),
    });

    return steps;
  },
};

export default tallestBillboard;
