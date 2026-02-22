import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const unzipLinkedList: AlgorithmDefinition = {
  id: 'unzip-linked-list',
  title: 'Unzip Linked List (Odd/Even Separation)',
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Separate a linked list into two parts: all nodes at odd indices followed by all nodes at even indices (1-indexed). Keep relative order within each group. Use two pointers advancing alternately to gather odd and even index nodes, then connect the two groups.',
  tags: ['linked list', 'two pointers', 'reordering'],

  code: {
    pseudocode: `function unzip(head):
  if head is null: return null
  odd = head
  even = head.next
  evenHead = even
  while even and even.next:
    odd.next = even.next
    odd = odd.next
    even.next = odd.next
    even = even.next
  odd.next = evenHead
  return head`,

    python: `def unzip(head):
    if not head or not head.next:
        return head
    odd = head
    even = head.next
    even_head = even
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
    return head`,

    javascript: `function unzip(head) {
  if (!head || !head.next) return head;
  let odd = head, even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,

    java: `public ListNode unzip(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode odd = head, even = head.next;
    ListNode evenHead = even;
    while (even != null && even.next != null) {
        odd.next = even.next;
        odd = odd.next;
        even.next = odd.next;
        even = even.next;
    }
    odd.next = evenHead;
    return head;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Linked list to separate by odd/even index',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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
      explanation: `Separate list [${nums.join(' -> ')}] into odd-index nodes then even-index nodes (1-indexed).`,
      variables: { n },
      visualization: makeViz([...nums], {}, {}),
    });

    const oddNodes = nums.filter((_, i) => i % 2 === 0);  // 1-indexed odd = 0-indexed even
    const evenNodes = nums.filter((_, i) => i % 2 === 1);

    steps.push({
      line: 3,
      explanation: `Odd-indexed nodes (1,3,5...): [${oddNodes.join(', ')}]. Even-indexed nodes (2,4,6...): [${evenNodes.join(', ')}].`,
      variables: { oddNodes: oddNodes.join(','), evenNodes: evenNodes.join(',') },
      visualization: makeViz(
        [...nums],
        {
          ...Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? 'active' : 'comparing'])),
        },
        { 0: 'odd(1)', 1: 'even(2)' }
      ),
    });

    // Simulate pointer movement
    let oddPtr = 0;
    let evenPtr = 1;

    while (evenPtr < n && evenPtr + 1 < n) {
      steps.push({
        line: 7,
        explanation: `odd.next = even.next: Connect odd[${oddPtr}] to node at index ${evenPtr + 1} (value ${nums[evenPtr + 1]}).`,
        variables: { oddIdx: oddPtr, evenIdx: evenPtr, nextOddIdx: evenPtr + 1 },
        visualization: makeViz(
          [...nums],
          { [oddPtr]: 'active', [evenPtr]: 'comparing', [evenPtr + 1]: 'pointer' },
          { [oddPtr]: 'odd', [evenPtr]: 'even', [evenPtr + 1]: 'next' }
        ),
      });
      oddPtr += 2;
      evenPtr += 2;
    }

    const result = [...oddNodes, ...evenNodes];

    steps.push({
      line: 10,
      explanation: `Connect last odd node to even head. Result: [${result.join(' -> ')}].`,
      variables: { result: result.join(' -> ') },
      visualization: makeViz(
        result,
        {
          ...Object.fromEntries(oddNodes.map((_, i) => [i, 'active'])),
          ...Object.fromEntries(evenNodes.map((_, i) => [oddNodes.length + i, 'comparing'])),
        },
        { 0: 'oddHead', [oddNodes.length]: 'evenHead' }
      ),
    });

    return steps;
  },
};

export default unzipLinkedList;
