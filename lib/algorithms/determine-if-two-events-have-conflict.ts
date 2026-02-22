import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const determineIfTwoEventsHaveConflict: AlgorithmDefinition = {
  id: 'determine-if-two-events-have-conflict',
  title: 'Determine If Two Events Have Conflict',
  leetcodeNumber: 2446,
  difficulty: 'Easy',
  category: 'Interval',
  description:
    'Given two events as "HH:MM" time strings, determine if they conflict (overlap). Convert times to minutes and check interval overlap: event1.start < event2.end AND event2.start < event1.end. O(1) time and space.',
  tags: ['Intervals', 'String', 'Greedy'],
  code: {
    pseudocode: `function haveConflict(event1, event2):
  s1 = toMinutes(event1[0])
  e1 = toMinutes(event1[1])
  s2 = toMinutes(event2[0])
  e2 = toMinutes(event2[1])
  return s1 <= e2 and s2 <= e1`,
    python: `def haveConflict(event1, event2):
    def toMin(t): h, m = map(int, t.split(':')); return h*60+m
    s1,e1 = toMin(event1[0]),toMin(event1[1])
    s2,e2 = toMin(event2[0]),toMin(event2[1])
    return s1 <= e2 and s2 <= e1`,
    javascript: `function haveConflict(event1, event2) {
  const toMin = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
  const [s1,e1] = event1.map(toMin);
  const [s2,e2] = event2.map(toMin);
  return s1 <= e2 && s2 <= e1;
}`,
    java: `public boolean haveConflict(String[] event1, String[] event2) {
    int[] s1e1 = parse(event1), s2e2 = parse(event2);
    return s1e1[0] <= s2e2[1] && s2e2[0] <= s1e1[1];
}
private int[] parse(String[] ev) {
    return Arrays.stream(ev).mapToInt(s -> {
        String[] p = s.split(":");
        return Integer.parseInt(p[0])*60+Integer.parseInt(p[1]);
    }).toArray();
}`,
  },
  defaultInput: {
    intervals: [[1, 3], [2, 4]],
  },
  inputFields: [
    {
      name: 'intervals',
      label: 'Two Event Intervals [start, end] in minutes',
      type: 'array',
      defaultValue: [[1, 3], [2, 4]],
      placeholder: '[[60,180],[120,240]]',
      helperText: 'Two [start, end] pairs in minutes (simulating "HH:MM" comparison)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    const ev1 = intervals[0] ?? [1, 3];
    const ev2 = intervals[1] ?? [2, 4];
    const flat = [ev1[0], ev1[1], ev2[0], ev2[1]];
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
      ...(auxEntries ? { auxData: { label: 'Conflict Check', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1,
      explanation: `Event1=[${ev1[0]},${ev1[1]}] and Event2=[${ev2[0]},${ev2[1]}] (in minutes). Check overlap.`,
      variables: { event1: [...ev1], event2: [...ev2] },
      visualization: makeViz({ 0: 'active', 1: 'active', 2: 'pointer', 3: 'pointer' },
        { 0: `s1=${ev1[0]}`, 1: `e1=${ev1[1]}`, 2: `s2=${ev2[0]}`, 3: `e2=${ev2[1]}` }) });

    const cond1 = ev1[0] <= ev2[1];
    const cond2 = ev2[0] <= ev1[1];
    steps.push({ line: 5,
      explanation: `Condition 1: s1(${ev1[0]}) <= e2(${ev2[1]})? ${cond1}.`,
      variables: { cond1 },
      visualization: makeViz({ 0: cond1 ? 'comparing' : 'mismatch', 3: cond1 ? 'comparing' : 'mismatch' },
        { 0: `s1`, 3: `e2` }, [{ key: 's1 <= e2', value: String(cond1) }]) });

    steps.push({ line: 5,
      explanation: `Condition 2: s2(${ev2[0]}) <= e1(${ev1[1]})? ${cond2}.`,
      variables: { cond2 },
      visualization: makeViz({ 2: cond2 ? 'comparing' : 'mismatch', 1: cond2 ? 'comparing' : 'mismatch' },
        { 2: `s2`, 1: `e1` }, [{ key: 's2 <= e1', value: String(cond2) }]) });

    const conflict = cond1 && cond2;
    const finalHl: Record<number, string> = {};
    for (let j = 0; j < 4; j++) finalHl[j] = conflict ? 'mismatch' : 'found';
    steps.push({ line: 6,
      explanation: `Conflict: ${cond1} AND ${cond2} = ${conflict}. Events ${conflict ? 'DO' : 'do NOT'} conflict.`,
      variables: { conflict },
      visualization: makeViz(finalHl, {}, [{ key: 'Conflict', value: String(conflict) }]) });

    return steps;
  },
};

export default determineIfTwoEventsHaveConflict;
