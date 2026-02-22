import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitLinkedListInParts: AlgorithmDefinition = {
  id: 'split-linked-list-in-parts',
  title: 'Split Linked List in Parts',
  leetcodeNumber: 725,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list and an integer k, split the list into k consecutive parts. The length of each part should be as equal as possible. Parts earlier in the list should have more nodes than parts later (difference of at most 1). Empty parts are represented by null.',
  tags: ['linked list', 'array', 'greedy'],

  code: {
    pseudocode: `function splitListToParts(head, k):
  length = 0
  cur = head
  while cur: length++, cur = cur.next
  partSize = length // k
  extra = length % k
  result = []
  cur = head
  for i in range(k):
    size = partSize + (1 if i < extra else 0)
    for j in range(size - 1):
      cur = cur.next
    if cur:
      next = cur.next
      cur.next = null
      cur = next
    result.append(part head)
  return result`,

    python: `def splitListToParts(head, k):
    length, cur = 0, head
    while cur: length += 1; cur = cur.next
    part_size, extra = divmod(length, k)
    result, cur = [], head
    for i in range(k):
        size = part_size + (1 if i < extra else 0)
        part_head = cur
        for _ in range(size - 1):
            if cur: cur = cur.next
        if cur:
            cur.next, cur = None, cur.next
        result.append(part_head)
    return result`,

    javascript: `function splitListToParts(head, k) {
  let length = 0, cur = head;
  while (cur) { length++; cur = cur.next; }
  const partSize = Math.floor(length / k);
  const extra = length % k;
  const result = [];
  cur = head;
  for (let i = 0; i < k; i++) {
    const size = partSize + (i < extra ? 1 : 0);
    const partHead = cur;
    for (let j = 0; j < size - 1; j++) if (cur) cur = cur.next;
    if (cur) { const next = cur.next; cur.next = null; cur = next; }
    result.push(partHead);
  }
  return result;
}`,

    java: `public ListNode[] splitListToParts(ListNode head, int k) {
    int length = 0; ListNode cur = head;
    while (cur != null) { length++; cur = cur.next; }
    int partSize = length / k, extra = length % k;
    ListNode[] result = new ListNode[k];
    cur = head;
    for (int i = 0; i < k; i++) {
        int size = partSize + (i < extra ? 1 : 0);
        result[i] = cur;
        for (int j = 0; j < size - 1; j++) if (cur != null) cur = cur.next;
        if (cur != null) { ListNode next = cur.next; cur.next = null; cur = next; }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      placeholder: '1,2,3,4,5,6,7,8,9,10',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Number of Parts',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of parts to split the list into',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
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

    const partSize = Math.floor(n / k);
    const extra = n % k;

    steps.push({
      line: 1,
      explanation: `List length = ${n}, k = ${k}. Base part size = ${n}/${k} = ${partSize}. ${extra} parts get an extra node.`,
      variables: { length: n, k, partSize, extra },
      visualization: makeViz([...nums], { 0: 'active' }, { 0: 'start' }),
    });

    const parts: number[][] = [];
    let idx = 0;

    for (let i = 0; i < k; i++) {
      const size = partSize + (i < extra ? 1 : 0);
      const part = nums.slice(idx, idx + size);
      parts.push(part);

      const hl: Record<number, string> = {};
      for (let j = idx; j < idx + size && j < n; j++) hl[j] = 'active';

      steps.push({
        line: 9,
        explanation: `Part ${i + 1} of ${k}: size = ${partSize} + ${i < extra ? 1 : 0} = ${size}. Nodes: [${part.join(', ')}].`,
        variables: { part: i + 1, size, nodes: part },
        visualization: makeViz([...nums], hl, { [idx]: `P${i + 1} start`, [Math.min(idx + size - 1, n - 1)]: `P${i + 1} end` }),
      });

      idx += size;
    }

    const resultDisplay: number[] = parts.flat();
    const partLabels: Record<number, string> = {};
    let offset = 0;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length > 0) partLabels[offset] = `P${i + 1}`;
      offset += parts[i].length;
    }

    steps.push({
      line: 15,
      explanation: `Split complete. ${k} parts: ${parts.map((p, i) => `P${i + 1}=[${p.join(',')}]`).join(', ')}.`,
      variables: { parts: parts.map(p => p.join(',')) },
      visualization: makeViz([...resultDisplay], Object.fromEntries(resultDisplay.map((_, i) => [i, 'found'])), partLabels),
    });

    return steps;
  },
};

export default splitLinkedListInParts;
