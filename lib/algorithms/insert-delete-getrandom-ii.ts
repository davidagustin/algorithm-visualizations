import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertDeleteGetrandomIi: AlgorithmDefinition = {
  id: 'insert-delete-getrandom-ii',
  title: 'Insert Delete GetRandom O(1) - Duplicates allowed',
  leetcodeNumber: 381,
  difficulty: 'Hard',
  category: 'Hash Map',
  description:
    'Design a data structure that supports insert, remove, and getRandom in O(1) average time, with duplicates allowed. Use an array for O(1) random access and a hash map from value to set of indices for O(1) lookup and removal.',
  tags: ['Hash Map', 'Design', 'Array', 'Random'],
  code: {
    pseudocode: `class RandomizedCollection:
  function init():
    arr = []   // values
    idx = {}   // value -> set of indices
  function insert(val):
    idx[val].add(len(arr))
    arr.append(val)
    return size of idx[val] == 1
  function remove(val):
    if val not in idx or empty: return false
    remove_idx = any index from idx[val]
    last = arr[-1]
    arr[remove_idx] = last
    idx[last].add(remove_idx); idx[last].remove(len(arr)-1)
    idx[val].remove(remove_idx)
    arr.pop()
    return true
  function getRandom():
    return arr[random index]`,
    python: `import random
from collections import defaultdict

class RandomizedCollection:
    def __init__(self):
        self.arr = []
        self.idx = defaultdict(set)

    def insert(self, val: int) -> bool:
        self.idx[val].add(len(self.arr))
        self.arr.append(val)
        return len(self.idx[val]) == 1

    def remove(self, val: int) -> bool:
        if not self.idx[val]: return False
        remove_idx = next(iter(self.idx[val]))
        last = self.arr[-1]
        self.arr[remove_idx] = last
        self.idx[last].add(remove_idx)
        self.idx[last].discard(len(self.arr) - 1)
        self.idx[val].discard(remove_idx)
        self.arr.pop()
        return True

    def getRandom(self) -> int:
        return random.choice(self.arr)`,
    javascript: `class RandomizedCollection {
  constructor() { this.arr = []; this.idx = new Map(); }
  insert(val) {
    if (!this.idx.has(val)) this.idx.set(val, new Set());
    this.idx.get(val).add(this.arr.length);
    this.arr.push(val);
    return this.idx.get(val).size === 1;
  }
  remove(val) {
    if (!this.idx.has(val) || !this.idx.get(val).size) return false;
    const ri = this.idx.get(val).values().next().value;
    const last = this.arr[this.arr.length - 1];
    this.arr[ri] = last;
    this.idx.get(last).add(ri);
    this.idx.get(last).delete(this.arr.length - 1);
    this.idx.get(val).delete(ri);
    this.arr.pop();
    return true;
  }
  getRandom() { return this.arr[Math.floor(Math.random() * this.arr.length)]; }
}`,
    java: `class RandomizedCollection {
    List<Integer> arr = new ArrayList<>();
    Map<Integer, Set<Integer>> idx = new HashMap<>();
    public boolean insert(int val) {
        idx.computeIfAbsent(val, k -> new HashSet<>()).add(arr.size());
        arr.add(val);
        return idx.get(val).size() == 1;
    }
    public boolean remove(int val) {
        if (!idx.containsKey(val) || idx.get(val).isEmpty()) return false;
        int ri = idx.get(val).iterator().next();
        int last = arr.get(arr.size() - 1);
        arr.set(ri, last); idx.get(last).add(ri); idx.get(last).remove(arr.size()-1);
        idx.get(val).remove(ri); arr.remove(arr.size()-1); return true;
    }
    public int getRandom() { return arr.get((int)(Math.random() * arr.size())); }
}`,
  },
  defaultInput: {
    operations: [['insert', 1], ['insert', 1], ['insert', 2], ['getRandom'], ['remove', 1], ['getRandom']],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'insert 1, insert 1, insert 2, getRandom, remove 1, getRandom',
      placeholder: 'insert 1, remove 1, getRandom',
      helperText: 'Comma-separated: "insert val", "remove val", "getRandom"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return parts.length > 1 ? [parts[0], Number(parts[1])] : [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const arr: number[] = [];
    const idx = new Map<number, Set<number>>();

    function makeViz(activeIdx: number, label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      arr.forEach((v, i) => {
        highlights[i] = i === activeIdx ? 'active' : 'default';
        lbls[i] = `[${i}]`;
      });
      return {
        type: 'array',
        array: [...arr],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Randomized Collection',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${arr.length}` },
            { key: 'Array', value: arr.join(', ') || 'empty' },
            ...Array.from(idx.entries()).map(([v, s]) => ({ key: `val=${v}`, value: `indices=[${Array.from(s).join(',')}]` })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize RandomizedCollection.', variables: {}, visualization: makeViz(-1, 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'insert') {
        const val = Number(op[1]);
        if (!idx.has(val)) idx.set(val, new Set());
        idx.get(val)!.add(arr.length);
        arr.push(val);
        const isNew = idx.get(val)!.size === 1;
        steps.push({ line: 5, explanation: `insert(${val}): Add ${val} at index ${arr.length - 1}. Is new element: ${isNew}. Array: [${arr.join(', ')}].`, variables: { val, isNew, size: arr.length }, visualization: makeViz(arr.length - 1, `insert(${val}) -> ${isNew}`) });
      } else if (opType === 'remove') {
        const val = Number(op[1]);
        if (!idx.has(val) || idx.get(val)!.size === 0) {
          steps.push({ line: 10, explanation: `remove(${val}): Value ${val} not in collection. Return false.`, variables: { val, result: false }, visualization: makeViz(-1, `remove(${val}) -> false`) });
        } else {
          const ri = idx.get(val)!.values().next().value!;
          const last = arr[arr.length - 1];
          arr[ri] = last;
          idx.get(last)!.add(ri);
          idx.get(last)!.delete(arr.length - 1);
          idx.get(val)!.delete(ri);
          arr.pop();
          steps.push({ line: 14, explanation: `remove(${val}): Swap element at index ${ri} with last element (${last}), then pop. Array: [${arr.join(', ')}].`, variables: { val, removedIdx: ri, last, size: arr.length }, visualization: makeViz(ri < arr.length ? ri : -1, `remove(${val}) -> true`) });
        }
      } else if (opType === 'getRandom') {
        if (arr.length === 0) {
          steps.push({ line: 19, explanation: 'getRandom(): Collection is empty.', variables: { result: -1 }, visualization: makeViz(-1, 'getRandom() -> empty') });
        } else {
          const randIdx = Math.floor(arr.length / 2);
          const result = arr[randIdx];
          steps.push({ line: 19, explanation: `getRandom(): Return random element. Demo picks index ${randIdx} = ${result}. Each value has equal probability.`, variables: { result, demoIdx: randIdx }, visualization: makeViz(randIdx, `getRandom() -> ${result}`) });
        }
      }
    }

    steps.push({ line: 20, explanation: `All operations complete. Final collection: [${arr.join(', ')}].`, variables: { size: arr.length }, visualization: makeViz(-1, 'Complete') });

    return steps;
  },
};

export default insertDeleteGetrandomIi;
