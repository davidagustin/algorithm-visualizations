import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deleteNodeInLinkedList: AlgorithmDefinition = {
  id: 'delete-node-in-linked-list',
  title: 'Delete Node in a Linked List',
  leetcodeNumber: 237,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Delete a node in a singly linked list given only access to that node (not the head). The trick: copy the next node\'s value into the current node, then skip the next node.',
  tags: ['linked list', 'trick', 'value copy'],

  code: {
    pseudocode: `function deleteNode(node):
  // We can't access head, only the node itself
  // Copy next node's value into current node
  node.val = node.next.val
  // Skip the next node
  node.next = node.next.next`,

    python: `def deleteNode(node):
    # Copy the value of the next node
    node.val = node.next.val
    # Remove the next node
    node.next = node.next.next`,

    javascript: `function deleteNode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}`,

    java: `public void deleteNode(ListNode node) {
    node.val = node.next.val;
    node.next = node.next.next;
}`,
  },

  defaultInput: { values: [4, 5, 1, 9], deleteIndex: 1 },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [4, 5, 1, 9],
      placeholder: '4,5,1,9',
      helperText: 'Node values of the linked list',
    },
    {
      name: 'deleteIndex',
      label: 'Index of Node to Delete (0-based)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Which node to delete (must not be the tail)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]) || [4, 5, 1, 9];
    const deleteIndex = (input.deleteIndex as number) ?? 1;
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    const nodeIdx = Math.max(0, Math.min(deleteIndex, n - 2)); // must not be tail
    const arr = [...values];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Delete Strategy',
        entries: [
          { key: 'target node', value: `index ${nodeIdx}, value ${values[nodeIdx]}` },
          { key: 'next node', value: `index ${nodeIdx + 1}, value ${values[nodeIdx + 1]}` },
          { key: 'trick', value: 'copy next val, skip next node' },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `We only have access to node at index ${nodeIdx} (value=${values[nodeIdx]}). We cannot traverse backwards or access head.`,
      variables: { nodeIdx, nodeVal: values[nodeIdx] },
      visualization: makeViz(
        { [nodeIdx]: 'active', [nodeIdx + 1]: 'comparing' },
        { [nodeIdx]: 'node (to delete)', [nodeIdx + 1]: 'next node' }
      ),
    });

    steps.push({
      line: 3,
      explanation: `The key insight: we can't remove node[${nodeIdx}] directly. Instead, copy the value of next node (${values[nodeIdx + 1]}) into current node.`,
      variables: { nodeVal: values[nodeIdx], nextVal: values[nodeIdx + 1] },
      visualization: makeViz(
        { [nodeIdx]: 'comparing', [nodeIdx + 1]: 'active' },
        { [nodeIdx]: `was ${values[nodeIdx]}`, [nodeIdx + 1]: `copy from here` }
      ),
    });

    // Perform the "copy" step
    arr[nodeIdx] = values[nodeIdx + 1];

    steps.push({
      line: 3,
      explanation: `Copied! node.val = ${arr[nodeIdx]}. Now node at index ${nodeIdx} has value ${arr[nodeIdx]} (same as next node).`,
      variables: { nodeNewVal: arr[nodeIdx], nextVal: values[nodeIdx + 1] },
      visualization: makeViz(
        { [nodeIdx]: 'found', [nodeIdx + 1]: 'mismatch' },
        { [nodeIdx]: `now ${arr[nodeIdx]} (copied)`, [nodeIdx + 1]: 'to be skipped' }
      ),
    });

    steps.push({
      line: 5,
      explanation: `Set node.next = node.next.next. This skips (removes) the old "next" node. Effectively deletes it.`,
      variables: { skipIndex: nodeIdx + 1 },
      visualization: makeViz(
        { [nodeIdx]: 'found', [nodeIdx + 1]: 'visited' },
        { [nodeIdx]: 'kept', [nodeIdx + 1]: 'skipped (deleted)' }
      ),
    });

    // Remove skipped node from display
    arr.splice(nodeIdx + 1, 1);

    steps.push({
      line: 5,
      explanation: `Done! Node with original value ${values[nodeIdx]} is deleted. Result: ${arr.join(' → ')}.`,
      variables: { result: [...arr], deleted: values[nodeIdx] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, i === nodeIdx ? 'found' : 'sorted'])),
        labels: {
          0: 'head',
          [nodeIdx]: `was next`,
          [arr.length - 1]: 'tail',
        },
      },
    });

    return steps;
  },
};

export default deleteNodeInLinkedList;
