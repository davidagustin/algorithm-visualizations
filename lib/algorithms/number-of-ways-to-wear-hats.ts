import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const numberOfWaysToWearHats: AlgorithmDefinition = {
  id: 'number-of-ways-to-wear-hats',
  title: 'Number of Ways to Wear Different Hats',
  leetcodeNumber: 1434,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n people and 40 hat types where each person has a list of favorite hats, count the number of ways to assign a different hat to each person such that each person gets a hat they like. Uses bitmask DP over people assignments for each hat.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation'],
  code: {
    pseudocode: `function numberWays(hats):
  n = length(hats)
  hatOwners = map from hat to list of people who like it
  MOD = 10^9 + 7
  dp = array of size 2^n, fill 0
  dp[0] = 1
  for hat from 1 to 40:
    for mask from 2^n-1 down to 0:
      if dp[mask] == 0: continue
      for person in hatOwners[hat]:
        if mask has bit person: continue
        dp[mask | (1<<person)] += dp[mask]
  return dp[(1<<n)-1] % MOD`,
    python: `def numberWays(hats):
    from collections import defaultdict
    MOD = 10**9 + 7
    n = len(hats)
    hat_owners = defaultdict(list)
    for i, person_hats in enumerate(hats):
        for h in person_hats:
            hat_owners[h].append(i)
    dp = [0] * (1 << n)
    dp[0] = 1
    for hat in range(1, 41):
        for mask in range((1 << n) - 1, -1, -1):
            if not dp[mask]: continue
            for person in hat_owners[hat]:
                if mask & (1 << person): continue
                dp[mask | (1 << person)] = (dp[mask | (1 << person)] + dp[mask]) % MOD
    return dp[(1 << n) - 1]`,
    javascript: `function numberWays(hats) {
  const MOD = 1e9 + 7;
  const n = hats.length;
  const hatOwners = new Array(41).fill(null).map(() => []);
  for (let i = 0; i < n; i++)
    for (const h of hats[i]) hatOwners[h].push(i);
  const dp = new Array(1 << n).fill(0);
  dp[0] = 1;
  for (let hat = 1; hat <= 40; hat++) {
    for (let mask = (1 << n) - 1; mask >= 0; mask--) {
      if (!dp[mask]) continue;
      for (const person of hatOwners[hat]) {
        if (mask & (1 << person)) continue;
        dp[mask | (1 << person)] = (dp[mask | (1 << person)] + dp[mask]) % MOD;
      }
    }
  }
  return dp[(1 << n) - 1];
}`,
    java: `public int numberWays(List<List<Integer>> hats) {
    int MOD = 1_000_000_007, n = hats.size();
    List<List<Integer>> hatOwners = new ArrayList<>();
    for (int i = 0; i <= 40; i++) hatOwners.add(new ArrayList<>());
    for (int i = 0; i < n; i++)
        for (int h : hats.get(i)) hatOwners.get(h).add(i);
    long[] dp = new long[1 << n];
    dp[0] = 1;
    for (int hat = 1; hat <= 40; hat++) {
        for (int mask = (1 << n) - 1; mask >= 0; mask--) {
            if (dp[mask] == 0) continue;
            for (int person : hatOwners.get(hat)) {
                if ((mask & (1 << person)) != 0) continue;
                dp[mask | (1 << person)] = (dp[mask | (1 << person)] + dp[mask]) % MOD;
            }
        }
    }
    return (int) dp[(1 << n) - 1];
}`,
  },
  defaultInput: { hats: [[3, 4], [4, 5], [5]] },
  inputFields: [
    {
      name: 'hats',
      label: 'People Favorite Hats (JSON)',
      type: 'string',
      defaultValue: '[[3,4],[4,5],[5]]',
      placeholder: '[[3,4],[4,5],[5]]',
      helperText: 'JSON array of favorite hat lists per person',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let hats: number[][];
    try {
      hats = JSON.parse(input.hats as string) as number[][];
    } catch {
      hats = [[3, 4], [4, 5], [5]];
    }
    const n = Math.min(hats.length, 4);
    const peopleFavs = hats.slice(0, n);
    const MOD = 1000000007;

    const hatOwners: Map<number, number[]> = new Map();
    for (let i = 0; i < n; i++) {
      for (const h of peopleFavs[i]) {
        if (!hatOwners.has(h)) hatOwners.set(h, []);
        hatOwners.get(h)!.push(i);
      }
    }

    const size = 1 << n;
    const dp: (number | null)[] = new Array(size).fill(0);
    dp[0] = 1;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) > 0) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `n=${n} people, hats=${JSON.stringify(peopleFavs)}. dp[mask]=ways to assign hats so people in mask each have one. dp[0]=1.`,
      variables: { n, hats: peopleFavs },
      visualization: makeViz(0, null),
    });

    const allHats = Array.from(new Set(peopleFavs.flat())).sort((a, b) => a - b);
    for (const hat of allHats) {
      const owners = hatOwners.get(hat) || [];
      for (let mask = size - 1; mask >= 0; mask--) {
        if (!(dp[mask] as number)) continue;
        for (const person of owners) {
          if (mask & (1 << person)) continue;
          const newMask = mask | (1 << person);
          dp[newMask] = ((dp[newMask] as number) + (dp[mask] as number)) % MOD;
          steps.push({
            line: 10,
            explanation: `hat=${hat}, person=${person}: mask=${mask.toString(2).padStart(n,'0')}->newMask=${newMask.toString(2).padStart(n,'0')}. dp[newMask]=${dp[newMask]}.`,
            variables: { hat, person, mask, newMask, 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 13,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. Number of ways to assign hats: ${dp[fullMask]}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default numberOfWaysToWearHats;
