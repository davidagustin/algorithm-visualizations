import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const myCalendarI: AlgorithmDefinition = {
  id: 'my-calendar-i',
  title: 'My Calendar I',
  leetcodeNumber: 729,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Implement a calendar that allows booking events without double-booking. A booking [start,end) can be added if no existing booking overlaps. Two events overlap when one starts before the other ends. Uses a sorted list approach to check each new booking against all existing bookings.',
  tags: ['interval', 'sorted list', 'binary search'],

  code: {
    pseudocode: `class MyCalendar:
  calendar = []
  function book(start, end):
    for [s, e] in calendar:
      if start < e and end > s:
        return false
    calendar.append([start, end])
    return true`,

    python: `class MyCalendar:
    def __init__(self):
        self.calendar = []

    def book(self, start: int, end: int) -> bool:
        for s, e in self.calendar:
            if start < e and end > s:
                return False
        self.calendar.append((start, end))
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
      label: 'Bookings to attempt (JSON)',
      type: 'string',
      defaultValue: '[[10,20],[15,25],[20,30]]',
      placeholder: '[[10,20],[15,25],[20,30]]',
      helperText: 'JSON array of [start, end] booking requests',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bookings = (typeof input.bookings === 'string'
      ? JSON.parse(input.bookings)
      : input.bookings) as number[][];
    const steps: AlgorithmStep[] = [];
    const calendar: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Initialize empty calendar. Will attempt ${bookings.length} bookings: ${JSON.stringify(bookings)}.`,
      variables: { calendar: '[]' },
      visualization: {
        type: 'array',
        array: [0],
        highlights: {},
        labels: { 0: 'empty calendar' },
      },
    });

    for (let b = 0; b < bookings.length; b++) {
      const [start, end] = bookings[b];
      let conflict = false;

      steps.push({
        line: 3,
        explanation: `Attempt to book [${start},${end}). Check against ${calendar.length} existing booking(s).`,
        variables: { start, end, calendarSize: calendar.length },
        visualization: {
          type: 'array',
          array: calendar.length > 0 ? calendar.map(iv => iv[0]) : [start],
          highlights: {},
          labels: Object.fromEntries(calendar.map((iv, i) => [i, `[${iv[0]},${iv[1]})`])),
        },
      });

      for (let i = 0; i < calendar.length; i++) {
        const [s, e] = calendar[i];
        const overlaps = start < e && end > s;

        steps.push({
          line: 4,
          explanation: `Compare new [${start},${end}) with existing [${s},${e}). Overlap condition: ${start}<${e} AND ${end}>${s} => ${overlaps}.`,
          variables: { newStart: start, newEnd: end, existStart: s, existEnd: e, overlaps },
          visualization: {
            type: 'array',
            array: calendar.map(iv => iv[0]),
            highlights: { [i]: overlaps ? 'mismatch' : 'found' },
            labels: Object.fromEntries(calendar.map((iv, j) => [j, j === i ? 'checking' : `[${iv[0]},${iv[1]})`])),
          },
        });

        if (overlaps) {
          conflict = true;
          break;
        }
      }

      if (conflict) {
        steps.push({
          line: 5,
          explanation: `Booking [${start},${end}) REJECTED. Conflict found with existing booking.`,
          variables: { booked: false, calendar: JSON.stringify(calendar) },
          visualization: {
            type: 'array',
            array: calendar.map(iv => iv[0]),
            highlights: {},
            labels: { 0: `REJECTED [${start},${end})` },
          },
        });
      } else {
        calendar.push([start, end]);
        steps.push({
          line: 6,
          explanation: `Booking [${start},${end}) ACCEPTED. No conflicts. Calendar now has ${calendar.length} booking(s).`,
          variables: { booked: true, calendar: JSON.stringify(calendar) },
          visualization: {
            type: 'array',
            array: calendar.map(iv => iv[0]),
            highlights: { [calendar.length - 1]: 'found' },
            labels: Object.fromEntries(calendar.map((iv, i) => [i, `[${iv[0]},${iv[1]})`])),
          },
        });
      }
    }

    return steps;
  },
};

export default myCalendarI;
