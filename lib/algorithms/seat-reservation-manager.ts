import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const seatReservationManager: AlgorithmDefinition = {
  id: 'seat-reservation-manager',
  title: 'Seat Reservation Manager',
  leetcodeNumber: 1845,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Design a system that manages seat reservations for n seats (labeled 1 to n). Reserve always returns the smallest available seat number, and unreserve releases a seat back to the pool. Use a min-heap initialized with all seat numbers. Reserve pops the minimum; unreserve pushes the seat back.',
  tags: ['heap', 'priority queue', 'design', 'greedy'],

  code: {
    pseudocode: `class SeatManager:
  minHeap = min-heap of [1, 2, ..., n]

  reserve():
    return minHeap.pop()  // smallest available seat

  unreserve(seatNumber):
    minHeap.push(seatNumber)`,

    python: `import heapq

class SeatManager:
    def __init__(self, n: int):
        self.heap = list(range(1, n + 1))
        heapq.heapify(self.heap)

    def reserve(self) -> int:
        return heapq.heappop(self.heap)

    def unreserve(self, seatNumber: int) -> None:
        heapq.heappush(self.heap, seatNumber)`,

    javascript: `class SeatManager {
  constructor(n) {
    // Simple simulation (real impl uses a proper min-heap)
    this.available = Array.from({ length: n }, (_, i) => i + 1);
  }

  reserve() {
    return this.available.shift();
  }

  unreserve(seatNumber) {
    // Insert in sorted order
    let i = 0;
    while (i < this.available.length && this.available[i] < seatNumber) i++;
    this.available.splice(i, 0, seatNumber);
  }
}`,

    java: `class SeatManager {
    PriorityQueue<Integer> pq = new PriorityQueue<>();

    public SeatManager(int n) {
        for (int i = 1; i <= n; i++) pq.offer(i);
    }

    public int reserve() {
        return pq.poll();
    }

    public void unreserve(int seatNumber) {
        pq.offer(seatNumber);
    }
}`,
  },

  defaultInput: {
    nums: [5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Number of Seats n',
      type: 'array',
      defaultValue: [5],
      placeholder: '5',
      helperText: 'Total number of seats in the venue (single number)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = Math.max(1, Math.min(nums[0] ?? 5, 8));
    const steps: AlgorithmStep[] = [];

    // Simulate with a sorted array as min-heap substitute
    let heap: number[] = Array.from({ length: n }, (_, i) => i + 1);
    const reserved: Set<number> = new Set();

    steps.push({
      line: 1,
      explanation: `Initialize SeatManager with ${n} seats. Min-heap contains [${heap.join(', ')}]. Smallest seat is always at the top.`,
      variables: { n, heapMin: heap[0], totalSeats: n },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'pointer' },
        labels: { 0: 'min (top)', [heap.length - 1]: 'max' },
      },
    });

    // Reserve seats one by one
    const reserveCount = Math.min(3, n);
    for (let i = 0; i < reserveCount; i++) {
      const seat = heap.shift()!;
      reserved.add(seat);

      steps.push({
        line: 4,
        explanation: `reserve(): Pop minimum from heap -> seat #${seat}. Seat ${seat} is now reserved. ${heap.length} seats still available.`,
        variables: { reservedSeat: seat, remainingAvailable: heap.length, reserved: [...reserved].join(', ') },
        visualization: {
          type: 'array',
          array: heap.length > 0 ? [...heap] : [0],
          highlights: heap.length > 0 ? { 0: 'pointer' } : {},
          labels: heap.length > 0 ? { 0: `min:${heap[0]}` } : { 0: 'empty' },
        },
      });
    }

    // Unreserve seat 2 (if reserved)
    const unreserveSeat = 2;
    if (reserved.has(unreserveSeat)) {
      reserved.delete(unreserveSeat);
      heap.push(unreserveSeat);
      heap.sort((a, b) => a - b);

      steps.push({
        line: 7,
        explanation: `unreserve(${unreserveSeat}): Push seat ${unreserveSeat} back to heap and re-heapify. Heap: [${heap.join(', ')}].`,
        variables: { unreservedSeat: unreserveSeat, newHeapMin: heap[0], availableCount: heap.length },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: { [heap.indexOf(unreserveSeat)]: 'found', 0: 'pointer' },
          labels: { 0: `min:${heap[0]}` },
        },
      });

      // Reserve again to show it returns seat 2
      const nextSeat = heap.shift()!;
      reserved.add(nextSeat);

      steps.push({
        line: 4,
        explanation: `reserve() again: Heap correctly returns seat #${nextSeat} (the smallest available after unreserving ${unreserveSeat}).`,
        variables: { reservedSeat: nextSeat, remainingAvailable: heap.length },
        visualization: {
          type: 'array',
          array: heap.length > 0 ? [...heap] : [0],
          highlights: { 0: 'found' },
          labels: { 0: heap.length > 0 ? `min:${heap[0]}` : 'empty' },
        },
      });
    }

    return steps;
  },
};

export default seatReservationManager;
