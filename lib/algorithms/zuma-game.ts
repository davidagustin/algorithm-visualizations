import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zumaGame: AlgorithmDefinition = {
  id: 'zuma-game',
  title: 'Zuma Game',
  leetcodeNumber: 488,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a board string and hand balls, find the minimum balls to insert to clear the board. Groups of 3+ same-colored balls are removed automatically (chain reactions can occur). Uses DFS/memoization to try inserting hand balls at each valid position in the board.',
  tags: ['dynamic programming', 'dfs', 'memoization', 'string', 'simulation'],

  code: {
    pseudocode: `function findMinStep(board, hand):
  sort(hand)
  memo = {}
  def dfs(board, hand):
    if board == "": return 0
    if key in memo: return memo[key]
    result = infinity
    i = 0
    while i < len(board):
      j = i
      while j<len(board) and board[j]==board[i]: j++
      need = 3 - (j - i)
      for each ball in hand if ball == board[i]:
        if available >= need:
          new_board = clean(board[:i] + board[j:])
          sub = dfs(new_board, hand minus need balls)
          if sub >= 0: result = min(result, need + sub)
      i = j
    memo[key] = result if result != inf else -1
    return memo[key]
  return dfs(board, hand)`,
    python: `def findMinStep(board: str, hand: str) -> int:
    from collections import Counter
    def clean(s):
        changed = True
        while changed:
            changed = False
            i = 0
            while i < len(s):
                j = i
                while j < len(s) and s[j] == s[i]: j += 1
                if j - i >= 3:
                    s = s[:i] + s[j:]
                    changed = True
                else:
                    i = j
        return s
    memo = {}
    def dfs(board, hand):
        if not board: return 0
        key = board + '#' + ''.join(sorted(hand))
        if key in memo: return memo[key]
        res = float('inf')
        i = 0
        while i < len(board):
            j = i
            while j < len(board) and board[j] == board[i]: j += 1
            need = 3 - (j - i)
            if hand.count(board[i]) >= need:
                new_hand = list(hand)
                for _ in range(need): new_hand.remove(board[i])
                sub = dfs(clean(board[:i]+board[j:]), new_hand)
                if sub >= 0: res = min(res, need + sub)
            i = j
        memo[key] = res if res != float('inf') else -1
        return memo[key]
    return dfs(board, list(hand))`,
    javascript: `function findMinStep(board, hand) {
  function clean(s) {
    let changed = true;
    while (changed) {
      changed = false;
      let i = 0;
      while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        if (j-i >= 3) { s = s.slice(0,i)+s.slice(j); changed = true; } else i = j;
      }
    }
    return s;
  }
  const memo = new Map();
  function dfs(board, hand) {
    if (!board) return 0;
    const key = board+'#'+[...hand].sort().join('');
    if (memo.has(key)) return memo.get(key);
    let res = Infinity;
    let i = 0;
    while (i < board.length) {
      let j = i;
      while (j < board.length && board[j] === board[i]) j++;
      const need = 3-(j-i);
      const cnt = hand.filter(c=>c===board[i]).length;
      if (cnt >= need) {
        const newHand = [...hand];
        for (let k=0;k<need;k++) newHand.splice(newHand.indexOf(board[i]),1);
        const sub = dfs(clean(board.slice(0,i)+board.slice(j)), newHand);
        if (sub >= 0) res = Math.min(res, need+sub);
      }
      i = j;
    }
    const ans = res === Infinity ? -1 : res;
    memo.set(key, ans); return ans;
  }
  return dfs(board, hand.split(''));
}`,
    java: `// See full Java solution on LeetCode 488`,
  },

  defaultInput: {
    board: 'WRRBBW',
    hand: 'RB',
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board',
      type: 'string',
      defaultValue: 'WRRBBW',
      placeholder: 'WRRBBW',
      helperText: 'Initial board state (colored balls)',
    },
    {
      name: 'hand',
      label: 'Hand',
      type: 'string',
      defaultValue: 'RB',
      placeholder: 'RB',
      helperText: 'Balls in your hand',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = input.board as string;
    const hand = input.hand as string;
    const steps: AlgorithmStep[] = [];
    const n = board.length;

    const colorToNum = (c: string): number => {
      const map: Record<string, number> = { R: 1, G: 2, B: 3, Y: 4, W: 5 };
      return map[c] || 0;
    };

    const makeViz = (state: string, highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: state.split('').map((c: string) => colorToNum(c)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Zuma Game: board="${board}", hand="${hand}". Insert balls from hand to clear the board. 3+ consecutive same colors auto-clear.`,
      variables: { board, hand },
      visualization: makeViz(board, {}, {}),
    });

    // Show initial groups
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n && board[j] === board[i]) j++;
      const groupLen = j - i;
      const need = Math.max(0, 3 - groupLen);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let idx = i; idx < j; idx++) {
        highlights[idx] = groupLen >= 2 ? 'active' : 'comparing';
      }
      labels[i] = `need ${need}`;

      steps.push({
        line: 8,
        explanation: `Group "${board[i]}x${groupLen}" at [${i}-${j - 1}]. Need ${need} more "${board[i]}" balls to clear this group.`,
        variables: { color: board[i], count: groupLen, needMore: need },
        visualization: makeViz(board, highlights, labels),
      });
      i = j;
      if (steps.length > 5) break;
    }

    function clean(s: string): string {
      let changed = true;
      while (changed) {
        changed = false;
        let idx = 0;
        while (idx < s.length) {
          let jdx = idx;
          while (jdx < s.length && s[jdx] === s[idx]) jdx++;
          if (jdx - idx >= 3) { s = s.slice(0, idx) + s.slice(jdx); changed = true; } else idx = jdx;
        }
      }
      return s;
    }

    const memo = new Map<string, number>();
    function dfs(bd: string, hd: string[]): number {
      if (!bd) return 0;
      const key = bd + '#' + [...hd].sort().join('');
      if (memo.has(key)) return memo.get(key)!;
      let res = Infinity;
      let si = 0;
      while (si < bd.length) {
        let sj = si;
        while (sj < bd.length && bd[sj] === bd[si]) sj++;
        const need = 3 - (sj - si);
        const cnt = hd.filter((c) => c === bd[si]).length;
        if (cnt >= need) {
          const newHand = [...hd];
          for (let k = 0; k < need; k++) newHand.splice(newHand.indexOf(bd[si]), 1);
          const sub = dfs(clean(bd.slice(0, si) + bd.slice(sj)), newHand);
          if (sub >= 0) res = Math.min(res, need + sub);
        }
        si = sj;
      }
      const ans = res === Infinity ? -1 : res;
      memo.set(key, ans);
      return ans;
    }

    const result = dfs(board, hand.split(''));

    steps.push({
      line: 14,
      explanation: `Result: ${result}. ${result === -1 ? 'Impossible to clear the board.' : `Minimum ${result} balls needed to clear "${board}".`}`,
      variables: { result, memoStates: memo.size },
      visualization: makeViz(
        board,
        Object.fromEntries(board.split('').map((_, i) => [i, result === -1 ? 'mismatch' : 'found'])),
        { 0: result === -1 ? 'impossible' : `min:${result}` }
      ),
    });

    return steps;
  },
};

export default zumaGame;
