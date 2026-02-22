import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchSuggestionsSystemTrie: AlgorithmDefinition = {
  id: 'search-suggestions-system-trie',
  title: 'Search Suggestions System (Trie)',
  leetcodeNumber: 1268,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a list of products and a searchWord, return a list of up to 3 product suggestions for each prefix of searchWord (after typing each character). Sort products lexicographically first. Use a trie where each node stores a sorted list of up to 3 products passing through it. As each character is typed, return the stored list at the current node.',
  tags: ['trie', 'string', 'binary search', 'sorting'],

  code: {
    pseudocode: `function suggestedProducts(products, searchWord):
  sort products
  trie = build trie storing top 3 products at each node
  for i, product in enumerate(products):
    node = root
    for ch in product:
      node = node.children[ch]
      if len(node.top3) < 3:
        node.top3.append(product)

  result = []
  node = root
  for ch in searchWord:
    if ch not in node.children:
      fill rest with empty
      break
    node = node.children[ch]
    result.append(node.top3[:])
  return result`,

    python: `def suggestedProducts(products, searchWord):
    products.sort()
    trie = {}
    for p in products:
        node = trie
        for ch in p:
            node = node.setdefault(ch, {'top3': []})
            if len(node['top3']) < 3:
                node['top3'].append(p)
    res = []
    node = trie
    dead = False
    for ch in searchWord:
        if dead or ch not in node:
            res.append([]); dead = True; continue
        node = node[ch]
        res.append(node['top3'][:])
    return res`,

    javascript: `function suggestedProducts(products, searchWord) {
  products.sort();
  const trie = {};
  for (const p of products) {
    let node = trie;
    for (const ch of p) {
      node[ch] = node[ch] || { top3: [] };
      node = node[ch];
      if (node.top3.length < 3) node.top3.push(p);
    }
  }
  const res = [];
  let node = trie, dead = false;
  for (const ch of searchWord) {
    if (dead || !node[ch]) { res.push([]); dead = true; continue; }
    node = node[ch];
    res.push([...node.top3]);
  }
  return res;
}`,

    java: `public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    List<List<String>> res = new ArrayList<>();
    int lo = 0, hi = products.length;
    for (int i = 0; i < searchWord.length(); i++) {
        char ch = searchWord.charAt(i);
        while (lo < hi && (products[lo].length() <= i || products[lo].charAt(i) != ch)) lo++;
        while (lo < hi && (products[hi-1].length() <= i || products[hi-1].charAt(i) != ch)) hi--;
        List<String> curr = new ArrayList<>();
        for (int j = lo; j < Math.min(lo + 3, hi); j++) curr.add(products[j]);
        res.add(curr);
    }
    return res;
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
      placeholder: 'mobile,mouse,moneypot,monitor,mousepad',
      helperText: 'Products to suggest from',
    },
    {
      name: 'searchWord',
      label: 'Search Word',
      type: 'string',
      defaultValue: 'mouse',
      placeholder: 'mouse',
      helperText: 'Word being searched character by character',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const products = (input.products as string[]).slice().sort();
    const searchWord = input.searchWord as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort products lexicographically: [${products.join(', ')}]. Build trie storing top 3 suggestions at each node.`,
      variables: { products: products.join(', '), searchWord },
      visualization: makeViz(products.map((p) => p.length), Object.fromEntries(products.map((_, i) => [i, 'active'])), Object.fromEntries(products.map((p, i) => [i, p]))),
    });

    // Build prefix top-3 map
    const prefixTop3: Record<string, string[]> = {};
    for (const p of products) {
      for (let i = 1; i <= p.length; i++) {
        const prefix = p.slice(0, i);
        if (!prefixTop3[prefix]) prefixTop3[prefix] = [];
        if (prefixTop3[prefix].length < 3) prefixTop3[prefix].push(p);
      }
    }

    steps.push({
      line: 7,
      explanation: `Trie built. Each node stores top 3 matching products. Now simulate typing "${searchWord}" character by character.`,
      variables: { searchWord },
      visualization: makeViz(products.map((p) => p.length), {}, Object.fromEntries(products.map((p, i) => [i, p]))),
    });

    const result: string[][] = [];
    let currentPrefix = '';
    let dead = false;

    for (let ci = 0; ci < searchWord.length; ci++) {
      currentPrefix += searchWord[ci];
      const suggestions = dead ? [] : (prefixTop3[currentPrefix] ?? []);
      if (!prefixTop3[currentPrefix]) dead = true;
      result.push(suggestions);

      steps.push({
        line: 14,
        explanation: `After typing "${currentPrefix}": ${suggestions.length > 0 ? `${suggestions.length} suggestion(s): [${suggestions.join(', ')}]` : 'No products match this prefix.'}.`,
        variables: { prefix: currentPrefix, suggestions: suggestions.join(', ') },
        visualization: makeViz(
          products.map((p) => p.length),
          Object.fromEntries(products.map((p, i) => [i, suggestions.includes(p) ? 'found' : dead ? 'mismatch' : 'default'])),
          Object.fromEntries(products.map((p, i) => [i, p]))
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `Search complete. ${searchWord.length} prefix queries processed. Top 3 suggestions returned for each prefix typed.`,
      variables: { prefixes: searchWord.length, totalResults: result.reduce((a, r) => a + r.length, 0) },
      visualization: makeViz(result.map((r) => r.length), Object.fromEntries(result.map((_, i) => [i, 'found'])), Object.fromEntries(result.map((r, i) => [i, searchWord.slice(0, i + 1)]))),
    });

    return steps;
  },
};

export default searchSuggestionsSystemTrie;
