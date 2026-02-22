import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designOrderedStream: AlgorithmDefinition = {
  id: 'design-ordered-stream',
  title: 'Design an Ordered Stream',
  leetcodeNumber: 1656,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design an ordered stream of n items. Each item has an id (1-indexed) and a value. When inserting at id i, store the value. Then advance a pointer ptr starting at 1: while data[ptr] is filled, collect it and move ptr forward. Return the collected chunk. Items arrive out of order but output is always in order.',
  tags: ['design', 'array', 'simulation', 'stream'],

  code: {
    pseudocode: `class OrderedStream:
  data = array of size n+1 (0-indexed, use 1..n)
  ptr = 1

  insert(idKey, value):
    data[idKey] = value
    chunk = []
    while ptr <= n and data[ptr] is not null:
      chunk.append(data[ptr])
      ptr += 1
    return chunk`,

    python: `class OrderedStream:
    def __init__(self, n: int):
        self.data = [None] * (n + 1)
        self.ptr = 1
        self.n = n

    def insert(self, idKey: int, value: str) -> list[str]:
        self.data[idKey] = value
        chunk = []
        while self.ptr <= self.n and self.data[self.ptr] is not None:
            chunk.append(self.data[self.ptr])
            self.ptr += 1
        return chunk`,

    javascript: `class OrderedStream {
  constructor(n) {
    this.data = new Array(n + 1).fill(null);
    this.ptr = 1;
    this.n = n;
  }

  insert(idKey, value) {
    this.data[idKey] = value;
    const chunk = [];
    while (this.ptr <= this.n && this.data[this.ptr] !== null) {
      chunk.push(this.data[this.ptr]);
      this.ptr++;
    }
    return chunk;
  }
}`,

    java: `class OrderedStream {
    String[] data;
    int ptr = 1;
    int n;

    public OrderedStream(int n) {
        this.n = n;
        data = new String[n + 1];
    }

    public List<String> insert(int idKey, String value) {
        data[idKey] = value;
        List<String> chunk = new ArrayList<>();
        while (ptr <= n && data[ptr] != null) {
            chunk.add(data[ptr++]);
        }
        return chunk;
    }
}`,
  },

  defaultInput: {
    nums: [5, 3, 1, 4, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Insertion Order (by id)',
      type: 'array',
      defaultValue: [5, 3, 1, 4, 2],
      placeholder: '5,3,1,4,2',
      helperText: 'Order of id keys being inserted (1-indexed, values will be letters a-z)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const insertOrder = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = insertOrder.length;
    const data: (string | null)[] = new Array(n + 1).fill(null);
    let ptr = 1;
    const values = 'abcdefghijklmnopqrstuvwxyz';

    steps.push({
      line: 1,
      explanation: `Initialize OrderedStream of size ${n}. Data array has ${n} slots (indices 1..${n}). Pointer starts at 1.`,
      variables: { n, ptr, dataFilled: 0 },
      visualization: {
        type: 'array',
        array: new Array(n).fill(0),
        highlights: { 0: 'pointer' },
        labels: { 0: 'ptr=1' },
      },
    });

    for (let step = 0; step < insertOrder.length; step++) {
      const idKey = insertOrder[step];
      const value = values[idKey - 1];
      data[idKey] = value;

      steps.push({
        line: 4,
        explanation: `insert(id=${idKey}, value="${value}"): Store "${value}" at data[${idKey}]. Now check if pointer can advance.`,
        variables: { idKey, value, ptrBefore: ptr },
        visualization: {
          type: 'array',
          array: data.slice(1).map((v, i) => (v !== null ? i + 1 : 0)),
          highlights: { [idKey - 1]: 'active', [ptr - 1]: 'pointer' },
          labels: {
            [idKey - 1]: `"${value}"`,
            [ptr - 1]: `ptr=${ptr}`,
          },
        },
      });

      const chunk: string[] = [];
      while (ptr <= n && data[ptr] !== null) {
        chunk.push(data[ptr]!);
        ptr++;
      }

      if (chunk.length > 0) {
        steps.push({
          line: 6,
          explanation: `Pointer advanced! Collected chunk: [${chunk.map(c => '"' + c + '"').join(', ')}]. Pointer now at ${ptr}. Consecutive filled slots from old ptr position.`,
          variables: { chunk: chunk.join(', '), newPtr: ptr, chunkSize: chunk.length },
          visualization: {
            type: 'array',
            array: data.slice(1).map((v, i) => (v !== null ? i + 1 : 0)),
            highlights: {
              ...chunk.reduce((acc: Record<number, string>, _, i) => {
                const startIdx = ptr - chunk.length - 1 + i;
                acc[startIdx] = 'found';
                return acc;
              }, {}),
              [ptr - 1]: 'pointer',
            },
            labels: {
              [ptr - chunk.length - 1]: 'chunk start',
              ...(ptr <= n ? { [ptr - 1]: `ptr=${ptr}` } : {}),
            },
          },
        });
      } else {
        steps.push({
          line: 9,
          explanation: `Pointer stays at ${ptr} (data[${ptr}] is empty). Return empty chunk - waiting for id ${ptr} to be inserted first.`,
          variables: { ptr, waitingFor: ptr, chunkReturned: '[]' },
          visualization: {
            type: 'array',
            array: data.slice(1).map((v, i) => (v !== null ? i + 1 : 0)),
            highlights: { [ptr - 1]: 'comparing' },
            labels: { [ptr - 1]: `wait id=${ptr}` },
          },
        });
      }
    }

    return steps;
  },
};

export default designOrderedStream;
