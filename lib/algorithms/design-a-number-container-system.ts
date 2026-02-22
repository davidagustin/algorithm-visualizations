import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designANumberContainerSystem: AlgorithmDefinition = {
  id: 'design-a-number-container-system',
  title: 'Design a Number Container System',
  leetcodeNumber: 2349,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a number container system that can insert or replace a number at an index, and find the smallest index for a given number. Use two hash maps: one from index to number, and one from number to sorted set of indices.',
  tags: ['Hash Map', 'Design', 'Heap', 'Ordered Set'],
  code: {
    pseudocode: `class NumberContainers:
  function init():
    indexMap = {}    // index -> number
    numberMap = {}   // number -> sorted set of indices
  function change(index, number):
    if index in indexMap:
      old = indexMap[index]
      numberMap[old].remove(index)
    indexMap[index] = number
    numberMap[number].add(index)
  function find(number):
    if number not in numberMap or numberMap[number] empty:
      return -1
    return min(numberMap[number])`,
    python: `from sortedcontainers import SortedList
from collections import defaultdict

class NumberContainers:
    def __init__(self):
        self.idx_map = {}
        self.num_map = defaultdict(SortedList)

    def change(self, index: int, number: int) -> None:
        if index in self.idx_map:
            old = self.idx_map[index]
            self.num_map[old].remove(index)
        self.idx_map[index] = number
        self.num_map[number].add(index)

    def find(self, number: int) -> int:
        sl = self.num_map.get(number)
        return sl[0] if sl else -1`,
    javascript: `class NumberContainers {
  constructor() {
    this.indexMap = new Map();
    this.numberMap = new Map();
  }
  change(index, number) {
    if (this.indexMap.has(index)) {
      const old = this.indexMap.get(index);
      this.numberMap.get(old).delete(index);
    }
    this.indexMap.set(index, number);
    if (!this.numberMap.has(number)) this.numberMap.set(number, new Set());
    this.numberMap.get(number).add(index);
  }
  find(number) {
    const s = this.numberMap.get(number);
    return s && s.size ? Math.min(...s) : -1;
  }
}`,
    java: `class NumberContainers {
    Map<Integer, Integer> indexMap = new HashMap<>();
    Map<Integer, TreeSet<Integer>> numberMap = new HashMap<>();
    public void change(int index, int number) {
        if (indexMap.containsKey(index)) {
            int old = indexMap.get(index);
            numberMap.get(old).remove(index);
        }
        indexMap.put(index, number);
        numberMap.computeIfAbsent(number, k -> new TreeSet<>()).add(index);
    }
    public int find(int number) {
        TreeSet<Integer> s = numberMap.get(number);
        return s != null && !s.isEmpty() ? s.first() : -1;
    }
}`,
  },
  defaultInput: {
    operations: [['change', 2, 10], ['change', 1, 10], ['change', 3, 10], ['find', 10], ['change', 1, 20], ['find', 10]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'change 2 10, change 1 10, change 3 10, find 10, change 1 20, find 10',
      placeholder: 'change 2 10, find 10',
      helperText: 'Comma-separated: "change index number", "find number"',
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
        if (parts.length === 3) return [parts[0], Number(parts[1]), Number(parts[2])];
        return [parts[0], Number(parts[1])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const indexMap = new Map<number, number>();
    const numberMap = new Map<number, Set<number>>();

    function makeViz(activeNum: number, label: string): ArrayVisualization {
      const indices = Array.from(indexMap.keys()).sort((a, b) => a - b);
      const arr = indices.map(i => indexMap.get(i)!);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      indices.forEach((idx, i) => {
        highlights[i] = indexMap.get(idx) === activeNum ? 'active' : 'default';
        lbls[i] = `idx=${idx}`;
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Number Containers',
          entries: [
            { key: 'Action', value: label },
            { key: 'Indices', value: `${indexMap.size}` },
            ...Array.from(indexMap.entries()).map(([k, v]) => ({ key: `idx=${k}`, value: `num=${v}` })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize Number Container System.', variables: {}, visualization: makeViz(-1, 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'change') {
        const index = Number(op[1]);
        const number = Number(op[2]);
        if (indexMap.has(index)) {
          const old = indexMap.get(index)!;
          numberMap.get(old)?.delete(index);
        }
        indexMap.set(index, number);
        if (!numberMap.has(number)) numberMap.set(number, new Set());
        numberMap.get(number)!.add(index);
        steps.push({ line: 7, explanation: `change(${index}, ${number}): Set index ${index} to number ${number}.`, variables: { index, number }, visualization: makeViz(number, `change(${index},${number})`) });
      } else if (opType === 'find') {
        const number = Number(op[1]);
        const s = numberMap.get(number);
        const result = s && s.size ? Math.min(...s) : -1;
        steps.push({ line: 12, explanation: `find(${number}): Smallest index with number ${number} is ${result}.`, variables: { number, result }, visualization: makeViz(number, `find(${number}) -> ${result}`) });
      }
    }

    steps.push({ line: 14, explanation: 'All operations complete.', variables: { indexCount: indexMap.size }, visualization: makeViz(-1, 'Complete') });

    return steps;
  },
};

export default designANumberContainerSystem;
