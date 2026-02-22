import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumFrequencyStack: AlgorithmDefinition = {
  id: 'maximum-frequency-stack',
  title: 'Maximum Frequency Stack',
  leetcodeNumber: 895,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Design a stack-like data structure that pushes and pops the most frequent element. If there is a tie, pop the most recently added among the most frequent. Use a frequency map and a map from frequency to a stack of elements at that frequency level.',
  tags: ['stack', 'hash map', 'design', 'frequency'],

  code: {
    pseudocode: `class FreqStack:
  freq = {}       // element -> frequency
  group = {}      // frequency -> stack of elements
  maxFreq = 0

  function push(val):
    freq[val] = freq.get(val, 0) + 1
    f = freq[val]
    maxFreq = max(maxFreq, f)
    group[f].append(val)

  function pop():
    val = group[maxFreq].pop()
    freq[val] -= 1
    if group[maxFreq] is empty:
      maxFreq -= 1
    return val`,

    python: `class FreqStack:
    def __init__(self):
        self.freq = {}
        self.group = {}
        self.max_freq = 0

    def push(self, val: int) -> None:
        f = self.freq.get(val, 0) + 1
        self.freq[val] = f
        self.max_freq = max(self.max_freq, f)
        if f not in self.group:
            self.group[f] = []
        self.group[f].append(val)

    def pop(self) -> int:
        val = self.group[self.max_freq].pop()
        self.freq[val] -= 1
        if not self.group[self.max_freq]:
            self.max_freq -= 1
        return val`,

    javascript: `class FreqStack {
  constructor() {
    this.freq = new Map();
    this.group = new Map();
    this.maxFreq = 0;
  }
  push(val) {
    const f = (this.freq.get(val) || 0) + 1;
    this.freq.set(val, f);
    this.maxFreq = Math.max(this.maxFreq, f);
    if (!this.group.has(f)) this.group.set(f, []);
    this.group.get(f).push(val);
  }
  pop() {
    const stack = this.group.get(this.maxFreq);
    const val = stack.pop();
    this.freq.set(val, this.freq.get(val) - 1);
    if (stack.length === 0) this.maxFreq--;
    return val;
  }
}`,

    java: `class FreqStack {
    Map<Integer, Integer> freq = new HashMap<>();
    Map<Integer, Deque<Integer>> group = new HashMap<>();
    int maxFreq = 0;

    public void push(int val) {
        int f = freq.getOrDefault(val, 0) + 1;
        freq.put(val, f);
        maxFreq = Math.max(maxFreq, f);
        group.computeIfAbsent(f, k -> new ArrayDeque<>()).push(val);
    }
    public int pop() {
        int val = group.get(maxFreq).pop();
        freq.put(val, freq.get(val) - 1);
        if (group.get(maxFreq).isEmpty()) maxFreq--;
        return val;
    }
}`,
  },

  defaultInput: {
    operations: 'push 5, push 7, push 5, push 7, push 4, push 5, pop, pop, pop, pop',
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'push 5, push 7, push 5, push 7, push 4, push 5, pop, pop, pop, pop',
      placeholder: 'push 5, push 7, pop',
      helperText: 'Comma-separated: push X or pop',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(op => op.trim());
    const steps: AlgorithmStep[] = [];
    const freq = new Map<number, number>();
    const group = new Map<number, number[]>();
    let maxFreq = 0;
    const displayStack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...displayStack],
      inputChars: operations,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize FreqStack: freq map, group map, maxFreq = 0.',
      variables: { freq: {}, group: {}, maxFreq: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const parts = op.split(/\s+/);

      if (parts[0] === 'push') {
        const val = Number(parts[1]);
        const f = (freq.get(val) || 0) + 1;
        freq.set(val, f);
        maxFreq = Math.max(maxFreq, f);
        if (!group.has(f)) group.set(f, []);
        group.get(f)!.push(val);
        displayStack.push(`${val}(f=${f})`);

        steps.push({
          line: 7,
          explanation: `push(${val}): frequency of ${val} is now ${f}. maxFreq = ${maxFreq}. Added to group[${f}].`,
          variables: { val, frequency: f, maxFreq },
          visualization: makeViz(i, 'push'),
        });
      } else if (parts[0] === 'pop') {
        const stack = group.get(maxFreq)!;
        const val = stack.pop()!;
        freq.set(val, freq.get(val)! - 1);
        const prevMax = maxFreq;
        if (stack.length === 0) maxFreq--;
        // Remove from display stack (find last occurrence of this value)
        for (let j = displayStack.length - 1; j >= 0; j--) {
          if (displayStack[j].startsWith(`${val}(`)) {
            displayStack.splice(j, 1);
            break;
          }
        }

        steps.push({
          line: 13,
          explanation: `pop(): Most frequent element is ${val} (freq was ${prevMax}). Popped from group[${prevMax}]. maxFreq now = ${maxFreq}.`,
          variables: { popped: val, prevMaxFreq: prevMax, maxFreq, newFreq: freq.get(val) },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    steps.push({
      line: 16,
      explanation: 'All operations complete.',
      variables: { maxFreq, stackSize: displayStack.length },
      visualization: makeViz(operations.length, 'idle'),
    });

    return steps;
  },
};

export default maximumFrequencyStack;
