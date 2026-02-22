import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeTwoSortedLists: AlgorithmDefinition = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  leetcodeNumber: 21,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Merge two sorted linked lists and return the merged list (sorted). Uses a dummy head node and a current pointer that appends the smaller of the two heads at each step.',
  tags: ['linked list', 'merge', 'two pointers', 'sorting'],

  code: {
    pseudocode: `function mergeTwoLists(l1, l2):
  dummy = ListNode(0)
  curr = dummy
  while l1 and l2:
    if l1.val <= l2.val:
      curr.next = l1
      l1 = l1.next
    else:
      curr.next = l2
      l2 = l2.next
    curr = curr.next
  curr.next = l1 or l2
  return dummy.next`,

    python: `def mergeTwoLists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,

    javascript: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 ?? l2;
  return dummy.next;
}`,

    java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    curr.next = l1 != null ? l1 : l2;
    return dummy.next;
}`,
  },

  defaultInput: { l1: [1, 2, 4], l2: [1, 3, 4] },

  inputFields: [
    {
      name: 'l1',
      label: 'First Sorted List',
      type: 'array',
      defaultValue: [1, 2, 4],
      placeholder: '1,2,4',
      helperText: 'Sorted linked list values',
    },
    {
      name: 'l2',
      label: 'Second Sorted List',
      type: 'array',
      defaultValue: [1, 3, 4],
      placeholder: '1,3,4',
      helperText: 'Sorted linked list values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const l1 = (input.l1 as number[]) || [1, 2, 4];
    const l2 = (input.l2 as number[]) || [1, 3, 4];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      p1: number,
      p2: number,
      merged: number[],
      chosenFrom: 'l1' | 'l2' | 'none'
    ): ArrayVisualization => {
      // Display: l1 | l2 | merged
      const sep = -99;
      const displayArr = [...l1, sep, ...l2, sep, ...merged];
      const h: Record<number, string> = {};
      const lab: Record<number, string> = {};

      // l1 section
      for (let i = 0; i < l1.length; i++) {
        if (i < p1) h[i] = 'visited';
        else if (i === p1) { h[i] = chosenFrom === 'l1' ? 'found' : 'comparing'; lab[i] = 'p1'; }
        else h[i] = 'default';
      }

      // l2 section
      const l2Start = l1.length + 1;
      for (let i = 0; i < l2.length; i++) {
        const idx = l2Start + i;
        if (i < p2) h[idx] = 'visited';
        else if (i === p2) { h[idx] = chosenFrom === 'l2' ? 'found' : 'comparing'; lab[idx] = 'p2'; }
        else h[idx] = 'default';
      }

      // merged section
      const mStart = l1.length + 1 + l2.length + 1;
      lab[l1.length] = '|';
      lab[l1.length + 1 + l2.length] = '→';
      for (let i = 0; i < merged.length; i++) {
        h[mStart + i] = 'sorted';
        if (i === merged.length - 1) lab[mStart + i] = 'curr';
      }

      return {
        type: 'array',
        array: displayArr.map((v) => v === sep ? 0 : v),
        highlights: h,
        labels: lab,
        auxData: {
          label: 'Merge Progress',
          entries: [
            { key: 'l1 remaining', value: l1.slice(p1).join(' → ') || 'done' },
            { key: 'l2 remaining', value: l2.slice(p2).join(' → ') || 'done' },
            { key: 'merged', value: merged.join(' → ') || 'empty' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Create a dummy head node. curr points to it. We'll build the merged list by always appending the smaller of the two heads.`,
      variables: { p1: 0, p2: 0, merged: [] },
      visualization: makeViz(0, 0, [], 'none'),
    });

    let p1 = 0;
    let p2 = 0;
    const merged: number[] = [];

    while (p1 < l1.length && p2 < l2.length) {
      const v1 = l1[p1];
      const v2 = l2[p2];

      steps.push({
        line: 4,
        explanation: `Compare l1[${p1}]=${v1} vs l2[${p2}]=${v2}. ${v1 <= v2 ? `${v1} <= ${v2}, pick from l1.` : `${v2} < ${v1}, pick from l2.`}`,
        variables: { p1, p2, v1, v2, merged: [...merged] },
        visualization: makeViz(p1, p2, [...merged], 'none'),
      });

      if (v1 <= v2) {
        merged.push(v1);
        steps.push({
          line: 6,
          explanation: `Append ${v1} from l1 to merged list. Advance p1 to ${p1 + 1}.`,
          variables: { p1: p1 + 1, p2, appended: v1, merged: [...merged] },
          visualization: makeViz(p1, p2, [...merged], 'l1'),
        });
        p1++;
      } else {
        merged.push(v2);
        steps.push({
          line: 9,
          explanation: `Append ${v2} from l2 to merged list. Advance p2 to ${p2 + 1}.`,
          variables: { p1, p2: p2 + 1, appended: v2, merged: [...merged] },
          visualization: makeViz(p1, p2, [...merged], 'l2'),
        });
        p2++;
      }
    }

    // Append remaining
    const remaining1 = l1.slice(p1);
    const remaining2 = l2.slice(p2);
    const remaining = [...remaining1, ...remaining2];
    const before = [...merged];
    merged.push(...remaining);

    if (remaining.length > 0) {
      steps.push({
        line: 12,
        explanation: `One list exhausted. Append remaining ${remaining.length} node(s) from ${remaining1.length > 0 ? 'l1' : 'l2'}: [${remaining.join(', ')}].`,
        variables: { remaining, merged: [...merged] },
        visualization: makeViz(p1, p2, [...merged], remaining1.length > 0 ? 'l1' : 'l2'),
      });
    }

    steps.push({
      line: 13,
      explanation: `Merge complete! Result: ${merged.join(' → ')}.`,
      variables: { result: merged },
      visualization: {
        type: 'array',
        array: merged,
        highlights: Object.fromEntries(merged.map((_, i) => [i, 'sorted'])),
        labels: { 0: 'head', [merged.length - 1]: 'tail' },
      },
    });

    return steps;
  },
};

export default mergeTwoSortedLists;
