import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const buildArrayWithStackOperations: AlgorithmDefinition = {
  id: 'build-array-with-stack-operations',
  title: 'Build an Array With Stack Operations',
  leetcodeNumber: 1441,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a target array and an integer n, the stream reads integers 1 to n in order. Using push and pop operations, build the target array. For each number in 1..n: always push. If it is not in target, also pop it. Return the sequence of operations.',
  tags: ['stack', 'simulation', 'array'],

  code: {
    pseudocode: `function buildArray(target, n):
  ops = []
  stack = []
  targetSet = set(target)
  t = 0  // index into target
  for num = 1 to n:
    if t >= len(target): break
    ops.append("Push")
    stack.push(num)
    if num == target[t]:
      t += 1
    else:
      ops.append("Pop")
      stack.pop()
  return ops`,

    python: `def buildArray(target: list[int], n: int) -> list[str]:
    ops = []
    target_set = set(target)
    t = 0
    for num in range(1, n + 1):
        if t >= len(target):
            break
        ops.append("Push")
        if num == target[t]:
            t += 1
        else:
            ops.append("Pop")
    return ops`,

    javascript: `function buildArray(target, n) {
  const ops = [];
  const targetSet = new Set(target);
  let t = 0;
  for (let num = 1; num <= n; num++) {
    if (t >= target.length) break;
    ops.push("Push");
    if (num === target[t]) {
      t++;
    } else {
      ops.push("Pop");
    }
  }
  return ops;
}`,

    java: `public List<String> buildArray(int[] target, int n) {
    List<String> ops = new ArrayList<>();
    int t = 0;
    for (int num = 1; num <= n && t < target.length; num++) {
        ops.add("Push");
        if (num == target[t]) {
            t++;
        } else {
            ops.add("Pop");
        }
    }
    return ops;
}`,
  },

  defaultInput: {
    target: [1, 3],
    n: 3,
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target Array',
      type: 'array',
      defaultValue: [1, 3],
      placeholder: '1,3',
      helperText: 'Target array to build (strictly increasing)',
    },
    {
      name: 'n',
      label: 'Stream Length',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Stream reads from 1 to n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const ops: string[] = [];
    const stack: number[] = [];
    let t = 0;

    const makeViz = (currentNum: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: Array.from({ length: n }, (_, i) => String(i + 1)),
      currentIndex: currentNum - 1,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Target = [${target.join(', ')}], stream = 1..${n}. Simulate push/pop operations.`,
      variables: { target: [...target], n, stack: [], ops: [] },
      visualization: makeViz(1, 'idle'),
    });

    for (let num = 1; num <= n; num++) {
      if (t >= target.length) break;

      ops.push('Push');
      stack.push(num);

      steps.push({
        line: 6,
        explanation: `Stream reads ${num}. Push ${num} onto stack. Stack = [${stack.join(', ')}].`,
        variables: { num, stack: [...stack], ops: [...ops], t, nextTarget: target[t] },
        visualization: makeViz(num, 'push'),
      });

      if (num === target[t]) {
        t++;
        steps.push({
          line: 8,
          explanation: `${num} matches target[${t - 1}]=${target[t - 1]}. Keep it. Move to next target.`,
          variables: { num, t, ops: [...ops], stack: [...stack] },
          visualization: makeViz(num, 'match'),
        });
      } else {
        ops.push('Pop');
        stack.pop();
        steps.push({
          line: 10,
          explanation: `${num} is not in target (next target is ${target[t]}). Pop it. Stack = [${stack.join(', ')}].`,
          variables: { num, t, ops: [...ops], stack: [...stack] },
          visualization: makeViz(num, 'pop'),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Operations = [${ops.join(', ')}]. Final stack = [${stack.join(', ')}].`,
      variables: { ops: [...ops], stack: [...stack] },
      visualization: makeViz(n, 'idle'),
    });

    return steps;
  },
};

export default buildArrayWithStackOperations;
