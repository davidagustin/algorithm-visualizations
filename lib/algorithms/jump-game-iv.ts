import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jumpGameIv: AlgorithmDefinition = {
  id: 'jump-game-iv',
  title: 'Jump Game IV',
  leetcodeNumber: 1345,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an integer array, you start at index 0 and can jump to i+1, i-1, or any index j where arr[i] == arr[j]. Find the minimum number of steps to reach the last index. BFS with a value-to-indices map enables teleportation jumps between same-value indices.',
  tags: ['bfs', 'graph', 'jump game', 'hash map'],

  code: {
    pseudocode: `function minJumps(arr):
  n = len(arr)
  if n == 1: return 0
  valueMap = map each value to its indices
  queue = [0], visited = {0}, steps = 0
  while queue not empty:
    steps += 1
    for each i in current level:
      for each neighbor in [i-1, i+1] + valueMap[arr[i]]:
        if neighbor == n-1: return steps
        if neighbor not visited:
          visited.add(neighbor)
          enqueue(neighbor)
      clear valueMap[arr[i]]  // avoid revisiting
  return -1`,

    python: `from collections import deque, defaultdict

def minJumps(arr):
    n = len(arr)
    if n == 1: return 0
    value_map = defaultdict(list)
    for i, v in enumerate(arr):
        value_map[v].append(i)
    queue = deque([0])
    visited = {0}
    steps = 0
    while queue:
        steps += 1
        for _ in range(len(queue)):
            i = queue.popleft()
            neighbors = [i-1, i+1] + value_map[arr[i]]
            value_map[arr[i]] = []
            for j in neighbors:
                if j == n-1: return steps
                if 0 <= j < n and j not in visited:
                    visited.add(j)
                    queue.append(j)
    return -1`,

    javascript: `function minJumps(arr) {
  const n = arr.length;
  if (n === 1) return 0;
  const valueMap = new Map();
  for (let i = 0; i < n; i++) {
    if (!valueMap.has(arr[i])) valueMap.set(arr[i], []);
    valueMap.get(arr[i]).push(i);
  }
  let queue = [0];
  const visited = new Set([0]);
  let steps = 0;
  while (queue.length) {
    steps++;
    const next = [];
    for (const i of queue) {
      const same = valueMap.get(arr[i]) || [];
      valueMap.set(arr[i], []);
      for (const j of [i-1, i+1, ...same]) {
        if (j === n-1) return steps;
        if (j >= 0 && j < n && !visited.has(j)) {
          visited.add(j);
          next.push(j);
        }
      }
    }
    queue = next;
  }
  return -1;
}`,

    java: `public int minJumps(int[] arr) {
    int n = arr.length;
    if (n == 1) return 0;
    Map<Integer, List<Integer>> valueMap = new HashMap<>();
    for (int i = 0; i < n; i++) {
        valueMap.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
    }
    Queue<Integer> queue = new LinkedList<>(Arrays.asList(0));
    Set<Integer> visited = new HashSet<>(Arrays.asList(0));
    int steps = 0;
    while (!queue.isEmpty()) {
        steps++;
        int size = queue.size();
        while (size-- > 0) {
            int i = queue.poll();
            List<Integer> same = valueMap.getOrDefault(arr[i], new ArrayList<>());
            valueMap.put(arr[i], new ArrayList<>());
            for (int j : new int[]{i-1, i+1}) {
                if (j == n-1) return steps;
                if (j >= 0 && j < n && !visited.contains(j)) { visited.add(j); queue.offer(j); }
            }
            for (int j : same) {
                if (j == n-1) return steps;
                if (!visited.contains(j)) { visited.add(j); queue.offer(j); }
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    arr: [100, -23, -23, 404, 100, 23, 23, 23, 3, 404],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [100, -23, -23, 404, 100, 23, 23, 23, 3, 404],
      placeholder: '100,-23,-23,404,100,23,23,23,3,404',
      helperText: 'Integer array for jump game',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Array has ${n} elements. Start at index 0, goal is index ${n - 1}. Building value-to-indices map for teleportation jumps.`,
      variables: { n, start: 0, target: n - 1 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: { 0: 'active', [n - 1]: 'pointer' },
        labels: { 0: 'start', [n - 1]: 'target' },
      } as ArrayVisualization,
    });

    if (n === 1) {
      steps.push({
        line: 2,
        explanation: 'Array has only one element. Already at the last index. Return 0.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: arr,
          highlights: { 0: 'found' },
          labels: { 0: 'start=target' },
        } as ArrayVisualization,
      });
      return steps;
    }

    const valueMap = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      if (!valueMap.has(arr[i])) valueMap.set(arr[i], []);
      valueMap.get(arr[i])!.push(i);
    }

    steps.push({
      line: 3,
      explanation: `Value map built. Value ${arr[0]} appears at indices: [${valueMap.get(arr[0])?.join(', ')}]. These enable teleportation.`,
      variables: { uniqueValues: valueMap.size },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(
          (valueMap.get(arr[0]) ?? []).map(i => [i, 'comparing'])
        ),
        labels: { 0: 'val=' + arr[0] },
      } as ArrayVisualization,
    });

    let queue: number[] = [0];
    const visited = new Set<number>([0]);
    let stepCount = 0;

    while (queue.length > 0) {
      stepCount++;
      const next: number[] = [];
      const levelHighlights: Record<number, string> = {};
      visited.forEach(v => { levelHighlights[v] = 'visited'; });
      queue.forEach(v => { levelHighlights[v] = 'active'; });

      steps.push({
        line: 6,
        explanation: `Step ${stepCount}: Processing ${queue.length} node(s) in BFS frontier.`,
        variables: { step: stepCount, frontierSize: queue.length, visited: visited.size },
        visualization: {
          type: 'array',
          array: arr,
          highlights: levelHighlights,
          labels: Object.fromEntries(queue.map(i => [i, 'step' + stepCount])),
        } as ArrayVisualization,
      });

      for (const i of queue) {
        const same = valueMap.get(arr[i]) ?? [];
        valueMap.set(arr[i], []);
        for (const j of [i - 1, i + 1, ...same]) {
          if (j === n - 1) {
            steps.push({
              line: 9,
              explanation: `Reached last index ${n - 1} in ${stepCount} step(s). Return ${stepCount}.`,
              variables: { result: stepCount, lastIndex: n - 1 },
              visualization: {
                type: 'array',
                array: arr,
                highlights: { ...levelHighlights, [n - 1]: 'found' },
                labels: { [n - 1]: 'DONE!' },
              } as ArrayVisualization,
            });
            return steps;
          }
          if (j >= 0 && j < n && !visited.has(j)) {
            visited.add(j);
            next.push(j);
          }
        }
      }
      queue = next;
      if (steps.length > 20) break;
    }

    steps.push({
      line: 13,
      explanation: 'BFS complete. Minimum steps computed above.',
      variables: { visited: visited.size },
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

export default jumpGameIv;
