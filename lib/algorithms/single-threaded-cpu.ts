import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleThreadedCpu: AlgorithmDefinition = {
  id: 'single-threaded-cpu',
  title: 'Single-Threaded CPU',
  leetcodeNumber: 1834,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given n tasks with enqueueTime and processingTime, simulate a single-threaded CPU that always picks the available task with the shortest processing time (breaking ties by smaller index). Use a min heap and sort tasks by enqueue time.',
  tags: ['heap', 'sorting', 'simulation', 'greedy'],

  code: {
    pseudocode: `function getOrder(tasks):
  indexed = [(enqueue, process, index) for each task]
  sort indexed by enqueue time
  result = []
  time = 0
  minHeap = min heap of (processingTime, index)
  i = 0
  while result.length < n:
    enqueue all tasks with enqueue <= time
    if heap empty: time = next task enqueue time
    processTime, idx = pop minHeap
    result.append(idx)
    time += processTime
  return result`,

    python: `import heapq

def getOrder(tasks):
    n = len(tasks)
    indexed = sorted(enumerate(tasks), key=lambda x: x[1][0])
    result = []
    heap = []
    time = 0
    i = 0
    while len(result) < n:
        while i < n and indexed[i][1][0] <= time:
            _, (enq, proc) = indexed[i]
            heapq.heappush(heap, (proc, indexed[i][0]))
            i += 1
        if not heap:
            time = indexed[i][1][0]
            continue
        proc, idx = heapq.heappop(heap)
        result.append(idx)
        time += proc
    return result`,

    javascript: `function getOrder(tasks) {
  const n = tasks.length;
  const indexed = tasks.map((t,i)=>[...t,i]).sort((a,b)=>a[0]-b[0]);
  const result = [], heap = [];
  let time = 0, i = 0;
  while (result.length < n) {
    while (i < n && indexed[i][0] <= time) {
      heap.push([indexed[i][1], indexed[i][2]]);
      heap.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
      i++;
    }
    if (!heap.length) { time = indexed[i][0]; continue; }
    const [proc, idx] = heap.shift();
    result.push(idx);
    time += proc;
  }
  return result;
}`,

    java: `public int[] getOrder(int[][] tasks) {
    int n = tasks.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a,b) -> tasks[a][0]-tasks[b][0]);
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    int[] result = new int[n];
    long time = 0; int i = 0, ri = 0;
    while (ri < n) {
        while (i < n && tasks[idx[i]][0] <= time) {
            heap.offer(new int[]{tasks[idx[i]][1], idx[i]});
            i++;
        }
        if (heap.isEmpty()) { time = tasks[idx[i]][0]; continue; }
        int[] top = heap.poll();
        result[ri++] = top[1];
        time += top[0];
    }
    return result;
}`,
  },

  defaultInput: {
    tasks: [1, 2, 2, 4, 3, 2, 4, 1],
  },

  inputFields: [
    {
      name: 'tasks',
      label: 'Tasks (enqueueTime,processingTime pairs)',
      type: 'array',
      defaultValue: [1, 2, 2, 4, 3, 2, 4, 1],
      placeholder: '1,2,2,4,3,2,4,1',
      helperText: 'Pairs of enqueueTime,processingTime',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.tasks as number[];
    const steps: AlgorithmStep[] = [];

    const tasks: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      tasks.push([flat[i], flat[i + 1]]);
    }
    const n = tasks.length;

    const indexed = tasks.map((t, i) => [...t, i] as [number, number, number]);
    indexed.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `${n} tasks sorted by enqueue time: [${indexed.map(([e, p, i]) => `t${i}(e=${e},p=${p})`).join(', ')}]`,
      variables: { n },
      visualization: {
        type: 'array',
        array: tasks.map(([e]) => e),
        highlights: {},
        labels: Object.fromEntries(tasks.map(([e, p], i) => [i, `e=${e},p=${p}`])),
      } as ArrayVisualization,
    });

    const result: number[] = [];
    let heap: [number, number][] = []; // [processingTime, taskIndex]
    let time = 0;
    let i = 0;

    while (result.length < n) {
      // Enqueue available tasks
      while (i < n && indexed[i][0] <= time) {
        heap.push([indexed[i][1], indexed[i][2]]);
        heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        i++;
      }

      if (heap.length === 0) {
        time = indexed[i][0];
        steps.push({
          line: 7,
          explanation: `CPU idle. Jump time to ${time} (next task enqueue).`,
          variables: { time },
          visualization: {
            type: 'array',
            array: tasks.map(([e]) => e),
            highlights: { [indexed[i][2]]: 'active' },
            labels: { [indexed[i][2]]: `next` },
          } as ArrayVisualization,
        });
        continue;
      }

      const [proc, idx] = heap.shift()!;
      result.push(idx);
      const prevTime = time;
      time += proc;

      steps.push({
        line: 10,
        explanation: `Execute task ${idx} (process=${proc}). Time ${prevTime} -> ${time}. Order so far: [${result.join(', ')}]`,
        variables: { task: idx, proc, time, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: tasks.map(([e]) => e),
          highlights: { [idx]: 'found' },
          labels: { [idx]: `done#${result.length}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 13,
      explanation: `All tasks executed. Order: [${result.join(', ')}]`,
      variables: { result: result.join(',') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `t${v}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default singleThreadedCpu;
