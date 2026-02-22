import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countGoodTripletsInArray: AlgorithmDefinition = {
  id: 'count-good-triplets-in-array',
  title: 'Count Good Triplets in an Array',
  leetcodeNumber: 2179,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given two permutations nums1 and nums2 of [0,n-1], count triplets (x,y,z) such that x appears before y before z in both nums1 and nums2. Map values to their positions in nums1, then count inversions using a BIT on the reordered nums2 sequence.',
  tags: ['Binary Indexed Tree', 'Merge Sort', 'Array', 'Permutation'],
  code: {
    pseudocode: `function goodTriplets(nums1, nums2):
  n = len(nums1)
  // pos1[v] = index of v in nums1
  pos1 = position map for nums1

  // reorder: for each position in nums2, store pos1 value
  order = [pos1[nums2[i]] for i in 0..n-1]

  // Now count triplets: find i<j<k in order[] where order[i]<order[j]<order[k]
  // For each j: left_smaller[j] = #values < order[j] in order[0..j-1]
  //             right_larger[j] = #values > order[j] in order[j+1..n-1]
  // ans = sum of left_smaller[j] * right_larger[j] for all j`,
    python: `class Solution:
    def goodTriplets(self, nums1, nums2):
        n = len(nums1)
        pos1 = [0] * n
        for i, v in enumerate(nums1):
            pos1[v] = i

        order = [pos1[v] for v in nums2]

        # BIT for prefix counts
        bit = [0] * (n + 1)
        def update(i):
            i += 1
            while i <= n: bit[i] += 1; i += i & -i
        def query(i):
            i += 1; s = 0
            while i > 0: s += bit[i]; i -= i & -i
            return s

        left = [0] * n
        for i in range(n):
            left[i] = query(order[i] - 1) if order[i] > 0 else 0
            update(order[i])

        right = [0] * n
        bit = [0] * (n + 1)
        for i in range(n-1, -1, -1):
            right[i] = (n-1-order[i]) - query(order[i])
            update(order[i])

        return sum(left[i] * right[i] for i in range(n))`,
    javascript: `var goodTriplets = function(nums1, nums2) {
  const n = nums1.length;
  const pos1 = new Array(n);
  nums1.forEach((v,i) => pos1[v] = i);
  const order = nums2.map(v => pos1[v]);
  const bit = new Array(n+1).fill(0);
  const update = i => { for(i++;i<=n;i+=i&-i) bit[i]++; };
  const query = i => { let s=0; for(i++;i>0;i-=i&-i) s+=bit[i]; return s; };
  const left = new Array(n).fill(0);
  for (let i=0;i<n;i++) {
    left[i] = order[i]>0 ? query(order[i]-1) : 0;
    update(order[i]);
  }
  bit.fill(0);
  const right = new Array(n).fill(0);
  for (let i=n-1;i>=0;i--) {
    right[i] = (n-1-order[i]) - query(order[i]);
    update(order[i]);
  }
  return left.reduce((ans,l,i) => ans + l*right[i], 0);
};`,
    java: `class Solution {
    int[] bit; int n;
    public long goodTriplets(int[] nums1, int[] nums2) {
        n = nums1.length; bit = new int[n+1];
        int[] pos1 = new int[n];
        for (int i=0;i<n;i++) pos1[nums1[i]]=i;
        int[] order = new int[n];
        for (int i=0;i<n;i++) order[i]=pos1[nums2[i]];
        long[] left=new long[n], right=new long[n];
        for (int i=0;i<n;i++) {
            left[i]=order[i]>0?query(order[i]-1):0;
            update(order[i]);
        }
        Arrays.fill(bit,0);
        for (int i=n-1;i>=0;i--) {
            right[i]=(n-1-order[i])-query(order[i]);
            update(order[i]);
        }
        long ans=0;
        for (int i=0;i<n;i++) ans+=left[i]*right[i];
        return ans;
    }
    void update(int i){for(i++;i<=n;i+=i&-i)bit[i]++;}
    int query(int i){int s=0;for(i++;i>0;i-=i&-i)s+=bit[i];return s;}
}`,
  },
  defaultInput: { nums1: [2,0,1,3], nums2: [0,1,2,3] },
  inputFields: [
    { name: 'nums1', label: 'Permutation 1', type: 'array', defaultValue: [2,0,1,3], placeholder: '2,0,1,3' },
    { name: 'nums2', label: 'Permutation 2', type: 'array', defaultValue: [0,1,2,3], placeholder: '0,1,2,3' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums1.length;

    const pos1 = new Array(n);
    nums1.forEach((v, i) => { pos1[v] = i; });
    const order = nums2.map(v => pos1[v]);

    steps.push({
      line: 1,
      explanation: `Map each value to its position in nums1: pos1=[${pos1.join(',')}]. Reorder nums2 by pos1: order=[${order.join(',')}]`,
      variables: { pos1, order },
      visualization: { type: 'array', array: order, highlights: {}, labels: Object.fromEntries(order.map((v,i)=>[i,`${v}`])) },
    });

    const bit = new Array(n + 1).fill(0);
    const update = (i: number) => { for (i++; i <= n; i += i & -i) bit[i]++; };
    const query = (i: number) => { let s = 0; for (i++; i > 0; i -= i & -i) s += bit[i]; return s; };

    const left = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      left[i] = order[i] > 0 ? query(order[i] - 1) : 0;
      update(order[i]);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j <= i; j++) { highlights[j] = 'visited'; labels[j] = `l=${left[j]}`; }
      highlights[i] = 'active';

      steps.push({
        line: 14,
        explanation: `left[${i}] = #values smaller than order[${i}]=${order[i]} seen so far = ${left[i]}`,
        variables: { i, 'order[i]': order[i], 'left[i]': left[i] },
        visualization: { type: 'array', array: order, highlights, labels },
      });
    }

    bit.fill(0);
    const right = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      right[i] = (n - 1 - order[i]) - query(order[i]);
      update(order[i]);
    }

    const ans = left.reduce((s, l, i) => s + l * right[i], 0);

    steps.push({
      line: 20,
      explanation: `right=[${right.join(',')}]. ans = sum(left[i]*right[i]) = ${ans} good triplets`,
      variables: { left, right, ans },
      visualization: {
        type: 'array',
        array: left.map((l, i) => l * right[i]),
        highlights: Object.fromEntries(left.map((_, i) => [i, 'found'])),
        labels: { 0: `ans=${ans}` },
      },
    });

    return steps;
  },
};

export default countGoodTripletsInArray;
