import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const canIWinBitmask: AlgorithmDefinition = {
  id: 'can-i-win-bitmask',
  title: 'Can I Win (Bitmask DP)',
  leetcodeNumber: 464,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Two players alternately choose integers from 1 to maxChoosableInteger. The player who causes the cumulative total to reach or exceed desiredTotal wins. Uses bitmask DP where each bit indicates if that number has been chosen.',
  tags: ['Dynamic Programming', 'Bitmask', 'Game Theory', 'Minimax', 'Bit Manipulation'],
  code: {
    pseudocode: `function canIWin(maxChoosable, desiredTotal):
  if maxChoosable*(maxChoosable+1)/2 < desiredTotal: return false
  if desiredTotal <= 0: return true
  dp = map (memo)
  function dfs(used, total):
    if used in dp: return dp[used]
    for i from 1 to maxChoosable:
      if used has bit i: continue
      if total - i <= 0: return dp[used] = true
      if not dfs(used|(1<<i), total-i):
        return dp[used] = true
    return dp[used] = false
  return dfs(0, desiredTotal)`,
    python: `def canIWin(maxChoosable, desiredTotal):
    if desiredTotal <= 0: return True
    if maxChoosable*(maxChoosable+1)//2 < desiredTotal: return False
    dp = {}
    def dfs(used, total):
        if used in dp: return dp[used]
        for i in range(1, maxChoosable+1):
            if used >> i & 1: continue
            if total - i <= 0:
                dp[used] = True; return True
            if not dfs(used | (1<<i), total-i):
                dp[used] = True; return True
        dp[used] = False; return False
    return dfs(0, desiredTotal)`,
    javascript: `function canIWin(maxChoosable, desiredTotal) {
  if (desiredTotal <= 0) return true;
  if (maxChoosable*(maxChoosable+1)/2 < desiredTotal) return false;
  const dp = new Map();
  function dfs(used, total) {
    if (dp.has(used)) return dp.get(used);
    for (let i = 1; i <= maxChoosable; i++) {
      if (used>>i&1) continue;
      if (total-i<=0) { dp.set(used,true); return true; }
      if (!dfs(used|(1<<i), total-i)) { dp.set(used,true); return true; }
    }
    dp.set(used,false); return false;
  }
  return dfs(0, desiredTotal);
}`,
    java: `public boolean canIWin(int maxChoosable, int desiredTotal) {
    if (desiredTotal<=0) return true;
    if ((long)maxChoosable*(maxChoosable+1)/2 < desiredTotal) return false;
    Map<Integer,Boolean> dp = new HashMap<>();
    return dfs(0, desiredTotal, maxChoosable, dp);
}
boolean dfs(int used, int total, int max, Map<Integer,Boolean> dp) {
    if (dp.containsKey(used)) return dp.get(used);
    for (int i=1;i<=max;i++) {
        if ((used>>i&1)!=0) continue;
        if (total-i<=0) { dp.put(used,true); return true; }
        if (!dfs(used|(1<<i),total-i,max,dp)) { dp.put(used,true); return true; }
    }
    dp.put(used,false); return false;
}`,
  },
  defaultInput: { maxChoosable: 10, desiredTotal: 11 },
  inputFields: [
    {
      name: 'maxChoosable',
      label: 'Max Choosable Integer',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Integers available: 1 to maxChoosable (max 8 for visualization)',
    },
    {
      name: 'desiredTotal',
      label: 'Desired Total',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Target cumulative sum to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maxChoosable = Math.min(input.maxChoosable as number, 8);
    const desiredTotal = input.desiredTotal as number;
    const size = 1 << (maxChoosable + 1);
    const INF = 99999;

    if (desiredTotal <= 0) {
      const dp: (number | null)[] = new Array(Math.min(size, 16)).fill(null);
      dp[0] = 1;
      const labels = Array.from({ length: Math.min(size, 16) }, (_, i) => i.toString(2).padStart(maxChoosable+1,'0'));
      return [{
        line: 2,
        explanation: `desiredTotal=${desiredTotal}<=0. First player wins immediately.`,
        variables: { result: true },
        visualization: { type: 'dp-table', values: dp, highlights: { 0: 'active' }, labels },
      }];
    }

    if (maxChoosable * (maxChoosable + 1) / 2 < desiredTotal) {
      const dp: (number | null)[] = new Array(Math.min(size, 16)).fill(null);
      const labels = Array.from({ length: Math.min(size, 16) }, (_, i) => i.toString(2).padStart(maxChoosable+1,'0'));
      return [{
        line: 2,
        explanation: `Max sum ${maxChoosable*(maxChoosable+1)/2} < desiredTotal=${desiredTotal}. Nobody can win, return false.`,
        variables: { result: false },
        visualization: { type: 'dp-table', values: dp, highlights: {}, labels },
      }];
    }

    const displaySize = Math.min(size, 32);
    const dp: (number | null)[] = new Array(displaySize).fill(null);
    const labels: string[] = Array.from({ length: displaySize }, (_, i) =>
      i.toString(2).padStart(maxChoosable + 1, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < displaySize; mask++) {
        if (dp[mask] !== null) highlights[mask] = dp[mask] === 1 ? 'found' : 'mismatch';
      }
      if (activeIdx !== null && activeIdx < displaySize) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `maxChoosable=${maxChoosable}, desiredTotal=${desiredTotal}. dp[usedMask]=1 if current player wins. dp[mask] computed via game search.`,
      variables: { maxChoosable, desiredTotal },
      visualization: makeViz(null),
    });

    const memo: Map<number, boolean> = new Map();

    function dfs(used: number, total: number): boolean {
      if (memo.has(used)) return memo.get(used)!;
      for (let i = 1; i <= maxChoosable; i++) {
        if (used >> i & 1) continue;
        if (total - i <= 0) {
          memo.set(used, true);
          if (used < displaySize) {
            dp[used] = 1;
            steps.push({
              line: 7,
              explanation: `State=${used.toString(2).padStart(maxChoosable+1,'0')}: pick ${i}, total-${i}=${total-i}<=0. Current player WINS.`,
              variables: { used, i, total, result: true },
              visualization: makeViz(used < displaySize ? used : null),
            });
          }
          return true;
        }
        if (!dfs(used | (1 << i), total - i)) {
          memo.set(used, true);
          if (used < displaySize) {
            dp[used] = 1;
            steps.push({
              line: 8,
              explanation: `State=${used.toString(2).padStart(maxChoosable+1,'0')}: pick ${i}, opponent loses. Current player WINS.`,
              variables: { used, i, total, result: true },
              visualization: makeViz(used < displaySize ? used : null),
            });
          }
          return true;
        }
      }
      memo.set(used, false);
      if (used < displaySize) {
        dp[used] = 0;
        steps.push({
          line: 10,
          explanation: `State=${used.toString(2).padStart(maxChoosable+1,'0')}: all moves lead to opponent winning. Current player LOSES.`,
          variables: { used, total, result: false },
          visualization: makeViz(used < displaySize ? used : null),
        });
      }
      return false;
    }

    const result = dfs(0, desiredTotal);
    steps.push({
      line: 12,
      explanation: `First player can${result ? '' : 'not'} force a win. Result: ${result}.`,
      variables: { result },
      visualization: makeViz(0),
    });

    return steps;
  },
};

export default canIWinBitmask;
