import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumTwinSumOfLinkedList: AlgorithmDefinition = {
  id: 'maximum-twin-sum-of-linked-list',
  title: 'Maximum Twin Sum of a Linked List',
  leetcodeNumber: 2130,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'In a linked list of even length n, the twin of the ith node (0-indexed) is the (n-1-i)th node. The twin sum is the sum of a node and its twin. Find the maximum twin sum. Use slow/fast pointers to find the middle, reverse the second half, then pair up nodes from both halves.',
  tags: ['linked list', 'two pointers', 'reverse'],

  code: {
    pseudocode: `function pairSum(head):
  // Find middle
  slow = head, fast = head
  while fast.next and fast.next.next:
    slow = slow.next, fast = fast.next.next
  // Reverse second half
  prev = null, cur = slow.next
  while cur:
    next = cur.next, cur.next = prev, prev = cur, cur = next
  // Find max twin sum
  maxSum = 0
  left = head, right = prev
  while right:
    maxSum = max(maxSum, left.val + right.val)
    left = left.next, right = right.next
  return maxSum`,

    python: `def pairSum(head):
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next; fast = fast.next.next
    prev, cur = None, slow.next
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    max_sum = 0
    left, right = head, prev
    while right:
        max_sum = max(max_sum, left.val + right.val)
        left, right = left.next, right.next
    return max_sum`,

    javascript: `function pairSum(head) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null, cur = slow.next;
  while (cur) { [cur.next, prev, cur] = [prev, cur, cur.next]; }
  let maxSum = 0, left = head, right = prev;
  while (right) { maxSum = Math.max(maxSum, left.val + right.val); left = left.next; right = right.next; }
  return maxSum;
}`,

    java: `public int pairSum(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode prev = null, cur = slow.next;
    while (cur != null) { ListNode next = cur.next; cur.next = prev; prev = cur; cur = next; }
    int maxSum = 0; ListNode left = head, right = prev;
    while (right != null) { maxSum = Math.max(maxSum, left.val + right.val); left = left.next; right = right.next; }
    return maxSum;
}`,
  },

  defaultInput: {
    nums: [5, 4, 2, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (even length)',
      type: 'array',
      defaultValue: [5, 4, 2, 1],
      placeholder: '5,4,2,1',
      helperText: 'Comma-separated integers (must be even length)',
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
      explanation: `Find max twin sum for list [${nums.join(', ')}]. Length = ${n} (even). Twin of node i is node ${n}-1-i.`,
      variables: { n, 'twin pairs': Array.from({ length: n / 2 }, (_, i) => `(${nums[i]},${nums[n - 1 - i]})`) },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'start' }),
    });

    // Find middle
    let slow = 0;
    let fast = 0;
    while (fast + 1 < n && fast + 2 < n) {
      slow++;
      fast += 2;
    }

    steps.push({
      line: 4,
      explanation: `Middle found at index ${slow} (value ${nums[slow]}). Second half starts at index ${slow + 1}.`,
      variables: { middle: slow },
      visualization: makeViz([...nums], { [slow]: 'found', [slow + 1]: 'active' }, { [slow]: 'mid', [slow + 1]: 'H2 start' }),
    });

    const secondHalf = nums.slice(slow + 1).reverse();
    steps.push({
      line: 7,
      explanation: `Reverse second half [${nums.slice(slow + 1).join(', ')}] to get [${secondHalf.join(', ')}].`,
      variables: { 'reversed second half': secondHalf },
      visualization: makeViz([...nums.slice(0, slow + 1), ...secondHalf],
        { ...Object.fromEntries(Array.from({ length: slow + 1 }, (_, i) => [i, 'pointer'])), ...Object.fromEntries(secondHalf.map((_, i) => [slow + 1 + i, 'active'])) },
        { 0: 'H1 start', [slow]: 'H1 end', [slow + 1]: 'H2 (rev) start' }),
    });

    let maxSum = 0;
    const firstHalf = nums.slice(0, slow + 1);

    for (let i = 0; i < firstHalf.length; i++) {
      const twinSum = firstHalf[i] + secondHalf[i];
      const isBest = twinSum > maxSum;
      if (isBest) maxSum = twinSum;

      steps.push({
        line: 12,
        explanation: `Twin pair ${i + 1}: node ${i} (val ${firstHalf[i]}) + twin node ${n - 1 - i} (val ${secondHalf[i]}) = ${twinSum}. ${isBest ? 'New max!' : `Max stays ${maxSum}.`}`,
        variables: { 'left value': firstHalf[i], 'right value': secondHalf[i], 'twin sum': twinSum, maxSum },
        visualization: makeViz([...nums],
          { [i]: 'active', [n - 1 - i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])) },
          { [i]: `val=${firstHalf[i]}`, [n - 1 - i]: `val=${secondHalf[i]}`, 0: `max=${maxSum}` }),
      });
    }

    steps.push({
      line: 14,
      explanation: `Maximum twin sum = ${maxSum}.`,
      variables: { result: maxSum },
      visualization: makeViz([...nums], Object.fromEntries(nums.map((_, i) => [i, 'found'])), { 0: `max=${maxSum}` }),
    });

    return steps;
  },
};

export default maximumTwinSumOfLinkedList;
