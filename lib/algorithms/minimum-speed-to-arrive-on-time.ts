import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSpeedToArriveOnTime: AlgorithmDefinition = {
  id: 'minimum-speed-to-arrive-on-time',
  title: 'Minimum Speed to Arrive on Time',
  leetcodeNumber: 1870,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given train ride distances and a total time limit, find the minimum integer speed so all trains can be completed in time. Trains run sequentially and each non-last train time is rounded up to the next integer. Binary search on speed from 1 to 10^7.',
  tags: ['binary search', 'math', 'greedy'],

  code: {
    pseudocode: `function minSpeedOnTime(dist, hour):
  if len(dist) - 1 >= hour: return -1
  left = 1, right = 10^7
  while left < right:
    mid = (left + right) / 2
    time = sum(ceil(d/mid) for d in dist[:-1]) + dist[-1]/mid
    if time <= hour:
      right = mid
    else:
      left = mid + 1
  return left`,

    python: `import math
def minSpeedOnTime(dist: list[int], hour: float) -> int:
    if len(dist) - 1 >= hour:
        return -1
    left, right = 1, 10**7
    while left < right:
        mid = (left + right) // 2
        time = sum(math.ceil(d / mid) for d in dist[:-1]) + dist[-1] / mid
        if time <= hour:
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function minSpeedOnTime(dist, hour) {
  if (dist.length - 1 >= hour) return -1;
  let left = 1, right = 1e7;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let time = dist.slice(0, -1).reduce((s, d) => s + Math.ceil(d / mid), 0);
    time += dist[dist.length - 1] / mid;
    if (time <= hour) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int minSpeedOnTime(int[] dist, double hour) {
    if (dist.length - 1 >= hour) return -1;
    int left = 1, right = (int) 1e7;
    while (left < right) {
        int mid = (left + right) / 2;
        double time = 0;
        for (int i = 0; i < dist.length - 1; i++)
            time += Math.ceil((double) dist[i] / mid);
        time += (double) dist[dist.length - 1] / mid;
        if (time <= hour) right = mid;
        else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    dist: [1, 3, 2],
    hour: 6,
  },

  inputFields: [
    {
      name: 'dist',
      label: 'Distances',
      type: 'array',
      defaultValue: [1, 3, 2],
      placeholder: '1,3,2',
      helperText: 'Comma-separated train ride distances',
    },
    {
      name: 'hour',
      label: 'Hour Limit',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Maximum total travel time allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dist = input.dist as number[];
    const hour = input.hour as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...dist],
      highlights,
      labels,
    });

    if (dist.length - 1 >= hour) {
      steps.push({
        line: 2,
        explanation: `Impossible: ${dist.length - 1} train waits needed but only ${hour} hours available. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    let left = 1;
    let right = 100;

    steps.push({
      line: 3,
      explanation: `Binary search on speed from ${left} to ${right}. Distances: [${dist.join(', ')}], time limit: ${hour}h.`,
      variables: { left, right, hour },
      visualization: makeViz(
        dist.reduce((acc, _, i) => ({ ...acc, [i]: 'pointer' }), {}),
        dist.reduce((acc, d, i) => ({ ...acc, [i]: `d=${d}` }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      let time = 0;
      for (let i = 0; i < dist.length - 1; i++) {
        time += Math.ceil(dist[i] / mid);
      }
      time += dist[dist.length - 1] / mid;
      const timeRounded = Math.round(time * 100) / 100;

      steps.push({
        line: 5,
        explanation: `Try speed=${mid}. Total time = ${timeRounded}h. Hour limit = ${hour}h.`,
        variables: { left, right, speed: mid, totalTime: timeRounded, hour },
        visualization: makeViz(
          dist.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
          dist.reduce((acc, d, i) => ({ ...acc, [i]: `t=${Math.ceil(d / mid)}` }), {})
        ),
      });

      if (timeRounded <= hour) {
        steps.push({
          line: 7,
          explanation: `time=${timeRounded} <= ${hour}. Speed ${mid} works. Try lower: right = ${mid}.`,
          variables: { left, right, speed: mid, totalTime: timeRounded },
          visualization: makeViz(
            dist.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
            { 0: `spd=${mid} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `time=${timeRounded} > ${hour}. Speed ${mid} too slow. Try faster: left = ${mid + 1}.`,
          variables: { left, right, speed: mid, totalTime: timeRounded },
          visualization: makeViz(
            dist.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            { 0: `spd=${mid} slow` }
          ),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum speed found: ${left}.`,
      variables: { result: left },
      visualization: makeViz(
        dist.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        { 0: `min spd=${left}` }
      ),
    });

    return steps;
  },
};

export default minimumSpeedToArriveOnTime;
