import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const flipGameBitmask: AlgorithmDefinition = {
  id: 'flip-game-bitmask',
  title: 'Flip Game II (Bitmask DP)',
  leetcodeNumber: 294,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a game string of + and -, players alternate flipping "++" to "--". The player who cannot make a move loses. Determine if the first player can guarantee a win. Uses bitmask DP where each bit represents a + token position.',
  tags: ['Dynamic Programming', 'Bitmask', 'Game Theory', 'Minimax', 'Bit Manipulation'],
  code: {
    pseudocode: `function canWin(s):
  n = length(s)
  mask = 0
  for i from 0 to n-1:
    if s[i] == '+': mask |= (1 << i)
  dp = map
  function canWinMask(state):
    if state in dp: return dp[state]
    for i from 0 to n-2:
      if (state & (1<<i)) and (state & (1<<(i+1))):
        if not canWinMask(state ^ (1<<i) ^ (1<<(i+1))):
          dp[state] = true; return true
    dp[state] = false; return false
  return canWinMask(mask)`,
    python: `def canWin(s):
    n = len(s)
    mask = sum(1 << i for i, c in enumerate(s) if c == '+')
    dp = {}
    def solve(state):
        if state in dp: return dp[state]
        for i in range(n - 1):
            if (state >> i & 1) and (state >> (i+1) & 1):
                if not solve(state ^ (1<<i) ^ (1<<(i+1))):
                    dp[state] = True; return True
        dp[state] = False; return False
    return solve(mask)`,
    javascript: `function canWin(s) {
  const n = s.length;
  let mask = 0;
  for (let i = 0; i < n; i++) if (s[i]==='+') mask |= 1<<i;
  const dp = new Map();
  function solve(state) {
    if (dp.has(state)) return dp.get(state);
    for (let i = 0; i < n-1; i++) {
      if ((state>>i&1) && (state>>(i+1)&1)) {
        if (!solve(state^(1<<i)^(1<<(i+1)))) {
          dp.set(state,true); return true;
        }
      }
    }
    dp.set(state,false); return false;
  }
  return solve(mask);
}`,
    java: `public boolean canWin(String s) {
    int n = s.length();
    int mask = 0;
    for (int i=0;i<n;i++) if (s.charAt(i)=='+') mask|=1<<i;
    Map<Integer,Boolean> dp = new HashMap<>();
    return solve(mask, n-1, dp);
}
boolean solve(int state, int last, Map<Integer,Boolean> dp) {
    if (dp.containsKey(state)) return dp.get(state);
    for (int i=0;i<last;i++) {
        if ((state>>i&1)!=0 && (state>>(i+1)&1)!=0) {
            if (!solve(state^(1<<i)^(1<<(i+1)),last,dp)) {
                dp.put(state,true); return true;
            }
        }
    }
    dp.put(state,false); return false;
}`,
  },
  defaultInput: { s: '++++' },
  inputFields: [
    {
      name: 's',
      label: 'Game String',
      type: 'string',
      defaultValue: '++++',
      placeholder: '++++',
      helperText: 'String of + and - characters (max 8 chars)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = ((input.s as string) || '++++').slice(0, 8);
    const n = s.length;

    let initialMask = 0;
    for (let i = 0; i < n; i++) {
      if (s[i] === '+') initialMask |= 1 << i;
    }

    const displaySize = Math.min(1 << n, 32);
    const dp: (number | null)[] = new Array(displaySize).fill(null);
    const labels: string[] = Array.from({ length: displaySize }, (_, i) =>
      i.toString(2).padStart(n, '0').replace(/1/g, '+').replace(/0/g, '-')
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
      explanation: `s="${s}", initialMask=${initialMask.toString(2).padStart(n,'0')}. dp[state]=1 if current player wins. Positions with + are bits set.`,
      variables: { s, n, initialMask },
      visualization: makeViz(initialMask < displaySize ? initialMask : null),
    });

    const memo = new Map<number, boolean>();

    function solve(state: number): boolean {
      if (memo.has(state)) return memo.get(state)!;
      for (let i = 0; i < n - 1; i++) {
        if ((state >> i & 1) && (state >> (i + 1) & 1)) {
          const next = state ^ (1 << i) ^ (1 << (i + 1));
          if (!solve(next)) {
            memo.set(state, true);
            if (state < displaySize) {
              dp[state] = 1;
              steps.push({
                line: 9,
                explanation: `State=${state.toString(2).padStart(n,'0')}: flip pos ${i},${i+1}. Opponent loses from ${next.toString(2).padStart(n,'0')}. WIN.`,
                variables: { state, flip: [i, i+1], next, result: true },
                visualization: makeViz(state < displaySize ? state : null),
              });
            }
            return true;
          }
        }
      }
      memo.set(state, false);
      if (state < displaySize) {
        dp[state] = 0;
        steps.push({
          line: 11,
          explanation: `State=${state.toString(2).padStart(n,'0')}: no winning move. LOSE.`,
          variables: { state, result: false },
          visualization: makeViz(state < displaySize ? state : null),
        });
      }
      return false;
    }

    const result = solve(initialMask);
    steps.push({
      line: 13,
      explanation: `First player can${result ? '' : 'not'} guarantee a win from "${s}". Result: ${result}.`,
      variables: { result },
      visualization: makeViz(initialMask < displaySize ? initialMask : null),
    });

    return steps;
  },
};

export default flipGameBitmask;
