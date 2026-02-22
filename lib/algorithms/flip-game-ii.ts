import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flipGameIi: AlgorithmDefinition = {
  id: 'flip-game-ii',
  title: 'Flip Game II',
  leetcodeNumber: 294,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string of + and - characters, two players take turns flipping "++" to "--". The player who cannot make a move loses. Determine if the starting player can guarantee a win. Uses memoization with game state as key. A position is winning if any move leads to a losing position for the opponent.',
  tags: ['dynamic programming', 'game theory', 'memoization', 'backtracking'],

  code: {
    pseudocode: `function canWin(s):
  memo = {}
  def helper(state):
    if state in memo: return memo[state]
    for i from 0 to len(state)-2:
      if state[i]=='+' and state[i+1]=='+':
        next = state with state[i..i+1] flipped to '--'
        if not helper(next):
          memo[state] = true; return true
    memo[state] = false; return false
  return helper(s)`,
    python: `def canWin(s: str) -> bool:
    memo = {}
    def helper(state):
        if state in memo:
            return memo[state]
        for i in range(len(state) - 1):
            if state[i] == '+' and state[i+1] == '+':
                next_state = state[:i] + '--' + state[i+2:]
                if not helper(next_state):
                    memo[state] = True
                    return True
        memo[state] = False
        return False
    return helper(s)`,
    javascript: `function canWin(s) {
  const memo = new Map();
  function helper(state) {
    if (memo.has(state)) return memo.get(state);
    for (let i = 0; i < state.length - 1; i++) {
      if (state[i] === '+' && state[i+1] === '+') {
        const next = state.slice(0,i) + '--' + state.slice(i+2);
        if (!helper(next)) { memo.set(state, true); return true; }
      }
    }
    memo.set(state, false); return false;
  }
  return helper(s);
}`,
    java: `public boolean canWin(String s) {
    return helper(s, new HashMap<>());
}
private boolean helper(String s, Map<String,Boolean> memo) {
    if (memo.containsKey(s)) return memo.get(s);
    for (int i = 0; i < s.length()-1; i++) {
        if (s.charAt(i)=='+' && s.charAt(i+1)=='+') {
            String next = s.substring(0,i)+"--"+s.substring(i+2);
            if (!helper(next, memo)) { memo.put(s, true); return true; }
        }
    }
    memo.put(s, false); return false;
}`,
  },

  defaultInput: {
    s: '++++',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: '++++',
      placeholder: '++++',
      helperText: 'String of + and - characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;

    const makeViz = (state: string, highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: state.split('').map((c: string) => c === '+' ? 1 : 0),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Flip Game II: s="${s}". Players flip "++" to "--". Player who cannot move loses. Can first player win?`,
      variables: { s },
      visualization: makeViz(s, {}, {}),
    });

    const memo = new Map<string, boolean>();
    const moveLog: Array<{ state: string; pos: number; next: string; wins: boolean }> = [];

    function helper(state: string): boolean {
      if (memo.has(state)) return memo.get(state)!;
      for (let i = 0; i < state.length - 1; i++) {
        if (state[i] === '+' && state[i + 1] === '+') {
          const next = state.slice(0, i) + '--' + state.slice(i + 2);
          if (!helper(next)) {
            if (moveLog.length < 5) moveLog.push({ state, pos: i, next, wins: true });
            memo.set(state, true);
            return true;
          }
        }
      }
      memo.set(state, false);
      return false;
    }

    const result = helper(s);

    for (const log of moveLog) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      if (log.pos < n) {
        highlights[log.pos] = 'active';
        highlights[log.pos + 1] = 'active';
        labels[log.pos] = '-';
        labels[log.pos + 1] = '-';
      }

      steps.push({
        line: 5,
        explanation: `Flip "++" at pos ${log.pos}: "${log.state}" -> "${log.next}". Opponent faces ${log.wins ? 'a losing' : 'a winning'} position.`,
        variables: { position: log.pos, before: log.state, after: log.next },
        visualization: makeViz(log.state, highlights, labels),
      });
    }

    // Check moves from current state
    let movesFound = 0;
    for (let i = 0; i < n - 1; i++) {
      if (s[i] === '+' && s[i + 1] === '+') {
        movesFound++;
        if (movesFound <= 2) {
          steps.push({
            line: 4,
            explanation: `Found "++" at index ${i}. Possible move: flip to "--". Evaluate if opponent then loses.`,
            variables: { index: i },
            visualization: makeViz(s, { [i]: 'comparing', [i + 1]: 'comparing' }, { [i]: '+', [i + 1]: '+' }),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Result: ${result}. First player ${result ? 'can' : 'cannot'} guarantee a win from "${s}".`,
      variables: { result, memoStates: memo.size },
      visualization: makeViz(
        s,
        Object.fromEntries(s.split('').map((_, i) => [i, result ? 'found' : 'mismatch'])),
        { 0: result ? 'Win' : 'Lose' }
      ),
    });

    return steps;
  },
};

export default flipGameIi;
