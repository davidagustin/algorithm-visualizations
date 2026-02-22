import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxValueOfEquation: AlgorithmDefinition = {
  id: 'max-value-of-equation',
  title: 'Max Value of Equation',
  leetcodeNumber: 1499,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an array points sorted by x-coordinate and integer k, find the maximum value of yi + yj + |xi - xj| for pairs where |xi - xj| <= k. Since points are sorted and xi < xj, the expression becomes yj + xj + (yi - xi). Use a monotonic deque to track the maximum yi - xi for valid left points. For each j, check deque front validity, then update result and deque.',
  tags: ['sliding window', 'deque', 'monotonic queue', 'greedy'],

  code: {
    pseudocode: `function findMaxValueOfEquation(points, k):
  result = -INF
  deque = []  // stores (yi - xi, xi) in decreasing order of yi - xi
  for (xj, yj) in points:
    while deque and xj - deque[0][1] > k:
      deque.popleft()
    if deque:
      result = max(result, yj + xj + deque[0][0])
    while deque and deque[-1][0] <= yj - xj:
      deque.pop()
    deque.append((yj - xj, xj))
  return result`,

    python: `def findMaxValueOfEquation(points: list[list[int]], k: int) -> int:
    from collections import deque
    result = float('-inf')
    dq = deque()  # (yi - xi, xi)
    for xj, yj in points:
        while dq and xj - dq[0][1] > k:
            dq.popleft()
        if dq:
            result = max(result, yj + xj + dq[0][0])
        while dq and dq[-1][0] <= yj - xj:
            dq.pop()
        dq.append((yj - xj, xj))
    return result`,

    javascript: `function findMaxValueOfEquation(points, k) {
  let result = -Infinity;
  const dq = []; // [yi - xi, xi]
  for (const [xj, yj] of points) {
    while (dq.length && xj - dq[0][1] > k) dq.shift();
    if (dq.length) result = Math.max(result, yj + xj + dq[0][0]);
    while (dq.length && dq[dq.length-1][0] <= yj - xj) dq.pop();
    dq.push([yj - xj, xj]);
  }
  return result;
}`,

    java: `public int findMaxValueOfEquation(int[][] points, int k) {
    int result = Integer.MIN_VALUE;
    Deque<int[]> dq = new ArrayDeque<>(); // [yi - xi, xi]
    for (int[] p : points) {
        int xj = p[0], yj = p[1];
        while (!dq.isEmpty() && xj - dq.peekFirst()[1] > k) dq.pollFirst();
        if (!dq.isEmpty()) result = Math.max(result, yj + xj + dq.peekFirst()[0]);
        while (!dq.isEmpty() && dq.peekLast()[0] <= yj - xj) dq.pollLast();
        dq.addLast(new int[]{yj - xj, xj});
    }
    return result;
}`,
  },

  defaultInput: {
    points: [[1, 3], [2, 0], [5, 10], [6, -10]],
    k: 1,
  },

  inputFields: [
    {
      name: 'points',
      label: 'Points (x,y pairs)',
      type: 'array',
      defaultValue: [[1, 3], [2, 0], [5, 10], [6, -10]],
      placeholder: '[[1,3],[2,0],[5,10],[6,-10]]',
      helperText: 'Array of [x, y] coordinate pairs sorted by x',
    },
    {
      name: 'k',
      label: 'Max Distance (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Maximum allowed |xi - xj|',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pointsRaw = input.points as unknown;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    let points: [number, number][];
    if (Array.isArray(pointsRaw) && Array.isArray(pointsRaw[0])) {
      points = (pointsRaw as number[][]).map((p) => [p[0], p[1]] as [number, number]);
    } else {
      points = [[1, 3], [2, 0], [5, 10], [6, -10]];
    }

    const n = points.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: points.map((p) => p[1]),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Maximize yi + yj + |xi - xj| where |xi - xj| <= k=${k}. Since sorted and i < j, this = yj + xj + (yi - xi). Use deque to track max (yi - xi).`,
      variables: { k, n, formula: 'yj + xj + max(yi - xi)' },
      visualization: makeViz({}, {}),
    });

    let result = -Infinity;
    const dq: [number, number][] = [];

    for (let j = 0; j < n; j++) {
      const [xj, yj] = points[j];

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[j] = 'current';
      labels[j] = `(${xj},${yj})`;

      steps.push({
        line: 3,
        explanation: `Process point j=${j}: (xj=${xj}, yj=${yj}). Deque size=${dq.length}. Current max result=${result === -Infinity ? '-INF' : result}.`,
        variables: { j, xj, yj, dequeSize: dq.length, result: result === -Infinity ? '-INF' : result },
        visualization: makeViz(highlights, labels),
      });

      while (dq.length && xj - dq[0][1] > k) {
        const [removedVal, removedX] = dq.shift()!;

        steps.push({
          line: 4,
          explanation: `Deque front x=${removedX} is too far from xj=${xj} (distance=${xj - removedX} > k=${k}). Remove from front.`,
          variables: { xj, removedX, distance: xj - removedX, k },
          visualization: makeViz({ [j]: 'current' }, { [j]: 'j' }),
        });
      }

      if (dq.length) {
        const candidate = yj + xj + dq[0][0];
        if (candidate > result) result = candidate;

        const foundHighlights: Record<number, string> = {};
        foundHighlights[j] = 'found';

        steps.push({
          line: 6,
          explanation: `Best (yi-xi) in deque = ${dq[0][0]}. Candidate = yj(${yj}) + xj(${xj}) + (yi-xi)(${dq[0][0]}) = ${candidate}. Result=${result}.`,
          variables: { j, yj, xj, bestYiMinusXi: dq[0][0], candidate, result },
          visualization: makeViz(foundHighlights, { [j]: `score=${candidate}` }),
        });
      }

      while (dq.length && dq[dq.length - 1][0] <= yj - xj) {
        const [removedVal] = dq.pop()!;

        steps.push({
          line: 8,
          explanation: `Deque back yi-xi=${removedVal} <= current yj-xj=${yj - xj}. Remove from back to keep deque decreasing.`,
          variables: { j, currentYjXj: yj - xj, removedVal },
          visualization: makeViz({ [j]: 'active' }, { [j]: 'j' }),
        });
      }

      dq.push([yj - xj, xj]);

      steps.push({
        line: 9,
        explanation: `Push (yj-xj=${yj - xj}, xj=${xj}) to deque. Deque now has ${dq.length} entries.`,
        variables: { j, yjMinusXj: yj - xj, xj, dequeSize: dq.length },
        visualization: makeViz({ [j]: 'sorted' }, { [j]: `d=${yj - xj}` }),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum value of yi + yj + |xi - xj| (with |xi - xj| <= k=${k}) = ${result}.`,
      variables: { result, k },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxValueOfEquation;
