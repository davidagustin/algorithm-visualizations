import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumLengthOfPairChainGreedy: AlgorithmDefinition = {
  id: 'maximum-length-of-pair-chain-greedy',
  title: 'Maximum Length of Pair Chain (Greedy)',
  leetcodeNumber: 646,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Find the longest chain of pairs where each pair (c,d) follows (a,b) only if b < c. Sort by end (greedy activity selection): keep a pair only if its start > currentEnd, then update currentEnd. O(n log n) time — optimal greedy interval scheduling.',
  tags: ['Intervals', 'Greedy', 'Sorting', 'Dynamic Programming'],
  code: {
    pseudocode: `function findLongestChain(pairs):
  sort by end
  count = 1
  curEnd = pairs[0][1]
  for [c, d] in pairs[1:]:
    if c > curEnd:
      count++
      curEnd = d
  return count`,
    python: `def findLongestChain(pairs):
    pairs.sort(key=lambda x: x[1])
    count, curEnd = 1, pairs[0][1]
    for c, d in pairs[1:]:
        if c > curEnd:
            count += 1
            curEnd = d
    return count`,
    javascript: `function findLongestChain(pairs) {
  pairs.sort((a, b) => a[1] - b[1]);
  let count = 1, curEnd = pairs[0][1];
  for (let i = 1; i < pairs.length; i++) {
    const [c, d] = pairs[i];
    if (c > curEnd) {
      count++;
      curEnd = d;
    }
  }
  return count;
}`,
    java: `public int findLongestChain(int[][] pairs) {
    Arrays.sort(pairs, (a,b)->a[1]-b[1]);
    int count=1, curEnd=pairs[0][1];
    for(int i=1;i<pairs.length;i++){
        if(pairs[i][0]>curEnd){
            count++;
            curEnd=pairs[i][1];
        }
    }
    return count;
}`,
  },
  defaultInput: { pairs: [[1, 2], [2, 3], [3, 4]] },
  inputFields: [
    {
      name: 'pairs',
      label: 'Pairs',
      type: 'array',
      defaultValue: [[1, 2], [2, 3], [3, 4]],
      placeholder: '[[1,2],[2,3],[3,4]]',
      helperText: 'Array of [a, b] pairs where a < b',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pairs = (input.pairs as number[][]).map(iv => [iv[0], iv[1]]);
    pairs.sort((a, b) => a[1] - b[1]);
    const flat = pairs.flat();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Chain', entries: auxEntries } } : {}),
    });

    steps.push({ line: 2, explanation: `Sort by end: [${pairs.map(iv=>`[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: pairs.map(iv=>[...iv]) }, visualization: makeViz({}, {}) });

    let count = 1;
    let curEnd = pairs[0][1];
    const chain: number[][] = [[pairs[0][0], pairs[0][1]]];

    steps.push({ line: 3, explanation: `Start chain with [${pairs[0][0]},${pairs[0][1]}]. count=1, curEnd=${curEnd}.`,
      variables: { count, curEnd },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 1: `curEnd=${curEnd}` },
        [{ key: 'count', value: '1' }, { key: 'curEnd', value: String(curEnd) }]) });

    for (let i = 1; i < pairs.length; i++) {
      const [c, d] = pairs[i];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) {
        const inChain = chain.some(p => p[0] === pairs[j][0] && p[1] === pairs[j][1]);
        hl[j * 2] = inChain ? 'found' : 'visited';
        hl[j * 2 + 1] = hl[j * 2];
      }

      steps.push({ line: 5,
        explanation: `Pair [${c},${d}]: c=${c} > curEnd=${curEnd}? ${c > curEnd ? 'Yes, extend chain.' : 'No, skip.'}`,
        variables: { pair: [c, d], curEnd, count },
        visualization: makeViz(hl, { [ci]: `c=${c}`, [ci+1]: `d=${d}` },
          [{ key: 'count', value: String(count) }, { key: 'curEnd', value: String(curEnd) }]) });

      if (c > curEnd) {
        count++;
        curEnd = d;
        chain.push([c, d]);
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({ line: 7, explanation: `Extend chain. count=${count}, curEnd=${curEnd}.`,
          variables: { count, curEnd, chain: chain.map(p=>[...p]) },
          visualization: makeViz(hl, { [ci+1]: `curEnd=${curEnd}` },
            [{ key: 'count', value: String(count) }, { key: 'curEnd', value: String(curEnd) }]) });
      } else {
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({ line: 6, explanation: `Skip [${c},${d}]. Doesn't extend chain.`,
          variables: { count, curEnd },
          visualization: makeViz(hl, {},
            [{ key: 'count', value: String(count) }, { key: 'curEnd', value: String(curEnd) }]) });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 8, explanation: `Done. Longest chain length: ${count}.`,
      variables: { maxLength: count },
      visualization: makeViz(finalHl, {}, [{ key: 'Max Length', value: String(count) }]) });

    return steps;
  },
};

export default maximumLengthOfPairChainGreedy;
