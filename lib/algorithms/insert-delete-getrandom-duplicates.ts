import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const insertDeleteGetrandomDuplicates: AlgorithmDefinition = {
  id: 'insert-delete-getrandom-duplicates',
  title: 'Insert Delete GetRandom O(1) - Duplicates Allowed',
  leetcodeNumber: 381,
  difficulty: 'Hard',
  category: 'Design',
  description:
    'Extend the O(1) insert/delete/getRandom set to allow duplicate values. The index map now stores a set of indices for each value. During removal, use any one index from the set, swap with the last element, and update both sets. getRandom picks uniformly across all elements including duplicates.',
  tags: ['hash map', 'array', 'design', 'randomized', 'duplicates'],

  code: {
    pseudocode: `class RandomizedCollection:
  list = []
  indexMap = {}   // val -> set of indices

  insert(val):
    indexMap[val].add(len(list))
    list.append(val)
    return len(indexMap[val]) == 1  // true if first occurrence

  remove(val):
    if val not in indexMap or indexMap[val] empty: return false
    removeIdx = any index from indexMap[val]
    lastVal = list.back()
    lastIdx = len(list) - 1
    list[removeIdx] = lastVal
    indexMap[lastVal].add(removeIdx)
    indexMap[lastVal].remove(lastIdx)
    indexMap[val].remove(removeIdx)
    list.pop_back()
    return true

  getRandom():
    return list[random(0, len(list)-1)]`,

    python: `import random
from collections import defaultdict

class RandomizedCollection:
    def __init__(self):
        self.lst = []
        self.idx = defaultdict(set)

    def insert(self, val: int) -> bool:
        self.idx[val].add(len(self.lst))
        self.lst.append(val)
        return len(self.idx[val]) == 1

    def remove(self, val: int) -> bool:
        if not self.idx[val]:
            return False
        remove_idx = next(iter(self.idx[val]))
        last_val = self.lst[-1]
        last_idx = len(self.lst) - 1
        self.lst[remove_idx] = last_val
        self.idx[last_val].add(remove_idx)
        self.idx[last_val].discard(last_idx)
        self.idx[val].discard(remove_idx)
        self.lst.pop()
        return True

    def getRandom(self) -> int:
        return random.choice(self.lst)`,

    javascript: `class RandomizedCollection {
  constructor() {
    this.list = [];
    this.indexMap = new Map();
  }

  insert(val) {
    if (!this.indexMap.has(val)) this.indexMap.set(val, new Set());
    this.indexMap.get(val).add(this.list.length);
    this.list.push(val);
    return this.indexMap.get(val).size === 1;
  }

  remove(val) {
    if (!this.indexMap.has(val) || !this.indexMap.get(val).size) return false;
    const removeIdx = this.indexMap.get(val).values().next().value;
    const lastIdx = this.list.length - 1;
    const lastVal = this.list[lastIdx];
    this.list[removeIdx] = lastVal;
    this.indexMap.get(lastVal).add(removeIdx);
    this.indexMap.get(lastVal).delete(lastIdx);
    this.indexMap.get(val).delete(removeIdx);
    this.list.pop();
    return true;
  }

  getRandom() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
}`,

    java: `class RandomizedCollection {
    List<Integer> list = new ArrayList<>();
    Map<Integer, Set<Integer>> idx = new HashMap<>();

    public boolean insert(int val) {
        idx.computeIfAbsent(val, k -> new LinkedHashSet<>()).add(list.size());
        list.add(val);
        return idx.get(val).size() == 1;
    }

    public boolean remove(int val) {
        if (!idx.containsKey(val) || idx.get(val).isEmpty()) return false;
        int removeIdx = idx.get(val).iterator().next();
        int lastIdx = list.size() - 1;
        int lastVal = list.get(lastIdx);
        list.set(removeIdx, lastVal);
        idx.get(lastVal).add(removeIdx);
        idx.get(lastVal).remove(lastIdx);
        idx.get(val).remove(removeIdx);
        list.remove(lastIdx);
        return true;
    }

    public int getRandom() {
        return list.get(new Random().nextInt(list.size()));
    }
}`,
  },

  defaultInput: {
    values: [1, 1, 2, 2, 3],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Values to Insert (duplicates allowed)',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 3],
      placeholder: '1,1,2,2,3',
      helperText: 'Values with possible duplicates to insert into the collection',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = input.values as number[];
    const steps: AlgorithmStep[] = [];
    const list: number[] = [];
    const indexMap: Record<number, Set<number>> = {};

    steps.push({
      line: 1,
      explanation: 'Initialize RandomizedCollection. Index map stores a SET of indices per value to handle duplicates.',
      variables: { list: '[]', indexMap: '{}', note: 'each value maps to a set of indices' },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    for (const val of values) {
      if (!indexMap[val]) indexMap[val] = new Set();
      const isFirst = indexMap[val].size === 0;
      indexMap[val].add(list.length);
      list.push(val);

      steps.push({
        line: 4,
        explanation: `insert(${val}): Add index ${list.length - 1} to indexMap[${val}]. ${isFirst ? 'First occurrence - return true.' : `Duplicate - already has ${indexMap[val].size - 1} occurrence(s) - return false.`}`,
        variables: { val, insertedAt: list.length - 1, isFirst, occurrences: indexMap[val].size },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [list.length - 1]: isFirst ? 'active' : 'comparing' },
          labels: { [list.length - 1]: isFirst ? 'first' : `dup${indexMap[val].size}` },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `All values inserted. List has ${list.length} elements including duplicates.`,
      variables: { listSize: list.length, elements: [...list].join(', ') },
      visualization: {
        type: 'array',
        array: [...list],
        highlights: list.reduce((acc: Record<number, string>, v, i) => {
          acc[i] = v === 1 ? 'active' : v === 2 ? 'found' : 'pointer';
          return acc;
        }, {}),
        labels: list.reduce((acc: Record<number, string>, v, i) => { acc[i] = String(v); return acc; }, {}),
      },
    });

    // Remove a duplicate value (e.g., value 1)
    const toRemove = values[0];
    if (indexMap[toRemove] && indexMap[toRemove].size > 0) {
      const removeIdx = [...indexMap[toRemove]][0];
      const lastIdx = list.length - 1;
      const lastVal = list[lastIdx];

      steps.push({
        line: 11,
        explanation: `remove(${toRemove}): Pick any index from indexMap[${toRemove}] = {${[...indexMap[toRemove]].join(', ')}}. Using index ${removeIdx}.`,
        variables: { val: toRemove, removeIdx, lastVal, lastIdx },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [removeIdx]: 'swapping', [lastIdx]: 'active' },
          labels: { [removeIdx]: 'remove', [lastIdx]: 'last' },
        },
      });

      // Perform the removal
      list[removeIdx] = lastVal;
      if (!indexMap[lastVal]) indexMap[lastVal] = new Set();
      indexMap[lastVal].add(removeIdx);
      indexMap[lastVal].delete(lastIdx);
      indexMap[toRemove].delete(removeIdx);
      list.pop();

      steps.push({
        line: 17,
        explanation: `Swapped index ${removeIdx} with last element ${lastVal}, updated both index sets, popped array. ${toRemove} removed (one occurrence).`,
        variables: { removed: toRemove, remainingOccurrences: indexMap[toRemove].size, listSize: list.length },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [removeIdx]: 'found' },
          labels: { [removeIdx]: `${lastVal} moved` },
        },
      });
    }

    return steps;
  },
};

export default insertDeleteGetrandomDuplicates;
