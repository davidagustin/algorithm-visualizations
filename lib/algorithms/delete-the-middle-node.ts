import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deleteTheMiddleNode: AlgorithmDefinition = {
  id: 'delete-the-middle-node',
  title: 'Delete the Middle Node of a Linked List',
  leetcodeNumber: 2095,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Delete the middle node of a linked list. For a list of length n, the middle is at index floor(n/2). Use slow and fast pointers where fast moves 2x faster, so when fast reaches the end, slow is at the node before the middle.',
  tags: ['linked list', 'two pointers', 'middle node'],

  code: {
    pseudocode: `function deleteMiddle(head):
  if head.next is null: return null
  slow = head
  fast = head.next.next
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  slow.next = slow.next.next
  return head`,

    python: `def deleteMiddle(head):
    if not head or not head.next:
        return None
    slow = head
    fast = head.next.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    slow.next = slow.next.next
    return head`,

    javascript: `function deleteMiddle(head) {
  if (!head || !head.next) return null;
  let slow = head;
  let fast = head.next?.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  slow.next = slow.next.next;
  return head;
}`,

    java: `public ListNode deleteMiddle(ListNode head) {
    if (head == null || head.next == null) return null;
    ListNode slow = head;
    ListNode fast = head.next.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    slow.next = slow.next.next;
    return head;
}`,
  },

  defaultInput: {
    nums: [1, 3, 4, 7, 1, 2, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 3, 4, 7, 1, 2, 6],
      placeholder: '1,3,4,7,1,2,6',
      helperText: 'Linked list nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const midIdx = Math.floor(n / 2);

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
      explanation: `Delete middle node from list: [${nums.join(' -> ')}]. Middle is at index ${midIdx} (floor(${n}/2)).`,
      variables: { n, middleIdx: midIdx, middleVal: nums[midIdx] },
      visualization: makeViz([...nums], {}, {}),
    });

    // Simulate slow/fast pointer movement
    let slow = 0;
    let fast = 2;

    steps.push({
      line: 3,
      explanation: `Initialize: slow at index 0 (value ${nums[0]}), fast starts at index 2 to offset by one ahead of middle.`,
      variables: { slow: 0, fast: 2 },
      visualization: makeViz(
        [...nums],
        { 0: 'active', 2: 'pointer' },
        { 0: 'slow', 2: 'fast' }
      ),
    });

    while (fast < n - 1 && fast + 1 < n - 1) {
      slow++;
      fast += 2;

      steps.push({
        line: 5,
        explanation: `Move slow to index ${slow} (value ${nums[slow]}), fast to index ${Math.min(fast, n - 1)}.`,
        variables: { slow, fast: Math.min(fast, n - 1) },
        visualization: makeViz(
          [...nums],
          { [slow]: 'active', [Math.min(fast, n - 1)]: 'pointer' },
          { [slow]: 'slow', [Math.min(fast, n - 1)]: 'fast' }
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `Fast reached end. Slow is at index ${slow} (the node before middle at index ${midIdx}). Delete slow.next.`,
      variables: { slowIdx: slow, middleIdx: midIdx, deletedVal: nums[midIdx] },
      visualization: makeViz(
        [...nums],
        { [slow]: 'active', [midIdx]: 'mismatch' },
        { [slow]: 'slow', [midIdx]: 'DELETE' }
      ),
    });

    const result = nums.filter((_, i) => i !== midIdx);

    steps.push({
      line: 8,
      explanation: `Deleted node at index ${midIdx} (value ${nums[midIdx]}). Result: [${result.join(' -> ')}].`,
      variables: { deletedVal: nums[midIdx], result: result.join(' -> ') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default deleteTheMiddleNode;
