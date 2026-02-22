import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestDuplicateSubstring: AlgorithmDefinition = {
  id: 'longest-duplicate-substring',
  title: 'Longest Duplicate Substring',
  leetcodeNumber: 1044,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Find the longest substring that appears at least twice. Uses binary search on length + Rabin-Karp rolling hash to check for duplicate substrings of a given length in O(n log n) expected time.',
  tags: ['string', 'binary search', 'rolling hash', 'rabin-karp', 'suffix array'],
  code: {
    pseudocode: `function longestDupSubstring(s):
  lo, hi = 1, len(s)-1
  result = ""
  while lo <= hi:
    mid = (lo+hi)//2
    dup = rabinKarpDup(s, mid)
    if dup != "":
      result = dup
      lo = mid+1
    else:
      hi = mid-1
  return result

function rabinKarpDup(s, L):
  BASE=256, MOD=1e9+7
  compute hash of s[0:L]
  store in set
  roll window, check for duplicates`,
    python: `def longestDupSubstring(s):
    def check(L):
        BASE, MOD = 256, 10**9 + 7
        h = 0
        for c in s[:L]:
            h = (h * BASE + ord(c)) % MOD
        seen = {h}
        mul = pow(BASE, L, MOD)
        for i in range(1, len(s) - L + 1):
            h = (h * BASE - ord(s[i-1]) * mul + ord(s[i+L-1])) % MOD
            if h in seen:
                start = s.find(s[i:i+L])
                if start != -1 and start != i: return s[i:i+L]
            seen.add(h)
        return ""
    lo, hi, res = 1, len(s) - 1, ""
    while lo <= hi:
        mid = (lo + hi) // 2
        dup = check(mid)
        if dup: res = dup; lo = mid + 1
        else: hi = mid - 1
    return res`,
    javascript: `function longestDupSubstring(s) {
  function check(L) {
    const BASE = 256n, MOD = 1000000007n;
    let h = 0n, mul = 1n;
    for (let i = 0; i < L; i++) { h = (h * BASE + BigInt(s.charCodeAt(i))) % MOD; if (i > 0) mul = mul * BASE % MOD; }
    const seen = new Map([[h, [0]]]);
    for (let i = 1; i <= s.length - L; i++) {
      h = (h * BASE - BigInt(s.charCodeAt(i-1)) * mul * BASE + BigInt(s.charCodeAt(i+L-1))) % MOD;
      if (h < 0) h += MOD;
      if (seen.has(h)) { for (const j of seen.get(h)) if (s.slice(j,j+L)===s.slice(i,i+L)) return s.slice(i,i+L); }
      seen.set(h, [...(seen.get(h)||[]), i]);
    }
    return "";
  }
  let lo = 1, hi = s.length - 1, res = "";
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const dup = check(mid);
    if (dup) { res = dup; lo = mid + 1; } else hi = mid - 1;
  }
  return res;
}`,
    java: `public String longestDupSubstring(String s) {
    int lo = 1, hi = s.length() - 1;
    String res = "";
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        String dup = check(s, mid);
        if (!dup.isEmpty()) { res = dup; lo = mid + 1; }
        else hi = mid - 1;
    }
    return res;
}`,
  },
  defaultInput: { s: 'banana' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'banana', placeholder: 'banana', helperText: 'String to find longest duplicate substring in' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (lo: number, hi: number, mid: number, result: string): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (result) {
        const idx = s.indexOf(result);
        for (let x = idx; x < idx + result.length; x++) highlights[x] = 'found';
        const idx2 = s.indexOf(result, idx + 1);
        if (idx2 >= 0) for (let x = idx2; x < idx2 + result.length; x++) highlights[x] = 'match';
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Binary Search on Length',
          entries: [
            { key: 'lo', value: String(lo) },
            { key: 'hi', value: String(hi) },
            { key: 'mid (trying length)', value: String(mid) },
            { key: 'best result', value: result || '(none yet)' },
          ],
        },
      };
    };

    function check(len: number): string {
      const BASE = 256, MOD = 1e9 + 7;
      let h = 0, mul = 1;
      for (let i = 0; i < len - 1; i++) mul = (mul * BASE) % MOD;
      for (let i = 0; i < len; i++) h = (h * BASE + s.charCodeAt(i)) % MOD;
      const seen = new Map<number, number[]>();
      seen.set(Math.round(h), [0]);
      for (let i = 1; i <= n - len; i++) {
        h = (BASE * (h - s.charCodeAt(i - 1) * mul) + s.charCodeAt(i + len - 1)) % MOD;
        if (h < 0) h += MOD;
        const key = Math.round(h);
        if (seen.has(key)) {
          for (const j of seen.get(key)!) {
            if (s.slice(j, j + len) === s.slice(i, i + len)) return s.slice(i, i + len);
          }
        }
        seen.set(key, [...(seen.get(key) || []), i]);
      }
      return '';
    }

    steps.push({
      line: 1,
      explanation: `Binary search on duplicate substring length in "${s}". Range: [1, ${n - 1}].`,
      variables: { s, n },
      visualization: makeViz(1, n - 1, 0, ''),
    });

    let lo = 1, hi = n - 1, result = '';
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const dup = check(mid);
      steps.push({
        line: 5,
        explanation: `Trying length ${mid}: ${dup ? `found duplicate "${dup}"` : 'no duplicate found'}.`,
        variables: { lo, hi, mid, found: !!dup },
        visualization: makeViz(lo, hi, mid, result),
      });
      if (dup) { result = dup; lo = mid + 1; }
      else hi = mid - 1;
    }

    steps.push({
      line: 10,
      explanation: `Longest duplicate substring: "${result}" (length ${result.length}).`,
      variables: { result },
      visualization: makeViz(lo, hi, 0, result),
    });

    return steps;
  },
};

export default longestDuplicateSubstring;
