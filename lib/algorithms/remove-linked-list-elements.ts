import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeLinkedListElements: AlgorithmDefinition = {
  id: 'remove-linked-list-elements',
  title: 'Remove Linked List Elements',
  leetcodeNumber: 203,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given the head of a linked list and an integer val, remove all nodes whose value equals val, then return the new head. Use a dummy node before the head to handle edge cases where the head itself needs to be removed. Traverse with a prev pointer and skip nodes that match the target value.',
  tags: ['linked list', 'dummy node', 'traversal'],

  code: {
    pseudocode: `function removeElements(head, val):
  dummy = new Node(0, head)
  prev = dummy
  cur = head
  while cur != null:
    if cur.val == val:
      prev.next = cur.next
    else:
      prev = cur
    cur = cur.next
  return dummy.next`,

    python: `def removeElements(head, val):
    dummy = ListNode(0, head)
    prev = dummy
    cur = head
    while cur:
        if cur.val == val:
            prev.next = cur.next
        else:
            prev = cur
        cur = cur.next
    return dummy.next`,

    javascript: `function removeElements(head, val) {
  const dummy = { val: 0, next: head };
  let prev = dummy, cur = head;
  while (cur) {
    if (cur.val === val) prev.next = cur.next;
    else prev = cur;
    cur = cur.next;
  }
  return dummy.next;
}`,

    java: `public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy, cur = head;
    while (cur != null) {
        if (cur.val == val) prev.next = cur.next;
        else prev = cur;
        cur = cur.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 6, 3, 4, 5, 6],
    val: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 6, 3, 4, 5, 6],
      placeholder: '1,2,6,3,4,5,6',
      helperText: 'Comma-separated integers representing linked list nodes',
    },
    {
      name: 'val',
      label: 'Value to Remove',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'All nodes with this value will be removed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsInput = input.nums as number[];
    const val = input.val as number;
    const steps: AlgorithmStep[] = [];
    const display = [...numsInput];

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
      explanation: `Remove all nodes with value ${val} from list [${display.join(', ')}]. Use dummy node before head.`,
      variables: { targetVal: val, list: display },
      visualization: makeViz([...display],
        Object.fromEntries(display.map((v, i) => [i, v === val ? 'mismatch' : 'default'])),
        Object.fromEntries(display.map((v, i) => [i, v === val ? `=${val}` : '']))),
    });

    let i = 0;
    while (i < display.length) {
      if (display[i] === val) {
        steps.push({
          line: 5,
          explanation: `Node at index ${i} has value ${display[i]} which equals ${val}. Remove it. prev.next = cur.next.`,
          variables: { 'current index': i, 'current value': display[i], targetVal: val },
          visualization: makeViz([...display],
            { [i]: 'mismatch', ...(i > 0 ? { [i - 1]: 'active' } : {}) },
            { [i]: 'REMOVE', ...(i > 0 ? { [i - 1]: 'prev' } : {}) }),
        });

        display.splice(i, 1);

        steps.push({
          line: 6,
          explanation: `Removed. List is now [${display.join(', ')}]. Continue from same index (new node moved here).`,
          variables: { 'list length': display.length },
          visualization: makeViz([...display],
            { ...(i < display.length ? { [i]: 'active' } : {}) },
            { ...(i < display.length ? { [i]: 'cur' } : {}) }),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Node at index ${i} has value ${display[i]}, which does NOT equal ${val}. Keep it, advance prev.`,
          variables: { 'current index': i, 'current value': display[i] },
          visualization: makeViz([...display],
            { [i]: 'found', ...(i + 1 < display.length ? { [i + 1]: 'active' } : {}) },
            { [i]: 'keep', ...(i + 1 < display.length ? { [i + 1]: 'cur' } : {}) }),
        });
        i++;
      }
    }

    steps.push({
      line: 10,
      explanation: `All nodes processed. Final list: [${display.join(', ')}]. All ${val}s removed.`,
      variables: { result: display },
      visualization: makeViz([...display], Object.fromEntries(display.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default removeLinkedListElements;
