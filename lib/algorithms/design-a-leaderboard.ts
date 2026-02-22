import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designALeaderboard: AlgorithmDefinition = {
  id: 'design-a-leaderboard',
  title: 'Design a Leaderboard',
  leetcodeNumber: 1244,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a leaderboard with three operations: addScore(playerId, score) adds score to player, top(K) returns the sum of top K scores, and reset(playerId) resets a player score to 0. Use a hash map from playerId to score, and sort for top K queries.',
  tags: ['hash map', 'design', 'sorting', 'heap'],

  code: {
    pseudocode: `class Leaderboard:
  scores = {}

  def addScore(playerId, score):
    scores[playerId] += score

  def top(K):
    return sum(sorted(scores.values(), reverse=True)[:K])

  def reset(playerId):
    scores[playerId] = 0`,
    python: `class Leaderboard:
    def __init__(self):
        self.scores = {}

    def addScore(self, playerId: int, score: int) -> None:
        self.scores[playerId] = self.scores.get(playerId, 0) + score

    def top(self, K: int) -> int:
        return sum(sorted(self.scores.values(), reverse=True)[:K])

    def reset(self, playerId: int) -> None:
        self.scores[playerId] = 0`,
    javascript: `class Leaderboard {
  constructor() { this.scores = new Map(); }
  addScore(playerId, score) {
    this.scores.set(playerId, (this.scores.get(playerId)||0) + score);
  }
  top(K) {
    return [...this.scores.values()].sort((a,b)=>b-a).slice(0,K).reduce((a,b)=>a+b,0);
  }
  reset(playerId) { this.scores.set(playerId, 0); }
}`,
    java: `class Leaderboard {
    Map<Integer,Integer> scores = new HashMap<>();
    public void addScore(int playerId, int score) {
        scores.merge(playerId, score, Integer::sum);
    }
    public int top(int K) {
        return scores.values().stream().sorted(Comparator.reverseOrder())
            .limit(K).mapToInt(Integer::intValue).sum();
    }
    public void reset(int playerId) { scores.put(playerId, 0); }
}`,
  },

  defaultInput: {
    operations: ['addScore', 'addScore', 'addScore', 'addScore', 'addScore', 'top', 'reset', 'reset', 'addScore', 'top'],
    playerIds:  [1,          2,          3,          4,          5,          1,     1,       2,       2,          1],
    scores:     [73,         56,         39,         51,         4,          1,     1,       2,       51,         1],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'array',
      defaultValue: ['addScore', 'addScore', 'addScore', 'addScore', 'addScore', 'top', 'reset', 'reset', 'addScore', 'top'],
      placeholder: 'addScore,top,reset',
      helperText: 'Sequence of operations',
    },
    {
      name: 'playerIds',
      label: 'Player IDs',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 1, 1, 2, 2, 1],
      placeholder: '1,2,3',
      helperText: 'Player ID for each operation',
    },
    {
      name: 'scores',
      label: 'Scores / K values',
      type: 'array',
      defaultValue: [73, 56, 39, 51, 4, 1, 1, 2, 51, 1],
      placeholder: '73,56,39',
      helperText: 'Score to add, or K for top() query',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as string[];
    const playerIds = input.playerIds as number[];
    const scores = input.scores as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: operations as unknown as number[],
      highlights,
      labels,
    });

    const board = new Map<number, number>();

    steps.push({
      line: 1,
      explanation: 'Initialize empty leaderboard (hash map from playerId to score).',
      variables: { board: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const pid = playerIds[i];
      const val = scores[i];

      if (op === 'addScore') {
        board.set(pid, (board.get(pid) || 0) + val);
        steps.push({
          line: 4,
          explanation: `addScore(player=${pid}, score=${val}): new score = ${board.get(pid)}`,
          variables: { operation: op, playerId: pid, added: val, newScore: board.get(pid) },
          visualization: makeViz({ [i]: 'active' }, { [i]: `p${pid}+=${val}` }),
        });
      } else if (op === 'reset') {
        board.set(pid, 0);
        steps.push({
          line: 9,
          explanation: `reset(player=${pid}): score set to 0`,
          variables: { operation: op, playerId: pid },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `p${pid}=0` }),
        });
      } else if (op === 'top') {
        const sorted = [...board.values()].sort((a, b) => b - a);
        const topK = sorted.slice(0, val);
        const sum = topK.reduce((a, b) => a + b, 0);
        steps.push({
          line: 7,
          explanation: `top(K=${val}): top ${val} scores = [${topK.join(', ')}], sum = ${sum}`,
          variables: { operation: op, K: val, topScores: `[${topK.join(', ')}]`, result: sum },
          visualization: makeViz({ [i]: 'found' }, { [i]: `top${val}=${sum}` }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Final leaderboard state: ${Array.from(board.entries()).map(([p, s]) => `player${p}:${s}`).join(', ')}`,
      variables: { finalBoard: JSON.stringify(Object.fromEntries(board)) },
      visualization: makeViz(
        Object.fromEntries(operations.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(operations.map((_, i) => [i, operations[i]]))
      ),
    });

    return steps;
  },
};

export default designALeaderboard;
