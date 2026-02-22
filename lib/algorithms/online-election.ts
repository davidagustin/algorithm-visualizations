import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const onlineElection: AlgorithmDefinition = {
  id: 'online-election',
  title: 'Online Election',
  leetcodeNumber: 911,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given arrays of persons who voted at each time, answer queries about who is leading at time t. Precompute the leader at each vote time, then binary search for the largest time <= t to find the leader.',
  tags: ['binary search', 'array', 'design', 'precomputation'],

  code: {
    pseudocode: `class TopVotedCandidate:
  init(persons, times):
    compute leaders[] where leaders[i] = leader after i-th vote
  q(t):
    binary search times for largest index <= t
    return leaders[that index]

function computeLeaders(persons):
  count = {}
  leader = persons[0]
  leaders = []
  for p in persons:
    count[p]++
    if count[p] >= count[leader]:
      leader = p
    leaders.append(leader)
  return leaders`,
    python: `import bisect
class TopVotedCandidate:
    def __init__(self, persons, times):
        self.times = times
        count, leader = {}, persons[0]
        self.leaders = []
        for p in persons:
            count[p] = count.get(p, 0) + 1
            if count[p] >= count.get(leader, 0):
                leader = p
            self.leaders.append(leader)

    def q(self, t: int) -> int:
        idx = bisect.bisect_right(self.times, t) - 1
        return self.leaders[idx]`,
    javascript: `class TopVotedCandidate {
  constructor(persons, times) {
    this.times = times;
    const count = {};
    let leader = persons[0];
    this.leaders = [];
    for (const p of persons) {
      count[p] = (count[p] || 0) + 1;
      if (count[p] >= (count[leader] || 0)) leader = p;
      this.leaders.push(leader);
    }
  }
  q(t) {
    let lo = 0, hi = this.times.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (this.times[mid] <= t) lo = mid;
      else hi = mid - 1;
    }
    return this.leaders[lo];
  }
}`,
    java: `class TopVotedCandidate {
    int[] times, leaders;
    public TopVotedCandidate(int[] persons, int[] times) {
        this.times = times;
        leaders = new int[persons.length];
        Map<Integer,Integer> count = new HashMap<>();
        int leader = persons[0];
        for (int i = 0; i < persons.length; i++) {
            count.merge(persons[i], 1, Integer::sum);
            if (count.get(persons[i]) >= count.getOrDefault(leader, 0))
                leader = persons[i];
            leaders[i] = leader;
        }
    }
    public int q(int t) {
        int lo = 0, hi = times.length - 1;
        while (lo < hi) {
            int mid = (lo + hi + 1) / 2;
            if (times[mid] <= t) lo = mid; else hi = mid - 1;
        }
        return leaders[lo];
    }
}`,
  },

  defaultInput: {
    persons: [0, 1, 1, 0, 0, 1, 0],
    times: [0, 5, 10, 15, 20, 25, 30],
    queryTime: 12,
  },

  inputFields: [
    {
      name: 'persons',
      label: 'Persons (voter sequence)',
      type: 'array',
      defaultValue: [0, 1, 1, 0, 0, 1, 0],
      placeholder: '0,1,1,0,0,1,0',
      helperText: 'Person IDs in vote order',
    },
    {
      name: 'times',
      label: 'Times of votes',
      type: 'array',
      defaultValue: [0, 5, 10, 15, 20, 25, 30],
      placeholder: '0,5,10,15,20,25,30',
      helperText: 'Timestamps of each vote (strictly increasing)',
    },
    {
      name: 'queryTime',
      label: 'Query Time t',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Find leader at this time',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const persons = input.persons as number[];
    const times = input.times as number[];
    const queryTime = input.queryTime as number;
    const steps: AlgorithmStep[] = [];

    // Build leaders array
    const count: Record<number, number> = {};
    let leader = persons[0];
    const leaders: number[] = [];

    steps.push({
      line: 1,
      explanation: `Precompute leader after each vote. ${persons.length} votes total.`,
      variables: { votes: persons.length },
      visualization: {
        type: 'array',
        array: [...persons],
        highlights: {},
        labels: times.reduce((acc, t, i) => ({ ...acc, [i]: `t=${t}` }), {}),
      },
    });

    for (let i = 0; i < persons.length; i++) {
      const p = persons[i];
      count[p] = (count[p] || 0) + 1;
      if (count[p] >= (count[leader] || 0)) {
        leader = p;
      }
      leaders.push(leader);

      steps.push({
        line: 9,
        explanation: `Vote ${i}: person ${p} voted at t=${times[i]}. count[${p}]=${count[p]}. Leader=${leader}.`,
        variables: { i, person: p, time: times[i], leader, 'count[p]': count[p] },
        visualization: {
          type: 'array',
          array: [...leaders],
          highlights: { [i]: 'active' },
          labels: { [i]: `L=${leader}` },
        },
      });
    }

    steps.push({
      line: 12,
      explanation: `Leaders precomputed: [${leaders.join(', ')}]. Now query t=${queryTime} via binary search.`,
      variables: { leaders: leaders.join(','), queryTime },
      visualization: {
        type: 'array',
        array: [...times],
        highlights: {},
        labels: leaders.reduce((acc, l, i) => ({ ...acc, [i]: `L=${l}` }), {}),
      },
    });

    // Binary search
    let lo = 0;
    let hi = times.length - 1;

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);

      steps.push({
        line: 14,
        explanation: `Binary search: lo=${lo}, hi=${hi}, mid=${mid}. times[mid]=${times[mid]} vs t=${queryTime}.`,
        variables: { lo, mid, hi, 'times[mid]': times[mid], queryTime },
        visualization: {
          type: 'array',
          array: [...times],
          highlights: { [lo]: 'active', [mid]: 'comparing', [hi]: 'active' },
          labels: { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' },
        },
      });

      if (times[mid] <= queryTime) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    steps.push({
      line: 16,
      explanation: `Found: index ${lo}, times[${lo}]=${times[lo]} is the largest time <= ${queryTime}. Leader = ${leaders[lo]}.`,
      variables: { index: lo, time: times[lo], result: leaders[lo] },
      visualization: {
        type: 'array',
        array: [...times],
        highlights: { [lo]: 'found' },
        labels: { [lo]: `L=${leaders[lo]}` },
      },
    });

    return steps;
  },
};

export default onlineElection;
