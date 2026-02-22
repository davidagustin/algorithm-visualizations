import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const restoreIpAddressesBt: AlgorithmDefinition = {
  id: 'restore-ip-addresses-bt',
  title: 'Restore IP Addresses (Backtracking)',
  leetcodeNumber: 93,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string containing only digits, return all possible valid IP addresses that can be formed by inserting dots. A valid IP address consists of exactly four integers separated by dots, each between 0 and 255, with no leading zeros.',
  tags: ['backtracking', 'string', 'recursion'],

  code: {
    pseudocode: `function restoreIpAddresses(s):
  results = []
  function backtrack(start, parts):
    if len(parts) == 4 and start == len(s):
      results.append(join(parts, '.'))
      return
    if len(parts) == 4 or start == len(s): return
    for length in 1..3:
      segment = s[start..start+length]
      if valid segment (no leading zero, <= 255):
        parts.append(segment)
        backtrack(start+length, parts)
        parts.pop()
  backtrack(0, [])
  return results`,
    python: `def restoreIpAddresses(s: str) -> list[str]:
    res = []
    def bt(start, parts):
        if len(parts) == 4 and start == len(s):
            res.append('.'.join(parts)); return
        if len(parts) == 4 or start == len(s): return
        for length in range(1, 4):
            seg = s[start:start + length]
            if (len(seg) > 1 and seg[0] == '0') or int(seg) > 255: continue
            parts.append(seg)
            bt(start + length, parts)
            parts.pop()
    bt(0, [])
    return res`,
    javascript: `function restoreIpAddresses(s) {
  const res = [];
  function bt(start, parts) {
    if (parts.length === 4 && start === s.length) { res.push(parts.join('.')); return; }
    if (parts.length === 4 || start === s.length) return;
    for (let len = 1; len <= 3; len++) {
      const seg = s.slice(start, start + len);
      if ((seg.length > 1 && seg[0] === '0') || parseInt(seg) > 255) continue;
      parts.push(seg);
      bt(start + len, parts);
      parts.pop();
    }
  }
  bt(0, []);
  return res;
}`,
    java: `public List<String> restoreIpAddresses(String s) {
    List<String> res = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), res);
    return res;
}
private void backtrack(String s, int start, List<String> parts, List<String> res) {
    if (parts.size() == 4 && start == s.length()) { res.add(String.join(".", parts)); return; }
    if (parts.size() == 4 || start == s.length()) return;
    for (int len = 1; len <= 3; len++) {
        if (start + len > s.length()) break;
        String seg = s.substring(start, start + len);
        if (seg.length() > 1 && seg.charAt(0) == '0') break;
        if (Integer.parseInt(seg) > 255) break;
        parts.add(seg); backtrack(s, start + len, parts, res); parts.remove(parts.size() - 1);
    }
}`,
  },

  defaultInput: { s: '25525511135' },

  inputFields: [
    {
      name: 's',
      label: 'Digit String',
      type: 'string',
      defaultValue: '25525511135',
      placeholder: '25525511135',
      helperText: 'String of digits to form valid IP addresses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const results: string[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Restore IP addresses from "${s}". Need to place 3 dots to form 4 valid octets (0-255, no leading zeros).`,
      variables: { s, length: s.length },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    function isValidSegment(seg: string): boolean {
      if (seg.length > 1 && seg[0] === '0') return false;
      return parseInt(seg) <= 255;
    }

    function backtrack(start: number, parts: string[]) {
      if (parts.length === 4 && start === s.length) {
        const ip = parts.join('.');
        results.push(ip);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        s.split('').forEach((c, i) => { h[i] = 'found'; l[i] = c; });
        steps.push({
          line: 4,
          explanation: `Valid IP found: "${ip}"`,
          variables: { ip, totalFound: results.length },
          visualization: makeViz(h, l),
        });
        return;
      }
      if (parts.length === 4 || start === s.length) return;

      for (let len = 1; len <= 3; len++) {
        if (start + len > s.length) break;
        const seg = s.slice(start, start + len);
        const valid = isValidSegment(seg);

        if (steps.length < 30) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          s.split('').forEach((c, i) => {
            if (i < start) { h[i] = 'visited'; l[i] = c; }
            else if (i >= start && i < start + len) { h[i] = valid ? 'active' : 'mismatch'; l[i] = c; }
            else { l[i] = c; }
          });
          steps.push({
            line: 7,
            explanation: `Try segment "${seg}" as octet ${parts.length + 1}: ${valid ? 'valid' : 'invalid (leading zero or >255)'}.`,
            variables: { segment: seg, octetIndex: parts.length + 1, valid, current: [...parts, valid ? seg : '?'].join('.') },
            visualization: makeViz(h, l),
          });
        }

        if (valid) {
          parts.push(seg);
          backtrack(start + len, parts);
          parts.pop();
        }
      }
    }

    backtrack(0, []);

    steps.push({
      line: 13,
      explanation: `Done. Found ${results.length} valid IP addresses: ${results.join(', ')}`,
      variables: { totalResults: results.length, results },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default restoreIpAddressesBt;
