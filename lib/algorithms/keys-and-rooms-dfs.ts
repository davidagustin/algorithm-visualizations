import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const keysAndRoomsDfs: AlgorithmDefinition = {
  id: 'keys-and-rooms-dfs',
  title: 'Keys and Rooms (DFS)',
  leetcodeNumber: 841,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are n rooms (0 to n-1). Room 0 is unlocked. Each room contains keys to other rooms. Can you visit all rooms? Model as a directed graph where room i has edges to rooms whose keys it contains. DFS from room 0 and check if all rooms are visited.',
  tags: ['dfs', 'graph', 'room traversal'],

  code: {
    pseudocode: `function canVisitAllRooms(rooms):
  n = len(rooms)
  visited = {0}  // room 0 is unlocked
  stack = [0]

  while stack not empty:
    room = stack.pop()
    for key in rooms[room]:
      if key not in visited:
        visited.add(key)
        stack.push(key)

  return len(visited) == n`,

    python: `def canVisitAllRooms(rooms):
    n = len(rooms)
    visited = {0}
    stack = [0]
    while stack:
        room = stack.pop()
        for key in rooms[room]:
            if key not in visited:
                visited.add(key)
                stack.append(key)
    return len(visited) == n`,

    javascript: `function canVisitAllRooms(rooms) {
  const n = rooms.length;
  const visited = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const room = stack.pop();
    for (const key of rooms[room]) {
      if (!visited.has(key)) {
        visited.add(key);
        stack.push(key);
      }
    }
  }
  return visited.size === n;
}`,

    java: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
    int n = rooms.size();
    Set<Integer> visited = new HashSet<>();
    visited.add(0);
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(0);
    while (!stack.isEmpty()) {
        int room = stack.pop();
        for (int key : rooms.get(room)) {
            if (!visited.contains(key)) {
                visited.add(key);
                stack.push(key);
            }
        }
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
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Keys found in each room (room 0 keys, room 1 keys, etc.)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rooms = input.rooms as number[][];
    const steps: AlgorithmStep[] = [];
    const n = rooms.length;

    steps.push({
      line: 1,
      explanation: `${n} rooms. Start in room 0 (unlocked). Keys in room i open other rooms. DFS to check all rooms reachable.`,
      variables: { n, startRoom: 0 },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => rooms[i].length),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `R${i}:[${rooms[i].join(',')}]`])),
      } as ArrayVisualization,
    });

    const visited = new Set<number>([0]);
    const stack: number[] = [0];

    while (stack.length > 0) {
      const room = stack.pop()!;
      const keys = rooms[room];

      steps.push({
        line: 4,
        explanation: `Enter room ${room}. Found keys: [${keys.join(', ')}]. Total visited: ${visited.size}/${n}.`,
        variables: { room, keys: keys.join(','), visited: visited.size },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
          highlights: {
            [room]: 'active',
            ...Object.fromEntries([...visited].filter(v => v !== room).map(v => [v, 'visited'])),
          },
          labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'unlocked' : 'locked'])),
        } as ArrayVisualization,
      });

      for (const key of keys) {
        if (!visited.has(key)) {
          visited.add(key);
          stack.push(key);
          steps.push({
            line: 7,
            explanation: `Key ${key} found in room ${room}. Room ${key} unlocked and added to DFS stack.`,
            variables: { keyFound: key, fromRoom: room, stackSize: stack.length },
            visualization: {
              type: 'array',
              array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
              highlights: {
                [room]: 'active',
                [key]: 'comparing',
                ...Object.fromEntries([...visited].filter(v => v !== room && v !== key).map(v => [v, 'visited'])),
              },
              labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'unlocked' : 'locked'])),
            } as ArrayVisualization,
          });
        } else {
          steps.push({
            line: 6,
            explanation: `Key ${key} found in room ${room} but room ${key} already visited. Skip.`,
            variables: { keyFound: key, alreadyVisited: true },
            visualization: {
              type: 'array',
              array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
              highlights: { [room]: 'active', [key]: 'sorted' },
              labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'visited' : 'locked'])),
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 18) break;
    }

    const result = visited.size === n;
    steps.push({
      line: 10,
      explanation: `DFS complete. Visited ${visited.size} of ${n} rooms. ${result ? 'All rooms visited - return true.' : 'Some rooms unreachable - return false.'}`,
      variables: { result, visited: visited.size, total: n },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'visited' : 'missed'])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default keysAndRoomsDfs;
