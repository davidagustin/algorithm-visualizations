import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flattenMultiLevelLinkedList: AlgorithmDefinition = {
  id: 'flatten-multi-level-linked-list',
  title: 'Flatten Multi-Level Linked List',
  leetcodeNumber: 430,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Flatten a multi-level doubly linked list where some nodes have child sublists. We use DFS: when a node has a child, we insert the child chain between the current node and its next, then continue.',
  tags: ['Linked List', 'Recursion', 'DFS'],
  code: {
    pseudocode: `function flatten(head):
  curr = head
  while curr is not null:
    if curr has child:
      next = curr.next
      child = curr.child
      curr.next = child
      child.prev = curr
      curr.child = null
      tail = child
      while tail.next:
        tail = tail.next
      tail.next = next
      if next: next.prev = tail
    curr = curr.next
  return head`,
    python: `def flatten(head):
    curr = head
    while curr:
        if curr.child:
            nxt = curr.next
            child = curr.child
            curr.next = child
            child.prev = curr
            curr.child = None
            tail = child
            while tail.next:
                tail = tail.next
            tail.next = nxt
            if nxt:
                nxt.prev = tail
        curr = curr.next
    return head`,
    javascript: `function flatten(head) {
  let curr = head;
  while (curr) {
    if (curr.child) {
      const next = curr.next;
      const child = curr.child;
      curr.next = child;
      child.prev = curr;
      curr.child = null;
      let tail = child;
      while (tail.next) tail = tail.next;
      tail.next = next;
      if (next) next.prev = tail;
    }
    curr = curr.next;
  }
  return head;
}`,
    java: `public Node flatten(Node head) {
    Node curr = head;
    while (curr != null) {
        if (curr.child != null) {
            Node next = curr.next;
            Node child = curr.child;
            curr.next = child;
            child.prev = curr;
            curr.child = null;
            Node tail = child;
            while (tail.next != null) tail = tail.next;
            tail.next = next;
            if (next != null) next.prev = tail;
        }
        curr = curr.next;
    }
    return head;
}`,
  },
  defaultInput: {
    nodes: [1, 2, 3, 4, 5, 6],
    childAt: 3,
    children: [7, 8, 9],
  },
  inputFields: [
    {
      name: 'nodes',
      label: 'Main List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: 'e.g. 1,2,3,4,5,6',
      helperText: 'Main linked list node values',
    },
    {
      name: 'childAt',
      label: 'Child Pointer At Value',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Which node has a child list',
    },
    {
      name: 'children',
      label: 'Child List Values',
      type: 'array',
      defaultValue: [7, 8, 9],
      placeholder: 'e.g. 7,8,9',
      helperText: 'Values of the child linked list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const mainNodes = (input.nodes as number[]).slice();
    const childAt = input.childAt as number;
    const children = (input.children as number[]).slice();
    const steps: AlgorithmStep[] = [];

    // Find the index of childAt in mainNodes
    const childAtIdx = mainNodes.indexOf(childAt);

    // Build a combined visualization showing main list + child list
    function makeViz(
      currentList: number[],
      currIdx: number | null,
      phase: string,
      childInserted: boolean
    ): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < currentList.length; i++) {
        highlights[i] = 'default';
      }

      if (currIdx !== null && currIdx < currentList.length) {
        highlights[currIdx] = 'active';
        labels[currIdx] = 'curr';
      }

      return {
        type: 'array',
        array: currentList,
        highlights,
        labels,
        auxData: {
          label: 'Flatten State',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Main list', value: childInserted ? currentList.join(' -> ') : mainNodes.join(' -> ') },
            ...(!childInserted ? [{ key: `Child at ${childAt}`, value: children.join(' -> ') }] : []),
          ],
        },
      };
    }

    // Step 1: Show initial structure
    steps.push({
      line: 1,
      explanation: `Multi-level list: main = [${mainNodes.join(' -> ')}], node ${childAt} has child list [${children.join(' -> ')}].`,
      variables: { main: mainNodes, childAt, children },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < mainNodes.length; i++) h[i] = 'default';
        if (childAtIdx >= 0) {
          h[childAtIdx] = 'pointer';
          l[childAtIdx] = 'has child';
        }
        return {
          type: 'array' as const,
          array: mainNodes,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Structure',
            entries: [
              { key: 'Main', value: mainNodes.join(' -> ') },
              { key: `Child at ${childAt}`, value: children.join(' -> ') },
            ],
          },
        };
      })(),
    });

    // Simulate flattening
    const flatList = mainNodes.slice();
    let currIdx = 0;

    // Walk through until we find the node with child
    while (currIdx < flatList.length) {
      if (flatList[currIdx] === childAt && children.length > 0) {
        steps.push({
          line: 4,
          explanation: `Node ${childAt} at index ${currIdx} has a child list. Process it.`,
          variables: { curr: childAt, child: children[0] },
          visualization: makeViz(flatList, currIdx, 'Found child', false),
        });

        // Save next
        const nextIdx = currIdx + 1;
        const nextVal = nextIdx < flatList.length ? flatList[nextIdx] : null;

        steps.push({
          line: 5,
          explanation: `Save next = ${nextVal !== null ? nextVal : 'null'}. Will reconnect after inserting child chain.`,
          variables: { next: nextVal, child: children },
          visualization: makeViz(flatList, currIdx, 'Save next pointer', false),
        });

        // Insert children after currIdx
        flatList.splice(currIdx + 1, 0, ...children);

        steps.push({
          line: 6,
          explanation: `Insert child chain [${children.join(', ')}] after node ${childAt}. List is now [${flatList.join(' -> ')}].`,
          variables: { list: [...flatList] },
          visualization: (() => {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            for (let i = 0; i < flatList.length; i++) {
              if (i === currIdx) {
                h[i] = 'active';
                l[i] = 'curr';
              } else if (i > currIdx && i <= currIdx + children.length) {
                h[i] = 'found';
                l[i] = 'child';
              } else {
                h[i] = 'default';
              }
            }
            return {
              type: 'array' as const,
              array: flatList.slice(),
              highlights: h,
              labels: l,
              auxData: {
                label: 'Flatten State',
                entries: [{ key: 'Current list', value: flatList.join(' -> ') }],
              },
            };
          })(),
        });

        // Find tail of child chain
        const tailIdx = currIdx + children.length;
        steps.push({
          line: 10,
          explanation: `Find tail of child chain: node ${flatList[tailIdx]} at index ${tailIdx}. Connect tail.next to ${nextVal !== null ? nextVal : 'null'}.`,
          variables: { tail: flatList[tailIdx], next: nextVal },
          visualization: (() => {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            for (let i = 0; i < flatList.length; i++) h[i] = 'default';
            h[tailIdx] = 'pointer';
            l[tailIdx] = 'tail';
            if (nextVal !== null) {
              const ni = flatList.indexOf(nextVal, tailIdx);
              if (ni >= 0) {
                h[ni] = 'comparing';
                l[ni] = 'next';
              }
            }
            return {
              type: 'array' as const,
              array: flatList.slice(),
              highlights: h,
              labels: l,
            };
          })(),
        });

        // Move to next and continue (children are now inline, skip them naturally)
        currIdx++;
        continue;
      }

      steps.push({
        line: 14,
        explanation: `Node ${flatList[currIdx]} has no child. Move to next.`,
        variables: { curr: flatList[currIdx] },
        visualization: makeViz(flatList, currIdx, 'Traverse', true),
      });

      currIdx++;
    }

    // Final result
    steps.push({
      line: 15,
      explanation: `Flattening complete. Result: [${flatList.join(' -> ')}].`,
      variables: { result: flatList },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < flatList.length; i++) h[i] = 'found';
        return {
          type: 'array' as const,
          array: flatList,
          highlights: h,
          labels: {},
        };
      })(),
    });

    return steps;
  },
};

export default flattenMultiLevelLinkedList;
