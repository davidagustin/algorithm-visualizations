import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bitwiseAndRangeII: AlgorithmDefinition = {
  id: 'bitwise-and-range-ii',
  title: 'Bitwise AND of Numbers Range',
  leetcodeNumber: 201,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given two integers left and right representing a range [left, right], return the bitwise AND of all numbers in that range. Key insight: the AND of a range keeps only the common prefix of left and right in binary. Repeatedly right-shift both until equal, then shift back.',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function rangeBitwiseAnd(left, right):
  shift = 0
  while left != right:
    left >>= 1
    right >>= 1
    shift++
  return left << shift`,

    python: `def rangeBitwiseAnd(left: int, right: int) -> int:
    shift = 0
    while left != right:
        left >>= 1
        right >>= 1
        shift += 1
    return left << shift`,

    javascript: `function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left !== right) {
    left >>= 1;
    right >>= 1;
    shift++;
  }
  return left << shift;
}`,

    java: `public int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left != right) {
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}`,
  },

  defaultInput: { left: 5, right: 7 },
  inputFields: [
    {
      name: 'left',
      label: 'Left',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Start of range (inclusive)',
    },
    {
      name: 'right',
      label: 'Right',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'End of range (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origLeft = input.left as number;
    const origRight = input.right as number;
    const steps: AlgorithmStep[] = [];

    // Build array showing range numbers AND progression
    const rangeNums = [];
    for (let i = origLeft; i <= origRight && rangeNums.length < 8; i++) rangeNums.push(i);

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: { label: 'Bit State', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Range [${origLeft}, ${origRight}]. Numbers: ${rangeNums.join(', ')}. We find common binary prefix of left and right.`,
      variables: { left: origLeft, right: origRight, shift: 0 },
      visualization: makeViz(
        rangeNums,
        Object.fromEntries(rangeNums.map((_, i) => [i, 'active'])),
        Object.fromEntries(rangeNums.map((v, i) => [i, v.toString(2)])),
        [
          { key: 'left', value: `${origLeft} (${origLeft.toString(2)})` },
          { key: 'right', value: `${origRight} (${origRight.toString(2)})` },
          { key: 'shift', value: '0' },
        ]
      ),
    });

    let left = origLeft;
    let right = origRight;
    let shift = 0;

    while (left !== right) {
      left >>= 1;
      right >>= 1;
      shift++;
      steps.push({
        line: 4,
        explanation: `Shift both right by 1. left=${left} (${left.toString(2)}), right=${right} (${right.toString(2)}), shift=${shift}.`,
        variables: { left, right, shift },
        visualization: makeViz(
          [left, right],
          { 0: 'comparing', 1: 'comparing' },
          { 0: 'L', 1: 'R' },
          [
            { key: 'left', value: `${left} (${left.toString(2)})` },
            { key: 'right', value: `${right} (${right.toString(2)})` },
            { key: 'shift', value: String(shift) },
          ]
        ),
      });
    }

    const result = left << shift;
    steps.push({
      line: 7,
      explanation: `left === right = ${left}. Common prefix found. Result = ${left} << ${shift} = ${result} (binary: ${result.toString(2)}).`,
      variables: { result, shift, left, right },
      visualization: makeViz(
        [result],
        { 0: 'found' },
        { 0: result.toString(2) },
        [
          { key: 'common prefix', value: `${left} (${left.toString(2)})` },
          { key: 'shift', value: String(shift) },
          { key: 'result', value: `${result} (${result.toString(2)})` },
        ]
      ),
    });

    return steps;
  },
};

export default bitwiseAndRangeII;
