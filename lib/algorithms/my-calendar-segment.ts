import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const myCalendarSegment: AlgorithmDefinition = {
  id: 'my-calendar-segment',
  title: 'My Calendar I (Segment Tree)',
  leetcodeNumber: 729,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Implement a calendar that allows booking events [start, end) such that no two events overlap. Use a sorted interval list or segment tree. Return true if booking succeeds (no double booking), false otherwise.',
  tags: ['Segment Tree', 'Binary Search', 'Design', 'Ordered Set'],
  code: {
    pseudocode: `class MyCalendar:
  bookings = sorted list of [start, end)

  book(start, end):
    use binary search to find insertion point
    check if new event overlaps with neighbors:
      overlap if prev.end > start or next.start < end
    if no overlap: insert and return true
    else: return false`,
    python: `class MyCalendar:
    def __init__(self):
        self.bookings = []

    def book(self, start, end):
        import bisect
        # find where start fits among existing start times
        lo, hi = 0, len(self.bookings)
        while lo < hi:
            mid = (lo+hi)//2
            if self.bookings[mid][0] < start: lo = mid+1
            else: hi = mid
        # check overlap with previous
        if lo > 0 and self.bookings[lo-1][1] > start:
            return False
        # check overlap with next
        if lo < len(self.bookings) and self.bookings[lo][0] < end:
            return False
        self.bookings.insert(lo, [start, end])
        return True`,
    javascript: `class MyCalendar {
  constructor() { this.bookings = []; }
  book(start, end) {
    let lo = 0, hi = this.bookings.length;
    while (lo < hi) {
      const mid = (lo+hi)>>1;
      if (this.bookings[mid][0] < start) lo = mid+1; else hi = mid;
    }
    if (lo > 0 && this.bookings[lo-1][1] > start) return false;
    if (lo < this.bookings.length && this.bookings[lo][0] < end) return false;
    this.bookings.splice(lo, 0, [start, end]);
    return true;
  }
}`,
    java: `class MyCalendar {
    TreeMap<Integer,Integer> map = new TreeMap<>();
    public boolean book(int start, int end) {
        Integer prev = map.floorKey(start);
        Integer next = map.ceilingKey(start);
        if (prev != null && map.get(prev) > start) return false;
        if (next != null && next < end) return false;
        map.put(start, end);
        return true;
    }
}`,
  },
  defaultInput: { events: [[10,20],[15,25],[20,30]] },
  inputFields: [
    { name: 'events', label: 'Events [[start,end],...]', type: 'array', defaultValue: [[10,20],[15,25],[20,30]], helperText: 'Booking requests' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const events = input.events as number[][];
    const steps: AlgorithmStep[] = [];
    const bookings: number[][] = [];

    steps.push({
      line: 1,
      explanation: `MyCalendar initialized. Will book events with no overlaps allowed.`,
      variables: { bookings: [] },
      visualization: { type: 'array', array: [0], highlights: {}, labels: { 0: 'empty' } },
    });

    for (const [start, end] of events) {
      let lo = 0, hi = bookings.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (bookings[mid][0] < start) lo = mid + 1; else hi = mid;
      }

      const overlapPrev = lo > 0 && bookings[lo - 1][1] > start;
      const overlapNext = lo < bookings.length && bookings[lo][0] < end;
      const success = !overlapPrev && !overlapNext;

      const flatBookings = bookings.flatMap(([s, e]) => [s, e]);
      const highlights: Record<number, string> = {};
      flatBookings.forEach((_, i) => { highlights[i] = 'visited'; });
      const labels: Record<number, string> = { 0: `book(${start},${end})` };

      if (success) {
        bookings.splice(lo, 0, [start, end]);
        steps.push({
          line: 8,
          explanation: `book(${start}, ${end}): SUCCESS. No overlap found. Inserted at position ${lo}. Total bookings: ${bookings.length}`,
          variables: { start, end, lo, success, bookings: bookings.map(([s,e])=>`[${s},${e})`).join(',') },
          visualization: { type: 'array', array: bookings.flatMap(([s,e])=>[s,e]), highlights: { 0: 'found' }, labels },
        });
      } else {
        const conflictWith = overlapPrev ? bookings[lo-1] : bookings[lo];
        steps.push({
          line: 10,
          explanation: `book(${start}, ${end}): FAILED. Overlaps with [${conflictWith[0]},${conflictWith[1]}). Return false.`,
          variables: { start, end, overlapPrev, overlapNext, conflictWith },
          visualization: { type: 'array', array: flatBookings.length ? flatBookings : [0], highlights: { 0: 'mismatch' }, labels },
        });
      }
    }

    return steps;
  },
};

export default myCalendarSegment;
