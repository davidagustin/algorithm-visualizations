import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reducingDishes: AlgorithmDefinition = {
  id: 'reducing-dishes',
  title: 'Reducing Dishes',
  leetcodeNumber: 1402,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'A chef has n dishes with satisfaction levels. Cooking a dish at time t contributes satisfaction[i] * t to the like-time coefficient. You can cook any subset in any order. Maximize the total like-time coefficient. Greedy: sort descending, then greedily add dishes from the front as long as the running suffix sum is positive.',
  tags: ['greedy', 'sorting', 'suffix sum'],

  code: {
    pseudocode: `function maxSatisfaction(satisfaction):
  sort satisfaction descending
  total = 0
  suffixSum = 0
  for each s in satisfaction:
    suffixSum += s
    if suffixSum <= 0: break
    total += suffixSum
  return total`,

    python: `def maxSatisfaction(satisfaction: list[int]) -> int:
    satisfaction.sort(reverse=True)
    total = suffix = 0
    for s in satisfaction:
        suffix += s
        if suffix <= 0:
            break
        total += suffix
    return total`,

    javascript: `function maxSatisfaction(satisfaction) {
  satisfaction.sort((a, b) => b - a);
  let total = 0, suffix = 0;
  for (const s of satisfaction) {
    suffix += s;
    if (suffix <= 0) break;
    total += suffix;
  }
  return total;
}`,

    java: `public int maxSatisfaction(int[] satisfaction) {
    Arrays.sort(satisfaction);
    int total = 0, suffix = 0;
    for (int i = satisfaction.length - 1; i >= 0; i--) {
        suffix += satisfaction[i];
        if (suffix <= 0) break;
        total += suffix;
    }
    return total;
}`,
  },

  defaultInput: {
    satisfaction: [-1, -8, 0, 5, -9],
  },

  inputFields: [
    {
      name: 'satisfaction',
      label: 'Satisfaction Levels',
      type: 'array',
      defaultValue: [-1, -8, 0, 5, -9],
      placeholder: '-1,-8,0,5,-9',
      helperText: 'Satisfaction values for each dish',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const satisfaction = [...(input.satisfaction as number[])];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Sort satisfaction levels descending: cook highest satisfaction dishes first to maximize coefficients.`,
      variables: { original: [...satisfaction] },
      visualization: {
        type: 'array',
        array: [...satisfaction],
        highlights: {},
        labels: {},
      },
    });

    satisfaction.sort((a, b) => b - a);

    steps.push({
      line: 1,
      explanation: `Sorted descending: [${satisfaction.join(', ')}]. Now greedily add dishes while running suffix sum is positive.`,
      variables: { sorted: [...satisfaction] },
      visualization: {
        type: 'array',
        array: [...satisfaction],
        highlights: {},
        labels: {},
      },
    });

    let total = 0;
    let suffixSum = 0;

    for (let i = 0; i < satisfaction.length; i++) {
      const s = satisfaction[i];
      const prevSuffix = suffixSum;
      suffixSum += s;

      if (suffixSum <= 0) {
        steps.push({
          line: 5,
          explanation: `Dish ${i} (satisfaction=${s}): suffixSum = ${prevSuffix} + ${s} = ${suffixSum} <= 0. Adding this dish hurts the total. Stop.`,
          variables: { i, s, suffixSum, total },
          visualization: {
            type: 'array',
            array: [...satisfaction],
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'found'])),
              [i]: 'mismatch',
            } as Record<number, string>,
            labels: { [i]: 'stop' } as Record<number, string>,
          },
        });
        break;
      }

      total += suffixSum;
      steps.push({
        line: 6,
        explanation: `Dish ${i} (satisfaction=${s}): suffixSum = ${suffixSum} > 0. Add to total. total += ${suffixSum} => total = ${total}.`,
        variables: { i, s, suffixSum, total },
        visualization: {
          type: 'array',
          array: [...satisfaction],
          highlights: {
            ...Object.fromEntries(Array.from({ length: i + 1 }, (_, j) => [j, 'found'])),
          } as Record<number, string>,
          labels: { [i]: `+${suffixSum}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Maximum like-time coefficient: ${total}.`,
      variables: { result: total },
      visualization: {
        type: 'array',
        array: [...satisfaction],
        highlights: Object.fromEntries(satisfaction.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default reducingDishes;
