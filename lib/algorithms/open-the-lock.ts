import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const openTheLock: AlgorithmDefinition = {
  id: 'open-the-lock',
  title: 'Open the Lock',
  leetcodeNumber: 752,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A lock has 4 wheels each with digits 0-9. Starting at "0000", find the minimum number of turns to reach the target, avoiding deadend combinations. Model as BFS on a graph where each node is a 4-digit string and edges are single-wheel turns (+1/-1).',
  tags: ['Graph', 'BFS', 'Hash Set'],
  code: {
    pseudocode: `function openLock(deadends, target):
  dead = set(deadends)
  if "0000" in dead: return -1
  queue = deque([("0000", 0)])
  visited = {"0000"}
  while queue:
    combo, turns = queue.popleft()
    if combo == target: return turns
    for i in 0..3:
      for d in [-1, +1]:
        newDigit = (int(combo[i]) + d) % 10
        newCombo = combo[:i] + str(newDigit) + combo[i+1:]
        if newCombo not in visited and newCombo not in dead:
          visited.add(newCombo)
          queue.append((newCombo, turns+1))
  return -1`,
    python: `def openLock(deadends, target):
    dead = set(deadends)
    if "0000" in dead: return -1
    queue = deque([("0000", 0)])
    visited = {"0000"}
    while queue:
        combo, turns = queue.popleft()
        if combo == target: return turns
        for i in range(4):
            for d in [-1, 1]:
                newDigit = (int(combo[i]) + d) % 10
                newCombo = combo[:i] + str(newDigit) + combo[i+1:]
                if newCombo not in visited and newCombo not in dead:
                    visited.add(newCombo)
                    queue.append((newCombo, turns + 1))
    return -1`,
    javascript: `function openLock(deadends, target) {
  const dead = new Set(deadends);
  if (dead.has('0000')) return -1;
  const queue = [['0000', 0]], visited = new Set(['0000']);
  while (queue.length) {
    const [combo, turns] = queue.shift();
    if (combo === target) return turns;
    for (let i=0;i<4;i++) for (const d of [-1,1]) {
      const nd = ((parseInt(combo[i])+d)+10)%10;
      const nc = combo.slice(0,i)+nd+combo.slice(i+1);
      if (!visited.has(nc) && !dead.has(nc)) { visited.add(nc); queue.push([nc, turns+1]); }
    }
  }
  return -1;
}`,
    java: `public int openLock(String[] deadends, String target) {
    Set<String> dead=new HashSet<>(Arrays.asList(deadends));
    if(dead.contains("0000")) return -1;
    Queue<String[]> q=new LinkedList<>();q.add(new String[]{"0000","0"});
    Set<String> vis=new HashSet<>();vis.add("0000");
    while(!q.isEmpty()){String[]cur=q.poll();String combo=cur[0];int turns=Integer.parseInt(cur[1]);if(combo.equals(target))return turns;for(int i=0;i<4;i++)for(int d:new int[]{-1,1}){char[]arr=combo.toCharArray();arr[i]=(char)(((arr[i]-'0'+d+10)%10)+'0');String nc=new String(arr);if(!vis.contains(nc)&&!dead.contains(nc)){vis.add(nc);q.add(new String[]{nc,turns+1});}}}
    return -1;
}`,
  },
  defaultInput: {
    deadends: ['0201', '0101', '0102', '1212', '2002'],
    target: '0202',
  },
  inputFields: [
    {
      name: 'deadends',
      label: 'Deadend Combinations',
      type: 'array',
      defaultValue: ['0201', '0101', '0102', '1212', '2002'],
      placeholder: '["0201","0101","0102"]',
      helperText: 'Combinations that will lock the lock permanently',
    },
    {
      name: 'target',
      label: 'Target Combination',
      type: 'string',
      defaultValue: '0202',
      placeholder: '0202',
      helperText: '4-digit target combination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const deadends = input.deadends as string[];
    const target = input.target as string;
    const steps: AlgorithmStep[] = [];

    const dead = new Set(deadends);
    const visited = new Set<string>();
    const queue: [string, number][] = [];

    // Track BFS history for visualization: combo -> turns
    const comboTurns: Record<string, number> = {};
    const combos: string[] = ['0000'];
    const comboToIdx: Record<string, number> = { '0000': 0 };

    function getOrAddIdx(c: string): number {
      if (!(c in comboToIdx)) {
        comboToIdx[c] = combos.length;
        combos.push(c);
      }
      return comboToIdx[c];
    }

    getOrAddIdx(target);
    for (const d of deadends) getOrAddIdx(d);

    function makeViz(
      highlights: Record<number, string>,
      currentCombo: string,
      turns: number,
      result: number | null
    ): ArrayVisualization {
      const n = Math.min(combos.length, 20);
      const arr = combos.slice(0, n).map(c => comboTurns[c] ?? (dead.has(c) ? -1 : 0));
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) labels[i] = combos[i];
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Lock BFS',
          entries: [
            { key: 'Current', value: currentCombo },
            { key: 'Turns', value: String(turns) },
            { key: 'Target', value: target },
            { key: 'Visited', value: String(visited.size) },
            { key: 'Result', value: result !== null ? (result === -1 ? 'impossible' : String(result)) : '...' },
          ],
        },
      };
    }

    if (dead.has('0000')) {
      steps.push({
        line: 2,
        explanation: '"0000" is a deadend. Cannot start. Return -1.',
        variables: { result: -1 },
        visualization: makeViz({ 0: 'mismatch' }, '0000', 0, -1),
      });
      return steps;
    }

    if (target === '0000') {
      steps.push({
        line: 3,
        explanation: 'Already at target "0000". Return 0 turns.',
        variables: { result: 0 },
        visualization: makeViz({ 0: 'found' }, '0000', 0, 0),
      });
      return steps;
    }

    visited.add('0000');
    queue.push(['0000', 0]);
    comboTurns['0000'] = 0;

    steps.push({
      line: 1,
      explanation: `Start BFS from "0000". Target: "${target}". Deadends: ${deadends.length}. Each step turns one wheel ±1.`,
      variables: { target, deadends: deadends.length },
      visualization: makeViz({ 0: 'active', [getOrAddIdx(target)]: 'pointer' }, '0000', 0, null),
    });

    let maxSteps = 0;
    while (queue.length > 0 && maxSteps < 60) {
      maxSteps++;
      const [combo, turns] = queue.shift()!;
      const ci = getOrAddIdx(combo);

      if (combo === target) {
        steps.push({
          line: 8,
          explanation: `Reached target "${target}" in ${turns} turns!`,
          variables: { result: turns },
          visualization: makeViz({ [ci]: 'found' }, combo, turns, turns),
        });
        return steps;
      }

      for (let i = 0; i < 4; i++) {
        for (const d of [-1, 1]) {
          const nd = ((parseInt(combo[i]) + d) + 10) % 10;
          const nc = combo.slice(0, i) + nd + combo.slice(i + 1);
          if (!visited.has(nc) && !dead.has(nc)) {
            visited.add(nc);
            comboTurns[nc] = turns + 1;
            getOrAddIdx(nc);
            queue.push([nc, turns + 1]);

            const nci = getOrAddIdx(nc);
            const hl: Record<number, string> = { [ci]: 'active', [nci]: 'comparing' };
            if (nc === target) hl[nci] = 'found';

            steps.push({
              line: 12,
              explanation: `Turn wheel ${i} by ${d > 0 ? '+1' : '-1'}: "${combo}" → "${nc}" (${turns + 1} turns). Not deadend, not visited. Enqueue.`,
              variables: { from: combo, to: nc, turns: turns + 1 },
              visualization: makeViz(hl, nc, turns + 1, null),
            });
          } else if (dead.has(nc)) {
            const nci = getOrAddIdx(nc);
            steps.push({
              line: 11,
              explanation: `"${nc}" is a deadend — skip.`,
              variables: { combo: nc },
              visualization: makeViz({ [ci]: 'active', [nci]: 'mismatch' }, combo, turns, null),
            });
          }
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `BFS exhausted. Cannot reach "${target}" without hitting a deadend. Return -1.`,
      variables: { result: -1 },
      visualization: makeViz({}, '0000', 0, -1),
    });

    return steps;
  },
};

export default openTheLock;
