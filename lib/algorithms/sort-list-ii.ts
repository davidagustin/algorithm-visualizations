import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortListII: AlgorithmDefinition = {
  id: 'sort-list-ii',
  title: 'Sort List II',
  leetcodeNumber: 148,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 148: Sort a linked list in O(n log n) time and O(1) space. Uses bottom-up merge sort to avoid recursion stack. Find sublist sizes of 1, 2, 4, 8... and merge pairs.',
  tags: ['Sorting', 'Linked List', 'Merge Sort', 'Bottom-up'],
  code: {
    pseudocode: `function sortList(head):
  n = length(head)
  size = 1
  while size < n:
    curr = head
    while curr:
      left = curr
      right = split(left, size)
      curr = split(right, size)
      merge left and right
    size *= 2`,
    python: `def sortList(head):
    if not head or not head.next: return head
    # Get length
    n, node = 0, head
    while node: n += 1; node = node.next
    dummy = ListNode(0, head)
    size = 1
    while size < n:
        curr, tail = dummy.next, dummy
        while curr:
            left = curr
            right = split(left, size)
            curr = split(right, size)
            tail.next, tail = merge(left, right)
        size *= 2
    return dummy.next`,
    javascript: `function sortList(head) {
  if (!head || !head.next) return head;
  let n = 0, node = head;
  while (node) { n++; node = node.next; }
  const dummy = { val: 0, next: head };
  for (let size = 1; size < n; size *= 2) {
    let curr = dummy.next, tail = dummy;
    while (curr) {
      const left = curr;
      const right = split(left, size);
      curr = split(right, size);
      const [h, t] = merge(left, right);
      tail.next = h; tail = t;
    }
    tail.next = null;
  }
  return dummy.next;
}`,
    java: `public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    int n = 0; ListNode node = head;
    while (node != null) { n++; node = node.next; }
    ListNode dummy = new ListNode(0, head);
    for (int size = 1; size < n; size *= 2) {
        ListNode curr = dummy.next, tail = dummy;
        while (curr != null) {
            ListNode left = curr;
            ListNode right = split(left, size);
            curr = split(right, size);
            // merge left and right, attach to tail
        }
    }
    return dummy.next;
}`,
  },
  defaultInput: { list: [4, 2, 1, 3] },
  inputFields: [
    {
      name: 'list',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [4, 2, 1, 3],
      placeholder: '4,2,1,3',
      helperText: 'Comma-separated node values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.list as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const makeViz = (
      current: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...current],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Sort List II', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Sort linked list [${arr.join(' → ')}] using bottom-up merge sort.`,
      variables: { list: [...arr] },
      visualization: makeViz(arr, {}, {}),
    });

    let size = 1;
    while (size < n) {
      let i = 0;
      const pass = [...arr];

      steps.push({
        line: 4,
        explanation: `Merge pass with sublist size=${size}. Merge pairs of size-${size} sublists.`,
        variables: { size },
        visualization: makeViz(arr,
          Object.fromEntries(arr.map((_, idx) => [idx, 'comparing'])),
          {},
          [{ key: 'Size', value: String(size) }],
        ),
      });

      while (i < n) {
        const lo = i;
        const mid = Math.min(i + size, n);
        const hi = Math.min(i + 2 * size, n);

        const left = arr.slice(lo, mid);
        const right = arr.slice(mid, hi);

        steps.push({
          line: 5,
          explanation: `Merge left=[${left.join(',')}] and right=[${right.join(',')}].`,
          variables: { left: [...left], right: [...right], lo, mid, hi },
          visualization: makeViz(arr,
            { ...Object.fromEntries(left.map((_, j) => [lo + j, 'pointer'])),
              ...Object.fromEntries(right.map((_, j) => [mid + j, 'comparing'])) },
            {},
            [{ key: 'Left', value: left.join(',') }, { key: 'Right', value: right.join(',') }],
          ),
        });

        let li = 0, ri = 0, k = lo;
        while (li < left.length && ri < right.length) {
          if (left[li] <= right[ri]) arr[k++] = left[li++];
          else arr[k++] = right[ri++];
        }
        while (li < left.length) arr[k++] = left[li++];
        while (ri < right.length) arr[k++] = right[ri++];

        i += 2 * size;
      }

      steps.push({
        line: 6,
        explanation: `After merge pass (size=${size}): [${arr.join(', ')}].`,
        variables: { arr: [...arr], size },
        visualization: makeViz(arr,
          Object.fromEntries(arr.map((_, i) => [i, 'found'])),
          {},
          [{ key: 'After pass', value: arr.join(', ') }],
        ),
      });

      size *= 2;
    }

    steps.push({
      line: 1,
      explanation: `Sort complete! Sorted list: [${arr.join(' → ')}].`,
      variables: { result: [...arr] },
      visualization: makeViz(arr,
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: arr.join(', ') }],
      ),
    });

    return steps;
  },
};

export default sortListII;
