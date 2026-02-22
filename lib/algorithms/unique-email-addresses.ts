import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const uniqueEmailAddresses: AlgorithmDefinition = {
  id: 'unique-email-addresses',
  title: 'Unique Email Addresses',
  leetcodeNumber: 929,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Every email has a local name and domain. In the local name, dots are ignored and everything after a plus sign is ignored. Given a list of emails, return the number of unique addresses that actually receive mail.',
  tags: ['hash map', 'hash set', 'string', 'simulation'],

  code: {
    pseudocode: `function numUniqueEmails(emails):
  unique = set()
  for email in emails:
    local, domain = email.split('@')
    local = local.split('+')[0]
    local = local.replace('.', '')
    unique.add(local + '@' + domain)
  return len(unique)`,

    python: `def numUniqueEmails(emails: list[str]) -> int:
    unique = set()
    for email in emails:
        local, domain = email.split('@')
        local = local.split('+')[0].replace('.', '')
        unique.add(local + '@' + domain)
    return len(unique)`,

    javascript: `function numUniqueEmails(emails) {
  const unique = new Set();
  for (const email of emails) {
    const [local, domain] = email.split('@');
    const cleaned = local.split('+')[0].replace(/\\./g, '');
    unique.add(cleaned + '@' + domain);
  }
  return unique.size;
}`,

    java: `public int numUniqueEmails(String[] emails) {
    Set<String> unique = new HashSet<>();
    for (String email : emails) {
        String[] parts = email.split("@");
        String local = parts[0].split("\\\\+")[0].replace(".", "");
        unique.add(local + "@" + parts[1]);
    }
    return unique.size();
}`,
  },

  defaultInput: {
    emails: 'test.email+alex@leetcode.com,test.e.mail+bob.cathy@leetcode.com,testemail+david@lee.tcode.com',
  },

  inputFields: [
    {
      name: 'emails',
      label: 'Email Addresses',
      type: 'string',
      defaultValue: 'test.email+alex@leetcode.com,test.e.mail+bob.cathy@leetcode.com,testemail+david@lee.tcode.com',
      placeholder: 'email1@domain.com,email2@domain.com',
      helperText: 'Comma-separated list of email addresses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const emailsStr = input.emails as string;
    const emails = emailsStr.split(',').map(e => e.trim());
    const steps: AlgorithmStep[] = [];
    const unique = new Set<string>();

    steps.push({
      line: 1,
      explanation: `Processing ${emails.length} email address(es). Use a set to track unique normalized emails.`,
      variables: { emailCount: emails.length },
      visualization: {
        type: 'array',
        array: emails.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(emails.map((e, i) => [i, e.split('@')[0]])),
      },
    });

    for (let idx = 0; idx < emails.length; idx++) {
      const email = emails[idx];
      const atIdx = email.indexOf('@');
      const local = email.slice(0, atIdx);
      const domain = email.slice(atIdx + 1);

      steps.push({
        line: 3,
        explanation: `Email ${idx + 1}: "${email}". Split into local="${local}" and domain="${domain}".`,
        variables: { email, local, domain },
        visualization: {
          type: 'array',
          array: emails.map((_, i) => i),
          highlights: { [idx]: 'active' },
          labels: Object.fromEntries(emails.map((e, i) => [i, e.split('@')[0]])),
        },
      });

      const afterPlus = local.split('+')[0];
      steps.push({
        line: 4,
        explanation: `Remove everything after "+": "${local}" -> "${afterPlus}"`,
        variables: { original: local, afterRemovingPlus: afterPlus },
        visualization: {
          type: 'array',
          array: emails.map((_, i) => i),
          highlights: { [idx]: 'comparing' },
          labels: Object.fromEntries(emails.map((e, i) => [i, e.split('@')[0]])),
        },
      });

      const cleaned = afterPlus.replace(/\./g, '');
      const normalized = cleaned + '@' + domain;
      unique.add(normalized);

      steps.push({
        line: 5,
        explanation: `Remove dots: "${afterPlus}" -> "${cleaned}". Normalized email: "${normalized}". Unique set size: ${unique.size}.`,
        variables: { normalized, uniqueCount: unique.size, uniqueEmails: [...unique].join(', ') },
        visualization: {
          type: 'array',
          array: emails.map((_, i) => i),
          highlights: { [idx]: 'found' },
          labels: Object.fromEntries(emails.map((e, i) => [i, e.split('@')[0]])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `All emails processed. Unique normalized addresses: ${unique.size}. These are: ${[...unique].join(', ')}`,
      variables: { result: unique.size, uniqueEmails: [...unique].join(', ') },
      visualization: {
        type: 'array',
        array: emails.map((_, i) => i),
        highlights: Object.fromEntries(emails.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(emails.map((_, i) => [i, `${i + 1}`])),
      },
    });

    return steps;
  },
};

export default uniqueEmailAddresses;
