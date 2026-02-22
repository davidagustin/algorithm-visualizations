import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumTimeToCompleteAllTasks: AlgorithmDefinition = {
  id: 'minimum-time-to-complete-all-tasks',
  title: 'Minimum Time to Complete All Tasks',
  leetcodeNumber: 2589,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'A computer can run tasks with given durations and execution windows [start, end]. A task must run for exactly duration seconds within its [start, end] interval. Find the minimum total seconds the computer must be running. Use greedy: sort by end time, then for each task greedily reuse already-running seconds in its window and add new time at the end if needed.',
  tags: ['Graph', 'Greedy', 'Topological Sort', 'Sorting'],
  code: {
    pseudocode: `function findMinimumTime(tasks):
  sort tasks by end time
  running = boolean array of size max_end+1
  for [start, end, duration] in tasks:
    // count already-running seconds in [start, end]
    count = sum(running[start..end])
    remaining = duration - count
    // greedily assign from end backwards
    t = end
    while remaining > 0:
      if not running[t]:
        running[t] = true
        remaining -= 1
      t -= 1
  return sum(running)`,
    python: `def findMinimumTime(tasks):
    tasks.sort(key=lambda x: x[1])
    maxEnd = max(t[1] for t in tasks)
    running = [False] * (maxEnd + 1)
    for start, end, duration in tasks:
        count = sum(running[start:end+1])
        remaining = duration - count
        t = end
        while remaining > 0:
            if not running[t]:
                running[t] = True
                remaining -= 1
            t -= 1
    return sum(running)`,
    javascript: `function findMinimumTime(tasks) {
  tasks.sort((a,b)=>a[1]-b[1]);
  const maxEnd=Math.max(...tasks.map(t=>t[1]));
  const running=new Array(maxEnd+1).fill(false);
  for(const[start,end,dur]of tasks){
    let count=0;
    for(let i=start;i<=end;i++)if(running[i])count++;
    let remaining=dur-count,t=end;
    while(remaining>0){
      if(!running[t]){running[t]=true;remaining--;}
      t--;
    }
  }
  return running.filter(Boolean).length;
}`,
    java: `public int findMinimumTime(int[][] tasks) {
    Arrays.sort(tasks,(a,b)->a[1]-b[1]);
    int maxEnd=0;for(int[]t:tasks)maxEnd=Math.max(maxEnd,t[1]);
    boolean[]running=new boolean[maxEnd+1];
    for(int[]task:tasks){
        int count=0;
        for(int i=task[0];i<=task[1];i++)if(running[i])count++;
        int rem=task[2]-count,t=task[1];
        while(rem>0){if(!running[t]){running[t]=true;rem--;}t--;}
    }
    int ans=0;for(boolean b:running)if(b)ans++;
    return ans;
}`,
  },
  defaultInput: {
    tasks: [[2, 3, 1], [4, 5, 1], [1, 5, 2]],
  },
  inputFields: [
    {
      name: 'tasks',
      label: 'Tasks [start, end, duration]',
      type: 'array',
      defaultValue: [[2, 3, 1], [4, 5, 1], [1, 5, 2]],
      placeholder: '[[2,3,1],[4,5,1],[1,5,2]]',
      helperText: 'Task must run for duration seconds within [start, end]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tasks = (input.tasks as number[][]).map(t => [...t]).sort((a, b) => a[1] - b[1]);
    const steps: AlgorithmStep[] = [];

    const maxEnd = Math.max(...tasks.map(t => t[1]));
    const running = new Array(maxEnd + 1).fill(false);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      currentTask: number,
      totalRunning: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: running.slice(1).map(b => b ? 1 : 0),
        highlights,
        labels,
        auxData: {
          label: 'Minimum Task Time (Greedy)',
          entries: [
            { key: 'Current Task', value: currentTask >= 0 ? `[${tasks[currentTask].join(',')}]` : 'done' },
            { key: 'Total Running', value: String(totalRunning) },
            { key: 'Timeline', value: `1..${maxEnd}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort ${tasks.length} tasks by end time: ${tasks.map(t => `[${t.join(',')}]`).join(', ')}. Timeline: 1..${maxEnd}.`,
      variables: { tasks: tasks.map(t => `[${t.join(',')}]`) },
      visualization: makeViz({}, {}, -1, 0),
    });

    for (let ti = 0; ti < tasks.length; ti++) {
      const [start, end, duration] = tasks[ti];
      let count = 0;
      for (let i = start; i <= end; i++) if (running[i]) count++;
      let remaining = duration - count;

      const taskHighlights: Record<number, string> = {};
      for (let i = start - 1; i < end; i++) taskHighlights[i] = running[i + 1] ? 'found' : 'active';

      steps.push({
        line: 4,
        explanation: `Task [${start},${end},${duration}]: Already running ${count} sec in window. Need ${remaining} more seconds.`,
        variables: { start, end, duration, count, remaining },
        visualization: makeViz(
          taskHighlights,
          Object.fromEntries(Array.from({ length: maxEnd }, (_, i) => [i, `t${i + 1}`])),
          ti,
          running.filter(Boolean).length
        ),
      });

      let t = end;
      while (remaining > 0) {
        if (!running[t]) {
          running[t] = true;
          remaining--;
          const newHighlights: Record<number, string> = { ...taskHighlights, [t - 1]: 'comparing' };
          steps.push({
            line: 9,
            explanation: `Assign second t=${t} to this task. remaining=${remaining}.`,
            variables: { t, remaining },
            visualization: makeViz(
              newHighlights,
              {},
              ti,
              running.filter(Boolean).length
            ),
          });
        }
        t--;
      }
    }

    const total = running.filter(Boolean).length;
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < maxEnd; i++) finalHighlights[i] = running[i + 1] ? 'found' : 'default';

    steps.push({
      line: 12,
      explanation: `Minimum computer running time: ${total} seconds. Running slots marked.`,
      variables: { result: total },
      visualization: makeViz(finalHighlights, Object.fromEntries(Array.from({ length: maxEnd }, (_, i) => [i, `${i + 1}`])), -1, total),
    });

    return steps;
  },
};

export default minimumTimeToCompleteAllTasks;
