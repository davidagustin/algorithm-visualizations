import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zigzagIteratorII: AlgorithmDefinition = {
  id: 'zigzag-iterator-ii',
  title: 'Zigzag Iterator II',
  leetcodeNumber: 281,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a ZigzagIterator that interleaves elements from two lists alternately. Uses two pointers and a flag to track which list to draw from next. next() returns alternate elements from v1 and v2 until one is exhausted, then continues from the remaining list. O(1) per call.',
  tags: ['Design', 'Iterator', 'Array', 'Two Pointers'],
  code: {
    pseudocode: `class ZigzagIterator:
  def __init__(v1, v2):
    self.v1, self.v2 = v1, v2
    self.i = self.j = 0
    self.turn = 0  // 0=v1, 1=v2
  def hasNext():
    return i < len(v1) or j < len(v2)
  def next():
    if turn==0 and i<len(v1):
      return v1[i++]; turn=1
    elif turn==1 and j<len(v2):
      return v2[j++]; turn=0
    elif i<len(v1): return v1[i++]
    else: return v2[j++]`,
    python: `class ZigzagIterator:
    def __init__(self, v1, v2):
        self.v1, self.v2 = v1, v2
        self.i = self.j = 0
        self.turn = 0
    def next(self):
        if self.turn == 0 and self.i < len(self.v1):
            val = self.v1[self.i]; self.i += 1; self.turn = 1
        elif self.turn == 1 and self.j < len(self.v2):
            val = self.v2[self.j]; self.j += 1; self.turn = 0
        elif self.i < len(self.v1):
            val = self.v1[self.i]; self.i += 1
        else:
            val = self.v2[self.j]; self.j += 1
        return val
    def hasNext(self):
        return self.i < len(self.v1) or self.j < len(self.v2)`,
    javascript: `class ZigzagIterator {
  constructor(v1, v2) {
    this.v1 = v1; this.v2 = v2;
    this.i = this.j = 0;
    this.turn = 0;
  }
  next() {
    if (this.turn === 0 && this.i < this.v1.length) {
      return this.v1[this.i++], this.turn = 1;
    } else if (this.turn === 1 && this.j < this.v2.length) {
      return this.v2[this.j++], this.turn = 0;
    } else if (this.i < this.v1.length) return this.v1[this.i++];
    else return this.v2[this.j++];
  }
  hasNext() { return this.i < this.v1.length || this.j < this.v2.length; }
}`,
    java: `public class ZigzagIterator {
    private List<Integer> v1, v2;
    private int i, j, turn;
    public ZigzagIterator(List<Integer> v1, List<Integer> v2) {
        this.v1=v1; this.v2=v2; i=j=turn=0;
    }
    public int next() {
        if (turn==0 && i<v1.size()) { turn=1; return v1.get(i++); }
        if (turn==1 && j<v2.size()) { turn=0; return v2.get(j++); }
        if (i<v1.size()) return v1.get(i++);
        return v2.get(j++);
    }
    public boolean hasNext() { return i<v1.size() || j<v2.size(); }
}`,
  },
  defaultInput: { v1: [1, 2, 3], v2: [4, 5, 6, 7] },
  inputFields: [
    {
      name: 'v1',
      label: 'List 1',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'First list',
    },
    {
      name: 'v2',
      label: 'List 2',
      type: 'array',
      defaultValue: [4, 5, 6, 7],
      placeholder: '4,5,6,7',
      helperText: 'Second list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const v1 = input.v1 as number[];
    const v2 = input.v2 as number[];
    const steps: AlgorithmStep[] = [];

    // Visualize both lists concatenated
    const combined = [...v1, ...v2];
    let i = 0, j = 0, turn = 0;
    const result: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...combined],
      highlights,
      labels,
      auxData: { label: 'Zigzag Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `ZigzagIterator initialized. v1=[${v1.join(',')}] (indices 0-${v1.length - 1}), v2=[${v2.join(',')}] (indices ${v1.length}-${combined.length - 1}).`,
      variables: { v1, v2, i, j, turn },
      visualization: makeViz(
        {},
        Object.fromEntries([...v1.map((_, idx) => [idx, `v1[${idx}]`]), ...v2.map((_, idx) => [v1.length + idx, `v2[${idx}]`])]),
        [{ key: 'Pointer i', value: '0' }, { key: 'Pointer j', value: '0' }, { key: 'Turn', value: 'v1' }],
      ),
    });

    while (i < v1.length || j < v2.length) {
      let val: number;
      let activeIdx: number;

      if (turn === 0 && i < v1.length) {
        val = v1[i]; activeIdx = i;
        steps.push({
          line: 9,
          explanation: `Turn: v1. next() returns v1[${i}]=${val}. Switch turn to v2.`,
          variables: { val, i, j, turn: 'v1', result: [...result, val] },
          visualization: makeViz(
            { [activeIdx]: 'active' },
            { [activeIdx]: `i=${i}`, [v1.length + j]: j < v2.length ? `j=${j}` : '' },
            [{ key: 'Returned', value: String(val) }, { key: 'From', value: 'v1' }, { key: 'Result so far', value: [...result, val].join(',') }],
          ),
        });
        i++; turn = 1;
      } else if (turn === 1 && j < v2.length) {
        val = v2[j]; activeIdx = v1.length + j;
        steps.push({
          line: 10,
          explanation: `Turn: v2. next() returns v2[${j}]=${val}. Switch turn to v1.`,
          variables: { val, i, j, turn: 'v2', result: [...result, val] },
          visualization: makeViz(
            { [activeIdx]: 'active' },
            { [i < v1.length ? i : 0]: i < v1.length ? `i=${i}` : '', [activeIdx]: `j=${j}` },
            [{ key: 'Returned', value: String(val) }, { key: 'From', value: 'v2' }, { key: 'Result so far', value: [...result, val].join(',') }],
          ),
        });
        j++; turn = 0;
      } else if (i < v1.length) {
        val = v1[i]; activeIdx = i;
        steps.push({
          line: 11,
          explanation: `v2 exhausted. Drain v1: v1[${i}]=${val}.`,
          variables: { val, i },
          visualization: makeViz(
            { [activeIdx]: 'comparing' },
            { [activeIdx]: `i=${i}` },
            [{ key: 'Returned', value: String(val) }, { key: 'From', value: 'v1 (drain)' }],
          ),
        });
        i++;
      } else {
        val = v2[j]; activeIdx = v1.length + j;
        steps.push({
          line: 12,
          explanation: `v1 exhausted. Drain v2: v2[${j}]=${val}.`,
          variables: { val, j },
          visualization: makeViz(
            { [activeIdx]: 'comparing' },
            { [activeIdx]: `j=${j}` },
            [{ key: 'Returned', value: String(val) }, { key: 'From', value: 'v2 (drain)' }],
          ),
        });
        j++;
      }
      result.push(val!);
    }

    steps.push({
      line: 7,
      explanation: `hasNext() = false. Zigzag output: [${result.join(',')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(combined.map((_, idx) => [idx, 'found'])),
        Object.fromEntries(result.map((v, idx) => [idx, `${idx + 1}:${v}`])),
        [{ key: 'Final Order', value: result.join(',') }],
      ),
    });

    return steps;
  },
};

export default zigzagIteratorII;
