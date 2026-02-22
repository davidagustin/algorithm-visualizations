import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumJumpsToReachHome: AlgorithmDefinition = {
  id: 'minimum-jumps-to-reach-home',
  title: 'Minimum Jumps to Reach Home',
  leetcodeNumber: 1654,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A bug starts at position 0 and wants to reach position x. It can jump forward by a or backward by b, but cannot jump backward twice in a row or land on forbidden positions. Find the minimum jumps to reach x using BFS. State is (position, lastJumpWasBackward).',
  tags: ['bfs', 'graph', 'state machine', 'shortest path'],

  code: {
    pseudocode: `function minimumJumps(forbidden, a, b, x):
  forbiddenSet = set(forbidden)
  maxPos = max(x, max(forbidden)) + a + b
  queue = [(0, false, 0)]  // pos, lastBackward, jumps
  visited = {(0, false)}
  while queue not empty:
    pos, lastBack, jumps = dequeue()
    // try forward jump
    fwd = pos + a
    if fwd <= maxPos and fwd not forbidden and (fwd,false) not visited:
      if fwd == x: return jumps+1
      enqueue(fwd, false, jumps+1)
    // try backward jump (only if last was not backward)
    if not lastBack:
      bwd = pos - b
      if bwd >= 0 and bwd not forbidden and (bwd,true) not visited:
        enqueue(bwd, true, jumps+1)
  return -1`,

    python: `from collections import deque

def minimumJumps(forbidden, a, b, x):
    forbidden_set = set(forbidden)
    max_pos = max(x, max(forbidden, default=0)) + a + b
    queue = deque([(0, False, 0)])
    visited = {(0, False)}
    while queue:
        pos, last_back, jumps = queue.popleft()
        fwd = pos + a
        if fwd <= max_pos and fwd not in forbidden_set and (fwd, False) not in visited:
            if fwd == x: return jumps + 1
            visited.add((fwd, False))
            queue.append((fwd, False, jumps + 1))
        if not last_back:
            bwd = pos - b
            if bwd >= 0 and bwd not in forbidden_set and (bwd, True) not in visited:
                if bwd == x: return jumps + 1
                visited.add((bwd, True))
                queue.append((bwd, True, jumps + 1))
    return -1`,

    javascript: `function minimumJumps(forbidden, a, b, x) {
  const forbiddenSet = new Set(forbidden);
  const maxPos = Math.max(x, ...forbidden, 0) + a + b;
  const queue = [[0, false, 0]];
  const visited = new Set(['0,false']);
  while (queue.length) {
    const [pos, lastBack, jumps] = queue.shift();
    const fwd = pos + a;
    if (fwd <= maxPos && !forbiddenSet.has(fwd) && !visited.has(fwd+',false')) {
      if (fwd === x) return jumps + 1;
      visited.add(fwd+',false');
      queue.push([fwd, false, jumps + 1]);
    }
    if (!lastBack) {
      const bwd = pos - b;
      if (bwd >= 0 && !forbiddenSet.has(bwd) && !visited.has(bwd+',true')) {
        if (bwd === x) return jumps + 1;
        visited.add(bwd+',true');
        queue.push([bwd, true, jumps + 1]);
      }
    }
  }
  return -1;
}`,

    java: `public int minimumJumps(int[] forbidden, int a, int b, int x) {
    Set<Integer> forbiddenSet = new HashSet<>();
    int maxPos = x;
    for (int f : forbidden) { forbiddenSet.add(f); maxPos = Math.max(maxPos, f); }
    maxPos += a + b;
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, 0}); // pos, lastBack(0/1), jumps
    Set<String> visited = new HashSet<>();
    visited.add("0,0");
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int pos = cur[0]; boolean lastBack = cur[1]==1; int jumps = cur[2];
        int fwd = pos + a;
        if (fwd <= maxPos && !forbiddenSet.contains(fwd) && !visited.contains(fwd+",0")) {
            if (fwd == x) return jumps + 1;
            visited.add(fwd+",0"); queue.offer(new int[]{fwd, 0, jumps+1});
        }
        if (!lastBack) {
            int bwd = pos - b;
            if (bwd >= 0 && !forbiddenSet.contains(bwd) && !visited.contains(bwd+",1")) {
                if (bwd == x) return jumps + 1;
                visited.add(bwd+",1"); queue.offer(new int[]{bwd, 1, jumps+1});
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    forbidden: [14, 4, 18, 22, 16, 26, 8],
    a: 3,
    b: 15,
    x: 9,
  },

  inputFields: [
    {
      name: 'forbidden',
      label: 'Forbidden Positions',
      type: 'array',
      defaultValue: [14, 4, 18, 22, 16, 26, 8],
      placeholder: '14,4,18,22,16,26,8',
      helperText: 'Positions the bug cannot land on',
    },
    {
      name: 'a',
      label: 'Forward Jump (a)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Forward jump distance',
    },
    {
      name: 'b',
      label: 'Backward Jump (b)',
      type: 'number',
      defaultValue: 15,
      placeholder: '15',
      helperText: 'Backward jump distance',
    },
    {
      name: 'x',
      label: 'Target Position',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Target position to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const forbidden = input.forbidden as number[];
    const a = input.a as number;
    const b = input.b as number;
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];

    const forbiddenSet = new Set<number>(forbidden);
    const maxPos = Math.max(x, ...forbidden, 0) + a + b;

    steps.push({
      line: 1,
      explanation: `Bug starts at 0, target is ${x}. Forward jump: +${a}, backward jump: -${b}. Forbidden: [${forbidden.join(', ')}]. Max search bound: ${maxPos}.`,
      variables: { a, b, x, maxPos, forbiddenCount: forbidden.length },
      visualization: {
        type: 'array',
        array: [0, a, b, x, maxPos],
        highlights: { 0: 'active', 1: 'pointer', 2: 'comparing', 3: 'found', 4: 'sorted' },
        labels: { 0: 'start', 1: 'fwdJump', 2: 'bkJump', 3: 'target', 4: 'maxPos' },
      } as ArrayVisualization,
    });

    const queue: [number, boolean, number][] = [[0, false, 0]];
    const visited = new Set<string>(['0,false']);

    while (queue.length > 0) {
      const [pos, lastBack, jumps] = queue.shift()!;

      steps.push({
        line: 6,
        explanation: `At position ${pos}, jumps taken: ${jumps}, last jump was backward: ${lastBack}.`,
        variables: { position: pos, jumps, lastJumpBackward: lastBack },
        visualization: {
          type: 'array',
          array: [pos, jumps, lastBack ? 1 : 0],
          highlights: { 0: 'active', 1: 'current', 2: 'comparing' },
          labels: { 0: 'pos', 1: 'jumps', 2: 'lastBack' },
        } as ArrayVisualization,
      });

      const fwd = pos + a;
      if (fwd <= maxPos && !forbiddenSet.has(fwd) && !visited.has(`${fwd},false`)) {
        if (fwd === x) {
          steps.push({
            line: 10,
            explanation: `Forward jump lands on target ${x}! Minimum jumps: ${jumps + 1}.`,
            variables: { result: jumps + 1, position: fwd },
            visualization: {
              type: 'array',
              array: [pos, fwd, jumps + 1],
              highlights: { 0: 'visited', 1: 'found', 2: 'found' },
              labels: { 0: 'from', 1: 'target!', 2: 'minJumps' },
            } as ArrayVisualization,
          });
          return steps;
        }
        visited.add(`${fwd},false`);
        queue.push([fwd, false, jumps + 1]);
        steps.push({
          line: 9,
          explanation: `Forward jump: position ${pos} -> ${fwd} (not forbidden, not visited). Added to queue.`,
          variables: { from: pos, to: fwd, jumps: jumps + 1 },
          visualization: {
            type: 'array',
            array: [pos, fwd, jumps + 1],
            highlights: { 0: 'active', 1: 'comparing', 2: 'current' },
            labels: { 0: 'from', 1: 'fwd', 2: 'newJumps' },
          } as ArrayVisualization,
        });
      }

      if (!lastBack) {
        const bwd = pos - b;
        if (bwd >= 0 && !forbiddenSet.has(bwd) && !visited.has(`${bwd},true`)) {
          if (bwd === x) {
            steps.push({
              line: 14,
              explanation: `Backward jump lands on target ${x}! Minimum jumps: ${jumps + 1}.`,
              variables: { result: jumps + 1, position: bwd },
              visualization: {
                type: 'array',
                array: [pos, bwd, jumps + 1],
                highlights: { 0: 'visited', 1: 'found', 2: 'found' },
                labels: { 0: 'from', 1: 'target!', 2: 'minJumps' },
              } as ArrayVisualization,
            });
            return steps;
          }
          visited.add(`${bwd},true`);
          queue.push([bwd, true, jumps + 1]);
          steps.push({
            line: 13,
            explanation: `Backward jump: position ${pos} -> ${bwd} (allowed since last was not backward). Added to queue.`,
            variables: { from: pos, to: bwd, jumps: jumps + 1 },
            visualization: {
              type: 'array',
              array: [pos, bwd, jumps + 1],
              highlights: { 0: 'active', 1: 'comparing', 2: 'current' },
              labels: { 0: 'from', 1: 'bwd', 2: 'newJumps' },
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 20) break;
    }

    steps.push({
      line: 16,
      explanation: `BFS exhausted. Cannot reach position ${x} without violating constraints. Return -1.`,
      variables: { result: -1 },
      visualization: {
        type: 'array',
        array: [0, x, -1],
        highlights: { 0: 'mismatch', 1: 'mismatch', 2: 'mismatch' },
        labels: { 0: 'start', 1: 'target', 2: 'result' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumJumpsToReachHome;
