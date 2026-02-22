import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfArrowsIi: AlgorithmDefinition = {
  id: 'minimum-number-of-arrows-ii',
  title: 'Minimum Number of Arrows to Burst Balloons (Detailed)',
  leetcodeNumber: 452,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given balloons as [xstart, xend] intervals on a horizontal axis, find the minimum number of arrows shot vertically to burst all balloons. Greedy: sort by end coordinate. Shoot an arrow at the first balloon end; it bursts all overlapping balloons. Repeat for remaining.',
  tags: ['greedy', 'sorting', 'intervals', 'array'],

  code: {
    pseudocode: `function findMinArrowShots(points):
  sort points by end coordinate
  arrows = 1
  arrowPos = points[0][1]
  for each balloon [start, end]:
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
  let arrows = 1;
  let arrowPos = points[0][1];
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
    points: [10, 16, 2, 8, 1, 6, 7, 12],
  },

  inputFields: [
    {
      name: 'points',
      label: 'Balloon Intervals (interleaved start,end pairs)',
      type: 'array',
      defaultValue: [10, 16, 2, 8, 1, 6, 7, 12],
      placeholder: '10,16,2,8,1,6,7,12',
      helperText: 'Pairs: xstart,xend for each balloon',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.points as number[];
    const steps: AlgorithmStep[] = [];

    const pointsRaw: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      pointsRaw.push([flat[i], flat[i + 1]]);
    }

    const points = [...pointsRaw].sort((a, b) => a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `Sort balloons by end coordinate: ${points.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}.`,
      variables: { sorted: points.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ') },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: Object.fromEntries(points.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(points.map((p, i) => [i, '[' + p[0] + ',' + p[1] + ']'])),
      },
    });

    let arrows = 1;
    let arrowPos = points[0][1];

    steps.push({
      line: 2,
      explanation: `Shoot first arrow at x=${arrowPos} (end of first balloon [${points[0][0]},${points[0][1]}]). arrows=${arrows}.`,
      variables: { arrows, arrowPos, balloon: '[' + points[0][0] + ',' + points[0][1] + ']' },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: { 0: 'found' },
        labels: { 0: 'arrow@' + arrowPos },
      },
    });

    const arrowPositions: number[] = [arrowPos];

    for (let i = 1; i < points.length; i++) {
      const [start, end] = points[i];

      if (start > arrowPos) {
        arrows++;
        arrowPos = end;
        arrowPositions.push(arrowPos);

        steps.push({
          line: 5,
          explanation: `Balloon ${i}: [${start},${end}]. start=${start} > arrowPos=${arrowPositions[arrowPositions.length - 2]}. New arrow at x=${arrowPos}. arrows=${arrows}.`,
          variables: { i, start, end, arrowPos, arrows },
          visualization: {
            type: 'array',
            array: points.map(p => p[1]),
            highlights: { [i]: 'active' },
            labels: { [i]: 'new arrow@' + arrowPos },
          },
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Balloon ${i}: [${start},${end}]. start=${start} <= arrowPos=${arrowPos}. Burst by current arrow at ${arrowPos}.`,
          variables: { i, start, end, arrowPos, arrows },
          visualization: {
            type: 'array',
            array: points.map(p => p[1]),
            highlights: { [i]: 'found' },
            labels: { [i]: 'burst by arrow' },
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `All ${points.length} balloons burst with ${arrows} arrows at positions [${arrowPositions.join(', ')}].`,
      variables: { result: arrows, arrowPositions: arrowPositions.join(',') },
      visualization: {
        type: 'array',
        array: points.map(p => p[1]),
        highlights: Object.fromEntries(points.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumNumberOfArrowsIi;
