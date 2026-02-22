import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const randomPickWithWeightIi: AlgorithmDefinition = {
  id: 'random-pick-with-weight-ii',
  title: 'Random Pick with Weight',
  leetcodeNumber: 528,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array of weights, implement pickIndex() to randomly pick an index with probability proportional to its weight. Build a prefix sum array and use binary search to find the target index in O(log n).',
  tags: ['Hash Map', 'Design', 'Binary Search', 'Prefix Sum', 'Random'],
  code: {
    pseudocode: `class Solution:
  function init(w):
    prefix = prefix sums of w
    total = sum(w)
  function pickIndex():
    target = random float in [0, 1) * total
    // binary search for first prefix[i] > target
    lo = 0, hi = len(prefix) - 1
    while lo < hi:
      mid = (lo + hi) // 2
      if prefix[mid] < target: lo = mid + 1
      else: hi = mid
    return lo`,
    python: `import random
import bisect

class Solution:
    def __init__(self, w):
        self.prefix = []
        total = 0
        for x in w:
            total += x
            self.prefix.append(total)
        self.total = total

    def pickIndex(self) -> int:
        target = random.random() * self.total
        return bisect.bisect_right(self.prefix, target)`,
    javascript: `class Solution {
  constructor(w) {
    this.prefix = [];
    let total = 0;
    for (const x of w) { total += x; this.prefix.push(total); }
    this.total = total;
  }
  pickIndex() {
    const target = Math.random() * this.total;
    let lo = 0, hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}`,
    java: `class Solution {
    private int[] prefix;
    private int total;
    public Solution(int[] w) {
        prefix = new int[w.length];
        for (int i = 0; i < w.length; i++)
            prefix[i] = (i > 0 ? prefix[i-1] : 0) + w[i];
        total = prefix[w.length - 1];
    }
    public int pickIndex() {
        int target = (int)(Math.random() * total);
        int lo = 0, hi = prefix.length - 1;
        while (lo < hi) { int mid = (lo+hi)/2; if (prefix[mid] <= target) lo = mid+1; else hi = mid; }
        return lo;
    }
}`,
  },
  defaultInput: {
    weights: [1, 3, 2, 4],
    numPicks: 6,
  },
  inputFields: [
    {
      name: 'weights',
      label: 'Weights',
      type: 'array',
      defaultValue: [1, 3, 2, 4],
      placeholder: '1, 3, 2, 4',
      helperText: 'Array of positive weights',
    },
    {
      name: 'numPicks',
      label: 'Number of Picks (simulation)',
      type: 'number',
      defaultValue: 6,
      placeholder: 'e.g. 6',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const numPicks = (input.numPicks as number) || 6;
    const steps: AlgorithmStep[] = [];

    // Build prefix sums
    const prefix: number[] = [];
    let total = 0;
    for (const w of weights) {
      total += w;
      prefix.push(total);
    }

    function makeViz(activeIdx: number, label: string, target: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      prefix.forEach((p, i) => {
        highlights[i] = i === activeIdx ? 'active' : 'default';
        lbls[i] = `w=${weights[i]}\nps=${p}`;
      });
      return {
        type: 'array',
        array: [...prefix],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Random Pick with Weight',
          entries: [
            { key: 'Action', value: label },
            { key: 'Weights', value: weights.join(', ') },
            { key: 'Prefix sums', value: prefix.join(', ') },
            { key: 'Total', value: `${total}` },
            { key: 'Target', value: target >= 0 ? `${target.toFixed(2)}` : 'N/A' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize with weights [${weights.join(', ')}]. Build prefix sums: [${prefix.join(', ')}]. Total = ${total}.`, variables: { weights, prefix: [...prefix], total }, visualization: makeViz(-1, 'Init', -1) });

    steps.push({ line: 3, explanation: `Prefix sums built: [${prefix.join(', ')}]. Index i is picked with prob ${weights.map((w, i) => `${i}:${(w / total * 100).toFixed(1)}%`).join(', ')}.`, variables: { prefix: [...prefix], total }, visualization: makeViz(-1, 'Prefix sums built', -1) });

    // Simulate a few picks with deterministic targets for demonstration
    const demoTargets = weights.map((_, i) => prefix[i] - weights[i] / 2);
    for (let pick = 0; pick < Math.min(numPicks, demoTargets.length); pick++) {
      const target = demoTargets[pick];
      let lo = 0, hi = prefix.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (prefix[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const result = lo;

      steps.push({
        line: 7,
        explanation: `pickIndex(): Random target = ${target.toFixed(2)} (in total=${total}). Binary search finds index ${result} (prefix[${result}]=${prefix[result]} >= target).`,
        variables: { target, result, prefix: [...prefix] },
        visualization: makeViz(result, `pickIndex() -> ${result}`, target),
      });
    }

    steps.push({ line: 13, explanation: `Demonstration complete. Each index picked with probability proportional to its weight.`, variables: { weights, prefix: [...prefix] }, visualization: makeViz(-1, 'Complete', -1) });

    return steps;
  },
};

export default randomPickWithWeightIi;
