import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const decodeXoredArray: AlgorithmDefinition = {
  id: 'decode-xored-array',
  title: 'Decode XORed Array',
  leetcodeNumber: 1720,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'An encoded array was built by XOR-ing adjacent elements: encoded[i] = arr[i] XOR arr[i+1]. Given encoded and the first element of arr, decode it. Since encoded[i] XOR arr[i] = arr[i+1], recover each subsequent element by XOR-ing the encoded value with the previous decoded element.',
  tags: ['bit manipulation', 'array'],

  code: {
    pseudocode: `function decode(encoded, first):
  arr = [first]
  for i from 0 to len(encoded)-1:
    arr.append(arr[i] XOR encoded[i])
  return arr`,

    python: `def decode(encoded, first):
    arr = [first]
    for e in encoded:
        arr.append(arr[-1] ^ e)
    return arr`,

    javascript: `function decode(encoded, first) {
  const arr = [first];
  for (const e of encoded) {
    arr.push(arr[arr.length - 1] ^ e);
  }
  return arr;
}`,

    java: `public int[] decode(int[] encoded, int first) {
    int[] arr = new int[encoded.length + 1];
    arr[0] = first;
    for (int i = 0; i < encoded.length; i++) {
        arr[i + 1] = arr[i] ^ encoded[i];
    }
    return arr;
}`,
  },

  defaultInput: {
    encoded: [1, 2, 3],
    first: 1,
  },

  inputFields: [
    {
      name: 'encoded',
      label: 'Encoded Array',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'XOR-encoded array',
    },
    {
      name: 'first',
      label: 'First Element',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'First element of original array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const encoded = input.encoded as number[];
    const first = input.first as number;
    const steps: AlgorithmStep[] = [];

    const makeEncodedViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...encoded],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Decode XORed array. encoded = [${encoded.join(', ')}], first = ${first}. arr[i+1] = arr[i] XOR encoded[i].`,
      variables: { encoded: [...encoded], first },
      visualization: makeEncodedViz({}, {}),
    });

    const arr = [first];
    steps.push({
      line: 2,
      explanation: `Initialize arr with first element: arr = [${first}].`,
      variables: { arr: [...arr] },
      visualization: makeEncodedViz({}, {}),
    });

    for (let i = 0; i < encoded.length; i++) {
      const prev = arr[i];
      const next = prev ^ encoded[i];
      arr.push(next);
      steps.push({
        line: 3,
        explanation: `arr[${i + 1}] = arr[${i}] XOR encoded[${i}] = ${prev} XOR ${encoded[i]} = ${next}.`,
        variables: { i, 'arr[i]': prev, 'encoded[i]': encoded[i], 'arr[i+1]': next },
        visualization: makeEncodedViz(
          { [i]: 'active' },
          { [i]: `enc[${i}]=${encoded[i]}` }
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Decoding complete. Original array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(arr.map((v, i) => [i, String(v)])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default decodeXoredArray;
