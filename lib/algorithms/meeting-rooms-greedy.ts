import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRoomsGreedy: AlgorithmDefinition = {
  id: 'meeting-rooms-greedy',
  title: 'Meeting Rooms (Can Attend All)',
  leetcodeNumber: 252,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'Given an array of meeting time intervals where intervals[i] = [start, end], determine if a person can attend all meetings. Sort by start time and check if any meeting starts before the previous one ends.',
  tags: ['greedy', 'sorting', 'intervals'],

  code: {
    pseudocode: `function canAttendMeetings(intervals):
  sort intervals by start time
  for i from 1 to n-1:
    if intervals[i][0] < intervals[i-1][1]:
      return false
  return true`,

    python: `def canAttendMeetings(intervals: list[list[int]]) -> bool:
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
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
    const intervalsRaw = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals = [...intervalsRaw].sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `Sort meetings by start time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: intervals.map(iv => `[${iv}]`) },
      visualization: {
        type: 'array',
        array: intervals.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(intervals.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])) as Record<number, string>,
      },
    });

    for (let i = 1; i < intervals.length; i++) {
      const [curStart] = intervals[i];
      const [, prevEnd] = intervals[i - 1];

      if (curStart < prevEnd) {
        steps.push({
          line: 3,
          explanation: `Meeting ${i} starts at ${curStart} but meeting ${i - 1} ends at ${prevEnd}. Overlap detected! Cannot attend all meetings.`,
          variables: { i, curStart, prevEnd, overlap: true },
          visualization: {
            type: 'array',
            array: intervals.map(iv => iv[0]),
            highlights: { [i - 1]: 'active', [i]: 'mismatch' } as Record<number, string>,
            labels: { [i - 1]: `end=${prevEnd}`, [i]: `start=${curStart}` } as Record<number, string>,
          },
        });
        steps.push({
          line: 4,
          explanation: `Return false: overlapping meetings exist.`,
          variables: { result: false },
          visualization: {
            type: 'array',
            array: intervals.map(iv => iv[0]),
            highlights: Object.fromEntries(intervals.map((_, j) => [j, 'mismatch'])) as Record<number, string>,
            labels: {},
          },
        });
        return steps;
      }

      steps.push({
        line: 3,
        explanation: `Meeting ${i} starts at ${curStart} >= meeting ${i - 1} end at ${prevEnd}. No overlap here.`,
        variables: { i, curStart, prevEnd },
        visualization: {
          type: 'array',
          array: intervals.map(iv => iv[0]),
          highlights: { [i - 1]: 'comparing', [i]: 'active' } as Record<number, string>,
          labels: { [i - 1]: `end=${prevEnd}`, [i]: `start=${curStart}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `No overlapping meetings found. Can attend all meetings. Return true.`,
      variables: { result: true },
      visualization: {
        type: 'array',
        array: intervals.map(iv => iv[0]),
        highlights: Object.fromEntries(intervals.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default meetingRoomsGreedy;
