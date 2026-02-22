import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRoomsIii: AlgorithmDefinition = {
  id: 'meeting-rooms-iii',
  title: 'Meeting Rooms III',
  leetcodeNumber: 2402,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given n rooms and a list of meetings with start and end times, assign each meeting to the room with the smallest index that is free. If no room is free, delay the meeting until the earliest room becomes available. Return the room that held the most meetings.',
  tags: ['heap', 'greedy', 'sorting', 'simulation'],

  code: {
    pseudocode: `function mostBooked(n, meetings):
  sort meetings by start time
  freeRooms = min heap of room indices [0..n-1]
  busyRooms = min heap of (endTime, roomIndex)
  count = array of n zeros
  for each meeting (start, end):
    release all rooms ending <= start
    if freeRooms not empty:
      room = pop freeRooms
      push (end, room) to busyRooms
    else:
      endTime, room = pop busyRooms
      push (endTime + duration, room) to busyRooms
    count[room]++
  return argmax(count)`,

    python: `import heapq

def mostBooked(n: int, meetings: list[list[int]]) -> int:
    meetings.sort()
    free = list(range(n))
    heapq.heapify(free)
    busy = []
    count = [0] * n
    for start, end in meetings:
        while busy and busy[0][0] <= start:
            _, room = heapq.heappop(busy)
            heapq.heappush(free, room)
        if free:
            room = heapq.heappop(free)
            heapq.heappush(busy, (end, room))
        else:
            endTime, room = heapq.heappop(busy)
            heapq.heappush(busy, (endTime + end - start, room))
        count[room] += 1
    return count.index(max(count))`,

    javascript: `function mostBooked(n, meetings) {
  meetings.sort((a, b) => a[0] - b[0]);
  // Simulate heaps with sorted arrays
  let free = Array.from({length: n}, (_, i) => i);
  let busy = []; // [endTime, room]
  const count = new Array(n).fill(0);
  for (const [start, end] of meetings) {
    busy = busy.filter(([e, r]) => {
      if (e <= start) { free.push(r); free.sort((a,b)=>a-b); return false; }
      return true;
    });
    busy.sort((a,b) => a[0]-b[0] || a[1]-b[1]);
    if (free.length) {
      const room = free.shift();
      busy.push([end, room]);
      count[room]++;
    } else {
      const [endTime, room] = busy.shift();
      busy.push([endTime + end - start, room]);
      count[room]++;
    }
  }
  return count.indexOf(Math.max(...count));
}`,

    java: `public int mostBooked(int n, int[][] meetings) {
    Arrays.sort(meetings, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> free = new PriorityQueue<>();
    for (int i = 0; i < n; i++) free.offer(i);
    PriorityQueue<long[]> busy = new PriorityQueue<>((a,b) ->
        a[0] != b[0] ? Long.compare(a[0],b[0]) : Long.compare(a[1],b[1]));
    int[] count = new int[n];
    for (int[] m : meetings) {
        while (!busy.isEmpty() && busy.peek()[0] <= m[0]) {
            free.offer((int) busy.poll()[1]);
        }
        if (!free.isEmpty()) {
            int room = free.poll();
            busy.offer(new long[]{m[1], room});
            count[room]++;
        } else {
            long[] top = busy.poll();
            busy.offer(new long[]{top[0] + m[1] - m[0], top[1]});
            count[(int)top[1]]++;
        }
    }
    int ans = 0;
    for (int i = 1; i < n; i++) if (count[i] > count[ans]) ans = i;
    return ans;
}`,
  },

  defaultInput: {
    n: 2,
    meetings: [[0, 10], [1, 5], [2, 7], [3, 4]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Rooms',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of available rooms',
    },
    {
      name: 'meetings',
      label: 'Meetings (start,end pairs)',
      type: 'array',
      defaultValue: [0, 10, 1, 5, 2, 7, 3, 4],
      placeholder: '0,10,1,5,2,7,3,4',
      helperText: 'Pairs of start,end times',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const rawMeetings = input.meetings as number[];
    const steps: AlgorithmStep[] = [];

    // Parse meetings as pairs
    const meetings: [number, number][] = [];
    for (let i = 0; i + 1 < rawMeetings.length; i += 2) {
      meetings.push([rawMeetings[i], rawMeetings[i + 1]]);
    }
    meetings.sort((a, b) => a[0] - b[0]);

    const count = new Array(n).fill(0);
    let free = Array.from({ length: n }, (_, i) => i);
    let busy: [number, number][] = []; // [endTime, room]

    steps.push({
      line: 1,
      explanation: `Sort ${meetings.length} meetings by start time. Initialize ${n} free rooms: [${free.join(', ')}]`,
      variables: { n, meetingsCount: meetings.length, freeRooms: free.join(',') },
      visualization: {
        type: 'array',
        array: count,
        highlights: Object.fromEntries(count.map((_, i) => [i, 'default'])),
        labels: Object.fromEntries(count.map((_, i) => [i, `R${i}:0`])),
      } as ArrayVisualization,
    });

    for (let mi = 0; mi < meetings.length; mi++) {
      const [start, end] = meetings[mi];
      const duration = end - start;

      // Release rooms
      const released: number[] = [];
      busy = busy.filter(([e, r]) => {
        if (e <= start) { free.push(r); released.push(r); return false; }
        return true;
      });
      free.sort((a, b) => a - b);
      busy.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

      if (released.length > 0) {
        steps.push({
          line: 6,
          explanation: `Meeting [${start},${end}]: Released room(s) ${released.join(',')} back to free pool. Free: [${free.join(',')}]`,
          variables: { start, end, released: released.join(','), freeRooms: free.join(',') },
          visualization: {
            type: 'array',
            array: count,
            highlights: Object.fromEntries(released.map(r => [r, 'found'])),
            labels: Object.fromEntries(count.map((c, i) => [i, `R${i}:${c}`])),
          } as ArrayVisualization,
        });
      }

      let assignedRoom: number;
      let actualEnd: number;

      if (free.length > 0) {
        assignedRoom = free.shift()!;
        actualEnd = end;
        busy.push([actualEnd, assignedRoom]);
        count[assignedRoom]++;
        steps.push({
          line: 8,
          explanation: `Meeting [${start},${end}]: Assigned to free room ${assignedRoom}. Ends at ${actualEnd}. Count: [${count.join(',')}]`,
          variables: { start, end, room: assignedRoom, endTime: actualEnd },
          visualization: {
            type: 'array',
            array: count,
            highlights: { [assignedRoom]: 'active' },
            labels: Object.fromEntries(count.map((c, i) => [i, `R${i}:${c}`])),
          } as ArrayVisualization,
        });
      } else {
        const [endTime, room] = busy.shift()!;
        assignedRoom = room;
        actualEnd = endTime + duration;
        busy.push([actualEnd, assignedRoom]);
        busy.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        count[assignedRoom]++;
        steps.push({
          line: 12,
          explanation: `No free room. Delayed meeting [${start},${end}] to room ${assignedRoom} (was busy until ${endTime}). New end: ${actualEnd}. Count: [${count.join(',')}]`,
          variables: { start, end, room: assignedRoom, delayedEnd: actualEnd, wasEnd: endTime },
          visualization: {
            type: 'array',
            array: count,
            highlights: { [assignedRoom]: 'comparing' },
            labels: Object.fromEntries(count.map((c, i) => [i, `R${i}:${c}`])),
          } as ArrayVisualization,
        });
      }
    }

    const maxCount = Math.max(...count);
    const result = count.indexOf(maxCount);

    steps.push({
      line: 14,
      explanation: `All meetings assigned. Room counts: [${count.join(', ')}]. Room ${result} had the most meetings (${maxCount}).`,
      variables: { counts: count.join(','), result, maxCount },
      visualization: {
        type: 'array',
        array: count,
        highlights: { [result]: 'found' },
        labels: Object.fromEntries(count.map((c, i) => [i, `R${i}:${c}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default meetingRoomsIii;
