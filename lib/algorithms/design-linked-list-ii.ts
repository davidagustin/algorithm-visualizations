import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designLinkedListIi: AlgorithmDefinition = {
  id: 'design-linked-list-ii',
  title: 'Design Linked List',
  leetcodeNumber: 707,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design your own linked list. Support get(index), addAtHead(val), addAtTail(val), addAtIndex(index, val), and deleteAtIndex(index). The linked list is 0-indexed.',
  tags: ['Linked List', 'Design'],
  code: {
    pseudocode: `class MyLinkedList:
  function init():
    this.list = []
  function get(index):
    if index < 0 or index >= size: return -1
    return list[index]
  function addAtHead(val):
    list.prepend(val)
  function addAtTail(val):
    list.append(val)
  function addAtIndex(index, val):
    if index > size: return
    list.insert(index, val)
  function deleteAtIndex(index):
    if index < 0 or index >= size: return
    list.remove(index)`,
    python: `class MyLinkedList:
    def __init__(self):
        self.vals = []

    def get(self, index: int) -> int:
        if index < 0 or index >= len(self.vals): return -1
        return self.vals[index]

    def addAtHead(self, val: int) -> None:
        self.vals.insert(0, val)

    def addAtTail(self, val: int) -> None:
        self.vals.append(val)

    def addAtIndex(self, index: int, val: int) -> None:
        if index > len(self.vals): return
        self.vals.insert(index, val)

    def deleteAtIndex(self, index: int) -> None:
        if 0 <= index < len(self.vals):
            self.vals.pop(index)`,
    javascript: `class MyLinkedList {
  constructor() { this.vals = []; }
  get(index) {
    if (index < 0 || index >= this.vals.length) return -1;
    return this.vals[index];
  }
  addAtHead(val) { this.vals.unshift(val); }
  addAtTail(val) { this.vals.push(val); }
  addAtIndex(index, val) {
    if (index > this.vals.length) return;
    this.vals.splice(index, 0, val);
  }
  deleteAtIndex(index) {
    if (index >= 0 && index < this.vals.length)
      this.vals.splice(index, 1);
  }
}`,
    java: `class MyLinkedList {
    private List<Integer> vals = new ArrayList<>();
    public int get(int index) {
        if (index < 0 || index >= vals.size()) return -1;
        return vals.get(index);
    }
    public void addAtHead(int val) { vals.add(0, val); }
    public void addAtTail(int val) { vals.add(val); }
    public void addAtIndex(int index, int val) {
        if (index > vals.size()) return;
        vals.add(index, val);
    }
    public void deleteAtIndex(int index) {
        if (index >= 0 && index < vals.size()) vals.remove(index);
    }
}`,
  },
  defaultInput: {
    operations: [['addAtHead', 1], ['addAtTail', 3], ['addAtIndex', 1, 2], ['get', 1], ['deleteAtIndex', 1], ['get', 1]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'addAtHead 1, addAtTail 3, addAtIndex 1 2, get 1, deleteAtIndex 1, get 1',
      placeholder: 'addAtHead 1, addAtTail 2, get 0',
      helperText: 'Comma-separated operations',
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
        if (parts.length === 2) return [parts[0], Number(parts[1])];
        return [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const list: number[] = [];

    function makeViz(activeIdx: number, color: string, label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      list.forEach((_, i) => {
        highlights[i] = i === activeIdx ? color : 'default';
        labels[i] = `[${i}]`;
      });
      return {
        type: 'array',
        array: [...list],
        highlights,
        labels,
        auxData: {
          label: 'Linked List',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${list.length}` },
            { key: 'List', value: list.join(' -> ') || 'empty' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize empty linked list.', variables: { list: [] }, visualization: makeViz(-1, 'default', 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'addAtHead') {
        const val = Number(op[1]);
        list.unshift(val);
        steps.push({ line: 7, explanation: `addAtHead(${val}): Insert ${val} at head. List: [${list.join(', ')}].`, variables: { val, size: list.length }, visualization: makeViz(0, 'active', `addAtHead(${val})`) });
      } else if (opType === 'addAtTail') {
        const val = Number(op[1]);
        list.push(val);
        steps.push({ line: 9, explanation: `addAtTail(${val}): Insert ${val} at tail. List: [${list.join(', ')}].`, variables: { val, size: list.length }, visualization: makeViz(list.length - 1, 'active', `addAtTail(${val})`) });
      } else if (opType === 'addAtIndex') {
        const index = Number(op[1]);
        const val = Number(op[2]);
        if (index > list.length) {
          steps.push({ line: 11, explanation: `addAtIndex(${index}, ${val}): Index ${index} > size ${list.length}. No-op.`, variables: { index, val }, visualization: makeViz(-1, 'default', `addAtIndex(${index},${val}) -> skip`) });
        } else {
          list.splice(index, 0, val);
          steps.push({ line: 12, explanation: `addAtIndex(${index}, ${val}): Insert ${val} at index ${index}. List: [${list.join(', ')}].`, variables: { index, val, size: list.length }, visualization: makeViz(index, 'active', `addAtIndex(${index},${val})`) });
        }
      } else if (opType === 'deleteAtIndex') {
        const index = Number(op[1]);
        if (index < 0 || index >= list.length) {
          steps.push({ line: 14, explanation: `deleteAtIndex(${index}): Index out of bounds. No-op.`, variables: { index }, visualization: makeViz(-1, 'mismatch', `deleteAtIndex(${index}) -> skip`) });
        } else {
          list.splice(index, 1);
          steps.push({ line: 15, explanation: `deleteAtIndex(${index}): Remove element at index ${index}. List: [${list.join(', ')}].`, variables: { index, size: list.length }, visualization: makeViz(-1, 'default', `deleteAtIndex(${index})`) });
        }
      } else if (opType === 'get') {
        const index = Number(op[1]);
        const result = index < 0 || index >= list.length ? -1 : list[index];
        steps.push({ line: 4, explanation: index < 0 || index >= list.length ? `get(${index}): Index out of bounds. Return -1.` : `get(${index}): Return ${result} at index ${index}.`, variables: { index, result }, visualization: makeViz(index >= 0 && index < list.length ? index : -1, result !== -1 ? 'found' : 'mismatch', `get(${index}) -> ${result}`) });
      }
    }

    steps.push({ line: 16, explanation: `All operations complete. Final list: [${list.join(' -> ')}].`, variables: { list: [...list] }, visualization: makeViz(-1, 'default', 'Complete') });

    return steps;
  },
};

export default designLinkedListIi;
