import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const iteratorForCombination: AlgorithmDefinition = {
  id: 'iterator-for-combination',
  title: 'Iterator for Combination',
  leetcodeNumber: 1286,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a CombinationIterator that generates all length-k combinations from a sorted character string in lexicographic order. Pre-generate all combinations using backtracking, store in a list, and iterate through them. O(C(n,k)) space and time for initialization.',
  tags: ['Design', 'Iterator', 'Backtracking', 'String'],
  code: {
    pseudocode: `class CombinationIterator:
  def __init__(characters, combinationLength):
    self.combos = []
    self.idx = 0
    backtrack(characters, combinationLength, 0, "")
  def backtrack(chars, k, start, current):
    if len(current) == k:
      combos.append(current)
    for i from start to len(chars)-1:
      backtrack(chars, k, i+1, current+chars[i])
  def next(): return combos[idx++]
  def hasNext(): return idx < len(combos)`,
    python: `class CombinationIterator:
    def __init__(self, characters, combinationLength):
        self.combos = []
        self.idx = 0
        def bt(start, cur):
            if len(cur) == combinationLength:
                self.combos.append(cur); return
            for i in range(start, len(characters)):
                bt(i+1, cur+characters[i])
        bt(0, "")
    def next(self): v=self.combos[self.idx]; self.idx+=1; return v
    def hasNext(self): return self.idx < len(self.combos)`,
    javascript: `class CombinationIterator {
  constructor(characters, combinationLength) {
    this.combos = [];
    this.idx = 0;
    const bt = (start, cur) => {
      if (cur.length === combinationLength) { this.combos.push(cur); return; }
      for (let i = start; i < characters.length; i++)
        bt(i+1, cur+characters[i]);
    };
    bt(0, '');
  }
  next() { return this.combos[this.idx++]; }
  hasNext() { return this.idx < this.combos.length; }
}`,
    java: `class CombinationIterator {
    private List<String> combos = new ArrayList<>();
    private int idx = 0;
    public CombinationIterator(String characters, int combinationLength) {
        backtrack(characters, combinationLength, 0, new StringBuilder());
    }
    private void backtrack(String s, int k, int start, StringBuilder cur) {
        if (cur.length()==k) { combos.add(cur.toString()); return; }
        for (int i=start; i<s.length(); i++) {
            cur.append(s.charAt(i));
            backtrack(s, k, i+1, cur);
            cur.deleteCharAt(cur.length()-1);
        }
    }
    public String next() { return combos.get(idx++); }
    public boolean hasNext() { return idx < combos.size(); }
}`,
  },
  defaultInput: { characters: 'abc', combinationLength: 2 },
  inputFields: [
    {
      name: 'characters',
      label: 'Characters',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'Sorted character string',
    },
    {
      name: 'combinationLength',
      label: 'Combination Length',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Length of each combination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const characters = input.characters as string;
    const combinationLength = input.combinationLength as number;
    const steps: AlgorithmStep[] = [];

    const combos: string[] = [];
    const bt = (start: number, cur: string) => {
      if (cur.length === combinationLength) { combos.push(cur); return; }
      for (let i = start; i < characters.length; i++) {
        bt(i + 1, cur + characters[i]);
      }
    };
    bt(0, '');

    // Represent combinations as numeric (char codes) for visualization
    const comboNums = combos.map(c => c.charCodeAt(0) * 100 + (c.length > 1 ? c.charCodeAt(1) : 0));
    let idx = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...comboNums],
      highlights,
      labels,
      auxData: { label: 'CombinationIterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `CombinationIterator("${characters}", ${combinationLength}). Generated ${combos.length} combinations: [${combos.join(', ')}].`,
      variables: { characters, combinationLength, totalCombos: combos.length },
      visualization: makeViz(
        {},
        Object.fromEntries(combos.map((c, i) => [i, c])),
        [{ key: 'Combinations', value: combos.join(', ') }, { key: 'Count', value: String(combos.length) }],
      ),
    });

    while (idx < combos.length) {
      const combo = combos[idx];
      steps.push({
        line: 11,
        explanation: `next() returns "${combo}" (index ${idx}). hasNext()=${idx + 1 < combos.length}.`,
        variables: { combo, idx, hasNext: idx + 1 < combos.length },
        visualization: makeViz(
          { [idx]: 'active' },
          Object.fromEntries(combos.map((c, i) => [i, i === idx ? `=>${c}` : c])),
          [{ key: 'Returned', value: combo }, { key: 'Index', value: String(idx) }, { key: 'hasNext', value: String(idx + 1 < combos.length) }],
        ),
      });
      idx++;
    }

    steps.push({
      line: 12,
      explanation: `hasNext() = false. All ${combos.length} combinations exhausted.`,
      variables: { idx },
      visualization: makeViz(
        Object.fromEntries(combos.map((_, i) => [i, 'found'])),
        Object.fromEntries(combos.map((c, i) => [i, c])),
        [{ key: 'Done', value: 'All combinations iterated' }],
      ),
    });

    return steps;
  },
};

export default iteratorForCombination;
