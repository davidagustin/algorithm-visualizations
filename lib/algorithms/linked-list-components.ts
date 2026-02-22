import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListComponents: AlgorithmDefinition = {
  id: 'linked-list-components',
  title: 'Linked List Components',
  leetcodeNumber: 817,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list and an array nums representing a subset of node values, return the number of connected components in nums. A connected component is a maximal consecutive sub-sequence of nodes in the list that are all in nums. Use a set for O(1) lookup: traverse the list and count runs of consecutive nodes in the subset.',
  tags: ['linked list', 'hash set', 'connected components'],

  code: {
    pseudocode: `function numComponents(head, nums):
  numSet = set(nums)
  count = 0
  inComponent = false
  cur = head
  while cur != null:
    if cur.val in numSet:
      if not inComponent:
        count++
        inComponent = true
    else:
      inComponent = false
    cur = cur.next
  return count`,

    python: `def numComponents(head, nums):
    num_set = set(nums)
    count = 0
    in_component = False
    cur = head
    while cur:
        if cur.val in num_set:
            if not in_component:
                count += 1
                in_component = True
        else:
            in_component = False
        cur = cur.next
    return count`,

    javascript: `function numComponents(head, nums) {
  const numSet = new Set(nums);
  let count = 0, inComponent = false;
  for (let cur = head; cur; cur = cur.next) {
    if (numSet.has(cur.val)) {
      if (!inComponent) { count++; inComponent = true; }
    } else {
      inComponent = false;
    }
  }
  return count;
}`,

    java: `public int numComponents(ListNode head, int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int count = 0; boolean inComp = false;
    for (ListNode c = head; c != null; c = c.next) {
        if (set.contains(c.val)) {
            if (!inComp) { count++; inComp = true; }
        } else inComp = false;
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [0, 1, 2, 3, 4],
    subset: [0, 3, 1, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4],
      placeholder: '0,1,2,3,4',
      helperText: 'Node values of the linked list (unique)',
    },
    {
      name: 'subset',
      label: 'Subset (nums)',
      type: 'array',
      defaultValue: [0, 3, 1, 4],
      placeholder: '0,3,1,4',
      helperText: 'Subset of node values to find connected components',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const listVals = input.nums as number[];
    const subset = input.subset as number[];
    const steps: AlgorithmStep[] = [];
    const n = listVals.length;
    const numSet = new Set(subset);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...listVals],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build set from subset [${subset.join(', ')}]. Traverse list [${listVals.join(' -> ')}] counting connected components.`,
      variables: { 'num set': subset, count: 0, inComponent: false },
      visualization: makeViz(
        Object.fromEntries(listVals.map((v, i) => [i, numSet.has(v) ? 'pointer' : 'default'])),
        Object.fromEntries(listVals.map((v, i) => [i, numSet.has(v) ? 'in set' : '']))
      ),
    });

    let count = 0;
    let inComponent = false;

    for (let i = 0; i < n; i++) {
      const val = listVals[i];
      const inSet = numSet.has(val);

      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) hl[j] = numSet.has(listVals[j]) ? 'found' : 'visited';
      hl[i] = 'active';

      if (inSet) {
        if (!inComponent) {
          count++;
          inComponent = true;
          steps.push({
            line: 7,
            explanation: `Node value ${val} is in subset and starts a NEW component. Component count = ${count}.`,
            variables: { 'current value': val, inComponent: true, count },
            visualization: makeViz({ ...hl, [i]: 'found' }, { [i]: `C${count} start` }),
          });
        } else {
          steps.push({
            line: 6,
            explanation: `Node value ${val} is in subset and CONTINUES component ${count}. Still in same component.`,
            variables: { 'current value': val, inComponent: true, count },
            visualization: makeViz({ ...hl, [i]: 'active' }, { [i]: `C${count}` }),
          });
        }
      } else {
        inComponent = false;
        steps.push({
          line: 10,
          explanation: `Node value ${val} is NOT in subset. Break current component. count = ${count}.`,
          variables: { 'current value': val, inComponent: false, count },
          visualization: makeViz({ ...hl, [i]: 'mismatch' }, { [i]: 'not in set' }),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Traversal complete. Found ${count} connected component${count !== 1 ? 's' : ''} in the subset.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(listVals.map((v, i) => [i, numSet.has(v) ? 'found' : 'visited'])),
        { 0: 'done' }
      ),
    });

    return steps;
  },
};

export default linkedListComponents;
