import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pairwiseSwapLinkedList: AlgorithmDefinition = {
  id: 'pairwise-swap-linked-list',
  title: 'Swap Nodes in Pairs',
  leetcodeNumber: 24,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Swap every two adjacent nodes in a linked list and return its head. Do not modify node values - swap the actual nodes. Use a sentinel dummy node and three pointers to rewire each pair. Process pairs iteratively until fewer than 2 nodes remain.',
  tags: ['linked list', 'recursion', 'swap', 'pairs'],

  code: {
    pseudocode: `function swapPairs(head):
  dummy = Node(0, head)
  prev = dummy
  while prev.next and prev.next.next:
    first = prev.next
    second = first.next
    // swap
    prev.next = second
    first.next = second.next
    second.next = first
    // advance
    prev = first
  return dummy.next`,

    python: `def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next and prev.next.next:
        first = prev.next
        second = first.next
        prev.next = second
        first.next = second.next
        second.next = first
        prev = first
    return dummy.next`,

    javascript: `function swapPairs(head) {
  const dummy = { val: 0, next: head };
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = first.next;
    prev.next = second;
    first.next = second.next;
    second.next = first;
    prev = first;
  }
  return dummy.next;
}`,

    java: `public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy;
    while (prev.next != null && prev.next.next != null) {
        ListNode first = prev.next;
        ListNode second = first.next;
        prev.next = second;
        first.next = second.next;
        second.next = first;
        prev = first;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Linked list nodes to swap in pairs',
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
      explanation: `Swap adjacent pairs in list: [${nums.join(' -> ')}]. Use sentinel dummy + 3 pointers.`,
      variables: { n },
      visualization: makeViz([...nums], {}, {}),
    });

    const arr = [...nums];
    let i = 0;

    while (i + 1 < arr.length) {
      steps.push({
        line: 3,
        explanation: `Pair found: first=node[${i}] (value=${arr[i]}), second=node[${i + 1}] (value=${arr[i + 1]}).`,
        variables: { first: arr[i], second: arr[i + 1], pairStart: i },
        visualization: makeViz(
          [...arr],
          { [i]: 'active', [i + 1]: 'comparing' },
          { [i]: 'first', [i + 1]: 'second' }
        ),
      });

      // Swap
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];

      steps.push({
        line: 7,
        explanation: `Swapped! prev.next = second, first.next = second.next, second.next = first. Array now: [${arr.join(', ')}].`,
        variables: { newFirst: arr[i], newSecond: arr[i + 1] },
        visualization: makeViz(
          [...arr],
          { [i]: 'found', [i + 1]: 'found' },
          { [i]: 'swapped', [i + 1]: 'swapped' }
        ),
      });

      i += 2;
    }

    if (n % 2 !== 0) {
      steps.push({
        line: 4,
        explanation: `Odd number of nodes. Last node (value=${arr[arr.length - 1]}) stays in place.`,
        variables: { lastNode: arr[arr.length - 1] },
        visualization: makeViz(
          [...arr],
          { [arr.length - 1]: 'pointer' },
          { [arr.length - 1]: 'unchanged' }
        ),
      });
    }

    steps.push({
      line: 10,
      explanation: `Swap complete. Result: [${arr.join(' -> ')}].`,
      variables: { result: arr.join(' -> ') },
      visualization: makeViz(
        arr,
        Object.fromEntries(arr.map((_, idx) => [idx, 'sorted'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default pairwiseSwapLinkedList;
