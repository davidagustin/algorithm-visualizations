import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rleIteratorII: AlgorithmDefinition = {
  id: 'rle-iterator-ii',
  title: 'RLE Iterator II',
  leetcodeNumber: 900,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design an RLE (Run Length Encoded) iterator. Input is an encoding where encoding[2i]=count and encoding[2i+1]=value. next(n) exhausts the next n elements and returns the last element, or -1 if none remain. Use a pointer and decrement counts. O(n/total) per call.',
  tags: ['Design', 'Iterator', 'Array'],
  code: {
    pseudocode: `class RLEIterator:
  def __init__(encoding):
    self.enc = encoding
    self.idx = 0
  def next(n):
    while idx < len(enc) and n > enc[idx]:
      n -= enc[idx]
      idx += 2
    if idx >= len(enc): return -1
    enc[idx] -= n
    return enc[idx+1]`,
    python: `class RLEIterator:
    def __init__(self, encoding):
        self.enc = encoding[:]
        self.idx = 0
    def next(self, n):
        while self.idx < len(self.enc) and n > self.enc[self.idx]:
            n -= self.enc[self.idx]
            self.idx += 2
        if self.idx >= len(self.enc): return -1
        self.enc[self.idx] -= n
        return self.enc[self.idx+1]`,
    javascript: `class RLEIterator {
  constructor(encoding) { this.enc=[...encoding]; this.idx=0; }
  next(n) {
    while (this.idx<this.enc.length && n>this.enc[this.idx]) {
      n-=this.enc[this.idx]; this.idx+=2;
    }
    if (this.idx>=this.enc.length) return -1;
    this.enc[this.idx]-=n;
    return this.enc[this.idx+1];
  }
}`,
    java: `class RLEIterator {
    private int[] enc; private int idx;
    public RLEIterator(int[] encoding) { enc=encoding.clone(); idx=0; }
    public int next(int n) {
        while (idx<enc.length && n>enc[idx]) { n-=enc[idx]; idx+=2; }
        if (idx>=enc.length) return -1;
        enc[idx]-=n;
        return enc[idx+1];
    }
}`,
  },
  defaultInput: { encoding: [3, 8, 0, 9, 2, 5], queries: [2, 1, 1, 2] },
  inputFields: [
    {
      name: 'encoding',
      label: 'Encoding',
      type: 'array',
      defaultValue: [3, 8, 0, 9, 2, 5],
      placeholder: '3,8,0,9,2,5',
      helperText: 'RLE encoding: [count1, val1, count2, val2, ...]',
    },
    {
      name: 'queries',
      label: 'Queries (n values)',
      type: 'array',
      defaultValue: [2, 1, 1, 2],
      placeholder: '2,1,1,2',
      helperText: 'Each query: exhaust n elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const encoding = [...(input.encoding as number[])];
    const queries = input.queries as number[];
    const steps: AlgorithmStep[] = [];

    let idx = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...encoding],
      highlights,
      labels,
      auxData: { label: 'RLE Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `RLEIterator initialized. Encoding: [${encoding.join(',')}]. Pairs: count-value. Sequence: ${
        encoding.reduce((acc, v, i) => i % 2 === 0 ? acc + Array(v).fill(encoding[i + 1] ?? '').join(',') : acc, '').replace(/,$/, '')
      }.`,
      variables: { encoding: [...encoding] },
      visualization: makeViz(
        {},
        Object.fromEntries(encoding.map((v, i) => [i, i % 2 === 0 ? `cnt=${v}` : `val=${v}`])),
        [{ key: 'Pairs', value: encoding.reduce((acc, v, i) => i % 2 === 0 ? `${acc}(${v}×${encoding[i+1]??'?'}) ` : acc, '') }],
      ),
    });

    for (let qi = 0; qi < queries.length; qi++) {
      let n = queries[qi];
      const origN = n;

      while (idx < encoding.length && n > encoding[idx]) {
        steps.push({
          line: 5,
          explanation: `next(${origN}): n=${n} > enc[${idx}]=${encoding[idx]}. Exhaust this run. n -= ${encoding[idx]} = ${n - encoding[idx]}.`,
          variables: { n, idx, count: encoding[idx], value: encoding[idx + 1] },
          visualization: makeViz(
            { [idx]: 'comparing', [idx + 1]: 'comparing' },
            Object.fromEntries(encoding.map((v, i) => [i, i % 2 === 0 ? `cnt=${v}` : `val=${v}`])),
            [{ key: 'Query n', value: String(n) }, { key: 'Exhausting', value: `${encoding[idx]}×${encoding[idx+1]}` }],
          ),
        });
        n -= encoding[idx];
        idx += 2;
      }

      if (idx >= encoding.length) {
        steps.push({
          line: 7,
          explanation: `next(${origN}): Encoding exhausted. Return -1.`,
          variables: { result: -1 },
          visualization: makeViz(
            {},
            {},
            [{ key: `Query ${qi + 1}`, value: '-1 (exhausted)' }],
          ),
        });
      } else {
        encoding[idx] -= n;
        const result = encoding[idx + 1];
        steps.push({
          line: 9,
          explanation: `next(${origN}): Found value ${result}. enc[${idx}] reduced by ${n} to ${encoding[idx]}.`,
          variables: { result, remainingCount: encoding[idx] },
          visualization: makeViz(
            { [idx]: 'active', [idx + 1]: 'found' },
            Object.fromEntries(encoding.map((v, i) => [i, i % 2 === 0 ? `cnt=${v}` : `val=${v}`])),
            [{ key: `Query ${qi + 1} (n=${origN})`, value: String(result) }, { key: 'Remaining count', value: String(encoding[idx]) }],
          ),
        });
      }
    }

    return steps;
  },
};

export default rleIteratorII;
