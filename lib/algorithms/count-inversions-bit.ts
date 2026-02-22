import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countInversionsBIT: AlgorithmDefinition = {
  id: 'count-inversions-bit',
  title: 'Count Inversions (Binary Indexed Tree)',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Count the number of inversions in an array: pairs (i,j) where i < j and arr[i] > arr[j]. Process elements left to right. For each element, query BIT for count of previously inserted elements > current element, then insert current. Uses coordinate compression.',
  tags: ['Binary Indexed Tree', 'Merge Sort', 'Array', 'Classic'],
  code: {
    pseudocode: `function countInversions(arr):
  coords = sorted unique values of arr
  rank[v] = 1-indexed position in coords
  n = len(coords)
  bit = BIT of size n
  inversions = 0

  for x in arr:
    r = rank[x]
    // elements already inserted that are > x
    inversions += (inserted_count - query(r))
    update(r)

  return inversions`,
    python: `def countInversions(arr):
    coords = sorted(set(arr))
    rank = {v: i+1 for i, v in enumerate(coords)}
    n = len(coords)
    bit = [0] * (n + 1)

    def update(i):
        while i <= n:
            bit[i] += 1
            i += i & (-i)

    def query(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & (-i)
        return s

    inversions = 0
    for idx, x in enumerate(arr):
        r = rank[x]
        inversions += idx - query(r)  # idx = elements inserted so far
        update(r)
    return inversions`,
    javascript: `function countInversions(arr) {
  const coords = [...new Set(arr)].sort((a,b)=>a-b);
  const rank = new Map(coords.map((v,i)=>[v,i+1]));
  const n = coords.length;
  const bit = new Array(n+1).fill(0);
  const update = i => { for(;i<=n;i+=i&-i) bit[i]++; };
  const query = i => { let s=0; for(;i>0;i-=i&-i) s+=bit[i]; return s; };
  let inversions = 0;
  arr.forEach((x, idx) => {
    const r = rank.get(x);
    inversions += idx - query(r);
    update(r);
  });
  return inversions;
}`,
    java: `public static int countInversions(int[] arr) {
    int[] sorted = Arrays.stream(arr).distinct().sorted().toArray();
    int n = sorted.length;
    int[] bit = new int[n+1];
    int inversions = 0;
    for (int idx=0; idx<arr.length; idx++) {
        int r = Arrays.binarySearch(sorted, arr[idx]) + 1;
        inversions += idx - query(bit, r);
        update(bit, r, n);
    }
    return inversions;
}`,
  },
  defaultInput: { arr: [3, 1, 2, 5, 4] },
  inputFields: [
    { name: 'arr', label: 'Array', type: 'array', defaultValue: [3,1,2,5,4], placeholder: '3,1,2,5,4', helperText: 'Integer array' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const coords = [...new Set(arr)].sort((a, b) => a - b);
    const rank = new Map(coords.map((v, i) => [v, i + 1]));
    const treeSize = coords.length;
    const bit = new Array(treeSize + 1).fill(0);
    const updateBIT = (i: number) => { for (; i <= treeSize; i += i & -i) bit[i]++; };
    const queryBIT = (i: number) => { let s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };

    steps.push({
      line: 1,
      explanation: `Count inversions in [${arr.join(',')}]. An inversion is a pair (i,j) where i<j and arr[i]>arr[j].`,
      variables: { arr: [...arr] },
      visualization: { type: 'array', array: arr, highlights: {}, labels: {} },
    });

    let inversions = 0;

    for (let idx = 0; idx < n; idx++) {
      const x = arr[idx];
      const r = rank.get(x)!;
      const lessThanOrEqual = queryBIT(r);
      const newInversions = idx - lessThanOrEqual;
      inversions += newInversions;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j < idx; j++) { highlights[j] = 'visited'; }
      highlights[idx] = 'active';
      labels[idx] = `inv+${newInversions}`;

      steps.push({
        line: 9,
        explanation: `arr[${idx}]=${x}: ${idx} elements inserted, ${lessThanOrEqual} are ≤ ${x}, so ${newInversions} are > ${x} (new inversions). Total=${inversions}`,
        variables: { idx, x, rank: r, lessThanOrEqual, newInversions, totalInversions: inversions },
        visualization: { type: 'array', array: arr, highlights, labels },
      });

      updateBIT(r);
    }

    steps.push({
      line: 12,
      explanation: `Total inversions: ${inversions}`,
      variables: { inversions },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        labels: { 0: `inv=${inversions}` },
      },
    });

    return steps;
  },
};

export default countInversionsBIT;
