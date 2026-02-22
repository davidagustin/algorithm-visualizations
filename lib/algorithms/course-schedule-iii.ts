import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const courseScheduleIii: AlgorithmDefinition = {
  id: 'course-schedule-iii',
  title: 'Course Schedule III',
  leetcodeNumber: 630,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a list of courses where each course has a duration and a deadline, return the maximum number of courses you can take. Uses a greedy approach: sort by deadline, then use a max-heap to greedily replace the longest course taken so far when adding a new course would exceed the deadline.',
  tags: ['greedy', 'heap', 'priority queue', 'sorting', 'graph'],

  code: {
    pseudocode: `function scheduleCourse(courses):
  sort courses by deadline ascending
  heap = max-heap (by duration)
  time = 0
  for each [duration, deadline] in courses:
    heap.push(duration)
    time += duration
    if time > deadline:
      time -= heap.pop()  // remove longest course
  return heap.size`,

    python: `def scheduleCourse(courses):
    courses.sort(key=lambda x: x[1])
    heap = []  # max heap (negate values)
    time = 0
    for duration, deadline in courses:
        heapq.heappush(heap, -duration)
        time += duration
        if time > deadline:
            time += heapq.heappop(heap)  # heap stores negatives
    return len(heap)`,

    javascript: `function scheduleCourse(courses) {
  courses.sort((a, b) => a[1] - b[1]);
  const heap = new MaxHeap();
  let time = 0;
  for (const [duration, deadline] of courses) {
    heap.push(duration);
    time += duration;
    if (time > deadline) {
      time -= heap.pop();
    }
  }
  return heap.size;
}`,

    java: `public int scheduleCourse(int[][] courses) {
    Arrays.sort(courses, (a, b) -> a[1] - b[1]);
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    int time = 0;
    for (int[] course : courses) {
        heap.offer(course[0]);
        time += course[0];
        if (time > course[1]) {
            time -= heap.poll();
        }
    }
    return heap.size();
}`,
  },

  defaultInput: {
    courses: [3, 9, 2, 5, 5, 18, 2, 3],
  },

  inputFields: [
    {
      name: 'courses',
      label: 'Courses (duration,deadline pairs flattened)',
      type: 'array',
      defaultValue: [3, 9, 2, 5, 5, 18, 2, 3],
      placeholder: '3,9,2,5,5,18,2,3',
      helperText: 'Pairs: [duration1, deadline1, duration2, deadline2, ...]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.courses as number[];
    const steps: AlgorithmStep[] = [];

    // Parse pairs
    const courses: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      courses.push([flat[i], flat[i + 1]]);
    }

    // Represent courses as flat array for visualization
    const courseVals = courses.map(c => c[0]); // durations for display

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: courseVals,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort ${courses.length} courses by deadline. Original courses: ${courses.map(c => `[d=${c[0]},dl=${c[1]}]`).join(', ')}.`,
      variables: { totalCourses: courses.length },
      visualization: makeViz({}, {}),
    });

    // Sort by deadline
    courses.sort((a, b) => a[1] - b[1]);
    const sorted = courses.map(c => c[0]);

    steps.push({
      line: 2,
      explanation: `After sorting by deadline: ${courses.map(c => `[d=${c[0]},dl=${c[1]}]`).join(', ')}. Process in this order.`,
      variables: { sortedByDeadline: courses.map(c => c[1]).join(',') },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: {},
        labels: courses.reduce((acc, c, i) => { acc[i] = `dl=${c[1]}`; return acc; }, {} as Record<number, string>),
      },
    });

    // Simulate greedy with max-heap (using sorted array as proxy)
    const heap: number[] = []; // stores durations taken so far
    let time = 0;

    for (let i = 0; i < courses.length; i++) {
      const [duration, deadline] = courses[i];

      // Add to heap
      heap.push(duration);
      heap.sort((a, b) => b - a); // maintain max heap order
      time += duration;

      const taken = [...heap];

      steps.push({
        line: 5,
        explanation: `Consider course with duration=${duration}, deadline=${deadline}. Add to schedule: time=${time}.`,
        variables: { duration, deadline, timeSoFar: time, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: sorted,
          highlights: { [i]: 'active' },
          labels: { [i]: `d=${duration}` },
        },
      });

      if (time > deadline) {
        const removed = heap.shift()!; // remove max
        time -= removed;

        steps.push({
          line: 7,
          explanation: `Time ${time + removed} > deadline ${deadline}. Remove longest course (duration=${removed}) from schedule. New time=${time}. Heap size=${heap.length}.`,
          variables: { removed, newTime: time, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: sorted,
            highlights: { [i]: 'mismatch' },
            labels: { [i]: `removed ${removed}` },
          },
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Course fits within deadline ${deadline}. Keep it. Total courses so far: ${heap.length}.`,
          variables: { time, coursesKept: heap.length, heap: [...taken] },
          visualization: {
            type: 'array',
            array: sorted,
            highlights: { [i]: 'found' },
            labels: { [i]: 'kept' },
          },
        });
      }
    }

    const allH: Record<number, string> = {};
    for (let i = 0; i < courses.length; i++) allH[i] = 'sorted';

    steps.push({
      line: 9,
      explanation: `Done. Maximum number of courses that can be taken: ${heap.length}.`,
      variables: { maxCourses: heap.length, finalTime: time },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: allH,
        labels: { 0: `ans=${heap.length}` },
      },
    });

    return steps;
  },
};

export default courseScheduleIii;
