import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const robotCollisions: AlgorithmDefinition = {
  id: 'robot-collisions',
  title: 'Robot Collisions',
  leetcodeNumber: 2751,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'There are n robots on a number line. Each robot has a position, health, and direction (Left or Right). Robots moving toward each other collide: the one with less health is removed, the survivor loses 1 health. Equal health both are removed. Use a stack of right-moving robots. When a left-moving robot appears, resolve collisions with stack top until one side wins or the stack is exhausted.',
  tags: ['stack', 'simulation', 'array', 'sorting'],

  code: {
    pseudocode: `function survivedRobotsHealths(positions, healths, directions):
  n = len(positions)
  order = sort indices by positions[i]
  stack = []  // indices of right-moving robots
  result = [0] * n
  for i in order:
    if directions[i] == 'R':
      stack.push(i)
    else:  // 'L'
      while stack and healths[i] > 0:
        top = stack.top()
        if healths[top] > healths[i]:
          healths[top] -= 1; healths[i] = 0
        elif healths[top] < healths[i]:
          healths[i] -= 1; stack.pop()
        else:
          healths[top] = 0; healths[i] = 0; stack.pop()
      if healths[i] > 0: result[i] = healths[i]
  for i in stack: result[i] = healths[i]
  return [r for r in result if r > 0]`,

    python: `def survivedRobotsHealths(positions, healths, directions):
    n = len(positions)
    order = sorted(range(n), key=lambda i: positions[i])
    stack = []
    for i in order:
        if directions[i] == 'R':
            stack.append(i)
        else:
            while stack and healths[i] > 0:
                top = stack[-1]
                if healths[top] > healths[i]:
                    healths[top] -= 1; healths[i] = 0
                elif healths[top] < healths[i]:
                    healths[i] -= 1; stack.pop()
                else:
                    healths[top] = 0; healths[i] = 0; stack.pop()
    survivors = sorted(range(n), key=lambda i: positions[i])
    return [healths[i] for i in survivors if healths[i] > 0]`,

    javascript: `function survivedRobotsHealths(positions, healths, directions) {
  const n = positions.length;
  const order = Array.from({length: n}, (_, i) => i).sort((a, b) => positions[a] - positions[b]);
  const stack = [];
  for (const i of order) {
    if (directions[i] === 'R') {
      stack.push(i);
    } else {
      while (stack.length && healths[i] > 0) {
        const top = stack[stack.length - 1];
        if (healths[top] > healths[i]) { healths[top]--; healths[i] = 0; }
        else if (healths[top] < healths[i]) { healths[i]--; stack.pop(); }
        else { healths[top] = 0; healths[i] = 0; stack.pop(); }
      }
    }
  }
  return order.map(i => healths[i]).filter(h => h > 0);
}`,

    java: `public List<Integer> survivedRobotsHealths(int[] positions, int[] healths, String directions) {
    int n = positions.length;
    Integer[] order = new Integer[n];
    for (int i = 0; i < n; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> positions[a] - positions[b]);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i : order) {
        if (directions.charAt(i) == 'R') stack.push(i);
        else {
            while (!stack.isEmpty() && healths[i] > 0) {
                int top = stack.peek();
                if (healths[top] > healths[i]) { healths[top]--; healths[i] = 0; }
                else if (healths[top] < healths[i]) { healths[i]--; stack.pop(); }
                else { healths[top] = 0; healths[i] = 0; stack.pop(); }
            }
        }
    }
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < n; i++) if (healths[i] > 0) result.add(healths[i]);
    return result;
}`,
  },

  defaultInput: {
    positions: [5, 4, 3, 2, 1],
    healths: [2, 17, 9, 15, 10],
    directions: 'RRRRR',
  },

  inputFields: [
    {
      name: 'positions',
      label: 'Positions',
      type: 'array',
      defaultValue: [5, 4, 3, 2, 1],
      placeholder: '5,4,3,2,1',
      helperText: 'Positions of robots on number line',
    },
    {
      name: 'healths',
      label: 'Healths',
      type: 'array',
      defaultValue: [2, 17, 9, 15, 10],
      placeholder: '2,17,9,15,10',
      helperText: 'Health values of robots',
    },
    {
      name: 'directions',
      label: 'Directions',
      type: 'string',
      defaultValue: 'RRRRR',
      placeholder: 'RRRRR',
      helperText: 'String of L and R directions for each robot',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const positions = input.positions as number[];
    const healths = [...(input.healths as number[])];
    const directions = input.directions as string;
    const steps: AlgorithmStep[] = [];
    const n = positions.length;
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `R${i}(h=${healths[i]})`),
      inputChars: positions.map((p, i) => `${p}${directions[i]}`),
      currentIndex: idx,
      action,
    });

    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => positions[a] - positions[b]);

    steps.push({
      line: 1,
      explanation: `Simulate robot collisions. Sort by position: [${order.join(', ')}]. Stack holds right-moving robots.`,
      variables: { order: [...order], n },
      visualization: makeViz(-1, 'idle'),
    });

    for (const i of order) {
      const dir = directions[i];

      if (dir === 'R') {
        stack.push(i);
        steps.push({
          line: 6,
          explanation: `Robot ${i} at pos ${positions[i]} moves Right with health ${healths[i]}. Push onto stack.`,
          variables: { robot: i, pos: positions[i], health: healths[i], dir },
          visualization: makeViz(i, 'push'),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Robot ${i} at pos ${positions[i]} moves Left with health ${healths[i]}. Resolve collisions with stack.`,
          variables: { robot: i, pos: positions[i], health: healths[i], dir },
          visualization: makeViz(i, 'idle'),
        });

        while (stack.length > 0 && healths[i] > 0) {
          const top = stack[stack.length - 1];

          if (healths[top] > healths[i]) {
            healths[top]--;
            const h = healths[i];
            healths[i] = 0;
            steps.push({
              line: 10,
              explanation: `Robot ${top} (h=${healths[top]+1}) > Robot ${i} (h=${h}). Robot ${i} destroyed. Robot ${top} health reduced to ${healths[top]}.`,
              variables: { winner: top, loser: i, winnerHealth: healths[top] },
              visualization: makeViz(i, 'mismatch'),
            });
          } else if (healths[top] < healths[i]) {
            healths[i]--;
            const h = healths[top];
            stack.pop();
            steps.push({
              line: 12,
              explanation: `Robot ${i} (h=${healths[i]+1}) > Robot ${top} (h=${h}). Robot ${top} destroyed. Robot ${i} health reduced to ${healths[i]}.`,
              variables: { winner: i, loser: top, winnerHealth: healths[i] },
              visualization: makeViz(i, 'pop'),
            });
          } else {
            const h = healths[top];
            healths[top] = 0;
            healths[i] = 0;
            stack.pop();
            steps.push({
              line: 14,
              explanation: `Robot ${top} (h=${h}) == Robot ${i} (h=${h}). Both destroyed simultaneously.`,
              variables: { robot1: top, robot2: i },
              visualization: makeViz(i, 'match'),
            });
          }
        }
      }
    }

    const survivors = healths.filter(h => h > 0);
    steps.push({
      line: 16,
      explanation: `Simulation complete. Surviving robot healths: [${survivors.join(', ')}].`,
      variables: { survivors: [...survivors] },
      visualization: makeViz(-1, 'match'),
    });

    return steps;
  },
};

export default robotCollisions;
