import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const videoStitchingIII: AlgorithmDefinition = {
  id: 'video-stitching-iii',
  title: 'Video Stitching III',
  leetcodeNumber: 1024,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given clips and a time range [0, T], find the minimum number of clips needed to cover the entire range. Sort clips by start; greedily extend the current coverage as far as possible using clips whose start is within current reach, picking the one with farthest end. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Dynamic Programming'],
  code: {
    pseudocode: `function videoStitching(clips, T):
  sort clips by start
  count = 0, curEnd = 0, farthest = 0
  i = 0
  while curEnd < T:
    while i < n and clips[i].start <= curEnd:
      farthest = max(farthest, clips[i].end)
      i++
    if farthest == curEnd: return -1  // stuck
    count++
    curEnd = farthest
  return count`,
    python: `def videoStitching(clips, T):
    clips.sort()
    count, curEnd, farthest, i = 0, 0, 0, 0
    while curEnd < T:
        while i < len(clips) and clips[i][0] <= curEnd:
            farthest = max(farthest, clips[i][1])
            i += 1
        if farthest == curEnd:
            return -1
        count += 1
        curEnd = farthest
    return count`,
    javascript: `function videoStitching(clips, T) {
  clips.sort((a, b) => a[0] - b[0]);
  let count = 0, curEnd = 0, farthest = 0, i = 0;
  while (curEnd < T) {
    while (i < clips.length && clips[i][0] <= curEnd) {
      farthest = Math.max(farthest, clips[i][1]);
      i++;
    }
    if (farthest === curEnd) return -1;
    count++;
    curEnd = farthest;
  }
  return count;
}`,
    java: `public int videoStitching(int[][] clips, int T) {
    Arrays.sort(clips, (a,b)->a[0]-b[0]);
    int count=0,curEnd=0,farthest=0,i=0;
    while(curEnd<T){
        while(i<clips.length&&clips[i][0]<=curEnd)
            farthest=Math.max(farthest,clips[i++][1]);
        if(farthest==curEnd) return -1;
        count++; curEnd=farthest;
    }
    return count;
}`,
  },
  defaultInput: {
    clips: [[0, 2], [4, 6], [8, 10], [1, 9], [1, 5], [5, 9]],
    T: 10,
  },
  inputFields: [
    {
      name: 'clips',
      label: 'Video Clips',
      type: 'array',
      defaultValue: [[0, 2], [4, 6], [8, 10], [1, 9], [1, 5], [5, 9]],
      placeholder: '[[0,2],[4,6],[8,10]]',
      helperText: 'Array of [start, end] clip intervals',
    },
    {
      name: 'T',
      label: 'Target Duration T',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Must cover [0, T]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const clips = (input.clips as number[][]).map(iv => [iv[0], iv[1]]);
    const T = Number(input.T) || 10;
    clips.sort((a, b) => a[0] - b[0]);
    const flat = clips.flat();
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
      ...(auxEntries ? { auxData: { label: 'Coverage', entries: auxEntries } } : {}),
    });

    steps.push({ line: 2, explanation: `Sort clips by start: [${clips.map(iv=>`[${iv[0]},${iv[1]}]`).join(', ')}]. T=${T}.`,
      variables: { T, sorted: clips.map(iv=>[...iv]) }, visualization: makeViz({}, {}) });

    let count = 0, curEnd = 0, farthest = 0, i = 0;

    while (curEnd < T) {
      const prevEnd = curEnd;
      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      while (i < clips.length && clips[i][0] <= curEnd) {
        if (clips[i][1] > farthest) {
          farthest = clips[i][1];
          hl[i * 2] = 'active'; hl[i * 2 + 1] = 'active';
        } else {
          hl[i * 2] = 'comparing'; hl[i * 2 + 1] = 'comparing';
        }
        steps.push({ line: 6,
          explanation: `Clip [${clips[i][0]},${clips[i][1]}] reachable (start ${clips[i][0]} <= curEnd ${curEnd}). farthest=${Math.max(farthest, clips[i][1])}.`,
          variables: { clip: clips[i], curEnd, farthest },
          visualization: makeViz({ ...hl }, { [i*2]: `s=${clips[i][0]}` },
            [{ key: 'count', value: String(count) }, { key: 'curEnd', value: String(curEnd) }, { key: 'farthest', value: String(farthest) }]) });
        i++;
      }

      if (farthest === prevEnd) {
        steps.push({ line: 9, explanation: `Stuck! farthest==curEnd=${curEnd}. Cannot cover [0,${T}]. Return -1.`,
          variables: { count: -1 },
          visualization: makeViz(hl, {}, [{ key: 'Result', value: '-1' }]) });
        return steps;
      }

      count++;
      curEnd = farthest;
      steps.push({ line: 10,
        explanation: `Use clip extending to ${curEnd}. count=${count}. Coverage: [0,${curEnd}] / [0,${T}].`,
        variables: { count, curEnd, farthest },
        visualization: makeViz(hl, {},
          [{ key: 'count', value: String(count) }, { key: 'curEnd', value: String(curEnd) }, { key: 'T', value: String(T) }]) });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 12, explanation: `Done. Covered [0,${T}] with ${count} clips.`,
      variables: { minClips: count },
      visualization: makeViz(finalHl, {}, [{ key: 'Min Clips', value: String(count) }]) });

    return steps;
  },
};

export default videoStitchingIII;
