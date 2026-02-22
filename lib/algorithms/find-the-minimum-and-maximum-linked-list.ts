import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findTheMinimumAndMaximumLinkedList: AlgorithmDefinition = {
  id: 'find-the-minimum-and-maximum-linked-list',
  title: 'Find Minimum and Maximum in Linked List',
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Traverse a linked list once to find both the minimum and maximum values. Initialize min and max to the head value, then compare each subsequent node. Return both values after a single O(n) traversal with O(1) extra space.',
  tags: ['linked list', 'traversal', 'min max'],

  code: {
    pseudocode: `function findMinMax(head):
  if head is null: return (null, null)
  minVal = maxVal = head.val
  cur = head.next
  while cur != null:
    if cur.val < minVal:
      minVal = cur.val
    if cur.val > maxVal:
      maxVal = cur.val
    cur = cur.next
  return (minVal, maxVal)`,

    python: `def findMinMax(head):
    if not head:
        return None, None
    min_val = max_val = head.val
    cur = head.next
    while cur:
        min_val = min(min_val, cur.val)
        max_val = max(max_val, cur.val)
        cur = cur.next
    return min_val, max_val`,

    javascript: `function findMinMax(head) {
  if (!head) return [null, null];
  let minVal = head.val, maxVal = head.val;
  let cur = head.next;
  while (cur) {
    minVal = Math.min(minVal, cur.val);
    maxVal = Math.max(maxVal, cur.val);
    cur = cur.next;
  }
  return [minVal, maxVal];
}`,

    java: `public int[] findMinMax(ListNode head) {
    if (head == null) return new int[]{};
    int minVal = head.val, maxVal = head.val;
    ListNode cur = head.next;
    while (cur != null) {
        minVal = Math.min(minVal, cur.val);
        maxVal = Math.max(maxVal, cur.val);
        cur = cur.next;
    }
    return new int[]{minVal, maxVal};
}`,
  },

  defaultInput: {
    nums: [7, 2, 5, 1, 9, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [7, 2, 5, 1, 9, 3],
      placeholder: '7,2,5,1,9,3',
      helperText: 'Linked list values to find min and max',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    if (n === 0) return steps;

    let minVal = nums[0];
    let maxVal = nums[0];

    steps.push({
      line: 2,
      explanation: `Initialize min = max = ${nums[0]} (head value). Begin traversal.`,
      variables: { min: minVal, max: maxVal, cur: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'head/min/max' }),
    });

    for (let i = 1; i < n; i++) {
      const prevMin = minVal;
      const prevMax = maxVal;

      if (nums[i] < minVal) minVal = nums[i];
      if (nums[i] > maxVal) maxVal = nums[i];

      const minChanged = minVal !== prevMin;
      const maxChanged = maxVal !== prevMax;

      steps.push({
        line: 5,
        explanation: `Visit node ${i} (value ${nums[i]}). ${minChanged ? `New min = ${minVal}.` : ''} ${maxChanged ? `New max = ${maxVal}.` : ''} ${!minChanged && !maxChanged ? 'No update needed.' : ''}`,
        variables: { current: nums[i], min: minVal, max: maxVal, updated: minChanged || maxChanged },
        visualization: makeViz(
          {
            [i]: 'active',
            ...(minChanged ? { [i]: 'found' } : {}),
            ...(maxChanged ? { [i]: 'found' } : {}),
          },
          {
            [i]: 'cur',
            ...(nums.indexOf(minVal) !== -1 ? { [nums.indexOf(minVal)]: 'min' } : {}),
            ...(nums.lastIndexOf(maxVal) !== -1 ? { [nums.lastIndexOf(maxVal)]: 'max' } : {}),
          }
        ),
      });
    }

    const minIdx = nums.indexOf(minVal);
    const maxIdx = nums.lastIndexOf(maxVal);

    steps.push({
      line: 11,
      explanation: `Traversal complete. Minimum = ${minVal} at index ${minIdx}, Maximum = ${maxVal} at index ${maxIdx}.`,
      variables: { min: minVal, minIndex: minIdx, max: maxVal, maxIndex: maxIdx },
      visualization: makeViz(
        { [minIdx]: 'found', [maxIdx]: 'comparing' },
        { [minIdx]: 'MIN', [maxIdx]: 'MAX' }
      ),
    });

    return steps;
  },
};

export default findTheMinimumAndMaximumLinkedList;
