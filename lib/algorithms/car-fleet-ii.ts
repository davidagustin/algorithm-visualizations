import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const carFleetIi: AlgorithmDefinition = {
  id: 'car-fleet-ii',
  title: 'Car Fleet II',
  leetcodeNumber: 1776,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'There are n cars on an infinite one-lane highway. For each car i, given its position and speed, compute the time at which it collides with the next car fleet. A car catches up to the one in front if it is faster. Use a monotonic stack processing cars from right to left to efficiently determine collision times.',
  tags: ['stack', 'monotonic stack', 'math', 'array'],

  code: {
    pseudocode: `function getCollisionTimes(cars):
  n = len(cars)
  result = [-1.0] * n
  stack = []  // indices of cars
  for i from n-1 to 0:
    pos_i, speed_i = cars[i]
    while stack not empty:
      j = stack.top()
      pos_j, speed_j = cars[j]
      if speed_i <= speed_j:
        break  // car i never catches car j
      time = (pos_j - pos_i) / (speed_i - speed_j)
      if result[j] == -1 or time <= result[j]:
        break  // car i catches j before j merges
      stack.pop()
    if stack not empty:
      j = stack.top()
      result[i] = (cars[j][0] - pos_i) / (speed_i - cars[j][1])
    stack.push(i)
  return result`,

    python: `def getCollisionTimes(cars):
    n = len(cars)
    result = [-1.0] * n
    stack = []
    for i in range(n - 1, -1, -1):
        pos, speed = cars[i]
        while stack:
            j = stack[-1]
            pj, sj = cars[j]
            if speed <= sj:
                break
            t = (pj - pos) / (speed - sj)
            if result[j] < 0 or t <= result[j]:
                break
            stack.pop()
        if stack:
            j = stack[-1]
            result[i] = (cars[j][0] - pos) / (speed - cars[j][1])
        stack.append(i)
    return result`,

    javascript: `function getCollisionTimes(cars) {
  const n = cars.length;
  const result = new Array(n).fill(-1);
  const stack = [];
  for (let i = n - 1; i >= 0; i--) {
    const [pos, speed] = cars[i];
    while (stack.length) {
      const j = stack[stack.length - 1];
      const [pj, sj] = cars[j];
      if (speed <= sj) break;
      const t = (pj - pos) / (speed - sj);
      if (result[j] < 0 || t <= result[j]) break;
      stack.pop();
    }
    if (stack.length) {
      const j = stack[stack.length - 1];
      result[i] = (cars[j][0] - pos) / (speed - cars[j][1]);
    }
    stack.push(i);
  }
  return result;
}`,

    java: `public double[] getCollisionTimes(int[][] cars) {
    int n = cars.length;
    double[] result = new double[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = n - 1; i >= 0; i--) {
        int pos = cars[i][0], speed = cars[i][1];
        while (!stack.isEmpty()) {
            int j = stack.peek();
            int pj = cars[j][0], sj = cars[j][1];
            if (speed <= sj) break;
            double t = (double)(pj - pos) / (speed - sj);
            if (result[j] < 0 || t <= result[j]) break;
            stack.pop();
        }
        if (!stack.isEmpty()) {
            int j = stack.peek();
            result[i] = (double)(cars[j][0] - pos) / (speed - cars[j][1]);
        }
        stack.push(i);
    }
    return result;
}`,
  },

  defaultInput: {
    cars: [[1, 2], [2, 1], [4, 3], [7, 2]],
  },

  inputFields: [
    {
      name: 'cars',
      label: 'Cars [position, speed]',
      type: 'array',
      defaultValue: [[1, 2], [2, 1], [4, 3], [7, 2]],
      placeholder: '[[1,2],[2,1],[4,3],[7,2]]',
      helperText: 'Array of [position, speed] pairs, sorted by position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cars = input.cars as number[][];
    const steps: AlgorithmStep[] = [];
    const n = cars.length;
    const result: number[] = new Array(n).fill(-1);
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(j => `car${j}(p=${cars[j][0]},s=${cars[j][1]})`),
      inputChars: cars.map((c, i) => `[${c[0]},${c[1]}]`),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Process ${n} cars from right to left. Use a monotonic stack to track which cars ahead matter.`,
      variables: { n, result: [...result], stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      const [pos, speed] = cars[i];

      steps.push({
        line: 4,
        explanation: `Processing car ${i} at position ${pos} with speed ${speed}.`,
        variables: { i, pos, speed, stackSize: stack.length },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0) {
        const j = stack[stack.length - 1];
        const [pj, sj] = cars[j];

        if (speed <= sj) {
          steps.push({
            line: 7,
            explanation: `Car ${i} (speed ${speed}) cannot catch car ${j} (speed ${sj}). Stop popping.`,
            variables: { i, j, speedI: speed, speedJ: sj },
            visualization: makeViz(i, 'idle'),
          });
          break;
        }

        const t = (pj - pos) / (speed - sj);

        if (result[j] < 0 || t <= result[j]) {
          steps.push({
            line: 9,
            explanation: `Car ${i} catches car ${j} at time ${t.toFixed(2)} before car ${j} merges. Car ${j} is relevant.`,
            variables: { i, j, collisionTime: t.toFixed(2), resultJ: result[j] },
            visualization: makeViz(i, 'match'),
          });
          break;
        }

        steps.push({
          line: 10,
          explanation: `Car ${i} catches car ${j} after car ${j} merges (t=${t.toFixed(2)} > result[${j}]=${result[j].toFixed(2)}). Pop car ${j}.`,
          variables: { i, j, t: t.toFixed(2), resultJ: result[j].toFixed(2) },
          visualization: makeViz(i, 'pop'),
        });
        stack.pop();
      }

      if (stack.length > 0) {
        const j = stack[stack.length - 1];
        result[i] = (cars[j][0] - pos) / (speed - cars[j][1]);
        steps.push({
          line: 13,
          explanation: `Car ${i} will collide with car ${j} at time ${result[i].toFixed(2)}.`,
          variables: { i, j, collisionTime: result[i].toFixed(2) },
          visualization: makeViz(i, 'found'),
        });
      } else {
        steps.push({
          line: 13,
          explanation: `Stack is empty. Car ${i} never collides (result[${i}] = -1).`,
          variables: { i, result: result[i] },
          visualization: makeViz(i, 'idle'),
        });
      }

      stack.push(i);
      steps.push({
        line: 14,
        explanation: `Push car ${i} onto stack.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 15,
      explanation: `Done. Collision times: [${result.map(r => r < 0 ? '-1' : r.toFixed(2)).join(', ')}].`,
      variables: { result: result.map(r => r < 0 ? -1 : parseFloat(r.toFixed(2))) },
      visualization: makeViz(-1, 'idle'),
    });

    return steps;
  },
};

export default carFleetIi;
