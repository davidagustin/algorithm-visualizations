import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const insertDeleteGetrandom: AlgorithmDefinition = {
  id: 'insert-delete-getrandom',
  title: 'Insert Delete GetRandom O(1)',
  leetcodeNumber: 380,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a data structure that supports insert, delete, and getRandom in average O(1) time. Use an array for O(1) random access and a hash map to store each value\'s index. For deletion, swap the target with the last element, update the map, then pop the array end.',
  tags: ['hash map', 'array', 'design', 'randomized'],

  code: {
    pseudocode: `class RandomizedSet:
  list = []
  indexMap = {}   // val -> index in list

  insert(val):
    if val in indexMap: return false
    indexMap[val] = len(list)
    list.append(val)
    return true

  remove(val):
    if val not in indexMap: return false
    idx = indexMap[val]
    last = list.back()
    list[idx] = last
    indexMap[last] = idx
    list.pop_back()
    delete indexMap[val]
    return true

  getRandom():
    return list[random(0, len(list)-1)]`,

    python: `import random

class RandomizedSet:
    def __init__(self):
        self.lst = []
        self.idx_map = {}

    def insert(self, val: int) -> bool:
        if val in self.idx_map:
            return False
        self.idx_map[val] = len(self.lst)
        self.lst.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.idx_map:
            return False
        idx = self.idx_map[val]
        last = self.lst[-1]
        self.lst[idx] = last
        self.idx_map[last] = idx
        self.lst.pop()
        del self.idx_map[val]
        return True

    def getRandom(self) -> int:
        return random.choice(self.lst)`,

    javascript: `class RandomizedSet {
  constructor() {
    this.list = [];
    this.indexMap = new Map();
  }

  insert(val) {
    if (this.indexMap.has(val)) return false;
    this.indexMap.set(val, this.list.length);
    this.list.push(val);
    return true;
  }

  remove(val) {
    if (!this.indexMap.has(val)) return false;
    const idx = this.indexMap.get(val);
    const last = this.list[this.list.length - 1];
    this.list[idx] = last;
    this.indexMap.set(last, idx);
    this.list.pop();
    this.indexMap.delete(val);
    return true;
  }

  getRandom() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
}`,

    java: `class RandomizedSet {
    List<Integer> list = new ArrayList<>();
    Map<Integer, Integer> indexMap = new HashMap<>();

    public boolean insert(int val) {
        if (indexMap.containsKey(val)) return false;
        indexMap.put(val, list.size());
        list.add(val);
        return true;
    }

    public boolean remove(int val) {
        if (!indexMap.containsKey(val)) return false;
        int idx = indexMap.get(val);
        int last = list.get(list.size() - 1);
        list.set(idx, last);
        indexMap.put(last, idx);
        list.remove(list.size() - 1);
        indexMap.remove(val);
        return true;
    }

    public int getRandom() {
        return list.get(new Random().nextInt(list.size()));
    }
}`,
  },

  defaultInput: {
    values: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Values to Insert',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Values to insert into the randomized set',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = input.values as number[];
    const steps: AlgorithmStep[] = [];
    const list: number[] = [];
    const indexMap: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: 'Initialize RandomizedSet with an empty list and index map.',
      variables: { list: '[]', indexMap: '{}' },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    // Insert all values
    for (const val of values) {
      if (val in indexMap) {
        steps.push({
          line: 4,
          explanation: `insert(${val}): Value ${val} already exists in the set. Return false.`,
          variables: { val, exists: true },
          visualization: {
            type: 'array',
            array: [...list],
            highlights: { [indexMap[val]]: 'comparing' },
            labels: { [indexMap[val]]: `dup:${val}` },
          },
        });
        continue;
      }
      indexMap[val] = list.length;
      list.push(val);
      steps.push({
        line: 5,
        explanation: `insert(${val}): Add ${val} at index ${list.length - 1}. Map[${val}] = ${list.length - 1}. Return true.`,
        variables: { val, insertedAt: list.length - 1, listSize: list.length },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [list.length - 1]: 'active' },
          labels: { [list.length - 1]: 'new' },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `All ${values.length} values inserted. Current set has ${list.length} elements.`,
      variables: { setSize: list.length, elements: [...list].join(', ') },
      visualization: {
        type: 'array',
        array: [...list],
        highlights: list.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: {},
      },
    });

    // Demonstrate delete: remove element at index 1 (if exists)
    if (list.length >= 2) {
      const toRemove = list[1];
      const removeIdx = indexMap[toRemove];
      const lastVal = list[list.length - 1];

      steps.push({
        line: 11,
        explanation: `remove(${toRemove}): Found at index ${removeIdx}. Will swap with last element (${lastVal}) then pop.`,
        variables: { valToRemove: toRemove, currentIdx: removeIdx, lastElement: lastVal },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [removeIdx]: 'swapping', [list.length - 1]: 'active' },
          labels: { [removeIdx]: 'remove', [list.length - 1]: 'last' },
        },
      });

      list[removeIdx] = lastVal;
      indexMap[lastVal] = removeIdx;
      list.pop();
      delete indexMap[toRemove];

      steps.push({
        line: 15,
        explanation: `Swapped ${toRemove} with last element ${lastVal}, updated map, popped array end. ${toRemove} is removed. O(1) deletion complete.`,
        variables: { removed: toRemove, newPositionOf: lastVal, atIndex: removeIdx, setSize: list.length },
        visualization: {
          type: 'array',
          array: [...list],
          highlights: { [removeIdx]: 'found' },
          labels: { [removeIdx]: `moved:${lastVal}` },
        },
      });
    }

    // getRandom demo
    const randomIdx = Math.floor(Math.random() * list.length);
    steps.push({
      line: 19,
      explanation: `getRandom(): Pick a random index from 0 to ${list.length - 1}. Got index ${randomIdx} -> value ${list[randomIdx]}.`,
      variables: { randomIndex: randomIdx, randomValue: list[randomIdx], listSize: list.length },
      visualization: {
        type: 'array',
        array: [...list],
        highlights: { [randomIdx]: 'pointer' },
        labels: { [randomIdx]: 'random' },
      },
    });

    return steps;
  },
};

export default insertDeleteGetrandom;
