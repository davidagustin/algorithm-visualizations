import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const canJumpToEnd: AlgorithmDefinition = {
  id: 'can-jump-to-end',
  title: 'Jump Game III',
  leetcodeNumber: 1306,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array and a start index, from index i you can jump to i+arr[i] or i-arr[i]. Determine if you can reach any index with value 0. Use BFS/DFS to explore all reachable indices. Greedy: track visited indices to avoid revisiting.',
  tags: ['greedy', 'BFS', 'DFS', 'array', 'graph'],

  code: {
    pseudocode: `function canReach(arr, start):
  visited = set()
  queue = [start]
  while queue not empty:
    i = queue.pop()
    if arr[i] == 0: return true
    if i in visited: continue
    visited.add(i)
    if i + arr[i] < n: queue.push(i + arr[i])
    if i - arr[i] >= 0: queue.push(i - arr[i])
  return false`,

    python: `def canReach(arr: list[int], start: int) -> bool:
    visited = set()
    queue = [start]
    n = len(arr)
    while queue:
        i = queue.pop()
        if arr[i] == 0:
            return True
        if i in visited:
            continue
        visited.add(i)
        if i + arr[i] < n:
            queue.append(i + arr[i])
        if i - arr[i] >= 0:
            queue.append(i - arr[i])
    return False`,

    javascript: `function canReach(arr, start) {
  const visited = new Set();
  const queue = [start];
  while (queue.length) {
    const i = queue.pop();
    if (arr[i] === 0) return true;
    if (visited.has(i)) continue;
    visited.add(i);
    if (i + arr[i] < arr.length) queue.push(i + arr[i]);
    if (i - arr[i] >= 0) queue.push(i - arr[i]);
  }
  return false;
}`,

    java: `public boolean canReach(int[] arr, int start) {
    Set<Integer> visited = new HashSet<>();
    Deque<Integer> queue = new ArrayDeque<>();
    queue.push(start);
    while (!queue.isEmpty()) {
        int i = queue.pop();
        if (arr[i] == 0) return true;
        if (visited.contains(i)) continue;
        visited.add(i);
        if (i + arr[i] < arr.length) queue.push(i + arr[i]);
        if (i - arr[i] >= 0) queue.push(i - arr[i]);
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
      helperText: 'Jump values at each index',
    },
    {
      name: 'start',
      label: 'Start Index',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Starting index for jumps',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const start = input.start as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start BFS from index ${start} (value=${arr[start]}). Goal: reach any index with value 0.`,
      variables: { start, 'arr[start]': arr[start], zeros: arr.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0).join(',') },
      visualization: makeViz(
        { [start]: 'active', ...Object.fromEntries(arr.map((v, i) => v === 0 ? [i, 'found'] : [i, 'default'])) },
        { [start]: 'start', ...Object.fromEntries(arr.map((v, i) => v === 0 ? [i, 'zero!'] : [i, ''])) }
      ),
    });

    const visited = new Set<number>();
    const queue: number[] = [start];

    while (queue.length > 0) {
      const i = queue.pop()!;

      if (arr[i] === 0) {
        steps.push({
          line: 4,
          explanation: `Reached index ${i} with value 0. Return true!`,
          variables: { i, 'arr[i]': 0, result: true },
          visualization: makeViz(
            { [i]: 'found', ...Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])) },
            { [i]: 'ZERO!', [start]: 'start' }
          ),
        });
        return steps;
      }

      if (visited.has(i)) {
        steps.push({
          line: 5,
          explanation: `Index ${i} already visited. Skip.`,
          variables: { i, visited: Array.from(visited).join(',') },
          visualization: makeViz(
            { [i]: 'comparing', ...Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])) },
            { [i]: 'skip', [start]: 'start' }
          ),
        });
        continue;
      }

      visited.add(i);
      const right = i + arr[i];
      const left = i - arr[i];

      steps.push({
        line: 6,
        explanation: `Visit index ${i} (value=${arr[i]}). Can jump to: right=${right < n ? right : 'out'}, left=${left >= 0 ? left : 'out'}.`,
        variables: { i, 'arr[i]': arr[i], rightJump: right, leftJump: left, visitedCount: visited.size },
        visualization: makeViz(
          {
            [i]: 'active',
            ...(right < n ? { [right]: 'comparing' } : {}),
            ...(left >= 0 ? { [left]: 'pointer' } : {}),
            ...Object.fromEntries(Array.from(visited).filter(v => v !== i).map(v => [v, 'visited'])),
          },
          { [i]: 'cur', ...(right < n ? { [right]: 'right' } : {}), ...(left >= 0 ? { [left]: 'left' } : {}) }
        ),
      });

      if (right < n) queue.push(right);
      if (left >= 0) queue.push(left);
    }

    steps.push({
      line: 9,
      explanation: `Queue exhausted. No index with value 0 is reachable from start=${start}. Return false.`,
      variables: { result: false, visited: Array.from(visited).join(',') },
      visualization: makeViz(
        Object.fromEntries(Array.from(visited).map(v => [v, 'mismatch'])),
        { [start]: 'start' }
      ),
    });

    return steps;
  },
};

export default canJumpToEnd;
