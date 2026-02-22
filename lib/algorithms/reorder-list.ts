import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reorderList: AlgorithmDefinition = {
  id: 'reorder-list',
  title: 'Reorder List',
  leetcodeNumber: 143,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a singly linked list L0->L1->...->Ln, reorder it to L0->Ln->L1->Ln-1->... Three steps: find the middle using slow/fast pointers, reverse the second half, then merge the two halves by interleaving nodes.',
  tags: ['linked list', 'two pointers', 'reverse', 'merge'],

  code: {
    pseudocode: `function reorderList(head):
  // Step 1: Find middle
  slow = head, fast = head
  while fast.next and fast.next.next:
    slow = slow.next
    fast = fast.next.next
  // Step 2: Reverse second half
  prev = null, cur = slow.next
  slow.next = null
  while cur:
    next = cur.next
    cur.next = prev
    prev = cur, cur = next
  // Step 3: Merge two halves
  first = head, second = prev
  while second:
    tmp1 = first.next, tmp2 = second.next
    first.next = second
    second.next = tmp1
    first = tmp1, second = tmp2`,

    python: `def reorderList(head):
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    prev, cur = None, slow.next
    slow.next = None
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,

    javascript: `function reorderList(head) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null, cur = slow.next;
  slow.next = null;
  while (cur) {
    [cur.next, prev, cur] = [prev, cur, cur.next];
  }
  let first = head, second = prev;
  while (second) {
    const tmp1 = first.next, tmp2 = second.next;
    first.next = second;
    second.next = tmp1;
    first = tmp1; second = tmp2;
  }
}`,

    java: `public void reorderList(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    ListNode prev = null, cur = slow.next;
    slow.next = null;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev; prev = cur; cur = next;
    }
    ListNode first = head, second = prev;
    while (second != null) {
        ListNode t1 = first.next, t2 = second.next;
        first.next = second; second.next = t1;
        first = t1; second = t2;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers representing linked list',
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
      explanation: `Start reorderList. Original list: [${nums.join(' -> ')}]. Step 1: Find the middle using slow/fast pointers.`,
      variables: { slow: 0, fast: 0 },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'S/F' }),
    });

    let slow = 0;
    let fast = 0;
    while (fast + 1 < n && fast + 2 < n) {
      slow++;
      fast += 2;
      steps.push({
        line: 4,
        explanation: `Advance slow to index ${slow} (value ${nums[slow]}), fast to index ${fast} (value ${nums[fast]}).`,
        variables: { slow, fast },
        visualization: makeViz([...nums], { [slow]: 'active', [fast]: 'pointer' }, { [slow]: 'S', [fast]: 'F' }),
      });
    }

    steps.push({
      line: 6,
      explanation: `Middle found at index ${slow} (value ${nums[slow]}). Second half starts at index ${slow + 1}.`,
      variables: { middle: slow, 'second half start': slow + 1 },
      visualization: makeViz([...nums], { [slow]: 'found', ...(slow + 1 < n ? { [slow + 1]: 'active' } : {}) }, { [slow]: 'mid', ...(slow + 1 < n ? { [slow + 1]: 'start' } : {}) }),
    });

    const firstHalf = nums.slice(0, slow + 1);
    const secondHalfRev = nums.slice(slow + 1).reverse();

    steps.push({
      line: 9,
      explanation: `Step 2: Reverse the second half [${nums.slice(slow + 1).join(', ')}] to get [${secondHalfRev.join(', ')}].`,
      variables: { 'first half': firstHalf, 'reversed second half': secondHalfRev },
      visualization: makeViz([...firstHalf, ...secondHalfRev],
        { ...Object.fromEntries(firstHalf.map((_, i) => [i, 'pointer'])), ...Object.fromEntries(secondHalfRev.map((_, i) => [firstHalf.length + i, 'active'])) },
        { 0: 'H1 start', [firstHalf.length - 1]: 'H1 end', [firstHalf.length]: 'H2 start' }),
    });

    const result: number[] = [];
    let i = 0;
    let j = 0;
    steps.push({
      line: 14,
      explanation: `Step 3: Merge two halves by interleaving. first=[${firstHalf.join(',')}], second=[${secondHalfRev.join(',')}].`,
      variables: { 'first pointer': 0, 'second pointer': 0 },
      visualization: makeViz([...firstHalf, ...secondHalfRev],
        { 0: 'active', [firstHalf.length]: 'pointer' },
        { 0: 'F', [firstHalf.length]: 'S' }),
    });

    while (i < firstHalf.length || j < secondHalfRev.length) {
      if (i < firstHalf.length) result.push(firstHalf[i++]);
      if (j < secondHalfRev.length) result.push(secondHalfRev[j++]);
    }

    steps.push({
      line: 17,
      explanation: `Merge complete. Reordered list: [${result.join(' -> ')}].`,
      variables: { result },
      visualization: makeViz([...result], Object.fromEntries(result.map((_, idx) => [idx, idx % 2 === 0 ? 'found' : 'active'])), {}),
    });

    return steps;
  },
};

export default reorderList;
