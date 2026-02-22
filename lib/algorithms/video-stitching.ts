import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const videoStitching: AlgorithmDefinition = {
  id: 'video-stitching',
  title: 'Video Stitching',
  leetcodeNumber: 1024,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given video clips and a target duration T, find the minimum number of clips needed to cover [0, T]. Uses a greedy interval covering approach: at each step, among all clips that start at or before the current coverage end, pick the one that extends coverage the furthest.',
  tags: ['dynamic programming', 'greedy', 'interval', 'array'],

  code: {
    pseudocode: `function videoStitching(clips, T):
  sort clips by start time
  count = 0, curEnd = 0, furthest = 0, i = 0
  while curEnd < T:
    while i < len(clips) and clips[i][0] <= curEnd:
      furthest = max(furthest, clips[i][1])
      i++
    if furthest == curEnd:
      return -1  // no progress, cannot cover
    curEnd = furthest
    count++
  return count`,

    python: `def videoStitching(clips, T):
    clips.sort()
    count = curEnd = furthest = 0
    i = 0
    while curEnd < T:
        while i < len(clips) and clips[i][0] <= curEnd:
            furthest = max(furthest, clips[i][1])
            i += 1
        if furthest == curEnd:
            return -1
        curEnd = furthest
        count += 1
    return count`,

    javascript: `function videoStitching(clips, T) {
  clips.sort((a,b)=>a[0]-b[0]);
  let count=0, curEnd=0, furthest=0, i=0;
  while (curEnd < T) {
    while (i < clips.length && clips[i][0] <= curEnd) {
      furthest = Math.max(furthest, clips[i][1]);
      i++;
    }
    if (furthest === curEnd) return -1;
    curEnd = furthest;
    count++;
  }
  return count;
}`,

    java: `public int videoStitching(int[][] clips, int T) {
    Arrays.sort(clips, (a,b)->a[0]-b[0]);
    int count=0, curEnd=0, furthest=0, i=0;
    while (curEnd < T) {
        while (i<clips.length && clips[i][0]<=curEnd) {
            furthest=Math.max(furthest,clips[i][1]); i++;
        }
        if (furthest==curEnd) return -1;
        curEnd=furthest; count++;
    }
    return count;
}`,
  },

  defaultInput: {
    clips: [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]],
    T: 10,
  },

  inputFields: [
    {
      name: 'clips',
      label: 'Video Clips [start, end]',
      type: 'array',
      defaultValue: [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]],
      placeholder: '[[0,2],[4,6],[8,10]]',
      helperText: 'Each clip as [start, end] time',
    },
    {
      name: 'T',
      label: 'Target Duration (T)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Need to cover interval [0, T]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const clips = (input.clips as number[][]).map(c => [...c]);
    const T = input.T as number;
    const steps: AlgorithmStep[] = [];

    clips.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `${clips.length} clips sorted by start. Need to cover [0, ${T}]. Greedy: always extend coverage as far as possible.`,
      variables: { clipCount: clips.length, target: T },
      visualization: {
        type: 'array',
        array: clips.map(c => c[1] - c[0]),
        highlights: {},
        labels: Object.fromEntries(clips.map((c, i) => [i, `[${c[0]},${c[1]}]`])),
      },
    });

    let count = 0, curEnd = 0, furthest = 0, i = 0;

    while (curEnd < T) {
      const prevEnd = curEnd;
      while (i < clips.length && clips[i][0] <= curEnd) {
        if (clips[i][1] > furthest) furthest = clips[i][1];
        i++;
      }

      if (furthest === curEnd) {
        steps.push({
          line: 6,
          explanation: `Stuck: no clip extends beyond ${curEnd}. Cannot cover [0, ${T}]. Return -1.`,
          variables: { curEnd, furthest, clipsUsed: count },
          visualization: {
            type: 'array',
            array: clips.map(c => c[1] - c[0]),
            highlights: {},
            labels: Object.fromEntries(clips.map((c, idx) => [idx, `[${c[0]},${c[1]}]`])),
          },
        });
        return steps;
      }

      curEnd = furthest;
      count++;

      const highlights: Record<number, string> = {};
      for (let k = 0; k < clips.length; k++) {
        if (clips[k][0] <= prevEnd) highlights[k] = k < i ? 'visited' : 'default';
        if (clips[k][1] === furthest && clips[k][0] <= prevEnd) highlights[k] = 'found';
      }

      steps.push({
        line: 9,
        explanation: `Round ${count}: Scanned clips starting at or before ${prevEnd}. Best extends to ${curEnd}. Coverage: [0, ${curEnd}].`,
        variables: { round: count, newCoverage: curEnd, clipsScanned: i },
        visualization: {
          type: 'array',
          array: clips.map(c => c[1] - c[0]),
          highlights,
          labels: Object.fromEntries(clips.map((c, idx) => [idx, `[${c[0]},${c[1]}]`])),
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `Covered [0, ${T}] using ${count} clip(s). Minimum clips needed: ${count}.`,
      variables: { answer: count },
      visualization: {
        type: 'array',
        array: clips.map(c => c[1] - c[0]),
        highlights: {},
        labels: Object.fromEntries(clips.map((c, i) => [i, `[${c[0]},${c[1]}]`])),
      },
    });

    return steps;
  },
};

export default videoStitching;
