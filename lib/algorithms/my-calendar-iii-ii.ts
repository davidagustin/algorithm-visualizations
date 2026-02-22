import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const myCalendarIIIII: AlgorithmDefinition = {
  id: 'my-calendar-iii-ii',
  title: 'My Calendar III II',
  leetcodeNumber: 732,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Return the max k-booking count after each event is booked. Use a difference array / event counting approach: increment at start, decrement at end, track running maximum over all intervals. O(n^2) per booking with sorted events. Returns the maximum simultaneous bookings.',
  tags: ['Intervals', 'Design', 'Difference Array', 'Segment Tree'],
  code: {
    pseudocode: `class MyCalendarThree:
  events = sorted map
  def book(start, end):
    events[start] += 1
    events[end]   -= 1
    cur = max = 0
    for delta in events.values():
      cur += delta
      max = max(max, cur)
    return max`,
    python: `from sortedcontainers import SortedDict
class MyCalendarThree:
    def __init__(self):
        self.events = SortedDict()
    def book(self, start, end):
        self.events[start] = self.events.get(start, 0) + 1
        self.events[end]   = self.events.get(end, 0) - 1
        cur = res = 0
        for delta in self.events.values():
            cur += delta
            res = max(res, cur)
        return res`,
    javascript: `class MyCalendarThree {
  constructor() { this.events = new Map(); }
  book(start, end) {
    this.events.set(start, (this.events.get(start) || 0) + 1);
    this.events.set(end,   (this.events.get(end)   || 0) - 1);
    const keys = [...this.events.keys()].sort((a, b) => a - b);
    let cur = 0, max = 0;
    for (const k of keys) {
      cur += this.events.get(k);
      max = Math.max(max, cur);
    }
    return max;
  }
}`,
    java: `class MyCalendarThree {
    TreeMap<Integer, Integer> events = new TreeMap<>();
    public int book(int start, int end) {
        events.merge(start,  1, Integer::sum);
        events.merge(end,   -1, Integer::sum);
        int cur = 0, max = 0;
        for (int delta : events.values()) {
            cur += delta;
            max = Math.max(max, cur);
        }
        return max;
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
    const events = new Map<number, number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'k-booking', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1, explanation: `Initialize empty difference array map.`, variables: {},
      visualization: makeViz({}, {}) });

    for (let i = 0; i < bookings.length; i++) {
      const [s, e] = bookings[i];
      const ci = i * 2;
      events.set(s, (events.get(s) ?? 0) + 1);
      events.set(e, (events.get(e) ?? 0) - 1);

      const keys = [...events.keys()].sort((a, b) => a - b);
      let cur = 0, maxK = 0;
      const sweep: { key: string; value: string }[] = [];
      for (const k of keys) {
        cur += events.get(k)!;
        maxK = Math.max(maxK, cur);
        sweep.push({ key: `@${k}`, value: `Δ${events.get(k)! > 0 ? '+' : ''}${events.get(k)}, cur=${cur}` });
      }

      const hl: Record<number, string> = { [ci]: 'found', [ci + 1]: 'found' };
      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      steps.push({ line: 7,
        explanation: `Book [${s},${e}). Sweep difference array. Max k-booking = ${maxK}.`,
        variables: { booking: i + 1, maxK },
        visualization: makeViz(hl, { [ci]: `+1@${s}`, [ci + 1]: `-1@${e}` },
          [...sweep, { key: 'Max k', value: String(maxK) }]) });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 8, explanation: `All bookings processed.`,
      variables: { totalBookings: bookings.length },
      visualization: makeViz(finalHl, {}) });

    return steps;
  },
};

export default myCalendarIIIII;
