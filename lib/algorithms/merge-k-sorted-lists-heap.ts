import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeKSortedListsHeap: AlgorithmDefinition = {
  id: 'merge-k-sorted-lists-heap',
  title: 'Merge K Sorted Lists (Min-Heap)',
  leetcodeNumber: 23,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Merge k sorted linked lists using a min-heap (priority queue). Push the head of each list into the heap. Repeatedly extract the minimum, append it to the result, and push the next node from that list. Time complexity: O(n log k) where n is total nodes.',
  tags: ['linked list', 'heap', 'priority queue', 'merge', 'sorting'],

  code: {
    pseudocode: `function mergeKLists(lists):
  heap = MinHeap()
  for each list: push head node into heap
  dummy = Node(0)
  cur = dummy
  while heap not empty:
    node = heap.pop()  // extract min
    cur.next = node
    cur = cur.next
    if node.next: heap.push(node.next)
  return dummy.next`,

    python: `import heapq
def mergeKLists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    cur = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        cur.next = node
        cur = cur.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,

    javascript: `function mergeKLists(lists) {
  const heap = new MinHeap((a, b) => a.val - b.val);
  for (const head of lists) if (head) heap.push(head);
  const dummy = { next: null };
  let cur = dummy;
  while (!heap.isEmpty()) {
    const node = heap.pop();
    cur.next = node;
    cur = cur.next;
    if (node.next) heap.push(node.next);
  }
  return dummy.next;
}`,

    java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap =
        new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode head : lists)
        if (head != null) heap.offer(head);
    ListNode dummy = new ListNode(0);
    ListNode cur = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        cur.next = node;
        cur = cur.next;
        if (node.next != null) heap.offer(node.next);
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 4, 7, 2, 5, 8, 3, 6, 9],
    target: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Merged elements (all k lists combined)',
      type: 'array',
      defaultValue: [1, 4, 7, 2, 5, 8, 3, 6, 9],
      placeholder: '1,4,7,2,5,8,3,6,9',
      helperText: 'Elements from k sorted lists (groups of 3 form one list)',
    },
    {
      name: 'target',
      label: 'k (number of lists)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of sorted lists to merge',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.target as number;
    const steps: AlgorithmStep[] = [];

    // Split into k lists
    const lists: number[][] = Array.from({ length: k }, (_, i) =>
      nums.filter((_, idx) => idx % k === i).sort((a, b) => a - b)
    );

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
      explanation: `Initialize min-heap with k=${k} sorted lists. Push first element from each list.`,
      variables: { k, lists: lists.map(l => l.join(',')).join(' | ') },
      visualization: makeViz([...nums], {}, {}),
    });

    // Initialize heap with first element of each list
    const heap: { val: number; listIdx: number; nodeIdx: number }[] = [];
    const pointers = lists.map(() => 0);

    for (let i = 0; i < k; i++) {
      if (lists[i].length > 0) {
        heap.push({ val: lists[i][0], listIdx: i, nodeIdx: 0 });
      }
    }
    heap.sort((a, b) => a.val - b.val);

    steps.push({
      line: 2,
      explanation: `Heap initialized with heads: [${heap.map(h => h.val).join(', ')}]. Min = ${heap[0]?.val}.`,
      variables: { heapSize: heap.length, heapMin: heap[0]?.val },
      visualization: makeViz(
        heap.map(h => h.val),
        { 0: 'active' },
        { 0: 'min' }
      ),
    });

    const result: number[] = [];

    while (heap.length > 0) {
      const min = heap.shift()!;
      result.push(min.val);

      steps.push({
        line: 6,
        explanation: `Extract min = ${min.val} from heap. Append to result. Result so far: [${result.join(', ')}].`,
        variables: { extracted: min.val, resultLen: result.length },
        visualization: makeViz(
          [...result],
          { [result.length - 1]: 'found' },
          { [result.length - 1]: 'new' }
        ),
      });

      const nextIdx = min.nodeIdx + 1;
      if (nextIdx < lists[min.listIdx].length) {
        const nextVal = lists[min.listIdx][nextIdx];
        heap.push({ val: nextVal, listIdx: min.listIdx, nodeIdx: nextIdx });
        heap.sort((a, b) => a.val - b.val);

        steps.push({
          line: 9,
          explanation: `Push next from list ${min.listIdx}: value ${nextVal}. Heap rebalanced. New min = ${heap[0].val}.`,
          variables: { pushed: nextVal, newHeapMin: heap[0].val },
          visualization: makeViz(
            [...result],
            { [result.length - 1]: 'sorted' },
            {}
          ),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Heap empty. Merge complete. Final sorted list: [${result.join(' -> ')}].`,
      variables: { result: result.join(' -> ') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default mergeKSortedListsHeap;
