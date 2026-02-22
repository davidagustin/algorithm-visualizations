import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const intervalsBetweenIdenticalElements: AlgorithmDefinition = {
  id: 'intervals-between-identical-elements',
  title: 'Intervals Between Identical Elements',
  leetcodeNumber: 2121,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'For each index i, compute the sum of distances to all other indices with the same value. Group indices by value, then for each group use prefix sums: distance to left neighbors = i*left_count - sum_of_left_indices, distance to right neighbors = sum_of_right_indices - i*right_count.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function getDistances(arr):
  // group indices by value
  groups: map from value to sorted list of indices
  result = [0] * n

  for each group of indices [i0, i1, i2, ...]:
    // prefix sum of indices
    prefix = [0, i0, i0+i1, ...]
    for j from 0 to len(group)-1:
      idx = group[j]
      left_sum = prefix[j]  // sum of indices to left
      right_sum = prefix[end] - prefix[j+1]  // sum of indices to right
      result[idx] = idx*j - left_sum + right_sum - idx*(len-1-j)

  return result`,
    python: `from collections import defaultdict

class Solution:
    def getDistances(self, arr):
        groups = defaultdict(list)
        for i, v in enumerate(arr):
            groups[v].append(i)

        result = [0] * len(arr)
        for idxs in groups.values():
            n = len(idxs)
            prefix = [0] * (n + 1)
            for j in range(n):
                prefix[j+1] = prefix[j] + idxs[j]

            for j, idx in enumerate(idxs):
                left_sum = prefix[j]
                right_sum = prefix[n] - prefix[j+1]
                result[idx] = idx * j - left_sum + right_sum - idx * (n-1-j)

        return result`,
    javascript: `var getDistances = function(arr) {
  const groups = new Map();
  arr.forEach((v,i) => {
    if (!groups.has(v)) groups.set(v,[]);
    groups.get(v).push(i);
  });
  const result = new Array(arr.length).fill(0);
  for (const idxs of groups.values()) {
    const n = idxs.length;
    const prefix = new Array(n+1).fill(0);
    for (let j=0;j<n;j++) prefix[j+1]=prefix[j]+idxs[j];
    for (let j=0;j<n;j++) {
      const idx=idxs[j];
      const leftSum=prefix[j], rightSum=prefix[n]-prefix[j+1];
      result[idx]=idx*j-leftSum+rightSum-idx*(n-1-j);
    }
  }
  return result;
};`,
    java: `class Solution {
    public long[] getDistances(int[] arr) {
        Map<Integer,List<Integer>> g=new HashMap<>();
        for(int i=0;i<arr.length;i++) g.computeIfAbsent(arr[i],k->new ArrayList<>()).add(i);
        long[] res=new long[arr.length];
        for(List<Integer> idxs:g.values()){
            int n=idxs.size();
            long[]pre=new long[n+1];
            for(int j=0;j<n;j++) pre[j+1]=pre[j]+idxs.get(j);
            for(int j=0;j<n;j++){
                long idx=idxs.get(j);
                res[(int)idx]=idx*j-pre[j]+pre[n]-pre[j+1]-idx*(n-1-j);
            }
        }
        return res;
    }
}`,
  },
  defaultInput: { arr: [2, 1, 3, 1, 2, 3, 3] },
  inputFields: [
    { name: 'arr', label: 'Array', type: 'array', defaultValue: [2,1,3,1,2,3,3], placeholder: '2,1,3,1,2,3,3' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const groups = new Map<number, number[]>();
    arr.forEach((v, i) => {
      if (!groups.has(v)) groups.set(v, []);
      groups.get(v)!.push(i);
    });

    steps.push({
      line: 1,
      explanation: `Compute sum of distances to same-value elements for each index in [${arr.join(',')}].`,
      variables: { arr: [...arr], groups: Object.fromEntries([...groups].map(([k,v])=>[k,v])) },
      visualization: { type: 'array', array: arr, highlights: {}, labels: {} },
    });

    const result = new Array(n).fill(0);

    for (const [val, idxs] of groups) {
      const gLen = idxs.length;
      const prefix = new Array(gLen + 1).fill(0);
      for (let j = 0; j < gLen; j++) prefix[j + 1] = prefix[j] + idxs[j];

      steps.push({
        line: 5,
        explanation: `Value ${val} appears at indices [${idxs.join(',')}]. Computing distances using prefix sums.`,
        variables: { val, idxs, prefix },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(idxs.map(i => [i, 'active'])),
          labels: Object.fromEntries(idxs.map((i, j) => [i, `g${j}`])),
        },
      });

      for (let j = 0; j < gLen; j++) {
        const idx = idxs[j];
        const leftSum = prefix[j];
        const rightSum = prefix[gLen] - prefix[j + 1];
        result[idx] = idx * j - leftSum + rightSum - idx * (gLen - 1 - j);

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        idxs.forEach((i, k) => { highlights[i] = k === j ? 'current' : 'active'; labels[i] = k === j ? `d=${result[idx]}` : `${arr[i]}`; });

        steps.push({
          line: 10,
          explanation: `idx=${idx} (val=${val}): left_dist=${idx*j - leftSum}, right_dist=${rightSum - idx*(gLen-1-j)}, total=${result[idx]}`,
          variables: { idx, val, j, leftSum, rightSum, 'result[idx]': result[idx] },
          visualization: { type: 'array', array: arr, highlights, labels },
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `Result: [${result.join(', ')}]`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default intervalsBetweenIdenticalElements;
