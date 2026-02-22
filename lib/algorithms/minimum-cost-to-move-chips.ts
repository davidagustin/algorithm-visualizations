import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToMoveChips: AlgorithmDefinition = {
  id: 'minimum-cost-to-move-chips',
  title: 'Minimum Cost to Move Chips to Same Position',
  leetcodeNumber: 1217,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'Chips can be moved 2 positions for free, or 1 position for cost 1. So all chips at even positions can meet at any even position for free, and same for odd. The answer is the minimum of: count of chips at odd positions vs count at even positions.',
  tags: ['greedy', 'array', 'math'],

  code: {
    pseudocode: `function minCostToMoveChips(position):
  evenCount = number of chips at even positions
  oddCount = number of chips at odd positions
  return min(evenCount, oddCount)`,

    python: `def minCostToMoveChips(position: list[int]) -> int:
    even_count = sum(1 for p in position if p % 2 == 0)
    odd_count = sum(1 for p in position if p % 2 == 1)
    return min(even_count, odd_count)`,

    javascript: `function minCostToMoveChips(position) {
  const evenCount = position.filter(p => p % 2 === 0).length;
  const oddCount = position.filter(p => p % 2 === 1).length;
  return Math.min(evenCount, oddCount);
}`,

    java: `public int minCostToMoveChips(int[] position) {
    int evenCount = 0, oddCount = 0;
    for (int p : position) {
        if (p % 2 == 0) evenCount++;
        else oddCount++;
    }
    return Math.min(evenCount, oddCount);
}`,
  },

  defaultInput: {
    position: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'position',
      label: 'Chip Positions',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Position of each chip on the number line',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const position = input.position as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: 'Moving 2 positions is free. So chips at even positions can consolidate to any even position at no cost, and odd positions similarly.',
      variables: { position: position.join(',') },
      visualization: {
        type: 'array',
        array: [...position],
        highlights: Object.fromEntries(position.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(position.map((p, i) => [i, p % 2 === 0 ? 'even' : 'odd'])),
      },
    });

    let evenCount = 0;
    let oddCount = 0;

    for (let i = 0; i < position.length; i++) {
      const isEven = position[i] % 2 === 0;
      if (isEven) evenCount++;
      else oddCount++;

      steps.push({
        line: 2,
        explanation: `position[${i}]=${position[i]} is ${isEven ? 'even' : 'odd'}. evenCount=${evenCount}, oddCount=${oddCount}.`,
        variables: { i, 'position[i]': position[i], parity: isEven ? 'even' : 'odd', evenCount, oddCount },
        visualization: {
          type: 'array',
          array: [...position],
          highlights: {
            [i]: 'active',
            ...Object.fromEntries(
              position.slice(0, i).map((p, k) => [k, p % 2 === 0 ? 'found' : 'comparing'])
            ),
          },
          labels: Object.fromEntries(position.map((p, k) => [k, p % 2 === 0 ? 'E' : 'O'])),
        },
      });
    }

    steps.push({
      line: 3,
      explanation: `evenCount=${evenCount}, oddCount=${oddCount}. To merge groups, cost = min(evenCount, oddCount) = min(${evenCount}, ${oddCount}) = ${Math.min(evenCount, oddCount)}.`,
      variables: { evenCount, oddCount, result: Math.min(evenCount, oddCount) },
      visualization: {
        type: 'array',
        array: [...position],
        highlights: Object.fromEntries(
          position.map((p, i) => [i, p % 2 === 0 ? 'found' : 'active'])
        ),
        labels: Object.fromEntries(position.map((p, i) => [i, p % 2 === 0 ? 'even' : 'odd'])),
      },
    });

    return steps;
  },
};

export default minimumCostToMoveChips;
