import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countTheRepetitions: AlgorithmDefinition = {
  id: 'count-the-repetitions',
  title: 'Count the Repetitions',
  leetcodeNumber: 466,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Define str = [s, n] as string s repeated n times. Find the maximum m such that [s2, m] can be obtained from [s1, n1] by deleting characters. Simulate matching s2 in n1 copies of s1 and detect cycles to avoid full simulation.',
  tags: ['dynamic programming', 'string', 'simulation', 'cycle detection'],

  code: {
    pseudocode: `function getMaxRepetitions(s1, n1, s2, n2):
  indexMap = {} // s2 index -> (s1 count, s2 count)
  s1cnt = 0, s2cnt = 0, index = 0
  while s1cnt < n1:
    s1cnt++
    for c in s1:
      if c == s2[index]:
        index++
        if index == len(s2):
          s2cnt++; index = 0
    if index in indexMap:
      // cycle found
      cycleStart = indexMap[index]
      cycle_s1 = s1cnt - cycleStart[0]
      cycle_s2 = s2cnt - cycleStart[1]
      remaining = n1 - s1cnt
      s2cnt += (remaining // cycle_s1) * cycle_s2
      s1cnt = n1 - remaining % cycle_s1
    else:
      indexMap[index] = (s1cnt, s2cnt)
  return s2cnt // n2`,
    python: `def getMaxRepetitions(s1, n1, s2, n2):
    if not set(s2).issubset(set(s1)):
        return 0
    index_map = {}
    s2cnt, index = 0, 0
    for s1cnt in range(1, n1 + 1):
        for c in s1:
            if c == s2[index]:
                index += 1
                if index == len(s2):
                    s2cnt += 1
                    index = 0
        if index in index_map:
            prev_s1cnt, prev_s2cnt = index_map[index]
            cycle_len = s1cnt - prev_s1cnt
            cycle_s2 = s2cnt - prev_s2cnt
            remaining = n1 - s1cnt
            s2cnt += (remaining // cycle_len) * cycle_s2
            for i in range(remaining % cycle_len):
                pass  # handled in further iteration
            break
        index_map[index] = (s1cnt, s2cnt)
    return s2cnt // n2`,
    javascript: `function getMaxRepetitions(s1, n1, s2, n2) {
  const indexMap = new Map();
  let s2cnt = 0, index = 0;
  for (let s1cnt = 1; s1cnt <= n1; s1cnt++) {
    for (const c of s1) {
      if (c === s2[index]) {
        index++;
        if (index === s2.length) { s2cnt++; index = 0; }
      }
    }
    if (indexMap.has(index)) {
      const [prevS1, prevS2] = indexMap.get(index);
      const cycleLen = s1cnt - prevS1;
      const cycleS2 = s2cnt - prevS2;
      const remaining = n1 - s1cnt;
      s2cnt += Math.floor(remaining / cycleLen) * cycleS2;
      const leftover = remaining % cycleLen;
      for (const [k, [ps1, ps2]] of indexMap) {
        if (ps1 === prevS1 + leftover) { s2cnt += ps2 - prevS2; break; }
      }
      return Math.floor(s2cnt / n2);
    }
    indexMap.set(index, [s1cnt, s2cnt]);
  }
  return Math.floor(s2cnt / n2);
}`,
    java: `public int getMaxRepetitions(String s1, int n1, String s2, int n2) {
    Map<Integer,int[]> map = new HashMap<>();
    int s2cnt = 0, index = 0;
    for (int s1cnt = 1; s1cnt <= n1; s1cnt++) {
        for (char c : s1.toCharArray()) {
            if (c == s2.charAt(index)) {
                if (++index == s2.length()) { s2cnt++; index = 0; }
            }
        }
        if (map.containsKey(index)) {
            int[] prev = map.get(index);
            int cycleS2 = s2cnt - prev[1];
            int remaining = n1 - s1cnt;
            s2cnt += (remaining / (s1cnt - prev[0])) * cycleS2;
            break;
        }
        map.put(index, new int[]{s1cnt, s2cnt});
    }
    return s2cnt / n2;
}`,
  },

  defaultInput: {
    s1: 'acb',
    n1: 4,
    s2: 'ab',
    n2: 2,
  },

  inputFields: [
    {
      name: 's1',
      label: 'S1',
      type: 'string',
      defaultValue: 'acb',
      placeholder: 'acb',
      helperText: 'Base string s1',
    },
    {
      name: 'n1',
      label: 'N1',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Repeat s1 n1 times',
    },
    {
      name: 's2',
      label: 'S2',
      type: 'string',
      defaultValue: 'ab',
      placeholder: 'ab',
      helperText: 'Pattern string s2',
    },
    {
      name: 'n2',
      label: 'N2',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Find how many [s2,n2] fit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const n1 = input.n1 as number;
    const s2 = input.s2 as string;
    const n2 = input.n2 as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s1.split('').map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count Repetitions: s1="${s1}" x${n1}, s2="${s2}" x${n2}. How many [s2,n2] can be obtained?`,
      variables: { s1, n1, s2, n2 },
      visualization: makeViz({}, {}),
    });

    const indexMap = new Map<number, [number, number]>();
    let s2cnt = 0;
    let index = 0;
    let finalResult = 0;
    let cycleFound = false;

    for (let s1cnt = 1; s1cnt <= n1; s1cnt++) {
      for (let ci = 0; ci < s1.length; ci++) {
        const c = s1[ci];
        if (c === s2[index]) {
          index++;
          if (index === s2.length) {
            s2cnt++;
            index = 0;
          }
        }
        const charIdx = ci % s1.length;
        if (s1cnt <= 2) {
          steps.push({
            line: 5,
            explanation: `s1 copy ${s1cnt}, char "${c}" at pos ${ci}. s2 match index=${index}. s2 completions so far=${s2cnt}.`,
            variables: { s1cnt, char: c, s2_index: index, s2cnt },
            visualization: makeViz(
              { [charIdx]: c === s2[(index > 0 ? index - 1 : s2.length - 1)] ? 'found' : 'comparing' },
              { [charIdx]: `idx=${index}` }
            ),
          });
        }
      }

      if (indexMap.has(index)) {
        const [prevS1, prevS2] = indexMap.get(index)!;
        const cycleLen = s1cnt - prevS1;
        const cycleS2 = s2cnt - prevS2;
        const remaining = n1 - s1cnt;
        s2cnt += Math.floor(remaining / cycleLen) * cycleS2;
        cycleFound = true;
        steps.push({
          line: 11,
          explanation: `Cycle detected at s2 index=${index}! Cycle length=${cycleLen} s1 copies, produces ${cycleS2} s2 completions. Skip ahead. s2cnt=${s2cnt}.`,
          variables: { cycleLen, cycleS2, remaining, s2cnt },
          visualization: makeViz({ 0: 'found' }, { 0: `cycle!` }),
        });
        break;
      }
      indexMap.set(index, [s1cnt, s2cnt]);
    }

    finalResult = Math.floor(s2cnt / n2);

    steps.push({
      line: 16,
      explanation: `Total s2 completions = ${s2cnt}. Divide by n2=${n2}: ${s2cnt} / ${n2} = ${finalResult}. ${cycleFound ? '(cycle optimization used)' : ''}`,
      variables: { s2cnt, n2, result: finalResult },
      visualization: makeViz(
        Object.fromEntries(s1.split('').map((_, i) => [i, 'sorted'])),
        { 0: `ans:${finalResult}` }
      ),
    });

    return steps;
  },
};

export default countTheRepetitions;
