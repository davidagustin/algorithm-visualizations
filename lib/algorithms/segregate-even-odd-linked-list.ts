import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const segregateEvenOddLinkedList: AlgorithmDefinition = {
  id: 'segregate-even-odd-linked-list',
  title: 'Segregate Even and Odd Nodes in Linked List',
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Rearrange a linked list so all even-valued nodes come before all odd-valued nodes, maintaining relative order within each group. Use two dummy heads to build even and odd sublists simultaneously, then connect them.',
  tags: ['linked list', 'partitioning', 'two pointers'],

  code: {
    pseudocode: `function segregate(head):
  evenDummy = Node(0)
  oddDummy = Node(0)
  evenTail = evenDummy
  oddTail = oddDummy
  cur = head
  while cur != null:
    if cur.val % 2 == 0:
      evenTail.next = cur
      evenTail = evenTail.next
    else:
      oddTail.next = cur
      oddTail = oddTail.next
    cur = cur.next
  evenTail.next = oddDummy.next
  oddTail.next = null
  return evenDummy.next`,

    python: `def segregate(head):
    even_dummy = ListNode(0)
    odd_dummy = ListNode(0)
    even_tail = even_dummy
    odd_tail = odd_dummy
    cur = head
    while cur:
        if cur.val % 2 == 0:
            even_tail.next = cur
            even_tail = even_tail.next
        else:
            odd_tail.next = cur
            odd_tail = odd_tail.next
        cur = cur.next
    even_tail.next = odd_dummy.next
    odd_tail.next = None
    return even_dummy.next`,

    javascript: `function segregate(head) {
  const evenDummy = { val: 0, next: null };
  const oddDummy = { val: 0, next: null };
  let evenTail = evenDummy, oddTail = oddDummy;
  let cur = head;
  while (cur) {
    if (cur.val % 2 === 0) { evenTail.next = cur; evenTail = evenTail.next; }
    else { oddTail.next = cur; oddTail = oddTail.next; }
    cur = cur.next;
  }
  evenTail.next = oddDummy.next;
  oddTail.next = null;
  return evenDummy.next;
}`,

    java: `public ListNode segregate(ListNode head) {
    ListNode evenDummy = new ListNode(0), oddDummy = new ListNode(0);
    ListNode evenTail = evenDummy, oddTail = oddDummy;
    ListNode cur = head;
    while (cur != null) {
        if (cur.val % 2 == 0) { evenTail.next = cur; evenTail = evenTail.next; }
        else { oddTail.next = cur; oddTail = oddTail.next; }
        cur = cur.next;
    }
    evenTail.next = oddDummy.next;
    oddTail.next = null;
    return evenDummy.next;
}`,
  },

  defaultInput: {
    nums: [17, 15, 8, 12, 10, 5, 4, 1, 7, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [17, 15, 8, 12, 10, 5, 4, 1, 7, 6],
      placeholder: '17,15,8,12,10,5,4,1,7,6',
      helperText: 'Linked list to segregate by even/odd values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

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
      explanation: `Segregate even and odd nodes. List: [${nums.join(' -> ')}]. Even nodes first, then odd nodes.`,
      variables: { n: nums.length },
      visualization: makeViz([...nums], {}, {}),
    });

    const evenNodes: number[] = [];
    const oddNodes: number[] = [];

    for (let i = 0; i < nums.length; i++) {
      const isEven = nums[i] % 2 === 0;

      steps.push({
        line: 7,
        explanation: `Node ${i} (value=${nums[i]}): ${isEven ? 'even' : 'odd'} -> append to ${isEven ? 'even' : 'odd'} list.`,
        variables: { value: nums[i], isEven, evenList: evenNodes.join(','), oddList: oddNodes.join(',') },
        visualization: makeViz(
          [...nums],
          { [i]: isEven ? 'active' : 'comparing' },
          { [i]: isEven ? 'even' : 'odd' }
        ),
      });

      if (isEven) evenNodes.push(nums[i]);
      else oddNodes.push(nums[i]);

      steps.push({
        line: isEven ? 9 : 12,
        explanation: `${isEven ? 'Even' : 'Odd'} list now: [${isEven ? evenNodes.join(', ') : oddNodes.join(', ')}].`,
        variables: { evenList: evenNodes.join(','), oddList: oddNodes.join(',') },
        visualization: makeViz(
          isEven ? [...evenNodes] : [...oddNodes],
          { [isEven ? evenNodes.length - 1 : oddNodes.length - 1]: 'active' },
          { [isEven ? evenNodes.length - 1 : oddNodes.length - 1]: 'tail' }
        ),
      });
    }

    steps.push({
      line: 15,
      explanation: `Connect even list tail to odd list head. Even: [${evenNodes.join(', ')}]. Odd: [${oddNodes.join(', ')}].`,
      variables: { evenList: evenNodes.join(','), oddList: oddNodes.join(',') },
      visualization: makeViz(
        [...evenNodes, ...oddNodes],
        {
          ...Object.fromEntries(evenNodes.map((_, i) => [i, 'active'])),
          ...Object.fromEntries(oddNodes.map((_, i) => [evenNodes.length + i, 'comparing'])),
        },
        { 0: 'evenHead', [evenNodes.length]: 'oddHead' }
      ),
    });

    const result = [...evenNodes, ...oddNodes];

    steps.push({
      line: 16,
      explanation: `Segregation complete. Result: [${result.join(' -> ')}].`,
      variables: { result: result.join(' -> ') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default segregateEvenOddLinkedList;
