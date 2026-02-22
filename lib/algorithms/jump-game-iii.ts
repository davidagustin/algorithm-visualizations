import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpGameIii: AlgorithmDefinition = {
  id: 'jump-game-iii',
  title: 'Jump Game III',
  leetcodeNumber: 1306,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an array of non-negative integers and a start index, you can jump from index i to i+arr[i] or i-arr[i]. Return true if you can reach any index with value 0. Use BFS or DFS to explore reachable indices, tracking visited to avoid cycles.',
  tags: ['bfs', 'dfs', 'graph', 'array', 'jump game'],

  code: {
    pseudocode: `function canReach(arr, start):
  queue = [start]
  visited = {start}
  while queue not empty:
    i = dequeue()
    if arr[i] == 0: return true
    for next in [i + arr[i], i - arr[i]]:
      if 0 <= next < n and next not in visited:
        visited.add(next)
        enqueue(next)
  return false`,

    python: `from collections import deque

def canReach(arr, start):
    n = len(arr)
    queue = deque([start])
    visited = {start}
    while queue:
        i = queue.popleft()
        if arr[i] == 0:
            return True
        for nxt in [i + arr[i], i - arr[i]]:
            if 0 <= nxt < n and nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return False`,

    javascript: `function canReach(arr, start) {
  const n = arr.length;
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length) {
    const i = queue.shift();
    if (arr[i] === 0) return true;
    for (const nxt of [i + arr[i], i - arr[i]]) {
      if (nxt >= 0 && nxt < n && !visited.has(nxt)) {
        visited.add(nxt);
        queue.push(nxt);
      }
    }
  }
  return false;
}`,

    java: `public boolean canReach(int[] arr, int start) {
    int n = arr.length;
    Queue<Integer> queue = new LinkedList<>();
    Set<Integer> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    while (!queue.isEmpty()) {
        int i = queue.poll();
        if (arr[i] == 0) return true;
        int[] nexts = {i + arr[i], i - arr[i]};
        for (int nxt : nexts) {
            if (nxt >= 0 && nxt < n && !visited.contains(nxt)) {
                visited.add(nxt);
                queue.offer(nxt);
            }
        }
    }
    return false;
}`,
  },

  defaultInput: {
    arr: [4, 2, 3, 0, 3, 1, 2],
    start: 5,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 3, 0, 3, 1, 2],
      placeholder: '4,2,3,0,3,1,2',
      helperText: 'Non-negative integers',
    },
    {
      name: 'start',
      label: 'Start Index',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Starting index',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const start = input.start as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Initialize BFS from index ${start} (value ${arr[start]}). Goal: reach any index with value 0.`,
      variables: { start, startValue: arr[start], n },
      visualization: {
        type: 'array',
        array: arr,
        highlights: { [start]: 'active' },
        labels: { [start]: 'start' },
      } as ArrayVisualization,
    });

    const queue: number[] = [start];
    const visited = new Set<number>([start]);

    while (queue.length > 0) {
      const i = queue.shift()!;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      visited.forEach(v => { highlights[v] = 'visited'; });
      highlights[i] = 'active';
      labels[i] = 'cur';

      steps.push({
        line: 5,
        explanation: `Visiting index ${i} with value ${arr[i]}. ${arr[i] === 0 ? 'Value is 0 - found!' : `Can jump to ${i + arr[i]} or ${i - arr[i]}.`}`,
        variables: { index: i, value: arr[i], visited: visited.size },
        visualization: {
          type: 'array',
          array: arr,
          highlights,
          labels,
        } as ArrayVisualization,
      });

      if (arr[i] === 0) {
        const finalHighlights: Record<number, string> = {};
        visited.forEach(v => { finalHighlights[v] = 'visited'; });
        finalHighlights[i] = 'found';
        steps.push({
          line: 6,
          explanation: `Index ${i} has value 0. Reached a zero index! Return true.`,
          variables: { result: true, zeroIndex: i },
          visualization: {
            type: 'array',
            array: arr,
            highlights: finalHighlights,
            labels: { [i]: 'ZERO!' },
          } as ArrayVisualization,
        });
        return steps;
      }

      for (const nxt of [i + arr[i], i - arr[i]]) {
        if (nxt >= 0 && nxt < n && !visited.has(nxt)) {
          visited.add(nxt);
          queue.push(nxt);

          const newHighlights: Record<number, string> = {};
          visited.forEach(v => { newHighlights[v] = 'visited'; });
          newHighlights[i] = 'active';
          newHighlights[nxt] = 'comparing';

          steps.push({
            line: 8,
            explanation: `Add index ${nxt} (value ${arr[nxt]}) to queue from jump at index ${i}.`,
            variables: { from: i, to: nxt, queueSize: queue.length },
            visualization: {
              type: 'array',
              array: arr,
              highlights: newHighlights,
              labels: { [i]: 'cur', [nxt]: 'new' },
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 20) break;
    }

    steps.push({
      line: 10,
      explanation: 'BFS exhausted all reachable indices. No zero index found. Return false.',
      variables: { result: false },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries([...visited].map(v => [v, 'visited'])),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default jumpGameIii;
