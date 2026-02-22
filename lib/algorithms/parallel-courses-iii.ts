import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const parallelCoursesIii: AlgorithmDefinition = {
  id: 'parallel-courses-iii',
  title: 'Parallel Courses III',
  leetcodeNumber: 2050,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given n courses, prerequisite relations, and a time array for each course, find the minimum time to complete all courses. Courses can be taken in parallel if prerequisites are satisfied. Use topological sort with BFS: maintain the earliest start time for each course, and propagate through the DAG. The answer is the maximum completion time.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Dynamic Programming'],
  code: {
    pseudocode: `function minimumTime(n, relations, time):
  inDegree = [0] * n
  adj = adjacency list
  for [u, v] in relations:
    adj[u-1].append(v-1); inDegree[v-1]++
  earliest = [0] * n
  queue = nodes with inDegree 0
  while queue:
    node = queue.dequeue()
    for nb in adj[node]:
      earliest[nb] = max(earliest[nb], earliest[node]+time[node])
      inDegree[nb]--
      if inDegree[nb] == 0: queue.add(nb)
  return max(earliest[i]+time[i] for i in 0..n-1)`,
    python: `def minimumTime(n, relations, time):
    inDegree = [0] * n
    adj = [[] for _ in range(n)]
    for u, v in relations:
        adj[u-1].append(v-1); inDegree[v-1] += 1
    earliest = [0] * n
    q = deque(i for i in range(n) if inDegree[i] == 0)
    while q:
        node = q.popleft()
        for nb in adj[node]:
            earliest[nb] = max(earliest[nb], earliest[node] + time[node])
            inDegree[nb] -= 1
            if inDegree[nb] == 0: q.append(nb)
    return max(earliest[i] + time[i] for i in range(n))`,
    javascript: `function minimumTime(n, relations, time) {
  const inDegree = new Array(n).fill(0);
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of relations) { adj[u-1].push(v-1); inDegree[v-1]++; }
  const earliest = new Array(n).fill(0);
  const queue = [];
  for (let i = 0; i < n; i++) if (!inDegree[i]) queue.push(i);
  while (queue.length) {
    const node = queue.shift();
    for (const nb of adj[node]) {
      earliest[nb] = Math.max(earliest[nb], earliest[node] + time[node]);
      if (--inDegree[nb] === 0) queue.push(nb);
    }
  }
  return Math.max(...earliest.map((e, i) => e + time[i]));
}`,
    java: `public int minimumTime(int n, int[][] relations, int[] time) {
    int[] inDegree = new int[n];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] r : relations) { adj.get(r[0]-1).add(r[1]-1); inDegree[r[1]-1]++; }
    int[] earliest = new int[n];
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) q.add(i);
    while (!q.isEmpty()) {
        int node = q.poll();
        for (int nb : adj.get(node)) {
            earliest[nb] = Math.max(earliest[nb], earliest[node] + time[node]);
            if (--inDegree[nb] == 0) q.add(nb);
        }
    }
    int ans = 0;
    for (int i = 0; i < n; i++) ans = Math.max(ans, earliest[i] + time[i]);
    return ans;
}`,
  },
  defaultInput: {
    n: 5,
    relations: [[1, 5], [2, 5], [3, 5], [3, 4], [4, 5]],
    time: [1, 2, 3, 4, 5],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Courses labeled 1 to n',
    },
    {
      name: 'relations',
      label: 'Prerequisite Relations [u, v]',
      type: 'array',
      defaultValue: [[1, 5], [2, 5], [3, 5], [3, 4], [4, 5]],
      placeholder: '[[1,5],[2,5],[3,5],[3,4],[4,5]]',
      helperText: 'Course u must be completed before course v',
    },
    {
      name: 'time',
      label: 'Course Durations',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '[1,2,3,4,5]',
      helperText: 'time[i] = duration of course i+1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const relations = input.relations as number[][];
    const time = input.time as number[];
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of relations) { adj[u - 1].push(v - 1); inDegree[v - 1]++; }

    const earliest = new Array(n).fill(0);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: earliest.map((e, i) => e + time[i]),
        highlights,
        labels,
        auxData: {
          label: 'Parallel Courses III',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.map(q => q + 1).join(', ') : 'empty' },
            { key: 'Min Time', value: String(Math.max(...earliest.map((e, i) => e + time[i]))) },
            { key: 'Earliest', value: earliest.map((e, i) => `c${i + 1}:${e}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} courses with durations [${time.join(', ')}]. Build graph from ${relations.length} relations.`,
      variables: { n, time, inDegree: [...inDegree] },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i + 1}:t${time[i]}`])),
        []
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

    steps.push({
      line: 7,
      explanation: `Source courses (no prerequisites): [${queue.map(q => q + 1).join(', ')}]. Start at time 0.`,
      variables: { queue: queue.map(q => q + 1) },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i + 1}:e${earliest[i]}`])),
        [...queue]
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      const completion = earliest[node] + time[node];

      steps.push({
        line: 9,
        explanation: `Process course ${node + 1}: starts at ${earliest[node]}, duration=${time[node]}, finishes at ${completion}.`,
        variables: { course: node + 1, earliest: earliest[node], duration: time[node], completion },
        visualization: makeViz(
          { [node]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i + 1}:e${earliest[i]}`])),
          [...queue]
        ),
      });

      for (const nb of adj[node]) {
        const newEarliest = earliest[node] + time[node];
        if (newEarliest > earliest[nb]) earliest[nb] = newEarliest;
        inDegree[nb]--;
        if (inDegree[nb] === 0) queue.push(nb);

        steps.push({
          line: 11,
          explanation: `Course ${nb + 1} can start no earlier than ${earliest[nb]} (after course ${node + 1} finishes). In-degree=${inDegree[nb]}.`,
          variables: { nb: nb + 1, earliest: earliest[nb] },
          visualization: makeViz(
            { [node]: 'found', [nb]: inDegree[nb] === 0 ? 'active' : 'comparing' },
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i + 1}:e${earliest[i]}`])),
            [...queue]
          ),
        });
      }
    }

    const result = Math.max(...earliest.map((e, i) => e + time[i]));
    const finalHighlights: Record<number, string> = {};
    const completions = earliest.map((e, i) => e + time[i]);
    for (let i = 0; i < n; i++) finalHighlights[i] = completions[i] === result ? 'found' : 'sorted';

    steps.push({
      line: 15,
      explanation: `Minimum time to complete all courses: ${result}. All courses processed in parallel as prerequisites allow.`,
      variables: { result, completions },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(completions.map((c, i) => [i, `c${i + 1}:${c}`])),
        []
      ),
    });

    return steps;
  },
};

export default parallelCoursesIii;
