import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designLinkedList: AlgorithmDefinition = {
  id: 'design-linked-list',
  title: 'Design Linked List',
  leetcodeNumber: 707,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Design a singly linked list with get(index), addAtHead(val), addAtTail(val), addAtIndex(index, val), and deleteAtIndex(index) operations. Use a dummy head node to simplify edge cases. Track the size to validate index bounds. Each operation traverses to the target position using a pointer.',
  tags: ['linked list', 'design', 'data structure'],

  code: {
    pseudocode: `class MyLinkedList:
  constructor():
    dummy = new Node(-1)
    size = 0

  get(index):
    if index < 0 or index >= size: return -1
    cur = dummy.next
    for i in range(index): cur = cur.next
    return cur.val

  addAtHead(val):
    addAtIndex(0, val)

  addAtTail(val):
    addAtIndex(size, val)

  addAtIndex(index, val):
    if index > size: return
    prev = dummy
    for i in range(index): prev = prev.next
    node = new Node(val, prev.next)
    prev.next = node
    size++

  deleteAtIndex(index):
    if index < 0 or index >= size: return
    prev = dummy
    for i in range(index): prev = prev.next
    prev.next = prev.next.next
    size--`,

    python: `class MyLinkedList:
    def __init__(self):
        self.dummy = ListNode(-1)
        self.size = 0
    def get(self, index):
        if index < 0 or index >= self.size: return -1
        cur = self.dummy.next
        for _ in range(index): cur = cur.next
        return cur.val
    def addAtHead(self, val): self.addAtIndex(0, val)
    def addAtTail(self, val): self.addAtIndex(self.size, val)
    def addAtIndex(self, index, val):
        if index > self.size: return
        prev = self.dummy
        for _ in range(index): prev = prev.next
        node = ListNode(val, prev.next)
        prev.next = node; self.size += 1
    def deleteAtIndex(self, index):
        if index < 0 or index >= self.size: return
        prev = self.dummy
        for _ in range(index): prev = prev.next
        prev.next = prev.next.next; self.size -= 1`,

    javascript: `class MyLinkedList {
  constructor() { this.dummy = { val: -1, next: null }; this.size = 0; }
  get(index) {
    if (index < 0 || index >= this.size) return -1;
    let cur = this.dummy.next;
    for (let i = 0; i < index; i++) cur = cur.next;
    return cur.val;
  }
  addAtHead(val) { this.addAtIndex(0, val); }
  addAtTail(val) { this.addAtIndex(this.size, val); }
  addAtIndex(index, val) {
    if (index > this.size) return;
    let prev = this.dummy;
    for (let i = 0; i < index; i++) prev = prev.next;
    prev.next = { val, next: prev.next }; this.size++;
  }
  deleteAtIndex(index) {
    if (index < 0 || index >= this.size) return;
    let prev = this.dummy;
    for (let i = 0; i < index; i++) prev = prev.next;
    prev.next = prev.next.next; this.size--;
  }
}`,

    java: `class MyLinkedList {
    ListNode dummy = new ListNode(-1); int size = 0;
    public int get(int index) {
        if (index < 0 || index >= size) return -1;
        ListNode cur = dummy.next;
        for (int i = 0; i < index; i++) cur = cur.next;
        return cur.val;
    }
    public void addAtHead(int val) { addAtIndex(0, val); }
    public void addAtTail(int val) { addAtIndex(size, val); }
    public void addAtIndex(int index, int val) {
        if (index > size) return;
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) prev = prev.next;
        prev.next = new ListNode(val, prev.next); size++;
    }
    public void deleteAtIndex(int index) {
        if (index < 0 || index >= size) return;
        ListNode prev = dummy;
        for (int i = 0; i < index; i++) prev = prev.next;
        prev.next = prev.next.next; size--;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Initial Values',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Values to add to the linked list via addAtTail',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const list: number[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize MyLinkedList with dummy head node. Size = 0.',
      variables: { size: 0, list: [] },
      visualization: makeViz([], {}, {}),
    });

    for (const val of nums) {
      list.push(val);
      steps.push({
        line: 17,
        explanation: `addAtTail(${val}): Insert ${val} at the end. List is now [${list.join(', ')}]. Size = ${list.length}.`,
        variables: { 'added value': val, size: list.length, list: [...list] },
        visualization: makeViz([...list],
          { [list.length - 1]: 'active' },
          { [list.length - 1]: 'new' }),
      });
    }

    // Demonstrate get
    if (list.length > 0) {
      const getIdx = Math.floor(list.length / 2);
      const getVal = list[getIdx];
      steps.push({
        line: 6,
        explanation: `get(${getIdx}): Traverse ${getIdx} steps from head. Returns ${getVal}.`,
        variables: { index: getIdx, result: getVal },
        visualization: makeViz([...list],
          { ...Object.fromEntries(Array.from({ length: getIdx + 1 }, (_, i) => [i, i === getIdx ? 'found' : 'visited'])) },
          { [getIdx]: `get=${getVal}` }),
      });
    }

    // Demonstrate addAtHead
    const headVal = 99;
    list.unshift(headVal);
    steps.push({
      line: 12,
      explanation: `addAtHead(${headVal}): Insert ${headVal} at position 0. New head. Size = ${list.length}.`,
      variables: { 'added at head': headVal, size: list.length },
      visualization: makeViz([...list], { 0: 'active' }, { 0: 'new head' }),
    });

    // Demonstrate deleteAtIndex
    if (list.length > 1) {
      const delIdx = 1;
      const delVal = list[delIdx];
      list.splice(delIdx, 1);
      steps.push({
        line: 24,
        explanation: `deleteAtIndex(${delIdx}): Remove node at index ${delIdx} (value ${delVal}). List: [${list.join(', ')}]. Size = ${list.length}.`,
        variables: { 'deleted index': delIdx, 'deleted value': delVal, size: list.length },
        visualization: makeViz([...list], Object.fromEntries(list.map((_, i) => [i, 'found'])), {}),
      });
    }

    steps.push({
      line: 26,
      explanation: `Final linked list state: [${list.join(' -> ')}]. Size = ${list.length}.`,
      variables: { 'final list': list, size: list.length },
      visualization: makeViz([...list], Object.fromEntries(list.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default designLinkedList;
