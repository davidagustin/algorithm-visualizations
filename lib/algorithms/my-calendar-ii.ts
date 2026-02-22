import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const myCalendarIi: AlgorithmDefinition = {
  id: 'my-calendar-ii',
  title: 'My Calendar II',
  leetcodeNumber: 731,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Implement a calendar that allows booking events, with at most double booking. A booking can be added if it does not cause a triple booking. Maintains two lists: all bookings and already-overlapped (double-booked) regions. A new booking is rejected only if it overlaps a double-booked region.',
  tags: ['interval', 'sorted list', 'greedy'],

  code: {
    pseudocode: `class MyCalendarTwo:
  calendar = [], overlaps = []
  function book(start, end):
    for [s, e] in overlaps:
      if start < e and end > s:
        return false
    for [s, e] in calendar:
      if start < e and end > s:
        overlaps.add([max(start,s), min(end,e)])
    calendar.add([start, end])
    return true`,

    python: `class MyCalendarTwo:
    def __init__(self):
        self.calendar = []
        self.overlaps = []

    def book(self, start: int, end: int) -> bool:
        for s, e in self.overlaps:
            if start < e and end > s:
                return False
        for s, e in self.calendar:
            if start < e and end > s:
                self.overlaps.append((max(start, s), min(end, e)))
        self.calendar.append((start, end))
        return True`,

    javascript: `class MyCalendarTwo {
  constructor() { this.calendar = []; this.overlaps = []; }
  book(start, end) {
    for (const [s, e] of this.overlaps) {
      if (start < e && end > s) return false;
    }
    for (const [s, e] of this.calendar) {
      if (start < e && end > s) {
        this.overlaps.push([Math.max(start,s), Math.min(end,e)]);
      }
    }
    this.calendar.push([start, end]);
    return true;
  }
}`,

    java: `class MyCalendarTwo {
    List<int[]> calendar = new ArrayList<>(), overlaps = new ArrayList<>();
    public boolean book(int start, int end) {
        for (int[] iv : overlaps)
            if (start < iv[1] && end > iv[0]) return false;
        for (int[] iv : calendar)
            if (start < iv[1] && end > iv[0])
                overlaps.add(new int[]{Math.max(start,iv[0]), Math.min(end,iv[1])});
        calendar.add(new int[]{start, end});
        return true;
    }
}`,
  },

  defaultInput: {
    bookings: [[10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]],
  },

  inputFields: [
    {
      name: 'bookings',
      label: 'Bookings to attempt (JSON)',
      type: 'string',
      defaultValue: '[[10,20],[50,60],[10,40],[5,15],[5,10],[25,55]]',
      placeholder: '[[10,20],[50,60],[10,40]]',
      helperText: 'JSON array of [start, end] booking requests',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bookings = (typeof input.bookings === 'string'
      ? JSON.parse(input.bookings)
      : input.bookings) as number[][];
    const steps: AlgorithmStep[] = [];
    const calendar: number[][] = [];
    const overlaps: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Initialize calendar and overlaps lists. Will process ${bookings.length} booking requests.`,
      variables: { calendar: '[]', overlaps: '[]' },
      visualization: {
        type: 'array',
        array: [0],
        highlights: {},
        labels: { 0: 'start' },
      },
    });

    for (let b = 0; b < bookings.length; b++) {
      const [start, end] = bookings[b];
      let tripleConflict = false;

      steps.push({
        line: 3,
        explanation: `Booking request [${start},${end}). First check against ${overlaps.length} double-booked region(s).`,
        variables: { start, end, overlaps: JSON.stringify(overlaps) },
        visualization: {
          type: 'array',
          array: overlaps.length > 0 ? overlaps.map(iv => iv[0]) : [start],
          highlights: {},
          labels: overlaps.length > 0
            ? Object.fromEntries(overlaps.map((iv, i) => [i, `overlap[${iv[0]},${iv[1]})`]))
            : { 0: 'no overlaps yet' },
        },
      });

      for (let i = 0; i < overlaps.length; i++) {
        const [s, e] = overlaps[i];
        if (start < e && end > s) {
          tripleConflict = true;
          steps.push({
            line: 4,
            explanation: `Triple booking! [${start},${end}) overlaps existing double-booked region [${s},${e}). Reject.`,
            variables: { conflict: 'triple booking' },
            visualization: {
              type: 'array',
              array: overlaps.map(iv => iv[0]),
              highlights: { [i]: 'mismatch' },
              labels: Object.fromEntries(overlaps.map((iv, j) => [j, j === i ? 'TRIPLE!' : `[${iv[0]},${iv[1]})`])),
            },
          });
          break;
        }
      }

      if (tripleConflict) {
        steps.push({
          line: 5,
          explanation: `Booking [${start},${end}) REJECTED to avoid triple booking.`,
          variables: { result: false },
          visualization: {
            type: 'array',
            array: calendar.map(iv => iv[0]),
            highlights: {},
            labels: { 0: `REJECTED [${start},${end})` },
          },
        });
        continue;
      }

      for (let i = 0; i < calendar.length; i++) {
        const [s, e] = calendar[i];
        if (start < e && end > s) {
          const overlapStart = Math.max(start, s);
          const overlapEnd = Math.min(end, e);
          overlaps.push([overlapStart, overlapEnd]);
          steps.push({
            line: 7,
            explanation: `New double-booked region [${overlapStart},${overlapEnd}) created from [${start},${end}) and [${s},${e}).`,
            variables: { newOverlap: `[${overlapStart},${overlapEnd})` },
            visualization: {
              type: 'array',
              array: overlaps.map(iv => iv[0]),
              highlights: { [overlaps.length - 1]: 'comparing' },
              labels: Object.fromEntries(overlaps.map((iv, i) => [i, `[${iv[0]},${iv[1]})`])),
            },
          });
        }
      }

      calendar.push([start, end]);
      steps.push({
        line: 8,
        explanation: `Booking [${start},${end}) ACCEPTED. Calendar: ${JSON.stringify(calendar)}.`,
        variables: { result: true, calendarSize: calendar.length },
        visualization: {
          type: 'array',
          array: calendar.map(iv => iv[0]),
          highlights: { [calendar.length - 1]: 'found' },
          labels: Object.fromEntries(calendar.map((iv, i) => [i, `[${iv[0]},${iv[1]})`])),
        },
      });
    }

    return steps;
  },
};

export default myCalendarIi;
