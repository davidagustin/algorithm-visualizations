import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllPossibleRecipes: AlgorithmDefinition = {
  id: 'find-all-possible-recipes',
  title: 'Find All Possible Recipes from Given Supplies',
  leetcodeNumber: 2115,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given recipes with ingredient lists, and an initial set of supplies, determine which recipes can be made. Recipes can use other recipes as ingredients. Model as a DAG and use topological sort: ingredients with no dependencies (available supplies) start the process, and recipes become available as their ingredients are gathered.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Hash Map'],
  code: {
    pseudocode: `function findAllRecipes(recipes, ingredients, supplies):
  inDegree = {}
  adj = adjacency list
  for i, recipe in enumerate(recipes):
    inDegree[recipe] = len(ingredients[i])
    for ing in ingredients[i]:
      adj[ing].add(recipe)
  queue = list(supplies)  // initially available
  result = []
  while queue:
    item = queue.dequeue()
    for recipe in adj[item]:
      inDegree[recipe] -= 1
      if inDegree[recipe] == 0:
        result.append(recipe)
        queue.enqueue(recipe)
  return result`,
    python: `def findAllRecipes(recipes, ingredients, supplies):
    inDegree = {}
    adj = defaultdict(list)
    for i, recipe in enumerate(recipes):
        inDegree[recipe] = len(ingredients[i])
        for ing in ingredients[i]:
            adj[ing].append(recipe)
    q = deque(supplies)
    res = []
    while q:
        item = q.popleft()
        for recipe in adj[item]:
            inDegree[recipe] -= 1
            if inDegree[recipe] == 0:
                res.append(recipe)
                q.append(recipe)
    return res`,
    javascript: `function findAllRecipes(recipes, ingredients, supplies) {
  const inDegree = new Map();
  const adj = new Map();
  for (let i = 0; i < recipes.length; i++) {
    inDegree.set(recipes[i], ingredients[i].length);
    for (const ing of ingredients[i]) {
      if (!adj.has(ing)) adj.set(ing, []);
      adj.get(ing).push(recipes[i]);
    }
  }
  const queue = [...supplies];
  const res = [];
  while (queue.length) {
    const item = queue.shift();
    for (const recipe of (adj.get(item) || [])) {
      inDegree.set(recipe, inDegree.get(recipe) - 1);
      if (inDegree.get(recipe) === 0) {
        res.push(recipe);
        queue.push(recipe);
      }
    }
  }
  return res;
}`,
    java: `public List<String> findAllRecipes(String[] recipes, List<List<String>> ingredients, String[] supplies) {
    Map<String,Integer> inDeg = new HashMap<>();
    Map<String,List<String>> adj = new HashMap<>();
    for (int i = 0; i < recipes.length; i++) {
        inDeg.put(recipes[i], ingredients.get(i).size());
        for (String ing : ingredients.get(i)) {
            adj.computeIfAbsent(ing, k -> new ArrayList<>()).add(recipes[i]);
        }
    }
    Queue<String> q = new LinkedList<>(Arrays.asList(supplies));
    List<String> res = new ArrayList<>();
    while (!q.isEmpty()) {
        String item = q.poll();
        for (String recipe : adj.getOrDefault(item, List.of())) {
            if (inDeg.merge(recipe, -1, Integer::sum) == 0) {
                res.add(recipe); q.add(recipe);
            }
        }
    }
    return res;
}`,
  },
  defaultInput: {
    recipes: ['bread', 'sandwich', 'burger'],
    ingredients: [['yeast', 'flour'], ['bread', 'meat'], ['sandwich', 'sauce']],
    supplies: ['yeast', 'flour', 'meat', 'sauce'],
  },
  inputFields: [
    {
      name: 'recipes',
      label: 'Recipes',
      type: 'array',
      defaultValue: ['bread', 'sandwich', 'burger'],
      placeholder: '["bread","sandwich","burger"]',
      helperText: 'List of recipe names',
    },
    {
      name: 'ingredients',
      label: 'Ingredients (per recipe)',
      type: 'array',
      defaultValue: [['yeast', 'flour'], ['bread', 'meat'], ['sandwich', 'sauce']],
      placeholder: '[["yeast","flour"],["bread","meat"],["sandwich","sauce"]]',
      helperText: 'ingredients[i] = ingredients needed for recipes[i]',
    },
    {
      name: 'supplies',
      label: 'Initial Supplies',
      type: 'array',
      defaultValue: ['yeast', 'flour', 'meat', 'sauce'],
      placeholder: '["yeast","flour","meat","sauce"]',
      helperText: 'Initially available ingredients',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const recipes = input.recipes as string[];
    const ingredients = input.ingredients as string[][];
    const supplies = input.supplies as string[];
    const steps: AlgorithmStep[] = [];

    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (let i = 0; i < recipes.length; i++) {
      inDegree.set(recipes[i], ingredients[i].length);
      for (const ing of ingredients[i]) {
        if (!adj.has(ing)) adj.set(ing, []);
        adj.get(ing)!.push(recipes[i]);
      }
    }

    // Use numeric array for visualization (in-degrees of recipes)
    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: string[],
      result: string[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: recipes.map(r => inDegree.get(r) ?? 0),
        highlights,
        labels,
        auxData: {
          label: 'Recipe Dependency Topo Sort',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Available', value: result.length > 0 ? result.join(', ') : 'none yet' },
            { key: 'Supplies', value: supplies.join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build dependency graph. Recipes: [${recipes.join(', ')}]. In-degrees (# missing ingredients): [${recipes.map(r => inDegree.get(r)).join(', ')}].`,
      variables: { recipes, inDegrees: recipes.map(r => inDegree.get(r)) },
      visualization: makeViz(
        {},
        Object.fromEntries(recipes.map((r, i) => [i, `${r}:${inDegree.get(r)}`])),
        [],
        []
      ),
    });

    const queue = [...supplies];
    const result: string[] = [];

    steps.push({
      line: 7,
      explanation: `Start with available supplies: [${supplies.join(', ')}]. These unlock recipes as their ingredients.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        {},
        Object.fromEntries(recipes.map((r, i) => [i, `${r}:${inDegree.get(r)}`])),
        [...queue],
        []
      ),
    });

    while (queue.length > 0) {
      const item = queue.shift()!;
      const dependents = adj.get(item) || [];

      steps.push({
        line: 9,
        explanation: `Process "${item}". It is an ingredient for: [${dependents.join(', ') || 'none'}].`,
        variables: { item, dependents },
        visualization: makeViz(
          Object.fromEntries(recipes.map((r, i) => [i, dependents.includes(r) ? 'comparing' : 'default'])),
          Object.fromEntries(recipes.map((r, i) => [i, `${r}:${inDegree.get(r)}`])),
          [...queue],
          [...result]
        ),
      });

      for (const recipe of dependents) {
        const recipeIdx = recipes.indexOf(recipe);
        inDegree.set(recipe, (inDegree.get(recipe) ?? 0) - 1);

        if (inDegree.get(recipe) === 0) {
          result.push(recipe);
          queue.push(recipe);

          steps.push({
            line: 13,
            explanation: `Recipe "${recipe}" has all ingredients! In-degree=0. Add to available and queue.`,
            variables: { recipe, inDegree: 0 },
            visualization: makeViz(
              { [recipeIdx]: 'found' },
              Object.fromEntries(recipes.map((r, i) => [i, `${r}:${inDegree.get(r)}`])),
              [...queue],
              [...result]
            ),
          });
        } else {
          steps.push({
            line: 11,
            explanation: `Recipe "${recipe}" still needs ${inDegree.get(recipe)} more ingredients.`,
            variables: { recipe, inDegree: inDegree.get(recipe) },
            visualization: makeViz(
              { [recipeIdx]: 'active' },
              Object.fromEntries(recipes.map((r, i) => [i, `${r}:${inDegree.get(r)}`])),
              [...queue],
              [...result]
            ),
          });
        }
      }
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < recipes.length; i++) {
      finalHighlights[i] = result.includes(recipes[i]) ? 'found' : 'mismatch';
    }

    steps.push({
      line: 15,
      explanation: `Possible recipes: [${result.join(', ')}]. These can all be made from the given supplies.`,
      variables: { result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(recipes.map((r, i) => [i, result.includes(r) ? r : `${r}:X`])),
        [],
        [...result]
      ),
    });

    return steps;
  },
};

export default findAllPossibleRecipes;
