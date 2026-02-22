import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeSumQueryMutableII: AlgorithmDefinition = {
  id: 'range-sum-query-mutable-ii',
  title: 'Range Sum Query - Mutable (Segment Tree)',
  leetcodeNumber: 307,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a mutable integer array, support two operations: update(index, val) and sumRange(left, right). Use a segment tree where each node stores the sum of a range. Build in O(n), update in O(log n), query in O(log n).',
  tags: ['Segment Tree', 'Binary Indexed Tree', 'Array', 'Design'],
  code: {
    pseudocode: `function build(nums, node, start, end):
  if start == end:
    tree[node] = nums[start]
  else:
    mid = (start + end) / 2
    build(nums, 2*node, start, mid)
    build(nums, 2*node+1, mid+1, end)
    tree[node] = tree[2*node] + tree[2*node+1]

function update(node, start, end, idx, val):
  if start == end:
    tree[node] = val
  else:
    mid = (start + end) / 2
    if idx <= mid: update(2*node, start, mid, idx, val)
    else: update(2*node+1, mid+1, end, idx, val)
    tree[node] = tree[2*node] + tree[2*node+1]

function query(node, start, end, l, r):
  if r < start or end < l: return 0
  if l <= start and end <= r: return tree[node]
  mid = (start + end) / 2
  return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r)`,
    python: `class NumArray:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        self._build(nums, 1, 0, self.n - 1)

    def _build(self, nums, node, start, end):
        if start == end:
            self.tree[node] = nums[start]
        else:
            mid = (start + end) // 2
            self._build(nums, 2*node, start, mid)
            self._build(nums, 2*node+1, mid+1, end)
            self.tree[node] = self.tree[2*node] + self.tree[2*node+1]

    def update(self, index, val):
        self._update(1, 0, self.n-1, index, val)

    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if idx <= mid: self._update(2*node, start, mid, idx, val)
            else: self._update(2*node+1, mid+1, end, idx, val)
            self.tree[node] = self.tree[2*node] + self.tree[2*node+1]

    def sumRange(self, left, right):
        return self._query(1, 0, self.n-1, left, right)

    def _query(self, node, start, end, l, r):
        if r < start or end < l: return 0
        if l <= start and end <= r: return self.tree[node]
        mid = (start + end) // 2
        return self._query(2*node, start, mid, l, r) + self._query(2*node+1, mid+1, end, l, r)`,
    javascript: `class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n).fill(0);
    this._build(nums, 1, 0, this.n - 1);
  }
  _build(nums, node, start, end) {
    if (start === end) { this.tree[node] = nums[start]; return; }
    const mid = (start + end) >> 1;
    this._build(nums, 2*node, start, mid);
    this._build(nums, 2*node+1, mid+1, end);
    this.tree[node] = this.tree[2*node] + this.tree[2*node+1];
  }
  update(index, val) { this._update(1, 0, this.n-1, index, val); }
  _update(node, start, end, idx, val) {
    if (start === end) { this.tree[node] = val; return; }
    const mid = (start + end) >> 1;
    if (idx <= mid) this._update(2*node, start, mid, idx, val);
    else this._update(2*node+1, mid+1, end, idx, val);
    this.tree[node] = this.tree[2*node] + this.tree[2*node+1];
  }
  sumRange(left, right) { return this._query(1, 0, this.n-1, left, right); }
  _query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    const mid = (start + end) >> 1;
    return this._query(2*node, start, mid, l, r) + this._query(2*node+1, mid+1, end, l, r);
  }
}`,
    java: `class NumArray {
    private int[] tree;
    private int n;
    public NumArray(int[] nums) {
        n = nums.length;
        tree = new int[4 * n];
        build(nums, 1, 0, n - 1);
    }
    private void build(int[] nums, int node, int start, int end) {
        if (start == end) { tree[node] = nums[start]; return; }
        int mid = (start + end) / 2;
        build(nums, 2*node, start, mid);
        build(nums, 2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    public void update(int index, int val) { update(1, 0, n-1, index, val); }
    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2*node, start, mid, idx, val);
        else update(2*node+1, mid+1, end, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    public int sumRange(int left, int right) { return query(1, 0, n-1, left, right); }
    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
    }
}`,
  },
  defaultInput: { nums: [1, 3, 5], updates: [[1, 2]], queries: [[0, 2], [1, 2]] },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [1, 3, 5], placeholder: '1,3,5', helperText: 'Initial array' },
    { name: 'updates', label: 'Updates [[idx,val],...]', type: 'array', defaultValue: [[1, 2]], helperText: 'Update operations' },
    { name: 'queries', label: 'Queries [[l,r],...]', type: 'array', defaultValue: [[0, 2], [1, 2]], helperText: 'Range sum queries' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const updates = input.updates as number[][];
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const tree = new Array(4 * n).fill(0);

    function makeViz(highlightIndices: number[], label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      tree.forEach((_, i) => { if (tree[i] !== 0) highlights[i] = 'visited'; });
      highlightIndices.forEach(i => { highlights[i] = 'active'; labels[i] = label; });
      return { type: 'array', array: tree.slice(0, 2 * n + 2), highlights, labels };
    }

    function build(node: number, start: number, end: number) {
      if (start === end) {
        tree[node] = nums[start];
        steps.push({
          line: 2,
          explanation: `Leaf node ${node}: tree[${node}] = nums[${start}] = ${nums[start]}`,
          variables: { node, start, end, value: nums[start] },
          visualization: makeViz([node], `${nums[start]}`),
        });
      } else {
        const mid = (start + end) >> 1;
        build(2 * node, start, mid);
        build(2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
        steps.push({
          line: 7,
          explanation: `Internal node ${node} covers [${start},${end}]: tree[${node}] = ${tree[2*node]} + ${tree[2*node+1]} = ${tree[node]}`,
          variables: { node, start, end, left: tree[2*node], right: tree[2*node+1], sum: tree[node] },
          visualization: makeViz([node], `${tree[node]}`),
        });
      }
    }

    steps.push({
      line: 1,
      explanation: `Building segment tree for nums = [${nums.join(', ')}]`,
      variables: { nums: [...nums], n },
      visualization: makeViz([], ''),
    });

    build(1, 0, n - 1);

    steps.push({
      line: 8,
      explanation: `Segment tree built. tree[1] = ${tree[1]} (total sum). Now processing operations.`,
      variables: { tree: tree.slice(0, 2 * n + 2) },
      visualization: makeViz([1], 'root'),
    });

    for (const [idx, val] of updates) {
      steps.push({
        line: 13,
        explanation: `Update: nums[${idx}] = ${val}. Traversing segment tree to update.`,
        variables: { idx, val },
        visualization: makeViz([idx + 1], `upd`),
      });
      (function updateTree(node: number, start: number, end: number) {
        if (start === end) {
          tree[node] = val;
          steps.push({
            line: 14,
            explanation: `Found leaf ${node} for index ${idx}: tree[${node}] = ${val}`,
            variables: { node, idx, val },
            visualization: makeViz([node], `${val}`),
          });
        } else {
          const mid = (start + end) >> 1;
          if (idx <= mid) updateTree(2 * node, start, mid);
          else updateTree(2 * node + 1, mid + 1, end);
          tree[node] = tree[2 * node] + tree[2 * node + 1];
          steps.push({
            line: 18,
            explanation: `Updated internal node ${node}: tree[${node}] = ${tree[2*node]} + ${tree[2*node+1]} = ${tree[node]}`,
            variables: { node, newSum: tree[node] },
            visualization: makeViz([node], `${tree[node]}`),
          });
        }
      })(1, 0, n - 1);
      nums[idx] = val;
    }

    for (const [l, r] of queries) {
      let result = 0;
      (function queryTree(node: number, start: number, end: number) {
        if (r < start || end < l) return;
        if (l <= start && end <= r) { result += tree[node]; return; }
        const mid = (start + end) >> 1;
        queryTree(2 * node, start, mid);
        queryTree(2 * node + 1, mid + 1, end);
      })(1, 0, n - 1);
      steps.push({
        line: 23,
        explanation: `Query sumRange(${l}, ${r}) = ${result}`,
        variables: { l, r, result },
        visualization: makeViz([l, r], 'q'),
      });
    }

    return steps;
  },
};

export default rangeSumQueryMutableII;
