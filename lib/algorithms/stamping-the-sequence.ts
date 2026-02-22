import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stampingTheSequence: AlgorithmDefinition = {
  id: 'stamping-the-sequence',
  title: 'Stamping the Sequence',
  leetcodeNumber: 936,
  difficulty: 'Hard',
  category: 'String',
  description:
    'You have a stamp of a given string and a target string. You can stamp the stamp over the target at any position. Return the sequence of stamp positions to build the target (reversed: work backward by "unstamping"). Greedy: repeatedly find and erase a match of stamp in the current target (replace matched chars with wildcards), until all chars are wildcards.',
  tags: ['string', 'greedy', 'simulation'],

  code: {
    pseudocode: `function movesToStamp(stamp, target):
  result = []
  target = list(target)
  total = 0
  while total < len(target):
    stamped = false
    for i from 0 to len(target) - len(stamp):
      // try stamping at position i
      matched = 0
      for j from 0 to len(stamp)-1:
        if target[i+j] == '*': matched++ continue
        if target[i+j] == stamp[j]: matched++
        else: break
      if matched == len(stamp):
        // erase stamp from target
        for j in range(len(stamp)):
          if target[i+j] != '*': total++; target[i+j] = '*'
        result.append(i); stamped = true
    if not stamped: return []
  return reversed(result)`,

    python: `def movesToStamp(stamp: str, target: str) -> list[int]:
    S, T = len(stamp), len(target)
    t = list(target)
    result = []
    total = 0
    while total < T:
        stamped = False
        for i in range(T - S + 1):
            matched = already_star = 0
            for j in range(S):
                if t[i+j] == '*': already_star += 1
                elif t[i+j] == stamp[j]: matched += 1
                else: break
            else:
                if matched > 0:
                    for j in range(S):
                        if t[i+j] != '*': t[i+j] = '*'; total += 1
                    result.append(i); stamped = True
        if not stamped: return []
    return result[::-1]`,

    javascript: `function movesToStamp(stamp, target) {
  const S = stamp.length, T = target.length;
  const t = target.split('');
  const result = [];
  let total = 0;
  while (total < T) {
    let stamped = false;
    for (let i = 0; i <= T - S; i++) {
      let matched = 0, skip = false;
      for (let j = 0; j < S; j++) {
        if (t[i+j] === '*') continue;
        if (t[i+j] === stamp[j]) matched++;
        else { skip = true; break; }
      }
      if (!skip && matched > 0) {
        for (let j = 0; j < S; j++) if (t[i+j] !== '*') { t[i+j] = '*'; total++; }
        result.push(i); stamped = true;
      }
    }
    if (!stamped) return [];
  }
  return result.reverse();
}`,

    java: `public int[] movesToStamp(String stamp, String target) {
    char[] t = target.toCharArray();
    List<Integer> result = new ArrayList<>();
    int total = 0, T = t.length, S = stamp.length();
    while (total < T) {
        boolean stamped = false;
        for (int i = 0; i <= T - S; i++) {
            int matched = 0; boolean skip = false;
            for (int j = 0; j < S; j++) {
                if (t[i+j] == '*') continue;
                if (t[i+j] == stamp.charAt(j)) matched++;
                else { skip = true; break; }
            }
            if (!skip && matched > 0) {
                for (int j = 0; j < S; j++) if (t[i+j] != '*') { t[i+j] = '*'; total++; }
                result.add(i); stamped = true;
            }
        }
        if (!stamped) return new int[0];
    }
    Collections.reverse(result);
    return result.stream().mapToInt(x -> x).toArray();
}`,
  },

  defaultInput: {
    stamp: 'abc',
    target: 'ababc',
  },

  inputFields: [
    {
      name: 'stamp',
      label: 'Stamp',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'The stamp string',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'string',
      defaultValue: 'ababc',
      placeholder: 'ababc',
      helperText: 'The target string to reproduce',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stamp = input.stamp as string;
    const target = input.target as string;
    const steps: AlgorithmStep[] = [];
    const S = stamp.length;
    const T = target.length;
    const t = target.split('');

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...t] as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Reverse stamping: work backward from target="${target}" using stamp="${stamp}". Find and erase matches (replace with *) until all are *.`,
      variables: { stamp, target },
      visualization: makeViz({}, {}),
    });

    const result: number[] = [];
    let total = 0;
    let iterations = 0;
    const maxIterations = T * T;

    while (total < T && iterations < maxIterations) {
      iterations++;
      let stamped = false;

      for (let i = 0; i <= T - S; i++) {
        let matched = 0;
        let skip = false;

        for (let j = 0; j < S; j++) {
          if (t[i + j] === '*') continue;
          if (t[i + j] === stamp[j]) matched++;
          else { skip = true; break; }
        }

        if (!skip && matched > 0) {
          const highlights: Record<number, string> = {};
          for (let j = 0; j < S; j++) highlights[i + j] = 'found';

          steps.push({
            line: 10,
            explanation: `Found stamp match at position ${i} in current target "${t.join('')}". Erase (replace with *). matched=${matched} chars.`,
            variables: { position: i, matched, total },
            visualization: makeViz(highlights, { [i]: `pos=${i}` }),
          });

          for (let j = 0; j < S; j++) {
            if (t[i + j] !== '*') { t[i + j] = '*'; total++; }
          }
          result.push(i);
          stamped = true;

          steps.push({
            line: 11,
            explanation: `After erasing at ${i}: "${t.join('')}". total erased=${total}/${T}.`,
            variables: { target: t.join(''), total, T },
            visualization: makeViz(
              Object.fromEntries(t.map((c, idx) => [idx, c === '*' ? 'visited' : 'active'])),
              {}
            ),
          });
          break;
        }
      }

      if (!stamped) {
        steps.push({
          line: 14,
          explanation: `No valid stamp position found. Target cannot be formed. Return empty.`,
          variables: { result: [] },
          visualization: makeViz({}, {}),
        });
        return steps;
      }
    }

    const finalResult = [...result].reverse();
    steps.push({
      line: 15,
      explanation: `All ${T} characters erased. Reverse the order of positions: [${finalResult.join(', ')}].`,
      variables: { result: finalResult.join(','), steps: finalResult.length },
      visualization: makeViz(
        Object.fromEntries(t.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default stampingTheSequence;
