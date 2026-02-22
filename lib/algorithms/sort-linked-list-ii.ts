import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortLinkedListIi: AlgorithmDefinition = {
  id: 'sort-linked-list-ii',
  title: 'Sort List (Bottom-Up Merge Sort)',
  leetcodeNumber: 148,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Sort a linked list in O(n log n) time using constant space via bottom-up merge sort. Instead of top-down recursion, iteratively merge sublists of increasing size (1, 2, 4, 8...) until the entire list is sorted.',
  tags: ['linked list', 'merge sort', 'divide and conquer', 'sorting'],

  code: {
    pseudocode: `function sortList(head):
  n = length of list
  size = 1
  while size < n:
    cur = dummy.next
    tail = dummy
    while cur != null:
      left = cur
      right = split(left, size)
      cur = split(right, size)
      tail = merge(left, right, tail)
    size *= 2
  return dummy.next

function split(node, n):
  advance n-1 steps
  next = node.next
  node.next = null
  return next`,

    python: `def sortList(head):
    if not head or not head.next:
        return head
    n = 0
    cur = head
    while cur:
        n += 1
        cur = cur.next
    dummy = ListNode(0, head)
    size = 1
    while size < n:
        cur = dummy.next
        tail = dummy
        while cur:
            left = cur
            right = split(left, size)
            cur = split(right, size)
            merged_tail = merge(left, right)
            tail.next = merged_tail
            while tail.next:
                tail = tail.next
        size <<= 1
    return dummy.next`,

    javascript: `function sortList(head) {
  if (!head || !head.next) return head;
  let n = 0, cur = head;
  while (cur) { n++; cur = cur.next; }
  const dummy = { next: head };
  for (let size = 1; size < n; size <<= 1) {
    cur = dummy.next;
    let tail = dummy;
    while (cur) {
      const left = cur;
      const right = split(left, size);
      cur = split(right, size);
      tail.next = merge(left, right);
      while (tail.next) tail = tail.next;
    }
  }
  return dummy.next;
}`,

    java: `public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    int n = 0;
    ListNode cur = head;
    while (cur != null) { n++; cur = cur.next; }
    ListNode dummy = new ListNode(0, head);
    for (int size = 1; size < n; size <<= 1) {
        cur = dummy.next;
        ListNode tail = dummy;
        while (cur != null) {
            ListNode left = cur;
            ListNode right = split(left, size);
            cur = split(right, size);
            ListNode[] merged = merge(left, right);
            tail.next = merged[0];
            tail = merged[1];
        }
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [4, 2, 1, 3, 6, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [4, 2, 1, 3, 6, 5],
      placeholder: '4,2,1,3,6,5',
      helperText: 'Unsorted linked list values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    let arr = [...nums];
    const n = arr.length;

    const makeViz = (
      current: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: current,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Begin bottom-up merge sort on ${n} nodes. Will iterate with sizes 1, 2, 4...`,
      variables: { n },
      visualization: makeViz(arr, {}, {}),
    });

    let size = 1;
    while (size < n) {
      steps.push({
        line: 4,
        explanation: `Merge pass with sublist size = ${size}. Merging adjacent pairs of size-${size} sublists.`,
        variables: { size },
        visualization: makeViz(arr, {}, {}),
      });

      const next: number[] = [];
      let i = 0;
      while (i < arr.length) {
        const leftStart = i;
        const rightStart = Math.min(i + size, arr.length);
        const end = Math.min(i + 2 * size, arr.length);

        const highlights: Record<number, string> = {};
        for (let x = leftStart; x < rightStart; x++) highlights[x] = 'active';
        for (let x = rightStart; x < end; x++) highlights[x] = 'comparing';

        steps.push({
          line: 6,
          explanation: `Merging left sublist [${arr.slice(leftStart, rightStart).join(', ')}] and right sublist [${arr.slice(rightStart, end).join(', ')}].`,
          variables: { leftStart, rightStart, end },
          visualization: makeViz(arr, highlights, { [leftStart]: 'L', [rightStart]: 'R' }),
        });

        // Merge the two halves
        const left = arr.slice(leftStart, rightStart);
        const right = arr.slice(rightStart, end);
        const merged: number[] = [];
        let li = 0, ri = 0;
        while (li < left.length && ri < right.length) {
          if (left[li] <= right[ri]) merged.push(left[li++]);
          else merged.push(right[ri++]);
        }
        while (li < left.length) merged.push(left[li++]);
        while (ri < right.length) merged.push(right[ri++]);
        next.push(...merged);
        i += 2 * size;
      }
      arr = next;

      const sortedHighlights: Record<number, string> = {};
      if (size * 2 >= n) {
        for (let x = 0; x < n; x++) sortedHighlights[x] = 'sorted';
      }

      steps.push({
        line: 11,
        explanation: `After size-${size} pass: [${arr.join(', ')}]. Doubling size to ${size * 2}.`,
        variables: { size, result: arr.join(' -> ') },
        visualization: makeViz(arr, sortedHighlights, {}),
      });

      size *= 2;
    }

    steps.push({
      line: 12,
      explanation: `Sort complete. Final sorted list: [${arr.join(' -> ')}].`,
      variables: { result: arr.join(' -> ') },
      visualization: makeViz(
        arr,
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default sortLinkedListIi;
