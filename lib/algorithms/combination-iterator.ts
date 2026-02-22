import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const combinationIterator: AlgorithmDefinition = {
  id: 'combination-iterator',
  title: 'Iterator for Combinations',
  leetcodeNumber: 1286,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Design an iterator that returns combinations of k characters from a string of lowercase letters in lexicographic order. Pre-generates all combinations in sorted order using backtracking, then serves them one by one via next() calls. Demonstrates how backtracking can power iterator-based APIs.',
  tags: ['backtracking', 'string', 'iterator', 'combination', 'design'],

  code: {
    pseudocode: `class CombinationIterator:
  constructor(characters, combinationLength):
    combinations = []
    generateAll(characters, combinationLength, 0, "", combinations)
    index = 0

  function next():
    return combinations[index++]

  function hasNext():
    return index < length(combinations)

function generateAll(chars, k, start, current, combinations):
  if length(current) == k:
    combinations.push(current)
    return
  for i from start to len(chars)-1:
    generateAll(chars, k, i+1, current + chars[i], combinations)`,

    python: `class CombinationIterator:
    def __init__(self, characters: str, combinationLength: int):
        self.combinations = []
        self.index = 0
        self._generate(characters, combinationLength, 0, '')

    def _generate(self, chars, k, start, current):
        if len(current) == k:
            self.combinations.append(current)
            return
        for i in range(start, len(chars)):
            self._generate(chars, k, i + 1, current + chars[i])

    def next(self) -> str:
        result = self.combinations[self.index]
        self.index += 1
        return result

    def hasNext(self) -> bool:
        return self.index < len(self.combinations)`,

    javascript: `class CombinationIterator {
  constructor(characters, combinationLength) {
    this.combinations = [];
    this.index = 0;
    this._generate(characters, combinationLength, 0, '');
  }
  _generate(chars, k, start, current) {
    if (current.length === k) {
      this.combinations.push(current);
      return;
    }
    for (let i = start; i < chars.length; i++) {
      this._generate(chars, k, i + 1, current + chars[i]);
    }
  }
  next() { return this.combinations[this.index++]; }
  hasNext() { return this.index < this.combinations.length; }
}`,

    java: `class CombinationIterator {
    private List<String> combinations = new ArrayList<>();
    private int index = 0;
    public CombinationIterator(String characters, int combinationLength) {
        generate(characters, combinationLength, 0, new StringBuilder());
    }
    private void generate(String chars, int k, int start, StringBuilder current) {
        if (current.length() == k) { combinations.add(current.toString()); return; }
        for (int i = start; i < chars.length(); i++) {
            current.append(chars.charAt(i));
            generate(chars, k, i + 1, current);
            current.deleteCharAt(current.length() - 1);
        }
    }
    public String next() { return combinations.get(index++); }
    public boolean hasNext() { return index < combinations.size(); }
}`,
  },

  defaultInput: {
    characters: 'abc',
    combinationLength: 2,
  },

  inputFields: [
    {
      name: 'characters',
      label: 'Characters',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'Sorted string of lowercase letters',
    },
    {
      name: 'combinationLength',
      label: 'Combination Length (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Length of each combination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const characters = input.characters as string;
    const k = input.combinationLength as number;
    const steps: AlgorithmStep[] = [];
    const combinations: string[] = [];

    steps.push({
      line: 1,
      explanation: `Creating CombinationIterator for characters "${characters}" with length k=${k}. Will pre-generate all C(${characters.length},${k}) combinations in lexicographic order.`,
      variables: { characters, k, totalCombinations: `C(${characters.length},${k})` },
      visualization: {
        type: 'array',
        array: characters.split('').map((_, i) => i),
        highlights: {},
        labels: characters.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function generate(start: number, current: string) {
      if (current.length === k) {
        combinations.push(current);

        steps.push({
          line: 15,
          explanation: `Combination "${current}" generated (#${combinations.length}). All characters chosen in order.`,
          variables: { combination: current, index: combinations.length - 1 },
          visualization: {
            type: 'array',
            array: characters.split('').map((_, i) => i),
            highlights: characters.split('').reduce((acc, c, i) => ({
              ...acc,
              [i]: current.includes(c) ? 'found' : 'default',
            }), {}),
            labels: characters.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
          },
        });
        return;
      }

      for (let i = start; i < characters.length; i++) {
        const newCurrent = current + characters[i];

        steps.push({
          line: 16,
          explanation: `Build combination: "${current}" + "${characters[i]}" -> "${newCurrent}". Need ${k - newCurrent.length} more chars.`,
          variables: { current, adding: characters[i], newCurrent, remaining: k - newCurrent.length },
          visualization: {
            type: 'array',
            array: characters.split('').map((_, j) => j),
            highlights: { [i]: 'active' },
            labels: characters.split('').reduce((acc, c, j) => ({ ...acc, [j]: j < i ? `(skip)${c}` : j === i ? `+${c}` : c }), {} as Record<number, string>),
          },
        });

        generate(i + 1, newCurrent);
      }
    }

    generate(0, '');

    steps.push({
      line: 2,
      explanation: `Iterator ready! Generated ${combinations.length} combinations: [${combinations.map(c => `"${c}"`).join(', ')}]. Now simulating next() calls.`,
      variables: { totalCombinations: combinations.length, combinations },
      visualization: {
        type: 'array',
        array: combinations.map((_, i) => i + 1),
        highlights: combinations.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: combinations.reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    let iterIndex = 0;
    while (iterIndex < combinations.length) {
      const combo = combinations[iterIndex];
      steps.push({
        line: 7,
        explanation: `next() call #${iterIndex + 1}: returns "${combo}". hasNext() = ${iterIndex + 1 < combinations.length}.`,
        variables: { returned: combo, callNumber: iterIndex + 1, hasNext: iterIndex + 1 < combinations.length, iteratorIndex: iterIndex + 1 },
        visualization: {
          type: 'array',
          array: combinations.map((_, i) => i + 1),
          highlights: combinations.reduce((acc, _, i) => ({
            ...acc,
            [i]: i < iterIndex ? 'mismatch' : i === iterIndex ? 'active' : 'sorted',
          }), {}),
          labels: combinations.reduce((acc, c, i) => ({ ...acc, [i]: i < iterIndex ? `(used)${c}` : i === iterIndex ? `-> ${c}` : c }), {} as Record<number, string>),
        },
      });
      iterIndex++;
    }

    steps.push({
      line: 10,
      explanation: `hasNext() = false. All ${combinations.length} combinations have been returned by the iterator.`,
      variables: { hasNext: false, totalReturned: combinations.length },
      visualization: {
        type: 'array',
        array: combinations.map((_, i) => i + 1),
        highlights: combinations.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: combinations.reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default combinationIterator;
