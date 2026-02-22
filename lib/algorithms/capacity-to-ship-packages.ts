import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const capacityToShipPackages: AlgorithmDefinition = {
  id: 'capacity-to-ship-packages',
  title: 'Capacity to Ship Packages Within D Days',
  leetcodeNumber: 1011,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the minimum ship capacity to ship all packages in at most d days. Binary search on the capacity: the minimum is max(weights) and the maximum is sum(weights). For each candidate capacity, greedily simulate shipping to check feasibility.',
  tags: ['binary search', 'greedy', 'array'],

  code: {
    pseudocode: `function shipWithinDays(weights, days):
  left = max(weights), right = sum(weights)
  while left < right:
    mid = left + (right - left) / 2
    if canShip(weights, days, mid):
      right = mid
    else:
      left = mid + 1
  return left

function canShip(weights, days, cap):
  daysNeeded = 1, load = 0
  for w in weights:
    if load + w > cap:
      daysNeeded++, load = 0
    load += w
  return daysNeeded <= days`,

    python: `def shipWithinDays(weights: list[int], days: int) -> int:
    def canShip(cap):
        needed, load = 1, 0
        for w in weights:
            if load + w > cap:
                needed += 1
                load = 0
            load += w
        return needed <= days

    left, right = max(weights), sum(weights)
    while left < right:
        mid = left + (right - left) // 2
        if canShip(mid):
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function shipWithinDays(weights, days) {
  const canShip = (cap) => {
    let needed = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { needed++; load = 0; }
      load += w;
    }
    return needed <= days;
  };
  let left = Math.max(...weights), right = weights.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canShip(mid)) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int shipWithinDays(int[] weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) { left = Math.max(left, w); right += w; }
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canShip(weights, days, mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    days: 5,
  },

  inputFields: [
    {
      name: 'weights',
      label: 'Package Weights',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      placeholder: '1,2,3,4,5,6,7,8,9,10',
      helperText: 'Comma-separated package weights in order',
    },
    {
      name: 'days',
      label: 'Days',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum number of days to ship all packages',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const days = input.days as number;
    const steps: AlgorithmStep[] = [];

    const canShip = (cap: number): { feasible: boolean; daysNeeded: number } => {
      let needed = 1;
      let load = 0;
      for (const w of weights) {
        if (load + w > cap) { needed++; load = 0; }
        load += w;
      }
      return { feasible: needed <= days, daysNeeded: needed };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>, lo: number, hi: number, mid?: number): ArrayVisualization => ({
      type: 'array',
      array: [...weights],
      highlights,
      labels,
      auxData: {
        label: 'Binary Search on Capacity',
        entries: [
          { key: 'left (min cap)', value: String(lo) },
          { key: 'right (max cap)', value: String(hi) },
          { key: 'days limit', value: String(days) },
          ...(mid !== undefined ? [{ key: 'testing capacity', value: String(mid) }] : []),
        ],
      },
    });

    let left = Math.max(...weights);
    let right = weights.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `Binary search on ship capacity. left = max(weights) = ${left}, right = sum(weights) = ${right}.`,
      variables: { left, right, days },
      visualization: makeViz({}, {}, left, right),
    });

    let iteration = 0;
    while (left < right) {
      iteration++;
      const mid = left + Math.floor((right - left) / 2);
      const { feasible, daysNeeded } = canShip(mid);

      // Highlight how packages group with this capacity
      const highlights: Record<number, string> = {};
      let load = 0;
      let dayNum = 0;
      const colors = ['comparing', 'active', 'pointer', 'current'];
      for (let i = 0; i < weights.length; i++) {
        if (load + weights[i] > mid) { dayNum++; load = 0; }
        highlights[i] = colors[dayNum % colors.length];
        load += weights[i];
      }

      steps.push({
        line: 3,
        explanation: `Iteration ${iteration}: Test capacity = ${mid}. Simulating shipping...`,
        variables: { left, right, mid, days },
        visualization: makeViz(highlights, {}, left, right, mid),
      });

      steps.push({
        line: 10,
        explanation: `With capacity=${mid}: need ${daysNeeded} day(s). ${feasible ? `${daysNeeded} <= ${days}, feasible!` : `${daysNeeded} > ${days}, too small.`}`,
        variables: { capacity: mid, daysNeeded, days, feasible },
        visualization: makeViz(
          weights.map((_, i) => ({ [i]: feasible ? 'found' : 'mismatch' })).reduce((a, b) => ({ ...a, ...b }), {}),
          {},
          left, right, mid
        ),
      });

      if (feasible) {
        steps.push({
          line: 5,
          explanation: `Capacity ${mid} works. Try smaller: right = ${mid}.`,
          variables: { left, right: mid },
          visualization: makeViz({}, {}, left, mid, mid),
        });
        right = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `Capacity ${mid} too small. Increase: left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: makeViz({}, {}, mid + 1, right, mid),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 8,
      explanation: `Converged: minimum capacity = ${left}. All ${weights.length} packages ship within ${days} day(s).`,
      variables: { result: left },
      visualization: makeViz(
        weights.map((_, i) => ({ [i]: 'sorted' })).reduce((a, b) => ({ ...a, ...b }), {}),
        {},
        left, left
      ),
    });

    return steps;
  },
};

export default capacityToShipPackages;
