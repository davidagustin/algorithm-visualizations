import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfBoomerangs: AlgorithmDefinition = {
  id: 'number-of-boomerangs',
  title: 'Number of Boomerangs',
  leetcodeNumber: 447,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Count boomerang triplets (i, j, k) where distance(i,j) == distance(i,k). For each point as pivot, build a hash map of squared distances to all other points. For each distance d with count c, c*(c-1) ordered pairs (j,k) exist. Sum over all pivots and distances.',
  tags: ['hash map', 'geometry', 'math'],

  code: {
    pseudocode: `function numberOfBoomerangs(points):
  count = 0
  for p in points:
    distMap = {}
    for q in points:
      if p == q: continue
      d = (p[0]-q[0])^2 + (p[1]-q[1])^2
      distMap[d] = distMap.get(d, 0) + 1
    for c in distMap.values():
      count += c * (c - 1)
  return count`,

    python: `def numberOfBoomerangs(points: list[list[int]]) -> int:
    count = 0
    for px, py in points:
        dist = {}
        for qx, qy in points:
            d = (px-qx)**2 + (py-qy)**2
            dist[d] = dist.get(d, 0) + 1
        for c in dist.values():
            count += c * (c - 1)
    return count`,

    javascript: `function numberOfBoomerangs(points) {
  let count = 0;
  for (const [px, py] of points) {
    const dist = new Map();
    for (const [qx, qy] of points) {
      const d = (px-qx)**2 + (py-qy)**2;
      dist.set(d, (dist.get(d) || 0) + 1);
    }
    for (const c of dist.values()) count += c * (c - 1);
  }
  return count;
}`,

    java: `public int numberOfBoomerangs(int[][] points) {
    int count = 0;
    for (int[] p : points) {
        Map<Integer, Integer> dist = new HashMap<>();
        for (int[] q : points)
            dist.merge((p[0]-q[0])*(p[0]-q[0])+(p[1]-q[1])*(p[1]-q[1]), 1, Integer::sum);
        for (int c : dist.values()) count += c * (c - 1);
    }
    return count;
}`,
  },

  defaultInput: {
    points: [[0, 0], [1, 0], [2, 0]],
  },

  inputFields: [
    {
      name: 'points',
      label: 'Points',
      type: 'array',
      defaultValue: [[0, 0], [1, 0], [2, 0]],
      placeholder: '0,0|1,0|2,0',
      helperText: 'List of [x, y] points',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const steps: AlgorithmStep[] = [];
    let count = 0;

    steps.push({
      line: 1,
      explanation: `We have ${points.length} points. For each pivot point, count same-distance neighbors and use combinatorics to count boomerangs.`,
      variables: { count: 0, totalPoints: points.length },
      visualization: {
        type: 'array',
        array: points.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`])),
      },
    });

    for (let i = 0; i < points.length; i++) {
      const [px, py] = points[i];
      const distMap: Record<number, number> = {};

      steps.push({
        line: 3,
        explanation: `Pivot = point ${i} (${px},${py}). Computing squared distances to all other points.`,
        variables: { pivot: `(${px},${py})`, distMap: '{}', count },
        visualization: {
          type: 'array',
          array: points.map((_, idx) => idx),
          highlights: { [i]: 'active' },
          labels: { [i]: 'pivot' },
        },
      });

      for (let j = 0; j < points.length; j++) {
        const [qx, qy] = points[j];
        const d = (px - qx) ** 2 + (py - qy) ** 2;
        distMap[d] = (distMap[d] || 0) + 1;

        steps.push({
          line: 6,
          explanation: `Distance from (${px},${py}) to point ${j} (${qx},${qy}): d = (${px}-${qx})^2 + (${py}-${qy})^2 = ${d}. distMap[${d}] = ${distMap[d]}.`,
          variables: { pivot: i, neighbor: j, dist: d, distMap: JSON.stringify(distMap), count },
          visualization: {
            type: 'array',
            array: points.map((_, idx) => idx),
            highlights: { [i]: 'active', [j]: 'comparing' },
            labels: { [i]: 'pivot', [j]: `d=${d}` },
          },
        });
      }

      let addedThisRound = 0;
      for (const [dStr, c] of Object.entries(distMap)) {
        if (c > 1) {
          addedThisRound += c * (c - 1);
        }
      }
      count += addedThisRound;

      steps.push({
        line: 9,
        explanation: `For pivot ${i}: distMap = ${JSON.stringify(distMap)}. Adding ${addedThisRound} boomerangs (sum of c*(c-1) for each distance). Total = ${count}.`,
        variables: { pivot: i, distMap: JSON.stringify(distMap), added: addedThisRound, count },
        visualization: {
          type: 'array',
          array: points.map((_, idx) => idx),
          highlights: { [i]: 'found' },
          labels: { [i]: `+${addedThisRound}` },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `All pivots processed. Total boomerang triplets = ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: points.map((_, i) => i),
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default numberOfBoomerangs;
