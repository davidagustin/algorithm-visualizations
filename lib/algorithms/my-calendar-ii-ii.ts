import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const myCalendarIIII: AlgorithmDefinition = {
  id: 'my-calendar-ii-ii',
  title: 'My Calendar II II',
  leetcodeNumber: 731,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Design a calendar allowing double booking but not triple booking. Maintain a list of single bookings and double bookings. For a new event, if it overlaps any double booking → reject. Otherwise add overlaps with single bookings to double bookings list, then add to single bookings. O(n) per booking.',
  tags: ['Intervals', 'Design'],
  code: {
    pseudocode: `class MyCalendarTwo:
  singles = [], doubles = []
  def book(start, end):
    for [s, e] in doubles:
      if start < e and end > s: return false
    for [s, e] in singles:
      if start < e and end > s:
        doubles.push([max(start,s), min(end,e)])
    singles.push([start, end])
    return true`,
    python: `class MyCalendarTwo:
    def __init__(self):
        self.singles, self.doubles = [], []
    def book(self, start, end):
        for s, e in self.doubles:
            if start < e and end > s: return False
        for s, e in self.singles:
            if start < e and end > s:
                self.doubles.append([max(start,s), min(end,e)])
        self.singles.append([start, end])
        return True`,
    javascript: `class MyCalendarTwo {
  constructor() { this.singles = []; this.doubles = []; }
  book(start, end) {
    for (const [s, e] of this.doubles) {
      if (start < e && end > s) return false;
    }
    for (const [s, e] of this.singles) {
      if (start < e && end > s) {
        this.doubles.push([Math.max(start,s), Math.min(end,e)]);
      }
    }
    this.singles.push([start, end]);
    return true;
  }
}`,
    java: `class MyCalendarTwo {
    List<int[]> singles = new ArrayList<>(), doubles = new ArrayList<>();
    public boolean book(int start, int end) {
        for (int[] d : doubles)
            if (start < d[1] && end > d[0]) return false;
        for (int[] s : singles)
            if (start < s[1] && end > s[0])
                doubles.add(new int[]{Math.max(start,s[0]), Math.min(end,s[1])});
        singles.add(new int[]{start, end});
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
      label: 'Booking Requests',
      type: 'array',
      defaultValue: [[10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]],
      placeholder: '[[10,20],[50,60],[10,40]]',
      helperText: 'Array of [start, end) booking requests',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bookings = (input.bookings as number[][]).map(iv => [iv[0], iv[1]]);
    const flat = bookings.flat();
    const steps: AlgorithmStep[] = [];
    const singles: number[][] = [];
    const doubles: number[][] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Bookings', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1, explanation: `Initialize. Singles=[], Doubles=[].`, variables: {},
      visualization: makeViz({}, {}) });

    for (let i = 0; i < bookings.length; i++) {
      const [s, e] = bookings[i];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };

      // Check triple booking
      let tripleConflict = false;
      for (const [ds, de] of doubles) {
        if (s < de && e > ds) { tripleConflict = true; break; }
      }

      steps.push({ line: 4,
        explanation: `Book [${s},${e}): triple conflict? ${tripleConflict}. Doubles=${doubles.length}.`,
        variables: { start: s, end: e, tripleConflict },
        visualization: makeViz(hl, { [ci]: `s=${s}`, [ci + 1]: `e=${e}` },
          [...singles.map((iv, k) => ({ key: `S${k}`, value: `[${iv[0]},${iv[1]})` })),
           ...doubles.map((iv, k) => ({ key: `D${k}`, value: `[${iv[0]},${iv[1]})` }))]) });

      if (tripleConflict) {
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({ line: 5, explanation: `Triple booking! Reject [${s},${e}).`,
          variables: { booked: false },
          visualization: makeViz(hl, {},
            [...singles.map((iv, k) => ({ key: `S${k}`, value: `[${iv[0]},${iv[1]})` })),
             ...doubles.map((iv, k) => ({ key: `D${k}`, value: `[${iv[0]},${iv[1]})` }))]) });
      } else {
        // Add to doubles where overlaps with singles
        const newDoubles: number[][] = [];
        for (const [ss, se] of singles) {
          if (s < se && e > ss) newDoubles.push([Math.max(s, ss), Math.min(e, se)]);
        }
        doubles.push(...newDoubles);
        singles.push([s, e]);
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({ line: 9, explanation: `Booked [${s},${e}). Added ${newDoubles.length} double(s). Singles=${singles.length}, Doubles=${doubles.length}.`,
          variables: { booked: true, newDoubles: newDoubles.map(d => [...d]) },
          visualization: makeViz(hl, {},
            [...singles.map((iv, k) => ({ key: `S${k}`, value: `[${iv[0]},${iv[1]})` })),
             ...doubles.map((iv, k) => ({ key: `D${k}`, value: `[${iv[0]},${iv[1]})` }))]) });
      }
    }

    steps.push({ line: 10, explanation: `Done. Singles=${singles.length}, Doubles=${doubles.length}.`,
      variables: { singles: singles.map(iv => [...iv]), doubles: doubles.map(iv => [...iv]) },
      visualization: makeViz({}, {},
        [...singles.map((iv, k) => ({ key: `S${k}`, value: `[${iv[0]},${iv[1]})` })),
         ...doubles.map((iv, k) => ({ key: `D${k}`, value: `[${iv[0]},${iv[1]})` }))]) });

    return steps;
  },
};

export default myCalendarIIII;
