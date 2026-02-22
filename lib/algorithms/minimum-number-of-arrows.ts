import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfArrows: AlgorithmDefinition = {
  id: 'minimum-number-of-arrows',
  title: 'Minimum Number of Arrows to Burst Balloons',
  leetcodeNumber: 452,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Find the minimum number of arrows to burst all balloons on a 2D plane, where each balloon is represented by [xstart, xend]. Sort balloons by end coordinate. Shoot an arrow at the end of the first balloon, which bursts all overlapping balloons. Move to the next unbursted balloon.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function findMinArrowShots(points):
  sort by end coordinate
  arrows = 1
  arrowPos = points[0].end
  for i from 1 to n-1:
    if points[i].start > arrowPos:
      arrows++
      arrowPos = points[i].end
  return arrows`,
    python: `def findMinArrowShots(points):
    points.sort(key=lambda x: x[1])
    arrows = 1
    arrow_pos = points[0][1]
    for i in range(1, len(points)):
        if points[i][0] > arrow_pos:
            arrows += 1
            arrow_pos = points[i][1]
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
    points: [[10, 16], [2, 8], [1, 6], [7, 12]],
  },
  inputFields: [
    {
      name: 'points',
      label: 'Balloon Ranges',
      type: 'array',
      defaultValue: [[10, 16], [2, 8], [1, 6], [7, 12]],
      placeholder: '[[10,16],[2,8],[1,6],[7,12]]',
      helperText: 'Each [xstart, xend] is a balloon range on the x-axis',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawPoints = input.points as number[][];
    const steps: AlgorithmStep[] = [];

    const points = rawPoints.map(p => [p[0], p[1]]).sort((a, b) => a[1] - b[1]);
    const flat = points.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: { label: 'Arrow State', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Sort balloons by end coordinate: [${points.map(p => `[${p[0]},${p[1]}]`).join(', ')}]. Greedy: shoot each arrow at the earliest end to burst maximum balloons.`,
      variables: { points },
      visualization: makeViz({}, {}, [{ key: 'arrows', value: '0' }]),
    });

    let arrows = 1;
    let arrowPos = points[0][1];
    const bursted = new Set<number>();
    bursted.add(0);

    steps.push({
      line: 4,
      explanation: `Shoot arrow #1 at position ${arrowPos} (end of first balloon [${points[0][0]}, ${points[0][1]}]).`,
      variables: { arrows, arrowPos },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 1: `arrow@${arrowPos}` }, [
        { key: 'arrows shot', value: String(arrows) },
        { key: 'arrow position', value: String(arrowPos) },
      ]),
    });

    for (let i = 1; i < points.length; i++) {
      const ci = i * 2;
      const p = points[i];

      if (p[0] > arrowPos) {
        // Need new arrow
        arrows++;
        arrowPos = p[1];
        bursted.add(i);
        const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
        for (const j of bursted) { if (j !== i) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; } }
        steps.push({
          line: 6,
          explanation: `Balloon [${p[0]}, ${p[1]}] starts at ${p[0]} > arrow at ${points[i - 1][1]}. Need new arrow #${arrows} at position ${arrowPos}.`,
          variables: { i, balloon: p, arrows, arrowPos },
          visualization: makeViz(hl, { [ci + 1]: `arrow@${arrowPos}` }, [
            { key: 'arrows shot', value: String(arrows) },
            { key: 'arrow position', value: String(arrowPos) },
            { key: 'balloon', value: `[${p[0]}, ${p[1]}]` },
          ]),
        });
      } else {
        // Bursted by current arrow
        bursted.add(i);
        const hl: Record<number, string> = { [ci]: 'found', [ci + 1]: 'found' };
        for (const j of bursted) { if (j !== i) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; } }
        steps.push({
          line: 5,
          explanation: `Balloon [${p[0]}, ${p[1]}] starts at ${p[0]} <= arrow at ${arrowPos}. Bursted by current arrow!`,
          variables: { i, balloon: p, arrowPos },
          visualization: makeViz(hl, { [ci]: `burst!` }, [
            { key: 'arrows shot', value: String(arrows) },
            { key: 'arrow position', value: String(arrowPos) },
            { key: 'bursted', value: `[${p[0]}, ${p[1]}]` },
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';

    steps.push({
      line: 8,
      explanation: `Done! Minimum arrows needed = ${arrows} to burst all ${points.length} balloons.`,
      variables: { result: arrows },
      visualization: makeViz(finalHl, {}, [
        { key: 'Minimum arrows', value: String(arrows) },
        { key: 'Balloons burst', value: String(points.length) },
      ]),
    });

    return steps;
  },
};

export default minimumNumberOfArrows;
