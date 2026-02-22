import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const oddEvenLinkedList: AlgorithmDefinition = {
  id: 'odd-even-linked-list',
  title: 'Odd Even Linked List',
  leetcodeNumber: 328,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Regroup a linked list so all odd-indexed nodes come before even-indexed nodes (1-indexed). Uses two pointers: one for odd chain, one for even chain. Reconnect at the end.',
  tags: ['linked list', 'two pointers', 'in-place', 'regrouping'],

  code: {
    pseudocode: `function oddEvenList(head):
  if not head: return head
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

    python: `def oddEvenList(head):
    if not head:
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

    javascript: `function oddEvenList(head) {
  if (!head) return head;
  let odd = head, even = head.next, evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,

    java: `public ListNode oddEvenList(ListNode head) {
    if (head == null) return head;
    ListNode odd = head, even = head.next, evenHead = even;
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

  defaultInput: { values: [1, 2, 3, 4, 5] },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Node values. Odd-indexed (1,3,5,...) will be grouped first.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]) || [1, 2, 3, 4, 5];
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    // Compute expected result
    const oddNodes = values.filter((_, i) => i % 2 === 0);   // 0-indexed even = 1-indexed odd
    const evenNodes = values.filter((_, i) => i % 2 === 1);
    const result = [...oddNodes, ...evenNodes];

    const makeViz = (
      oddIdx: number,
      evenIdx: number,
      oddChain: number[],
      evenChain: number[],
      phase: string
    ): ArrayVisualization => {
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};

      // Color by index position in original: odd-indexed = 'pointer', even-indexed = 'active'
      for (let i = 0; i < n; i++) {
        h[i] = i % 2 === 0 ? 'pointer' : 'active';
      }
      if (oddIdx < n) { h[oddIdx] = 'found'; l[oddIdx] = 'odd'; }
      if (evenIdx < n && evenIdx !== oddIdx) { h[evenIdx] = 'comparing'; l[evenIdx] = 'even'; }

      return {
        type: 'array',
        array: values,
        highlights: h,
        labels: l,
        auxData: {
          label: `Phase: ${phase}`,
          entries: [
            { key: 'odd chain', value: oddChain.join(' → ') || '(empty)' },
            { key: 'even chain', value: evenChain.join(' → ') || '(empty)' },
          ],
        },
      };
    };

    steps.push({
      line: 2,
      explanation: `Initialize: odd=head(${values[0]}), even=head.next(${values[1] ?? 'null'}), evenHead=even. Odd chain and even chain start here.`,
      variables: { odd: values[0], even: values[1] ?? null, n },
      visualization: makeViz(0, 1, [values[0]], n > 1 ? [values[1]] : [], 'Initialize'),
    });

    let oddIdx = 0;
    let evenIdx = 1;

    while (evenIdx < n && evenIdx + 1 < n) {
      const nextOddIdx = evenIdx + 1;

      steps.push({
        line: 5,
        explanation: `odd.next = even.next = node[${nextOddIdx}](${values[nextOddIdx]}). Advance odd to node[${nextOddIdx}].`,
        variables: { odd: values[oddIdx], even: values[evenIdx], newOdd: values[nextOddIdx] },
        visualization: makeViz(
          nextOddIdx,
          evenIdx,
          values.filter((_, i) => i % 2 === 0 && i <= nextOddIdx),
          values.filter((_, i) => i % 2 === 1 && i <= evenIdx),
          'Advance odd'
        ),
      });

      oddIdx = nextOddIdx;
      const nextEvenIdx = nextOddIdx + 1;

      if (nextEvenIdx < n) {
        steps.push({
          line: 7,
          explanation: `even.next = odd.next = node[${nextEvenIdx}](${values[nextEvenIdx]}). Advance even to node[${nextEvenIdx}].`,
          variables: { odd: values[oddIdx], even: values[evenIdx], newEven: values[nextEvenIdx] },
          visualization: makeViz(
            oddIdx,
            nextEvenIdx,
            values.filter((_, i) => i % 2 === 0 && i <= oddIdx),
            values.filter((_, i) => i % 2 === 1 && i <= nextEvenIdx),
            'Advance even'
          ),
        });
        evenIdx = nextEvenIdx;
      } else {
        evenIdx = n; // done
      }
    }

    steps.push({
      line: 9,
      explanation: `Connect end of odd chain to evenHead. odd.next = evenHead (index 1, value ${values[1] ?? 'null'}).`,
      variables: { oddChain: oddNodes, evenChain: evenNodes },
      visualization: makeViz(oddIdx, 1, oddNodes, evenNodes, 'Connect chains'),
    });

    steps.push({
      line: 10,
      explanation: `Done! Odd-indexed nodes first, then even-indexed: ${result.join(' → ')}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result,
        highlights: {
          ...Object.fromEntries(oddNodes.map((_, i) => [i, 'found'])),
          ...Object.fromEntries(evenNodes.map((_, i) => [oddNodes.length + i, 'active'])),
        },
        labels: {
          0: 'head',
          [oddNodes.length - 1]: 'odd end',
          [oddNodes.length]: 'even start',
          [result.length - 1]: 'tail',
        },
      },
    });

    return steps;
  },
};

export default oddEvenLinkedList;
