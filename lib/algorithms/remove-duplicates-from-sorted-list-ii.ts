import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeDuplicatesFromSortedListIi: AlgorithmDefinition = {
  id: 'remove-duplicates-from-sorted-list-ii',
  title: 'Remove Duplicates from Sorted List II',
  leetcodeNumber: 82,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Use a dummy head and a prev pointer. When duplicates are found, skip all nodes with that value entirely.',
  tags: ['linked list', 'two pointers', 'sorted', 'dummy node'],

  code: {
    pseudocode: `function deleteDuplicates(head):
  dummy = new Node(0, head)
  prev = dummy
  cur = head
  while cur != null:
    if cur.next != null and cur.val == cur.next.val:
      while cur.next != null and cur.val == cur.next.val:
        cur = cur.next
      prev.next = cur.next
    else:
      prev = prev.next
    cur = cur.next
  return dummy.next`,

    python: `def deleteDuplicates(head):
    dummy = ListNode(0, head)
    prev = dummy
    cur = head
    while cur:
        if cur.next and cur.val == cur.next.val:
            while cur.next and cur.val == cur.next.val:
                cur = cur.next
            prev.next = cur.next
        else:
            prev = prev.next
        cur = cur.next
    return dummy.next`,

    javascript: `function deleteDuplicates(head) {
  const dummy = { val: 0, next: head };
  let prev = dummy, cur = head;
  while (cur) {
    if (cur.next && cur.val === cur.next.val) {
      while (cur.next && cur.val === cur.next.val) cur = cur.next;
      prev.next = cur.next;
    } else {
      prev = prev.next;
    }
    cur = cur.next;
  }
  return dummy.next;
}`,

    java: `public ListNode deleteDuplicates(ListNode head) {
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy, cur = head;
    while (cur != null) {
        if (cur.next != null && cur.val == cur.next.val) {
            while (cur.next != null && cur.val == cur.next.val)
                cur = cur.next;
            prev.next = cur.next;
        } else {
            prev = prev.next;
        }
        cur = cur.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 3, 4, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 3, 4, 4, 5],
      placeholder: '1,2,3,3,4,4,5',
      helperText: 'Sorted comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsInput = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const list = [...numsInput];

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
      explanation: `Initialize dummy node before head. prev = dummy, cur = head (index 0, value ${list[0]}).`,
      variables: { prev: 'dummy', cur: 0 },
      visualization: makeViz([...list], { 0: 'active' }, { 0: 'cur' }),
    });

    const display = [...list];
    let cur = 0;

    while (cur < display.length) {
      if (cur + 1 < display.length && display[cur] === display[cur + 1]) {
        const dupVal = display[cur];
        const dupeHighlights: Record<number, string> = {};
        let end = cur;
        while (end < display.length && display[end] === dupVal) {
          dupeHighlights[end] = 'mismatch';
          end++;
        }

        steps.push({
          line: 4,
          explanation: `Duplicate found: value ${dupVal} appears multiple times. Mark all nodes with value ${dupVal} for removal.`,
          variables: { 'duplicate value': dupVal, 'nodes to remove': end - cur },
          visualization: makeViz([...display], dupeHighlights, { [cur]: 'dup start', [end - 1]: 'dup end' }),
        });

        display.splice(cur, end - cur);

        steps.push({
          line: 7,
          explanation: `Removed all nodes with value ${dupVal}. List is now [${display.join(', ')}].`,
          variables: { 'removed value': dupVal, 'list length': display.length },
          visualization: makeViz([...display], cur < display.length ? { [cur]: 'active' } : {}, cur < display.length ? { [cur]: 'cur' } : {}),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `Value ${display[cur]} at index ${cur} is unique. Keep it, advance prev and cur.`,
          variables: { cur, 'value': display[cur] },
          visualization: makeViz([...display], { [cur]: 'found', ...(cur + 1 < display.length ? { [cur + 1]: 'active' } : {}) }, { [cur]: 'keep', ...(cur + 1 < display.length ? { [cur + 1]: 'cur' } : {}) }),
        });
        cur++;
      }
    }

    steps.push({
      line: 11,
      explanation: `Traversal complete. Final list with all duplicates removed: [${display.join(', ')}].`,
      variables: { result: display },
      visualization: makeViz([...display], Object.fromEntries(display.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default removeDuplicatesFromSortedListIi;
