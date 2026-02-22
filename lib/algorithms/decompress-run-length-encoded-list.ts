import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const decompressRunLengthEncodedList: AlgorithmDefinition = {
  id: 'decompress-run-length-encoded-list',
  title: 'Decompress Run-Length Encoded List',
  leetcodeNumber: 1313,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a run-length encoded list where pairs [freq, val] represent "freq copies of val", decompress it into a full array. Read pairs at indices 0,1 then 2,3 etc. For each pair, append val freq times to the result array.',
  tags: ['array', 'run-length encoding', 'simulation'],

  code: {
    pseudocode: `function decompressRLElist(nums):
  result = []
  for i in 0, 2, 4, ...:
    freq = nums[i]
    val = nums[i+1]
    for _ in range(freq):
      result.append(val)
  return result`,
    python: `def decompressRLElist(nums):
    result = []
    for i in range(0, len(nums), 2):
        freq, val = nums[i], nums[i+1]
        result.extend([val] * freq)
    return result`,
    javascript: `function decompressRLElist(nums) {
  const result = [];
  for (let i = 0; i < nums.length; i += 2) {
    const freq = nums[i], val = nums[i+1];
    for (let j = 0; j < freq; j++) result.push(val);
  }
  return result;
}`,
    java: `public int[] decompressRLElist(int[] nums) {
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i += 2) {
        int freq = nums[i], val = nums[i+1];
        for (int j = 0; j < freq; j++) result.add(val);
    }
    return result.stream().mapToInt(Integer::intValue).toArray();
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Encoded Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Pairs of [freq, val] flattened',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Decompress RLE list [${nums.join(', ')}]. Process pairs (freq, val) at indices 0,1 then 2,3 etc.`,
      variables: { encoded: nums.join(', '), pairs: nums.length / 2 },
      visualization: makeViz(nums, {}, {}),
    });

    for (let i = 0; i < nums.length; i += 2) {
      const freq = nums[i];
      const val = nums[i + 1];
      steps.push({
        line: 3,
        explanation: `Pair at indices ${i},${i + 1}: freq=${freq}, val=${val}. Will append ${val} exactly ${freq} time(s).`,
        variables: { pairIndex: i / 2, freq, val },
        visualization: makeViz(nums, { [i]: 'active', [i + 1]: 'found' }, { [i]: 'freq', [i + 1]: 'val' }),
      });

      for (let j = 0; j < freq; j++) {
        result.push(val);
        steps.push({
          line: 6,
          explanation: `Append val=${val} (copy ${j + 1} of ${freq}). Result: [${result.join(', ')}].`,
          variables: { copy: j + 1, of: freq, val, resultLen: result.length },
          visualization: makeViz(
            [...result],
            { [result.length - 1]: 'active' },
            { [result.length - 1]: String(val) }
          ),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Decompressed result: [${result.join(', ')}].`,
      variables: { result: result.join(', '), length: result.length },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default decompressRunLengthEncodedList;
