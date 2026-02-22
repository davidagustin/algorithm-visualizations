import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const keysAndRooms: AlgorithmDefinition = {
  id: 'keys-and-rooms',
  title: 'Keys and Rooms',
  leetcodeNumber: 841,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are n rooms (0 to n-1). You start in room 0. Each room contains keys to other rooms. Can you visit all rooms? Use DFS/BFS: start from room 0, collect keys, unlock and visit new rooms. Return true if all rooms visited.',
  tags: ['Graph', 'DFS', 'BFS'],
  code: {
    pseudocode: `function canVisitAllRooms(rooms):
  visited = set()
  stack = [0]
  while stack:
    room = stack.pop()
    if room in visited: continue
    visited.add(room)
    for key in rooms[room]:
      if key not in visited:
        stack.push(key)
  return len(visited) == len(rooms)`,
    python: `def canVisitAllRooms(rooms):
    visited = set()
    stack = [0]
    while stack:
        room = stack.pop()
        if room in visited:
            continue
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
    for (const key of rooms[room])
      if (!visited.has(key)) stack.push(key);
  }
  return visited.size === rooms.length;
}`,
    java: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
    Set<Integer> visited = new HashSet<>();
    Stack<Integer> stack = new Stack<>();
    stack.push(0);
    while (!stack.isEmpty()) {
        int room = stack.pop();
        if (visited.contains(room)) continue;
        visited.add(room);
        for (int key : rooms.get(room))
            if (!visited.contains(key)) stack.push(key);
    }
    return visited.size() == rooms.size();
}`,
  },
  defaultInput: {
    rooms: [[1], [2], [3], []],
  },
  inputFields: [
    {
      name: 'rooms',
      label: 'Rooms (each room contains keys)',
      type: 'array',
      defaultValue: [[1], [2], [3], []],
      placeholder: '[[1],[2],[3],[]]',
      helperText: 'rooms[i] = list of keys found in room i. Start in room 0.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rooms = input.rooms as number[][];
    const n = rooms.length;
    const steps: AlgorithmStep[] = [];

    const visited = new Set<number>();
    const stack: number[] = [0];

    function makeViz(
      highlights: Record<number, string>,
      currentRoom: number | null,
      stackArr: number[]
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `r${i}:[${rooms[i].join(',')}]`;
      }
      return {
        type: 'array',
        array: rooms.map(r => r.length),
        highlights,
        labels,
        auxData: {
          label: 'Room Exploration',
          entries: [
            { key: 'Current room', value: currentRoom !== null ? String(currentRoom) : '—' },
            { key: 'Stack', value: stackArr.length > 0 ? stackArr.join(', ') : 'empty' },
            { key: 'Visited', value: visited.size > 0 ? [...visited].sort((a, b) => a - b).join(', ') : 'none' },
            { key: 'Progress', value: `${visited.size} / ${n}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} rooms. Start in room 0. Array shows number of keys in each room. DFS: visit rooms, collect keys, unlock new rooms.`,
      variables: { n },
      visualization: makeViz({ 0: 'active' }, null, [0]),
    });

    while (stack.length > 0) {
      const room = stack.pop()!;

      if (visited.has(room)) {
        steps.push({
          line: 5,
          explanation: `Pop room ${room} from stack. Already visited — skip.`,
          variables: { room, visited: [...visited] },
          visualization: makeViz({ [room]: 'visited' }, room, [...stack]),
        });
        continue;
      }

      visited.add(room);
      const keys = rooms[room];

      steps.push({
        line: 6,
        explanation: `Enter room ${room}. Found keys: [${keys.join(', ') || 'none'}]. Visited: {${[...visited].sort((a, b) => a - b).join(', ')}}.`,
        variables: { room, keys, visitedCount: visited.size },
        visualization: makeViz(
          { [room]: 'found', ...Object.fromEntries(keys.filter(k => !visited.has(k)).map(k => [k, 'active'])) },
          room,
          [...stack]
        ),
      });

      for (const key of keys) {
        if (!visited.has(key)) {
          stack.push(key);
          steps.push({
            line: 8,
            explanation: `Key ${key} found in room ${room}. Unlock and add room ${key} to stack.`,
            variables: { key, stackSize: stack.length },
            visualization: makeViz({ [room]: 'found', [key]: 'comparing' }, room, [...stack]),
          });
        }
      }
    }

    const canVisit = visited.size === n;
    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHL[i] = visited.has(i) ? 'found' : 'mismatch';
    }

    steps.push({
      line: 10,
      explanation: canVisit
        ? `All ${n} rooms visited! Return true.`
        : `Only ${visited.size}/${n} rooms reachable. Rooms ${Array.from({ length: n }, (_, i) => i).filter(i => !visited.has(i)).join(', ')} are locked. Return false.`,
      variables: { result: canVisit, visited: [...visited] },
      visualization: makeViz(finalHL, null, []),
    });

    return steps;
  },
};

export default keysAndRooms;
