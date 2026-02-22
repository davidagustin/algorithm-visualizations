import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertionSortList: AlgorithmDefinition = {
  id: 'insertion-sort-list',
  title: 'Insertion Sort List',
  leetcodeNumber: 147,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Sort a linked list using insertion sort. Take each node from the unsorted portion and insert it into the correct position in the sorted portion. Use a dummy head to simplify insertion at the beginning. Time complexity O(n^2), space O(1).',
  tags: ['linked list', 'sorting', 'insertion sort'],

  code: {
    pseudocode: `function insertionSortList(head):
  dummy = new Node(INT_MIN)
  cur = head
  while cur != null:
    next = cur.next
    prev = dummy
    while prev.next != null and prev.next.val < cur.val:
      prev = prev.next
    cur.next = prev.next
    prev.next = cur
    cur = next
  return dummy.next`,

    python: `def insertionSortList(head):
    dummy = ListNode(float('-inf'))
    cur = head
    while cur:
        nxt = cur.next
        prev = dummy
        while prev.next and prev.next.val < cur.val:
            prev = prev.next
        cur.next = prev.next
        prev.next = cur
        cur = nxt
    return dummy.next`,

    javascript: `function insertionSortList(head) {
  const dummy = { val: -Infinity, next: null };
  let cur = head;
  while (cur) {
    const next = cur.next;
    let prev = dummy;
    while (prev.next && prev.next.val < cur.val) prev = prev.next;
    cur.next = prev.next;
    prev.next = cur;
    cur = next;
  }
  return dummy.next;
}`,

    java: `public ListNode insertionSortList(ListNode head) {
    ListNode dummy = new ListNode(Integer.MIN_VALUE);
    ListNode cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        ListNode prev = dummy;
        while (prev.next != null && prev.next.val < cur.val)
            prev = prev.next;
        cur.next = prev.next;
        prev.next = cur;
        cur = next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [4, 2, 1, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [4, 2, 1, 3],
      placeholder: '4,2,1,3',
      helperText: 'Comma-separated integers to sort via insertion sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

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
      explanation: `Begin insertion sort on list: [${nums.join(', ')}]. Use a dummy head node to simplify insertions.`,
      variables: { list: nums },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'cur' }),
    });

    const sorted: number[] = [];

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      steps.push({
        line: 3,
        explanation: `Take current node with value ${val} from unsorted portion (index ${i} in original). Find correct position in sorted part.`,
        variables: { 'current value': val, 'sorted so far': [...sorted] },
        visualization: makeViz([...sorted, val, ...nums.slice(i + 1)],
          { [sorted.length]: 'active' },
          { [sorted.length]: 'insert' }),
      });

      let insertIdx = 0;
      while (insertIdx < sorted.length && sorted[insertIdx] < val) {
        insertIdx++;
      }

      steps.push({
        line: 7,
        explanation: `Insert value ${val} at position ${insertIdx} in sorted portion [${sorted.join(', ')}].`,
        variables: { 'insert position': insertIdx, 'value': val },
        visualization: makeViz([...sorted, val, ...nums.slice(i + 1)],
          { [insertIdx]: 'comparing', [sorted.length]: 'active' },
          { [insertIdx]: 'ins pos', [sorted.length]: 'val' }),
      });

      sorted.splice(insertIdx, 0, val);

      steps.push({
        line: 9,
        explanation: `Inserted ${val}. Sorted portion is now [${sorted.join(', ')}].`,
        variables: { 'sorted portion': [...sorted], 'remaining': nums.slice(i + 1) },
        visualization: makeViz([...sorted, ...nums.slice(i + 1)],
          { ...Object.fromEntries(sorted.map((_, idx) => [idx, 'sorted'])), ...(i + 1 < nums.length ? { [sorted.length]: 'pointer' } : {}) },
          { 0: 'sorted start', [sorted.length - 1]: 'sorted end', ...(i + 1 < nums.length ? { [sorted.length]: 'next' } : {}) }),
      });
    }

    steps.push({
      line: 10,
      explanation: `Insertion sort complete. Final sorted list: [${sorted.join(' -> ')}].`,
      variables: { result: sorted },
      visualization: makeViz([...sorted], Object.fromEntries(sorted.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default insertionSortList;
