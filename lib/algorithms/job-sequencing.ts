import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const jobSequencing: AlgorithmDefinition = {
  id: 'job-sequencing',
  title: 'Job Sequencing with Deadlines',
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given jobs each with a deadline and profit, schedule at most one job per time slot to maximize total profit. All jobs take 1 unit of time. Greedy: sort jobs by profit descending. For each job, assign it to the latest available slot at or before its deadline.',
  tags: ['Greedy', 'Sorting', 'Array'],
  code: {
    pseudocode: `function jobSequencing(jobs):
  sort jobs by profit descending
  maxDeadline = max deadline across all jobs
  slots = array of -1 with length maxDeadline
  totalProfit = 0, count = 0
  for each job (deadline d, profit p):
    for t from min(maxDeadline, d) down to 1:
      if slots[t-1] == -1:
        slots[t-1] = job.id
        totalProfit += p
        count++
        break
  return (count, totalProfit)`,
    python: `def jobSequencing(jobs):
    jobs.sort(key=lambda x: -x[2])  # sort by profit desc
    max_d = max(j[1] for j in jobs)
    slots = [-1] * max_d
    profit = count = 0
    for job_id, d, p in jobs:
        for t in range(min(max_d, d) - 1, -1, -1):
            if slots[t] == -1:
                slots[t] = job_id
                profit += p
                count += 1
                break
    return count, profit`,
    javascript: `function jobSequencing(jobs) {
  jobs.sort((a, b) => b.profit - a.profit);
  const maxD = Math.max(...jobs.map(j => j.deadline));
  const slots = new Array(maxD).fill(-1);
  let profit = 0, count = 0;
  for (const { id, deadline, profit: p } of jobs) {
    for (let t = Math.min(maxD, deadline) - 1; t >= 0; t--) {
      if (slots[t] === -1) {
        slots[t] = id; profit += p; count++; break;
      }
    }
  }
  return { count, profit };
}`,
    java: `public int[] jobSequencing(int[][] jobs) {
    Arrays.sort(jobs, (a, b) -> b[2] - a[2]);
    int maxD = Arrays.stream(jobs).mapToInt(j -> j[1]).max().orElse(0);
    int[] slots = new int[maxD]; Arrays.fill(slots, -1);
    int profit = 0, count = 0;
    for (int[] job : jobs) {
        for (int t = Math.min(maxD, job[1]) - 1; t >= 0; t--) {
            if (slots[t] == -1) {
                slots[t] = job[0]; profit += job[2]; count++; break;
            }
        }
    }
    return new int[]{count, profit};
}`,
  },
  defaultInput: {
    jobs: [
      { id: 1, deadline: 2, profit: 100 },
      { id: 2, deadline: 1, profit: 19 },
      { id: 3, deadline: 2, profit: 27 },
      { id: 4, deadline: 1, profit: 25 },
      { id: 5, deadline: 3, profit: 15 },
    ],
  },
  inputFields: [
    {
      name: 'jobs',
      label: 'Jobs (id, deadline, profit)',
      type: 'array',
      defaultValue: [
        { id: 1, deadline: 2, profit: 100 },
        { id: 2, deadline: 1, profit: 19 },
        { id: 3, deadline: 2, profit: 27 },
        { id: 4, deadline: 1, profit: 25 },
        { id: 5, deadline: 3, profit: 15 },
      ],
      helperText: 'Array of job objects with id, deadline, and profit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    type Job = { id: number; deadline: number; profit: number };
    const rawJobs = (input.jobs as Job[]).map(j => ({ ...j }));
    const jobs = rawJobs.slice().sort((a, b) => b.profit - a.profit);
    const maxD = Math.max(...jobs.map(j => j.deadline));
    const slots: number[] = new Array(maxD).fill(-1); // slot[t] = job id
    const steps: AlgorithmStep[] = [];
    let totalProfit = 0, count = 0;

    // Visualization: show profit array (sorted jobs)
    const profits = jobs.map(j => j.profit);

    function makeViz(activeJobIdx: number | null, slotFilled: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < jobs.length; i++) {
        labels[i] = `J${jobs[i].id}:${jobs[i].profit}`;
        if (slots.some((s, t) => s === jobs[i].id)) highlights[i] = 'found';
        else if (i === activeJobIdx) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: profits.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Job Schedule',
          entries: [
            { key: 'Jobs (sorted by profit)', value: jobs.map(j => `J${j.id}(d=${j.deadline},p=${j.profit})`).join(', ') },
            { key: 'Time slots', value: slots.map((s, t) => `t${t + 1}:${s === -1 ? 'free' : `J${s}`}`).join(', ') },
            { key: 'Jobs scheduled', value: String(count) },
            { key: 'Total profit', value: String(totalProfit) },
            ...(slotFilled !== null ? [{ key: 'Slot assigned', value: `t${slotFilled + 1}` }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort jobs by profit descending: ${jobs.map(j => `J${j.id}(d=${j.deadline},p=${j.profit})`).join(', ')}. maxDeadline=${maxD}.`,
      variables: { jobs: jobs.map(j => ({ ...j })), maxD },
      visualization: makeViz(null, null),
    });

    for (let ji = 0; ji < jobs.length; ji++) {
      const job = jobs[ji];
      steps.push({
        line: 5,
        explanation: `Process J${job.id} (deadline=${job.deadline}, profit=${job.profit}). Find latest free slot at or before deadline ${job.deadline}.`,
        variables: { jobId: job.id, deadline: job.deadline, profit: job.profit },
        visualization: makeViz(ji, null),
      });

      let assigned = false;
      for (let t = Math.min(maxD, job.deadline) - 1; t >= 0; t--) {
        if (slots[t] === -1) {
          slots[t] = job.id;
          totalProfit += job.profit;
          count++;
          assigned = true;
          steps.push({
            line: 8,
            explanation: `Assigned J${job.id} to slot t${t + 1}. Total profit: ${totalProfit}, jobs scheduled: ${count}.`,
            variables: { jobId: job.id, slot: t + 1, totalProfit, count },
            visualization: makeViz(ji, t),
          });
          break;
        }
      }
      if (!assigned) {
        steps.push({
          line: 7,
          explanation: `No free slot for J${job.id} (all slots up to deadline ${job.deadline} taken). Skip.`,
          variables: { jobId: job.id, reason: 'no free slot' },
          visualization: (() => {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            for (let i = 0; i < jobs.length; i++) {
              l[i] = `J${jobs[i].id}:${jobs[i].profit}`;
              h[i] = slots.some(s => s === jobs[i].id) ? 'found' : (i === ji ? 'mismatch' : 'default');
            }
            return {
              type: 'array' as const,
              array: profits.slice(),
              highlights: h,
              labels: l,
              auxData: {
                label: 'Job Schedule',
                entries: [
                  { key: 'J' + job.id, value: 'No free slot - skipped' },
                  { key: 'Slots', value: slots.map((s, t) => `t${t + 1}:${s === -1 ? 'free' : `J${s}`}`).join(', ') },
                  { key: 'Total profit', value: String(totalProfit) },
                ],
              },
            };
          })(),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Job sequencing complete. Scheduled ${count} job(s), total profit = ${totalProfit}.`,
      variables: { count, totalProfit },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < jobs.length; i++) {
          l[i] = `J${jobs[i].id}:${jobs[i].profit}`;
          h[i] = slots.some(s => s === jobs[i].id) ? 'found' : 'visited';
        }
        return {
          type: 'array' as const,
          array: profits.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Jobs scheduled', value: String(count) },
              { key: 'Max profit', value: String(totalProfit) },
              { key: 'Schedule', value: slots.map((s, t) => `t${t + 1}:${s === -1 ? '-' : `J${s}`}`).join(', ') },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default jobSequencing;
