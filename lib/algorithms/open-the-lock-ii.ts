import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const openTheLockII: AlgorithmDefinition = {
  id: 'open-the-lock-ii',
  title: 'Open the Lock II',
  leetcodeNumber: 752,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A lock has 4 wheels (0-9). Start at "0000". Given deadend combinations and a target, find minimum turns to reach the target avoiding deadends. Each turn rotates one wheel up or down by one. Use BFS for shortest path.',
  tags: ['Graph', 'BFS', 'Shortest Path'],
  code: {
    pseudocode: `function openLock(deadends, target):
  dead = set(deadends)
  if "0000" in dead: return -1
  queue = deque(["0000"]), visited = {"0000"}
  steps = 0
  while queue:
    for _ in range(len(queue)):
      curr = queue.popleft()
      if curr == target: return steps
      for i in 0..3:
        for d in [-1, +1]:
          next = rotate(curr, i, d)
          if next not in visited and next not in dead:
            visited.add(next); queue.append(next)
    steps++
  return -1`,
    python: `def openLock(deadends, target):
    dead = set(deadends)
    if '0000' in dead: return -1
    visited = {'0000'}
    queue = deque(['0000'])
    steps = 0
    while queue:
        for _ in range(len(queue)):
            curr = queue.popleft()
            if curr == target: return steps
            for i in range(4):
                for d in [-1, 1]:
                    c = list(curr)
                    c[i] = str((int(c[i]) + d) % 10)
                    nxt = ''.join(c)
                    if nxt not in visited and nxt not in dead:
                        visited.add(nxt); queue.append(nxt)
        steps += 1
    return -1`,
    javascript: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has('0000')) return -1;
  const visited = new Set(['0000']);
  const queue = ['0000'];
  let steps = 0;
  while (queue.length > 0) {
    const size = queue.length;
    for (let k = 0; k < size; k++) {
      const curr = queue.shift();
      if (curr === target) return steps;
      for (let i = 0; i < 4; i++) {
        for (const d of [-1, 1]) {
          const arr = curr.split('');
          arr[i] = String((+arr[i] + d + 10) % 10);
          const nxt = arr.join('');
          if (!visited.has(nxt) && !dead.has(nxt)) {
            visited.add(nxt); queue.push(nxt);
          }
        }
      }
    }
    steps++;
  }
  return -1;
}`,
    java: `public int openLock(String[] deadends, String target) {
    Set<String> dead=new HashSet<>(Arrays.asList(deadends));
    if (dead.contains("0000")) return -1;
    Set<String> visited=new HashSet<>();
    Queue<String> q=new LinkedList<>();
    q.offer("0000"); visited.add("0000");
    int steps=0;
    while (!q.isEmpty()) {
        int sz=q.size();
        for (int k=0;k<sz;k++) {
            String curr=q.poll();
            if (curr.equals(target)) return steps;
            for (int i=0;i<4;i++) for (int d:new int[]{-1,1}) {
                char[] arr=curr.toCharArray();
                arr[i]=(char)((arr[i]-'0'+d+10)%10+'0');
                String nxt=new String(arr);
                if (!visited.contains(nxt)&&!dead.contains(nxt)){visited.add(nxt);q.offer(nxt);}
            }
        }
        steps++;
    }
    return -1;
}`,
  },
  defaultInput: {
    deadends: ['0201','0101','0102','1212','2002'],
    target: '0202',
  },
  inputFields: [
    {
      name: 'deadends',
      label: 'Deadends',
      type: 'array',
      defaultValue: ['0201','0101','0102','1212','2002'],
      placeholder: '["0201","0101"]',
      helperText: 'Forbidden combinations',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'string',
      defaultValue: '0202',
      placeholder: '0202',
      helperText: '4-digit target combination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const deadends = input.deadends as string[];
    const target = input.target as string;
    const steps: AlgorithmStep[] = [];

    const dead = new Set(deadends);
    const visited = new Set<string>();
    const bfsStates: string[] = [];

    function makeViz(highlights: Record<number, string>, stateArr: string[], extra: string): ArrayVisualization {
      const displayArr = stateArr.map(s => {
        const digits = s.split('').map(Number);
        return digits.reduce((acc, d, i) => acc + d * Math.pow(10, 3 - i), 0);
      });
      return {
        type: 'array',
        array: displayArr.length > 0 ? displayArr : [0],
        highlights,
        labels: Object.fromEntries(stateArr.map((s, i) => [i, s])),
        auxData: {
          label: 'Open the Lock (BFS)',
          entries: [
            { key: 'Target', value: target },
            { key: 'Deadends', value: deadends.slice(0, 3).join(', ') + (deadends.length > 3 ? '...' : '') },
            { key: 'Visited', value: String(visited.size) },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    if (dead.has('0000')) {
      steps.push({
        line: 1,
        explanation: `"0000" is a deadend. Cannot start. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({ 0: 'mismatch' }, ['0000'], 'Start is deadend'),
      });
      return steps;
    }

    visited.add('0000');
    let queue: string[] = ['0000'];
    let numSteps = 0;
    let result = -1;

    steps.push({
      line: 2,
      explanation: `Start BFS from "0000". Target: "${target}". ${deadends.length} deadends to avoid.`,
      variables: { target, deadendCount: deadends.length },
      visualization: makeViz({ 0: 'active' }, ['0000'], 'BFS started'),
    });

    bfsStates.push('0000');

    outer: while (queue.length > 0) {
      const size = queue.length;
      const levelStates: string[] = [];

      for (let k = 0; k < size; k++) {
        const curr = queue.shift()!;

        if (curr === target) {
          result = numSteps;
          steps.push({
            line: 7,
            explanation: `Reached target "${target}" in ${numSteps} step(s)!`,
            variables: { result: numSteps, curr },
            visualization: makeViz({ 0: 'found' }, [curr], `Found in ${numSteps} steps!`),
          });
          break outer;
        }

        for (let i = 0; i < 4; i++) {
          for (const d of [-1, 1]) {
            const arr = curr.split('');
            arr[i] = String((+arr[i] + d + 10) % 10);
            const nxt = arr.join('');
            if (!visited.has(nxt) && !dead.has(nxt)) {
              visited.add(nxt);
              queue.push(nxt);
              levelStates.push(nxt);
            }
          }
        }
      }

      if (levelStates.length > 0) {
        const h: Record<number, string> = {};
        const displayStates = levelStates.slice(0, 6);
        for (let i = 0; i < displayStates.length; i++) {
          h[i] = displayStates[i] === target ? 'found' : 'active';
        }
        steps.push({
          line: 11,
          explanation: `BFS level ${numSteps + 1}: expanded to ${levelStates.length} new states. Total visited: ${visited.size}.`,
          variables: { level: numSteps + 1, newStates: levelStates.length, visited: visited.size },
          visualization: makeViz(h, displayStates, `Level ${numSteps + 1}, ${visited.size} visited`),
        });
      }

      numSteps++;
    }

    if (result === -1) {
      steps.push({
        line: 16,
        explanation: `Target "${target}" unreachable. All paths blocked by deadends. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({ 0: 'mismatch' }, [target], 'Unreachable'),
      });
    }

    return steps;
  },
};

export default openTheLockII;
