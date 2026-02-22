import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subdomainVisitCount: AlgorithmDefinition = {
  id: 'subdomain-visit-count',
  title: 'Subdomain Visit Count',
  leetcodeNumber: 811,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a list of count-domain pairs, count visits to each subdomain. For each entry, split the domain by dots and accumulate the visit count to every suffix (subdomain level). Store counts in a hash map and return formatted results.',
  tags: ['hash map', 'string', 'array'],

  code: {
    pseudocode: `function subdomainVisits(cpdomains):
  counts = {}
  for entry in cpdomains:
    count, domain = entry.split()
    count = int(count)
    parts = domain.split(".")
    for i in range(len(parts)):
      sub = ".".join(parts[i:])
      counts[sub] = counts.get(sub, 0) + count
  return [f"{v} {k}" for k, v in counts.items()]`,

    python: `def subdomainVisits(cpdomains: list[str]) -> list[str]:
    counts = {}
    for entry in cpdomains:
        cnt, domain = entry.split()
        cnt = int(cnt)
        parts = domain.split(".")
        for i in range(len(parts)):
            sub = ".".join(parts[i:])
            counts[sub] = counts.get(sub, 0) + cnt
    return [f"{v} {k}" for k, v in counts.items()]`,

    javascript: `function subdomainVisits(cpdomains) {
  const counts = new Map();
  for (const entry of cpdomains) {
    const [cntStr, domain] = entry.split(' ');
    const cnt = +cntStr;
    const parts = domain.split('.');
    for (let i = 0; i < parts.length; i++) {
      const sub = parts.slice(i).join('.');
      counts.set(sub, (counts.get(sub) || 0) + cnt);
    }
  }
  return [...counts.entries()].map(([k, v]) => v + " " + k);
}`,

    java: `public List<String> subdomainVisits(String[] cpdomains) {
    Map<String, Integer> counts = new HashMap<>();
    for (String entry : cpdomains) {
        String[] kv = entry.split(" ");
        int cnt = Integer.parseInt(kv[0]);
        String[] parts = kv[1].split("\\.");
        for (int i = 0; i < parts.length; i++) {
            String sub = String.join(".", Arrays.copyOfRange(parts, i, parts.length));
            counts.merge(sub, cnt, Integer::sum);
        }
    }
    return counts.entrySet().stream().map(e -> e.getValue() + " " + e.getKey()).collect(Collectors.toList());
}`,
  },

  defaultInput: {
    cpdomains: ['9001 discuss.leetcode.com', '50 yahoo.com', '1 intel.mail.com', '5 wiki.org'],
  },

  inputFields: [
    {
      name: 'cpdomains',
      label: 'Count-Domain Pairs',
      type: 'array',
      defaultValue: ['9001 discuss.leetcode.com', '50 yahoo.com', '1 intel.mail.com', '5 wiki.org'],
      placeholder: '9001 discuss.leetcode.com,50 yahoo.com',
      helperText: 'Each entry: "count domain"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cpdomains = input.cpdomains as string[];
    const steps: AlgorithmStep[] = [];
    const counts: Record<string, number> = {};

    steps.push({
      line: 1,
      explanation: `Process ${cpdomains.length} entries. For each domain, add visit count to every subdomain level.`,
      variables: { counts: '{}' },
      visualization: {
        type: 'array',
        array: cpdomains as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < cpdomains.length; i++) {
      const [cntStr, domain] = cpdomains[i].split(' ');
      const cnt = parseInt(cntStr);
      const parts = domain.split('.');

      steps.push({
        line: 3,
        explanation: `Entry ${i}: count=${cnt}, domain="${domain}". Split into parts: [${parts.join(', ')}].`,
        variables: { i, count: cnt, domain, parts: parts.join(', ') },
        visualization: {
          type: 'array',
          array: cpdomains as unknown as number[],
          highlights: { [i]: 'active' },
          labels: { [i]: `${cnt} visits` },
        },
      });

      for (let j = 0; j < parts.length; j++) {
        const sub = parts.slice(j).join('.');
        counts[sub] = (counts[sub] || 0) + cnt;

        steps.push({
          line: 7,
          explanation: `Subdomain "${sub}": counts["${sub}"] += ${cnt} -> ${counts[sub]}.`,
          variables: { subdomain: sub, addedCount: cnt, totalCount: counts[sub], counts: JSON.stringify(counts) },
          visualization: {
            type: 'array',
            array: cpdomains as unknown as number[],
            highlights: { [i]: 'comparing' },
            labels: { [i]: sub },
          },
        });
      }
    }

    const result = Object.entries(counts).map(([k, v]) => `${v} ${k}`);

    steps.push({
      line: 9,
      explanation: `Done. Subdomain visit counts: ${result.join(', ')}.`,
      variables: { result: result.join(', '), counts: JSON.stringify(counts) },
      visualization: {
        type: 'array',
        array: cpdomains as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default subdomainVisitCount;
