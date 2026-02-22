import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const employeeFreeTime: AlgorithmDefinition = {
  id: 'employee-free-time',
  title: 'Employee Free Time',
  leetcodeNumber: 759,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Given a schedule of working intervals for each employee, find the common free time for all employees. Collect all intervals, sort by start time, merge overlapping ones, then identify the gaps between merged intervals. Those gaps represent time when all employees are free.',
  tags: ['interval', 'sorting', 'merge intervals', 'heap'],

  code: {
    pseudocode: `function employeeFreeTime(schedule):
  intervals = flatten all employee schedules
  sort intervals by start time
  merged = merge overlapping intervals
  free = []
  for i in 1..len(merged)-1:
    free.append([merged[i-1][1], merged[i][0]])
  return free`,

    python: `def employeeFreeTime(schedule):
    intervals = sorted([iv for emp in schedule for iv in emp], key=lambda x: x[0])
    merged = [intervals[0][:]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return [[merged[i][1], merged[i+1][0]] for i in range(len(merged)-1)]`,

    javascript: `function employeeFreeTime(schedule) {
  const intervals = schedule.flat().sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0].slice()];
  for (const [s, e] of intervals.slice(1)) {
    if (s <= merged[merged.length-1][1])
      merged[merged.length-1][1] = Math.max(merged[merged.length-1][1], e);
    else merged.push([s, e]);
  }
  return merged.slice(1).map(([s], i) => [merged[i][1], s]);
}`,

    java: `public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
    List<Interval> all = new ArrayList<>();
    for (List<Interval> emp : schedule) all.addAll(emp);
    all.sort((a, b) -> a.start - b.start);
    List<int[]> merged = new ArrayList<>();
    for (Interval iv : all) {
        if (merged.isEmpty() || merged.get(merged.size()-1)[1] < iv.start)
            merged.add(new int[]{iv.start, iv.end});
        else merged.get(merged.size()-1)[1] = Math.max(merged.get(merged.size()-1)[1], iv.end);
    }
    List<Interval> res = new ArrayList<>();
    for (int i = 1; i < merged.size(); i++)
        res.add(new Interval(merged.get(i-1)[1], merged.get(i)[0]));
    return res;
}`,
  },

  defaultInput: {
    schedule: [[[1, 3], [6, 7]], [[2, 4]], [[2, 5], [9, 12]]],
  },

  inputFields: [
    {
      name: 'schedule',
      label: 'Employee Schedule (JSON)',
      type: 'string',
      defaultValue: '[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]',
      placeholder: '[[[1,3],[6,7]],[[2,4]]]',
      helperText: 'JSON: array of employees, each with array of [start,end] intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const schedule = (typeof input.schedule === 'string'
      ? JSON.parse(input.schedule)
      : input.schedule) as number[][][];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: ${schedule.length} employee schedules. Flatten and sort all intervals by start time.`,
      variables: { employees: schedule.length },
      visualization: {
        type: 'array',
        array: schedule.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(schedule.map((emp, i) => [i, `emp${i}: ${JSON.stringify(emp)}`])),
      },
    });

    const flat: number[][] = schedule.flat();
    flat.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 2,
      explanation: `Flattened and sorted intervals: ${JSON.stringify(flat)}.`,
      variables: { flatCount: flat.length },
      visualization: {
        type: 'array',
        array: flat.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(flat.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
      },
    });

    const merged: number[][] = [flat[0].slice()];

    steps.push({
      line: 3,
      explanation: `Start merging. Initial merged list: [[${flat[0][0]},${flat[0][1]}]].`,
      variables: { merged: JSON.stringify(merged) },
      visualization: {
        type: 'array',
        array: merged.map(iv => iv[0]),
        highlights: { 0: 'found' },
        labels: { 0: `[${merged[0][0]},${merged[0][1]}]` },
      },
    });

    for (let i = 1; i < flat.length; i++) {
      const [s, e] = flat[i];
      const last = merged[merged.length - 1];

      if (s <= last[1]) {
        const prevEnd = last[1];
        last[1] = Math.max(last[1], e);
        steps.push({
          line: 5,
          explanation: `Interval [${s},${e}] overlaps last merged [${last[0]},${prevEnd}]. Extend to [${last[0]},${last[1]}].`,
          variables: { current: `[${s},${e}]`, merged: JSON.stringify(merged) },
          visualization: {
            type: 'array',
            array: merged.map(iv => iv[0]),
            highlights: { [merged.length - 1]: 'active' },
            labels: Object.fromEntries(merged.map((iv, j) => [j, `[${iv[0]},${iv[1]}]`])),
          },
        });
      } else {
        merged.push([s, e]);
        steps.push({
          line: 7,
          explanation: `Interval [${s},${e}] does not overlap. Add as new merged interval.`,
          variables: { current: `[${s},${e}]`, merged: JSON.stringify(merged) },
          visualization: {
            type: 'array',
            array: merged.map(iv => iv[0]),
            highlights: { [merged.length - 1]: 'found' },
            labels: Object.fromEntries(merged.map((iv, j) => [j, `[${iv[0]},${iv[1]}]`])),
          },
        });
      }
    }

    const free: number[][] = [];
    for (let i = 1; i < merged.length; i++) {
      free.push([merged[i - 1][1], merged[i][0]]);
    }

    steps.push({
      line: 9,
      explanation: `Gaps between merged intervals are free time: ${JSON.stringify(free)}.`,
      variables: { freeTime: JSON.stringify(free) },
      visualization: {
        type: 'array',
        array: free.length > 0 ? free.map(iv => iv[0]) : [0],
        highlights: Object.fromEntries(free.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(free.map((iv, i) => [i, `free [${iv[0]},${iv[1]}]`])),
      },
    });

    return steps;
  },
};

export default employeeFreeTime;
