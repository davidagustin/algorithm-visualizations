import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const magneticForceBetweenBalls: AlgorithmDefinition = {
  id: 'magnetic-force-between-balls',
  title: 'Magnetic Force Between Two Balls',
  leetcodeNumber: 1552,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Place m balls into baskets at given positions to maximize the minimum magnetic force (distance) between any two balls. Binary search on the answer: for each candidate minimum distance, greedily check if m balls can be placed. O(n log n + n log(max_dist)) time.',
  tags: ['binary search', 'greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maxDistance(position, m):
  sort(position)
  left = 1, right = position[n-1] - position[0]
  while left < right:
    mid = left + (right - left + 1) / 2
    if canPlace(position, m, mid):
      left = mid
    else:
      right = mid - 1
  return left

function canPlace(pos, m, minDist):
  placed = 1, last = pos[0]
  for i = 1 to n-1:
    if pos[i] - last >= minDist:
      placed++, last = pos[i]
  return placed >= m`,

    python: `def maxDistance(position: list[int], m: int) -> int:
    position.sort()
    n = len(position)

    def canPlace(minDist):
        placed, last = 1, position[0]
        for i in range(1, n):
            if position[i] - last >= minDist:
                placed += 1
                last = position[i]
        return placed >= m

    left, right = 1, position[-1] - position[0]
    while left < right:
        mid = left + (right - left + 1) // 2
        if canPlace(mid):
            left = mid
        else:
            right = mid - 1
    return left`,

    javascript: `function maxDistance(position, m) {
  position.sort((a, b) => a - b);
  const n = position.length;
  const canPlace = (minDist) => {
    let placed = 1, last = position[0];
    for (let i = 1; i < n; i++) {
      if (position[i] - last >= minDist) { placed++; last = position[i]; }
    }
    return placed >= m;
  };
  let left = 1, right = position[n - 1] - position[0];
  while (left < right) {
    const mid = left + Math.floor((right - left + 1) / 2);
    if (canPlace(mid)) left = mid;
    else right = mid - 1;
  }
  return left;
}`,

    java: `public int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int left = 1, right = position[position.length - 1] - position[0];
    while (left < right) {
        int mid = left + (right - left + 1) / 2;
        if (canPlace(position, m, mid)) left = mid;
        else right = mid - 1;
    }
    return left;
}`,
  },

  defaultInput: {
    position: [1, 2, 3, 4, 7],
    m: 3,
  },

  inputFields: [
    {
      name: 'position',
      label: 'Basket Positions',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 7],
      placeholder: '1,2,3,4,7',
      helperText: 'Comma-separated basket positions (will be sorted)',
    },
    {
      name: 'm',
      label: 'Number of balls (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of balls to place',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const positionRaw = input.position as number[];
    const m = input.m as number;
    const steps: AlgorithmStep[] = [];

    const position = [...positionRaw].sort((a, b) => a - b);
    const n = position.length;

    const canPlace = (minDist: number): { feasible: boolean; placed: number } => {
      let placed = 1;
      let last = position[0];
      for (let i = 1; i < n; i++) {
        if (position[i] - last >= minDist) { placed++; last = position[i]; }
      }
      return { feasible: placed >= m, placed };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>, lo: number, hi: number, mid?: number): ArrayVisualization => ({
      type: 'array',
      array: position,
      highlights,
      labels,
      auxData: {
        label: 'Binary Search on Min Distance',
        entries: [
          { key: 'left (min distance)', value: String(lo) },
          { key: 'right (max distance)', value: String(hi) },
          { key: 'm (balls)', value: String(m) },
          ...(mid !== undefined ? [{ key: 'testing distance', value: String(mid) }] : []),
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Sort positions: [${position.join(', ')}]. Binary search on min distance. Range [1, ${position[n - 1] - position[0]}].`,
      variables: { position, m },
      visualization: makeViz(
        position.reduce((h, _, i) => ({ ...h, [i]: 'default' }), {}),
        position.reduce((l, _, i) => ({ ...l, [i]: String(position[i]) }), {}),
        1, position[n - 1] - position[0]
      ),
    });

    let left = 1;
    let right = position[n - 1] - position[0];

    let iteration = 0;
    while (left < right) {
      iteration++;
      const mid = left + Math.floor((right - left + 1) / 2);
      const { feasible, placed } = canPlace(mid);

      // Highlight which positions would be chosen greedily
      const placedHighlights: Record<number, string> = {};
      let last = position[0];
      let cnt = 1;
      placedHighlights[0] = 'active';
      for (let i = 1; i < n; i++) {
        if (position[i] - last >= mid) { cnt++; last = position[i]; placedHighlights[i] = 'active'; }
        else placedHighlights[i] = 'visited';
      }

      steps.push({
        line: 5,
        explanation: `Iteration ${iteration}: test min distance = ${mid}. Greedy placement gives ${placed} ball(s).`,
        variables: { left, right, mid, placed, m, feasible },
        visualization: makeViz(placedHighlights, {}, left, right, mid),
      });

      if (feasible) {
        steps.push({
          line: 6,
          explanation: `${placed} >= ${m}: distance ${mid} works! Try larger: left = ${mid}.`,
          variables: { left: mid, right },
          visualization: makeViz(
            placedHighlights,
            position.reduce((l, _, i) => placedHighlights[i] === 'active' ? { ...l, [i]: 'ball' } : l, {}),
            mid, right, mid
          ),
        });
        left = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `${placed} < ${m}: distance ${mid} too large. Reduce: right = ${mid - 1}.`,
          variables: { left, right: mid - 1 },
          visualization: makeViz(
            position.reduce((h, _, i) => ({ ...h, [i]: 'mismatch' }), {}),
            {},
            left, mid - 1, mid
          ),
        });
        right = mid - 1;
      }
    }

    // Final placement highlights
    const { placed } = canPlace(left);
    const finalHighlights: Record<number, string> = {};
    let last2 = position[0];
    finalHighlights[0] = 'found';
    for (let i = 1; i < n; i++) {
      if (position[i] - last2 >= left) { last2 = position[i]; finalHighlights[i] = 'found'; }
      else finalHighlights[i] = 'visited';
    }

    steps.push({
      line: 9,
      explanation: `Converged: maximum minimum distance = ${left}. Place ${m} balls at highlighted positions. Placed = ${placed}.`,
      variables: { result: left, placed },
      visualization: makeViz(finalHighlights, finalHighlights[0] === 'found' ? { 0: 'ball' } : {}, left, left),
    });

    return steps;
  },
};

export default magneticForceBetweenBalls;
