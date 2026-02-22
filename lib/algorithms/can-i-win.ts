import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const canIWin: AlgorithmDefinition = {
  id: 'can-i-win',
  title: 'Can I Win',
  leetcodeNumber: 464,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Two players take turns choosing integers from 1 to maxChoosable without replacement. The player who reaches or exceeds desiredTotal first wins. Uses bitmask DP to track which numbers have been chosen. memo[mask] = whether current player wins with the given set of used numbers.',
  tags: ['dynamic programming', 'bitmask', 'game theory', 'memoization'],

  code: {
    pseudocode: `function canIWin(maxChoosable, desiredTotal):
  if maxChoosable*(maxChoosable+1)/2 < desiredTotal: return false
  memo = {}
  def canWin(mask, total):
    if mask in memo: return memo[mask]
    for i from 1 to maxChoosable:
      if bit i not in mask:
        if total+i >= desiredTotal or not canWin(mask|(1<<i), total+i):
          memo[mask] = true; return true
    memo[mask] = false; return false
  return canWin(0, 0)`,
    python: `def canIWin(maxChoosable: int, desiredTotal: int) -> bool:
    if maxChoosable * (maxChoosable + 1) // 2 < desiredTotal:
        return False
    memo = {}
    def canWin(mask, total):
        if mask in memo: return memo[mask]
        for i in range(1, maxChoosable + 1):
            if not (mask >> i & 1):
                if total + i >= desiredTotal or not canWin(mask | (1 << i), total + i):
                    memo[mask] = True
                    return True
        memo[mask] = False
        return False
    return canWin(0, 0)`,
    javascript: `function canIWin(maxChoosable, desiredTotal) {
  if (maxChoosable*(maxChoosable+1)/2 < desiredTotal) return false;
  const memo = new Map();
  function canWin(mask, total) {
    if (memo.has(mask)) return memo.get(mask);
    for (let i = 1; i <= maxChoosable; i++) {
      if (!(mask >> i & 1)) {
        if (total+i >= desiredTotal || !canWin(mask|(1<<i), total+i)) {
          memo.set(mask, true); return true;
        }
      }
    }
    memo.set(mask, false); return false;
  }
  return canWin(0, 0);
}`,
    java: `public boolean canIWin(int maxChoosable, int desiredTotal) {
    if (maxChoosable*(maxChoosable+1)/2 < desiredTotal) return false;
    Map<Integer,Boolean> memo = new HashMap<>();
    return canWin(maxChoosable, desiredTotal, 0, 0, memo);
}
boolean canWin(int max, int target, int mask, int total, Map<Integer,Boolean> memo) {
    if (memo.containsKey(mask)) return memo.get(mask);
    for (int i = 1; i <= max; i++) {
        if ((mask>>i&1)==0) {
            if (total+i>=target || !canWin(max,target,mask|(1<<i),total+i,memo)) {
                memo.put(mask, true); return true;
            }
        }
    }
    memo.put(mask, false); return false;
}`,
  },

  defaultInput: {
    maxChoosable: 10,
    desiredTotal: 11,
  },

  inputFields: [
    {
      name: 'maxChoosable',
      label: 'Max Choosable',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Numbers 1 to maxChoosable available',
    },
    {
      name: 'desiredTotal',
      label: 'Desired Total',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'First to reach this total wins',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maxChoosable = input.maxChoosable as number;
    const desiredTotal = input.desiredTotal as number;
    const steps: AlgorithmStep[] = [];
    const display = Math.min(maxChoosable, 8);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: display }, (_, i) => i + 1),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Can I Win: pick from 1 to ${maxChoosable}, target=${desiredTotal}. Both players play optimally. Can first player win?`,
      variables: { maxChoosable, desiredTotal },
      visualization: makeViz({}, {}),
    });

    const total = maxChoosable * (maxChoosable + 1) / 2;
    if (total < desiredTotal) {
      steps.push({
        line: 2,
        explanation: `Max possible sum = ${total} < ${desiredTotal}. Nobody can reach the target. Return false.`,
        variables: { maxPossible: total, result: false },
        visualization: makeViz(Object.fromEntries(Array.from({ length: display }, (_, i) => [i, 'mismatch'])), {}),
      });
      return steps;
    }

    const memo = new Map<number, boolean>();
    const moveLog: Array<{ num: number; mask: number; total: number; wins: boolean }> = [];

    function canWin(mask: number, tot: number): boolean {
      if (memo.has(mask)) return memo.get(mask)!;
      for (let i = 1; i <= maxChoosable; i++) {
        if (!(mask >> i & 1)) {
          if (tot + i >= desiredTotal || !canWin(mask | (1 << i), tot + i)) {
            if (moveLog.length < 6) moveLog.push({ num: i, mask, total: tot, wins: true });
            memo.set(mask, true);
            return true;
          }
        }
      }
      memo.set(mask, false);
      return false;
    }

    const result = canWin(0, 0);

    for (const log of moveLog) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      const numIdx = log.num - 1;
      if (numIdx < display) {
        highlights[numIdx] = log.wins ? 'found' : 'mismatch';
        labels[numIdx] = `pick=${log.num}`;
      }
      for (let i = 1; i <= display; i++) {
        if (log.mask >> i & 1) {
          highlights[i - 1] = 'visited';
        }
      }

      steps.push({
        line: 6,
        explanation: `Pick ${log.num}: running total=${log.total + log.num}. ${log.total + log.num >= desiredTotal ? 'Reaches target!' : 'Continue recursion.'} mask=${log.mask.toString(2)}.`,
        variables: { pick: log.num, total: log.total + log.num, mask: log.mask.toString(2) },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 10,
      explanation: `Result: ${result}. First player ${result ? 'can' : 'cannot'} guarantee a win with maxChoosable=${maxChoosable}, target=${desiredTotal}.`,
      variables: { result, memoStates: memo.size },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: display }, (_, i) => [i, result ? 'found' : 'mismatch'])),
        { 0: result ? 'Win' : 'Lose' }
      ),
    });

    return steps;
  },
};

export default canIWin;
