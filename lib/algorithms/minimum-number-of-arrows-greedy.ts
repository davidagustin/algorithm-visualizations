import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfArrowsGreedy: AlgorithmDefinition = {
  id: 'minimum-number-of-arrows-greedy',
  title: 'Minimum Number of Arrows to Burst Balloons (Greedy)',
  leetcodeNumber: 452,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Balloons are spread along a horizontal axis with their horizontal diameters given by [xstart, xend]. An arrow shot at position x bursts all balloons with xstart <= x <= xend. Find the minimum number of arrows needed. Greedy: sort by end position, shoot at the end of each balloon, which may burst multiple overlapping ones.',
  tags: ['greedy', 'sorting', 'intervals'],

  code: {
    pseudocode: `function findMinArrowShots(points):
  sort points by end coordinate
  arrows = 1
  arrowPos = points[0][1]
  for [start, end] in points[1:]:
    if start > arrowPos:
      arrows++
      arrowPos = end
  return arrows`,

    python: `def findMinArrowShots(points: list[list[int]]) -> int:
    points.sort(key=lambda x: x[1])
    arrows = 1
    arrow_pos = points[0][1]
    for start, end in points[1:]:
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    return arrows`,

    javascript: `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1, arrowPos = points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > arrowPos) {
      arrows++;
      arrowPos = points[i][1];
    }
  }
  return arrows;
}`,

    java: `public int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int arrowPos = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}`,
  },

  defaultInput: {
    points: [[10, 16], [2, 8], [1, 6], [7, 12]],
  },

  inputFields: [
    {
      name: 'points',
      label: 'Balloon Ranges',
      type: 'array',
      defaultValue: [[10, 16], [2, 8], [1, 6], [7, 12]],
      placeholder: '[[10,16],[2,8],[1,6],[7,12]]',
      helperText: 'Array of [xstart, xend] balloon positions',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pointsRaw = input.points as number[][];
    const steps: AlgorithmStep[] = [];

    const points = [...pointsRaw].sort((a, b) => a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `Sort balloons by end position: [${points.map(p => `[${p[0]},${p[1]}]`).join(', ')}]. Shoot at the rightmost end of each balloon to maximize hits.`,
      variables: { sorted: points.map(p => `[${p}]`) },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: {},
        labels: Object.fromEntries(points.map((p, i) => [i, `[${p[0]},${p[1]}]`])) as Record<number, string>,
      },
    });

    let arrows = 1;
    let arrowPos = points[0][1];

    steps.push({
      line: 3,
      explanation: `Shoot first arrow at position ${arrowPos} (end of balloon 0 [${points[0][0]},${points[0][1]}]).`,
      variables: { arrows, arrowPos },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: { 0: 'found' } as Record<number, string>,
        labels: { 0: `arrow@${arrowPos}` } as Record<number, string>,
      },
    });

    for (let i = 1; i < points.length; i++) {
      const [start, end] = points[i];

      if (start > arrowPos) {
        arrows++;
        arrowPos = end;
        steps.push({
          line: 6,
          explanation: `Balloon ${i} [${start},${end}] starts at ${start} > current arrow at ${arrowPos - (end - arrowPos)}... Wait: start ${start} > arrowPos ${arrowPos - (end - arrowPos)} before update. New arrow at ${arrowPos}. Total arrows: ${arrows}.`,
          variables: { i, start, end, arrowPos, arrows },
          visualization: {
            type: 'array',
            array: points.map(p => p[1]),
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
              [i]: 'active',
            } as Record<number, string>,
            labels: { [i]: `new arrow@${arrowPos}` } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Balloon ${i} [${start},${end}] starts at ${start} <= arrowPos ${arrowPos}. Current arrow bursts this balloon too.`,
          variables: { i, start, end, arrowPos, arrows },
          visualization: {
            type: 'array',
            array: points.map(p => p[1]),
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
              [i]: 'found',
            } as Record<number, string>,
            labels: { [i]: 'burst' } as Record<number, string>,
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Minimum arrows to burst all balloons: ${arrows}.`,
      variables: { result: arrows },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: Object.fromEntries(points.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumNumberOfArrowsGreedy;
