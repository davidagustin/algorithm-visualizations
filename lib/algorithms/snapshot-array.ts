import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const snapshotArray: AlgorithmDefinition = {
  id: 'snapshot-array',
  title: 'Snapshot Array',
  leetcodeNumber: 1146,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Design a SnapshotArray that supports set(index, val), snap(), and get(index, snap_id). Each index stores a list of (snap_id, val) pairs. For get queries, binary search the snap history to find the latest value at or before the given snap_id.',
  tags: ['binary search', 'design', 'array'],

  code: {
    pseudocode: `class SnapshotArray:
  init(length):
    data = [[(0,0)] for _ in range(length)]
    snap_id = 0
  set(index, val):
    data[index].append((snap_id, val))
  snap():
    snap_id++
    return snap_id - 1
  get(index, snap_id):
    binary search data[index] for largest snap_id <= given snap_id
    return that value`,
    python: `import bisect
class SnapshotArray:
    def __init__(self, length: int):
        self.data = [[[0, 0]] for _ in range(length)]
        self.snap_id = 0

    def set(self, index: int, val: int) -> None:
        self.data[index].append([self.snap_id, val])

    def snap(self) -> int:
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index: int, snap_id: int) -> int:
        hist = self.data[index]
        pos = bisect.bisect_right(hist, [snap_id, float('inf')]) - 1
        return hist[pos][1]`,
    javascript: `class SnapshotArray {
  constructor(length) {
    this.data = Array.from({length}, () => [[0, 0]]);
    this.snapId = 0;
  }
  set(index, val) { this.data[index].push([this.snapId, val]); }
  snap() { return this.snapId++; }
  get(index, snapId) {
    const hist = this.data[index];
    let lo = 0, hi = hist.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (hist[mid][0] <= snapId) lo = mid;
      else hi = mid - 1;
    }
    return hist[lo][1];
  }
}`,
    java: `class SnapshotArray {
    List<int[]>[] data;
    int snapId = 0;
    public SnapshotArray(int length) {
        data = new List[length];
        for (int i = 0; i < length; i++) {
            data[i] = new ArrayList<>();
            data[i].add(new int[]{0, 0});
        }
    }
    public void set(int index, int val) {
        data[index].add(new int[]{snapId, val});
    }
    public int snap() { return snapId++; }
    public int get(int index, int snap_id) {
        List<int[]> hist = data[index];
        int lo = 0, hi = hist.size() - 1;
        while (lo < hi) {
            int mid = (lo + hi + 1) / 2;
            if (hist.get(mid)[0] <= snap_id) lo = mid;
            else hi = mid - 1;
        }
        return hist.get(lo)[1];
    }
}`,
  },

  defaultInput: {
    length: 3,
    operations: [
      { op: 'set', index: 0, val: 5 },
      { op: 'snap' },
      { op: 'set', index: 0, val: 10 },
      { op: 'get', index: 0, snapId: 0 },
      { op: 'get', index: 0, snapId: 1 },
    ],
  },

  inputFields: [
    {
      name: 'length',
      label: 'Array Length',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of the snapshot array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const length = input.length as number;
    const steps: AlgorithmStep[] = [];

    const data: Array<Array<[number, number]>> = Array.from({ length }, () => [[0, 0]]);
    let snapId = 0;
    const currentVals = new Array(length).fill(0);

    steps.push({
      line: 1,
      explanation: `Initialize SnapshotArray of length ${length}. Each index starts with snap_id=0, val=0.`,
      variables: { length, snapId },
      visualization: {
        type: 'array',
        array: [...currentVals],
        highlights: {},
        labels: currentVals.reduce((acc, _, i) => ({ ...acc, [i]: `idx${i}` }), {}),
      },
    });

    // Simulate: set idx=0 to 5
    const setIdx = 0;
    const setVal = 5;
    data[setIdx].push([snapId, setVal]);
    currentVals[setIdx] = setVal;

    steps.push({
      line: 4,
      explanation: `set(${setIdx}, ${setVal}): Record [snap_id=${snapId}, val=${setVal}] at index ${setIdx}.`,
      variables: { index: setIdx, val: setVal, snapId },
      visualization: {
        type: 'array',
        array: [...currentVals],
        highlights: { [setIdx]: 'active' },
        labels: { [setIdx]: `val=${setVal}` },
      },
    });

    // Snap
    const snapResult = snapId;
    snapId++;

    steps.push({
      line: 6,
      explanation: `snap(): Returns snap_id=${snapResult}. Increment snap_id to ${snapId}.`,
      variables: { returned: snapResult, snapId },
      visualization: {
        type: 'array',
        array: [...currentVals],
        highlights: currentVals.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: { 0: `snap ${snapResult}` },
      },
    });

    // set idx=0 to 10
    const setVal2 = 10;
    data[setIdx].push([snapId, setVal2]);
    currentVals[setIdx] = setVal2;

    steps.push({
      line: 4,
      explanation: `set(${setIdx}, ${setVal2}): Record [snap_id=${snapId}, val=${setVal2}] at index ${setIdx}.`,
      variables: { index: setIdx, val: setVal2, snapId },
      visualization: {
        type: 'array',
        array: [...currentVals],
        highlights: { [setIdx]: 'active' },
        labels: { [setIdx]: `val=${setVal2}` },
      },
    });

    // get(0, snap_id=0)
    const queryIdx = 0;
    const querySnap = 0;
    const hist = data[queryIdx];

    steps.push({
      line: 8,
      explanation: `get(${queryIdx}, ${querySnap}): Binary search history of index ${queryIdx}: ${JSON.stringify(hist)} for snap_id <= ${querySnap}.`,
      variables: { index: queryIdx, snap_id: querySnap, history: JSON.stringify(hist) },
      visualization: {
        type: 'array',
        array: hist.map(h => h[1]),
        highlights: {},
        labels: hist.reduce((acc, h, i) => ({ ...acc, [i]: `s${h[0]}` }), {}),
      },
    });

    let lo = 0;
    let hi = hist.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (hist[mid][0] <= querySnap) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Found: hist[${lo}] = [snap_id=${hist[lo][0]}, val=${hist[lo][1]}]. get(${queryIdx}, ${querySnap}) = ${hist[lo][1]}.`,
      variables: { result: hist[lo][1], snapUsed: hist[lo][0] },
      visualization: {
        type: 'array',
        array: hist.map(h => h[1]),
        highlights: { [lo]: 'found' },
        labels: { [lo]: `result=${hist[lo][1]}` },
      },
    });

    return steps;
  },
};

export default snapshotArray;
