import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortLinkedList: AlgorithmDefinition = {
  id: 'sort-linked-list',
  title: 'Sort Linked List (Merge Sort)',
  leetcodeNumber: 148,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Sort a linked list in O(n log n) time using merge sort. Find the middle using slow/fast pointers, recursively sort each half, then merge. Modeled here as an array to visualize the split and merge steps.',
  tags: ['Sorting', 'Linked List', 'Merge Sort'],
  code: {
    pseudocode: `function sortList(head):
  if head is null or head.next is null:
    return head
  mid = getMid(head)
  left = sortList(head)
  right = sortList(mid)
  return merge(left, right)

function merge(l1, l2):
  dummy = new Node(0)
  curr = dummy
  while l1 and l2:
    if l1.val <= l2.val:
      curr.next = l1; l1 = l1.next
    else:
      curr.next = l2; l2 = l2.next
    curr = curr.next
  curr.next = l1 or l2
  return dummy.next`,
    python: `def sortList(head):
    if not head or not head.next:
        return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    left = sortList(head)
    right = sortList(mid)
    return merge(left, right)

def merge(l1, l2):
    dummy = curr = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            curr.next = l1; l1 = l1.next
        else:
            curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
    javascript: `function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  const left = sortList(head);
  const right = sortList(mid);
  return merge(left, right);
}

function merge(l1, l2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1; l1 = l1.next;
    } else {
      curr.next = l2; l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}`,
    java: `public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode mid = slow.next;
    slow.next = null;
    ListNode left = sortList(head);
    ListNode right = sortList(mid);
    return merge(left, right);
}

private ListNode merge(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1; l1 = l1.next;
        } else {
            curr.next = l2; l2 = l2.next;
        }
        curr = curr.next;
    }
    curr.next = l1 != null ? l1 : l2;
    return dummy.next;
}`,
  },
  defaultInput: { list: [4, 2, 1, 3] },
  inputFields: [
    {
      name: 'list',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [4, 2, 1, 3],
      placeholder: '4,2,1,3',
      helperText: 'Comma-separated node values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const list = input.list as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Merge Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Sort linked list [${list.join(' -> ')}] using merge sort. Modeled as array for visualization.`,
      variables: { list },
      visualization: makeViz(list, {}, {}),
    });

    // Iterative merge sort simulation for clear step-by-step visualization
    let currentArr = list.slice();
    const n = currentArr.length;

    // Show split phase
    function mergeSortViz(arr: number[], lo: number, hi: number, depth: number): number[] {
      if (lo >= hi) return [arr[lo]];

      const mid = Math.floor((lo + hi) / 2);

      // Show split
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (let i = lo; i <= mid; i++) { hl[i] = 'pointer'; lb[i] = 'left'; }
      for (let i = mid + 1; i <= hi; i++) { hl[i] = 'comparing'; lb[i] = 'right'; }

      steps.push({
        line: 2,
        explanation: `Split [${arr.slice(lo, hi + 1).join(', ')}] at mid=${mid}. Left: [${arr.slice(lo, mid + 1).join(', ')}], Right: [${arr.slice(mid + 1, hi + 1).join(', ')}].`,
        variables: { lo, hi, mid, depth },
        visualization: makeViz(arr, hl, lb, [{ key: 'Depth', value: String(depth) }, { key: 'Action', value: 'Split' }]),
      });

      const leftSorted = mergeSortViz(arr, lo, mid, depth + 1);
      const rightSorted = mergeSortViz(arr, mid + 1, hi, depth + 1);

      // Merge
      const merged: number[] = [];
      let li = 0;
      let ri = 0;

      steps.push({
        line: 8,
        explanation: `Merge [${leftSorted.join(', ')}] and [${rightSorted.join(', ')}].`,
        variables: { left: [...leftSorted], right: [...rightSorted], depth },
        visualization: makeViz(arr, {}, {}, [{ key: 'Action', value: 'Merge' }, { key: 'Left', value: leftSorted.join(',') }, { key: 'Right', value: rightSorted.join(',') }]),
      });

      while (li < leftSorted.length && ri < rightSorted.length) {
        if (leftSorted[li] <= rightSorted[ri]) {
          merged.push(leftSorted[li]);
          li++;
        } else {
          merged.push(rightSorted[ri]);
          ri++;
        }
      }
      while (li < leftSorted.length) { merged.push(leftSorted[li]); li++; }
      while (ri < rightSorted.length) { merged.push(rightSorted[ri]); ri++; }

      // Update arr in place for visualization
      for (let i = 0; i < merged.length; i++) {
        arr[lo + i] = merged[i];
      }

      const mergeHl: Record<number, string> = {};
      const mergeLb: Record<number, string> = {};
      for (let i = lo; i <= hi; i++) {
        mergeHl[i] = 'found';
        mergeLb[i] = String(arr[i]);
      }

      steps.push({
        line: 8,
        explanation: `Merged result: [${merged.join(', ')}].`,
        variables: { merged: [...merged], depth },
        visualization: makeViz(arr, mergeHl, mergeLb, [{ key: 'Action', value: 'Merged' }]),
      });

      return merged;
    }

    if (n > 1) {
      mergeSortViz(currentArr, 0, n - 1, 0);
    }

    steps.push({
      line: 1,
      explanation: `Sorting complete! Result: [${currentArr.join(' -> ')}].`,
      variables: { result: [...currentArr] },
      visualization: makeViz(
        currentArr,
        Object.fromEntries(currentArr.map((_, i) => [i, 'found'])),
        Object.fromEntries(currentArr.map((v, i) => [i, String(v)])),
        [{ key: 'Sorted', value: currentArr.join(', ') }],
      ),
    });

    return steps;
  },
};

export default sortLinkedList;
