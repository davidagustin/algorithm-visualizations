import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPlayersWithZeroOrOneLosses: AlgorithmDefinition = {
  id: 'find-players-with-zero-or-one-losses',
  title: 'Find Players With Zero or One Losses',
  leetcodeNumber: 2225,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given match results [winner, loser], find players who have never lost (0 losses) and players who have lost exactly once. Use a hash map tracking loss counts for all players. Players with no entry have 0 losses. Then filter and sort both groups.',
  tags: ['hash map', 'array', 'sorting'],

  code: {
    pseudocode: `function findWinners(matches):
  losses = {}
  for winner, loser in matches:
    if winner not in losses:
      losses[winner] = 0
    losses[loser] = losses.get(loser, 0) + 1
  noLoss = sorted([p for p,l in losses.items() if l == 0])
  oneLoss = sorted([p for p,l in losses.items() if l == 1])
  return [noLoss, oneLoss]`,

    python: `def findWinners(matches: list[list[int]]) -> list[list[int]]:
    losses = {}
    for w, l in matches:
        if w not in losses: losses[w] = 0
        losses[l] = losses.get(l, 0) + 1
    no_loss = sorted(p for p, c in losses.items() if c == 0)
    one_loss = sorted(p for p, c in losses.items() if c == 1)
    return [no_loss, one_loss]`,

    javascript: `function findWinners(matches) {
  const losses = new Map();
  for (const [w, l] of matches) {
    if (!losses.has(w)) losses.set(w, 0);
    losses.set(l, (losses.get(l) || 0) + 1);
  }
  const noLoss = [], oneLoss = [];
  for (const [p, c] of losses) {
    if (c === 0) noLoss.push(p);
    else if (c === 1) oneLoss.push(p);
  }
  return [noLoss.sort((a,b)=>a-b), oneLoss.sort((a,b)=>a-b)];
}`,

    java: `public List<List<Integer>> findWinners(int[][] matches) {
    Map<Integer, Integer> losses = new HashMap<>();
    for (int[] m : matches) {
        losses.putIfAbsent(m[0], 0);
        losses.merge(m[1], 1, Integer::sum);
    }
    List<Integer> noLoss = new ArrayList<>(), oneLoss = new ArrayList<>();
    for (var e : losses.entrySet()) {
        if (e.getValue() == 0) noLoss.add(e.getKey());
        else if (e.getValue() == 1) oneLoss.add(e.getKey());
    }
    Collections.sort(noLoss); Collections.sort(oneLoss);
    return List.of(noLoss, oneLoss);
}`,
  },

  defaultInput: {
    matches: [[1, 3], [2, 3], [3, 6], [5, 6], [5, 7], [4, 5], [4, 8], [4, 9], [10, 4], [10, 9]],
  },

  inputFields: [
    {
      name: 'matches',
      label: 'Matches [winner, loser]',
      type: 'array',
      defaultValue: [[1, 3], [2, 3], [3, 6], [5, 6], [5, 7], [4, 5], [4, 8], [4, 9], [10, 4], [10, 9]],
      placeholder: '1,3|2,3|3,6',
      helperText: 'Each pair is [winner, loser]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matches = input.matches as number[][];
    const steps: AlgorithmStep[] = [];
    const losses: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: `Process ${matches.length} matches. Track loss counts: winners get 0 if not seen; losers increment loss count.`,
      variables: { losses: '{}' },
      visualization: {
        type: 'array',
        array: matches.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(matches.map((m, i) => [i, `${m[0]}v${m[1]}`])),
      },
    });

    for (let i = 0; i < matches.length; i++) {
      const [winner, loser] = matches[i];

      if (!(winner in losses)) {
        losses[winner] = 0;
      }
      losses[loser] = (losses[loser] || 0) + 1;

      steps.push({
        line: 5,
        explanation: `Match ${i}: winner=${winner}, loser=${loser}. losses[${winner}]=${losses[winner]}, losses[${loser}]=${losses[loser]}.`,
        variables: { match: i, winner, loser, lossesMap: JSON.stringify(losses) },
        visualization: {
          type: 'array',
          array: matches.map((_, idx) => idx),
          highlights: { [i]: 'active' },
          labels: { [i]: `W:${winner} L:${loser}` },
        },
      });
    }

    const noLoss = Object.entries(losses)
      .filter(([, c]) => c === 0)
      .map(([p]) => Number(p))
      .sort((a, b) => a - b);

    const oneLoss = Object.entries(losses)
      .filter(([, c]) => c === 1)
      .map(([p]) => Number(p))
      .sort((a, b) => a - b);

    steps.push({
      line: 7,
      explanation: `Loss counts: ${JSON.stringify(losses)}. Players with 0 losses: [${noLoss.join(', ')}]. Players with exactly 1 loss: [${oneLoss.join(', ')}].`,
      variables: { losses: JSON.stringify(losses), noLoss: noLoss.join(','), oneLoss: oneLoss.join(',') },
      visualization: {
        type: 'array',
        array: noLoss,
        highlights: Object.fromEntries(noLoss.map((_, i) => [i, 'found'])),
        labels: { 0: '0 losses' },
      },
    });

    steps.push({
      line: 8,
      explanation: `Final result: [[${noLoss.join(', ')}], [${oneLoss.join(', ')}]].`,
      variables: { result: JSON.stringify([noLoss, oneLoss]) },
      visualization: {
        type: 'array',
        array: oneLoss,
        highlights: Object.fromEntries(oneLoss.map((_, i) => [i, 'comparing'])),
        labels: { 0: '1 loss' },
      },
    });

    return steps;
  },
};

export default findPlayersWithZeroOrOneLosses;
