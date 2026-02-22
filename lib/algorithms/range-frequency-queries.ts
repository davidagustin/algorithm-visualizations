import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeFrequencyQueries: AlgorithmDefinition = {
  id: 'range-frequency-queries',
  title: 'Range Frequency Queries',
  leetcodeNumber: 2080,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Preprocess an array to answer queries: how many times does value appear in arr[left..right]? Store sorted indices for each value. For each query, binary search to find count in range in O(log n).',
  tags: ['Binary Search', 'Hash Map', 'Array', 'Design'],
  code: {
    pseudocode: `class RangeFreqQuery:
  positions: map from value to sorted list of indices

  preprocess(arr):
    for i, v in arr:
      positions[v].append(i)

  query(left, right, value):
    if value not in positions: return 0
    pos = positions[value]
    lo = lowerBound(pos, left)    // first idx >= left
    hi = upperBound(pos, right)   // first idx > right
    return hi - lo`,
    python: `from collections import defaultdict
from bisect import bisect_left, bisect_right

class RangeFreqQuery:
    def __init__(self, arr):
        self.pos = defaultdict(list)
        for i, v in enumerate(arr):
            self.pos[v].append(i)

    def query(self, left, right, value):
        p = self.pos[value]
        lo = bisect_left(p, left)
        hi = bisect_right(p, right)
        return hi - lo`,
    javascript: `class RangeFreqQuery {
  constructor(arr) {
    this.pos = new Map();
    arr.forEach((v,i) => {
      if(!this.pos.has(v)) this.pos.set(v,[]);
      this.pos.get(v).push(i);
    });
  }
  query(left, right, value) {
    const p = this.pos.get(value) || [];
    const lb = (v) => {let lo=0,hi=p.length;while(lo<hi){const m=(lo+hi)>>1;p[m]<v?lo=m+1:hi=m;}return lo;};
    return lb(right+1) - lb(left);
  }
}`,
    java: `class RangeFreqQuery {
    Map<Integer,List<Integer>> pos=new HashMap<>();
    public RangeFreqQuery(int[] arr){
        for(int i=0;i<arr.length;i++)
            pos.computeIfAbsent(arr[i],k->new ArrayList<>()).add(i);
    }
    public int query(int left,int right,int value){
        List<Integer> p=pos.getOrDefault(value,Collections.emptyList());
        int lo=Collections.binarySearch(p,left);
        int hi=Collections.binarySearch(p,right+1);
        if(lo<0)lo=-lo-1; if(hi<0)hi=-hi-1;
        return hi-lo;
    }
}`,
  },
  defaultInput: { arr: [12,33,4,56,22,2,34,33,22,12,34,56], queries: [[1,2,4],[0,11,33],[1,2,33]] },
  inputFields: [
    { name: 'arr', label: 'Array', type: 'array', defaultValue: [12,33,4,56,22,2,34,33,22,12,34,56], placeholder: '12,33,4,...' },
    { name: 'queries', label: 'Queries [[l,r,val],...]', type: 'array', defaultValue: [[1,2,4],[0,11,33],[1,2,33]], helperText: '[left, right, value]' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];

    const pos = new Map<number, number[]>();
    arr.forEach((v, i) => {
      if (!pos.has(v)) pos.set(v, []);
      pos.get(v)!.push(i);
    });

    steps.push({
      line: 1,
      explanation: `Preprocessed arr=[${arr.join(',')}]. Stored sorted indices for each value.`,
      variables: { arr: [...arr] },
      visualization: { type: 'array', array: arr, highlights: {}, labels: {} },
    });

    for (const [left, right, value] of queries) {
      const p = pos.get(value) || [];
      const lb = (v: number) => { let lo = 0, hi = p.length; while (lo < hi) { const m = (lo + hi) >> 1; p[m] < v ? lo = m + 1 : hi = m; } return lo; };
      const count = lb(right + 1) - lb(left);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = arr[i] === value ? 'found' : 'active';
        labels[i] = arr[i] === value ? `${value}` : '';
      }

      steps.push({
        line: 9,
        explanation: `query(${left}, ${right}, ${value}): ${value} appears ${count} time(s) in arr[${left}..${right}]`,
        variables: { left, right, value, count, positions: p },
        visualization: { type: 'array', array: arr, highlights, labels },
      });
    }

    return steps;
  },
};

export default rangeFrequencyQueries;
