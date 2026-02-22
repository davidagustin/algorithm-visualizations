import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeDuplicatesFromSortedList: AlgorithmDefinition = {
  id: 'remove-duplicates-from-sorted-list',
  title: 'Remove Duplicates from Sorted List',
  leetcodeNumber: 83,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Since the list is sorted, duplicates are always adjacent. Traverse with a single pointer and skip nodes whose value equals the next node value.',
  tags: ['linked list', 'two pointers', 'sorted'],

  code: {
    pseudocode: `function deleteDuplicates(head):
  current = head
  while current != null and current.next != null:
    if current.val == current.next.val:
      current.next = current.next.next
    else:
      current = current.next
  return head`,

    python: `def deleteDuplicates(head):
    current = head
    while current and current.next:
        if current.val == current.next.val:
            current.next = current.next.next
        else:
            current = current.next
    return head`,

    javascript: `function deleteDuplicates(head) {
  let current = head;
  while (current && current.next) {
    if (current.val === current.next.val) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }
  return head;
}`,

    java: `public ListNode deleteDuplicates(ListNode head) {
    ListNode current = head;
    while (current != null && current.next != null) {
        if (current.val == current.next.val) {
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }
    return head;
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 3, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Linked List',
      type: 'array',
      defaultValue: [1, 1, 2, 3, 3],
      placeholder: '1,1,2,3,3',
      helperText: 'Sorted comma-separated integers representing linked list nodes',
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
      explanation: `Initialize current pointer at head (index 0, value ${list[0]}). List: [${list.join(', ')}].`,
      variables: { current: 0, 'current value': list[0] },
      visualization: makeViz([...list], { 0: 'active' }, { 0: 'cur' }),
    });

    let cur = 0;
    const display = [...list];

    while (cur < display.length - 1) {
      if (display[cur] === display[cur + 1]) {
        steps.push({
          line: 3,
          explanation: `current.val (${display[cur]}) == current.next.val (${display[cur + 1]}). Duplicate found! Remove next node.`,
          variables: { current: cur, 'current val': display[cur], 'next val': display[cur + 1] },
          visualization: makeViz([...display], { [cur]: 'active', [cur + 1]: 'mismatch' }, { [cur]: 'cur', [cur + 1]: 'remove' }),
        });

        display.splice(cur + 1, 1);

        steps.push({
          line: 4,
          explanation: `Removed duplicate. List is now [${display.join(', ')}]. current stays at index ${cur} (value ${display[cur]}).`,
          variables: { current: cur, 'list length': display.length },
          visualization: makeViz([...display], { [cur]: 'active' }, { [cur]: 'cur' }),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `current.val (${display[cur]}) != current.next.val (${display[cur + 1]}). No duplicate. Advance current.`,
          variables: { current: cur, 'current val': display[cur], 'next val': display[cur + 1] },
          visualization: makeViz([...display], { [cur]: 'visited', [cur + 1]: 'active' }, { [cur]: 'done', [cur + 1]: 'cur' }),
        });
        cur++;
      }
    }

    steps.push({
      line: 7,
      explanation: `Traversal complete. Final deduplicated list: [${display.join(', ')}].`,
      variables: { result: display },
      visualization: makeViz([...display], Object.fromEntries(display.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default removeDuplicatesFromSortedList;
