import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cloneLinkedListWithNextRandom: AlgorithmDefinition = {
  id: 'clone-linked-list-with-next-random',
  title: 'Clone List with Next and Random Pointer (Three-Pass)',
  leetcodeNumber: 138,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Deep copy a linked list with next and random pointers using a three-pass O(1) space technique. Pass 1: interleave clones between originals (A->A*->B->B*). Pass 2: set random pointers on clones. Pass 3: separate the two lists by restoring original next pointers.',
  tags: ['linked list', 'clone', 'random pointer', 'O(1) space'],

  code: {
    pseudocode: `function copyRandomList(head):
  // Pass 1: interleave clones
  cur = head
  while cur:
    clone = Node(cur.val)
    clone.next = cur.next
    cur.next = clone
    cur = clone.next

  // Pass 2: set random pointers
  cur = head
  while cur:
    if cur.random:
      cur.next.random = cur.random.next
    cur = cur.next.next

  // Pass 3: separate lists
  dummy = Node(0)
  cloneCur = dummy
  cur = head
  while cur:
    cloneCur.next = cur.next
    cur.next = cur.next.next
    cloneCur = cloneCur.next
    cur = cur.next
  return dummy.next`,

    python: `def copyRandomList(head):
    if not head: return None
    cur = head
    while cur:
        clone = Node(cur.val)
        clone.next = cur.next
        cur.next = clone
        cur = clone.next
    cur = head
    while cur:
        if cur.random:
            cur.next.random = cur.random.next
        cur = cur.next.next
    dummy = Node(0)
    clone_cur = dummy
    cur = head
    while cur:
        clone_cur.next = cur.next
        cur.next = cur.next.next
        clone_cur = clone_cur.next
        cur = cur.next
    return dummy.next`,

    javascript: `function copyRandomList(head) {
  if (!head) return null;
  let cur = head;
  while (cur) {
    const clone = { val: cur.val, next: cur.next, random: null };
    cur.next = clone;
    cur = clone.next;
  }
  cur = head;
  while (cur) {
    if (cur.random) cur.next.random = cur.random.next;
    cur = cur.next.next;
  }
  const dummy = { val: 0, next: null };
  let cloneCur = dummy;
  cur = head;
  while (cur) {
    cloneCur.next = cur.next;
    cur.next = cur.next.next;
    cloneCur = cloneCur.next;
    cur = cur.next;
  }
  return dummy.next;
}`,

    java: `public Node copyRandomList(Node head) {
    if (head == null) return null;
    Node cur = head;
    while (cur != null) {
        Node clone = new Node(cur.val);
        clone.next = cur.next;
        cur.next = clone;
        cur = clone.next;
    }
    cur = head;
    while (cur != null) {
        if (cur.random != null) cur.next.random = cur.random.next;
        cur = cur.next.next;
    }
    Node dummy = new Node(0);
    Node cloneCur = dummy;
    cur = head;
    while (cur != null) {
        cloneCur.next = cur.next;
        cur.next = cur.next.next;
        cloneCur = cloneCur.next;
        cur = cur.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [7, 13, 11, 10, 1],
    target: 0,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Node values',
      type: 'array',
      defaultValue: [7, 13, 11, 10, 1],
      placeholder: '7,13,11,10,1',
      helperText: 'Values of the linked list nodes',
    },
    {
      name: 'target',
      label: 'Random pointer demo index',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Index of node whose random pointer is highlighted',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const randomIdx = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      explanation: `Three-pass clone of ${n}-node list with random pointers. No hash map - O(1) space.`,
      variables: { n, approach: 'interleave-clones' },
      visualization: makeViz([...nums], {}, {}),
    });

    // Pass 1: show interleaved structure
    const interleaved: number[] = [];
    for (let i = 0; i < n; i++) {
      interleaved.push(nums[i]);
      interleaved.push(nums[i]); // clone
    }

    steps.push({
      line: 3,
      explanation: 'Pass 1: Interleave clones. Each original node points to its clone, clone points to next original.',
      variables: { pass: 1 },
      visualization: makeViz([...nums], {}, {}),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 5,
        explanation: `Create clone of node[${i}] (value=${nums[i]}). Insert clone after node[${i}].`,
        variables: { index: i, value: nums[i] },
        visualization: makeViz(
          [...nums],
          { [i]: 'active' },
          { [i]: `orig[${i}]` }
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `Interleaved list: orig[0]->clone[0]->orig[1]->clone[1]->... (${2 * n} nodes total).`,
      variables: { interleavedLength: 2 * n },
      visualization: makeViz(
        interleaved,
        Object.fromEntries(interleaved.map((_, i) => [i, i % 2 === 0 ? 'active' : 'comparing'])),
        { 0: 'orig', 1: 'clone' }
      ),
    });

    // Pass 2: set random pointers
    steps.push({
      line: 11,
      explanation: `Pass 2: Set random pointers. clone.random = orig.random.next (the clone of original random target).`,
      variables: { pass: 2, randomSrcIdx: randomIdx, randomTargetIdx: Math.floor(n / 2) },
      visualization: makeViz(
        [...nums],
        { [randomIdx]: 'active', [Math.floor(n / 2)]: 'pointer' },
        { [randomIdx]: 'src', [Math.floor(n / 2)]: 'random' }
      ),
    });

    // Pass 3: separate
    steps.push({
      line: 17,
      explanation: 'Pass 3: Separate interleaved list back into original and clone. Restore original next pointers.',
      variables: { pass: 3 },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        { 0: 'orig_head' }
      ),
    });

    steps.push({
      line: 25,
      explanation: `Clone complete. Original list restored. Clone list: [${nums.join(' -> ')}] (same values, independent nodes).`,
      variables: { result: 'deep copy complete', nodes: n },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: 'clone_head' }
      ),
    });

    return steps;
  },
};

export default cloneLinkedListWithNextRandom;
