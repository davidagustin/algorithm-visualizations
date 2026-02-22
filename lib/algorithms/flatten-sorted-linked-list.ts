import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flattenSortedLinkedList: AlgorithmDefinition = {
  id: 'flatten-sorted-linked-list',
  title: 'Flatten Sorted Multi-Level Linked List',
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Flatten a multi-level sorted linked list where each node may have a child pointer to another sorted list. Use a min-heap to merge all sub-lists efficiently. The result is a single sorted linked list containing all elements from all levels.',
  tags: ['linked list', 'heap', 'flatten', 'merge', 'multi-level'],

  code: {
    pseudocode: `function flatten(head):
  // Collect all sub-lists into a min-heap
  heap = MinHeap()
  cur = head
  while cur:
    push cur into heap
    cur = cur.next
    if cur had child: also traverse child list
  // Rebuild as single sorted list
  dummy = Node(0)
  tail = dummy
  while heap not empty:
    node = heap.pop()
    tail.next = node
    tail = tail.next
  tail.next = null
  return dummy.next`,

    python: `import heapq
def flatten(head):
    heap = []
    cur = head
    while cur:
        heapq.heappush(heap, cur.val)
        if cur.child:
            child = cur.child
            while child:
                heapq.heappush(heap, child.val)
                child = child.next
        cur = cur.next
    dummy = Node(0)
    tail = dummy
    while heap:
        node = Node(heapq.heappop(heap))
        tail.next = node
        tail = tail.next
    return dummy.next`,

    javascript: `function flatten(head) {
  const vals = [];
  const collect = (node) => {
    while (node) {
      vals.push(node.val);
      if (node.child) collect(node.child);
      node = node.next;
    }
  };
  collect(head);
  vals.sort((a, b) => a - b);
  const dummy = { next: null };
  let tail = dummy;
  for (const v of vals) {
    tail.next = { val: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}`,

    java: `public Node flatten(Node head) {
    List<Integer> vals = new ArrayList<>();
    collectVals(head, vals);
    Collections.sort(vals);
    Node dummy = new Node(0);
    Node tail = dummy;
    for (int v : vals) {
        tail.next = new Node(v);
        tail = tail.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [5, 10, 19, 28, 2, 7, 3, 6],
    target: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'All values across levels',
      type: 'array',
      defaultValue: [5, 10, 19, 28, 2, 7, 3, 6],
      placeholder: '5,10,19,28,2,7,3,6',
      helperText: 'Values from all levels of the multi-level list',
    },
    {
      name: 'target',
      label: 'Number of levels',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of levels in the multi-level list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const levels = input.target as number;
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

    // Distribute nums across levels
    const perLevel = Math.ceil(n / levels);
    const levelArrays: number[][] = Array.from({ length: levels }, (_, i) =>
      nums.slice(i * perLevel, (i + 1) * perLevel).sort((a, b) => a - b)
    );

    steps.push({
      line: 1,
      explanation: `Flatten ${levels} sorted sub-lists. Level 0: [${levelArrays[0]?.join(', ')}], Level 1: [${levelArrays[1]?.join(', ')}]...`,
      variables: { levels, totalNodes: n },
      visualization: makeViz([...nums], {}, {}),
    });

    // Collect all into heap simulation
    steps.push({
      line: 3,
      explanation: `Traverse all levels and collect values into a min-heap. Total ${n} values.`,
      variables: { totalValues: n },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        {}
      ),
    });

    const heap = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 8,
      explanation: `All values in heap (min at front): [${heap.join(', ')}]. Now extract one by one to build result.`,
      variables: { heapSize: heap.length, heapMin: heap[0] },
      visualization: makeViz(
        heap,
        { 0: 'active' },
        { 0: 'min' }
      ),
    });

    // Build result by extracting from heap
    const result: number[] = [];
    for (let i = 0; i < heap.length; i++) {
      result.push(heap[i]);
      steps.push({
        line: 12,
        explanation: `Extract min = ${heap[i]}. Append to result. Result: [${result.join(', ')}].`,
        variables: { extracted: heap[i], resultLen: result.length },
        visualization: makeViz(
          [...result],
          { [result.length - 1]: 'found' },
          { [result.length - 1]: 'new' }
        ),
      });
    }

    steps.push({
      line: 15,
      explanation: `Flatten complete. Single sorted list: [${result.join(' -> ')}].`,
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

export default flattenSortedLinkedList;
