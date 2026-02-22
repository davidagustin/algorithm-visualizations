import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const encodeAndDecodeStrings: AlgorithmDefinition = {
  id: 'encode-and-decode-strings',
  title: 'Encode and Decode Strings',
  leetcodeNumber: 271,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Design an algorithm to encode a list of strings to a single string, and decode it back. Use a length-prefix encoding: prepend each string with its length and a delimiter like "#". This handles strings with any characters including "#".',
  tags: ['string', 'design', 'encoding', 'serialization'],
  code: {
    pseudocode: `function encode(strs):
  result = ""
  for s in strs:
    result += str(len(s)) + "#" + s
  return result

function decode(encoded):
  result = [], i = 0
  while i < len(encoded):
    j = encoded.index('#', i)
    length = int(encoded[i:j])
    result.append(encoded[j+1 : j+1+length])
    i = j + 1 + length
  return result`,
    python: `def encode(strs):
    return ''.join(f'{len(s)}#{s}' for s in strs)

def decode(encoded):
    result, i = [], 0
    while i < len(encoded):
        j = encoded.index('#', i)
        length = int(encoded[i:j])
        result.append(encoded[j+1:j+1+length])
        i = j + 1 + length
    return result`,
    javascript: `function encode(strs) {
  return strs.map(s => s.length + '#' + s).join('');
}

function decode(encoded) {
  const result = [];
  let i = 0;
  while (i < encoded.length) {
    const j = encoded.indexOf('#', i);
    const length = parseInt(encoded.slice(i, j));
    result.push(encoded.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}`,
    java: `public String encode(List<String> strs) {
    StringBuilder sb = new StringBuilder();
    for (String s : strs) sb.append(s.length()).append('#').append(s);
    return sb.toString();
}

public List<String> decode(String encoded) {
    List<String> result = new ArrayList<>();
    int i = 0;
    while (i < encoded.length()) {
        int j = encoded.indexOf('#', i);
        int length = Integer.parseInt(encoded.substring(i, j));
        result.add(encoded.substring(j + 1, j + 1 + length));
        i = j + 1 + length;
    }
    return result;
}`,
  },
  defaultInput: { strs: ['hello', 'world', 'foo#bar', ''] },
  inputFields: [
    { name: 'strs', label: 'Strings Array', type: 'array', defaultValue: ['hello', 'world', 'foo#bar', ''], placeholder: 'hello,world', helperText: 'Array of strings to encode/decode' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (pos: number, encoded: string, decoded: string[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (pos >= 0) highlights[pos] = 'active';
      const labels: Record<number, string> = {};
      strs.forEach((s, i) => { labels[i] = `"${s}"`; });
      return {
        type: 'array',
        array: strs.map((_, i) => i),
        highlights,
        labels,
        auxData: {
          label: 'Encode / Decode',
          entries: [
            { key: 'encoded', value: encoded.slice(0, 50) + (encoded.length > 50 ? '...' : '') },
            { key: 'decoded so far', value: decoded.map(s => `"${s}"`).join(', ') },
          ],
        },
      };
    };

    // Encode
    let encoded = '';
    steps.push({
      line: 1,
      explanation: `Encode ${strs.length} strings using length-prefix format: "len#string".`,
      variables: { strs },
      visualization: makeViz(-1, '', []),
    });

    strs.forEach((s, i) => {
      const token = `${s.length}#${s}`;
      encoded += token;
      steps.push({
        line: 3,
        explanation: `Encode strs[${i}]="${s}": prepend length ${s.length} -> "${token}". Encoded so far: "${encoded}".`,
        variables: { index: i, str: s, token, encoded },
        visualization: makeViz(i, encoded, []),
      });
    });

    steps.push({
      line: 4,
      explanation: `Encoding complete: "${encoded}". Now decode it back.`,
      variables: { encoded },
      visualization: makeViz(-1, encoded, []),
    });

    // Decode
    const decoded: string[] = [];
    let i = 0;
    while (i < encoded.length) {
      const j = encoded.indexOf('#', i);
      const length = parseInt(encoded.slice(i, j));
      const str = encoded.slice(j + 1, j + 1 + length);
      decoded.push(str);
      steps.push({
        line: 11,
        explanation: `Decode: read length=${length} at pos ${i}, '#' at ${j}. Extract "${str}" from [${j + 1}..${j + length}].`,
        variables: { i, j, length, extracted: str },
        visualization: makeViz(decoded.length - 1, encoded, [...decoded]),
      });
      i = j + 1 + length;
    }

    steps.push({
      line: 14,
      explanation: `Decode complete. Recovered: [${decoded.map(s => `"${s}"`).join(', ')}].`,
      variables: { decoded: [...decoded] },
      visualization: makeViz(-1, encoded, decoded),
    });

    return steps;
  },
};

export default encodeAndDecodeStrings;
