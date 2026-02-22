import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const randomPickIndex: AlgorithmDefinition = {
  id: 'random-pick-index',
  title: 'Random Pick Index',
  leetcodeNumber: 398,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array with possible duplicates, randomly output the index of a given target number. Use reservoir sampling so that each valid index is equally likely to be chosen. The hash map variant pre-indexes all positions for O(1) picks.',
  tags: ['hash map', 'reservoir sampling', 'random', 'array'],

  code: {
    pseudocode: `function pick(nums, target):
  map = buildIndex(nums)
  indices = map[target]
  return indices[random(0, len(indices)-1)]

function buildIndex(nums):
  map = {}
  for i, v in enumerate(nums):
    map[v].append(i)
  return map`,
    python: `import random
from collections import defaultdict

class Solution:
    def __init__(self, nums):
        self.index = defaultdict(list)
        for i, v in enumerate(nums):
            self.index[v].append(i)

    def pick(self, target):
        return random.choice(self.index[target])`,
    javascript: `class Solution {
  constructor(nums) {
    this.index = new Map();
    for (let i = 0; i < nums.length; i++) {
      if (!this.index.has(nums[i])) this.index.set(nums[i], []);
      this.index.get(nums[i]).push(i);
    }
  }
  pick(target) {
    const arr = this.index.get(target);
    return arr[Math.floor(Math.random() * arr.length)];
  }
}`,
    java: `class Solution {
    Map<Integer, List<Integer>> index = new HashMap<>();
    public Solution(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            index.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }
    }
    public int pick(int target) {
        List<Integer> list = index.get(target);
        return list.get(new Random().nextInt(list.size()));
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 3, 3],
    target: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 3, 3],
      placeholder: '1,2,3,3,3',
      helperText: 'Comma-separated integers (may have duplicates)',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Value to pick index for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Start building the index map from value to list of indices.',
      variables: { target, map: '{}' },
      visualization: makeViz({}, {}),
    });

    const map: Record<number, number[]> = {};
    for (let i = 0; i < nums.length; i++) {
      if (map[nums[i]] === undefined) map[nums[i]] = [];
      map[nums[i]].push(i);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[i] = nums[i] === target ? 'found' : 'active';
      labels[i] = `i=${i}`;

      steps.push({
        line: 7,
        explanation: `Index ${i}: value ${nums[i]} mapped. map[${nums[i]}] = [${map[nums[i]].join(', ')}]`,
        variables: { i, value: nums[i], mapKeys: Object.keys(map).join(', ') },
        visualization: makeViz(highlights, labels),
      });
    }

    const indices = map[target] ?? [];

    steps.push({
      line: 3,
      explanation: `Index built. target=${target} maps to indices [${indices.join(', ')}].`,
      variables: { target, indices: `[${indices.join(', ')}]` },
      visualization: makeViz(
        Object.fromEntries(indices.map((idx) => [idx, 'found'])),
        Object.fromEntries(indices.map((idx, rank) => [idx, `pick${rank}`]))
      ),
    });

    const picked = indices.length > 0 ? indices[Math.floor(Math.random() * indices.length)] : -1;

    steps.push({
      line: 4,
      explanation: `Randomly selected index ${picked} from valid indices [${indices.join(', ')}]. Each index has equal probability.`,
      variables: { target, result: picked },
      visualization: makeViz(
        { [picked]: 'current' },
        { [picked]: 'picked' }
      ),
    });

    return steps;
  },
};

export default randomPickIndex;
