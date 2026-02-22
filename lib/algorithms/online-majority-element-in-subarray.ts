import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const onlineMajorityElementInSubarray: AlgorithmDefinition = {
  id: 'online-majority-element-in-subarray',
  title: 'Online Majority Element In Subarray',
  leetcodeNumber: 1157,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given an array, answer queries: is element threshold the majority (appears > (right-left+1)/2 times) in arr[left..right]? Preprocess by storing sorted indices for each value. For each query, binary search to count occurrences in range, then verify with Boyer-Moore.',
  tags: ['Segment Tree', 'Binary Search', 'Random', 'Design'],
  code: {
    pseudocode: `class MajorityChecker:
  arr: original array
  positions: map from value to sorted list of indices

  query(left, right, threshold):
    len = right - left + 1
    if threshold > len: return -1

    // candidate via segment tree with Boyer-Moore
    candidate = getMajorityCandidate(left, right)

    // verify: count occurrences in [left, right]
    pos = positions[candidate]
    lo = lowerBound(pos, left)
    hi = upperBound(pos, right)
    if hi - lo >= threshold: return candidate
    return -1`,
    python: `from collections import defaultdict
from bisect import bisect_left, bisect_right
import random

class MajorityChecker:
    def __init__(self, arr):
        self.arr = arr
        self.pos = defaultdict(list)
        for i, v in enumerate(arr):
            self.pos[v].append(i)

    def query(self, left, right, threshold):
        # random sampling: majority element appears > half the time
        for _ in range(20):
            idx = random.randint(left, right)
            cand = self.arr[idx]
            lo = bisect_left(self.pos[cand], left)
            hi = bisect_right(self.pos[cand], right)
            if hi - lo >= threshold:
                return cand
        return -1`,
    javascript: `class MajorityChecker {
  constructor(arr) {
    this.arr = arr;
    this.pos = new Map();
    arr.forEach((v,i) => {
      if (!this.pos.has(v)) this.pos.set(v,[]);
      this.pos.get(v).push(i);
    });
  }
  query(left, right, threshold) {
    const lb = (arr,v) => {let lo=0,hi=arr.length;while(lo<hi){const m=(lo+hi)>>1;arr[m]<v?lo=m+1:hi=m;}return lo;};
    for(let t=0;t<20;t++){
      const idx=left+Math.floor(Math.random()*(right-left+1));
      const cand=this.arr[idx];
      const p=this.pos.get(cand)||[];
      const lo=lb(p,left), hi=lb(p,right+1);
      if(hi-lo>=threshold) return cand;
    }
    return -1;
  }
}`,
    java: `class MajorityChecker {
    int[] arr;
    Map<Integer,List<Integer>> pos=new HashMap<>();
    Random rand=new Random();
    public MajorityChecker(int[] arr){
        this.arr=arr;
        for(int i=0;i<arr.length;i++){
            pos.computeIfAbsent(arr[i],k->new ArrayList<>()).add(i);
        }
    }
    public int query(int left,int right,int threshold){
        for(int t=0;t<20;t++){
            int idx=left+rand.nextInt(right-left+1);
            int cand=arr[idx];
            List<Integer> p=pos.getOrDefault(cand,Collections.emptyList());
            int lo=Collections.binarySearch(p,left);
            int hi=Collections.binarySearch(p,right+1);
            if(lo<0)lo=-lo-1; if(hi<0)hi=-hi-1;
            if(hi-lo>=threshold) return cand;
        }
        return -1;
    }
}`,
  },
  defaultInput: { arr: [1,1,2,2,1,1], queries: [[0,5,4],[0,3,3],[2,3,2]] },
  inputFields: [
    { name: 'arr', label: 'Array', type: 'array', defaultValue: [1,1,2,2,1,1], placeholder: '1,1,2,2,1,1' },
    { name: 'queries', label: 'Queries [[l,r,t],...]', type: 'array', defaultValue: [[0,5,4],[0,3,3],[2,3,2]], helperText: '[left, right, threshold]' },
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
      explanation: `MajorityChecker built for [${arr.join(',')}]. Stored sorted indices for each value.`,
      variables: { arr: [...arr] },
      visualization: { type: 'array', array: arr, highlights: {}, labels: {} },
    });

    for (const [left, right, threshold] of queries) {
      const len = right - left + 1;
      let result = -1;
      const subArr = arr.slice(left, right + 1);

      const counts = new Map<number, number>();
      for (const v of subArr) counts.set(v, (counts.get(v) || 0) + 1);

      for (const [v, cnt] of counts) {
        if (cnt >= threshold) { result = v; break; }
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = result !== -1 && arr[i] === result ? 'found' : 'active';
        labels[i] = `${arr[i]}`;
      }

      steps.push({
        line: 12,
        explanation: `query(${left},${right},${threshold}): subarray=[${subArr.join(',')}], need ${threshold} occurrences. Result: ${result}`,
        variables: { left, right, threshold, len, result, counts: Object.fromEntries(counts) },
        visualization: { type: 'array', array: arr, highlights, labels },
      });
    }

    return steps;
  },
};

export default onlineMajorityElementInSubarray;
