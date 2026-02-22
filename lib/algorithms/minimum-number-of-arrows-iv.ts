import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfArrowsIV: AlgorithmDefinition = {
  id: 'minimum-number-of-arrows-iv',
  title: 'Minimum Number of Arrows IV',
  leetcodeNumber: 452,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given balloon intervals on a number line, find the minimum number of arrows to burst all balloons. An arrow at x bursts all balloons where start <= x <= end. Sort by end; greedily shoot at the rightmost point of the current balloon and count how many subsequent balloons it bursts. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function findMinArrowShots(points):
  sort by end
  arrows = 1
  arrowPos = points[0].end
  for [start, end] in points[1:]:
    if start > arrowPos:
      arrows++
      arrowPos = end
  return arrows`,
    python: `def findMinArrowShots(points):
    points.sort(key=lambda x: x[1])
    arrows, pos = 1, points[0][1]
    for s, e in points[1:]:
        if s > pos:
            arrows += 1
            pos = e
    return arrows`,
    javascript: `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1, pos = points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > pos) {
      arrows++;
      pos = points[i][1];
    }
  }
  return arrows;
}`,
    java: `public int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1;
    int pos = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > pos) {
            arrows++;
            pos = points[i][1];
        }
    }
    return arrows;
}`,
  },
  defaultInput: { points: [[10, 16], [2, 8], [1, 6], [7, 12]] },
  inputFields: [
    {
      name: 'points',
      label: 'Balloon Intervals',
      type: 'array',
      defaultValue: [[10, 16], [2, 8], [1, 6], [7, 12]],
      placeholder: '[[10,16],[2,8],[1,6],[7,12]]',
      helperText: 'Array of [xstart, xend] balloon intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.points as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[1] - b[1]);
    const flat = raw.flat();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Arrows', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 2,
      explanation: `Sort balloons by end: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) },
      visualization: makeViz({}, {}),
    });

    let arrows = 1;
    let pos = raw[0][1];
    const arrowPositions: number[] = [pos];

    steps.push({
      line: 3,
      explanation: `Shoot first arrow at x=${pos} (end of first balloon [${raw[0][0]},${raw[0][1]}]).`,
      variables: { arrows, arrowPos: pos },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 1: `arr@${pos}` },
        [{ key: 'Arrows', value: String(arrows) }, { key: 'pos', value: String(pos) }]),
    });

    for (let i = 1; i < raw.length; i++) {
      const [s, e] = raw[i];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; }

      steps.push({
        line: 5,
        explanation: `Balloon [${s},${e}]: start ${s} > arrowPos ${pos}? ${s > pos ? 'Need new arrow.' : 'Burst by current arrow.'}`,
        variables: { start: s, end: e, arrowPos: pos, arrows },
        visualization: makeViz(hl, { [ci]: `s=${s}` },
          [{ key: 'Arrows', value: String(arrows) }, { key: 'pos', value: String(pos) }]),
      });

      if (s > pos) {
        arrows++;
        pos = e;
        arrowPositions.push(pos);
        hl[ci] = 'swapping'; hl[ci + 1] = 'swapping';
        steps.push({
          line: 7,
          explanation: `New arrow #${arrows} at x=${pos}. Balloon [${s},${e}] starts after previous arrow.`,
          variables: { arrows, arrowPos: pos },
          visualization: makeViz(hl, { [ci + 1]: `arr@${pos}` },
            arrowPositions.map((a, k) => ({ key: `Arrow ${k + 1}`, value: `x=${a}` }))),
        });
      } else {
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({
          line: 6,
          explanation: `Balloon [${s},${e}] burst by arrow at ${pos}. No new arrow needed.`,
          variables: { arrows, arrowPos: pos },
          visualization: makeViz(hl, {},
            arrowPositions.map((a, k) => ({ key: `Arrow ${k + 1}`, value: `x=${a}` }))),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({
      line: 8,
      explanation: `Done. Minimum arrows: ${arrows}.`,
      variables: { minArrows: arrows },
      visualization: makeViz(finalHl, {}, [{ key: 'Min Arrows', value: String(arrows) }]),
    });

    return steps;
  },
};

export default minimumNumberOfArrowsIV;
