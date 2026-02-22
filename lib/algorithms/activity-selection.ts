import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const activitySelection: AlgorithmDefinition = {
  id: 'activity-selection',
  title: 'Activity Selection',
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given n activities each with a start and end time, select the maximum number of non-overlapping activities. Greedy approach: sort by finish time, always pick the activity that finishes earliest and does not conflict with the last selected activity.',
  tags: ['Greedy', 'Sorting', 'Interval'],
  code: {
    pseudocode: `function activitySelection(start, end):
  sort activities by end time
  result = [0]  // always pick first activity
  lastEnd = end[0]
  for i from 1 to n-1:
    if start[i] >= lastEnd:
      result.append(i)
      lastEnd = end[i]
  return result`,
    python: `def activitySelection(start, end):
    activities = sorted(zip(start, end), key=lambda x: x[1])
    result = [activities[0]]
    last_end = activities[0][1]
    for s, e in activities[1:]:
        if s >= last_end:
            result.append((s, e))
            last_end = e
    return result`,
    javascript: `function activitySelection(start, end) {
  const acts = start.map((s, i) => [s, end[i]]).sort((a, b) => a[1] - b[1]);
  const result = [acts[0]];
  let lastEnd = acts[0][1];
  for (let i = 1; i < acts.length; i++) {
    if (acts[i][0] >= lastEnd) {
      result.push(acts[i]);
      lastEnd = acts[i][1];
    }
  }
  return result;
}`,
    java: `public int activitySelection(int[] start, int[] end) {
    int n = start.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> end[a] - end[b]);
    int count = 1, lastEnd = end[idx[0]];
    for (int i = 1; i < n; i++) {
        if (start[idx[i]] >= lastEnd) {
            count++;
            lastEnd = end[idx[i]];
        }
    }
    return count;
}`,
  },
  defaultInput: { start: [1, 3, 0, 5, 8, 5], end: [2, 4, 6, 7, 9, 9] },
  inputFields: [
    {
      name: 'start',
      label: 'Start Times',
      type: 'array',
      defaultValue: [1, 3, 0, 5, 8, 5],
      placeholder: 'e.g. 1,3,0,5,8,5',
      helperText: 'Start time for each activity',
    },
    {
      name: 'end',
      label: 'End Times',
      type: 'array',
      defaultValue: [2, 4, 6, 7, 9, 9],
      placeholder: 'e.g. 2,4,6,7,9,9',
      helperText: 'End time for each activity (same length as start)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startTimes = input.start as number[];
    const endTimes = input.end as number[];
    const n = startTimes.length;
    const steps: AlgorithmStep[] = [];

    // Create activity objects and sort by end time
    const acts = startTimes.map((s, i) => ({ s, e: endTimes[i], orig: i }));
    acts.sort((a, b) => a.e - b.e);

    const selected: number[] = []; // indices into sorted acts
    let lastEnd = -Infinity;

    function makeViz(activeIdx: number | null): ArrayVisualization {
      // Visualize end times (sorted)
      const endArr = acts.map(a => a.e);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `[${acts[i].s},${acts[i].e}]`;
        if (selected.includes(i)) highlights[i] = 'found';
        else if (i === activeIdx) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: endArr,
        highlights,
        labels,
        auxData: {
          label: 'Selection State',
          entries: [
            { key: 'Last end time', value: lastEnd === -Infinity ? 'none' : String(lastEnd) },
            { key: 'Selected count', value: String(selected.length) },
            { key: 'Selected activities', value: selected.map(i => `[${acts[i].s},${acts[i].e}]`).join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort ${n} activities by finish time. Sorted: ${acts.map(a => `[${a.s},${a.e}]`).join(', ')}.`,
      variables: { activities: acts.map(a => ({ start: a.s, end: a.e })) },
      visualization: makeViz(null),
    });

    // Always select first
    selected.push(0);
    lastEnd = acts[0].e;
    steps.push({
      line: 2,
      explanation: `Always select the first activity (earliest end): [${acts[0].s}, ${acts[0].e}]. Set lastEnd = ${lastEnd}.`,
      variables: { selected: [0], lastEnd },
      visualization: makeViz(0),
    });

    for (let i = 1; i < n; i++) {
      steps.push({
        line: 5,
        explanation: `Check activity ${i}: [${acts[i].s}, ${acts[i].e}]. Start ${acts[i].s} ${acts[i].s >= lastEnd ? '>=' : '<'} lastEnd ${lastEnd}.`,
        variables: { i, start: acts[i].s, end: acts[i].e, lastEnd },
        visualization: makeViz(i),
      });

      if (acts[i].s >= lastEnd) {
        selected.push(i);
        lastEnd = acts[i].e;
        steps.push({
          line: 6,
          explanation: `No overlap! Select activity ${i}: [${acts[i].s}, ${acts[i].e}]. Update lastEnd = ${lastEnd}.`,
          variables: { selected: selected.slice(), lastEnd },
          visualization: makeViz(i),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Overlap: activity ${i} starts at ${acts[i].s} < lastEnd ${lastEnd}. Skip.`,
          variables: { i, reason: 'overlap' },
          visualization: (() => {
            const endArr = acts.map(a => a.e);
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            for (let j = 0; j < n; j++) {
              l[j] = `[${acts[j].s},${acts[j].e}]`;
              h[j] = selected.includes(j) ? 'found' : (j === i ? 'mismatch' : 'default');
            }
            return {
              type: 'array' as const,
              array: endArr,
              highlights: h,
              labels: l,
              auxData: {
                label: 'Selection State',
                entries: [
                  { key: 'Skipping', value: `[${acts[i].s},${acts[i].e}] overlaps` },
                  { key: 'Last end time', value: String(lastEnd) },
                  { key: 'Selected count', value: String(selected.length) },
                ],
              },
            };
          })(),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Maximum ${selected.length} non-overlapping activities: ${selected.map(i => `[${acts[i].s},${acts[i].e}]`).join(', ')}.`,
      variables: { maxActivities: selected.length },
      visualization: (() => {
        const endArr = acts.map(a => a.e);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          l[i] = `[${acts[i].s},${acts[i].e}]`;
          h[i] = selected.includes(i) ? 'found' : 'visited';
        }
        return {
          type: 'array' as const,
          array: endArr,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Max activities', value: String(selected.length) },
              { key: 'Selected', value: selected.map(i => `[${acts[i].s},${acts[i].e}]`).join(', ') },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default activitySelection;
