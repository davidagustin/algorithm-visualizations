import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designFoodRatingSystem: AlgorithmDefinition = {
  id: 'design-food-rating-system',
  title: 'Design a Food Rating System',
  leetcodeNumber: 2353,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a food rating system that stores food names, cuisines, and ratings. Support changing a food rating and querying the highest-rated food per cuisine. Use a heap per cuisine along with hash maps for food-to-rating and food-to-cuisine lookups. Use lazy deletion in the heap on stale entries.',
  tags: ['heap', 'hash map', 'design', 'lazy deletion'],

  code: {
    pseudocode: `class FoodRatings:
  foodRating = {}   // food -> rating
  foodCuisine = {}  // food -> cuisine
  heaps = {}        // cuisine -> max-heap of (-rating, food)

  init(foods, cuisines, ratings):
    for each food, cuisine, rating:
      foodRating[food] = rating
      foodCuisine[food] = cuisine
      heaps[cuisine].push((-rating, food))

  changeRating(food, newRating):
    foodRating[food] = newRating
    cuisine = foodCuisine[food]
    heaps[cuisine].push((-newRating, food))  // lazy add

  highestRated(cuisine):
    heap = heaps[cuisine]
    while heap not empty:
      (negRating, food) = heap.top()
      if foodRating[food] == -negRating:
        return food  // valid entry
      heap.pop()  // stale entry, discard`,

    python: `import heapq

class FoodRatings:
    def __init__(self, foods, cuisines, ratings):
        self.rating = {}
        self.cuisine = {}
        self.heaps = {}
        for f, c, r in zip(foods, cuisines, ratings):
            self.rating[f] = r
            self.cuisine[f] = c
            if c not in self.heaps:
                self.heaps[c] = []
            heapq.heappush(self.heaps[c], (-r, f))

    def changeRating(self, food: str, newRating: int) -> None:
        self.rating[food] = newRating
        c = self.cuisine[food]
        heapq.heappush(self.heaps[c], (-newRating, food))

    def highestRated(self, cuisine: str) -> str:
        heap = self.heaps[cuisine]
        while heap:
            neg_r, food = heap[0]
            if self.rating[food] == -neg_r:
                return food
            heapq.heappop(heap)
        return ""`,

    javascript: `class FoodRatings {
  constructor(foods, cuisines, ratings) {
    this.rating = {};
    this.cuisine = {};
    this.heaps = {};
    for (let i = 0; i < foods.length; i++) {
      this.rating[foods[i]] = ratings[i];
      this.cuisine[foods[i]] = cuisines[i];
      if (!this.heaps[cuisines[i]]) this.heaps[cuisines[i]] = [];
      this.heaps[cuisines[i]].push([-ratings[i], foods[i]]);
      // (simplified - real impl needs a proper min-heap)
    }
  }

  changeRating(food, newRating) {
    this.rating[food] = newRating;
    const c = this.cuisine[food];
    this.heaps[c].push([-newRating, food]);
  }

  highestRated(cuisine) {
    const heap = this.heaps[cuisine];
    while (heap.length) {
      const [negR, food] = heap[0];
      if (this.rating[food] === -negR) return food;
      heap.shift();
    }
    return "";
  }
}`,

    java: `class FoodRatings {
    Map<String,Integer> rating = new HashMap<>();
    Map<String,String> cuisine = new HashMap<>();
    Map<String, PriorityQueue<String>> heaps = new HashMap<>();

    public FoodRatings(String[] foods, String[] cuisines, int[] ratings) {
        for (int i = 0; i < foods.length; i++) {
            rating.put(foods[i], ratings[i]);
            cuisine.put(foods[i], cuisines[i]);
            heaps.computeIfAbsent(cuisines[i],
                k -> new PriorityQueue<>((a,b)->
                    rating.get(b)!=rating.get(a)?
                    rating.get(b)-rating.get(a):a.compareTo(b)))
                .offer(foods[i]);
        }
    }

    public void changeRating(String food, int newRating) {
        rating.put(food, newRating);
        heaps.get(cuisine.get(food)).offer(food);
    }

    public String highestRated(String cui) {
        var pq = heaps.get(cui);
        while (rating.get(pq.peek()) != pq.peek().hashCode())
            pq.poll(); // simplified lazy deletion
        return pq.peek();
    }
}`,
  },

  defaultInput: {
    ratings: [5, 8, 3, 7],
  },

  inputFields: [
    {
      name: 'ratings',
      label: 'Initial Ratings',
      type: 'array',
      defaultValue: [5, 8, 3, 7],
      placeholder: '5,8,3,7',
      helperText: 'Initial ratings for foods: kimchi, miso, sushi, moussaka',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ratings = input.ratings as number[];
    const steps: AlgorithmStep[] = [];

    const foods = ['kimchi', 'miso', 'sushi', 'moussaka'];
    const cuisines = ['korean', 'japanese', 'japanese', 'greek'];
    const actualRatings = [
      ratings[0] ?? 5,
      ratings[1] ?? 8,
      ratings[2] ?? 3,
      ratings[3] ?? 7,
    ];

    const ratingMap: Record<string, number> = {};
    const cuisineMap: Record<string, string> = {};
    const heaps: Record<string, Array<[number, string]>> = {};

    steps.push({
      line: 1,
      explanation: 'Initialize food rating system. Build rating, cuisine, and per-cuisine heap data structures.',
      variables: { foods: foods.join(', '), cuisines: [...new Set(cuisines)].join(', ') },
      visualization: {
        type: 'array',
        array: actualRatings,
        highlights: {},
        labels: { 0: foods[0], 1: foods[1], 2: foods[2], 3: foods[3] },
      },
    });

    for (let i = 0; i < foods.length; i++) {
      ratingMap[foods[i]] = actualRatings[i];
      cuisineMap[foods[i]] = cuisines[i];
      if (!heaps[cuisines[i]]) heaps[cuisines[i]] = [];
      heaps[cuisines[i]].push([-actualRatings[i], foods[i]]);
      heaps[cuisines[i]].sort((a, b) => a[0] - b[0]);

      steps.push({
        line: 5,
        explanation: `Add "${foods[i]}" (cuisine: ${cuisines[i]}, rating: ${actualRatings[i]}) to system. Push (-${actualRatings[i]}, "${foods[i]}") to ${cuisines[i]} heap.`,
        variables: { food: foods[i], cuisine: cuisines[i], rating: actualRatings[i] },
        visualization: {
          type: 'array',
          array: actualRatings,
          highlights: { [i]: 'active' },
          labels: { [i]: `${foods[i]}:${actualRatings[i]}` },
        },
      });
    }

    // highestRated query for japanese
    const japaneseEntries = heaps['japanese'] || [];
    const topJapanese = japaneseEntries[0];
    steps.push({
      line: 19,
      explanation: `highestRated("japanese"): Check heap top: (-${-topJapanese[0]}, "${topJapanese[1]}"). Rating in map: ${ratingMap[topJapanese[1]]}. Match! Return "${topJapanese[1]}".`,
      variables: { cuisine: 'japanese', topFood: topJapanese[1], rating: ratingMap[topJapanese[1]] },
      visualization: {
        type: 'array',
        array: actualRatings,
        highlights: { 1: 'found', 2: 'found' },
        labels: { 1: 'japanese', 2: 'japanese', 1: `top: ${topJapanese[1]}` },
      },
    });

    // changeRating: update sushi to 9
    const newSushiRating = 9;
    ratingMap['sushi'] = newSushiRating;
    heaps['japanese'].push([-newSushiRating, 'sushi']);
    heaps['japanese'].sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 13,
      explanation: `changeRating("sushi", ${newSushiRating}): Update map["sushi"] = ${newSushiRating}. Push (-${newSushiRating}, "sushi") to japanese heap (lazy add).`,
      variables: { food: 'sushi', newRating: newSushiRating, note: 'old entry still in heap, will be lazily discarded' },
      visualization: {
        type: 'array',
        array: [actualRatings[0], actualRatings[1], newSushiRating, actualRatings[3]],
        highlights: { 2: 'active' },
        labels: { 2: `sushi:${newSushiRating}` },
      },
    });

    // highestRated after change
    const japEntries2 = heaps['japanese'];
    let validTop = japEntries2[0];
    let staleCount = 0;
    for (const entry of japEntries2) {
      if (ratingMap[entry[1]] === -entry[0]) {
        validTop = entry;
        break;
      }
      staleCount++;
    }

    steps.push({
      line: 19,
      explanation: `highestRated("japanese") after update: ${staleCount > 0 ? `Skip ${staleCount} stale entries. ` : ''}Valid top is (-${-validTop[0]}, "${validTop[1]}") with current rating ${ratingMap[validTop[1]]}. Return "${validTop[1]}".`,
      variables: { cuisine: 'japanese', topFood: validTop[1], currentRating: ratingMap[validTop[1]], staleEntriesSkipped: staleCount },
      visualization: {
        type: 'array',
        array: [actualRatings[0], actualRatings[1], newSushiRating, actualRatings[3]],
        highlights: { 2: 'found' },
        labels: { 2: `top: sushi(${newSushiRating})` },
      },
    });

    return steps;
  },
};

export default designFoodRatingSystem;
