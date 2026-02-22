import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const bullsAndCows: AlgorithmDefinition = {
  id: 'bulls-and-cows',
  title: 'Bulls and Cows',
  leetcodeNumber: 299,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a secret number and a guess, return a hint as "xAyB" where x is the number of bulls (correct digit, correct position) and y is the number of cows (correct digit, wrong position). Use frequency maps to count mismatches.',
  tags: ['hash map', 'string', 'counting'],

  code: {
    pseudocode: `function getHint(secret, guess):
  bulls = 0
  secretCount = [0]*10
  guessCount = [0]*10
  for i in range(len(secret)):
    if secret[i] == guess[i]:
      bulls++
    else:
      secretCount[secret[i]]++
      guessCount[guess[i]]++
  cows = sum(min(secretCount[i], guessCount[i]) for i in 0..9)
  return bulls + "A" + cows + "B"`,

    python: `def getHint(secret: str, guess: str) -> str:
    bulls = 0
    s_count = [0] * 10
    g_count = [0] * 10
    for s, g in zip(secret, guess):
        if s == g:
            bulls += 1
        else:
            s_count[int(s)] += 1
            g_count[int(g)] += 1
    cows = sum(min(s_count[i], g_count[i]) for i in range(10))
    return f"{bulls}A{cows}B"`,

    javascript: `function getHint(secret, guess) {
  let bulls = 0;
  const sCount = new Array(10).fill(0);
  const gCount = new Array(10).fill(0);
  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) bulls++;
    else { sCount[+secret[i]]++; gCount[+guess[i]]++; }
  }
  let cows = 0;
  for (let i = 0; i < 10; i++) cows += Math.min(sCount[i], gCount[i]);
  return bulls + "A" + cows + "B";
}`,

    java: `public String getHint(String secret, String guess) {
    int bulls = 0;
    int[] sCount = new int[10], gCount = new int[10];
    for (int i = 0; i < secret.length(); i++) {
        if (secret.charAt(i) == guess.charAt(i)) bulls++;
        else { sCount[secret.charAt(i)-'0']++; gCount[guess.charAt(i)-'0']++; }
    }
    int cows = 0;
    for (int i = 0; i < 10; i++) cows += Math.min(sCount[i], gCount[i]);
    return bulls + "A" + cows + "B";
}`,
  },

  defaultInput: {
    secret: '1807',
    guess: '7810',
  },

  inputFields: [
    {
      name: 'secret',
      label: 'Secret Number',
      type: 'string',
      defaultValue: '1807',
      placeholder: '1807',
      helperText: 'The secret number string',
    },
    {
      name: 'guess',
      label: 'Guess',
      type: 'string',
      defaultValue: '7810',
      placeholder: '7810',
      helperText: 'The guessed number string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const secret = input.secret as string;
    const guess = input.guess as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `secret="${secret}", guess="${guess}". First pass: count bulls (exact position matches).`,
      variables: { secret, guess, bulls: 0 },
      visualization: {
        type: 'array',
        array: secret.split('').map(Number),
        highlights: {},
        labels: Object.fromEntries(secret.split('').map((c, i) => [i, `s:${c}/g:${guess[i]}`])),
      },
    });

    let bulls = 0;
    const sCount = new Array(10).fill(0);
    const gCount = new Array(10).fill(0);

    for (let i = 0; i < secret.length; i++) {
      const isBull = secret[i] === guess[i];

      if (isBull) {
        bulls++;
        steps.push({
          line: 5,
          explanation: `Position ${i}: secret[${i}]="${secret[i]}" == guess[${i}]="${guess[i]}". BULL! bulls=${bulls}`,
          variables: { position: i, secretDigit: secret[i], guessDigit: guess[i], isBull: true, bulls },
          visualization: {
            type: 'array',
            array: secret.split('').map(Number),
            highlights: {
              [i]: 'found',
              ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, secret[k] === guess[k] ? 'sorted' : 'mismatch'])),
            },
            labels: Object.fromEntries(secret.split('').map((c, idx) => [idx, `s:${c}/g:${guess[idx]}`])),
          },
        });
      } else {
        sCount[+secret[i]]++;
        gCount[+guess[i]]++;
        steps.push({
          line: 8,
          explanation: `Position ${i}: secret[${i}]="${secret[i]}" != guess[${i}]="${guess[i]}". Not a bull. Add to frequency counts.`,
          variables: { position: i, secretDigit: secret[i], guessDigit: guess[i], isBull: false },
          visualization: {
            type: 'array',
            array: secret.split('').map(Number),
            highlights: {
              [i]: 'mismatch',
              ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, secret[k] === guess[k] ? 'sorted' : 'comparing'])),
            },
            labels: Object.fromEntries(secret.split('').map((c, idx) => [idx, `s:${c}/g:${guess[idx]}`])),
          },
        });
      }
    }

    let cows = 0;
    for (let i = 0; i < 10; i++) cows += Math.min(sCount[i], gCount[i]);

    steps.push({
      line: 10,
      explanation: `Count cows: for each digit 0-9, take min(secretCount, guessCount). Cows = ${cows}.`,
      variables: { sCount: sCount.join(','), gCount: gCount.join(','), cows },
      visualization: {
        type: 'array',
        array: sCount,
        highlights: Object.fromEntries(sCount.map((v, i) => [i, v > 0 ? 'active' : 'default'])),
        labels: Object.fromEntries(sCount.map((_, i) => [i, `${i}:s${sCount[i]}/g${gCount[i]}`])),
      },
    });

    const result = `${bulls}A${cows}B`;
    steps.push({
      line: 11,
      explanation: `Result: ${bulls} bull(s) and ${cows} cow(s). Answer: "${result}"`,
      variables: { bulls, cows, result },
      visualization: {
        type: 'array',
        array: [bulls, cows],
        highlights: { 0: 'found', 1: 'active' },
        labels: { 0: `${bulls}A`, 1: `${cows}B` },
      },
    });

    return steps;
  },
};

export default bullsAndCows;
