import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const encodeDecodeStrings: AlgorithmDefinition = {
  id: 'encode-decode-strings',
  title: 'Encode and Decode Strings',
  leetcodeNumber: 271,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design an algorithm to encode a list of strings to a single string, then decode it back. Use length-prefix encoding: prepend each string with its length and a delimiter (e.g. "4#word") to handle any character in the strings.',
  tags: ['hash map', 'string', 'encoding', 'design'],

  code: {
    pseudocode: `function encode(strs):
  result = ""
  for s in strs:
    result += len(s) + "#" + s
  return result

function decode(s):
  result = []
  i = 0
  while i < len(s):
    j = i
    while s[j] != "#": j++
    length = int(s[i:j])
    result.append(s[j+1 : j+1+length])
    i = j + 1 + length
  return result`,

    python: `def encode(strs: list[str]) -> str:
    return ''.join(f'{len(s)}#{s}' for s in strs)

def decode(s: str) -> list[str]:
    result = []
    i = 0
    while i < len(s):
        j = i
        while s[j] != '#':
            j += 1
        length = int(s[i:j])
        result.append(s[j+1:j+1+length])
        i = j + 1 + length
    return result`,

    javascript: `function encode(strs) {
  return strs.map(s => \`\${s.length}#\${s}\`).join('');
}

function decode(s) {
  const result = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== '#') j++;
    const length = parseInt(s.slice(i, j));
    result.push(s.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}`,

    java: `public String encode(List<String> strs) {
    StringBuilder sb = new StringBuilder();
    for (String s : strs) sb.append(s.length()).append('#').append(s);
    return sb.toString();
}

public List<String> decode(String s) {
    List<String> result = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
        int j = i;
        while (s.charAt(j) != '#') j++;
        int length = Integer.parseInt(s.substring(i, j));
        result.add(s.substring(j + 1, j + 1 + length));
        i = j + 1 + length;
    }
    return result;
}`,
  },

  defaultInput: {
    strs: ['hello', 'world', 'foo', 'bar'],
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Strings to Encode',
      type: 'array',
      defaultValue: ['hello', 'world', 'foo', 'bar'],
      placeholder: 'hello,world,foo,bar',
      helperText: 'Comma-separated strings to encode then decode',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const steps: AlgorithmStep[] = [];

    // Represent as index array for visualization
    const indices = strs.map((_, i) => i);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxLabel: string,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...indices],
      highlights,
      labels,
      auxData: { label: auxLabel, entries },
    });

    steps.push({
      line: 1,
      explanation: `Encode [${strs.map(s => `"${s}"`).join(', ')}] to a single string using length-prefix format.`,
      variables: { strs: [...strs] },
      visualization: makeViz(
        {},
        strs.reduce((acc, s, i) => ({ ...acc, [i]: s }), {}),
        'Strings',
        strs.map((s, i) => ({ key: `[${i}]`, value: `"${s}"` }))
      ),
    });

    // Encode phase
    let encoded = '';
    const encodeParts: { key: string; value: string }[] = [];

    for (let i = 0; i < strs.length; i++) {
      const s = strs[i];
      const token = `${s.length}#${s}`;
      encoded += token;
      encodeParts.push({ key: `"${s}"`, value: `→ "${token}"` });

      steps.push({
        line: 3,
        explanation: `Encode "${s}" as "${token}" (length=${s.length}, delimiter='#', then the string).`,
        variables: { i, str: s, token, encoded },
        visualization: makeViz(
          { [i]: 'active' },
          strs.reduce((acc, str, j) => ({ ...acc, [j]: str }), {}),
          'Encoding Progress',
          [...encodeParts]
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Encoding complete! Result: "${encoded}". Now we'll decode it back.`,
      variables: { encoded },
      visualization: makeViz(
        Object.fromEntries(indices.map((i) => [i, 'found'])),
        strs.reduce((acc, s, i) => ({ ...acc, [i]: s }), {}),
        'Encoded String',
        [{ key: 'encoded', value: `"${encoded}"` }]
      ),
    });

    // Decode phase
    steps.push({
      line: 8,
      explanation: `Decode "${encoded}" back to original strings using the length-prefix format.`,
      variables: { encoded },
      visualization: makeViz(
        {},
        {},
        'Decoding',
        [{ key: 'input', value: `"${encoded}"` }]
      ),
    });

    const decoded: string[] = [];
    let i = 0;

    while (i < encoded.length) {
      let j = i;
      while (encoded[j] !== '#') j++;
      const length = parseInt(encoded.slice(i, j));
      const word = encoded.slice(j + 1, j + 1 + length);
      decoded.push(word);

      steps.push({
        line: 12,
        explanation: `Found '#' at position ${j}. Length = "${encoded.slice(i, j)}" = ${length}. Extract "${word}" from positions ${j + 1} to ${j + length}.`,
        variables: { i, j, length, word, decoded: [...decoded] },
        visualization: makeViz(
          Object.fromEntries(decoded.map((_, k) => [k, 'found'])),
          {},
          'Decoded Words',
          decoded.map((w, k) => ({ key: `[${k}]`, value: `"${w}"` }))
        ),
      });

      i = j + 1 + length;
    }

    steps.push({
      line: 14,
      explanation: `Decode complete! Original strings restored: [${decoded.map(s => `"${s}"`).join(', ')}]. Encode/decode works correctly.`,
      variables: { original: [...strs], decoded: [...decoded], match: JSON.stringify(strs) === JSON.stringify(decoded) },
      visualization: makeViz(
        Object.fromEntries(indices.map((i) => [i, 'sorted'])),
        strs.reduce((acc, s, i) => ({ ...acc, [i]: s }), {}),
        'Round-trip Result',
        decoded.map((w, i) => ({ key: `[${i}]`, value: `"${w}"` }))
      ),
    });

    return steps;
  },
};

export default encodeDecodeStrings;
