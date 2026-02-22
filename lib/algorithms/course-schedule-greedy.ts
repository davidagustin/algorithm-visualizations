import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const courseScheduleGreedy: AlgorithmDefinition = {
  id: 'course-schedule-greedy',
  title: 'Course Schedule III (Greedy)',
  leetcodeNumber: 630,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'Given courses [duration, deadline], find the maximum number of courses you can take. Greedy: sort by deadline. Use a max-heap of durations taken so far. For each course, if it fits add it; if it does not fit but is shorter than the longest taken course, swap to improve future options.',
  tags: ['greedy', 'heap', 'sorting', 'array'],

  code: {
    pseudocode: `function scheduleCourse(courses):
  sort courses by deadline
  maxHeap = [] (stores durations)
  time = 0
  for each [duration, deadline] in courses:
    if time + duration <= deadline:
      add duration to maxHeap
      time += duration
    elif maxHeap not empty and maxHeap.max > duration:
      time -= maxHeap.max
      replace maxHeap.max with duration
      time += duration
  return size of maxHeap`,

    python: `def scheduleCourse(courses: list[list[int]]) -> int:
    import heapq
    courses.sort(key=lambda x: x[1])
    heap = []  # max-heap via negation
    time = 0
    for duration, deadline in courses:
        if time + duration <= deadline:
            heapq.heappush(heap, -duration)
            time += duration
        elif heap and -heap[0] > duration:
            time -= -heap[0]
            heapq.heapreplace(heap, -duration)
            time += duration
    return len(heap)`,

    javascript: `function scheduleCourse(courses) {
  courses.sort((a, b) => a[1] - b[1]);
  // Simulate max-heap with sorted array
  const heap = [];
  let time = 0;
  for (const [dur, deadline] of courses) {
    if (time + dur <= deadline) {
      heap.push(dur);
      heap.sort((a, b) => b - a);
      time += dur;
    } else if (heap.length && heap[0] > dur) {
      time -= heap[0];
      heap[0] = dur;
      heap.sort((a, b) => b - a);
      time += dur;
    }
  }
  return heap.length;
}`,

    java: `public int scheduleCourse(int[][] courses) {
    Arrays.sort(courses, (a, b) -> a[1] - b[1]);
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
    int time = 0;
    for (int[] c : courses) {
        if (time + c[0] <= c[1]) {
            pq.offer(c[0]);
            time += c[0];
        } else if (!pq.isEmpty() && pq.peek() > c[0]) {
            time -= pq.poll();
            pq.offer(c[0]);
            time += c[0];
        }
    }
    return pq.size();
}`,
  },

  defaultInput: {
    courses: [100, 200, 200, 1300, 1000, 1250, 2000, 3200],
  },

  inputFields: [
    {
      name: 'courses',
      label: 'Courses (interleaved duration,deadline pairs)',
      type: 'array',
      defaultValue: [100, 200, 200, 1300, 1000, 1250, 2000, 3200],
      placeholder: '100,200,200,1300,1000,1250,2000,3200',
      helperText: 'Pairs: duration,deadline for each course',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.courses as number[];
    const steps: AlgorithmStep[] = [];

    const coursesRaw: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      coursesRaw.push([flat[i], flat[i + 1]]);
    }

    const courses = [...coursesRaw].sort((a, b) => a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `Sort ${courses.length} courses by deadline: ${courses.map(c => '[dur=' + c[0] + ',dl=' + c[1] + ']').join(', ')}`,
      variables: { courses: courses.map(c => '[' + c[0] + ',' + c[1] + ']').join(', ') },
      visualization: {
        type: 'array',
        array: courses.map(c => c[1]),
        highlights: Object.fromEntries(courses.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(courses.map((c, i) => [i, 'dur:' + c[0]])),
      },
    });

    const heap: number[] = [];
    let time = 0;

    for (let i = 0; i < courses.length; i++) {
      const [dur, deadline] = courses[i];

      if (time + dur <= deadline) {
        heap.push(dur);
        heap.sort((a, b) => b - a);
        time += dur;

        steps.push({
          line: 5,
          explanation: `Course ${i + 1} [dur=${dur}, dl=${deadline}]: time+dur=${time} <= deadline. Add to schedule. time=${time}, courses taken=${heap.length}.`,
          variables: { dur, deadline, time, coursesTaken: heap.length, heap: heap.join(',') },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'found' },
            labels: { 0: 'max dur' },
          },
        });
      } else if (heap.length > 0 && heap[0] > dur) {
        const removed = heap[0];
        time -= removed;
        heap[0] = dur;
        heap.sort((a, b) => b - a);
        time += dur;

        steps.push({
          line: 8,
          explanation: `Course ${i + 1} [dur=${dur}, dl=${deadline}]: does not fit (time+dur=${time + removed - dur + dur}>${deadline}). But it is shorter than max in heap (${removed}). Swap: remove ${removed}, add ${dur}. time=${time}.`,
          variables: { dur, deadline, removed, time, coursesTaken: heap.length },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'active' },
            labels: { 0: 'swapped' },
          },
        });
      } else {
        steps.push({
          line: 6,
          explanation: `Course ${i + 1} [dur=${dur}, dl=${deadline}]: does not fit and not shorter than max heap element. Skip.`,
          variables: { dur, deadline, time, heapMax: heap[0] || 0 },
          visualization: {
            type: 'array',
            array: courses.map(c => c[0]),
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'skip' },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Maximum courses that can be completed = ${heap.length}. Schedule durations: [${heap.join(', ')}].`,
      variables: { result: heap.length, schedule: heap.join(',') },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: Object.fromEntries(heap.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default courseScheduleGreedy;
