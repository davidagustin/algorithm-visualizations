import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseNodesInEvenLengthGroups: AlgorithmDefinition = {
  id: 'reverse-nodes-in-even-length-groups',
  title: 'Reverse Nodes in Even Length Groups',
  leetcodeNumber: 2074,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, the nodes are consecutively grouped into groups with lengths 1, 2, 3, 4, ... The last group may be shorter. Reverse the nodes in each group that has an even number of nodes. Traverse group by group, count actual nodes in each group, and reverse that group if its actual size is even.',
  tags: ['linked list', 'reverse', 'grouping', 'simulation'],

  code: {
    pseudocode: `function reverseEvenLengthGroups(head):
  prev = head  // end of previous group
  groupLen = 2
  while prev.next != null:
    // Count actual nodes in current group
    count = 0, cur = prev.next
    while count < groupLen and cur != null:
      count++, cur = cur.next
    // Reverse if even count
    if count % 2 == 0:
      tail = prev.next
      for i in range(count - 1):
        next = tail.next.next
        tail.next.next = prev.next
        prev.next = tail.next
        tail.next = next
    prev = tail (or advance groupLen nodes)
    groupLen++
  return head`,

    python: `def reverseEvenLengthGroups(head):
    prev = head
    group_len = 2
    while prev.next:
        count = 0; cur = prev.next
        while count < group_len and cur:
            count += 1; cur = cur.next
        if count % 2 == 0:
            tail = prev.next
            for _ in range(count - 1):
                nxt = tail.next.next
                tail.next.next = prev.next
                prev.next = tail.next
                tail.next = nxt
        cur = prev.next
        for _ in range(count): cur = cur.next
        prev = cur if cur else prev
        group_len += 1
    return head`,

    javascript: `function reverseEvenLengthGroups(head) {
  let prev = head, groupLen = 2;
  while (prev.next) {
    let count = 0, cur = prev.next;
    while (count < groupLen && cur) { count++; cur = cur.next; }
    if (count % 2 === 0) {
      let tail = prev.next;
      for (let i = 0; i < count - 1; i++) {
        const nxt = tail.next.next;
        tail.next.next = prev.next;
        prev.next = tail.next;
        tail.next = nxt;
      }
    }
    cur = prev.next;
    for (let i = 0; i < count; i++) cur = cur.next;
    prev = cur || prev;
    groupLen++;
  }
  return head;
}`,

    java: `public ListNode reverseEvenLengthGroups(ListNode head) {
    ListNode prev = head; int groupLen = 2;
    while (prev.next != null) {
        int count = 0; ListNode cur = prev.next;
        while (count < groupLen && cur != null) { count++; cur = cur.next; }
        if (count % 2 == 0) {
            ListNode tail = prev.next;
            for (int i = 0; i < count - 1; i++) {
                ListNode nxt = tail.next.next;
                tail.next.next = prev.next;
                prev.next = tail.next;
                tail.next = nxt;
            }
        }
        cur = prev.next;
        for (int i = 0; i < count; i++) cur = cur.next;
        prev = (cur != null) ? cur : prev;
        groupLen++;
    }
    return head;
}`,
  },

  defaultInput: {
    nums: [5, 2, 6, 3, 9, 1, 7, 3, 8, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [5, 2, 6, 3, 9, 1, 7, 3, 8, 4],
      placeholder: '5,2,6,3,9,1,7,3,8,4',
      helperText: 'Comma-separated integers. Groups have sizes 1,2,3,4,... (last may be shorter)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...nums];
    const n = arr.length;

    const makeViz = (
      a: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: a,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Reverse nodes in even-length groups. List: [${arr.join(', ')}]. Groups: G1(size 1), G2(size 2), G3(size 3), ...`,
      variables: { list: arr, n },
      visualization: makeViz([...arr], { 0: 'active' }, { 0: 'G1 start' }),
    });

    const result = [...arr];
    let groupStart = 1; // skip first node (group 1 always has size 1)
    let groupLen = 2;

    // Group 1 is always size 1 (first node), never reversed
    steps.push({
      line: 3,
      explanation: `Group 1: node at index 0 (value ${result[0]}). Size = 1 (odd). No reversal needed.`,
      variables: { group: 1, 'group size': 1, 'is even': false },
      visualization: makeViz([...result], { 0: 'visited' }, { 0: 'G1 (skip)' }),
    });

    while (groupStart < n) {
      const actualSize = Math.min(groupLen, n - groupStart);
      const groupEnd = groupStart + actualSize - 1;
      const isEven = actualSize % 2 === 0;

      const hl: Record<number, string> = {};
      const lab: Record<number, string> = {};
      for (let i = groupStart; i <= groupEnd; i++) {
        hl[i] = isEven ? 'active' : 'pointer';
      }
      lab[groupStart] = `G${groupLen - 1} start`;
      lab[groupEnd] = `G${groupLen - 1} end(${actualSize})`;

      steps.push({
        line: 5,
        explanation: `Group ${groupLen - 1}: indices ${groupStart}-${groupEnd}, values [${result.slice(groupStart, groupEnd + 1).join(', ')}]. Actual size = ${actualSize}. ${isEven ? 'EVEN - will reverse!' : 'ODD - keep as is.'}`,
        variables: { group: groupLen - 1, start: groupStart, end: groupEnd, size: actualSize, isEven },
        visualization: makeViz([...result], hl, lab),
      });

      if (isEven) {
        const segment = result.slice(groupStart, groupEnd + 1).reverse();
        result.splice(groupStart, actualSize, ...segment);

        steps.push({
          line: 9,
          explanation: `Reversed group ${groupLen - 1}: [${segment.join(', ')}]. Full list: [${result.join(', ')}].`,
          variables: { 'reversed segment': segment, 'full list': result },
          visualization: makeViz([...result],
            Object.fromEntries(Array.from({ length: actualSize }, (_, i) => [groupStart + i, 'found'])),
            { [groupStart]: 'rev start', [groupEnd]: 'rev end' }),
        });
      }

      groupStart += actualSize;
      groupLen++;
    }

    steps.push({
      line: 17,
      explanation: `All groups processed. Final list: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz([...result], Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default reverseNodesInEvenLengthGroups;
