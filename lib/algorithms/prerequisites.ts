import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const prerequisites: AlgorithmDefinition = {
  id: 'prerequisites',
  title: 'Prerequisites',
  leetcodeNumber: 207,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are numCourses courses labeled 0 to numCourses-1. Some have prerequisites: to take course a you must first take course b. Determine if you can finish all courses. Uses Kahn\'s algorithm (BFS topological sort) to detect cycles.',
  tags: ['Graph', 'Topological Sort', 'DFS'],
  code: {
    pseudocode: `function canFinish(numCourses, prerequisites):
  inDegree = array of size numCourses, all 0
  adj = adjacency list
  for each [a, b] in prerequisites:
    adj[b].add(a)
    inDegree[a] += 1
  queue = all nodes with inDegree 0
  order = []
  while queue not empty:
    node = queue.dequeue()
    order.append(node)
    for neighbor in adj[node]:
      inDegree[neighbor] -= 1
      if inDegree[neighbor] == 0:
        queue.enqueue(neighbor)
  return len(order) == numCourses`,
    python: `def canFinish(numCourses, prerequisites):
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
        for neighbor in adj[node]:
            inDegree[neighbor] -= 1
            if inDegree[neighbor] == 0:
                queue.append(neighbor)
    return len(order) == numCourses`,
    javascript: `function canFinish(numCourses, prerequisites) {
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
    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return order.length === numCourses;
}`,
    java: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    int[] inDegree = new int[numCourses];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++)
        if (inDegree[i] == 0) queue.add(i);
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int neighbor : adj.get(node)) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) queue.add(neighbor);
        }
    }
    return order.size() == numCourses;
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
      label: 'Prerequisites',
      type: 'array',
      defaultValue: [[1, 0], [2, 0], [3, 1], [3, 2]],
      placeholder: '[[1,0],[2,0],[3,1],[3,2]]',
      helperText: '[a,b] means you must take course b before course a',
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
      labels: Record<number, string>,
      order: number[],
      queueNodes: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...inDegree],
        highlights,
        labels,
        auxData: {
          label: 'Topological Sort',
          entries: [
            { key: 'Queue', value: queueNodes.length > 0 ? queueNodes.join(', ') : 'empty' },
            { key: 'Order', value: order.length > 0 ? order.join(' -> ') : 'empty' },
            { key: 'Processed', value: `${order.length} / ${numCourses}` },
          ],
        },
      };
    }

    const initLabels: Record<number, string> = {};
    for (let i = 0; i < numCourses; i++) initLabels[i] = `c${i}:${inDegree[i]}`;

    steps.push({
      line: 1,
      explanation: `Build adjacency list and compute in-degrees for ${numCourses} courses. In-degree array shows how many prerequisites each course has.`,
      variables: { numCourses, inDegree: [...inDegree] },
      visualization: makeViz({}, initLabels, [], []),
    });

    // Initialize queue with 0 in-degree nodes
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) queue.push(i);
    }

    const queueHighlights: Record<number, string> = {};
    for (const q of queue) queueHighlights[q] = 'active';

    steps.push({
      line: 6,
      explanation: `Courses with no prerequisites (in-degree 0): [${queue.join(', ')}]. Enqueue them.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        queueHighlights,
        Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `c${i}:${inDegree[i]}`])),
        [],
        [...queue]
      ),
    });

    const order: number[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);

      steps.push({
        line: 8,
        explanation: `Dequeue course ${node}. Add to topological order. Process its dependents: [${adj[node].join(', ')}].`,
        variables: { node, order: [...order], queueSize: queue.length },
        visualization: makeViz(
          { [node]: 'found' },
          Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `c${i}:${inDegree[i]}`])),
          [...order],
          [...queue]
        ),
      });

      for (const neighbor of adj[node]) {
        inDegree[neighbor]--;

        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
          steps.push({
            line: 12,
            explanation: `Course ${neighbor}'s in-degree drops to 0. All its prerequisites are met. Enqueue it.`,
            variables: { neighbor, inDegree: [...inDegree] },
            visualization: makeViz(
              { [node]: 'found', [neighbor]: 'active' },
              Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `c${i}:${inDegree[i]}`])),
              [...order],
              [...queue]
            ),
          });
        } else {
          steps.push({
            line: 11,
            explanation: `Decrement in-degree of course ${neighbor} to ${inDegree[neighbor]}. Still has unmet prerequisites.`,
            variables: { neighbor, newInDegree: inDegree[neighbor] },
            visualization: makeViz(
              { [node]: 'found', [neighbor]: 'comparing' },
              Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `c${i}:${inDegree[i]}`])),
              [...order],
              [...queue]
            ),
          });
        }
      }
    }

    // Final
    const canFinish = order.length === numCourses;
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < numCourses; i++) {
      finalHighlights[i] = order.includes(i) ? 'found' : 'mismatch';
    }

    steps.push({
      line: 14,
      explanation: canFinish
        ? `All ${numCourses} courses processed. Topological order: [${order.join(' -> ')}]. Can finish all courses!`
        : `Only ${order.length} of ${numCourses} courses processed. Cycle detected. Cannot finish all courses.`,
      variables: { result: canFinish, order: [...order] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `c${i}`])),
        [...order],
        []
      ),
    });

    return steps;
  },
};

export default prerequisites;
