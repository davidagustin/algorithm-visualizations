import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designMostRecentlyUsedQueue: AlgorithmDefinition = {
  id: 'design-most-recently-used-queue',
  title: 'Design Most Recently Used Queue',
  leetcodeNumber: 1756,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a queue where fetch(k) returns the k-th element from the front (1-indexed), removes it from its position, and appends it to the end. Use a Fenwick tree for O(log n) position lookups, or simulate with an array for clarity. Each fetch moves the element to the back of the queue.',
  tags: ['design', 'queue', 'fenwick tree', 'ordered set'],

  code: {
    pseudocode: `class MRUQueue:
  data = [1, 2, ..., n]

  fetch(k):
    // find k-th current element
    val = data[k-1]
    // remove from position k-1
    data.splice(k-1, 1)
    // append to back
    data.push(val)
    return val`,

    python: `class MRUQueue:
    def __init__(self, n: int):
        self.data = list(range(1, n + 1))

    def fetch(self, k: int) -> int:
        val = self.data[k - 1]
        self.data.pop(k - 1)
        self.data.append(val)
        return val`,

    javascript: `class MRUQueue {
  constructor(n) {
    this.data = Array.from({ length: n }, (_, i) => i + 1);
  }

  fetch(k) {
    const val = this.data[k - 1];
    this.data.splice(k - 1, 1);
    this.data.push(val);
    return val;
  }
}`,

    java: `class MRUQueue {
    List<Integer> data = new ArrayList<>();

    public MRUQueue(int n) {
        for (int i = 1; i <= n; i++) data.add(i);
    }

    public int fetch(int k) {
        int val = data.remove(k - 1);
        data.add(val);
        return val;
    }
}`,
  },

  defaultInput: {
    nums: [8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Queue Size n',
      type: 'array',
      defaultValue: [8],
      placeholder: '8',
      helperText: 'Size of the MRU queue (single number)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = Math.max(1, Math.min(nums[0] ?? 8, 10));
    const steps: AlgorithmStep[] = [];
    const data: number[] = Array.from({ length: n }, (_, i) => i + 1);

    steps.push({
      line: 1,
      explanation: `Initialize MRUQueue of size ${n}. Data is [${data.join(', ')}].`,
      variables: { n, data: data.join(', ') },
      visualization: {
        type: 'array',
        array: [...data],
        highlights: {},
        labels: { 0: 'front' },
      },
    });

    // Demonstrate several fetch operations
    const fetchOps = [3, 5, 2, 1];
    for (const k of fetchOps) {
      if (k > data.length) continue;
      const val = data[k - 1];

      steps.push({
        line: 4,
        explanation: `fetch(${k}): The ${k}-th element is ${val} (0-indexed position ${k - 1}). Will remove it and append to back.`,
        variables: { k, value: val, position: k - 1 },
        visualization: {
          type: 'array',
          array: [...data],
          highlights: { [k - 1]: 'active' },
          labels: { 0: 'front', [k - 1]: `k=${k}`, [data.length - 1]: 'back' },
        },
      });

      data.splice(k - 1, 1);
      data.push(val);

      steps.push({
        line: 7,
        explanation: `Removed ${val} from position ${k - 1}, appended to back. ${val} is now most recently used. Queue: [${data.join(', ')}].`,
        variables: { fetched: val, newQueue: data.join(', '), queueSize: data.length },
        visualization: {
          type: 'array',
          array: [...data],
          highlights: { [data.length - 1]: 'found' },
          labels: { 0: 'front', [data.length - 1]: `MRU:${val}` },
        },
      });
    }

    return steps;
  },
};

export default designMostRecentlyUsedQueue;
