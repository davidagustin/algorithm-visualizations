import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const zeroOneKnapsack: AlgorithmDefinition = {
  id: '0-1-knapsack',
  title: '0/1 Knapsack',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given n items with weights and values, and a knapsack capacity W, find the maximum value you can carry. Each item can be taken or left (0/1). We use 1D DP optimized from the 2D table: iterate items and update dp[w] from right to left.',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function knapsack(weights, values, capacity):
  n = length(weights)
  dp = array of size capacity+1, all 0
  for i from 0 to n-1:
    for w from capacity down to weights[i]:
      dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
  return dp[capacity]`,
    python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]`,
    javascript: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}`,
    java: `public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < n; i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}`,
  },
  defaultInput: {
    weights: [1, 2, 3],
    values: [6, 10, 12],
    capacity: 5,
  },
  inputFields: [
    {
      name: 'weights',
      label: 'Weights',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Weight of each item',
    },
    {
      name: 'values',
      label: 'Values',
      type: 'array',
      defaultValue: [6, 10, 12],
      placeholder: '6,10,12',
      helperText: 'Value of each item',
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum weight the knapsack can carry',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const values = input.values as number[];
    const capacity = input.capacity as number;
    const n = weights.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(capacity + 1).fill(0);
    const labels: string[] = Array.from({ length: capacity + 1 }, (_, i) => `w=${i}`);

    function makeViz(
      activeIdx: number | null,
      comparingIdx: number | null,
      itemIdx: number
    ): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let w = 0; w <= capacity; w++) {
        if (dp[w] !== null && (dp[w] as number) > 0) highlights[w] = 'found';
      }
      if (comparingIdx !== null && comparingIdx >= 0) highlights[comparingIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return {
        type: 'dp-table',
        values: dp.slice(),
        highlights,
        labels: labels.map((l, w) => {
          if (itemIdx >= 0 && itemIdx < n) {
            return `${l}`;
          }
          return l;
        }),
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} items. Weights: [${weights.join(',')}], Values: [${values.join(',')}], Capacity: ${capacity}. dp[w] = max value with capacity w.`,
      variables: { n, weights, values, capacity },
      visualization: makeViz(null, null, -1),
    });

    steps.push({
      line: 3,
      explanation: 'Initialize dp array: dp[w] = 0 for all w. No items considered yet.',
      variables: { dp: dp.slice() },
      visualization: makeViz(null, null, -1),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 4,
        explanation: `Consider item ${i}: weight=${weights[i]}, value=${values[i]}. Update dp from capacity=${capacity} down to weight=${weights[i]}.`,
        variables: { item: i, weight: weights[i], value: values[i] },
        visualization: makeViz(null, null, i),
      });

      for (let w = capacity; w >= weights[i]; w--) {
        const exclude = dp[w] as number;
        const include = (dp[w - weights[i]] as number) + values[i];

        if (include > exclude) {
          dp[w] = include;

          steps.push({
            line: 5,
            explanation: `w=${w}: include item ${i} -> dp[${w - weights[i]}]+${values[i]} = ${include} > exclude ${exclude}. Update dp[${w}] = ${include}.`,
            variables: { w, item: i, include, exclude, 'dp[w]': dp[w] },
            visualization: makeViz(w, w - weights[i], i),
          });
        } else {
          steps.push({
            line: 5,
            explanation: `w=${w}: include item ${i} -> dp[${w - weights[i]}]+${values[i]} = ${include} <= exclude ${exclude}. Keep dp[${w}] = ${exclude}.`,
            variables: { w, item: i, include, exclude },
            visualization: makeViz(w, w - weights[i], i),
          });
        }
      }
    }

    // Final
    steps.push({
      line: 6,
      explanation: `dp[${capacity}] = ${dp[capacity]}. Maximum value achievable with capacity ${capacity} is ${dp[capacity]}.`,
      variables: { result: dp[capacity] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: capacity + 1 }, (_, w) => [
            w,
            w === capacity ? 'active' : (dp[w] as number) > 0 ? 'found' : 'default',
          ])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default zeroOneKnapsack;
