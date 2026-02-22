import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeKSortedListsDivideConquer: AlgorithmDefinition = {
  id: 'merge-k-sorted-lists-divide-conquer',
  title: 'Merge K Sorted Lists (Divide and Conquer)',
  leetcodeNumber: 23,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Merge k sorted linked lists into one sorted linked list using divide and conquer. Repeatedly pair up and merge adjacent lists until only one remains. This reduces the problem from O(kN) to O(N log k) time. Each merge of two sorted lists takes O(n) using the two-pointer technique.',
  tags: ['linked list', 'divide and conquer', 'merge sort', 'sorting'],

  code: {
    pseudocode: `function mergeKLists(lists):
  if lists empty: return null
  while len(lists) > 1:
    merged = []
    for i in range(0, len(lists), 2):
      l1 = lists[i]
      l2 = lists[i+1] if i+1 < len(lists) else null
      merged.append(mergeTwoLists(l1, l2))
    lists = merged
  return lists[0]

function mergeTwoLists(l1, l2):
  dummy = new Node(0)
  cur = dummy
  while l1 and l2:
    if l1.val <= l2.val: cur.next = l1, l1 = l1.next
    else: cur.next = l2, l2 = l2.next
    cur = cur.next
  cur.next = l1 or l2
  return dummy.next`,

    python: `def mergeKLists(lists):
    if not lists: return None
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i+1] if i+1 < len(lists) else None
            merged.append(mergeTwoLists(l1, l2))
        lists = merged
    return lists[0]

def mergeTwoLists(l1, l2):
    dummy = ListNode(0); cur = dummy
    while l1 and l2:
        if l1.val <= l2.val: cur.next = l1; l1 = l1.next
        else: cur.next = l2; l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next`,

    javascript: `function mergeKLists(lists) {
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(mergeTwoLists(lists[i], lists[i+1] || null));
    }
    lists = merged;
  }
  return lists[0];
}
function mergeTwoLists(l1, l2) {
  const dummy = { next: null }; let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
    else { cur.next = l2; l2 = l2.next; }
    cur = cur.next;
  }
  cur.next = l1 || l2; return dummy.next;
}`,

    java: `public ListNode mergeKLists(ListNode[] lists) {
    if (lists.length == 0) return null;
    List<ListNode> ls = new ArrayList<>(Arrays.asList(lists));
    while (ls.size() > 1) {
        List<ListNode> merged = new ArrayList<>();
        for (int i = 0; i < ls.size(); i += 2)
            merged.add(mergeTwoLists(ls.get(i), i+1 < ls.size() ? ls.get(i+1) : null));
        ls = merged;
    }
    return ls.get(0);
}`,
  },

  defaultInput: {
    nums: [1, 4, 7, 2, 5, 8, 3, 6, 9],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'All List Values (concatenated)',
      type: 'array',
      defaultValue: [1, 4, 7, 2, 5, 8, 3, 6, 9],
      placeholder: '1,4,7,2,5,8,3,6,9',
      helperText: 'Values for k sorted lists, each of equal size (length/k per list)',
    },
    {
      name: 'k',
      label: 'Number of Lists (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'How many sorted lists to merge',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const allVals = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const perList = Math.floor(allVals.length / k);

    // Split into k sorted lists
    let lists: number[][] = [];
    for (let i = 0; i < k; i++) {
      lists.push([...allVals.slice(i * perList, (i + 1) * perList)].sort((a, b) => a - b));
    }

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
      explanation: `Merge ${k} sorted lists using divide and conquer. Lists: ${lists.map((l, i) => `L${i + 1}=[${l.join(',')}]`).join(', ')}.`,
      variables: { k, lists: lists.map(l => l.join(',')) },
      visualization: makeViz([...allVals.slice(0, perList * k)],
        Object.fromEntries(Array.from({ length: perList * k }, (_, i) => [i, `active`])),
        Object.fromEntries(Array.from({ length: k }, (_, i) => [i * perList, `L${i + 1}`]))),
    });

    let round = 0;
    while (lists.length > 1) {
      round++;
      const merged: number[][] = [];

      for (let i = 0; i < lists.length; i += 2) {
        const l1 = lists[i];
        const l2 = i + 1 < lists.length ? lists[i + 1] : [];
        const result = mergeTwoSorted(l1, l2);
        merged.push(result);

        steps.push({
          line: 5,
          explanation: `Round ${round}: Merge L${i + 1} [${l1.join(',')}] with ${i + 1 < lists.length ? `L${i + 2} [${l2.join(',')}]` : 'null'}. Result: [${result.join(',')}].`,
          variables: { round, 'merged pair': result, 'lists remaining': lists.length },
          visualization: makeViz([...result],
            Object.fromEntries(result.map((_, idx) => [idx, 'active'])),
            { 0: `R${round} merged`, [result.length - 1]: 'end' }),
        });
      }

      lists = merged;

      const flatMerged = lists.flat();
      const mergedLabels: Record<number, string> = {};
      let labelOffset = 0;
      for (let li = 0; li < lists.length; li++) {
        mergedLabels[labelOffset] = `M${li + 1}`;
        labelOffset += lists[li].length;
      }
      steps.push({
        line: 8,
        explanation: `Round ${round} complete. Now have ${lists.length} list(s): ${lists.map((l) => `[${l.join(',')}]`).join(', ')}.`,
        variables: { 'lists count': lists.length, lists: lists.map(l => l.join(',')) },
        visualization: makeViz([...flatMerged],
          Object.fromEntries(flatMerged.map((_, i) => [i, 'visited'])),
          mergedLabels),
      });
    }

    const finalResult = lists[0];

    steps.push({
      line: 9,
      explanation: `All lists merged. Final sorted result: [${finalResult.join(', ')}].`,
      variables: { result: finalResult },
      visualization: makeViz([...finalResult], Object.fromEntries(finalResult.map((_, i) => [i, 'found'])), { 0: 'start', [finalResult.length - 1]: 'end' }),
    });

    return steps;
  },
};

function mergeTwoSorted(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else result.push(b[j++]);
  }
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);
  return result;
}

export default mergeKSortedListsDivideConquer;
