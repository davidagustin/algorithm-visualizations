import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validateStackSequences: AlgorithmDefinition = {
  id: 'validate-stack-sequences',
  title: 'Validate Stack Sequences',
  leetcodeNumber: 946,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given two sequences pushed and popped, return true if they could be the result of a push and pop sequence on an initially empty stack. Simulate: push elements one by one, and after each push, check if we can pop matching elements from the popped sequence.',
  tags: ['Stack', 'Array', 'Simulation'],
  code: {
    pseudocode: `function validateStackSequences(pushed, popped):
  stack = []
  j = 0  // pointer into popped
  for val in pushed:
    stack.push(val)
    while stack not empty and stack.top == popped[j]:
      stack.pop()
      j += 1
  return stack is empty`,
    python: `def validateStackSequences(pushed, popped):
    stack = []
    j = 0
    for val in pushed:
        stack.append(val)
        while stack and stack[-1] == popped[j]:
            stack.pop()
            j += 1
    return not stack`,
    javascript: `function validateStackSequences(pushed, popped) {
  const stack = [];
  let j = 0;
  for (const val of pushed) {
    stack.push(val);
    while (stack.length && stack[stack.length - 1] === popped[j]) {
      stack.pop();
      j++;
    }
  }
  return stack.length === 0;
}`,
    java: `public boolean validateStackSequences(int[] pushed, int[] popped) {
    Deque<Integer> stack = new ArrayDeque<>();
    int j = 0;
    for (int val : pushed) {
        stack.push(val);
        while (!stack.isEmpty() && stack.peek() == popped[j]) {
            stack.pop();
            j++;
        }
    }
    return stack.isEmpty();
}`,
  },
  defaultInput: {
    pushed: [1, 2, 3, 4, 5],
    popped: [4, 5, 3, 2, 1],
  },
  inputFields: [
    {
      name: 'pushed',
      label: 'Push Sequence',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: 'e.g. 1,2,3,4,5',
      helperText: 'Order of pushes',
    },
    {
      name: 'popped',
      label: 'Pop Sequence',
      type: 'array',
      defaultValue: [4, 5, 3, 2, 1],
      placeholder: 'e.g. 4,5,3,2,1',
      helperText: 'Order of pops to validate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pushed = (input.pushed as number[]).slice();
    const popped = (input.popped as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let j = 0;

    function makeViz(pushIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < pushed.length; i++) {
        if (i < (pushIdx ?? -1)) {
          highlights[i] = stack.includes(pushed[i]) ? 'active' : 'sorted';
        } else if (i === pushIdx) {
          highlights[i] = 'current';
          labels[i] = 'push';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: pushed,
        highlights,
        labels,
        auxData: {
          label: 'Simulation State',
          entries: [
            { key: 'Stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : '[]' },
            { key: 'Pop pointer j', value: String(j) },
            { key: 'Expecting pop', value: j < popped.length ? String(popped[j]) : 'done' },
            { key: 'Popped sequence', value: `[${popped.join(', ')}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize empty stack and pop pointer j=0. We simulate the push sequence and match pops.`,
      variables: { pushed, popped, stack: [], j },
      visualization: makeViz(null),
    });

    for (let i = 0; i < pushed.length; i++) {
      const val = pushed[i];
      stack.push(val);
      steps.push({
        line: 4,
        explanation: `Push ${val} onto stack. Stack: [${stack.join(', ')}]. Now check if top matches popped[${j}]=${popped[j]}.`,
        variables: { i, val, stack: [...stack], j },
        visualization: makeViz(i),
      });

      while (stack.length > 0 && stack[stack.length - 1] === popped[j]) {
        const popping = stack.pop()!;
        j++;
        steps.push({
          line: 6,
          explanation: `Stack top ${popping} matches popped[${j - 1}]=${popped[j - 1]}. Pop! j advances to ${j}. Next expected pop: ${j < popped.length ? popped[j] : 'done'}.`,
          variables: { popped: popping, j, stack: [...stack] },
          visualization: makeViz(i),
        });
      }
    }

    const isValid = stack.length === 0;
    steps.push({
      line: 8,
      explanation: isValid
        ? `Stack is empty. All pops matched correctly. Sequence is VALID!`
        : `Stack still has ${stack.length} elements: [${stack.join(', ')}]. Pop sequence is INVALID.`,
      variables: { result: isValid, stack: [...stack] },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < pushed.length; i++) {
          h[i] = isValid ? 'found' : 'mismatch';
        }
        return {
          type: 'array' as const,
          array: pushed,
          highlights: h,
          labels: {},
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Valid?', value: String(isValid) },
              { key: 'Remaining stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : '[]' },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default validateStackSequences;
