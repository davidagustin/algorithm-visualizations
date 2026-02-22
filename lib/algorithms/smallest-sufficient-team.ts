import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const smallestSufficientTeam: AlgorithmDefinition = {
  id: 'smallest-sufficient-team',
  title: 'Smallest Sufficient Team',
  leetcodeNumber: 1125,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Find the smallest team of people such that the team covers all required skills. Each person has a subset of skills. Uses bitmask DP where dp[mask] = minimum people needed to cover the skills in mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function smallestSufficientTeam(req_skills, people):
  m = length(req_skills)
  skillIndex = map each skill to index
  n = length(people)
  dp = array of size 2^m, fill INF
  dp[0] = 0
  for mask from 0 to 2^m - 1:
    if dp[mask] == INF: continue
    for i from 0 to n-1:
      next = mask | skillMask[i]
      if dp[next] > dp[mask] + 1:
        dp[next] = dp[mask] + 1
  return dp[(1<<m)-1]`,
    python: `def smallestSufficientTeam(req_skills, people):
    m = len(req_skills)
    skill_idx = {s: i for i, s in enumerate(req_skills)}
    dp = [float('inf')] * (1 << m)
    dp[0] = 0
    for mask in range(1 << m):
        if dp[mask] == float('inf'):
            continue
        for skills in people:
            nxt = mask
            for s in skills:
                if s in skill_idx:
                    nxt |= 1 << skill_idx[s]
            dp[nxt] = min(dp[nxt], dp[mask] + 1)
    return dp[(1 << m) - 1]`,
    javascript: `function smallestSufficientTeam(req_skills, people) {
  const m = req_skills.length;
  const skillIdx = Object.fromEntries(req_skills.map((s, i) => [s, i]));
  const dp = new Array(1 << m).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < (1 << m); mask++) {
    if (dp[mask] === Infinity) continue;
    for (const skills of people) {
      let nxt = mask;
      for (const s of skills) {
        if (s in skillIdx) nxt |= 1 << skillIdx[s];
      }
      dp[nxt] = Math.min(dp[nxt], dp[mask] + 1);
    }
  }
  return dp[(1 << m) - 1];
}`,
    java: `public int[] smallestSufficientTeam(String[] req_skills, List<List<String>> people) {
    int m = req_skills.length;
    Map<String,Integer> idx = new HashMap<>();
    for (int i = 0; i < m; i++) idx.put(req_skills[i], i);
    int[] dp = new int[1 << m];
    Arrays.fill(dp, Integer.MAX_VALUE / 2);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << m); mask++) {
        if (dp[mask] == Integer.MAX_VALUE / 2) continue;
        for (List<String> p : people) {
            int nxt = mask;
            for (String s : p) if (idx.containsKey(s)) nxt |= 1 << idx.get(s);
            if (dp[nxt] > dp[mask] + 1) dp[nxt] = dp[mask] + 1;
        }
    }
    return new int[]{dp[(1 << m) - 1]};
}`,
  },
  defaultInput: {
    req_skills: ['java', 'nodejs', 'reactjs'],
    people: [['java'], ['nodejs'], ['nodejs', 'reactjs']],
  },
  inputFields: [
    {
      name: 'req_skills',
      label: 'Required Skills',
      type: 'array',
      defaultValue: ['java', 'nodejs', 'reactjs'],
      placeholder: 'java,nodejs,reactjs',
      helperText: 'List of required skills',
    },
    {
      name: 'people',
      label: 'People Skills (JSON)',
      type: 'string',
      defaultValue: '[["java"],["nodejs"],["nodejs","reactjs"]]',
      placeholder: '[["java"],["nodejs"]]',
      helperText: 'JSON array of skill arrays per person',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const reqSkills = input.req_skills as string[];
    const m = Math.min(reqSkills.length, 4);
    const skills = reqSkills.slice(0, m);
    const skillIdx: Record<string, number> = Object.fromEntries(skills.map((s, i) => [s, i]));
    let people: string[][];
    try {
      people = JSON.parse(input.people as string) as string[][];
    } catch {
      people = [['java'], ['nodejs'], ['nodejs', 'reactjs']];
    }

    const size = 1 << m;
    const INF = 9999;
    const dp: (number | null)[] = new Array(size).fill(INF);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(m, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) < INF) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    dp[0] = 0;
    steps.push({
      line: 1,
      explanation: `skills=${JSON.stringify(skills)}, m=${m}. dp[mask]=min people to cover skills in mask. dp[0]=0.`,
      variables: { skills, m },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) >= INF) continue;
      for (const personSkills of people.slice(0, 4)) {
        let nxt = mask;
        for (const s of personSkills) {
          if (s in skillIdx) nxt |= 1 << skillIdx[s];
        }
        if ((dp[mask] as number) + 1 < (dp[nxt] as number)) {
          dp[nxt] = (dp[mask] as number) + 1;
          steps.push({
            line: 9,
            explanation: `mask=${mask.toString(2).padStart(m,'0')}, person [${personSkills}]: nxt=${nxt.toString(2).padStart(m,'0')}. dp[nxt]=${dp[nxt]}.`,
            variables: { mask, personSkills, nxt, 'dp[nxt]': dp[nxt] },
            visualization: makeViz(nxt, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 11,
      explanation: `dp[${fullMask.toString(2).padStart(m,'0')}]=${dp[fullMask]}. Minimum team size to cover all skills: ${dp[fullMask]}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default smallestSufficientTeam;
