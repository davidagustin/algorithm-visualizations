import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const snapshotArrayIi: AlgorithmDefinition = {
  id: 'snapshot-array-ii',
  title: 'Snapshot Array',
  leetcodeNumber: 1146,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Implement a SnapshotArray that supports set(index, val), snap() which takes a snapshot and returns a snap_id, and get(index, snap_id) which returns the value at index at the time of the snapshot with that id. Use copy-on-write with sorted snap IDs per index.',
  tags: ['Hash Map', 'Design', 'Binary Search', 'Array'],
  code: {
    pseudocode: `class SnapshotArray:
  function init(n):
    snapshots = [{0: 0} for each index]
    snapId = 0
  function set(index, val):
    snapshots[index][snapId] = val
  function snap():
    snapId++; return snapId - 1
  function get(index, snap_id):
    // Binary search for largest snap <= snap_id
    return snapshots[index][largest snap <= snap_id]`,
    python: `import bisect

class SnapshotArray:
    def __init__(self, n: int):
        self.snaps = [[[0, 0]] for _ in range(n)]
        self.snap_id = 0

    def set(self, index: int, val: int) -> None:
        if self.snaps[index][-1][0] == self.snap_id:
            self.snaps[index][-1][1] = val
        else:
            self.snaps[index].append([self.snap_id, val])

    def snap(self) -> int:
        self.snap_id += 1
        return self.snap_id - 1

    def get(self, index: int, snap_id: int) -> int:
        snaps = self.snaps[index]
        i = bisect.bisect_right(snaps, [snap_id, float('inf')]) - 1
        return snaps[i][1]`,
    javascript: `class SnapshotArray {
  constructor(n) {
    this.snaps = Array.from({length: n}, () => [[0, 0]]);
    this.snapId = 0;
  }
  set(index, val) {
    const s = this.snaps[index];
    if (s[s.length-1][0] === this.snapId) s[s.length-1][1] = val;
    else s.push([this.snapId, val]);
  }
  snap() { return this.snapId++; }
  get(index, snapId) {
    const s = this.snaps[index];
    let lo = 0, hi = s.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (s[mid][0] <= snapId) lo = mid;
      else hi = mid - 1;
    }
    return s[lo][1];
  }
}`,
    java: `class SnapshotArray {
    private List<int[]>[] snaps;
    private int snapId = 0;
    public SnapshotArray(int n) {
        snaps = new List[n];
        for (int i = 0; i < n; i++) { snaps[i] = new ArrayList<>(); snaps[i].add(new int[]{0, 0}); }
    }
    public void set(int index, int val) {
        List<int[]> s = snaps[index];
        if (s.get(s.size()-1)[0] == snapId) s.get(s.size()-1)[1] = val;
        else s.add(new int[]{snapId, val});
    }
    public int snap() { return snapId++; }
    public int get(int index, int snapId) {
        List<int[]> s = snaps[index];
        int lo = 0, hi = s.size() - 1;
        while (lo < hi) { int mid = (lo + hi + 1) / 2; if (s.get(mid)[0] <= snapId) lo = mid; else hi = mid - 1; }
        return s.get(lo)[1];
    }
}`,
  },
  defaultInput: {
    n: 3,
    operations: [['set', 0, 5], ['snap'], ['set', 0, 6], ['get', 0, 0], ['get', 0, 1]],
  },
  inputFields: [
    { name: 'n', label: 'Array Length', type: 'number', defaultValue: 3 },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'set 0 5, snap, set 0 6, get 0 0, get 0 1',
      placeholder: 'set 0 5, snap, get 0 0',
      helperText: 'Comma-separated: "set index val", "snap", "get index snap_id"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = (input.n as number) || 3;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts.length === 3) return [parts[0], Number(parts[1]), Number(parts[2])];
        if (parts.length === 2) return [parts[0], Number(parts[1])];
        return [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const current = new Array(n).fill(0);
    const snapshots: number[][] = [];
    let snapId = 0;

    function makeViz(activeIdx: number, label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      current.forEach((_, i) => {
        highlights[i] = i === activeIdx ? 'active' : 'default';
        lbls[i] = `[${i}]`;
      });
      return {
        type: 'array',
        array: [...current],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Snapshot Array',
          entries: [
            { key: 'Action', value: label },
            { key: 'Current snapId', value: `${snapId}` },
            { key: 'Snapshots taken', value: `${snapshots.length}` },
            ...snapshots.map((s, i) => ({ key: `snap ${i}`, value: `[${s.join(', ')}]` })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize SnapshotArray of size ${n}. All values start at 0.`, variables: { n }, visualization: makeViz(-1, 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'set') {
        const index = Number(op[1]);
        const val = Number(op[2]);
        current[index] = val;
        steps.push({ line: 5, explanation: `set(${index}, ${val}): Set index ${index} to ${val} in current state (snap_id=${snapId}).`, variables: { index, val, snapId }, visualization: makeViz(index, `set(${index},${val})`) });
      } else if (opType === 'snap') {
        snapshots.push([...current]);
        const returnedId = snapId;
        snapId++;
        steps.push({ line: 7, explanation: `snap(): Take snapshot ${returnedId}. Array state: [${current.join(', ')}]. Return ${returnedId}.`, variables: { snapId: returnedId }, visualization: makeViz(-1, `snap() -> ${returnedId}`) });
      } else if (opType === 'get') {
        const index = Number(op[1]);
        const sid = Number(op[2]);
        const result = sid < snapshots.length ? snapshots[sid][index] : current[index];
        steps.push({ line: 9, explanation: `get(${index}, ${sid}): Return value at index ${index} from snapshot ${sid} = ${result}.`, variables: { index, sid, result }, visualization: makeViz(index, `get(${index},${sid}) -> ${result}`) });
      }
    }

    steps.push({ line: 10, explanation: `All operations complete. Total snapshots: ${snapshots.length}.`, variables: { snapshots: snapshots.length }, visualization: makeViz(-1, 'Complete') });

    return steps;
  },
};

export default snapshotArrayIi;
