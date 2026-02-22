import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fractionalKnapsack: AlgorithmDefinition = {
  id: 'fractional-knapsack',
  title: 'Fractional Knapsack',
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given items each with a weight and value, and a knapsack of capacity W, maximize total value. Unlike 0/1 knapsack, you can take fractional amounts. Greedy: sort items by value-per-weight ratio descending, and greedily take as much as possible of each item.',
  tags: ['Greedy', 'Sorting', 'Array'],
  code: {
    pseudocode: `function fractionalKnapsack(weights, values, capacity):
  items = zip(weights, values) sorted by value/weight desc
  totalValue = 0, remaining = capacity
  for each (w, v) in items:
    if remaining >= w:
      take all: totalValue += v; remaining -= w
    else:
      fraction = remaining / w
      totalValue += v * fraction
      remaining = 0; break
  return totalValue`,
    python: `def fractionalKnapsack(weights, values, capacity):
    items = sorted(zip(weights, values),
                   key=lambda x: x[1]/x[0], reverse=True)
    total = remaining = capacity
    result = 0.0
    for w, v in items:
        if remaining >= w:
            result += v; remaining -= w
        else:
            result += v * (remaining / w); break
    return result`,
    javascript: `function fractionalKnapsack(weights, values, capacity) {
  const items = weights.map((w, i) => ({ w, v: values[i], ratio: values[i]/w }))
    .sort((a, b) => b.ratio - a.ratio);
  let totalValue = 0, remaining = capacity;
  for (const { w, v } of items) {
    if (remaining >= w) {
      totalValue += v; remaining -= w;
    } else {
      totalValue += v * (remaining / w); break;
    }
  }
  return totalValue;
}`,
    java: `public double fractionalKnapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> Double.compare(
        (double)values[b]/weights[b], (double)values[a]/weights[a]));
    double total = 0; int remaining = capacity;
    for (int i : idx) {
        if (remaining >= weights[i]) { total += values[i]; remaining -= weights[i]; }
        else { total += values[i] * ((double)remaining / weights[i]); break; }
    }
    return total;
}`,
  },
  defaultInput: { weights: [10, 20, 30], values: [60, 100, 120], capacity: 50 },
  inputFields: [
    {
      name: 'weights',
      label: 'Weights',
      type: 'array',
      defaultValue: [10, 20, 30],
      placeholder: 'e.g. 10,20,30',
      helperText: 'Weight of each item',
    },
    {
      name: 'values',
      label: 'Values',
      type: 'array',
      defaultValue: [60, 100, 120],
      placeholder: 'e.g. 60,100,120',
      helperText: 'Value of each item',
    },
    {
      name: 'capacity',
      label: 'Knapsack Capacity',
      type: 'number',
      defaultValue: 50,
      placeholder: 'e.g. 50',
      helperText: 'Maximum weight the knapsack can hold',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const values = input.values as number[];
    const capacity = input.capacity as number;
    const steps: AlgorithmStep[] = [];

    // Build items and sort by value/weight ratio
    const items = weights.map((w, i) => ({
      w,
      v: values[i],
      ratio: values[i] / w,
      idx: i,
    })).sort((a, b) => b.ratio - a.ratio);

    const n = items.length;
    let remaining = capacity;
    let totalValue = 0;
    const fractionTaken: number[] = new Array(n).fill(0); // fraction [0,1]

    function makeViz(activeIdx: number | null): ArrayVisualization {
      // Show ratios as the array values
      const ratios = items.map(item => Math.round(item.ratio * 100) / 100);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        const frac = fractionTaken[i];
        labels[i] = `v/w=${items[i].ratio.toFixed(1)}`;
        if (frac === 1) highlights[i] = 'found';
        else if (frac > 0) highlights[i] = 'comparing';
        else if (i === activeIdx) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: ratios,
        highlights,
        labels,
        auxData: {
          label: 'Knapsack State',
          entries: [
            { key: 'Items (sorted by v/w)', value: items.map(it => `(w=${it.w},v=${it.v},r=${it.ratio.toFixed(1)})`).join(', ') },
            { key: 'Remaining capacity', value: String(remaining.toFixed(2)) },
            { key: 'Total value', value: String(totalValue.toFixed(2)) },
            { key: 'Capacity', value: String(capacity) },
            ...items.map((it, i) => ({ key: `  Item ${it.idx + 1}`, value: fractionTaken[i] === 0 ? 'not taken' : fractionTaken[i] === 1 ? 'full' : `${(fractionTaken[i] * 100).toFixed(0)}%` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort items by value/weight ratio: ${items.map(it => `(w=${it.w},v=${it.v},ratio=${it.ratio.toFixed(2)})`).join(', ')}. Capacity=${capacity}.`,
      variables: { items: items.map(it => ({ w: it.w, v: it.v, ratio: it.ratio.toFixed(2) })), capacity },
      visualization: makeViz(null),
    });

    for (let i = 0; i < n; i++) {
      const item = items[i];
      steps.push({
        line: 4,
        explanation: `Consider item (w=${item.w}, v=${item.v}, ratio=${item.ratio.toFixed(2)}). Remaining capacity: ${remaining.toFixed(2)}.`,
        variables: { weight: item.w, value: item.v, ratio: item.ratio.toFixed(2), remaining },
        visualization: makeViz(i),
      });

      if (remaining >= item.w) {
        totalValue += item.v;
        remaining -= item.w;
        fractionTaken[i] = 1;
        steps.push({
          line: 5,
          explanation: `Take entire item (w=${item.w} fits in remaining ${remaining + item.w}). +${item.v} value. Total: ${totalValue.toFixed(2)}, remaining: ${remaining.toFixed(2)}.`,
          variables: { taken: 'full', totalValue, remaining },
          visualization: makeViz(i),
        });
      } else if (remaining > 0) {
        const fraction = remaining / item.w;
        const partialValue = item.v * fraction;
        totalValue += partialValue;
        fractionTaken[i] = fraction;
        steps.push({
          line: 8,
          explanation: `Take ${(fraction * 100).toFixed(0)}% of item (only ${remaining.toFixed(2)} capacity left). +${partialValue.toFixed(2)} value. Total: ${totalValue.toFixed(2)}.`,
          variables: { fraction: fraction.toFixed(2), partialValue: partialValue.toFixed(2), totalValue },
          visualization: makeViz(i),
        });
        remaining = 0;
        break;
      } else {
        steps.push({
          line: 4,
          explanation: `No remaining capacity. Stop.`,
          variables: { remaining },
          visualization: makeViz(i),
        });
        break;
      }
    }

    steps.push({
      line: 10,
      explanation: `Maximum value achievable: ${totalValue.toFixed(2)}.`,
      variables: { totalValue },
      visualization: (() => {
        const ratios = items.map(it => Math.round(it.ratio * 100) / 100);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          l[i] = `r=${items[i].ratio.toFixed(1)}`;
          h[i] = fractionTaken[i] > 0 ? 'found' : 'visited';
        }
        return {
          type: 'array' as const,
          array: ratios,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Max value', value: totalValue.toFixed(2) },
              { key: 'Capacity used', value: String((capacity - remaining).toFixed(2)) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default fractionalKnapsack;
