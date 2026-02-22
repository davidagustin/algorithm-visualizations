import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const stringCompression: AlgorithmDefinition = {
  id: 'string-compression',
  title: 'String Compression',
  leetcodeNumber: 443,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an array of characters, compress it in-place using run-length encoding. For each group of consecutive repeating characters, write the character and its count (if count > 1). Modify the array in-place and return the new length.',
  tags: ['two pointers', 'string', 'in-place', 'run-length encoding'],

  code: {
    pseudocode: `function compress(chars):
  write = 0
  read = 0
  while read < len(chars):
    char = chars[read]
    count = 0
    while read < len(chars) and chars[read] == char:
      count++
      read++
    chars[write++] = char
    if count > 1:
      for digit in str(count):
        chars[write++] = digit
  return write`,

    python: `def compress(chars: list[str]) -> int:
    write = read = 0
    while read < len(chars):
        char = chars[read]
        count = 0
        while read < len(chars) and chars[read] == char:
            count += 1
            read += 1
        chars[write] = char
        write += 1
        if count > 1:
            for d in str(count):
                chars[write] = d
                write += 1
    return write`,

    javascript: `function compress(chars) {
  let write = 0, read = 0;
  while (read < chars.length) {
    const char = chars[read];
    let count = 0;
    while (read < chars.length && chars[read] === char) {
      count++; read++;
    }
    chars[write++] = char;
    if (count > 1) {
      for (const d of String(count)) chars[write++] = d;
    }
  }
  return write;
}`,

    java: `public int compress(char[] chars) {
    int write = 0, read = 0;
    while (read < chars.length) {
        char c = chars[read];
        int count = 0;
        while (read < chars.length && chars[read] == c) { count++; read++; }
        chars[write++] = c;
        if (count > 1) {
            for (char d : String.valueOf(count).toCharArray())
                chars[write++] = d;
        }
    }
    return write;
}`,
  },

  defaultInput: {
    chars: 'aabcccccaa',
  },

  inputFields: [
    {
      name: 'chars',
      label: 'Characters',
      type: 'string',
      defaultValue: 'aabcccccaa',
      placeholder: 'aabcccccaa',
      helperText: 'String of characters to compress',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const charsStr = input.chars as string;
    const chars = charsStr.split('');
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: ["${chars.join('","')}"] (length=${chars.length}). Use write and read pointers for in-place compression.`,
      variables: { input: chars.join(''), write: 0, read: 0 },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: { 0: 'pointer' },
        labels: { 0: 'W/R' },
      },
    });

    let write = 0;
    let read = 0;
    const arr = [...chars];

    while (read < arr.length) {
      const char = arr[read];
      let count = 0;
      const groupStart = read;

      while (read < arr.length && arr[read] === char) {
        count++;
        read++;
      }

      steps.push({
        line: 6,
        explanation: `Group: "${char}" appears ${count} time(s) starting at index ${groupStart}. Write "${char}" at position ${write}.`,
        variables: { char, count, groupStart, groupEnd: read - 1, write },
        visualization: {
          type: 'array',
          array: arr as unknown as number[],
          highlights: {
            ...Object.fromEntries(Array.from({ length: count }, (_, j) => [groupStart + j, 'active'])),
            [write]: 'pointer',
          },
          labels: {
            [groupStart]: `"${char}"x${count}`,
            [write]: 'W',
          },
        },
      });

      arr[write] = char;
      write++;

      if (count > 1) {
        for (const digit of String(count)) {
          arr[write] = digit;
          steps.push({
            line: 11,
            explanation: `Count ${count} > 1: write digit "${digit}" at position ${write}.`,
            variables: { char, count, digit, write },
            visualization: {
              type: 'array',
              array: arr as unknown as number[],
              highlights: {
                [write]: 'comparing',
                ...Object.fromEntries(Array.from({ length: write }, (_, j) => [j, 'sorted'])),
              },
              labels: {
                [write]: digit,
              },
            },
          });
          write++;
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Compression complete. New length = ${write}. Compressed: ["${arr.slice(0, write).join('","')}"]`,
      variables: { newLength: write, compressed: arr.slice(0, write).join('') },
      visualization: {
        type: 'array',
        array: arr as unknown as number[],
        highlights: {
          ...Object.fromEntries(Array.from({ length: write }, (_, j) => [j, 'found'])),
          ...Object.fromEntries(Array.from({ length: arr.length - write }, (_, j) => [write + j, 'mismatch'])),
        },
        labels: {
          0: 'start',
          [write - 1]: `end(${write})`,
        },
      },
    });

    return steps;
  },
};

export default stringCompression;
