import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const peekingIteratorII: AlgorithmDefinition = {
  id: 'peeking-iterator-ii',
  title: 'Peeking Iterator II',
  leetcodeNumber: 284,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design an iterator that supports peek() in addition to next() and hasNext(). Cache the next value by calling next() eagerly. peek() returns the cached value without advancing. next() returns cached and fetches the next one. O(1) per operation.',
  tags: ['Design', 'Iterator', 'Array'],
  code: {
    pseudocode: `class PeekingIterator:
  def __init__(iterator):
    self.iter = iterator
    self.peeked = None
    self.hasPeeked = False
  def peek():
    if not hasPeeked:
      peeked = iter.next()
      hasPeeked = True
    return peeked
  def next():
    if hasPeeked:
      hasPeeked = False
      return peeked
    return iter.next()
  def hasNext():
    return hasPeeked or iter.hasNext()`,
    python: `class PeekingIterator:
    def __init__(self, iterator):
        self._iter = iterator
        self._peeked = None
        self._has_peeked = False
    def peek(self):
        if not self._has_peeked:
            self._peeked = next(self._iter)
            self._has_peeked = True
        return self._peeked
    def next(self):
        if self._has_peeked:
            self._has_peeked = False
            return self._peeked
        return next(self._iter)
    def hasNext(self):
        return self._has_peeked or self._iter.hasNext()`,
    javascript: `class PeekingIterator {
  constructor(iterator) {
    this.iter = iterator;
    this.peeked = null;
    this.hasPeeked = false;
  }
  peek() {
    if (!this.hasPeeked) {
      this.peeked = this.iter.next();
      this.hasPeeked = true;
    }
    return this.peeked;
  }
  next() {
    if (this.hasPeeked) { this.hasPeeked=false; return this.peeked; }
    return this.iter.next();
  }
  hasNext() { return this.hasPeeked || this.iter.hasNext(); }
}`,
    java: `class PeekingIterator implements Iterator<Integer> {
    private Iterator<Integer> iter;
    private Integer peeked = null;
    public PeekingIterator(Iterator<Integer> iterator) { iter = iterator; }
    public Integer peek() {
        if (peeked == null) peeked = iter.next();
        return peeked;
    }
    public Integer next() {
        if (peeked != null) { Integer v=peeked; peeked=null; return v; }
        return iter.next();
    }
    public boolean hasNext() { return peeked != null || iter.hasNext(); }
}`,
  },
  defaultInput: { nums: [1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Elements to iterate over',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    let idx = 0;
    let peeked: number | null = null;
    let hasPeeked = false;
    const result: string[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Peeking Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `PeekingIterator created for [${nums.join(',')}]. Supports peek(), next(), hasNext().`,
      variables: { nums, idx, hasPeeked },
      visualization: makeViz(
        {},
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [{ key: 'hasPeeked', value: 'false' }, { key: 'peeked', value: 'null' }],
      ),
    });

    // Simulate: peek, next, peek, next alternately
    const ops = ['peek', 'next', 'peek', 'next', 'next'];
    for (const op of ops) {
      if (idx >= nums.length && !hasPeeked) break;

      if (op === 'peek') {
        if (!hasPeeked) {
          peeked = nums[idx++];
          hasPeeked = true;
        }
        result.push(`peek=${peeked}`);
        steps.push({
          line: 7,
          explanation: `peek(): cached value = ${peeked}. No advance. hasPeeked=${hasPeeked}.`,
          variables: { peeked, hasPeeked, idx },
          visualization: makeViz(
            { [idx - 1]: 'pointer' },
            Object.fromEntries(nums.map((v, i) => [i, i === idx - 1 ? `peek=${v}` : String(v)])),
            [{ key: 'Operation', value: 'peek()' }, { key: 'Returns', value: String(peeked) }, { key: 'hasPeeked', value: String(hasPeeked) }],
          ),
        });
      } else if (op === 'next') {
        let val: number;
        if (hasPeeked) {
          val = peeked!; hasPeeked = false; peeked = null;
        } else {
          val = nums[idx++];
        }
        result.push(`next=${val}`);
        steps.push({
          line: 10,
          explanation: `next(): returns ${val}. hasPeeked reset to false.`,
          variables: { val, hasPeeked: false, idx },
          visualization: makeViz(
            { [idx - (hasPeeked ? 0 : 1)]: 'active' },
            Object.fromEntries(nums.map((v, i) => [i, String(v)])),
            [{ key: 'Operation', value: 'next()' }, { key: 'Returns', value: String(val) }, { key: 'hasPeeked', value: 'false' }],
          ),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `Iterator simulation complete. Operations: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [{ key: 'Operations Log', value: result.join(', ') }],
      ),
    });

    return steps;
  },
};

export default peekingIteratorII;
