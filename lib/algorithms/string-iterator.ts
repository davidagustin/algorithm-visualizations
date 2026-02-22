import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stringIterator: AlgorithmDefinition = {
  id: 'string-iterator',
  title: 'String Iterator',
  leetcodeNumber: undefined,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a basic string iterator that supports next() to return the next character and hasNext() to check if more characters remain. Uses a single index pointer. O(1) per operation, O(n) space for the string.',
  tags: ['Design', 'Iterator', 'String'],
  code: {
    pseudocode: `class StringIterator:
  def __init__(str):
    self.s = str
    self.idx = 0
  def next():
    if not hasNext(): return null
    char = s[idx]
    idx++
    return char
  def hasNext():
    return idx < len(s)
  def peek():
    if not hasNext(): return null
    return s[idx]`,
    python: `class StringIterator:
    def __init__(self, s: str):
        self.s = s
        self.idx = 0
    def next(self) -> str:
        if not self.hasNext(): return None
        c = self.s[self.idx]
        self.idx += 1
        return c
    def hasNext(self) -> bool:
        return self.idx < len(self.s)
    def peek(self) -> str:
        return self.s[self.idx] if self.hasNext() else None`,
    javascript: `class StringIterator {
  constructor(s) { this.s = s; this.idx = 0; }
  next() {
    if (!this.hasNext()) return null;
    return this.s[this.idx++];
  }
  hasNext() { return this.idx < this.s.length; }
  peek() { return this.hasNext() ? this.s[this.idx] : null; }
}`,
    java: `class StringIterator {
    private String s; private int idx;
    public StringIterator(String s) { this.s=s; this.idx=0; }
    public char next() { return s.charAt(idx++); }
    public boolean hasNext() { return idx < s.length(); }
    public char peek() { return s.charAt(idx); }
}`,
  },
  defaultInput: { str: 'hello' },
  inputFields: [
    {
      name: 'str',
      label: 'String',
      type: 'string',
      defaultValue: 'hello',
      placeholder: 'hello',
      helperText: 'String to iterate over',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str = (input.str as string) || 'hello';
    const steps: AlgorithmStep[] = [];
    const chars = str.split('').map(c => c.charCodeAt(0));
    let idx = 0;
    const result: string[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...chars],
      highlights,
      labels,
      auxData: { label: 'String Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `StringIterator created for "${str}". Array shows char codes. idx=0.`,
      variables: { str, idx },
      visualization: makeViz(
        {},
        Object.fromEntries(str.split('').map((c, i) => [i, `'${c}'`])),
        [{ key: 'String', value: str }, { key: 'idx', value: '0' }],
      ),
    });

    while (idx < str.length) {
      const c = str[idx];
      result.push(c);

      steps.push({
        line: 5,
        explanation: `next() = '${c}' (index ${idx}). Advance idx to ${idx + 1}. hasNext()=${idx + 1 < str.length}.`,
        variables: { returned: c, idx, nextIdx: idx + 1 },
        visualization: makeViz(
          { [idx]: 'active' },
          Object.fromEntries(str.split('').map((ch, i) => [i, i < idx ? 'done' : `'${ch}'`])),
          [{ key: 'next()', value: `'${c}'` }, { key: 'idx', value: String(idx + 1) }, { key: 'Result', value: result.join('') }],
        ),
      });
      idx++;
    }

    steps.push({
      line: 8,
      explanation: `hasNext() = false. All characters consumed. Output: "${result.join('')}".`,
      variables: { result: result.join(''), idx },
      visualization: makeViz(
        Object.fromEntries(str.split('').map((_, i) => [i, 'found'])),
        Object.fromEntries(str.split('').map((c, i) => [i, `'${c}'`])),
        [{ key: 'Output', value: result.join('') }, { key: 'hasNext', value: 'false' }],
      ),
    });

    return steps;
  },
};

export default stringIterator;
