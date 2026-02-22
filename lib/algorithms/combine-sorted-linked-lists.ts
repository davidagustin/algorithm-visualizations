import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const combineSortedLinkedLists: AlgorithmDefinition = {
  id: 'combine-sorted-linked-lists',
  title: 'Combine Sorted Linked Lists',
  leetcodeNumber: 23,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Merge k sorted linked lists into one sorted list. Use a min-heap to always pick the smallest head among all lists, appending it to the result and pushing its next node back into the heap.',
  tags: ['Heap', 'Linked List', 'Merge'],
  code: {
    pseudocode: `function mergeKLists(lists):
  heap = min-heap
  for each list in lists:
    if list not empty:
      push list.head onto heap
  result = []
  while heap not empty:
    node = pop smallest from heap
    result.append(node.val)
    if node.next exists:
      push node.next onto heap
  return result`,
    python: `import heapq
def mergeKLists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    result = []
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j+1], i, j+1))
    return result`,
    javascript: `function mergeKLists(lists) {
  const heap = []; // [val, listIdx, nodeIdx]
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length) heap.push([lists[i][0], i, 0]);
  }
  heap.sort((a, b) => a[0] - b[0]);
  const result = [];
  while (heap.length) {
    const [val, i, j] = heap.shift();
    result.push(val);
    if (j + 1 < lists[i].length) {
      heap.push([lists[i][j + 1], i, j + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
  return result;
}`,
    java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap = new PriorityQueue<>(
        (a, b) -> a.val - b.val);
    for (ListNode l : lists)
        if (l != null) heap.offer(l);
    ListNode dummy = new ListNode(0), curr = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        curr.next = node;
        curr = curr.next;
        if (node.next != null) heap.offer(node.next);
    }
    return dummy.next;
}`,
  },
  defaultInput: {
    lists: [[1, 4, 5], [1, 3, 4], [2, 6]],
  },
  inputFields: [
    {
      name: 'lists',
      label: 'Sorted Lists',
      type: 'string',
      defaultValue: '1 4 5, 1 3 4, 2 6',
      placeholder: 'e.g. 1 4 5, 1 3 4, 2 6',
      helperText: 'Comma-separated lists; spaces separate elements within a list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let lists: number[][];
    if (Array.isArray(input.lists) && Array.isArray(input.lists[0])) {
      lists = (input.lists as number[][]).map(l => l.slice());
    } else {
      const str = input.lists as string;
      lists = str.split(',').map(s => s.trim().split(/\s+/).map(Number));
    }

    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    // heap entries: [value, listIdx, nodeIdx]
    let heap: [number, number, number][] = [];

    function sortHeap() {
      heap.sort((a, b) => a[0] - b[0]);
    }

    function makeViz(): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < result.length; i++) {
        highlights[i] = 'found';
      }

      return {
        type: 'array',
        array: result.length > 0 ? result : [0],
        highlights: result.length > 0 ? highlights : { 0: 'default' },
        labels: result.length > 0 ? labels : { 0: 'empty' },
        auxData: {
          label: 'Merge State',
          entries: [
            { key: 'Heap (min first)', value: heap.length > 0 ? heap.map(h => `${h[0]}(L${h[1]})`).join(', ') : 'empty' },
            ...lists.map((l, i) => ({ key: `List ${i}`, value: l.join(' -> ') || 'exhausted' })),
            { key: 'Result', value: result.length > 0 ? result.join(', ') : 'empty' },
          ],
        },
      };
    }

    // Initialize heap with heads
    steps.push({
      line: 1,
      explanation: `Merge ${lists.length} sorted lists. Initialize min-heap with the head of each list.`,
      variables: { lists: lists.map(l => [...l]) },
      visualization: makeViz(),
    });

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].length > 0) {
        heap.push([lists[i][0], i, 0]);
      }
    }
    sortHeap();

    steps.push({
      line: 4,
      explanation: `Heap initialized with heads: [${heap.map(h => `${h[0]}`).join(', ')}]. Smallest is ${heap.length > 0 ? heap[0][0] : 'none'}.`,
      variables: { heap: heap.map(h => h[0]) },
      visualization: makeViz(),
    });

    // Merge loop
    while (heap.length > 0) {
      const [val, listIdx, nodeIdx] = heap.shift()!;
      result.push(val);

      steps.push({
        line: 7,
        explanation: `Pop smallest: ${val} from list ${listIdx}. Append to result.`,
        variables: { popped: val, fromList: listIdx, result: [...result] },
        visualization: makeViz(),
      });

      const nextIdx = nodeIdx + 1;
      if (nextIdx < lists[listIdx].length) {
        heap.push([lists[listIdx][nextIdx], listIdx, nextIdx]);
        sortHeap();

        steps.push({
          line: 9,
          explanation: `Push next from list ${listIdx}: ${lists[listIdx][nextIdx]}. Heap: [${heap.map(h => h[0]).join(', ')}].`,
          variables: { pushed: lists[listIdx][nextIdx], heap: heap.map(h => h[0]) },
          visualization: makeViz(),
        });
      }
    }

    // Final
    steps.push({
      line: 10,
      explanation: `All lists merged! Result: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < result.length; i++) h[i] = 'found';
        return {
          type: 'array' as const,
          array: result,
          highlights: h,
          labels: {},
          auxData: {
            label: 'Final Result',
            entries: [{ key: 'Merged', value: result.join(' -> ') }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default combineSortedLinkedLists;
