import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const flattenNestedList: AlgorithmDefinition = {
  id: 'flatten-nested-list',
  title: 'Flatten Nested List Iterator',
  leetcodeNumber: 341,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a nested list of integers, flatten it into a single list using a stack. Push all items from the end to the front. When processing, if the top is an integer output it; if it is a list, pop it and push its elements back onto the stack from end to front.',
  tags: ['stack', 'design', 'iterator', 'nested structure'],

  code: {
    pseudocode: `function flatten(nestedList):
  stack = reverse(nestedList)
  result = []
  while stack not empty:
    top = stack.pop()
    if top is integer:
      result.append(top)
    else:
      for item in reverse(top.list):
        stack.push(item)
  return result`,

    python: `def flatten(nestedList):
    stack = list(reversed(nestedList))
    result = []
    while stack:
        top = stack.pop()
        if isinstance(top, int):
            result.append(top)
        else:
            stack.extend(reversed(top))
    return result`,

    javascript: `function flatten(nestedList) {
  const stack = [...nestedList].reverse();
  const result = [];
  while (stack.length) {
    const top = stack.pop();
    if (typeof top === 'number') {
      result.push(top);
    } else {
      for (let i = top.length - 1; i >= 0; i--) {
        stack.push(top[i]);
      }
    }
  }
  return result;
}`,

    java: `public List<Integer> flatten(List<Object> nestedList) {
    Deque<Object> stack = new ArrayDeque<>();
    for (int i = nestedList.size() - 1; i >= 0; i--)
        stack.push(nestedList.get(i));
    List<Integer> result = new ArrayList<>();
    while (!stack.isEmpty()) {
        Object top = stack.pop();
        if (top instanceof Integer) {
            result.add((Integer) top);
        } else {
            List<Object> list = (List<Object>) top;
            for (int i = list.size() - 1; i >= 0; i--)
                stack.push(list.get(i));
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nested: '[[1,1],2,[1,1]]',
  },

  inputFields: [
    {
      name: 'nested',
      label: 'Nested List',
      type: 'string',
      defaultValue: '[[1,1],2,[1,1]]',
      placeholder: '[[1,1],2,[1,1]]',
      helperText: 'A nested list representation like [[1,1],2,[1,1]]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nestedStr = input.nested as string;
    const steps: AlgorithmStep[] = [];

    // Parse nested list
    let parsed: unknown;
    try {
      parsed = JSON.parse(nestedStr);
    } catch {
      parsed = [1, [2, 3], [4, [5, 6]]];
    }

    const flatten = (val: unknown): unknown[] => {
      if (!Array.isArray(val)) return [val];
      return val;
    };

    // Simulate with a stack of string representations
    const stack: string[] = [];
    const result: number[] = [];

    const initItems = flatten(parsed);
    for (let i = initItems.length - 1; i >= 0; i--) {
      stack.push(JSON.stringify(initItems[i]));
    }

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: stack.length > 0 ? stack : ['empty'],
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize stack with reversed top-level items of ${nestedStr}.`,
      variables: { stack: [...stack], result: [] },
      visualization: makeViz(-1, 'idle'),
    });

    let stepCount = 0;
    const maxSteps = 30;

    const stackData: unknown[] = [...initItems].reverse();

    while (stackData.length > 0 && stepCount < maxSteps) {
      stepCount++;
      const top = stackData.pop();

      if (typeof top === 'number') {
        result.push(top);
        // sync display stack
        stack.length = 0;
        stack.push(...stackData.map(v => JSON.stringify(v)));

        steps.push({
          line: 6,
          explanation: `Top is integer ${top}. Add to result. Result = [${result.join(', ')}].`,
          variables: { top, result: [...result], stackSize: stackData.length },
          visualization: makeViz(result.length - 1, 'match'),
        });
      } else if (Array.isArray(top)) {
        for (let i = top.length - 1; i >= 0; i--) {
          stackData.push(top[i]);
        }
        stack.length = 0;
        stack.push(...stackData.map(v => JSON.stringify(v)));

        steps.push({
          line: 8,
          explanation: `Top is a list ${JSON.stringify(top)}. Pop it and push its elements in reverse order onto stack.`,
          variables: { top: JSON.stringify(top), stackSize: stackData.length },
          visualization: makeViz(-1, 'push'),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Flattening complete. Result = [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: {
        type: 'stack',
        items: result.map(String),
        inputChars: result.map(String),
        currentIndex: result.length - 1,
        action: 'idle',
      },
    });

    return steps;
  },
};

export default flattenNestedList;
