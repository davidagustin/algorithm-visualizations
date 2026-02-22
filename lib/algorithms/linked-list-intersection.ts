import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListIntersection: AlgorithmDefinition = {
  id: 'linked-list-intersection',
  title: 'Linked List Intersection',
  leetcodeNumber: 160,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given two singly linked lists that may intersect at some node, find the intersection node. We use two pointers: when one reaches the end, redirect it to the head of the other list. They will meet at the intersection after at most two passes.',
  tags: ['Linked List', 'Two Pointers'],
  code: {
    pseudocode: `function getIntersectionNode(headA, headB):
  pA = headA
  pB = headB
  while pA != pB:
    if pA is null:
      pA = headB
    else:
      pA = pA.next
    if pB is null:
      pB = headA
    else:
      pB = pB.next
  return pA`,
    python: `def getIntersectionNode(headA, headB):
    pA, pB = headA, headB
    while pA != pB:
        pA = headB if pA is None else pA.next
        pB = headA if pB is None else pB.next
    return pA`,
    javascript: `function getIntersectionNode(headA, headB) {
  let pA = headA;
  let pB = headB;
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }
  return pA;
}`,
    java: `public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode pA = headA;
    ListNode pB = headB;
    while (pA != pB) {
        pA = (pA == null) ? headB : pA.next;
        pB = (pB == null) ? headA : pB.next;
    }
    return pA;
}`,
  },
  defaultInput: {
    listA: [4, 1, 8, 4, 5],
    listB: [5, 6, 1, 8, 4, 5],
    intersectAt: 8,
  },
  inputFields: [
    {
      name: 'listA',
      label: 'List A Values',
      type: 'array',
      defaultValue: [4, 1, 8, 4, 5],
      placeholder: 'e.g. 4,1,8,4,5',
      helperText: 'Values of linked list A',
    },
    {
      name: 'listB',
      label: 'List B Values',
      type: 'array',
      defaultValue: [5, 6, 1, 8, 4, 5],
      placeholder: 'e.g. 5,6,1,8,4,5',
      helperText: 'Values of linked list B',
    },
    {
      name: 'intersectAt',
      label: 'Intersection Value',
      type: 'number',
      defaultValue: 8,
      placeholder: 'e.g. 8',
      helperText: 'The value where the two lists intersect',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const listA = (input.listA as number[]).slice();
    const listB = (input.listB as number[]).slice();
    const intersectVal = input.intersectAt as number;
    const steps: AlgorithmStep[] = [];

    // Find intersection index in both lists
    const intersectIdxA = listA.indexOf(intersectVal);
    const intersectIdxB = listB.indexOf(intersectVal);

    // We visualize both lists as a single combined array: [listA... | listB...]
    const combined = [...listA, ...listB];
    const lenA = listA.length;

    function makeViz(
      pAIdx: number | null, // index in listA, or null if at null
      pBIdx: number | null, // index in listB, or null if at null
      pASwitched: boolean,
      pBSwitched: boolean,
      found: boolean
    ): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      // Color intersection region
      if (intersectIdxA >= 0) {
        for (let i = intersectIdxA; i < lenA; i++) {
          highlights[i] = 'visited';
        }
        for (let i = intersectIdxB; i < listB.length; i++) {
          highlights[lenA + i] = 'visited';
        }
      }

      // Label list boundaries
      labels[0] = 'A-head';
      labels[lenA] = 'B-head';

      // pA position
      if (pAIdx !== null) {
        const vizIdx = pASwitched ? lenA + pAIdx : pAIdx;
        highlights[vizIdx] = found ? 'found' : 'active';
        labels[vizIdx] = 'pA';
      }

      // pB position
      if (pBIdx !== null) {
        const vizIdx = pBSwitched ? pBIdx : lenA + pBIdx;
        if (found && pAIdx !== null) {
          highlights[vizIdx] = 'found';
        } else {
          highlights[vizIdx] = 'pointer';
        }
        if (labels[vizIdx]) {
          labels[vizIdx] += '/pB';
        } else {
          labels[vizIdx] = 'pB';
        }
      }

      return {
        type: 'array',
        array: combined,
        highlights,
        labels,
        auxData: {
          label: 'Lists',
          entries: [
            { key: 'List A', value: listA.join(' -> ') },
            { key: 'List B', value: listB.join(' -> ') },
            { key: 'Intersect at', value: String(intersectVal) },
          ],
        },
      };
    }

    // Step 1: Initialize pointers
    steps.push({
      line: 1,
      explanation: 'Initialize pA at head of list A and pB at head of list B.',
      variables: { pA: listA[0], pB: listB[0] },
      visualization: makeViz(0, 0, false, false, false),
    });

    // Simulate the algorithm
    let pA: number | null = 0;
    let pB: number | null = 0;
    let pASwitched = false;
    let pBSwitched = false;
    let iterations = 0;
    const maxIterations = listA.length + listB.length + 2;

    while (iterations < maxIterations) {
      // Check if they meet
      const pAVal = pA !== null ? (pASwitched ? listB[pA] : listA[pA]) : null;
      const pBVal = pB !== null ? (pBSwitched ? listA[pB] : listB[pB]) : null;

      // Check intersection: both at same position in shared portion
      if (pA !== null && pB !== null) {
        const pAInOrigA = !pASwitched ? pA : null;
        const pAInOrigB = pASwitched ? pA : null;
        const pBInOrigB = !pBSwitched ? pB : null;
        const pBInOrigA = pBSwitched ? pB : null;

        // They meet when pointing to the same node in the shared portion
        if (pAInOrigA !== null && pBInOrigA !== null && pAInOrigA === pBInOrigA && pAInOrigA >= intersectIdxA) {
          steps.push({
            line: 4,
            explanation: `pA and pB both point to node ${listA[pAInOrigA]}. Intersection found!`,
            variables: { pA: listA[pAInOrigA], pB: listA[pBInOrigA], result: listA[pAInOrigA] },
            visualization: makeViz(pA, pBInOrigA, pASwitched, true, true),
          });
          break;
        }
        if (pAInOrigB !== null && pBInOrigB !== null && intersectIdxB >= 0) {
          const aRelative = pAInOrigB >= intersectIdxB ? pAInOrigB - intersectIdxB : -1;
          const bRelative = pBInOrigB >= intersectIdxB ? pBInOrigB - intersectIdxB : -1;
          if (aRelative >= 0 && aRelative === bRelative) {
            steps.push({
              line: 4,
              explanation: `pA and pB meet at the intersection node ${listB[pAInOrigB]}!`,
              variables: { pA: listB[pAInOrigB], pB: listB[pBInOrigB], result: intersectVal },
              visualization: makeViz(pA, pB, pASwitched, pBSwitched, true),
            });
            break;
          }
        }
      }

      // Move pA
      if (pA === null) {
        pA = 0;
        pASwitched = true;
        steps.push({
          line: 5,
          explanation: `pA reached the end of list ${pASwitched ? 'B' : 'A'}. Redirect pA to head of list B.`,
          variables: { pA: listB[0], pB: pBVal },
          visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
        });
      } else {
        const currList = pASwitched ? listB : listA;
        pA++;
        if (pA >= currList.length) {
          if (!pASwitched) {
            pA = 0;
            pASwitched = true;
            steps.push({
              line: 5,
              explanation: `pA reached end of list A. Redirect pA to head of list B (node ${listB[0]}).`,
              variables: { pA: listB[0], pB: pBVal },
              visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
            });
          } else {
            pA = null;
            steps.push({
              line: 6,
              explanation: 'pA reached the end. No intersection found.',
              variables: { pA: null, pB: pBVal },
              visualization: makeViz(null, pB, pASwitched, pBSwitched, false),
            });
            break;
          }
        } else {
          steps.push({
            line: 6,
            explanation: `Advance pA to node ${currList[pA]}.`,
            variables: { pA: currList[pA], pB: pBVal },
            visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
          });
        }
      }

      // Move pB
      if (pB === null) {
        pB = 0;
        pBSwitched = true;
        steps.push({
          line: 8,
          explanation: `pB reached the end. Redirect pB to head of list A.`,
          variables: { pA: pA !== null ? (pASwitched ? listB[pA] : listA[pA]) : null, pB: listA[0] },
          visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
        });
      } else {
        const currList = pBSwitched ? listA : listB;
        pB++;
        if (pB >= currList.length) {
          if (!pBSwitched) {
            pB = 0;
            pBSwitched = true;
            steps.push({
              line: 8,
              explanation: `pB reached end of list B. Redirect pB to head of list A (node ${listA[0]}).`,
              variables: { pA: pA !== null ? (pASwitched ? listB[pA] : listA[pA]) : null, pB: listA[0] },
              visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
            });
          } else {
            pB = null;
          }
        } else {
          steps.push({
            line: 9,
            explanation: `Advance pB to node ${currList[pB]}.`,
            variables: { pA: pA !== null ? (pASwitched ? listB[pA] : listA[pA]) : null, pB: currList[pB] },
            visualization: makeViz(pA, pB, pASwitched, pBSwitched, false),
          });
        }
      }

      iterations++;
    }

    // Final result step
    steps.push({
      line: 10,
      explanation: `The intersection node has value ${intersectVal}. Both pointers traverse a total of ${listA.length + listB.length} nodes to align.`,
      variables: { result: intersectVal },
      visualization: makeViz(intersectIdxA, intersectIdxB, false, false, true),
    });

    return steps;
  },
};

export default linkedListIntersection;
