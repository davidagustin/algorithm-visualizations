import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeModuleII: AlgorithmDefinition = {
  id: 'range-module-ii',
  title: 'Range Module II',
  leetcodeNumber: 715,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Design a Range Module that tracks ranges of numbers. Supports addRange(l,r), removeRange(l,r), queryRange(l,r). Uses a sorted list of disjoint intervals. addRange merges overlapping/adjacent intervals; removeRange splits or trims; queryRange checks if [l,r) is fully covered. O(n) per operation.',
  tags: ['Intervals', 'Design', 'Sorted List', 'Segment Tree'],
  code: {
    pseudocode: `class RangeModule:
  intervals = []
  addRange(l, r):
    new=[l,r], tmp=[]
    for [s,e] in intervals:
      if e<l or s>r: tmp.push([s,e])
      else: new=[min(new[0],s),max(new[1],e)]
    insert new in sorted position; intervals=tmp+[new] sorted
  queryRange(l, r):
    for [s,e] in intervals:
      if s<=l and r<=e: return true
    return false
  removeRange(l, r):
    tmp=[]
    for [s,e] in intervals:
      if e<=l or s>=r: tmp.push([s,e])
      else:
        if s<l: tmp.push([s,l])
        if e>r: tmp.push([r,e])
    intervals=tmp`,
    python: `class RangeModule:
    def __init__(self): self.ivs = []
    def addRange(self, l, r):
        new, tmp = [l, r], []
        for s, e in self.ivs:
            if e < l or s > r: tmp.append([s, e])
            else: new = [min(new[0],s), max(new[1],e)]
        tmp.append(new); tmp.sort(); self.ivs = tmp
    def queryRange(self, l, r):
        for s, e in self.ivs:
            if s <= l and r <= e: return True
        return False
    def removeRange(self, l, r):
        tmp = []
        for s, e in self.ivs:
            if e <= l or s >= r: tmp.append([s, e])
            else:
                if s < l: tmp.append([s, l])
                if e > r: tmp.append([r, e])
        self.ivs = tmp`,
    javascript: `class RangeModule {
  constructor() { this.ivs = []; }
  addRange(l, r) {
    let [nl, nr] = [l, r];
    const tmp = [];
    for (const [s, e] of this.ivs) {
      if (e < l || s > r) tmp.push([s, e]);
      else { nl = Math.min(nl, s); nr = Math.max(nr, e); }
    }
    tmp.push([nl, nr]); tmp.sort((a,b)=>a[0]-b[0]); this.ivs = tmp;
  }
  queryRange(l, r) {
    return this.ivs.some(([s, e]) => s <= l && r <= e);
  }
  removeRange(l, r) {
    const tmp = [];
    for (const [s, e] of this.ivs) {
      if (e <= l || s >= r) tmp.push([s, e]);
      else { if (s < l) tmp.push([s, l]); if (e > r) tmp.push([r, e]); }
    }
    this.ivs = tmp;
  }
}`,
    java: `class RangeModule {
    TreeMap<Integer,Integer> map = new TreeMap<>();
    public void addRange(int l, int r) {
        Integer s = map.floorKey(r), e;
        while (s != null && map.get(s) >= l) {
            l = Math.min(l, s); r = Math.max(r, map.get(s));
            map.remove(s); s = map.floorKey(r);
        }
        map.put(l, r);
    }
    public boolean queryRange(int l, int r) {
        Integer s = map.floorKey(l);
        return s != null && map.get(s) >= r;
    }
    public void removeRange(int l, int r) {
        Integer s = map.floorKey(r);
        while (s != null && map.get(s) > l) {
            int e = map.remove(s);
            if (s < l) map.put(s, l);
            if (e > r) map.put(r, e);
            s = map.floorKey(r);
        }
    }
}`,
  },
  defaultInput: {
    operations: [
      ['add', 10, 20],
      ['remove', 14, 16],
      ['query', 10, 14],
      ['query', 13, 15],
      ['add', 16, 22],
    ],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'array',
      defaultValue: [
        ['add', 10, 20],
        ['remove', 14, 16],
        ['query', 10, 14],
        ['query', 13, 15],
        ['add', 16, 22],
      ],
      placeholder: '[["add",10,20],["remove",14,16],["query",10,14]]',
      helperText: 'Operations: ["add"|"remove"|"query", left, right]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ops = input.operations as (string | number)[][];
    // Flatten all [l, r] values for visualization
    const allPairs = ops.map(op => [Number(op[1]), Number(op[2])]);
    const flat = allPairs.flat();
    const steps: AlgorithmStep[] = [];
    let ivs: number[][] = [];
    const results: string[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Module State', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1, explanation: `Initialize empty RangeModule. Processing ${ops.length} operations.`,
      variables: {}, visualization: makeViz({}, {}) });

    for (let i = 0; i < ops.length; i++) {
      const [op, l, r] = [String(ops[i][0]), Number(ops[i][1]), Number(ops[i][2])];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };

      if (op === 'add') {
        let nl = l, nr = r;
        const tmp: number[][] = [];
        for (const [s, e] of ivs) {
          if (e < l || s > r) tmp.push([s, e]);
          else { nl = Math.min(nl, s); nr = Math.max(nr, e); }
        }
        tmp.push([nl, nr]); tmp.sort((a, b) => a[0] - b[0]); ivs = tmp;
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({ line: 3, explanation: `addRange(${l},${r}). Merged to [${nl},${nr}]. Intervals: [${ivs.map(iv=>`[${iv[0]},${iv[1]})`).join(', ')}].`,
          variables: { op, l, r, intervals: ivs.map(iv=>[...iv]) },
          visualization: makeViz(hl, { [ci]: `add`, [ci+1]: `[${l},${r})` },
            ivs.map((iv,k)=>({ key: `I${k}`, value: `[${iv[0]},${iv[1]})` }))) });
      } else if (op === 'remove') {
        const tmp: number[][] = [];
        for (const [s, e] of ivs) {
          if (e <= l || s >= r) tmp.push([s, e]);
          else { if (s < l) tmp.push([s, l]); if (e > r) tmp.push([r, e]); }
        }
        ivs = tmp;
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({ line: 12, explanation: `removeRange(${l},${r}). Intervals: [${ivs.map(iv=>`[${iv[0]},${iv[1]})`).join(', ')}].`,
          variables: { op, l, r, intervals: ivs.map(iv=>[...iv]) },
          visualization: makeViz(hl, { [ci]: `rem`, [ci+1]: `[${l},${r})` },
            ivs.map((iv,k)=>({ key: `I${k}`, value: `[${iv[0]},${iv[1]})` }))) });
      } else {
        const covered = ivs.some(([s, e]) => s <= l && r <= e);
        results.push(`q(${l},${r})=${covered}`);
        hl[ci] = covered ? 'found' : 'mismatch'; hl[ci + 1] = hl[ci];
        steps.push({ line: 8, explanation: `queryRange(${l},${r}) = ${covered}. [${l},${r}) ${covered ? 'IS' : 'NOT'} fully covered.`,
          variables: { op, l, r, covered },
          visualization: makeViz(hl, { [ci]: `qry`, [ci+1]: `${covered}` },
            ivs.map((iv,k)=>({ key: `I${k}`, value: `[${iv[0]},${iv[1]})` }))) });
      }
    }

    steps.push({ line: 15, explanation: `All operations done. Final state: ${ivs.length} intervals.`,
      variables: { intervals: ivs.map(iv=>[...iv]) },
      visualization: makeViz({}, {}, ivs.map((iv,k)=>({ key: `I${k}`, value: `[${iv[0]},${iv[1]})` }))) });

    return steps;
  },
};

export default rangeModuleII;
