import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const handlingSumQueriesAfterUpdate: AlgorithmDefinition = {
  id: 'handling-sum-queries-after-update',
  title: 'Handling Sum Queries After Update',
  leetcodeNumber: 2569,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given two binary arrays nums1 and nums2, handle three query types: (1) flip nums1[l..r], (2) add sum(nums1)*p to nums2[l..r], (3) return sum of nums2. Use a segment tree with lazy propagation on nums1 for range flips and track the count of 1s.',
  tags: ['Segment Tree', 'Lazy Propagation', 'Array'],
  code: {
    pseudocode: `// Segment tree on nums1 with lazy flip propagation
// sum2 = total sum of nums2

// Query 1: flip nums1[l..r]
//   use seg tree: count of 1s in range changes
// Query 2: nums2[i] += nums1[i] * p for i in [l,r]
//   sum2 += count_of_ones(l,r) * p
// Query 3: return sum2`,
    python: `class Solution:
    def handleQuery(self, nums1, nums2, queries):
        n = len(nums1)
        # segment tree on nums1
        tree = [0]*(4*n)
        lazy = [False]*(4*n)
        sum2 = sum(nums2)
        results = []

        def build(node, l, r):
            if l==r: tree[node]=nums1[l]; return
            mid=(l+r)//2
            build(2*node,l,mid); build(2*node+1,mid+1,r)
            tree[node]=tree[2*node]+tree[2*node+1]

        def pushdown(node, l, r):
            if lazy[node]:
                mid=(l+r)//2
                tree[2*node]=(mid-l+1)-tree[2*node]; lazy[2*node]=not lazy[2*node]
                tree[2*node+1]=(r-mid)-tree[2*node+1]; lazy[2*node+1]=not lazy[2*node+1]
                lazy[node]=False

        def update(node,l,r,ql,qr):
            if ql<=l and r<=qr:
                tree[node]=(r-l+1)-tree[node]; lazy[node]=not lazy[node]; return
            pushdown(node,l,r); mid=(l+r)//2
            if ql<=mid: update(2*node,l,mid,ql,qr)
            if qr>mid: update(2*node+1,mid+1,r,ql,qr)
            tree[node]=tree[2*node]+tree[2*node+1]

        def query(node,l,r,ql,qr):
            if ql<=l and r<=qr: return tree[node]
            pushdown(node,l,r); mid=(l+r)//2; res=0
            if ql<=mid: res+=query(2*node,l,mid,ql,qr)
            if qr>mid: res+=query(2*node+1,mid+1,r,ql,qr)
            return res

        build(1,0,n-1)
        for t,l,r in queries:
            if t==1: update(1,0,n-1,l,r)
            elif t==2: sum2+=query(1,0,n-1,l,r)*r
            else: results.append(sum2)
        return results`,
    javascript: `var handleQuery = function(nums1, nums2, queries) {
  // Segment tree with lazy propagation on nums1
  const n=nums1.length;
  const tree=new Array(4*n).fill(0);
  const lazy=new Array(4*n).fill(false);
  let sum2=nums2.reduce((a,b)=>a+b,0);
  const res=[];
  // build, update, query helpers omitted for brevity
  for(const [t,l,r] of queries){
    if(t===1){ /* flip range l..r in nums1 */ }
    else if(t===2){ /* sum2 += count1s(l,r)*r */ }
    else res.push(sum2);
  }
  return res;
};`,
    java: `class Solution {
    int[] tree; boolean[] lazy; int n;
    public long[] handleQuery(int[] nums1, int[] nums2, int[][] queries) {
        n=nums1.length; tree=new int[4*n]; lazy=new boolean[4*n];
        build(nums1,1,0,n-1);
        long sum2=0; for(int v:nums2)sum2+=v;
        List<Long> res=new ArrayList<>();
        for(int[]q:queries){
            if(q[0]==1) update(1,0,n-1,q[1],q[2]);
            else if(q[0]==2) sum2+=(long)query(1,0,n-1,q[1],q[2])*q[2];
            else res.add(sum2);
        }
        return res.stream().mapToLong(Long::longValue).toArray();
    }
    // build/update/query helpers with lazy propagation
}`,
  },
  defaultInput: { nums1: [1,0,1], nums2: [0,0,0], queries: [[1,1,2],[2,0,2,1],[3,0,0,0]] },
  inputFields: [
    { name: 'nums1', label: 'nums1 (binary)', type: 'array', defaultValue: [1,0,1], placeholder: '1,0,1' },
    { name: 'nums2', label: 'nums2', type: 'array', defaultValue: [0,0,0], placeholder: '0,0,0' },
    { name: 'queries', label: 'Queries [[type,l,r,p?],...]', type: 'array', defaultValue: [[1,1,2],[2,0,2,1],[3,0,0,0]], helperText: 'type 1:flip, 2:add, 3:query' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = (input.nums1 as number[]).slice();
    const nums2 = (input.nums2 as number[]).slice();
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];

    let sum2 = nums2.reduce((a, b) => a + b, 0);
    const results: number[] = [];

    steps.push({
      line: 1,
      explanation: `nums1=[${nums1.join(',')}], nums2=[${nums2.join(',')}]. sum(nums2)=${sum2}. Processing queries.`,
      variables: { nums1: [...nums1], nums2: [...nums2], sum2 },
      visualization: { type: 'array', array: nums1, highlights: {}, labels: Object.fromEntries(nums1.map((v,i)=>[i,`n1=${v}`])) },
    });

    for (const q of queries) {
      const [type, l, r, p] = q;

      if (type === 1) {
        for (let i = l; i <= r; i++) nums1[i] ^= 1;

        steps.push({
          line: 4,
          explanation: `Query 1: flip nums1[${l}..${r}]. nums1 now: [${nums1.join(',')}]`,
          variables: { type, l, r, nums1: [...nums1] },
          visualization: {
            type: 'array',
            array: nums1.slice(),
            highlights: Object.fromEntries(nums1.map((_, i) => [i, i >= l && i <= r ? 'swapping' : 'visited'])),
            labels: Object.fromEntries(nums1.map((v, i) => [i, `${v}`])),
          },
        });
      } else if (type === 2) {
        const cnt = nums1.slice(l, r + 1).reduce((a, b) => a + b, 0);
        const add = cnt * p;
        sum2 += add;

        steps.push({
          line: 7,
          explanation: `Query 2: sum(nums1[${l}..${r}])=${cnt}, p=${p}. sum2 += ${cnt}*${p}=${add}. sum2 now ${sum2}`,
          variables: { type, l, r, p, cnt, add, sum2 },
          visualization: {
            type: 'array',
            array: nums1.slice(),
            highlights: Object.fromEntries(nums1.map((_, i) => [i, i >= l && i <= r ? 'active' : 'visited'])),
            labels: { 0: `sum2=${sum2}` },
          },
        });
      } else if (type === 3) {
        results.push(sum2);

        steps.push({
          line: 10,
          explanation: `Query 3: return sum(nums2) = ${sum2}`,
          variables: { type, sum2 },
          visualization: {
            type: 'array',
            array: nums2.slice(),
            highlights: Object.fromEntries(nums2.map((_, i) => [i, 'found'])),
            labels: { 0: `ans=${sum2}` },
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `All query-3 answers: [${results.join(', ')}]`,
      variables: { results },
      visualization: {
        type: 'array',
        array: results.length ? results : [0],
        highlights: Object.fromEntries((results.length ? results : [0]).map((_, i) => [i, 'found'])),
        labels: { 0: `results=[${results.join(',')}]` },
      },
    });

    return steps;
  },
};

export default handlingSumQueriesAfterUpdate;
