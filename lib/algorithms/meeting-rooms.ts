import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRooms: AlgorithmDefinition = {
  id: 'meeting-rooms',
  title: 'Meeting Rooms',
  leetcodeNumber: 252,
  difficulty: 'Easy',
  category: 'Interval',
  description:
    'Given an array of meeting time intervals, determine if a person can attend all meetings. Sort by start time, then check if any meeting starts before the previous one ends. If any overlap exists, return false.',
  tags: ['Intervals', 'Sorting'],
  code: {
    pseudocode: `function canAttendMeetings(intervals):
  sort intervals by start time
  for i from 1 to n-1:
    if intervals[i].start < intervals[i-1].end:
      return false   // overlap found
  return true`,
    python: `def canAttendMeetings(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True`,
    javascript: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    java: `public boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    }
    return true;
}`,
  },
  defaultInput: {
    intervals: [[0, 30], [5, 10], [15, 20]],
  },
  inputFields: [
    {
      name: 'intervals',
      label: 'Meeting Intervals',
      type: 'array',
      defaultValue: [[0, 30], [5, 10], [15, 20]],
      placeholder: '[[0,30],[5,10],[15,20]]',
      helperText: 'Array of [start, end] meeting times',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawIntervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals = rawIntervals.map(iv => [iv[0], iv[1]]).sort((a, b) => a[0] - b[0]);
    const flat = intervals.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: { label: 'Meeting Check', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Sort meetings by start time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Now check consecutive pairs for overlap.`,
      variables: { intervals },
      visualization: makeViz({}, {}, [{ key: 'canAttend', value: 'checking...' }]),
    });

    let canAttend = true;
    let conflictPair = '';

    for (let i = 1; i < intervals.length; i++) {
      const prev = intervals[i - 1];
      const curr = intervals[i];
      const pi = (i - 1) * 2;
      const ci = i * 2;
      const overlaps = curr[0] < prev[1];

      const hl: Record<number, string> = {
        [pi]: overlaps ? 'swapping' : 'comparing',
        [pi + 1]: overlaps ? 'swapping' : 'comparing',
        [ci]: overlaps ? 'swapping' : 'comparing',
        [ci + 1]: overlaps ? 'swapping' : 'comparing',
      };
      // Mark already-checked as visited
      for (let j = 0; j < i - 1; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      if (overlaps) {
        canAttend = false;
        conflictPair = `[${prev[0]},${prev[1]}] and [${curr[0]},${curr[1]}]`;
        steps.push({
          line: 4,
          explanation: `Overlap! Meeting [${curr[0]}, ${curr[1]}] starts at ${curr[0]} before previous ends at ${prev[1]}. Cannot attend all meetings.`,
          variables: { prev, curr, overlap: true },
          visualization: makeViz(hl, {
            [pi]: `end=${prev[1]}`,
            [ci]: `start=${curr[0]}`,
          }, [
            { key: 'canAttend', value: 'false' },
            { key: 'conflict', value: `${curr[0]} < ${prev[1]}` },
          ]),
        });
        break;
      } else {
        steps.push({
          line: 3,
          explanation: `No overlap: meeting [${curr[0]}, ${curr[1]}] starts at ${curr[0]} >= ${prev[1]} (previous end). OK.`,
          variables: { prev, curr, overlap: false },
          visualization: makeViz(hl, {
            [pi + 1]: `end=${prev[1]}`,
            [ci]: `start=${curr[0]}`,
          }, [
            { key: 'canAttend', value: 'still true' },
            { key: 'gap', value: `${curr[0]} >= ${prev[1]}` },
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = canAttend ? 'found' : 'mismatch';

    steps.push({
      line: 6,
      explanation: canAttend
        ? `Done! No overlaps found. The person CAN attend all ${intervals.length} meetings. Return true.`
        : `Done! Found conflict: ${conflictPair}. Cannot attend all meetings. Return false.`,
      variables: { result: canAttend },
      visualization: makeViz(finalHl, {}, [
        { key: 'Result', value: canAttend ? 'true (can attend all)' : 'false (has conflict)' },
        ...(conflictPair ? [{ key: 'Conflict', value: conflictPair }] : []),
      ]),
    });

    return steps;
  },
};

export default meetingRooms;
