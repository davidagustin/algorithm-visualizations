import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseNodesInKGroup: AlgorithmDefinition = {
  id: 'reverse-nodes-in-k-group',
  title: 'Reverse Nodes in k-Group',
  leetcodeNumber: 25,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Given a linked list, reverse nodes in groups of k. If the remaining nodes are fewer than k, leave them as-is. Uses a dummy head and a helper to check if k nodes remain before reversing each group.',
  tags: ['linked list', 'recursion', 'pointer manipulation', 'hard'],

  code: {
    pseudocode: `function reverseKGroup(head, k):
  dummy = ListNode(0); dummy.next = head
  groupPrev = dummy
  while true:
    kth = getKth(groupPrev, k)
    if not kth: break
    groupNext = kth.next
    // reverse group
    prev = kth.next; curr = groupPrev.next
    while curr != groupNext:
      tmp = curr.next
      curr.next = prev
      prev = curr
      curr = tmp
    tmp = groupPrev.next
    groupPrev.next = kth
    groupPrev = tmp
  return dummy.next

function getKth(curr, k):
  while curr and k > 0:
    curr = curr.next; k--
  return curr`,

    python: `def reverseKGroup(head, k):
    dummy = ListNode(0)
    dummy.next = head
    group_prev = dummy
    while True:
        kth = get_kth(group_prev, k)
        if not kth:
            break
        group_next = kth.next
        prev, curr = kth.next, group_prev.next
        while curr != group_next:
            tmp = curr.next
            curr.next = prev
            prev = curr
            curr = tmp
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp
    return dummy.next

def get_kth(curr, k):
    while curr and k > 0:
        curr = curr.next
        k -= 1
    return curr`,

    javascript: `function reverseKGroup(head, k) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let groupPrev = dummy;
  while (true) {
    const kth = getKth(groupPrev, k);
    if (!kth) break;
    const groupNext = kth.next;
    let prev = kth.next, curr = groupPrev.next;
    while (curr !== groupNext) {
      const tmp = curr.next;
      curr.next = prev;
      prev = curr;
      curr = tmp;
    }
    const tmp = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = tmp;
  }
  return dummy.next;
}
function getKth(curr, k) {
  while (curr && k > 0) { curr = curr.next; k--; }
  return curr;
}`,

    java: `public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode groupPrev = dummy;
    while (true) {
        ListNode kth = getKth(groupPrev, k);
        if (kth == null) break;
        ListNode groupNext = kth.next;
        ListNode prev = kth.next, curr = groupPrev.next;
        while (curr != groupNext) {
            ListNode tmp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = tmp;
        }
        ListNode tmp = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = tmp;
    }
    return dummy.next;
}`,
  },

  defaultInput: { values: [1, 2, 3, 4, 5], k: 2 },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Node values of the linked list',
    },
    {
      name: 'k',
      label: 'Group Size (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Size of each group to reverse',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = (input.values as number[]) || [1, 2, 3, 4, 5];
    const k = (input.k as number) ?? 2;
    const steps: AlgorithmStep[] = [];
    const n = original.length;

    let arr = [...original];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'K-Group Reversal',
        entries: [
          { key: 'k', value: `${k}` },
          { key: 'groups', value: `${Math.floor(n / k)}` },
          { key: 'remainder', value: `${n % k} node(s) untouched` },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Reverse every k=${k} nodes. List length=${n}. Can fully reverse ${Math.floor(n / k)} group(s). ${n % k > 0 ? `Last ${n % k} node(s) stay as-is.` : 'No remainder.'}`,
      variables: { k, n, groups: Math.floor(n / k), remainder: n % k },
      visualization: makeViz(
        {},
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    let groupStart = 0;
    let groupNum = 0;

    while (groupStart + k <= n) {
      groupNum++;
      const groupEnd = groupStart + k - 1;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = 0; i < groupStart; i++) h[i] = 'sorted';
      for (let i = groupStart; i <= groupEnd; i++) { h[i] = 'comparing'; }
      for (let i = groupEnd + 1; i < n; i++) h[i] = 'default';
      l[groupStart] = 'grpStart';
      l[groupEnd] = 'kth';

      steps.push({
        line: 3,
        explanation: `Group ${groupNum}: nodes [${groupStart}..${groupEnd}] = [${arr.slice(groupStart, groupEnd + 1).join(', ')}]. k=${k} nodes exist, proceed to reverse.`,
        variables: { groupStart, groupEnd, group: arr.slice(groupStart, groupEnd + 1) },
        visualization: makeViz(h, l),
      });

      // Reverse in place
      let lo = groupStart;
      let hi = groupEnd;
      while (lo < hi) {
        const tmp = arr[lo];
        arr[lo] = arr[hi];
        arr[hi] = tmp;
        lo++;
        hi--;
      }

      const h2: Record<number, string> = {};
      const l2: Record<number, string> = {};
      for (let i = 0; i < groupStart; i++) h2[i] = 'sorted';
      for (let i = groupStart; i <= groupEnd; i++) h2[i] = 'found';
      for (let i = groupEnd + 1; i < n; i++) h2[i] = 'default';
      l2[groupStart] = 'new front';
      l2[groupEnd] = 'new back';

      steps.push({
        line: 11,
        explanation: `Reversed group ${groupNum}: [${arr.slice(groupStart, groupEnd + 1).join(', ')}]. List now: ${arr.join(' → ')}.`,
        variables: { group: arr.slice(groupStart, groupEnd + 1), list: [...arr] },
        visualization: makeViz(h2, l2),
      });

      groupStart += k;
    }

    if (n % k !== 0) {
      const remainStart = groupStart;
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = 0; i < remainStart; i++) h[i] = 'sorted';
      for (let i = remainStart; i < n; i++) { h[i] = 'active'; }
      l[remainStart] = 'remainder';

      steps.push({
        line: 4,
        explanation: `Remaining ${n % k} node(s) [${arr.slice(remainStart).join(', ')}]: fewer than k=${k}, leave as-is.`,
        variables: { remainder: arr.slice(remainStart) },
        visualization: makeViz(h, l),
      });
    }

    steps.push({
      line: 14,
      explanation: `Done! Result: ${arr.join(' → ')}.`,
      variables: { result: [...arr] },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    return steps;
  },
};

export default reverseNodesInKGroup;
