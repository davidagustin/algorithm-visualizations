import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const orderlyQueue: AlgorithmDefinition = {
  id: 'orderly-queue',
  title: 'Orderly Queue',
  leetcodeNumber: 899,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Given a string s and integer k, you can take one of the first k letters of s and put it at the end any number of times. Return the lexicographically smallest string. Key insight: if k==1, only rotations are possible so find the minimum rotation. If k>=2, any permutation is achievable so just sort the string.',
  tags: ['string', 'math', 'sorting'],

  code: {
    pseudocode: `function orderlyQueue(s, k):
  if k == 1:
    // Only rotations possible
    result = s
    for i from 1 to len(s)-1:
      rotation = s[i:] + s[:i]
      result = min(result, rotation)
    return result
  else:
    // k >= 2: any permutation possible
    return sorted(s).join("")`,

    python: `def orderlyQueue(s: str, k: int) -> str:
    if k == 1:
        return min(s[i:] + s[:i] for i in range(len(s)))
    return ''.join(sorted(s))`,

    javascript: `function orderlyQueue(s, k) {
  if (k === 1) {
    let best = s;
    for (let i = 1; i < s.length; i++) {
      const rot = s.slice(i) + s.slice(0, i);
      if (rot < best) best = rot;
    }
    return best;
  }
  return s.split('').sort().join('');
}`,

    java: `public String orderlyQueue(String s, int k) {
    if (k == 1) {
        String best = s;
        for (int i = 1; i < s.length(); i++) {
            String rot = s.substring(i) + s.substring(0, i);
            if (rot.compareTo(best) < 0) best = rot;
        }
        return best;
    }
    char[] arr = s.toCharArray();
    Arrays.sort(arr);
    return new String(arr);
}`,
  },

  defaultInput: {
    s: 'cba',
    k: 1,
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'cba',
      placeholder: 'cba',
      helperText: 'The input string',
    },
    {
      name: 'k',
      label: 'K (first k letters accessible)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of letters accessible from front',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr: string[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `s="${s}", k=${k}. If k==1 only rotations possible; if k>=2 any permutation is achievable (sort).`,
      variables: { s, k },
      visualization: makeViz({}, {}, s.split('')),
    });

    if (k === 1) {
      steps.push({
        line: 2,
        explanation: `k=1: only rotations are reachable. Check all ${s.length} rotations.`,
        variables: { approach: 'rotations only' },
        visualization: makeViz({}, {}, s.split('')),
      });

      let best = s;
      for (let i = 0; i < s.length; i++) {
        const rotation = s.slice(i) + s.slice(0, i);
        const isBetter = rotation < best;
        if (isBetter) best = rotation;

        steps.push({
          line: 5,
          explanation: `Rotation ${i}: "${rotation}" ${isBetter ? '< current best => new best!' : '>= current best, skip.'}. Current best: "${best}".`,
          variables: { rotation: i, rotatedString: rotation, best, isBetter },
          visualization: makeViz(
            isBetter ? Object.fromEntries(rotation.split('').map((_, j) => [j, 'found'])) : {},
            { 0: `rot=${i}` },
            rotation.split('')
          ),
        });
      }

      steps.push({
        line: 7,
        explanation: `Result: "${best}" (minimum rotation).`,
        variables: { result: best },
        visualization: makeViz({}, {}, best.split('')),
      });
    } else {
      steps.push({
        line: 9,
        explanation: `k>=${k}>=2: with 2+ front letters accessible, any permutation is reachable. Simply sort the string.`,
        variables: { approach: 'sort' },
        visualization: makeViz({}, {}, s.split('')),
      });

      const sorted = s.split('').sort().join('');
      steps.push({
        line: 9,
        explanation: `Sorted "${s}" => "${sorted}". This is the lexicographically smallest permutation.`,
        variables: { result: sorted },
        visualization: makeViz(
          Object.fromEntries(sorted.split('').map((_, i) => [i, 'sorted'])),
          {},
          sorted.split('')
        ),
      });
    }

    return steps;
  },
};

export default orderlyQueue;
