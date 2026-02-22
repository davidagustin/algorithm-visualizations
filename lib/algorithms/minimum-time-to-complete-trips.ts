import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumTimeToCompleteTrips: AlgorithmDefinition = {
  id: 'minimum-time-to-complete-trips',
  title: 'Minimum Time to Complete Trips',
  leetcodeNumber: 2187,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given bus trip times and a required total number of trips, find the minimum time needed. Each bus independently completes floor(time/tripTime) trips. Binary search on the answer: check if a given time allows enough total trips across all buses.',
  tags: ['binary search', 'greedy', 'math'],

  code: {
    pseudocode: `function minimumTime(time, totalTrips):
  left = 1
  right = min(time) * totalTrips
  while left < right:
    mid = (left + right) / 2
    trips = sum(mid / t for t in time)
    if trips >= totalTrips:
      right = mid
    else:
      left = mid + 1
  return left`,

    python: `def minimumTime(time: list[int], totalTrips: int) -> int:
    left, right = 1, min(time) * totalTrips
    while left < right:
        mid = (left + right) // 2
        if sum(mid // t for t in time) >= totalTrips:
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function minimumTime(time, totalTrips) {
  let left = 1, right = Math.min(...time) * totalTrips;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const trips = time.reduce((s, t) => s + Math.floor(mid / t), 0);
    if (trips >= totalTrips) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public long minimumTime(int[] time, int totalTrips) {
    long left = 1;
    long right = (long) Arrays.stream(time).min().getAsInt() * totalTrips;
    while (left < right) {
        long mid = (left + right) / 2;
        long trips = 0;
        for (int t : time) trips += mid / t;
        if (trips >= totalTrips) right = mid;
        else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    time: [1, 2, 3],
    totalTrips: 5,
  },

  inputFields: [
    {
      name: 'time',
      label: 'Bus Trip Times',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Time for each bus to complete one trip',
    },
    {
      name: 'totalTrips',
      label: 'Total Trips Required',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Minimum number of total trips needed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const time = input.time as number[];
    const totalTrips = input.totalTrips as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...time],
      highlights,
      labels,
    });

    let left = 1;
    let right = Math.min(...time) * totalTrips;

    steps.push({
      line: 1,
      explanation: `Bus times: [${time.join(', ')}]. Need ${totalTrips} trips. Binary search from ${left} to ${right}.`,
      variables: { left, right, totalTrips },
      visualization: makeViz(
        time.reduce((acc, _, i) => ({ ...acc, [i]: 'pointer' }), {}),
        time.reduce((acc, t, i) => ({ ...acc, [i]: `${t}min/trip` }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      let trips = 0;
      for (const t of time) trips += Math.floor(mid / t);

      steps.push({
        line: 4,
        explanation: `Try time=${mid}. Total trips = ${trips}. Need ${totalTrips}.`,
        variables: { left, right, time: mid, totalTripsAchieved: trips, totalTrips },
        visualization: makeViz(
          time.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
          time.reduce((acc, t, i) => ({ ...acc, [i]: `${Math.floor(mid / t)}trips` }), {})
        ),
      });

      if (trips >= totalTrips) {
        steps.push({
          line: 7,
          explanation: `${trips} >= ${totalTrips}. Time ${mid} is enough. Try less: right = ${mid}.`,
          variables: { left, right, time: mid, trips },
          visualization: makeViz(
            time.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
            { 0: `t=${mid} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `${trips} < ${totalTrips}. Time ${mid} not enough. Try more: left = ${mid + 1}.`,
          variables: { left, right, time: mid, trips },
          visualization: makeViz(
            time.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            { 0: `t=${mid} low` }
          ),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum time = ${left}.`,
      variables: { result: left },
      visualization: makeViz(
        time.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        { 0: `ans=${left}` }
      ),
    });

    return steps;
  },
};

export default minimumTimeToCompleteTrips;
