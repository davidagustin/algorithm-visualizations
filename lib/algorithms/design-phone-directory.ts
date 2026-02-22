import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designPhoneDirectory: AlgorithmDefinition = {
  id: 'design-phone-directory',
  title: 'Design Phone Directory',
  leetcodeNumber: 379,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a Phone Directory which supports operations to get an available number, check if a number is available, and release a number. Use a set to track available numbers for O(1) operations.',
  tags: ['Hash Map', 'Design', 'Queue'],
  code: {
    pseudocode: `class PhoneDirectory:
  function init(maxNumbers):
    this.available = set of {0, 1, ..., maxNumbers-1}
    this.used = empty set
  function get():
    if available is empty: return -1
    num = any number from available
    available.remove(num); used.add(num)
    return num
  function check(number):
    return number in available
  function release(number):
    if number in used:
      used.remove(number); available.add(number)`,
    python: `class PhoneDirectory:
    def __init__(self, maxNumbers: int):
        self.available = set(range(maxNumbers))
        self.maxNumbers = maxNumbers

    def get(self) -> int:
        if not self.available: return -1
        num = next(iter(self.available))
        self.available.remove(num)
        return num

    def check(self, number: int) -> bool:
        return number in self.available

    def release(self, number: int) -> None:
        if 0 <= number < self.maxNumbers:
            self.available.add(number)`,
    javascript: `class PhoneDirectory {
  constructor(maxNumbers) {
    this.available = new Set([...Array(maxNumbers).keys()]);
    this.maxNumbers = maxNumbers;
  }
  get() {
    if (!this.available.size) return -1;
    const num = this.available.values().next().value;
    this.available.delete(num);
    return num;
  }
  check(number) { return this.available.has(number); }
  release(number) {
    if (number >= 0 && number < this.maxNumbers)
      this.available.add(number);
  }
}`,
    java: `class PhoneDirectory {
    private Set<Integer> available;
    private int max;
    public PhoneDirectory(int maxNumbers) {
        max = maxNumbers;
        available = new HashSet<>();
        for (int i = 0; i < maxNumbers; i++) available.add(i);
    }
    public int get() {
        if (available.isEmpty()) return -1;
        int num = available.iterator().next();
        available.remove(num); return num;
    }
    public boolean check(int number) { return available.contains(number); }
    public void release(int number) { if (number >= 0 && number < max) available.add(number); }
}`,
  },
  defaultInput: {
    maxNumbers: 3,
    operations: [['get'], ['get'], ['check', 2], ['get'], ['check', 2], ['release', 2], ['check', 2]],
  },
  inputFields: [
    {
      name: 'maxNumbers',
      label: 'Max Numbers',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'get, get, check 2, get, check 2, release 2, check 2',
      placeholder: 'get, check 1, release 1',
      helperText: 'Comma-separated: "get", "check n", "release n"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maxNumbers = (input.maxNumbers as number) || 3;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return parts.length > 1 ? [parts[0], Number(parts[1])] : [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const available = new Set<number>(Array.from({ length: maxNumbers }, (_, i) => i));

    function makeViz(activeNum: number, color: string, label: string): ArrayVisualization {
      const arr = Array.from({ length: maxNumbers }, (_, i) => i);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      arr.forEach((n, i) => {
        highlights[i] = n === activeNum ? color : available.has(n) ? 'found' : 'visited';
        lbls[i] = available.has(n) ? 'free' : 'used';
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Phone Directory',
          entries: [
            { key: 'Action', value: label },
            { key: 'Available', value: Array.from(available).join(', ') || 'none' },
            { key: 'Used', value: Array.from({ length: maxNumbers }, (_, i) => i).filter(n => !available.has(n)).join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize Phone Directory with ${maxNumbers} numbers (0 to ${maxNumbers - 1}).`, variables: { maxNumbers, available: Array.from(available) }, visualization: makeViz(-1, 'default', 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'get') {
        if (available.size === 0) {
          steps.push({ line: 6, explanation: 'get(): No available numbers. Return -1.', variables: { result: -1 }, visualization: makeViz(-1, 'mismatch', 'get() -> -1') });
        } else {
          const num = available.values().next().value!;
          available.delete(num);
          steps.push({ line: 7, explanation: `get(): Assign number ${num}. Remaining available: ${available.size}.`, variables: { num, availableCount: available.size }, visualization: makeViz(num, 'active', `get() -> ${num}`) });
        }
      } else if (opType === 'check') {
        const number = Number(op[1]);
        const result = available.has(number);
        steps.push({ line: 10, explanation: `check(${number}): Number ${number} is ${result ? 'available' : 'in use'}. Return ${result}.`, variables: { number, result }, visualization: makeViz(number, result ? 'found' : 'mismatch', `check(${number}) -> ${result}`) });
      } else if (opType === 'release') {
        const number = Number(op[1]);
        available.add(number);
        steps.push({ line: 12, explanation: `release(${number}): Number ${number} returned to available pool.`, variables: { number, availableCount: available.size }, visualization: makeViz(number, 'active', `release(${number})`) });
      }
    }

    steps.push({ line: 13, explanation: `All operations complete. Available numbers: ${available.size}.`, variables: { availableCount: available.size }, visualization: makeViz(-1, 'default', 'Complete') });

    return steps;
  },
};

export default designPhoneDirectory;
