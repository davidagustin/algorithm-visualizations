import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeNthFromEndOnePass: AlgorithmDefinition = {
  id: 'remove-nth-from-end-one-pass',
  title: 'Remove Nth Node from End (One Pass)',
  leetcodeNumber: 19,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Remove the nth node from the end of a linked list in a single pass using the gap technique. Use two pointers: advance the fast pointer n+1 steps ahead. Then move both pointers together until fast reaches null. The slow pointer will be at the node just before the target.',
  tags: ['linked list', 'two pointers', 'one pass', 'gap technique'],

  code: {
    pseudocode: `function removeNthFromEnd(head, n):
  dummy = Node(0, head)
  fast = dummy
  slow = dummy
  // advance fast n+1 steps ahead
  for i from 0 to n:
    fast = fast.next
  // move both until fast is null
  while fast != null:
    slow = slow.next
    fast = fast.next
  // slow.next is the node to remove
  slow.next = slow.next.next
  return dummy.next`,

    python: `def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next`,

    javascript: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,

    java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Linked list nodes',
    },
    {
      name: 'target',
      label: 'n (remove nth from end)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Which node from the end to remove (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = input.target as number;
    const steps: AlgorithmStep[] = [];
    const len = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const removeIdx = len - n; // 0-indexed target

    steps.push({
      line: 1,
      explanation: `Remove ${n}th node from end of [${nums.join(' -> ')}]. That is node at index ${removeIdx} (value=${nums[removeIdx]}). One pass with gap.`,
      variables: { n, removeIdx, removeVal: nums[removeIdx] },
      visualization: makeViz({}, {}),
    });

    // Advance fast n+1 steps (using 0-indexed on the array, dummy is -1)
    let fast = -1 + (n + 1); // fast starts at dummy (-1), advances n+1 steps
    let slow = -1; // slow starts at dummy

    steps.push({
      line: 4,
      explanation: `Advance fast pointer ${n + 1} steps ahead (n+1 to maintain gap of n+1 from slow).`,
      variables: { fastIdx: fast, slowIdx: slow },
      visualization: makeViz(
        { [fast]: 'pointer' },
        { [fast]: `fast(${n + 1} ahead)` }
      ),
    });

    steps.push({
      line: 5,
      explanation: `fast at index ${fast} (value=${nums[fast] ?? 'null'}), slow at index ${slow} (dummy). Gap = ${fast - slow} nodes.`,
      variables: { fast, slow, gap: fast - slow },
      visualization: makeViz(
        { [fast]: 'pointer', ...(slow >= 0 ? { [slow]: 'active' } : {}) },
        { [fast]: 'fast', ...(slow >= 0 ? { [slow]: 'slow' } : {}) }
      ),
    });

    // Move both until fast goes past end
    while (fast < len - 1) {
      slow++;
      fast++;

      steps.push({
        line: 8,
        explanation: `Move both: slow to index ${slow} (val=${nums[slow]}), fast to index ${fast} (val=${fast < len ? nums[fast] : 'null'}).`,
        variables: { slow, fast, slowVal: nums[slow], fastVal: fast < len ? nums[fast] : null },
        visualization: makeViz(
          { [slow]: 'active', ...(fast < len ? { [fast]: 'pointer' } : {}) },
          { [slow]: 'slow', ...(fast < len ? { [fast]: 'fast' } : {}) }
        ),
      });
    }

    steps.push({
      line: 10,
      explanation: `fast reached end. slow is at index ${slow} (value=${nums[slow]}), which is just before target node at index ${removeIdx} (value=${nums[removeIdx]}).`,
      variables: { slow, slowVal: nums[slow], targetIdx: removeIdx, targetVal: nums[removeIdx] },
      visualization: makeViz(
        { [slow]: 'active', [removeIdx]: 'mismatch' },
        { [slow]: 'slow', [removeIdx]: 'DELETE' }
      ),
    });

    const result = nums.filter((_, i) => i !== removeIdx);

    steps.push({
      line: 11,
      explanation: `Delete: slow.next = slow.next.next. Removed node at index ${removeIdx} (value=${nums[removeIdx]}). Result: [${result.join(' -> ')}].`,
      variables: { removedIdx: removeIdx, removedVal: nums[removeIdx], result: result.join(' -> ') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: { 0: 'head' },
      },
    });

    return steps;
  },
};

export default removeNthFromEndOnePass;
