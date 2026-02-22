import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const handOfStraights: AlgorithmDefinition = {
  id: 'hand-of-straights',
  title: 'Hand of Straights',
  leetcodeNumber: 846,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Determine if a hand of cards can be rearranged into groups of groupSize consecutive cards. Greedy: sort the unique card values. For each smallest remaining card, try to form a consecutive group of groupSize starting from it. Fail if any required next card is missing.',
  tags: ['greedy', 'hash map', 'sorting', 'array'],

  code: {
    pseudocode: `function isNStraightHand(hand, groupSize):
  if length(hand) % groupSize != 0: return false
  freq = count frequency of each card
  for each card in sorted unique values:
    if freq[card] > 0:
      count = freq[card]
      for i = 0 to groupSize - 1:
        if freq[card+i] < count: return false
        freq[card+i] -= count
  return true`,

    python: `def isNStraightHand(hand: list[int], groupSize: int) -> bool:
    if len(hand) % groupSize != 0:
        return False
    from collections import Counter
    freq = Counter(hand)
    for card in sorted(freq):
        if freq[card] > 0:
            count = freq[card]
            for i in range(groupSize):
                if freq[card + i] < count:
                    return False
                freq[card + i] -= count
    return True`,

    javascript: `function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  const freq = {};
  for (const c of hand) freq[c] = (freq[c] || 0) + 1;
  for (const card of Object.keys(freq).map(Number).sort((a, b) => a - b)) {
    if (freq[card] > 0) {
      const count = freq[card];
      for (let i = 0; i < groupSize; i++) {
        if ((freq[card + i] || 0) < count) return false;
        freq[card + i] -= count;
      }
    }
  }
  return true;
}`,

    java: `public boolean isNStraightHand(int[] hand, int groupSize) {
    if (hand.length % groupSize != 0) return false;
    Map<Integer, Integer> freq = new TreeMap<>();
    for (int c : hand) freq.merge(c, 1, Integer::sum);
    for (int card : freq.keySet()) {
        int count = freq.get(card);
        if (count > 0) {
            for (int i = 0; i < groupSize; i++) {
                if (freq.getOrDefault(card + i, 0) < count) return false;
                freq.merge(card + i, -count, Integer::sum);
            }
        }
    }
    return true;
}`,
  },

  defaultInput: {
    hand: [1, 2, 3, 6, 2, 3, 4, 7, 8],
    groupSize: 3,
  },

  inputFields: [
    {
      name: 'hand',
      label: 'Hand of Cards',
      type: 'array',
      defaultValue: [1, 2, 3, 6, 2, 3, 4, 7, 8],
      placeholder: '1,2,3,6,2,3,4,7,8',
      helperText: 'Card values in hand',
    },
    {
      name: 'groupSize',
      label: 'Group Size',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of each consecutive group',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const hand = input.hand as number[];
    const groupSize = input.groupSize as number;
    const steps: AlgorithmStep[] = [];

    if (hand.length % groupSize !== 0) {
      steps.push({
        line: 1,
        explanation: `hand.length=${hand.length} is not divisible by groupSize=${groupSize}. Impossible. Return false.`,
        variables: { handLength: hand.length, groupSize },
        visualization: {
          type: 'array',
          array: [...hand],
          highlights: Object.fromEntries(hand.map((_, i) => [i, 'mismatch'])),
          labels: {},
        },
      });
      return steps;
    }

    const freq: Record<number, number> = {};
    for (const c of hand) freq[c] = (freq[c] || 0) + 1;
    const freqStr = Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ');

    steps.push({
      line: 2,
      explanation: `hand.length=${hand.length} divisible by groupSize=${groupSize}. Frequencies: {${freqStr}}. Process smallest cards first.`,
      variables: { freq: freqStr, groupSize },
      visualization: {
        type: 'array',
        array: Object.keys(freq).map(Number).sort((a, b) => a - b),
        highlights: Object.fromEntries(Object.keys(freq).map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(Object.entries(freq).map(([k, v], i) => [i, k + 'x' + v])),
      },
    });

    const sortedCards = Object.keys(freq).map(Number).sort((a, b) => a - b);

    for (const card of sortedCards) {
      if (freq[card] <= 0) continue;

      const count = freq[card];

      steps.push({
        line: 5,
        explanation: `Smallest available card: ${card} (count=${count}). Need to form ${count} group(s) of size ${groupSize} starting here.`,
        variables: { card, count, groupSize },
        visualization: {
          type: 'array',
          array: sortedCards,
          highlights: { [sortedCards.indexOf(card)]: 'active' },
          labels: { [sortedCards.indexOf(card)]: 'start' },
        },
      });

      let failed = false;
      for (let i = 0; i < groupSize; i++) {
        const needed = card + i;
        const available = freq[needed] || 0;

        if (available < count) {
          steps.push({
            line: 7,
            explanation: `Need ${count} of card ${needed}, but only ${available} available. Cannot form groups. Return false.`,
            variables: { needed, available, count },
            visualization: {
              type: 'array',
              array: sortedCards,
              highlights: { [sortedCards.indexOf(needed)] : 'mismatch' },
              labels: { [sortedCards.indexOf(needed)]: 'MISSING' },
            },
          });
          failed = true;
          break;
        }

        freq[needed] -= count;

        steps.push({
          line: 8,
          explanation: `Use ${count} of card ${needed}. Remaining freq[${needed}]=${freq[needed]}.`,
          variables: { needed, used: count, remaining: freq[needed] },
          visualization: {
            type: 'array',
            array: sortedCards,
            highlights: { [sortedCards.indexOf(needed)]: 'found' },
            labels: { [sortedCards.indexOf(needed)]: 'rem:' + freq[needed] },
          },
        });
      }

      if (failed) return steps;
    }

    steps.push({
      line: 9,
      explanation: `All cards grouped into consecutive groups of size ${groupSize}. Return true.`,
      variables: { result: true, groups: hand.length / groupSize },
      visualization: {
        type: 'array',
        array: [...hand].sort((a, b) => a - b),
        highlights: Object.fromEntries(hand.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default handOfStraights;
