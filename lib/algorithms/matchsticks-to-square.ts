import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const matchsticksToSquare: AlgorithmDefinition = {
  id: 'matchsticks-to-square',
  title: 'Matchsticks to Square',
  leetcodeNumber: 473,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given matchstick lengths, determine if they can form a perfect square (4 equal sides). Uses bitmask DP: dp[mask] = remaining length needed to complete current side when sticks in mask are used.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function makesquare(matchsticks):
  total = sum(matchsticks)
  if total % 4 != 0: return false
  side = total / 4
  n = length(matchsticks)
  dp = array of size 2^n, fill -1
  dp[0] = 0
  for mask from 1 to 2^n - 1:
    for i from 0 to n-1:
      if not (mask & (1<<i)): continue
      prev = mask ^ (1<<i)
      cur = dp[prev] == -1 ? -1 : dp[prev] + matchsticks[i]
      if cur <= side:
        dp[mask] = cur % side
        break
  return dp[(1<<n)-1] == 0`,
    python: `def makesquare(matchsticks):
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    side = total // 4
    n = len(matchsticks)
    dp = [-1] * (1 << n)
    dp[0] = 0
    for mask in range(1, 1 << n):
        for i in range(n):
            if not (mask & (1 << i)):
                continue
            prev = mask ^ (1 << i)
            if dp[prev] == -1:
                continue
            cur = dp[prev] + matchsticks[i]
            if cur <= side:
                dp[mask] = cur % side
                break
    return dp[(1 << n) - 1] == 0`,
    javascript: `function makesquare(matchsticks) {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;
  const n = matchsticks.length;
  const dp = new Array(1 << n).fill(-1);
  dp[0] = 0;
  for (let mask = 1; mask < (1 << n); mask++) {
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue;
      const prev = mask ^ (1 << i);
      if (dp[prev] === -1) continue;
      const cur = dp[prev] + matchsticks[i];
      if (cur <= side) {
        dp[mask] = cur % side;
        break;
      }
    }
  }
  return dp[(1 << n) - 1] === 0;
}`,
    java: `public boolean makesquare(int[] matchsticks) {
    int total = 0;
    for (int x : matchsticks) total += x;
    if (total % 4 != 0) return false;
    int side = total / 4;
    int n = matchsticks.length;
    int[] dp = new int[1 << n];
    Arrays.fill(dp, -1);
    dp[0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0) continue;
            int prev = mask ^ (1 << i);
            if (dp[prev] == -1) continue;
            int cur = dp[prev] + matchsticks[i];
            if (cur <= side) { dp[mask] = cur % side; break; }
        }
    }
    return dp[(1 << n) - 1] == 0;
}`,
  },
  defaultInput: { matchsticks: [1, 1, 2, 2, 2] },
  inputFields: [
    {
      name: 'matchsticks',
      label: 'Matchstick Lengths',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 2],
      placeholder: '1,1,2,2,2',
      helperText: 'Lengths of matchsticks to form a square',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matchsticks = (input.matchsticks as number[]).slice(0, 6);
    const steps: AlgorithmStep[] = [];
    const n = matchsticks.length;
    const total = matchsticks.reduce((a, b) => a + b, 0);
    const size = 1 << n;
    const dp: (number | null)[] = new Array(size).fill(null);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let m = 0; m < size; m++) {
        if (dp[m] !== null) highlights[m] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    if (total % 4 !== 0) {
      steps.push({
        line: 2,
        explanation: `Total=${total} not divisible by 4. Cannot form a square.`,
        variables: { total },
        visualization: makeViz(null, null),
      });
      return steps;
    }

    const side = total / 4;
    steps.push({
      line: 1,
      explanation: `matchsticks=${JSON.stringify(matchsticks)}, total=${total}, side=${side}. dp[mask]=progress filling current side.`,
      variables: { matchsticks, total, side },
      visualization: makeViz(null, null),
    });

    dp[0] = 0;
    steps.push({
      line: 7,
      explanation: 'dp[0]=0: no sticks used, current side progress=0.',
      variables: { 'dp[0]': 0 },
      visualization: makeViz(0, null),
    });

    for (let mask = 1; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;
        const prev = mask ^ (1 << i);
        if (dp[prev] === null) continue;
        const cur = (dp[prev] as number) + matchsticks[i];
        if (cur <= side) {
          dp[mask] = cur % side;
          steps.push({
            line: 11,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}: add stick[${i}]=${matchsticks[i]} from prev=${prev.toString(2).padStart(n,'0')}. cur=${cur}<=side=${side}. dp[mask]=${dp[mask]}.`,
            variables: { mask, i, 'matchstick[i]': matchsticks[i], cur, 'dp[mask]': dp[mask] },
            visualization: makeViz(mask, prev),
          });
          break;
        }
      }
    }

    const fullMask = size - 1;
    const result = dp[fullMask] === 0;
    steps.push({
      line: 14,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. ${result ? 'Can form a square!' : 'Cannot form a square.'}`,
      variables: { result, 'dp[fullMask]': dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default matchsticksToSquare;
