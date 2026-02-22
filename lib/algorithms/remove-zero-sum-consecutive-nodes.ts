import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeZeroSumConsecutiveNodes: AlgorithmDefinition = {
  id: 'remove-zero-sum-consecutive-nodes',
  title: 'Remove Zero Sum Consecutive Nodes from Linked List',
  leetcodeNumber: 1171,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, repeatedly delete consecutive sequences of nodes that sum to 0 until no such sequence exists. Use prefix sums: traverse the list tracking cumulative sums. When the same prefix sum is seen again, the nodes in between sum to zero and should be removed.',
  tags: ['linked list', 'prefix sum', 'hash map'],

  code: {
    pseudocode: `function removeZeroSumSublists(head):
  dummy = new Node(0, head)
  prefixSum = 0
  seen = {0: dummy}
  cur = dummy
  while cur != null:
    prefixSum += cur.val
    seen[prefixSum] = cur
    cur = cur.next
  prefixSum = 0
  cur = dummy
  while cur != null:
    prefixSum += cur.val
    cur.next = seen[prefixSum].next
    cur = cur.next
  return dummy.next`,

    python: `def removeZeroSumSublists(head):
    dummy = ListNode(0, head)
    prefix = 0
    seen = {0: dummy}
    cur = dummy
    while cur:
        prefix += cur.val
        seen[prefix] = cur
        cur = cur.next
    prefix = 0
    cur = dummy
    while cur:
        prefix += cur.val
        cur.next = seen[prefix].next
        cur = cur.next
    return dummy.next`,

    javascript: `function removeZeroSumSublists(head) {
  const dummy = { val: 0, next: head };
  let prefix = 0;
  const seen = new Map([[0, dummy]]);
  let cur = dummy;
  while (cur) { prefix += cur.val; seen.set(prefix, cur); cur = cur.next; }
  prefix = 0; cur = dummy;
  while (cur) {
    prefix += cur.val;
    cur.next = seen.get(prefix).next;
    cur = cur.next;
  }
  return dummy.next;
}`,

    java: `public ListNode removeZeroSumSublists(ListNode head) {
    ListNode dummy = new ListNode(0, head);
    Map<Integer, ListNode> seen = new HashMap<>();
    int prefix = 0;
    seen.put(0, dummy);
    ListNode cur = dummy;
    while (cur != null) { prefix += cur.val; seen.put(prefix, cur); cur = cur.next; }
    prefix = 0; cur = dummy;
    while (cur != null) {
        prefix += cur.val;
        cur.next = seen.get(prefix).next;
        cur = cur.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, -3, 3, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, -3, 3, 1],
      placeholder: '1,2,-3,3,1',
      helperText: 'Comma-separated integers (can include negatives)',
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
      explanation: `Start with list [${nums.join(', ')}]. Use prefix sums to detect zero-sum subsequences.`,
      variables: { prefixSum: 0, seen: { 0: 'dummy' } },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'cur' }),
    });

    const seen = new Map<number, number>();
    seen.set(0, -1);
    let prefix = 0;
    const prefixes: number[] = [];

    for (let i = 0; i < n; i++) {
      prefix += nums[i];
      prefixes.push(prefix);
      const hl: Record<number, string> = { [i]: 'active' };
      const lab: Record<number, string> = { [i]: `ps=${prefix}` };

      if (seen.has(prefix)) {
        hl[i] = 'mismatch';
        lab[i] = `ps=${prefix} DUP!`;
        steps.push({
          line: 7,
          explanation: `Prefix sum ${prefix} at index ${i} was seen before (at index ${seen.get(prefix)}). Nodes between those indices sum to 0!`,
          variables: { 'current index': i, 'prefix sum': prefix, 'duplicate at': seen.get(prefix) },
          visualization: makeViz([...nums], hl, lab),
        });
      } else {
        seen.set(prefix, i);
        steps.push({
          line: 6,
          explanation: `Prefix sum at index ${i} (value ${nums[i]}) is ${prefix}. Store in map.`,
          variables: { 'current index': i, 'node value': nums[i], 'prefix sum': prefix },
          visualization: makeViz([...nums], hl, lab),
        });
      }
    }

    // Simulate removal
    const result: number[] = [];
    const prefixMap = new Map<number, number>();
    prefixMap.set(0, -1);
    let ps = 0;
    const include: boolean[] = new Array(n).fill(true);

    // First pass: record last occurrence of each prefix sum
    const lastOccurrence = new Map<number, number>();
    let psum = 0;
    lastOccurrence.set(0, -1);
    for (let i = 0; i < n; i++) {
      psum += nums[i];
      lastOccurrence.set(psum, i);
    }

    // Second pass: skip nodes in zero-sum segments
    psum = 0;
    let i = 0;
    while (i < n) {
      psum += nums[i];
      const last = lastOccurrence.get(psum)!;
      if (last !== i) {
        // skip i+1..last
        for (let j = i + 1; j <= last; j++) include[j] = false;
        i = last + 1;
      } else {
        result.push(nums[i]);
        i++;
      }
    }

    steps.push({
      line: 14,
      explanation: `Second pass: use stored prefix sums to skip zero-sum segments. Result: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz([...result], Object.fromEntries(result.map((_, idx) => [idx, 'found'])), {}),
    });

    return steps;
  },
};

export default removeZeroSumConsecutiveNodes;
