import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxSumOfRectangleNoLargerThanK: AlgorithmDefinition = {
  id: 'max-sum-of-rectangle-no-larger-than-k',
  title: 'Max Sum of Rectangle No Larger Than K',
  leetcodeNumber: 363,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Find the maximum sum rectangle in a matrix that does not exceed k. Fix left and right column boundaries, compute row prefix sums between columns, then use a sorted set (or BIT) to find the maximum prefix sum ≤ current_prefix_sum - k.',
  tags: ['Segment Tree', 'Binary Search', 'Prefix Sum', 'Ordered Set'],
  code: {
    pseudocode: `function maxSumSubmatrix(matrix, k):
  m = rows, n = cols
  result = -infinity

  for left from 0 to n-1:
    rowSums = [0] * m
    for right from left to n-1:
      // accumulate row sums between columns [left,right]
      for row in 0..m-1:
        rowSums[row] += matrix[row][right]

      // find max subarray sum <= k using prefix sums + sorted set
      sortedPrefixes = {0}
      prefixSum = 0
      for s in rowSums:
        prefixSum += s
        // find smallest prefix in set >= prefixSum - k
        target = sortedPrefixes.lower_bound(prefixSum - k)
        if target exists: result = max(result, prefixSum - target)
        sortedPrefixes.add(prefixSum)

  return result`,
    python: `from sortedcontainers import SortedList

class Solution:
    def maxSumSubmatrix(self, matrix, k):
        m, n = len(matrix), len(matrix[0])
        result = float('-inf')

        for left in range(n):
            rowSums = [0] * m
            for right in range(left, n):
                for row in range(m):
                    rowSums[row] += matrix[row][right]

                sl = SortedList([0])
                prefix = 0
                for s in rowSums:
                    prefix += s
                    idx = sl.bisect_left(prefix - k)
                    if idx < len(sl):
                        result = max(result, prefix - sl[idx])
                    sl.add(prefix)

        return result`,
    javascript: `var maxSumSubmatrix = function(matrix, k) {
  const m=matrix.length, n=matrix[0].length;
  let result=-Infinity;
  for(let left=0;left<n;left++){
    const rowSums=new Array(m).fill(0);
    for(let right=left;right<n;right++){
      for(let r=0;r<m;r++) rowSums[r]+=matrix[r][right];
      // O(m^2) inner loop for simplicity
      let pre=0;
      for(let i=0;i<m;i++){
        pre+=rowSums[i];
        let cur=pre;
        for(let j=0;j<i;j++){
          cur=Math.min(cur, pre-rowSums.slice(0,j+1).reduce((a,b)=>a+b,0));
        }
        if(cur<=k) result=Math.max(result,cur);
      }
    }
  }
  return result;
};`,
    java: `class Solution {
    public int maxSumSubmatrix(int[][] matrix, int k) {
        int m=matrix.length, n=matrix[0].length, res=Integer.MIN_VALUE;
        for(int left=0;left<n;left++){
            int[] rs=new int[m];
            for(int right=left;right<n;right++){
                for(int r=0;r<m;r++) rs[r]+=matrix[r][right];
                TreeSet<Integer> set=new TreeSet<>(); set.add(0);
                int pre=0;
                for(int s:rs){
                    pre+=s;
                    Integer lo=set.ceiling(pre-k);
                    if(lo!=null) res=Math.max(res,pre-lo);
                    set.add(pre);
                }
            }
        }
        return res;
    }
}`,
  },
  defaultInput: { matrix: [[1,0,1],[0,-2,3]], k: 2 },
  inputFields: [
    { name: 'matrix', label: 'Matrix (rows)', type: 'array', defaultValue: [[1,0,1],[0,-2,3]], helperText: '2D integer matrix' },
    { name: 'k', label: 'k (max sum)', type: 'number', defaultValue: 2 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const m = matrix.length, n = matrix[0].length;
    let result = -Infinity;

    steps.push({
      line: 1,
      explanation: `Find max rectangle sum ≤ k=${k} in ${m}×${n} matrix. Fix left/right columns and find best row range.`,
      variables: { matrix, k, m, n },
      visualization: { type: 'array', array: matrix.flat(), highlights: {}, labels: {} },
    });

    for (let left = 0; left < n; left++) {
      const rowSums = new Array(m).fill(0);
      for (let right = left; right < n; right++) {
        for (let r = 0; r < m; r++) rowSums[r] += matrix[r][right];

        const sorted: number[] = [0];
        let prefix = 0;
        let bestForStrip = -Infinity;

        for (let i = 0; i < m; i++) {
          prefix += rowSums[i];
          const target = prefix - k;
          let lo = 0, hi = sorted.length;
          while (lo < hi) { const mid = (lo + hi) >> 1; sorted[mid] < target ? lo = mid + 1 : hi = mid; }
          if (lo < sorted.length) {
            const candidate = prefix - sorted[lo];
            if (candidate > bestForStrip) bestForStrip = candidate;
          }
          const insPos = sorted.findIndex(v => v >= prefix);
          insPos === -1 ? sorted.push(prefix) : sorted.splice(insPos, 0, prefix);
        }

        if (bestForStrip !== -Infinity && bestForStrip <= k) {
          result = Math.max(result, bestForStrip);
        }

        const flatMatrix = matrix.flat();
        const highlights: Record<number, string> = {};
        flatMatrix.forEach((_, i) => {
          const col = i % n;
          if (col >= left && col <= right) highlights[i] = 'active';
          else highlights[i] = 'visited';
        });

        steps.push({
          line: 11,
          explanation: `Columns [${left},${right}]: rowSums=[${rowSums.join(',')}]. Best strip sum ≤ k: ${bestForStrip === -Infinity ? 'none' : bestForStrip}. Best so far: ${result === -Infinity ? 'none' : result}`,
          variables: { left, right, rowSums: [...rowSums], bestForStrip, result },
          visualization: { type: 'array', array: flatMatrix, highlights, labels: { 0: `best=${result === -Infinity ? '?' : result}` } },
        });
      }
    }

    steps.push({
      line: 14,
      explanation: `Maximum rectangle sum ≤ k=${k}: ${result}`,
      variables: { result },
      visualization: {
        type: 'array',
        array: matrix.flat(),
        highlights: Object.fromEntries(matrix.flat().map((_, i) => [i, 'found'])),
        labels: { 0: `ans=${result}` },
      },
    });

    return steps;
  },
};

export default maxSumOfRectangleNoLargerThanK;
