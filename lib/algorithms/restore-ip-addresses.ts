import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const restoreIpAddresses: AlgorithmDefinition = {
  id: 'restore-ip-addresses',
  title: 'Restore IP Addresses',
  leetcodeNumber: 93,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string of digits, return all valid IPv4 addresses that can be formed by inserting dots. Each segment must be 0-255 with no leading zeros. Use backtracking: build 4 segments, each 1-3 digits long, and validate each segment before recursing.',
  tags: ['Backtracking', 'Recursion', 'String'],
  code: {
    pseudocode: `function restoreIpAddresses(s):
  result = []
  backtrack(s, 0, [], result)
  return result

function backtrack(s, start, parts, result):
  if parts.length == 4 and start == s.length:
    result.append(parts.join('.'))
    return
  if parts.length == 4 or start == s.length: return
  for len from 1 to 3:
    if start + len > s.length: break
    seg = s[start..start+len]
    if isValid(seg):
      parts.append(seg)
      backtrack(s, start+len, parts, result)
      parts.pop()`,
    python: `def restoreIpAddresses(s):
    result = []
    def backtrack(start, parts):
        if len(parts) == 4 and start == len(s):
            result.append('.'.join(parts))
            return
        if len(parts) == 4 or start == len(s):
            return
        for length in range(1, 4):
            if start + length > len(s):
                break
            seg = s[start:start+length]
            if len(seg) > 1 and seg[0] == '0':
                break
            if int(seg) > 255:
                break
            parts.append(seg)
            backtrack(start + length, parts)
            parts.pop()
    backtrack(0, [])
    return result`,
    javascript: `function restoreIpAddresses(s) {
  const result = [];
  function backtrack(start, parts) {
    if (parts.length === 4 && start === s.length) {
      result.push(parts.join('.'));
      return;
    }
    if (parts.length === 4 || start === s.length) return;
    for (let len = 1; len <= 3; len++) {
      if (start + len > s.length) break;
      const seg = s.slice(start, start + len);
      if (seg.length > 1 && seg[0] === '0') break;
      if (parseInt(seg) > 255) break;
      parts.push(seg);
      backtrack(start + len, parts);
      parts.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    java: `public List<String> restoreIpAddresses(String s) {
    List<String> result = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), result);
    return result;
}
void backtrack(String s, int start, List<String> parts,
               List<String> result) {
    if (parts.size() == 4 && start == s.length()) {
        result.add(String.join(".", parts));
        return;
    }
    if (parts.size() == 4 || start == s.length()) return;
    for (int len = 1; len <= 3; len++) {
        if (start + len > s.length()) break;
        String seg = s.substring(start, start + len);
        if (seg.length() > 1 && seg.charAt(0) == '0') break;
        if (Integer.parseInt(seg) > 255) break;
        parts.add(seg);
        backtrack(s, start + len, parts, result);
        parts.remove(parts.size() - 1);
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
      placeholder: 'e.g. 25525511135',
      helperText: 'String of digits to form valid IP addresses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];
    const parts: string[] = [];

    const chars = s.split('').map((_, i) => i);

    function makeViz(start: number, segEnd: number | null, valid: boolean | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < s.length; i++) {
        labels[i] = s[i];
        if (segEnd !== null && i >= start && i < segEnd) {
          highlights[i] = valid === null ? 'comparing' : (valid ? 'active' : 'mismatch');
        } else if (i < start) {
          highlights[i] = 'visited';
        } else {
          highlights[i] = 'default';
        }
      }
      return {
        type: 'array',
        array: chars.slice(),
        highlights,
        labels,
        auxData: {
          label: 'IP Building State',
          entries: [
            { key: 'Parts so far', value: parts.length > 0 ? parts.join(' . ') : '(none)' },
            { key: 'Segments filled', value: `${parts.length}/4` },
            { key: 'Index', value: String(start) },
            { key: 'Valid IPs found', value: String(result.length) },
            ...result.map((ip, i) => ({ key: `  #${i + 1}`, value: ip })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find all valid IPv4 addresses from "${s}". Need exactly 4 segments, each 0-255 with no leading zeros.`,
      variables: { s },
      visualization: makeViz(0, null, null),
    });

    function backtrack(start: number): void {
      if (parts.length === 4 && start === s.length) {
        const ip = parts.join('.');
        result.push(ip);
        steps.push({
          line: 7,
          explanation: `Valid IP found: ${ip}. Total: ${result.length}.`,
          variables: { ip, total: result.length },
          visualization: {
            type: 'array',
            array: chars.slice(),
            highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(chars.map((_, i) => [i, s[i]])),
            auxData: {
              label: 'IP Found!',
              entries: [
                { key: 'IP', value: ip },
                { key: 'Total found', value: String(result.length) },
              ],
            },
          },
        });
        return;
      }
      if (parts.length === 4 || start === s.length) return;

      for (let len = 1; len <= 3; len++) {
        if (start + len > s.length) break;
        const seg = s.slice(start, start + len);
        const hasLeadingZero = seg.length > 1 && seg[0] === '0';
        const outOfRange = parseInt(seg) > 255;
        const valid = !hasLeadingZero && !outOfRange;

        steps.push({
          line: 11,
          explanation: `Try segment "${seg}" (indices ${start}..${start + len - 1}): ${!valid ? (hasLeadingZero ? 'leading zero' : 'value > 255') + ' - invalid' : 'valid (0-255)'}. ${valid ? 'Add to parts.' : 'Skip.'}`,
          variables: { seg, valid, hasLeadingZero, outOfRange, parts: parts.slice() },
          visualization: makeViz(start, start + len, valid),
        });

        if (hasLeadingZero || outOfRange) break;

        parts.push(seg);
        backtrack(start + len);
        parts.pop();
        steps.push({
          line: 14,
          explanation: `Backtrack: remove segment "${seg}". Parts: [${parts.join(', ')}]. Try next length.`,
          variables: { removed: seg, parts: parts.slice() },
          visualization: makeViz(start, null, null),
        });
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `Done. Found ${result.length} valid IP address(es) from "${s}".`,
      variables: { total: result.length, result },
      visualization: {
        type: 'array',
        array: chars.slice(),
        highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(chars.map((_, i) => [i, s[i]])),
        auxData: {
          label: `All ${result.length} Valid IPs`,
          entries: result.length > 0
            ? result.map((ip, i) => ({ key: `#${i + 1}`, value: ip }))
            : [{ key: 'Result', value: 'No valid IP addresses' }],
        },
      },
    });

    return steps;
  },
};

export default restoreIpAddresses;
