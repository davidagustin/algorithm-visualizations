import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfSmallerNumbersSegment: AlgorithmDefinition = {
  id: 'count-of-smaller-numbers-segment',
  title: 'Count of Smaller Numbers After Self (Segment Tree)',
  leetcodeNumber: 315,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'For each element nums[i], count how many elements to its right are smaller. Process from right to left: query the segment tree for count of elements < nums[i], then insert nums[i]. Uses coordinate compression.',
  tags: ['Segment Tree', 'Binary Indexed Tree', 'Divide and Conquer', 'Merge Sort'],
  code: {
    pseudocode: `function countSmaller(nums):
  coords = sorted unique values in nums
  rank each value (1-indexed)
  n = len(coords)
  tree = BIT of size n

  result = []
  for i from len(nums)-1 down to 0:
    r = rank[nums[i]]
    count = query(r - 1)   # elements < nums[i]
    result.prepend(count)
    update(r, +1)           # insert nums[i]
  return result`,
    python: `class Solution:
    def countSmaller(self, nums):
        coords = sorted(set(nums))
        rank = {v: i+1 for i, v in enumerate(coords)}
        n = len(coords)
        tree = [0] * (n + 1)

        def update(i):
            while i <= n:
                tree[i] += 1
                i += i & (-i)

        def query(i):
            s = 0
            while i > 0:
                s += tree[i]
                i -= i & (-i)
            return s

        result = []
        for x in reversed(nums):
            r = rank[x]
            result.append(query(r - 1))
            update(r)
        return result[::-1]`,
    javascript: `var countSmaller = function(nums) {
  const coords = [...new Set(nums)].sort((a,b)=>a-b);
  const rank = new Map(coords.map((v,i)=>[v,i+1]));
  const n = coords.length;
  const tree = new Array(n+1).fill(0);
  const update = i => { for(; i<=n; i+=i&-i) tree[i]++; };
  const query = i => { let s=0; for(; i>0; i-=i&-i) s+=tree[i]; return s; };
  const result = [];
  for (let i = nums.length-1; i >= 0; i--) {
    const r = rank.get(nums[i]);
    result.unshift(query(r-1));
    update(r);
  }
  return result;
};`,
    java: `class Solution {
    int[] tree;
    public List<Integer> countSmaller(int[] nums) {
        int[] sorted = Arrays.stream(nums).distinct().sorted().toArray();
        int n = sorted.length;
        tree = new int[n+1];
        LinkedList<Integer> res = new LinkedList<>();
        for (int i = nums.length-1; i >= 0; i--) {
            int r = Arrays.binarySearch(sorted, nums[i]) + 1;
            res.addFirst(query(r-1));
            update(r, n);
        }
        return res;
    }
    void update(int i, int n) { for (; i<=n; i+=i&-i) tree[i]++; }
    int query(int i) { int s=0; for (; i>0; i-=i&-i) s+=tree[i]; return s; }
}`,
  },
  defaultInput: { nums: [5, 2, 6, 1] },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [5, 2, 6, 1], placeholder: '5,2,6,1', helperText: 'Integer array' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const coords = [...new Set(nums)].sort((a, b) => a - b);
    const rank = new Map(coords.map((v, i) => [v, i + 1]));
    const treeSize = coords.length;
    const tree = new Array(treeSize + 1).fill(0);

    const update = (i: number) => { for (; i <= treeSize; i += i & -i) tree[i]++; };
    const query = (i: number) => { let s = 0; for (; i > 0; i -= i & -i) s += tree[i]; return s; };

    steps.push({
      line: 1,
      explanation: `Coordinate compress nums=[${nums.join(',')}]. Ranks: ${coords.map((v,i)=>`${v}->${i+1}`).join(', ')}`,
      variables: { nums: [...nums], coords },
      visualization: { type: 'array', array: nums, highlights: {}, labels: {} },
    });

    const result: number[] = new Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
      const r = rank.get(nums[i])!;
      const cnt = query(r - 1);
      result[i] = cnt;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = i + 1; j < n; j++) highlights[j] = 'visited';
      highlights[i] = 'active';
      labels[i] = `<${cnt}`;

      steps.push({
        line: 8,
        explanation: `nums[${i}]=${nums[i]} (rank=${r}): query BIT for count of values < ${nums[i]} => ${cnt}`,
        variables: { i, value: nums[i], rank: r, count: cnt },
        visualization: { type: 'array', array: nums, highlights, labels },
      });

      update(r);
    }

    steps.push({
      line: 11,
      explanation: `Result: [${result.join(', ')}] — counts of smaller elements to the right`,
      variables: { result },
      visualization: {
        type: 'array',
        array: nums,
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default countOfSmallerNumbersSegment;
