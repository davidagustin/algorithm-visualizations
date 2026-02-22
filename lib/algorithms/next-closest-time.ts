import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextClosestTime: AlgorithmDefinition = {
  id: 'next-closest-time',
  title: 'Next Closest Time',
  leetcodeNumber: 681,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a time "HH:MM", find the next closest time by reusing the same digits. Iterate minutes forward (one minute at a time) until all four digits of the new time are a subset of the original digits. O(1) since at most 1440 iterations for minutes in a day.',
  tags: ['String', 'Simulation', 'Enumeration'],
  code: {
    pseudocode: `function nextClosestTime(time):
  digits = set of digits in time
  minutes = HH*60 + MM
  for i from 1 to 1440:
    minutes = (minutes + 1) % 1440
    HH = minutes / 60
    MM = minutes % 60
    candidate = format(HH, MM)
    if all chars in candidate in digits:
      return candidate`,
    python: `def nextClosestTime(time):
    digits = set(time.replace(':', ''))
    h, m = int(time[:2]), int(time[3:])
    total = h*60 + m
    for _ in range(1440):
        total = (total+1) % 1440
        nh, nm = total//60, total%60
        candidate = f"{nh:02d}:{nm:02d}"
        if all(c in digits for c in candidate if c != ':'):
            return candidate`,
    javascript: `function nextClosestTime(time) {
  const digits = new Set(time.replace(':', ''));
  let total = parseInt(time)*60 + parseInt(time.slice(3));
  for (let i = 0; i < 1440; i++) {
    total = (total+1) % 1440;
    const nh = String(Math.floor(total/60)).padStart(2,'0');
    const nm = String(total%60).padStart(2,'0');
    const cand = nh+':'+nm;
    if ([...cand].every(c=>c===':'||digits.has(c))) return cand;
  }
}`,
    java: `public String nextClosestTime(String time) {
    Set<Character> digits=new HashSet<>();
    for(char c:time.toCharArray()) if(c!=':') digits.add(c);
    int total=Integer.parseInt(time.substring(0,2))*60+Integer.parseInt(time.substring(3));
    for(int i=0;i<1440;i++){
        total=(total+1)%1440;
        String cand=String.format("%02d:%02d",total/60,total%60);
        boolean ok=true;
        for(char c:cand.toCharArray()) if(c!=':'&&!digits.contains(c)){ok=false;break;}
        if(ok) return cand;
    }
    return "";
}`,
  },
  defaultInput: { time: '19:34' },
  inputFields: [
    {
      name: 'time',
      label: 'Time',
      type: 'string',
      defaultValue: '19:34',
      placeholder: '19:34',
      helperText: 'Time in HH:MM format',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const time = (input.time as string) || '19:34';
    const steps: AlgorithmStep[] = [];

    const digits = new Set(time.replace(':', '').split(''));
    const h = parseInt(time.substring(0, 2));
    const m = parseInt(time.substring(3));
    let total = h * 60 + m;

    const timeAsArr = [h, m, total, 0];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: { label: 'Next Closest Time', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `nextClosestTime("${time}"). Digits available: {${[...digits].join(',')}}. Current total minutes: ${total}.`,
      variables: { time, digits: [...digits], totalMinutes: total },
      visualization: makeViz(
        [h, m, total, 0],
        {},
        { 0: `H=${h}`, 1: `M=${m}`, 2: `total=${total}`, 3: 'tries=0' },
        [{ key: 'Input', value: time }, { key: 'Digits', value: `{${[...digits].join(',')}}` }],
      ),
    });

    let found = '';
    let tries = 0;
    for (let i = 0; i < 1440; i++) {
      total = (total + 1) % 1440;
      tries++;
      const nh = Math.floor(total / 60);
      const nm = total % 60;
      const nhStr = String(nh).padStart(2, '0');
      const nmStr = String(nm).padStart(2, '0');
      const cand = `${nhStr}:${nmStr}`;
      const valid = cand.split('').every(c => c === ':' || digits.has(c));

      if (tries <= 5 || valid) {
        steps.push({
          line: 7,
          explanation: `Try ${tries}: ${cand}. Digits: ${nhStr.split('').concat(nmStr.split('')).map(d => `${d}∈{${[...digits].join(',')}}?${digits.has(d)}`).join(', ')}. Valid: ${valid}.`,
          variables: { candidate: cand, valid, tries, totalMinutes: total },
          visualization: makeViz(
            [nh, nm, total, tries],
            { 0: valid ? 'found' : 'comparing', 1: valid ? 'found' : 'comparing' },
            { 0: `H=${nhStr}`, 1: `M=${nmStr}`, 2: `total=${total}`, 3: `tries=${tries}` },
            [{ key: 'Candidate', value: cand }, { key: 'Valid', value: String(valid) }, { key: 'Tries', value: String(tries) }],
          ),
        });
      }

      if (valid) { found = cand; break; }
    }

    steps.push({
      line: 9,
      explanation: `Found next closest time: "${found}" after ${tries} tries.`,
      variables: { result: found, tries },
      visualization: makeViz(
        [Math.floor(total / 60), total % 60, total, tries],
        { 0: 'found', 1: 'found' },
        { 0: `H=${found.substring(0, 2)}`, 1: `M=${found.substring(3)}`, 2: `total=${total}`, 3: `tries=${tries}` },
        [{ key: 'Answer', value: found }, { key: 'Tries', value: String(tries) }],
      ),
    });

    return steps;
  },
};

export default nextClosestTime;
