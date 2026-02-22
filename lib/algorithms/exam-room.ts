import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const examRoom: AlgorithmDefinition = {
  id: 'exam-room',
  title: 'Exam Room',
  leetcodeNumber: 855,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Students take a seat to maximize the distance to the nearest person. seat() returns the seat that maximizes min distance. leave(p) makes seat p available. Use a sorted set of occupied seats to efficiently find the best seat.',
  tags: ['Hash Map', 'Design', 'Sorted Set', 'Ordered Set'],
  code: {
    pseudocode: `class ExamRoom:
  function init(n):
    this.n = n
    this.seated = sorted set
  function seat():
    if empty: return 0
    // find max gap starting from 0 or between consecutive pairs or end
    best = seat with max min-distance
    seated.add(best); return best
  function leave(p):
    seated.remove(p)`,
    python: `import sortedcontainers

class ExamRoom:
    def __init__(self, n: int):
        self.n = n
        self.seats = sortedcontainers.SortedList()

    def seat(self) -> int:
        if not self.seats:
            self.seats.add(0); return 0
        # Check start
        best = self.seats[0]
        best_dist = best
        # Check gaps between consecutive seats
        for i in range(1, len(self.seats)):
            d = (self.seats[i] - self.seats[i-1]) // 2
            s = self.seats[i-1] + d
            if d > best_dist: best_dist = d; best = s
        # Check end
        if self.n - 1 - self.seats[-1] > best_dist:
            best = self.n - 1
        self.seats.add(best); return best

    def leave(self, p: int) -> None:
        self.seats.remove(p)`,
    javascript: `class ExamRoom {
  constructor(n) { this.n = n; this.seats = []; }
  seat() {
    if (!this.seats.length) { this.seats.push(0); return 0; }
    let best = 0, bestDist = this.seats[0];
    for (let i = 1; i < this.seats.length; i++) {
      const d = (this.seats[i] - this.seats[i-1]) >> 1;
      if (d > bestDist) { bestDist = d; best = this.seats[i-1] + d; }
    }
    if (this.n - 1 - this.seats[this.seats.length-1] > bestDist)
      best = this.n - 1;
    const pos = this.seats.findIndex(s => s > best);
    this.seats.splice(pos === -1 ? this.seats.length : pos, 0, best);
    return best;
  }
  leave(p) { this.seats.splice(this.seats.indexOf(p), 1); }
}`,
    java: `class ExamRoom {
    private TreeSet<Integer> seats;
    private int n;
    public ExamRoom(int n) { this.n = n; seats = new TreeSet<>(); }
    public int seat() {
        if (seats.isEmpty()) { seats.add(0); return 0; }
        int best = 0, bestDist = seats.first();
        Integer prev = seats.first();
        for (int s : seats) {
            if (s != prev) { int d = (s - prev) / 2; if (d > bestDist) { bestDist = d; best = prev + d; } prev = s; }
        }
        if (n - 1 - seats.last() > bestDist) best = n - 1;
        seats.add(best); return best;
    }
    public void leave(int p) { seats.remove(p); }
}`,
  },
  defaultInput: {
    n: 10,
    operations: [['seat'], ['seat'], ['seat'], ['seat'], ['leave', 4], ['seat']],
  },
  inputFields: [
    { name: 'n', label: 'Room Size (n seats, 0..n-1)', type: 'number', defaultValue: 10 },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'seat, seat, seat, seat, leave 4, seat',
      placeholder: 'seat, leave 4, seat',
      helperText: 'Comma-separated: "seat", "leave p"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = (input.n as number) || 10;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return parts.length > 1 ? [parts[0], Number(parts[1])] : [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    let seated: number[] = [];

    const findBestSeat = (): number => {
      if (seated.length === 0) return 0;
      let best = 0, bestDist = seated[0];
      for (let i = 1; i < seated.length; i++) {
        const d = Math.floor((seated[i] - seated[i - 1]) / 2);
        if (d > bestDist) { bestDist = d; best = seated[i - 1] + d; }
      }
      if (n - 1 - seated[seated.length - 1] > bestDist) best = n - 1;
      return best;
    };

    function makeViz(activeSeat: number, label: string): ArrayVisualization {
      const arr = Array.from({ length: Math.min(n, 20) }, (_, i) => i);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      arr.forEach((s, i) => {
        highlights[i] = s === activeSeat ? 'active' : seated.includes(s) ? 'found' : 'default';
        lbls[i] = seated.includes(s) ? 'X' : '';
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Exam Room',
          entries: [
            { key: 'Action', value: label },
            { key: 'Room size', value: `${n}` },
            { key: 'Occupied', value: seated.join(', ') || 'none' },
            { key: 'Available', value: `${n - seated.length}` },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize ExamRoom with ${n} seats (0 to ${n - 1}).`, variables: { n }, visualization: makeViz(-1, 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'seat') {
        const seat = findBestSeat();
        const idx = seated.findIndex(s => s > seat);
        seated.splice(idx === -1 ? seated.length : idx, 0, seat);
        steps.push({ line: 4, explanation: `seat(): Student sits at seat ${seat} (maximizes min distance). Occupied: [${seated.join(', ')}].`, variables: { seat, occupied: [...seated] }, visualization: makeViz(seat, `seat() -> ${seat}`) });
      } else if (opType === 'leave') {
        const p = Number(op[1]);
        seated = seated.filter(s => s !== p);
        steps.push({ line: 10, explanation: `leave(${p}): Seat ${p} is now available. Occupied: [${seated.join(', ')}].`, variables: { p, occupied: [...seated] }, visualization: makeViz(p, `leave(${p})`) });
      }
    }

    steps.push({ line: 11, explanation: `All operations complete. Occupied seats: [${seated.join(', ')}].`, variables: { occupied: [...seated] }, visualization: makeViz(-1, 'Complete') });

    return steps;
  },
};

export default examRoom;
