import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const myCalendarIII: AlgorithmDefinition = {
  id: 'my-calendar-i-ii',
  title: 'My Calendar I II',
  leetcodeNumber: 729,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Design a calendar that prevents double booking. For each new event [start, end), check if it overlaps any booked event (overlap exists when start < booked.end AND end > booked.start). If no overlap, book it. O(n) per booking, O(n) space.',
  tags: ['Intervals', 'Design', 'Sorted List'],
  code: {
    pseudocode: `class MyCalendar:
  calendar = []
  def book(start, end):
    for [s, e] in calendar:
      if start < e and end > s:
        return false  // overlap
    calendar.push([start, end])
    return true`,
    python: `class MyCalendar:
    def __init__(self):
        self.calendar = []
    def book(self, start, end):
        for s, e in self.calendar:
            if start < e and end > s:
                return False
        self.calendar.append([start, end])
        return True`,
    javascript: `class MyCalendar {
  constructor() { this.calendar = []; }
  book(start, end) {
    for (const [s, e] of this.calendar) {
      if (start < e && end > s) return false;
    }
    this.calendar.push([start, end]);
    return true;
  }
}`,
    java: `class MyCalendar {
    List<int[]> calendar = new ArrayList<>();
    public boolean book(int start, int end) {
        for (int[] iv : calendar) {
            if (start < iv[1] && end > iv[0]) return false;
        }
        calendar.add(new int[]{start, end});
        return true;
    }
}`,
  },
  defaultInput: {
    bookings: [[10, 20], [15, 25], [20, 30]],
  },
  inputFields: [
    {
      name: 'bookings',
      label: 'Booking Requests',
      type: 'array',
      defaultValue: [[10, 20], [15, 25], [20, 30]],
      placeholder: '[[10,20],[15,25],[20,30]]',
      helperText: 'Array of [start, end) booking requests',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bookings = (input.bookings as number[][]).map(iv => [iv[0], iv[1]]);
    const flat = bookings.flat();
    const steps: AlgorithmStep[] = [];
    const calendar: number[][] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Calendar', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Initialize empty calendar. Processing ${bookings.length} booking requests.`,
      variables: { calendar: [] },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < bookings.length; i++) {
      const [s, e] = bookings[i];
      const ci = i * 2;
      let overlap = false;
      let conflictIdx = -1;

      for (let j = 0; j < calendar.length; j++) {
        if (s < calendar[j][1] && e > calendar[j][0]) {
          overlap = true;
          conflictIdx = j;
          break;
        }
      }

      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };

      if (overlap && conflictIdx >= 0) {
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({
          line: 5,
          explanation: `Book [${s},${e}): overlaps with booked [${calendar[conflictIdx][0]},${calendar[conflictIdx][1]}). Return false.`,
          variables: { request: [s, e], conflict: [...calendar[conflictIdx]], booked: false },
          visualization: makeViz(hl, { [ci]: `s=${s}`, [ci + 1]: `e=${e}` },
            calendar.map((iv, k) => ({ key: `B[${k}]`, value: `[${iv[0]},${iv[1]})` }))),
        });
      } else {
        calendar.push([s, e]);
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({
          line: 7,
          explanation: `Book [${s},${e}): no overlap. Booked! Calendar size: ${calendar.length}.`,
          variables: { request: [s, e], booked: true, calendarSize: calendar.length },
          visualization: makeViz(hl, { [ci]: `s=${s}`, [ci + 1]: `e=${e}` },
            calendar.map((iv, k) => ({ key: `B[${k}]`, value: `[${iv[0]},${iv[1]})` }))),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'visited';
    steps.push({
      line: 8,
      explanation: `Final calendar: ${calendar.length} booked events.`,
      variables: { calendar: calendar.map(iv => [...iv]) },
      visualization: makeViz(finalHl, {}, calendar.map((iv, k) => ({ key: `B[${k}]`, value: `[${iv[0]},${iv[1]})` }))),
    });

    return steps;
  },
};

export default myCalendarIII;
