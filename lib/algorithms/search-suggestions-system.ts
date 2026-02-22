import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchSuggestionsSystem: AlgorithmDefinition = {
  id: 'search-suggestions-system',
  title: 'Search Suggestions System',
  leetcodeNumber: 1268,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given an array of products and a search word, return up to 3 lexicographically smallest product suggestions after each character typed. Sort products, then use a trie or binary search. For each prefix, collect at most 3 words that start with that prefix in sorted order.',
  tags: ['Trie', 'Binary Search', 'String'],
  code: {
    pseudocode: `function suggestedProducts(products, searchWord):
  sort products lexicographically
  insert all products into trie
  result = []
  prefix = ""
  for ch in searchWord:
    prefix += ch
    node = findNode(prefix)
    suggestions = []
    DFS trie from node, collect up to 3 words
    result.push(suggestions)
  return result`,
    python: `def suggestedProducts(products, searchWord):
    products.sort()
    result = []
    for i in range(1, len(searchWord) + 1):
        prefix = searchWord[:i]
        # Binary search / filter
        suggestions = [p for p in products if p.startswith(prefix)][:3]
        result.append(suggestions)
    return result`,
    javascript: `function suggestedProducts(products, searchWord) {
  products.sort();
  const result = [];
  for (let i = 1; i <= searchWord.length; i++) {
    const prefix = searchWord.slice(0, i);
    result.push(products.filter(p => p.startsWith(prefix)).slice(0, 3));
  }
  return result;
}`,
    java: `public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    List<List<String>> result = new ArrayList<>();
    for (int i = 1; i <= searchWord.length(); i++) {
        String prefix = searchWord.substring(0, i);
        List<String> suggestions = new ArrayList<>();
        for (String p : products)
            if (p.startsWith(prefix) && suggestions.size() < 3)
                suggestions.add(p);
        result.add(suggestions);
    }
    return result;
}`,
  },
  defaultInput: {
    products: ['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'],
    searchWord: 'mouse',
  },
  inputFields: [
    {
      name: 'products',
      label: 'Products',
      type: 'array',
      defaultValue: ['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'],
      placeholder: '["mobile","mouse","moneypot","monitor","mousepad"]',
      helperText: 'Array of product names',
    },
    {
      name: 'searchWord',
      label: 'Search Word',
      type: 'string',
      defaultValue: 'mouse',
      placeholder: 'mouse',
      helperText: 'Word being typed character by character',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const products = (input.products as string[]).slice().sort();
    const searchWord = input.searchWord as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 2,
      explanation: `Sort products: [${products.join(', ')}]. For each prefix of "${searchWord}", find up to 3 lexicographically smallest products with that prefix.`,
      variables: { products, searchWord },
      visualization: {
        type: 'array',
        array: products.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(products.map((p, i) => [i, p])),
        auxData: {
          label: 'Sorted Products',
          entries: products.map((p, i) => ({ key: String(i), value: p })),
        },
      },
    });

    const allResults: string[][] = [];

    for (let i = 1; i <= searchWord.length; i++) {
      const prefix = searchWord.slice(0, i);
      const suggestions = products.filter(p => p.startsWith(prefix)).slice(0, 3);
      allResults.push(suggestions);

      const hl: Record<number, string> = {};
      products.forEach((p, idx) => {
        if (suggestions.includes(p)) hl[idx] = 'found';
        else if (p.startsWith(prefix)) hl[idx] = 'comparing';
        else hl[idx] = 'visited';
      });

      const searchHl: Record<number, string> = {};
      for (let j = 0; j < searchWord.length; j++) {
        searchHl[j] = j < i ? 'active' : 'default';
      }

      steps.push({
        line: 5,
        explanation: `Typed prefix "${prefix}" (${i}/${searchWord.length} chars). Suggestions: [${suggestions.join(', ') || 'none'}].`,
        variables: { prefix, suggestions, i },
        visualization: {
          type: 'array',
          array: products.map((_, idx) => idx),
          highlights: hl,
          labels: Object.fromEntries(products.map((p, idx) => [idx, p])),
          auxData: {
            label: `After typing "${prefix}"`,
            entries: [
              { key: 'prefix typed', value: prefix },
              { key: 'suggestion 1', value: suggestions[0] ?? '-' },
              { key: 'suggestion 2', value: suggestions[1] ?? '-' },
              { key: 'suggestion 3', value: suggestions[2] ?? '-' },
            ],
          },
        },
      });
    }

    const finalHl: Record<number, string> = {};
    const lastSuggestions = allResults[allResults.length - 1] ?? [];
    products.forEach((p, i) => { finalHl[i] = lastSuggestions.includes(p) ? 'found' : 'visited'; });

    steps.push({
      line: 8,
      explanation: `Done! Generated suggestions for all ${searchWord.length} prefixes of "${searchWord}".`,
      variables: { result: allResults },
      visualization: {
        type: 'array',
        array: products.map((_, i) => i),
        highlights: finalHl,
        labels: Object.fromEntries(products.map((p, i) => [i, p])),
        auxData: {
          label: 'All Suggestions',
          entries: allResults.map((suggs, i) => ({
            key: `"${searchWord.slice(0, i + 1)}"`,
            value: `[${suggs.join(', ')}]`,
          })),
        },
      },
    });

    return steps;
  },
};

export default searchSuggestionsSystem;
