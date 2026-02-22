import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const randomPickWithWeight: AlgorithmDefinition = {
  id: 'random-pick-with-weight',
  title: 'Random Pick with Weight',
  leetcodeNumber: 528,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given an array of weights, implement pickIndex() to randomly pick an index proportional to its weight. Build a prefix sum array, generate a random number in [1, total], then binary search the prefix sums to find the corresponding index.',
  tags: ['binary search', 'prefix sum', 'random', 'math'],

  code: {
    pseudocode: `function buildPrefixSums(w):
  prefix = []
  total = 0
  for weight in w:
    total += weight
    prefix.append(total)
  return prefix, total

function pickIndex(prefix, total):
  target = random(1, total)
  left, right = 0, len(prefix) - 1
  while left < right:
    mid = (left + right) / 2
    if prefix[mid] < target:
      left = mid + 1
    else:
      right = mid
  return left`,

    python: `import random
import bisect

class Solution:
    def __init__(self, w: list[int]):
        self.prefix = []
        total = 0
        for weight in w:
            total += weight
            self.prefix.append(total)
        self.total = total

    def pickIndex(self) -> int:
        target = random.randint(1, self.total)
        return bisect.bisect_left(self.prefix, target)`,

    javascript: `class Solution {
  constructor(w) {
    this.prefix = [];
    let total = 0;
    for (const weight of w) {
      total += weight;
      this.prefix.push(total);
    }
    this.total = total;
  }
  pickIndex() {
    const target = Math.floor(Math.random() * this.total) + 1;
    let left = 0, right = this.prefix.length - 1;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (this.prefix[mid] < target) left = mid + 1;
      else right = mid;
    }
    return left;
  }
}`,

    java: `class Solution {
    private int[] prefix;
    private int total;
    private Random rand = new Random();
    public Solution(int[] w) {
        prefix = new int[w.length];
        for (int i = 0; i < w.length; i++)
            prefix[i] = (i > 0 ? prefix[i-1] : 0) + w[i];
        total = prefix[w.length - 1];
    }
    public int pickIndex() {
        int target = rand.nextInt(total) + 1;
        int lo = 0, hi = prefix.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (prefix[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
  },

  defaultInput: {
    weights: [1, 3, 2, 4],
    simulatedRandom: 6,
  },

  inputFields: [
    {
      name: 'weights',
      label: 'Weights',
      type: 'array',
      defaultValue: [1, 3, 2, 4],
      placeholder: '1,3,2,4',
      helperText: 'Comma-separated positive integer weights',
    },
    {
      name: 'simulatedRandom',
      label: 'Simulated Random Pick (1 to total)',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Simulated random target to demonstrate binary search',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const simulatedRandom = input.simulatedRandom as number;
    const steps: AlgorithmStep[] = [];

    const prefix: number[] = [];
    let total = 0;
    for (const w of weights) {
      total += w;
      prefix.push(total);
    }

    const target = Math.max(1, Math.min(simulatedRandom, total));

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: prefix,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build prefix sums from weights [${weights.join(', ')}]. Prefix sums: [${prefix.join(', ')}]. Total=${total}.`,
      variables: { weights: `[${weights.join(', ')}]`, prefixSums: `[${prefix.join(', ')}]`, total },
      visualization: makeViz(
        prefix.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        prefix.reduce((acc, p, i) => ({ ...acc, [i]: `${p}` }), {})
      ),
    });

    steps.push({
      line: 8,
      explanation: `Simulated random target = ${target} (range [1, ${total}]). Binary search prefix sums.`,
      variables: { target, total },
      visualization: makeViz(
        prefix.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
        prefix.reduce((acc, p, i) => ({ ...acc, [i]: `${p}` }), {})
      ),
    });

    let left = 0;
    let right = prefix.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 11,
        explanation: `mid=${mid}, prefix[${mid}]=${prefix[mid]}. Compare with target=${target}.`,
        variables: { left, right, mid, 'prefix[mid]': prefix[mid], target },
        visualization: makeViz(
          { [left]: 'active', [right]: 'active', [mid]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: `${prefix[mid]}` }
        ),
      });

      if (prefix[mid] < target) {
        steps.push({
          line: 13,
          explanation: `prefix[${mid}]=${prefix[mid]} < target=${target}. Move left to ${mid + 1}.`,
          variables: { left, right, mid },
          visualization: makeViz({ [mid]: 'mismatch' }, { [mid]: 'too small' }),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 15,
          explanation: `prefix[${mid}]=${prefix[mid]} >= target=${target}. Move right to ${mid}.`,
          variables: { left, right, mid },
          visualization: makeViz({ [mid]: 'active' }, { [mid]: 'candidate' }),
        });
        right = mid;
      }
    }

    steps.push({
      line: 16,
      explanation: `Picked index ${left} (weight=${weights[left]}). This index is chosen with probability ${weights[left]}/${total}.`,
      variables: { pickedIndex: left, weight: weights[left], probability: `${weights[left]}/${total}` },
      visualization: makeViz({ [left]: 'found' }, { [left]: `idx=${left}` }),
    });

    return steps;
  },
};

export default randomPickWithWeight;
