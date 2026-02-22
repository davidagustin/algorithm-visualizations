import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeBoxes: AlgorithmDefinition = {
  id: 'remove-boxes',
  title: 'Remove Boxes',
  leetcodeNumber: 546,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given boxes with colored labels, remove groups of same-colored boxes. Removing k consecutive same-colored boxes gives k*k points. Find the maximum points. Uses 3D DP: dp[l][r][k] = max points from boxes[l..r] with k boxes same color as boxes[l] appended on the left.',
  tags: ['dynamic programming', 'interval dp', 'memoization'],

  code: {
    pseudocode: `function removeBoxes(boxes):
  n = len(boxes)
  dp[l][r][k] = max points from boxes[l..r] with k extra boxes[l] on left
  def solve(l, r, k):
    if l > r: return 0
    if cached: return cache
    // extend k for same-colored boxes at start
    while l < r and boxes[l+1] == boxes[l]: l++; k++
    result = (k+1)*(k+1) + solve(l+1, r, 0)
    for m from l+1 to r:
      if boxes[m] == boxes[l]:
        result = max(result, solve(l+1, m-1, 0) + solve(m, r, k+1))
    return result
  return solve(0, n-1, 0)`,
    python: `def removeBoxes(boxes):
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def dp(l, r, k):
        if l > r: return 0
        while l < r and boxes[l+1] == boxes[l]:
            l += 1; k += 1
        res = (k+1)**2 + dp(l+1, r, 0)
        for m in range(l+1, r+1):
            if boxes[m] == boxes[l]:
                res = max(res, dp(l+1, m-1, 0) + dp(m, r, k+1))
        return res
    return dp(0, len(boxes)-1, 0)`,
    javascript: `function removeBoxes(boxes) {
  const memo = new Map();
  function dp(l, r, k) {
    if (l > r) return 0;
    const key = l+','+r+','+k;
    if (memo.has(key)) return memo.get(key);
    while (l < r && boxes[l+1] === boxes[l]) { l++; k++; }
    let res = (k+1)*(k+1) + dp(l+1, r, 0);
    for (let m = l+1; m <= r; m++) {
      if (boxes[m] === boxes[l])
        res = Math.max(res, dp(l+1, m-1, 0) + dp(m, r, k+1));
    }
    memo.set(key, res); return res;
  }
  return dp(0, boxes.length-1, 0);
}`,
    java: `public int removeBoxes(int[] boxes) {
    int n = boxes.length;
    int[][][] dp = new int[n][n][n];
    return solve(boxes, dp, 0, n-1, 0);
}
int solve(int[] boxes, int[][][] dp, int l, int r, int k) {
    if (l > r) return 0;
    if (dp[l][r][k] != 0) return dp[l][r][k];
    while (l < r && boxes[l+1] == boxes[l]) { l++; k++; }
    int res = (k+1)*(k+1) + solve(boxes, dp, l+1, r, 0);
    for (int m = l+1; m <= r; m++)
        if (boxes[m] == boxes[l])
            res = Math.max(res, solve(boxes,dp,l+1,m-1,0)+solve(boxes,dp,m,r,k+1));
    return dp[l][r][k] = res;
}`,
  },

  defaultInput: {
    boxes: [1, 3, 2, 2, 2, 3, 4, 3, 1],
  },

  inputFields: [
    {
      name: 'boxes',
      label: 'Box Colors',
      type: 'array',
      defaultValue: [1, 3, 2, 2, 2, 3, 4, 3, 1],
      placeholder: '1,3,2,2,2,3,4,3,1',
      helperText: 'Comma-separated box color labels',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const boxes = input.boxes as number[];
    const steps: AlgorithmStep[] = [];
    const n = boxes.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...boxes],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Remove Boxes: boxes=[${boxes.join(', ')}]. Removing k consecutive same-color boxes gives k*k points. Maximize total.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    // Show groups of same-colored boxes
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n && boxes[j] === boxes[i]) j++;
      const groupLen = j - i;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let idx = i; idx < j; idx++) {
        highlights[idx] = groupLen > 1 ? 'active' : 'comparing';
      }
      labels[i] = `${groupLen}x${boxes[i]}`;

      steps.push({
        line: 6,
        explanation: `Color ${boxes[i]}: group of ${groupLen} at indices ${i}-${j - 1}. Removing alone gives ${groupLen * groupLen} points.`,
        variables: { color: boxes[i], groupSize: groupLen, points: groupLen * groupLen },
        visualization: makeViz(highlights, labels),
      });
      i = j;
      if (steps.length > 6) break;
    }

    const memo = new Map<string, number>();
    function dp(l: number, r: number, k: number): number {
      if (l > r) return 0;
      const key = `${l},${r},${k}`;
      if (memo.has(key)) return memo.get(key)!;
      while (l < r && boxes[l + 1] === boxes[l]) { l++; k++; }
      let res = (k + 1) * (k + 1) + dp(l + 1, r, 0);
      for (let m = l + 1; m <= r; m++) {
        if (boxes[m] === boxes[l]) {
          res = Math.max(res, dp(l + 1, m - 1, 0) + dp(m, r, k + 1));
        }
      }
      memo.set(key, res);
      return res;
    }

    const result = dp(0, n - 1, 0);

    steps.push({
      line: 10,
      explanation: `dp(0, ${n - 1}, 0)=${result}. Maximum points from removing all boxes optimally. Computed ${memo.size} states.`,
      variables: { result, memoStates: memo.size },
      visualization: makeViz(
        Object.fromEntries(boxes.map((_, i) => [i, 'found'])),
        { 0: `max:${result}` }
      ),
    });

    return steps;
  },
};

export default removeBoxes;
