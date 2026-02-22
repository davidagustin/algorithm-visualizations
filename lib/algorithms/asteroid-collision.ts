import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const asteroidCollision: AlgorithmDefinition = {
  id: 'asteroid-collision',
  title: 'Asteroid Collision',
  leetcodeNumber: 735,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array of integers representing asteroids (positive = moving right, negative = moving left), simulate collisions. When a right-moving asteroid meets a left-moving one, the smaller explodes; equal sizes both explode. Use a stack to simulate this.',
  tags: ['Stack', 'Array', 'Simulation'],
  code: {
    pseudocode: `function asteroidCollision(asteroids):
  stack = []
  for asteroid in asteroids:
    explode = false
    while stack not empty and asteroid < 0 and stack.top > 0:
      if stack.top < -asteroid: pop, continue
      elif stack.top == -asteroid: pop; explode = true; break
      else: explode = true; break
    if not explode:
      stack.push(asteroid)
  return stack`,
    python: `def asteroidCollision(asteroids):
    stack = []
    for a in asteroids:
        while stack and a < 0 < stack[-1]:
            if stack[-1] < -a:
                stack.pop()
                continue
            elif stack[-1] == -a:
                stack.pop()
            break
        else:
            stack.append(a)
    return stack`,
    javascript: `function asteroidCollision(asteroids) {
  const stack = [];
  for (const a of asteroids) {
    let explode = false;
    while (stack.length && a < 0 && stack[stack.length - 1] > 0) {
      if (stack[stack.length - 1] < -a) {
        stack.pop();
        continue;
      } else if (stack[stack.length - 1] === -a) {
        stack.pop();
        explode = true;
      } else {
        explode = true;
      }
      break;
    }
    if (!explode) stack.push(a);
  }
  return stack;
}`,
    java: `public int[] asteroidCollision(int[] asteroids) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (int a : asteroids) {
        boolean explode = false;
        while (!stack.isEmpty() && a < 0 && stack.peek() > 0) {
            if (stack.peek() < -a) { stack.pop(); continue; }
            else if (stack.peek() == -a) { stack.pop(); explode = true; }
            else { explode = true; }
            break;
        }
        if (!explode) stack.push(a);
    }
    int[] res = new int[stack.size()];
    int i = stack.size() - 1;
    for (int x : stack) res[i--] = x;
    return res;
}`,
  },
  defaultInput: { asteroids: [5, 10, -5, -10, 8, -3, 3] },
  inputFields: [
    {
      name: 'asteroids',
      label: 'Asteroids',
      type: 'array',
      defaultValue: [5, 10, -5, -10, 8, -3, 3],
      placeholder: 'e.g. 5,10,-5,-10,8,-3,3',
      helperText: 'Positive = right, Negative = left',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const asteroids = (input.asteroids as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: asteroids.map(String),
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize empty stack. Positive asteroids move right, negative move left. Collisions happen only when right (positive) meets left (negative).',
      variables: { stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < asteroids.length; i++) {
      const a = asteroids[i];

      steps.push({
        line: 3,
        explanation: `Asteroid ${a} at index ${i}: ${a > 0 ? 'moving right →' : 'moving left ←'}. Check for collisions.`,
        variables: { i, asteroid: a, stack: [...stack] },
        visualization: makeViz(i, 'idle'),
      });

      let explode = false;

      while (stack.length > 0 && a < 0 && stack[stack.length - 1] > 0) {
        const top = stack[stack.length - 1];
        if (top < -a) {
          stack.pop();
          steps.push({
            line: 5,
            explanation: `Collision! Stack top ${top} < ${-a} (size of incoming). Stack top ${top} explodes. Incoming ${a} survives. Continue checking.`,
            variables: { top, asteroid: a, stack: [...stack] },
            visualization: makeViz(i, 'pop'),
          });
          continue;
        } else if (top === -a) {
          stack.pop();
          explode = true;
          steps.push({
            line: 6,
            explanation: `Collision! Stack top ${top} equals ${-a}. Both asteroids (${top} and ${a}) explode!`,
            variables: { top, asteroid: a, stack: [...stack] },
            visualization: makeViz(i, 'mismatch'),
          });
          break;
        } else {
          explode = true;
          steps.push({
            line: 7,
            explanation: `Collision! Stack top ${top} > ${-a}. Incoming ${a} explodes. Stack top ${top} survives.`,
            variables: { top, asteroid: a, stack: [...stack] },
            visualization: makeViz(i, 'mismatch'),
          });
          break;
        }
      }

      if (!explode) {
        stack.push(a);
        steps.push({
          line: 8,
          explanation: a > 0
            ? `Asteroid ${a} moves right — no collision possible with current stack. Push onto stack.`
            : `Asteroid ${a} moves left — stack empty or stack top also moves left. No collision. Push onto stack.`,
          variables: { asteroid: a, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `All asteroids processed. Remaining stack: [${stack.join(', ')}].`,
      variables: { result: [...stack] },
      visualization: makeViz(asteroids.length, 'match'),
    });

    return steps;
  },
};

export default asteroidCollision;
