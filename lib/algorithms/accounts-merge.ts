import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const accountsMerge: AlgorithmDefinition = {
  id: 'accounts-merge',
  title: 'Accounts Merge',
  leetcodeNumber: 721,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a list of accounts where each account has a name and list of emails, merge accounts that share a common email. Two accounts belong to the same person if they share any email. Uses Union-Find: union all emails within an account, then group by root.',
  tags: ['Graph', 'Union Find', 'DFS', 'Hash Map'],
  code: {
    pseudocode: `function accountsMerge(accounts):
  parent = {}
  emailToName = {}
  def find(x): path compress
  def union(x, y): merge by rank
  for account in accounts:
    name = account[0]
    for email in account[1:]:
      emailToName[email] = name
      parent.setdefault(email, email)
      union(account[1], email)  // union all to first
  groups = defaultdict(list)
  for email in parent:
    groups[find(email)].append(email)
  return [[emailToName[root]] + sorted(emails) for root, emails in groups.items()]`,
    python: `def accountsMerge(accounts):
    parent = {}
    def find(x):
        if parent.setdefault(x,x) != x: parent[x]=find(parent[x])
        return parent[x]
    def union(x, y): parent[find(x)]=find(y)
    emailToName = {}
    for acc in accounts:
        name = acc[0]
        for email in acc[1:]:
            emailToName[email] = name
            union(acc[1], email)
    groups = defaultdict(list)
    for email in emailToName:
        groups[find(email)].append(email)
    return [[emailToName[root]]+sorted(emails) for root,emails in groups.items()]`,
    javascript: `function accountsMerge(accounts) {
  const parent = {}, rank = {}, emailToName = {};
  const find = x => { if (parent[x]===undefined) parent[x]=x; return parent[x]===x?x:(parent[x]=find(parent[x])); };
  const union = (x,y) => { const [px,py]=[find(x),find(y)]; if(px!==py){if((rank[px]||0)>=(rank[py]||0)){parent[py]=px;if(rank[px]===rank[py]) rank[px]=(rank[px]||0)+1;}else parent[px]=py;} };
  for (const acc of accounts) {
    const name=acc[0];
    for (let i=1;i<acc.length;i++) { emailToName[acc[i]]=name; union(acc[1],acc[i]); }
  }
  const groups={};
  for (const email of Object.keys(emailToName)) { const root=find(email); (groups[root]=groups[root]||[]).push(email); }
  return Object.entries(groups).map(([root,emails])=>[emailToName[root],...emails.sort()]);
}`,
    java: `public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String,String> parent=new HashMap<>(), emailToName=new HashMap<>();
    for(List<String> acc:accounts) for(int i=1;i<acc.size();i++){parent.put(acc.get(i),acc.get(i));emailToName.put(acc.get(i),acc.get(0));}
    for(List<String> acc:accounts) for(int i=2;i<acc.size();i++) union(parent,acc.get(1),acc.get(i));
    Map<String,TreeSet<String>> groups=new HashMap<>();
    for(String e:parent.keySet()) groups.computeIfAbsent(find(parent,e),k->new TreeSet<>()).add(e);
    List<List<String>> res=new ArrayList<>();
    for(Map.Entry<String,TreeSet<String>> en:groups.entrySet()){List<String> l=new ArrayList<>();l.add(emailToName.get(en.getKey()));l.addAll(en.getValue());res.add(l);}
    return res;
}`,
  },
  defaultInput: {
    accounts: [
      ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
      ['John', 'johnsmith@mail.com', 'john00@mail.com'],
      ['Mary', 'mary@mail.com'],
      ['John', 'johnnybravo@mail.com'],
    ],
  },
  inputFields: [
    {
      name: 'accounts',
      label: 'Accounts [[name, email1, email2,...],...]',
      type: 'array',
      defaultValue: [
        ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
        ['John', 'johnsmith@mail.com', 'john00@mail.com'],
        ['Mary', 'mary@mail.com'],
        ['John', 'johnnybravo@mail.com'],
      ],
      placeholder: '[["John","a@x.com","b@x.com"],["Mary","c@x.com"]]',
      helperText: 'Each sub-array: [name, email1, email2, ...]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const accounts = input.accounts as string[][];
    const steps: AlgorithmStep[] = [];

    // Collect all unique emails
    const allEmails: string[] = [];
    const emailSet = new Set<string>();
    const emailToName: Record<string, string> = {};
    for (const acc of accounts) {
      const name = acc[0];
      for (let i = 1; i < acc.length; i++) {
        if (!emailSet.has(acc[i])) {
          emailSet.add(acc[i]);
          allEmails.push(acc[i]);
        }
        emailToName[acc[i]] = name;
      }
    }

    const n = allEmails.length;
    const emailToIdx: Record<string, number> = {};
    allEmails.forEach((e, i) => { emailToIdx[e] = i; });

    const parent = allEmails.map((_, i) => i);
    const rank = new Array(n).fill(0);

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x: number, y: number) {
      const px = find(x), py = find(y);
      if (px === py) return;
      if (rank[px] >= rank[py]) {
        parent[py] = px;
        if (rank[px] === rank[py]) rank[px]++;
      } else {
        parent[px] = py;
      }
    }

    function makeViz(
      highlights: Record<number, string>,
      phase: string,
      mergedCount: number
    ): ArrayVisualization {
      const roots = new Set(allEmails.map((_, i) => find(i)));
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        const root = find(i);
        labels[i] = `r${root}`;
      }
      return {
        type: 'array',
        array: allEmails.map((_, i) => find(i)),
        highlights,
        labels,
        auxData: {
          label: 'Union-Find State',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Emails', value: String(n) },
            { key: 'Components', value: String(roots.size) },
            { key: 'Merged accounts', value: String(mergedCount) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${accounts.length} accounts, ${n} unique emails. Union-Find: union emails within same account. Array shows each email's root index.`,
      variables: { accounts: accounts.length, emails: n },
      visualization: makeViz({}, 'Init', 0),
    });

    for (let ai = 0; ai < accounts.length; ai++) {
      const acc = accounts[ai];
      const name = acc[0];
      const emails = acc.slice(1);
      const firstIdx = emailToIdx[emails[0]];

      steps.push({
        line: 9,
        explanation: `Account "${name}" (#${ai + 1}): union all emails to first email "${emails[0]}".`,
        variables: { name, emails },
        visualization: makeViz({ [firstIdx]: 'active' }, `Processing "${name}"`, 0),
      });

      for (let i = 1; i < emails.length; i++) {
        const ei = emailToIdx[emails[i]];
        const prevRoot = find(ei);
        union(firstIdx, ei);
        const newRoot = find(ei);

        steps.push({
          line: 11,
          explanation: `Union "${emails[0]}" and "${emails[i]}". ${prevRoot !== newRoot ? 'Merged components.' : 'Already in same component.'}`,
          variables: { email1: emails[0], email2: emails[i] },
          visualization: makeViz({ [firstIdx]: 'active', [ei]: 'found' }, `Unioning`, 0),
        });
      }
    }

    // Group by root
    const groups = new Map<number, string[]>();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(allEmails[i]);
    }

    const mergedCount = groups.size;
    const finalHL: Record<number, string> = {};
    const colors = ['found', 'active', 'pointer', 'comparing', 'match'];
    let ci = 0;
    for (const [root, emails] of groups) {
      const color = colors[ci % colors.length];
      for (const e of emails) finalHL[emailToIdx[e]] = color;
      ci++;
    }

    steps.push({
      line: 14,
      explanation: `Union-Find complete. ${mergedCount} merged account(s). Each color group = one merged account.`,
      variables: { mergedAccounts: mergedCount },
      visualization: makeViz(finalHL, 'Complete', mergedCount),
    });

    return steps;
  },
};

export default accountsMerge;
