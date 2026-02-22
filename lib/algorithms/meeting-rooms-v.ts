import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRoomsV: AlgorithmDefinition = {
  id: 'meeting-rooms-v',
  title: 'Meeting Rooms V (Conference Allocation)',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Conference room allocation: given meetings and k rooms, determine the maximum number of meetings that can be scheduled without overlap, and which meetings get assigned to which room. Sort by duration then start time; greedily assign each meeting to the earliest-free room. O(n log n + n·k) time.',
  tags: ['Intervals', 'Greedy', 'Heap', 'Sorting'],
  code: {
    pseudocode: `function allocateRooms(intervals, k):
  sort intervals by (end-start), then start
  rooms = array of k end-times, init to 0
  assigned = []
  for [start, end] in intervals:
    roomIdx = index of min end-time in rooms
    if rooms[roomIdx] <= start:
      rooms[roomIdx] = end
      assigned.push([meeting, roomIdx])
  return assigned`,
    python: `def allocateRooms(intervals, k):
    intervals = sorted(enumerate(intervals), key=lambda x: (x[1][1]-x[1][0], x[1][0]))
    rooms = [0] * k
    assigned = []
    for idx, (s, e) in intervals:
        room = rooms.index(min(rooms))
        if rooms[room] <= s:
            rooms[room] = e
            assigned.append((idx, room))
    return assigned`,
    javascript: `function allocateRooms(intervals, k) {
  const indexed = intervals.map((iv, i) => [i, iv]);
  indexed.sort((a, b) => (a[1][1]-a[1][0]) - (b[1][1]-b[1][0]) || a[1][0]-b[1][0]);
  const rooms = new Array(k).fill(0);
  const assigned = [];
  for (const [idx, [s, e]] of indexed) {
    const room = rooms.indexOf(Math.min(...rooms));
    if (rooms[room] <= s) {
      rooms[room] = e;
      assigned.push([idx, room]);
    }
  }
  return assigned;
}`,
    java: `public List<int[]> allocateRooms(int[][] intervals, int k) {
    int n = intervals.length;
    Integer[] order = new Integer[n];
    for (int i = 0; i < n; i++) order[i] = i;
    Arrays.sort(order, (a,b) -> intervals[a][1]-intervals[a][0] != intervals[b][1]-intervals[b][0]
        ? (intervals[a][1]-intervals[a][0]) - (intervals[b][1]-intervals[b][0])
        : intervals[a][0] - intervals[b][0]);
    int[] rooms = new int[k];
    List<int[]> res = new ArrayList<>();
    for (int idx : order) {
        int room = 0;
        for (int r = 1; r < k; r++) if (rooms[r] < rooms[room]) room = r;
        if (rooms[room] <= intervals[idx][0]) {
            rooms[room] = intervals[idx][1];
            res.add(new int[]{idx, room});
        }
    }
    return res;
}`,
  },
  defaultInput: {
    intervals: [[0, 10], [1, 5], [5, 8], [6, 12], [3, 7]],
    k: 2,
  },
  inputFields: [
    {
      name: 'intervals',
      label: 'Meeting Intervals',
      type: 'array',
      defaultValue: [[0, 10], [1, 5], [5, 8], [6, 12], [3, 7]],
      placeholder: '[[0,10],[1,5],[5,8],[6,12],[3,7]]',
      helperText: 'Array of [start, end] meeting times',
    },
    {
      name: 'k',
      label: 'Number of Rooms (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Available conference rooms',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    const k = Number(input.k) || 2;
    const flat = raw.flat();
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
      ...(auxEntries ? { auxData: { label: 'Room Assignments', entries: auxEntries } } : {}),
    });

    const indexed = raw.map((iv, i) => ({ idx: i, s: iv[0], e: iv[1] }));
    indexed.sort((a, b) => (a.e - a.s) - (b.e - b.s) || a.s - b.s);

    steps.push({
      line: 2,
      explanation: `Sort by duration then start. Order: [${indexed.map(m => `m${m.idx}`).join(', ')}]. k=${k} rooms.`,
      variables: { k, order: indexed.map(m => m.idx) },
      visualization: makeViz({}, {}),
    });

    const rooms = new Array(k).fill(0);
    const assigned: { meetIdx: number; room: number }[] = [];

    for (const { idx, s, e } of indexed) {
      const room = rooms.indexOf(Math.min(...rooms));
      const ci = idx * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };

      steps.push({
        line: 5,
        explanation: `Meeting m${idx} [${s},${e}]: earliest free room r${room} (ends at ${rooms[room]}). Free? ${rooms[room] <= s}.`,
        variables: { meeting: idx, start: s, end: e, room, roomEnds: rooms[room] },
        visualization: makeViz(hl, { [ci]: `s${idx}`, [ci + 1]: `e${idx}` },
          rooms.map((r, ri) => ({ key: `r${ri}`, value: `ends@${r}` }))),
      });

      if (rooms[room] <= s) {
        rooms[room] = e;
        assigned.push({ meetIdx: idx, room });
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({
          line: 7,
          explanation: `Assign meeting m${idx} to room ${room}. Room ${room} now busy until ${e}.`,
          variables: { assigned: assigned.map(a => `m${a.meetIdx}->r${a.room}`) },
          visualization: makeViz(hl, {},
            rooms.map((r, ri) => ({ key: `r${ri}`, value: `ends@${r}` }))),
        });
      } else {
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({
          line: 6,
          explanation: `No free room for m${idx} [${s},${e}]. Earliest room ends at ${rooms[room]} > ${s}. Skip.`,
          variables: { skipped: idx },
          visualization: makeViz(hl, {},
            rooms.map((r, ri) => ({ key: `r${ri}`, value: `ends@${r}` }))),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (const { meetIdx } of assigned) { finalHl[meetIdx * 2] = 'found'; finalHl[meetIdx * 2 + 1] = 'found'; }
    steps.push({
      line: 9,
      explanation: `Done. Scheduled ${assigned.length}/${raw.length} meetings: [${assigned.map(a => `m${a.meetIdx}->r${a.room}`).join(', ')}].`,
      variables: { assigned: assigned.map(a => `m${a.meetIdx}->r${a.room}`) },
      visualization: makeViz(finalHl, {},
        assigned.map(a => ({ key: `m${a.meetIdx}`, value: `room ${a.room}` }))),
    });

    return steps;
  },
};

export default meetingRoomsV;
