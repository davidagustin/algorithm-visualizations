import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const keysAndRoomsII: AlgorithmDefinition = {
  id: 'keys-and-rooms-ii',
  title: 'Keys and Rooms II',
  leetcodeNumber: 841,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are n rooms numbered 0 to n-1. You start in room 0. Each room has a list of keys to other rooms. You can visit a room only if you have its key. Determine if you can visit all rooms. Classic DFS/BFS reachability from node 0.',
  tags: ['Graph', 'DFS', 'BFS', 'Reachability'],
  code: {
    pseudocode: `function canVisitAllRooms(rooms):
  visited = set()
  stack = [0]
  while stack not empty:
    room = stack.pop()
    if room in visited: continue
    visited.add(room)
    for key in rooms[room]:
      if key not in visited: stack.push(key)
  return len(visited) == len(rooms)`,
    python: `def canVisitAllRooms(rooms):
    visited = set()
    stack = [0]
    while stack:
        room = stack.pop()
        if room in visited: continue
        visited.add(room)
        for key in rooms[room]:
            if key not in visited:
                stack.append(key)
    return len(visited) == len(rooms)`,
    javascript: `function canVisitAllRooms(rooms) {
  const visited = new Set();
  const stack = [0];
  while (stack.length > 0) {
    const room = stack.pop();
    if (visited.has(room)) continue;
    visited.add(room);
    for (const key of rooms[room]) {
      if (!visited.has(key)) stack.push(key);
    }
  }
  return visited.size === rooms.length;
}`,
    java: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
    int n = rooms.size();
    Set<Integer> visited = new HashSet<>();
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(0);
    while (!stack.isEmpty()) {
        int room = stack.pop();
        if (visited.contains(room)) continue;
        visited.add(room);
        for (int key : rooms.get(room))
            if (!visited.contains(key)) stack.push(key);
    }
    return visited.size() == n;
}`,
  },
  defaultInput: {
    rooms: [[1],[2],[3],[]],
  },
  inputFields: [
    {
      name: 'rooms',
      label: 'Rooms (keys in each room)',
      type: 'array',
      defaultValue: [[1],[2],[3],[]],
      placeholder: '[[1],[2],[3],[]]',
      helperText: 'rooms[i] = keys found in room i',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rooms = input.rooms as number[][];
    const n = rooms.length;
    const steps: AlgorithmStep[] = [];

    const visited = new Set<number>();
    const stack: number[] = [0];

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
        highlights,
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `R${i}:${visited.has(i) ? 'open' : 'locked'}`])),
        auxData: {
          label: 'Keys and Rooms',
          entries: [
            { key: 'Visited Rooms', value: [...visited].sort((a,b)=>a-b).join(', ') || 'none' },
            { key: 'Stack', value: stack.join(', ') || 'empty' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} rooms. Start in room 0 (always unlocked). DFS using stack. Rooms[i] = keys found in room i.`,
      variables: { n, stack: [0] },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])), 'Start: room 0 in stack'),
    });

    while (stack.length > 0) {
      const room = stack.pop()!;

      if (visited.has(room)) {
        steps.push({
          line: 4,
          explanation: `Pop room ${room} from stack — already visited. Skip.`,
          variables: { room, visited: [...visited] },
          visualization: makeViz({ [room]: 'visited' }, `Skip room ${room}`),
        });
        continue;
      }

      visited.add(room);
      const keys = rooms[room];

      const newKeys = keys.filter(k => !visited.has(k));
      for (const key of newKeys) stack.push(key);

      const h: Record<number, string> = {};
      for (let i = 0; i < n; i++) h[i] = visited.has(i) ? 'sorted' : 'default';
      h[room] = 'found';
      for (const k of keys) if (h[k] !== 'sorted') h[k] = 'active';

      steps.push({
        line: 5,
        explanation: `Enter room ${room}. Found keys: [${keys.join(', ')}]. New rooms to visit: [${newKeys.join(', ')}]. Visited: ${visited.size}/${n}.`,
        variables: { room, keys, newKeys, visitedCount: visited.size },
        visualization: makeViz(h, `Room ${room} opened, got keys ${keys.join(',')}`),
      });
    }

    const allVisited = visited.size === n;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = visited.has(i) ? 'found' : 'mismatch';

    steps.push({
      line: 9,
      explanation: allVisited
        ? `Visited all ${n} rooms! Return true.`
        : `Only visited ${visited.size}/${n} rooms. Rooms ${Array.from({length:n},(_,i)=>i).filter(i=>!visited.has(i)).join(', ')} are unreachable. Return false.`,
      variables: { result: allVisited, visitedCount: visited.size },
      visualization: makeViz(finalH, `Result: ${allVisited}`),
    });

    return steps;
  },
};

export default keysAndRoomsII;
