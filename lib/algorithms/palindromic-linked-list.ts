import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromicLinkedList: AlgorithmDefinition = {
  id: 'palindromic-linked-list',
  title: 'Palindromic Linked List',
  leetcodeNumber: 234,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Determine whether a singly linked list is a palindrome. We find the middle using fast/slow pointers, reverse the second half, then compare both halves node by node.',
  tags: ['Linked List', 'Two Pointers', 'Palindrome'],
  code: {
    pseudocode: `function isPalindrome(head):
  slow = head, fast = head
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
  prev = null
  while slow:
    next = slow.next
    slow.next = prev
    prev = slow
    slow = next
  left = head, right = prev
  while right:
    if left.val != right.val:
      return false
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
        left, right = left.next, right.next
    return True`,
    javascript: `function isPalindrome(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  while (slow) {
    const next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
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
  defaultInput: { nodes: [1, 2, 2, 1] },
  inputFields: [
    {
      name: 'nodes',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 2, 1],
      placeholder: 'e.g. 1,2,2,1',
      helperText: 'Comma-separated node values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = (input.nodes as number[]).slice();
    const n = nodes.length;
    const steps: AlgorithmStep[] = [];

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxLabel?: string,
      auxEntries?: { key: string; value: string }[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: nodes,
        highlights,
        labels,
        ...(auxLabel ? { auxData: { label: auxLabel, entries: auxEntries || [] } } : {}),
      };
    }

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'Empty list is a palindrome.',
        variables: { result: true },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    // Phase 1: Find middle
    steps.push({
      line: 1,
      explanation: 'Initialize slow and fast pointers at head to find the middle of the list.',
      variables: { slow: nodes[0], fast: nodes[0] },
      visualization: makeViz({ 0: 'active' }, { 0: 'slow/fast' }),
    });

    let slow = 0;
    let fast = 0;
    while (fast < n - 1 && fast + 1 < n) {
      slow++;
      fast += 2;
      if (fast >= n) fast = n - 1;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      h[slow] = 'pointer';
      l[slow] = 'slow';
      if (fast < n) {
        h[fast] = 'active';
        l[fast] = fast === slow ? 'slow/fast' : 'fast';
      }

      steps.push({
        line: 3,
        explanation: `Move slow to node ${nodes[slow]}, fast to node ${fast < n ? nodes[fast] : 'end'}. ${fast >= n - 1 ? 'Fast reached the end.' : ''}`,
        variables: { slow: nodes[slow], fast: fast < n ? nodes[fast] : null },
        visualization: makeViz(h, l),
      });

      if (fast >= n - 1) break;
    }

    const mid = slow;
    steps.push({
      line: 4,
      explanation: `Middle found at index ${mid} (node ${nodes[mid]}). Now reverse the second half.`,
      variables: { middle: nodes[mid] },
      visualization: makeViz({ [mid]: 'found' }, { [mid]: 'middle' }),
    });

    // Phase 2: Reverse second half
    const secondHalf: number[] = nodes.slice(mid);
    const reversed = [...secondHalf].reverse();

    steps.push({
      line: 6,
      explanation: `Reversing second half: [${secondHalf.join(', ')}] becomes [${reversed.join(', ')}].`,
      variables: { secondHalf, reversed },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < mid; i++) h[i] = 'default';
        for (let i = mid; i < n; i++) h[i] = 'swapping';
        return makeViz(h, { [mid]: 'reverse start' });
      })(),
    });

    // Phase 3: Compare
    const firstHalfLen = mid;
    const secondHalfLen = reversed.length;
    const compareLen = Math.min(firstHalfLen, secondHalfLen);
    let isPalin = true;

    steps.push({
      line: 11,
      explanation: `Compare first half [${nodes.slice(0, firstHalfLen).join(', ')}] with reversed second half [${reversed.join(', ')}].`,
      variables: { left: nodes[0], right: reversed[0] },
      visualization: makeViz({ 0: 'comparing', [n - 1]: 'comparing' }, { 0: 'left', [n - 1]: 'right' }),
    });

    for (let i = 0; i < compareLen; i++) {
      const leftVal = nodes[i];
      const rightVal = reversed[i];
      const rightOrigIdx = n - 1 - i;

      if (leftVal === rightVal) {
        steps.push({
          line: 13,
          explanation: `Compare left[${i}]=${leftVal} with right[${i}]=${rightVal}. They match!`,
          variables: { left: leftVal, right: rightVal, index: i },
          visualization: makeViz(
            { [i]: 'match', [rightOrigIdx]: 'match' },
            { [i]: 'left', [rightOrigIdx]: 'right' }
          ),
        });
      } else {
        isPalin = false;
        steps.push({
          line: 13,
          explanation: `Compare left[${i}]=${leftVal} with right[${i}]=${rightVal}. Mismatch! Not a palindrome.`,
          variables: { left: leftVal, right: rightVal, index: i, result: false },
          visualization: makeViz(
            { [i]: 'mismatch', [rightOrigIdx]: 'mismatch' },
            { [i]: 'left', [rightOrigIdx]: 'right' }
          ),
        });
        break;
      }
    }

    // Final result
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = isPalin ? 'found' : 'default';

    steps.push({
      line: 16,
      explanation: isPalin
        ? `All comparisons match. The linked list [${nodes.join(', ')}] IS a palindrome.`
        : `Mismatch found. The linked list [${nodes.join(', ')}] is NOT a palindrome.`,
      variables: { result: isPalin },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default palindromicLinkedList;
