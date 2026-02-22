import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const utf8Validation: AlgorithmDefinition = {
  id: 'utf-8-validation',
  title: 'UTF-8 Validation',
  leetcodeNumber: 393,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given an integer array representing bytes of data, determine whether it is a valid UTF-8 encoding. A UTF-8 character can be 1-4 bytes. Leading byte patterns: 0xxxxxxx (1-byte), 110xxxxx (2-byte), 1110xxxx (3-byte), 11110xxx (4-byte). Continuation bytes must match 10xxxxxx.',
  tags: ['bit manipulation', 'array'],

  code: {
    pseudocode: `function validUtf8(data):
  i = 0
  while i < len(data):
    byte = data[i] & 0xFF
    if byte >> 7 == 0: count = 0
    elif byte >> 5 == 0b110: count = 1
    elif byte >> 4 == 0b1110: count = 2
    elif byte >> 3 == 0b11110: count = 3
    else: return false
    for j in 1..count:
      if i+j >= len or data[i+j] >> 6 != 0b10: return false
    i += count + 1
  return true`,

    python: `def validUtf8(data):
    i = 0
    while i < len(data):
        b = data[i] & 0xFF
        if b >> 7 == 0: cnt = 0
        elif b >> 5 == 0b110: cnt = 1
        elif b >> 4 == 0b1110: cnt = 2
        elif b >> 3 == 0b11110: cnt = 3
        else: return False
        for j in range(1, cnt+1):
            if i+j >= len(data) or (data[i+j] & 0xFF) >> 6 != 0b10:
                return False
        i += cnt + 1
    return True`,

    javascript: `function validUtf8(data) {
  let i = 0;
  while (i < data.length) {
    const b = data[i] & 0xFF;
    let cnt;
    if (b >> 7 === 0) cnt = 0;
    else if (b >> 5 === 0b110) cnt = 1;
    else if (b >> 4 === 0b1110) cnt = 2;
    else if (b >> 3 === 0b11110) cnt = 3;
    else return false;
    for (let j = 1; j <= cnt; j++) {
      if (i+j >= data.length || (data[i+j] & 0xFF) >> 6 !== 0b10) return false;
    }
    i += cnt + 1;
  }
  return true;
}`,

    java: `public boolean validUtf8(int[] data) {
    int i = 0;
    while (i < data.length) {
        int b = data[i] & 0xFF;
        int cnt;
        if (b >> 7 == 0) cnt = 0;
        else if (b >> 5 == 0b110) cnt = 1;
        else if (b >> 4 == 0b1110) cnt = 2;
        else if (b >> 3 == 0b11110) cnt = 3;
        else return false;
        for (int j = 1; j <= cnt; j++) {
            if (i+j >= data.length || (data[i+j] & 0xFF) >> 6 != 0b10) return false;
        }
        i += cnt + 1;
    }
    return true;
}`,
  },

  defaultInput: {
    data: [197, 130, 1],
  },

  inputFields: [
    {
      name: 'data',
      label: 'Data Bytes',
      type: 'array',
      defaultValue: [197, 130, 1],
      placeholder: '197,130,1',
      helperText: 'Integer array representing bytes (0-255)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const data = input.data as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...data],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Validate UTF-8 encoding. Each byte determines character width by its leading bits.',
      variables: { i: 0 },
      visualization: makeViz({}, {}),
    });

    let i = 0;
    let valid = true;
    while (i < data.length) {
      const b = data[i] & 0xFF;
      let cnt: number;
      let byteType: string;

      if (b >> 7 === 0) { cnt = 0; byteType = '1-byte (0xxxxxxx)'; }
      else if (b >> 5 === 0b110) { cnt = 1; byteType = '2-byte leader (110xxxxx)'; }
      else if (b >> 4 === 0b1110) { cnt = 2; byteType = '3-byte leader (1110xxxx)'; }
      else if (b >> 3 === 0b11110) { cnt = 3; byteType = '4-byte leader (11110xxx)'; }
      else {
        steps.push({
          line: 8,
          explanation: `data[${i}] = ${b} (${b.toString(2).padStart(8,'0')}) has invalid leading bits. Return false.`,
          variables: { i, byte: b, valid: false },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'INVALID' }),
        });
        valid = false;
        break;
      }

      steps.push({
        line: 3,
        explanation: `data[${i}] = ${b} (${b.toString(2).padStart(8,'0')}) is a ${byteType}. Expect ${cnt} continuation byte(s).`,
        variables: { i, byte: b, continuationNeeded: cnt, byteType },
        visualization: makeViz({ [i]: 'active' }, { [i]: `lead` }),
      });

      let contValid = true;
      for (let j = 1; j <= cnt; j++) {
        if (i + j >= data.length || (data[i + j] & 0xFF) >> 6 !== 0b10) {
          steps.push({
            line: 10,
            explanation: `Expected continuation byte at index ${i + j} (must start with 10xxxxxx). Validation fails.`,
            variables: { i: i + j, byte: data[i + j] ?? 'missing' },
            visualization: makeViz({ [i]: 'active', [i + j]: 'mismatch' }, { [i]: 'lead', [i + j]: 'BAD' }),
          });
          contValid = false;
          valid = false;
          break;
        }
        const cb = data[i + j] & 0xFF;
        steps.push({
          line: 9,
          explanation: `data[${i + j}] = ${cb} (${cb.toString(2).padStart(8,'0')}) starts with 10. Valid continuation byte.`,
          variables: { index: i + j, byte: cb },
          visualization: makeViz({ [i]: 'active', [i + j]: 'found' }, { [i]: 'lead', [i + j]: 'cont' }),
        });
      }
      if (!contValid) break;
      i += cnt + 1;
    }

    steps.push({
      line: 11,
      explanation: `Validation complete. Result: ${valid}.`,
      variables: { result: valid },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default utf8Validation;
