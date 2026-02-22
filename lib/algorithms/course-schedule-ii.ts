import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const courseScheduleII: AlgorithmDefinition = {
  id: 'course-schedule-ii',
  title: 'Course Schedule II',
  leetcodeNumber: 210,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given numCourses courses and prerequisites, return a valid ordering to take all courses (topological sort). If impossible due to a cycle, return an empty array. Uses Kahn\'s algorithm: repeatedly remove nodes with in-degree 0.',
  tags: ['Graph', 'Topological Sort', 'BFS'],
  code: {
    pseudocode: `function findOrder(numCourses, prerequisites):
  inDegree = [0] * numCourses
  adj = adjacency list
  for [a, b] in prerequisites:
    adj[b].add(a)
    inDegree[a] += 1
  queue = nodes with inDegree == 0
  order = []
  while queue not empty:
    node = queue.dequeue()
    order.append(node)
    for neighbor in adj[node]:
      inDegree[neighbor] -= 1
      if inDegree[neighbor] == 0:
        queue.enqueue(neighbor)
  return order if len(order)==numCourses else []`,
    python: `def findOrder(numCourses, prerequisites):
    inDegree = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
        inDegree[a] += 1
    queue = deque(i for i in range(numCourses) if inDegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nb in adj[node]:
            inDegree[nb] -= 1
            if inDegree[nb] == 0:
                queue.append(nb)
    return order if len(order) == numCourses else []`,
    javascript: `function findOrder(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) {
    adj[b].push(a);
    inDegree[a]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++)
    if (inDegree[i] === 0) queue.push(i);
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const nb of adj[node]) {
      if (--inDegree[nb] === 0) queue.push(nb);
    }
  }
  return order.length === numCourses ? order : [];
}`,
    java: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    int[] inDegree = new int[numCourses];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); inDegree[p[0]]++; }
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) queue.add(i);
    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order[idx++] = node;
        for (int nb : adj.get(node)) if (--inDegree[nb] == 0) queue.add(nb);
    }
    return idx == numCourses ? order : new int[]{};
}`,
  },
  defaultInput: {
    numCourses: 4,
    prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]],
  },
  inputFields: [
    {
      name: 'numCourses',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total number of courses (0 to n-1)',
    },
    {
      name: 'prerequisites',
      label: 'Prerequisites [a, b]',
      type: 'array',
      defaultValue: [[1, 0], [2, 0], [3, 1], [3, 2]],
      placeholder: '[[1,0],[2,0]]',
      helperText: '[a,b] means take course b before course a',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numCourses = input.numCourses as number;
    const prereqs = input.prerequisites as number[][];
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prereqs) {
      adj[b].push(a);
      inDegree[a]++;
    }

    function makeViz(
      highlights: Record<number, string>,
      order: number[],
      queue: number[]
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < numCourses; i++) labels[i] = `c${i}:${inDegree[i]}`;
      return {
        type: 'array',
        array: [...inDegree],
        highlights,
        labels,
        auxData: {
          label: 'Topological Order',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Order', value: order.length > 0 ? order.join(' → ') : 'none' },
            { key: 'Progress', value: `${order.length} / ${numCourses}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build adjacency list and in-degrees for ${numCourses} courses from ${prereqs.length} prerequisites. Array shows in-degree of each course.`,
      variables: { numCourses, inDegree: [...inDegree] },
      visualization: makeViz({}, [], []),
    });

    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) queue.push(i);
    }

    const seedHighlights: Record<number, string> = {};
    for (const q of queue) seedHighlights[q] = 'active';
    steps.push({
      line: 7,
      explanation: `Courses with in-degree 0 (no prerequisites): [${queue.join(', ')}]. These can be taken immediately.`,
      variables: { queue: [...queue] },
      visualization: makeViz(seedHighlights, [], [...queue]),
    });

    const order: number[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);

      const hl: Record<number, string> = { [node]: 'found' };
      steps.push({
        line: 10,
        explanation: `Dequeue course ${node}. Add to order. Neighbors: [${adj[node].join(', ')}].`,
        variables: { node, order: [...order] },
        visualization: makeViz(hl, [...order], [...queue]),
      });

      for (const nb of adj[node]) {
        inDegree[nb]--;
        if (inDegree[nb] === 0) {
          queue.push(nb);
          steps.push({
            line: 14,
            explanation: `Course ${nb} in-degree → 0. All prerequisites met. Enqueue course ${nb}.`,
            variables: { nb, inDegree: [...inDegree] },
            visualization: makeViz({ [node]: 'found', [nb]: 'active' }, [...order], [...queue]),
          });
        } else {
          steps.push({
            line: 13,
            explanation: `Decrement in-degree of course ${nb} to ${inDegree[nb]}. Still has ${inDegree[nb]} unmet prerequisites.`,
            variables: { nb, inDegree: inDegree[nb] },
            visualization: makeViz({ [node]: 'found', [nb]: 'comparing' }, [...order], [...queue]),
          });
        }
      }
    }

    const canFinish = order.length === numCourses;
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < numCourses; i++) {
      finalHighlights[i] = order.includes(i) ? 'found' : 'mismatch';
    }

    steps.push({
      line: 16,
      explanation: canFinish
        ? `All ${numCourses} courses ordered: [${order.join(' → ')}]. Valid topological ordering found.`
        : `Only ${order.length}/${numCourses} courses processed. Cycle detected — return empty array.`,
      variables: { result: canFinish ? order : [] },
      visualization: makeViz(finalHighlights, [...order], []),
    });

    return steps;
  },
};

export default courseScheduleII;
