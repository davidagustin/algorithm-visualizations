import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flattenNestedListIterator: AlgorithmDefinition = {
  id: 'flatten-nested-list-iterator',
  title: 'Flatten Nested List Iterator',
  leetcodeNumber: 341,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Implement an iterator that flattens a nested list of integers. Each element is either an integer or a list containing integers or other lists. Use a stack initialized with the nested list in reverse order. hasNext() flattens the top of the stack until an integer is found. next() pops and returns that integer.',
  tags: ['linked list', 'stack', 'design', 'iterator'],

  code: {
    pseudocode: `class NestedIterator:
  constructor(nestedList):
    stack = reverse(nestedList)

  hasNext():
    while stack not empty:
      top = stack.top()
      if top.isInteger():
        return true
      stack.pop()
      for item in reverse(top.getList()):
        stack.push(item)
    return false

  next():
    hasNext()  // ensure top is integer
    return stack.pop().getInteger()`,

    python: `class NestedIterator:
    def __init__(self, nestedList):
        self.stack = list(reversed(nestedList))
    def hasNext(self):
        while self.stack:
            top = self.stack[-1]
            if top.isInteger():
                return True
            self.stack.pop()
            self.stack.extend(reversed(top.getList()))
        return False
    def next(self):
        self.hasNext()
        return self.stack.pop().getInteger()`,

    javascript: `class NestedIterator {
  constructor(nestedList) {
    this.stack = [...nestedList].reverse();
  }
  hasNext() {
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (top.isInteger()) return true;
      this.stack.pop();
      this.stack.push(...top.getList().reverse());
    }
    return false;
  }
  next() {
    this.hasNext();
    return this.stack.pop().getInteger();
  }
}`,

    java: `public class NestedIterator implements Iterator<Integer> {
    private Deque<NestedInteger> stack;
    public NestedIterator(List<NestedInteger> nestedList) {
        stack = new ArrayDeque<>();
        for (int i = nestedList.size()-1; i >= 0; i--)
            stack.push(nestedList.get(i));
    }
    public Integer next() { hasNext(); return stack.pop().getInteger(); }
    public boolean hasNext() {
        while (!stack.isEmpty() && !stack.peek().isInteger()) {
            NestedInteger top = stack.pop();
            List<NestedInteger> list = top.getList();
            for (int i = list.size()-1; i >= 0; i--) stack.push(list.get(i));
        }
        return !stack.isEmpty();
    }
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 1, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Flat representation of nested list',
      type: 'array',
      defaultValue: [1, 1, 2, 1, 1],
      placeholder: '1,1,2,1,1',
      helperText: 'Values that would be yielded by flattening the nested list [[1,1],2,[1,1]]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    // Simulate a nested list [[1,1], 2, [1,1]] yielding nums
    const nestedStr = '[[1,1], 2, [1,1]]';

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize NestedIterator with nested list ${nestedStr}. Stack stores elements in reverse order for easy popping.`,
      variables: { 'nested list': nestedStr, stack: 'initialized (reversed)' },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'first' }),
    });

    const yielded: number[] = [];

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 5,
        explanation: `hasNext() called. Check top of stack. Found integer ${nums[i]}.`,
        variables: { 'stack top': nums[i], 'yielded so far': [...yielded] },
        visualization: makeViz([...nums],
          { [i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])) },
          { [i]: 'top', ...(i > 0 ? { [i - 1]: 'done' } : {}) }),
      });

      steps.push({
        line: 13,
        explanation: `next() returns ${nums[i]}. Pop from stack.`,
        variables: { returned: nums[i], 'remaining count': n - i - 1 },
        visualization: makeViz([...nums],
          { [i]: 'found', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])) },
          { [i]: `yield ${nums[i]}` }),
      });

      yielded.push(nums[i]);
    }

    steps.push({
      line: 9,
      explanation: `hasNext() returns false. Stack is empty. All values yielded: [${yielded.join(', ')}].`,
      variables: { 'all values': yielded, done: true },
      visualization: makeViz([...nums], Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), Object.fromEntries(nums.map((v, i) => [i, `${v}`]))),
    });

    return steps;
  },
};

export default flattenNestedListIterator;
