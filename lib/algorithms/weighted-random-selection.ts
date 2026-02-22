import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const weightedRandomSelection: AlgorithmDefinition = {
  id: 'weighted-random-selection',
  title: 'Weighted Random Selection',
  leetcodeNumber: 528,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Pick an index at random with probability proportional to its weight. Build a prefix sum array, generate a random target in [1, totalWeight], then binary search the prefix sum to find which index that target falls into. Construction is O(n), each pick is O(log n).',
  tags: ['Binary Search', 'Prefix Sum', 'Random'],
  code: {
    pseudocode: `function buildPrefixSum(w):
  prefix = array of size n
  prefix[0] = w[0]
  for i from 1 to n-1:
    prefix[i] = prefix[i-1] + w[i]
  return prefix

function pickIndex(prefix):
  target = random(1, prefix[n-1])
  left = 0, right = n - 1
  while left < right:
    mid = left + (right - left) / 2
    if prefix[mid] < target:
      left = mid + 1
    else:
      right = mid
  return left`,
    python: `import random

class Solution:
    def __init__(self, w):
        self.prefix = []
        total = 0
        for weight in w:
            total += weight
            self.prefix.append(total)

    def pickIndex(self):
        target = random.randint(1, self.prefix[-1])
        left, right = 0, len(self.prefix) - 1
        while left < right:
            mid = left + (right - left) // 2
            if self.prefix[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left`,
    javascript: `class Solution {
  constructor(w) {
    this.prefix = [];
    let total = 0;
    for (const weight of w) {
      total += weight;
      this.prefix.push(total);
    }
  }

  pickIndex() {
    const target = Math.floor(Math.random() * this.prefix[this.prefix.length - 1]) + 1;
    let left = 0, right = this.prefix.length - 1;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (this.prefix[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
}`,
    java: `class Solution {
    private int[] prefix;
    private Random rand = new Random();

    public Solution(int[] w) {
        prefix = new int[w.length];
        prefix[0] = w[0];
        for (int i = 1; i < w.length; i++) {
            prefix[i] = prefix[i - 1] + w[i];
        }
    }

    public int pickIndex() {
        int target = rand.nextInt(prefix[prefix.length - 1]) + 1;
        int left = 0, right = prefix.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (prefix[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}`,
  },
  defaultInput: { w: [1, 3, 2, 4] },
  inputFields: [
    {
      name: 'w',
      label: 'Weights',
      type: 'array',
      defaultValue: [1, 3, 2, 4],
      placeholder: '1,3,2,4',
      helperText: 'Comma-separated positive integer weights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const w = input.w as number[];
    const steps: AlgorithmStep[] = [];
    const n = w.length;

    // --- Phase 1: Build prefix sum ---
    const prefix: number[] = new Array(n).fill(0);

    steps.push({
      line: 1,
      explanation: `Build prefix sum array from weights [${w.join(', ')}].`,
      variables: { w },
      visualization: {
        type: 'array',
        array: [...w],
        highlights: {},
        labels: Object.fromEntries(w.map((_, i) => [i, `w[${i}]`])),
      },
    });

    prefix[0] = w[0];
    steps.push({
      line: 3,
      explanation: `prefix[0] = w[0] = ${w[0]}.`,
      variables: { prefix: [...prefix] },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: { 0: 'active' },
        labels: { 0: `${prefix[0]}` },
      },
    });

    for (let i = 1; i < n; i++) {
      prefix[i] = prefix[i - 1] + w[i];
      steps.push({
        line: 5,
        explanation: `prefix[${i}] = prefix[${i - 1}](${prefix[i - 1] - w[i]}) + w[${i}](${w[i]}) = ${prefix[i]}.`,
        variables: { i, prefix: [...prefix] },
        visualization: {
          type: 'array',
          array: [...prefix],
          highlights: { [i - 1]: 'comparing', [i]: 'active' },
          labels: Object.fromEntries(prefix.map((v, j) => [j, v > 0 ? String(v) : ''])),
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `Prefix sum complete: [${prefix.join(', ')}]. Total weight = ${prefix[n - 1]}.`,
      variables: { prefix: [...prefix], totalWeight: prefix[n - 1] },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: Object.fromEntries(prefix.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(prefix.map((v, i) => [i, String(v)])),
      },
    });

    // --- Phase 2: Simulate a pick with a deterministic target ---
    // Use a target that demonstrates the binary search well
    const target = Math.floor(prefix[n - 1] / 2) + 1;

    steps.push({
      line: 8,
      explanation: `Simulate pickIndex. Random target in [1, ${prefix[n - 1]}]. Using target = ${target} for demonstration.`,
      variables: { target, totalWeight: prefix[n - 1] },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: {},
        labels: Object.fromEntries(prefix.map((v, i) => [i, String(v)])),
        auxData: { label: 'Pick State', entries: [{ key: 'Target', value: String(target) }] },
      },
    });

    let left = 0;
    let right = n - 1;

    steps.push({
      line: 10,
      explanation: `Binary search prefix sum for target ${target}. left=0, right=${right}.`,
      variables: { left, right, target },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: { [left]: 'pointer', [right]: 'pointer' },
        labels: { ...Object.fromEntries(prefix.map((v, i) => [i, String(v)])), [left]: `${prefix[left]}|L`, [right]: `${prefix[right]}|R` },
      },
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 12,
        explanation: `mid = ${mid}, prefix[${mid}] = ${prefix[mid]}. Compare with target ${target}.`,
        variables: { left, right, mid, 'prefix[mid]': prefix[mid], target },
        visualization: {
          type: 'array',
          array: [...prefix],
          highlights: { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          labels: { [left]: 'L', [right]: 'R', [mid]: `mid(${prefix[mid]})` },
          auxData: { label: 'Pick State', entries: [{ key: 'Target', value: String(target) }, { key: 'prefix[mid]', value: String(prefix[mid]) }] },
        },
      });

      if (prefix[mid] < target) {
        steps.push({
          line: 13,
          explanation: `prefix[${mid}]=${prefix[mid]} < target ${target}. Move left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: {
            type: 'array',
            array: [...prefix],
            highlights: { [mid + 1]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
            labels: { [mid + 1]: 'L', [right]: 'R' },
          },
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 15,
          explanation: `prefix[${mid}]=${prefix[mid]} >= target ${target}. Move right = ${mid}.`,
          variables: { left, right: mid },
          visualization: {
            type: 'array',
            array: [...prefix],
            highlights: { [left]: 'pointer', [mid]: 'pointer' },
            labels: { [left]: 'L', [mid]: 'R' },
          },
        });
        right = mid;
      }
    }

    steps.push({
      line: 16,
      explanation: `Converged: picked index ${left} (weight ${w[left]}). Target ${target} falls in the range covered by index ${left}. Probability of picking index ${left} is ${w[left]}/${prefix[n - 1]} = ${(w[left] / prefix[n - 1] * 100).toFixed(1)}%.`,
      variables: { result: left, weight: w[left], probability: `${w[left]}/${prefix[n - 1]}` },
      visualization: {
        type: 'array',
        array: [...w],
        highlights: { [left]: 'found' },
        labels: Object.fromEntries(w.map((v, i) => [i, `w=${v} (${(v / prefix[n - 1] * 100).toFixed(0)}%)`])),
        auxData: { label: 'Result', entries: [{ key: 'Picked Index', value: String(left) }, { key: 'Weight', value: String(w[left]) }] },
      },
    });

    return steps;
  },
};

export default weightedRandomSelection;
