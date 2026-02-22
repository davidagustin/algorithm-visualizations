import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bagOfTokens: AlgorithmDefinition = {
  id: 'bag-of-tokens',
  title: 'Bag of Tokens',
  leetcodeNumber: 948,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given token values and initial power, maximize your score. Play a token face-up (spend power equal to token, gain 1 score) or face-down (spend 1 score, gain power equal to token). Greedily play the cheapest token face-up when possible, or play the most expensive face-down when score > 0.',
  tags: ['greedy', 'sorting', 'two pointers', 'array'],

  code: {
    pseudocode: `function bagOfTokensScore(tokens, power):
  sort tokens
  left = 0, right = n - 1
  score = 0, maxScore = 0
  while left <= right:
    if power >= tokens[left]:
      power -= tokens[left]; score++; left++
      maxScore = max(maxScore, score)
    elif score > 0:
      power += tokens[right]; score--; right--
    else:
      break
  return maxScore`,

    python: `def bagOfTokensScore(tokens: list[int], power: int) -> int:
    tokens.sort()
    left, right = 0, len(tokens) - 1
    score = max_score = 0
    while left <= right:
        if power >= tokens[left]:
            power -= tokens[left]
            score += 1
            left += 1
            max_score = max(max_score, score)
        elif score > 0:
            power += tokens[right]
            score -= 1
            right -= 1
        else:
            break
    return max_score`,

    javascript: `function bagOfTokensScore(tokens, power) {
  tokens.sort((a, b) => a - b);
  let left = 0, right = tokens.length - 1;
  let score = 0, maxScore = 0;
  while (left <= right) {
    if (power >= tokens[left]) {
      power -= tokens[left++];
      maxScore = Math.max(maxScore, ++score);
    } else if (score > 0) {
      power += tokens[right--];
      score--;
    } else break;
  }
  return maxScore;
}`,

    java: `public int bagOfTokensScore(int[] tokens, int power) {
    Arrays.sort(tokens);
    int left = 0, right = tokens.length - 1, score = 0, maxScore = 0;
    while (left <= right) {
        if (power >= tokens[left]) {
            power -= tokens[left++];
            maxScore = Math.max(maxScore, ++score);
        } else if (score > 0) {
            power += tokens[right--];
            score--;
        } else break;
    }
    return maxScore;
}`,
  },

  defaultInput: {
    tokens: [100, 200, 300, 400],
    power: 200,
  },

  inputFields: [
    {
      name: 'tokens',
      label: 'Tokens',
      type: 'array',
      defaultValue: [100, 200, 300, 400],
      placeholder: '100,200,300,400',
      helperText: 'Token values',
    },
    {
      name: 'power',
      label: 'Initial Power',
      type: 'number',
      defaultValue: 200,
      placeholder: '200',
      helperText: 'Starting power level',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tokensRaw = input.tokens as number[];
    let power = input.power as number;
    const steps: AlgorithmStep[] = [];

    const tokens = [...tokensRaw].sort((a, b) => a - b);
    let left = 0;
    let right = tokens.length - 1;
    let score = 0;
    let maxScore = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...tokens],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort tokens: [${tokens.join(', ')}]. Initialize left=0, right=${right}, power=${power}, score=0.`,
      variables: { left, right, power, score, maxScore },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left <= right) {
      if (power >= tokens[left]) {
        power -= tokens[left];
        score++;
        maxScore = Math.max(maxScore, score);

        steps.push({
          line: 6,
          explanation: `power=${power + tokens[left]} >= tokens[left]=${tokens[left]}. Play face-up: spend ${tokens[left]} power, gain 1 score. power=${power}, score=${score}, maxScore=${maxScore}.`,
          variables: { left, right, power, score, maxScore, 'tokens[left]': tokens[left] },
          visualization: makeViz(
            { [left]: 'found', [right]: 'pointer' },
            { [left]: 'spent', [right]: 'R' }
          ),
        });
        left++;
      } else if (score > 0) {
        power += tokens[right];
        score--;

        steps.push({
          line: 8,
          explanation: `power=${power - tokens[right]} < tokens[left]=${tokens[left]} but score=${score + 1} > 0. Play face-down: gain ${tokens[right]} power, lose 1 score. power=${power}, score=${score}.`,
          variables: { left, right, power, score, maxScore, 'tokens[right]': tokens[right] },
          visualization: makeViz(
            { [left]: 'active', [right]: 'comparing' },
            { [left]: 'L', [right]: 'sold' }
          ),
        });
        right--;
      } else {
        steps.push({
          line: 10,
          explanation: `Cannot afford tokens[left]=${tokens[left]} and score=${score} is 0. Cannot trade. Break.`,
          variables: { left, right, power, score, maxScore },
          visualization: makeViz(
            { [left]: 'mismatch', [right]: 'mismatch' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        break;
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Maximum score achieved = ${maxScore}.`,
      variables: { maxScore, finalPower: power, finalScore: score },
      visualization: makeViz(
        Object.fromEntries(tokens.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default bagOfTokens;
