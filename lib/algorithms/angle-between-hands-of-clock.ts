import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const angleBetweenHandsOfClock: AlgorithmDefinition = {
  id: 'angle-between-hands-of-clock',
  title: 'Angle Between Hands of a Clock',
  leetcodeNumber: 1344,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given hour and minutes, return the smaller angle between the clock hands. The minute hand moves 6 degrees/minute. The hour hand moves 0.5 degrees/minute. Compute both angles and return the smaller (max 180 degrees).',
  tags: ['math', 'geometry'],

  code: {
    pseudocode: `function angleClock(hour, minutes):
  minuteAngle = minutes * 6        // 360/60 = 6 deg per min
  hourAngle = (hour % 12) * 30 + minutes * 0.5  // 360/12=30 per hr
  diff = abs(minuteAngle - hourAngle)
  return min(diff, 360 - diff)`,

    python: `def angleClock(hour: int, minutes: int) -> float:
    minute_angle = minutes * 6
    hour_angle = (hour % 12) * 30 + minutes * 0.5
    diff = abs(minute_angle - hour_angle)
    return min(diff, 360 - diff)`,

    javascript: `function angleClock(hour, minutes) {
  const minuteAngle = minutes * 6;
  const hourAngle = (hour % 12) * 30 + minutes * 0.5;
  const diff = Math.abs(minuteAngle - hourAngle);
  return Math.min(diff, 360 - diff);
}`,

    java: `public double angleClock(int hour, int minutes) {
    double minuteAngle = minutes * 6;
    double hourAngle = (hour % 12) * 30 + minutes * 0.5;
    double diff = Math.abs(minuteAngle - hourAngle);
    return Math.min(diff, 360 - diff);
}`,
  },

  defaultInput: { hour: 12, minutes: 30 },

  inputFields: [
    { name: 'hour', label: 'Hour', type: 'number', defaultValue: 12, placeholder: '12', helperText: 'Hour (1-12)' },
    { name: 'minutes', label: 'Minutes', type: 'number', defaultValue: 30, placeholder: '30', helperText: 'Minutes (0-59)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const hour = input.hour as number;
    const minutes = input.minutes as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    const minuteAngle = minutes * 6;
    const hourAngle = (hour % 12) * 30 + minutes * 0.5;
    const diff = Math.abs(minuteAngle - hourAngle);
    const result = Math.min(diff, 360 - diff);

    steps.push({
      line: 1,
      explanation: `Clock time: ${hour}:${String(minutes).padStart(2, '0')}. Minute hand: ${minutes} × 6 = ${minuteAngle}°. Hour hand: (${hour % 12} × 30) + (${minutes} × 0.5) = ${hourAngle}°.`,
      variables: { hour, minutes, minuteAngle, hourAngle },
      visualization: makeViz([minuteAngle, hourAngle], { 0: 'active', 1: 'comparing' }, { 0: 'min°', 1: 'hr°' }),
    });

    steps.push({
      line: 2,
      explanation: `Minute angle = ${minuteAngle}°. Each minute = 360/60 = 6°.`,
      variables: { minutes, minuteAngle },
      visualization: makeViz([minutes, 6, minuteAngle], { 0: 'active', 1: 'default', 2: 'found' }, { 0: 'min', 1: '×6', 2: 'minAngle' }),
    });

    steps.push({
      line: 3,
      explanation: `Hour angle = ${hourAngle}°. Each hour = 30°, plus ${minutes} × 0.5° = ${minutes * 0.5}° for minutes elapsed.`,
      variables: { hour: hour % 12, minutes, hourBase: (hour % 12) * 30, minuteContrib: minutes * 0.5, hourAngle },
      visualization: makeViz([(hour % 12) * 30, minutes * 0.5, hourAngle], { 0: 'active', 1: 'active', 2: 'found' }, { 0: 'hrBase', 1: 'minAdj', 2: 'hrAngle' }),
    });

    steps.push({
      line: 4,
      explanation: `Difference = |${minuteAngle} - ${hourAngle}| = ${diff.toFixed(1)}°. Smaller angle = min(${diff.toFixed(1)}, 360-${diff.toFixed(1)}=${(360 - diff).toFixed(1)}) = ${result.toFixed(1)}°.`,
      variables: { minuteAngle, hourAngle, diff: diff.toFixed(1), result: result.toFixed(1) },
      visualization: makeViz([minuteAngle, hourAngle, diff, 360 - diff, result], { 0: 'active', 1: 'comparing', 2: 'active', 3: 'active', 4: 'found' }, { 0: 'min°', 1: 'hr°', 2: 'diff', 3: '360-d', 4: 'angle' }),
    });

    steps.push({
      line: 5,
      explanation: `The angle between clock hands at ${hour}:${String(minutes).padStart(2, '0')} is ${result.toFixed(1)}°.`,
      variables: { result: result.toFixed(1) },
      visualization: makeViz([result], { 0: 'found' }, { 0: `${result.toFixed(1)}°` }),
    });

    return steps;
  },
};

export default angleBetweenHandsOfClock;
