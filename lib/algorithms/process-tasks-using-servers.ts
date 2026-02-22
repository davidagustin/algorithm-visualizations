import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const processTasksUsingServers: AlgorithmDefinition = {
  id: 'process-tasks-using-servers',
  title: 'Process Tasks Using Servers',
  leetcodeNumber: 1882,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Assign each task to the available server with the smallest weight (ties broken by smaller index). Tasks arrive at times 0, 1, 2, ... Use two min-heaps: one for free servers (weight, index) and one for busy servers (freeTime, weight, index). Before each task, release servers that have finished.',
  tags: ['heap', 'priority queue', 'simulation', 'greedy'],

  code: {
    pseudocode: `function assignTasks(servers, tasks):
  freeServers = min-heap of (weight, index) for all servers
  busyServers = min-heap of (freeTime, weight, index)
  result = []

  for i, task in enumerate(tasks):
    time = i
    // release servers that are done by now
    while busyServers not empty and busyServers.top.freeTime <= time:
      (ft, w, idx) = busyServers.pop()
      freeServers.push((w, idx))

    if freeServers not empty:
      (w, idx) = freeServers.pop()
      result[i] = idx
      busyServers.push((time + task, w, idx))
    else:
      // all busy, wait for earliest free server
      (ft, w, idx) = busyServers.pop()
      result[i] = idx
      busyServers.push((ft + task, w, idx))

  return result`,

    python: `import heapq

def assignTasks(servers, tasks):
    free = [(w, i) for i, w in enumerate(servers)]
    heapq.heapify(free)
    busy = []
    result = []

    for i, task in enumerate(tasks):
        t = i
        while busy and busy[0][0] <= t:
            ft, w, idx = heapq.heappop(busy)
            heapq.heappush(free, (w, idx))
        if free:
            w, idx = heapq.heappop(free)
            result.append(idx)
            heapq.heappush(busy, (t + task, w, idx))
        else:
            ft, w, idx = heapq.heappop(busy)
            result.append(idx)
            heapq.heappush(busy, (ft + task, w, idx))
    return result`,

    javascript: `function assignTasks(servers, tasks) {
  // Simplified simulation without true heap
  const free = servers.map((w, i) => [w, i]).sort((a, b) => a[0]-b[0]||a[1]-b[1]);
  const busy = [];
  const result = [];

  for (let i = 0; i < tasks.length; i++) {
    const t = i;
    // Release done servers
    for (let j = busy.length - 1; j >= 0; j--) {
      if (busy[j][0] <= t) {
        const [, w, idx] = busy.splice(j, 1)[0];
        free.push([w, idx]);
        free.sort((a, b) => a[0]-b[0]||a[1]-b[1]);
      }
    }
    if (free.length) {
      const [w, idx] = free.shift();
      result.push(idx);
      busy.push([t + tasks[i], w, idx]);
    } else {
      busy.sort((a, b) => a[0]-b[0]);
      const [ft, w, idx] = busy.shift();
      result.push(idx);
      busy.push([ft + tasks[i], w, idx]);
    }
  }
  return result;
}`,

    java: `public int[] assignTasks(int[] servers, int[] tasks) {
    PriorityQueue<int[]> free = new PriorityQueue<>((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    PriorityQueue<int[]> busy = new PriorityQueue<>((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]!=b[1]?a[1]-b[1]:a[2]-b[2]);
    for (int i = 0; i < servers.length; i++) free.offer(new int[]{servers[i], i});
    int[] res = new int[tasks.length];
    for (int i = 0; i < tasks.length; i++) {
        while (!busy.isEmpty() && busy.peek()[0] <= i)
            free.offer(new int[]{busy.peek()[1], busy.poll()[2]});
        if (!free.isEmpty()) {
            int[] s = free.poll();
            res[i] = s[1];
            busy.offer(new int[]{i + tasks[i], s[0], s[1]});
        } else {
            int[] s = busy.poll();
            res[i] = s[2];
            busy.offer(new int[]{s[0] + tasks[i], s[1], s[2]});
        }
    }
    return res;
}`,
  },

  defaultInput: {
    nums: [3, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Server Weights',
      type: 'array',
      defaultValue: [3, 3, 2],
      placeholder: '3,3,2',
      helperText: 'Weight of each server (lower weight = higher priority)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const servers = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const tasks = [1, 2, 3, 2, 1, 2];

    // Min-heap simulation using sorted arrays
    let free: Array<[number, number]> = servers
      .map((w, i): [number, number] => [w, i])
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let busy: Array<[number, number, number]> = []; // [freeTime, weight, idx]
    const result: number[] = [];

    steps.push({
      line: 1,
      explanation: `Initialize: ${servers.length} servers with weights [${servers.join(', ')}]. All servers start free. Tasks: [${tasks.join(', ')}] arriving at times 0,1,2,...`,
      variables: { serverWeights: servers.join(', '), taskCount: tasks.length },
      visualization: {
        type: 'array',
        array: [...servers],
        highlights: servers.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: servers.reduce((acc: Record<number, string>, w, i) => { acc[i] = `S${i}:w${w}`; return acc; }, {}),
      },
    });

    for (let i = 0; i < tasks.length; i++) {
      const t = i;
      const task = tasks[i];

      // Release servers
      const newlyFree: Array<[number, number]> = [];
      busy = busy.filter(([ft, w, idx]) => {
        if (ft <= t) { newlyFree.push([w, idx]); return false; }
        return true;
      });
      for (const s of newlyFree) {
        free.push(s);
      }
      free.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

      let assignedIdx: number;
      if (free.length > 0) {
        const [w, idx] = free.shift()!;
        assignedIdx = idx;
        result.push(idx);
        busy.push([t + task, w, idx]);
        busy.sort((a, b) => a[0] - b[0]);

        steps.push({
          line: 9,
          explanation: `Time ${t}, task[${i}] (duration ${task}): Assign to free server S${idx} (weight ${w}). Server free at time ${t + task}.`,
          variables: { time: t, taskIdx: i, taskDuration: task, assignedServer: idx, serverFreeAt: t + task, freeServersLeft: free.length },
          visualization: {
            type: 'array',
            array: servers.map((w2, si) => busy.some(b => b[2] === si) ? 1 : 0),
            highlights: { [idx]: 'active' },
            labels: servers.reduce((acc: Record<number, string>, _, si) => {
              const isBusy = busy.find(b => b[2] === si);
              acc[si] = isBusy ? `S${si}:busy(${isBusy[0]})` : `S${si}:free`;
              return acc;
            }, {}),
          },
        });
      } else {
        busy.sort((a, b) => a[0] - b[0]);
        const [ft, w, idx] = busy.shift()!;
        assignedIdx = idx;
        result.push(idx);
        busy.push([ft + task, w, idx]);
        busy.sort((a, b) => a[0] - b[0]);
        free.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

        steps.push({
          line: 14,
          explanation: `Time ${t}, task[${i}] (duration ${task}): All servers busy! Wait for S${idx} (earliest free at ${ft}). Assign task there, server now free at ${ft + task}.`,
          variables: { time: t, taskIdx: i, taskDuration: task, waitedFor: ft, assignedServer: idx, serverFreeAt: ft + task },
          visualization: {
            type: 'array',
            array: servers.map((_, si) => busy.some(b => b[2] === si) ? 1 : 0),
            highlights: { [idx]: 'comparing' },
            labels: servers.reduce((acc: Record<number, string>, _, si) => {
              const isBusy = busy.find(b => b[2] === si);
              acc[si] = isBusy ? `S${si}:busy(${isBusy[0]})` : `S${si}:free`;
              return acc;
            }, {}),
          },
        });
      }
    }

    steps.push({
      line: 19,
      explanation: `All ${tasks.length} tasks assigned. Result: [${result.join(', ')}] (server index for each task).`,
      variables: { result: result.join(', ') },
      visualization: {
        type: 'array',
        array: result,
        highlights: result.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: result.reduce((acc: Record<number, string>, v, i) => { acc[i] = `task${i}->S${v}`; return acc; }, {}),
      },
    });

    return steps;
  },
};

export default processTasksUsingServers;
