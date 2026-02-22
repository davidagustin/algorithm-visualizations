import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimizeMaxDistanceToGasStation: AlgorithmDefinition = {
  id: 'minimize-max-distance-to-gas-station',
  title: 'Minimize Max Distance to Gas Station',
  leetcodeNumber: 774,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given sorted gas station positions and k additional stations to add, minimize the maximum distance between consecutive stations. Binary search on the answer (floating point): for each candidate max distance D, count how many additional stations are needed by dividing each gap by D.',
  tags: ['binary search', 'greedy', 'math', 'floating point'],

  code: {
    pseudocode: `function minmaxGasDist(stations, k):
  left = 0, right = stations[-1] - stations[0]
  while right - left > 1e-6:
    mid = (left + right) / 2
    if canAchieve(stations, k, mid):
      right = mid
    else:
      left = mid

function canAchieve(stations, k, D):
  count = 0
  for i in 1..len(stations)-1:
    count += ceil((stations[i] - stations[i-1]) / D) - 1
  return count <= k`,

    python: `def minmaxGasDist(stations: list[int], k: int) -> float:
    def canAchieve(D):
        return sum(int((stations[i] - stations[i-1]) / D) for i in range(1, len(stations))) <= k
    left, right = 0, stations[-1] - stations[0]
    for _ in range(100):
        mid = (left + right) / 2
        if canAchieve(mid): right = mid
        else: left = mid
    return left`,

    javascript: `function minmaxGasDist(stations, k) {
  const canAchieve = (D) =>
    stations.slice(1).reduce((s, v, i) => s + Math.floor((v - stations[i]) / D), 0) <= k;
  let left = 0, right = stations[stations.length - 1] - stations[0];
  for (let i = 0; i < 100; i++) {
    const mid = (left + right) / 2;
    if (canAchieve(mid)) right = mid;
    else left = mid;
  }
  return left;
}`,

    java: `public double minmaxGasDist(int[] stations, int k) {
    double left = 0, right = stations[stations.length - 1] - stations[0];
    for (int i = 0; i < 100; i++) {
        double mid = (left + right) / 2;
        int count = 0;
        for (int j = 1; j < stations.length; j++)
            count += (int) ((stations[j] - stations[j-1]) / mid);
        if (count <= k) right = mid;
        else left = mid;
    }
    return left;
}`,
  },

  defaultInput: {
    stations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    k: 9,
  },

  inputFields: [
    {
      name: 'stations',
      label: 'Gas Station Positions',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      placeholder: '1,2,3,4,5,6,7,8,9,10',
      helperText: 'Sorted positions of existing gas stations',
    },
    {
      name: 'k',
      label: 'Additional Stations',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Number of additional stations to insert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stations = input.stations as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const gaps = stations.slice(1).map((v, i) => v - stations[i]);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: gaps,
      highlights,
      labels,
    });

    const canAchieve = (D: number): boolean => {
      let count = 0;
      for (const gap of gaps) count += Math.floor(gap / D);
      return count <= k;
    };

    let left = 0;
    let right = stations[stations.length - 1] - stations[0];

    steps.push({
      line: 1,
      explanation: `Stations: [${stations.join(', ')}]. k=${k}. Gaps: [${gaps.join(', ')}]. Binary search D from 0 to ${right}.`,
      variables: { left, right, k, gaps: `[${gaps.join(', ')}]` },
      visualization: makeViz(
        gaps.reduce((acc, _, i) => ({ ...acc, [i]: 'pointer' }), {}),
        gaps.reduce((acc, g, i) => ({ ...acc, [i]: `gap=${g}` }), {})
      ),
    });

    for (let iter = 0; iter < 8; iter++) {
      const mid = (left + right) / 2;
      const midRounded = Math.round(mid * 100) / 100;
      let count = 0;
      for (const gap of gaps) count += Math.floor(gap / mid);

      steps.push({
        line: 4,
        explanation: `Iteration ${iter + 1}: Try D=${midRounded}. Stations needed = ${count}. k=${k}.`,
        variables: { left: Math.round(left * 100) / 100, right: Math.round(right * 100) / 100, D: midRounded, stationsNeeded: count, k },
        visualization: makeViz(
          gaps.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
          gaps.reduce((acc, g, i) => ({ ...acc, [i]: `${Math.floor(g / mid)}` }), {})
        ),
      });

      if (canAchieve(mid)) {
        steps.push({
          line: 6,
          explanation: `D=${midRounded} achievable (need ${count} <= ${k}). Try smaller: right=${midRounded}.`,
          variables: { D: midRounded, count, k },
          visualization: makeViz(
            gaps.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
            { 0: `D=${midRounded} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `D=${midRounded} not achievable (need ${count} > ${k}). Try larger: left=${midRounded}.`,
          variables: { D: midRounded, count, k },
          visualization: makeViz(
            gaps.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            { 0: `D=${midRounded} fail` }
          ),
        });
        left = mid;
      }
    }

    const finalAns = Math.round(left * 1e6) / 1e6;
    steps.push({
      line: 9,
      explanation: `Converged. Minimum maximum distance ~ ${finalAns}.`,
      variables: { result: finalAns },
      visualization: makeViz(
        gaps.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        { 0: `ans~${finalAns}` }
      ),
    });

    return steps;
  },
};

export default minimizeMaxDistanceToGasStation;
