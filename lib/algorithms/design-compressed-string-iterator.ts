import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designCompressedStringIterator: AlgorithmDefinition = {
  id: 'design-compressed-string-iterator',
  title: 'Design Compressed String Iterator',
  leetcodeNumber: 604,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a StringIterator for a compressed string like "L1e2t1C1o1d1e1". Parse each character and its repeat count. next() returns characters one at a time by decrementing the count. hasNext() checks if more characters remain. O(1) per call after O(n) initialization.',
  tags: ['Design', 'String', 'Iterator'],
  code: {
    pseudocode: `class StringIterator:
  def __init__(compressedString):
    self.chars = []  // (char, count) pairs
    parse compressedString into pairs
    self.ptr = 0
  def next():
    if not hasNext(): return ' '
    char, count = chars[ptr]
    chars[ptr] = (char, count-1)
    if count-1 == 0: ptr++
    return char
  def hasNext():
    return ptr < len(chars)`,
    python: `class StringIterator:
    def __init__(self, s):
        self.pairs = []
        i = 0
        while i < len(s):
            c = s[i]; i += 1
            num = 0
            while i < len(s) and s[i].isdigit():
                num = num*10 + int(s[i]); i += 1
            self.pairs.append([c, num])
        self.ptr = 0
    def next(self):
        if not self.hasNext(): return ' '
        c, cnt = self.pairs[self.ptr]
        self.pairs[self.ptr][1] -= 1
        if self.pairs[self.ptr][1] == 0: self.ptr += 1
        return c
    def hasNext(self):
        return self.ptr < len(self.pairs)`,
    javascript: `class StringIterator {
  constructor(s) {
    this.pairs = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i++];
      let num = 0;
      while (i < s.length && !isNaN(s[i])) num = num*10 + Number(s[i++]);
      this.pairs.push([c, num]);
    }
    this.ptr = 0;
  }
  next() {
    if (!this.hasNext()) return ' ';
    const [c] = this.pairs[this.ptr];
    if (--this.pairs[this.ptr][1] === 0) this.ptr++;
    return c;
  }
  hasNext() { return this.ptr < this.pairs.length; }
}`,
    java: `class StringIterator {
    private char[] chars; private int[] counts; private int ptr;
    public StringIterator(String s) {
        List<char[]> tmp = new ArrayList<>();
        int i=0;
        while(i<s.length()) {
            char c=s.charAt(i++); int n=0;
            while(i<s.length()&&Character.isDigit(s.charAt(i))) n=n*10+(s.charAt(i++)-'0');
            tmp.add(new char[]{c,(char)n});
        }
        chars=new char[tmp.size()]; counts=new int[tmp.size()];
        for(int j=0;j<tmp.size();j++){chars[j]=tmp.get(j)[0];counts[j]=tmp.get(j)[1];}
    }
    public char next(){ if(!hasNext())return ' '; char c=chars[ptr]; if(--counts[ptr]==0)ptr++; return c; }
    public boolean hasNext(){ return ptr<chars.length; }
}`,
  },
  defaultInput: { compressedString: 'L1e2t1C1o1d1e1' },
  inputFields: [
    {
      name: 'compressedString',
      label: 'Compressed String',
      type: 'string',
      defaultValue: 'L1e2t1C1o1d1e1',
      placeholder: 'L1e2t1C1o1d1e1',
      helperText: 'Format: char followed by count (e.g., a3b2)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const compressedString = input.compressedString as string;
    const steps: AlgorithmStep[] = [];

    // Parse pairs
    const pairs: [string, number][] = [];
    let i = 0;
    while (i < compressedString.length) {
      const c = compressedString[i++];
      let num = 0;
      while (i < compressedString.length && !isNaN(Number(compressedString[i])) && compressedString[i] !== ' ') {
        num = num * 10 + Number(compressedString[i++]);
      }
      pairs.push([c, num]);
    }

    const counts = pairs.map(p => p[1]);
    const chars = pairs.map(p => p[0]);
    const totalChars = counts.reduce((a, b) => a + b, 0);
    let ptr = 0;
    const result: string[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...counts],
      highlights,
      labels,
      auxData: { label: 'Compressed Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Parsed "${compressedString}" into ${pairs.length} pairs: ${pairs.map(p => `${p[0]}×${p[1]}`).join(', ')}. Total chars: ${totalChars}.`,
      variables: { pairs, totalChars },
      visualization: makeViz(
        {},
        Object.fromEntries(pairs.map((p, i) => [i, `${p[0]}×${p[1]}`])),
        [{ key: 'Pairs', value: pairs.map(p => `${p[0]}×${p[1]}`).join(', ') }],
      ),
    });

    const workingCounts = [...counts];
    let workingPtr = 0;
    for (let call = 0; call < Math.min(totalChars, 10); call++) {
      if (workingPtr >= pairs.length) break;
      const c = chars[workingPtr];
      workingCounts[workingPtr]--;
      result.push(c);

      const advancedPtr = workingCounts[workingPtr] === 0;
      if (advancedPtr) workingPtr++;

      steps.push({
        line: 9,
        explanation: `next() = '${c}'. Count for '${c}' reduced to ${workingCounts[workingPtr - (advancedPtr ? 1 : 0)]}${advancedPtr ? '. Moving to next pair.' : '.'} Result: "${result.join('')}".`,
        variables: { returned: c, ptr: workingPtr, result: result.join('') },
        visualization: makeViz(
          { [workingPtr - (advancedPtr ? 1 : 0)]: 'active' },
          Object.fromEntries(workingCounts.map((cnt, i) => [i, `${chars[i]}×${cnt}`])),
          [{ key: 'Returned', value: c }, { key: 'Result', value: result.join('') }, { key: 'ptr', value: String(workingPtr) }],
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `hasNext()=${workingPtr < pairs.length}. Output so far: "${result.join('')}".`,
      variables: { result: result.join(''), hasNext: workingPtr < pairs.length },
      visualization: makeViz(
        Object.fromEntries(workingCounts.map((_, i) => [i, i < workingPtr ? 'visited' : 'found'])),
        Object.fromEntries(workingCounts.map((cnt, i) => [i, `${chars[i]}×${cnt}`])),
        [{ key: 'Output', value: result.join('') }, { key: 'hasNext', value: String(workingPtr < pairs.length) }],
      ),
    });

    return steps;
  },
};

export default designCompressedStringIterator;
