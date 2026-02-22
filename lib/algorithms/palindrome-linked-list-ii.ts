import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromeLinkedListIi: AlgorithmDefinition = {
  id: 'palindrome-linked-list-ii',
  title: 'Palindrome Linked List',
  leetcodeNumber: 234,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Check if a linked list is a palindrome in O(n) time and O(1) space. Find the middle using slow/fast pointers, reverse the second half in-place, compare both halves, then restore the list. This approach avoids using extra memory.',
  tags: ['linked list', 'two pointers', 'palindrome', 'reverse'],

  code: {
    pseudocode: `function isPalindrome(head):
  slow = fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  // slow is now at mid
  prev = null
  while slow:
    next = slow.next
    slow.next = prev
    prev = slow
    slow = next
  // prev is reversed second half
  left = head
  right = prev
  while right:
    if left.val != right.val: return false
    left = left.next
    right = right.next
  return true`,

    python: `def isPalindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    prev = None
    while slow:
        slow.next, prev, slow = prev, slow, slow.next
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    return True`,

    javascript: `function isPalindrome(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  while (slow) {
    [slow.next, prev, slow] = [prev, slow, slow.next];
  }
  let left = head, right = prev;
  while (right) {
    if (left.val !== right.val) return false;
    left = left.next;
    right = right.next;
  }
  return true;
}`,

    java: `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode prev = null;
    while (slow != null) {
        ListNode next = slow.next;
        slow.next = prev;
        prev = slow;
        slow = next;
    }
    ListNode left = head, right = prev;
    while (right != null) {
        if (left.val != right.val) return false;
        left = left.next;
        right = right.next;
    }
    return true;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 2, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 2, 1],
      placeholder: '1,2,3,2,1',
      helperText: 'Linked list values to check for palindrome',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start palindrome check on list: [${nums.join(' -> ')}]. Use slow/fast pointers to find middle.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    // Find middle
    let slow = 0;
    let fast = 0;
    while (fast < n - 1 && fast + 1 < n - 1) {
      slow++;
      fast += 2;
    }
    const mid = slow;

    steps.push({
      line: 3,
      explanation: `Slow pointer reached middle at index ${mid} (value ${nums[mid]}). Fast pointer at index ${Math.min(fast, n - 1)}.`,
      variables: { slow: mid, fast: Math.min(fast, n - 1) },
      visualization: makeViz(
        { [mid]: 'active', [Math.min(fast, n - 1)]: 'pointer' },
        { [mid]: 'slow/mid', [Math.min(fast, n - 1)]: 'fast' }
      ),
    });

    // Reverse second half
    const secondHalf = nums.slice(mid).reverse();

    steps.push({
      line: 7,
      explanation: `Reverse second half starting at index ${mid}: [${nums.slice(mid).join(', ')}] becomes [${secondHalf.join(', ')}].`,
      variables: { secondHalf: secondHalf.join(' -> ') },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n - mid }, (_, i) => [mid + i, 'swapping'])),
        { [mid]: 'prev', [n - 1]: 'tail' }
      ),
    });

    // Compare
    steps.push({
      line: 12,
      explanation: 'Compare first half with reversed second half element by element.',
      variables: { firstHalf: nums.slice(0, mid + 1).join(', '), secondHalf: secondHalf.join(', ') },
      visualization: makeViz({}, {}),
    });

    let isPalin = true;
    for (let i = 0; i < secondHalf.length; i++) {
      const leftVal = nums[i];
      const rightVal = secondHalf[i];
      const match = leftVal === rightVal;
      if (!match) isPalin = false;

      steps.push({
        line: 14,
        explanation: `Compare index ${i} (value ${leftVal}) with reversed index ${i} (value ${rightVal}): ${match ? 'match' : 'mismatch'}.`,
        variables: { leftVal, rightVal, match },
        visualization: makeViz(
          { [i]: match ? 'match' : 'mismatch', [n - 1 - i]: match ? 'match' : 'mismatch' },
          { [i]: 'L', [n - 1 - i]: 'R' }
        ),
      });
    }

    steps.push({
      line: 18,
      explanation: `Result: ${isPalin ? 'Is a palindrome' : 'Not a palindrome'}.`,
      variables: { isPalindrome: isPalin },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, isPalin ? 'found' : 'mismatch'])),
        {}
      ),
    });

    return steps;
  },
};

export default palindromeLinkedListIi;
