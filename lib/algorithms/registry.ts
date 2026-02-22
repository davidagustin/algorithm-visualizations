import type { Difficulty } from '../types';

export interface ProblemInfo {
  id: string;
  title: string;
  difficulty: Difficulty;
  leetcodeNumber?: number;
  description: string;
  hasVisualization: boolean;
  tags: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  borderColor: string;
  problems: ProblemInfo[];
}

export const CATEGORIES: CategoryInfo[] = [
  // ─── 01. Two Pointers ───────────────────────────────────────────────
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    icon: '👉',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/30',
    problems: [
      {
        id: 'pair-sum-sorted',
        title: 'Pair Sum - Sorted',
        difficulty: 'Easy',
        leetcodeNumber: 167,
        description:
          'Find two numbers in a sorted array that add up to a target value using the two-pointer technique.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorted'],
      },
      {
        id: 'triplet-sum',
        title: 'Triplet Sum',
        difficulty: 'Medium',
        leetcodeNumber: 15,
        description:
          'Find all unique triplets in an array that sum to zero by combining sorting with two pointers.',
        hasVisualization: false,
        tags: ['two-pointers', 'array', 'sorting'],
      },
      {
        id: 'is-palindrome-valid',
        title: 'Is Palindrome Valid',
        difficulty: 'Easy',
        leetcodeNumber: 125,
        description:
          'Determine if a string is a valid palindrome considering only alphanumeric characters and ignoring case.',
        hasVisualization: false,
        tags: ['two-pointers', 'string'],
      },
      {
        id: 'largest-container',
        title: 'Largest Container',
        difficulty: 'Medium',
        leetcodeNumber: 11,
        description:
          'Find two lines that together with the x-axis form a container holding the most water.',
        hasVisualization: false,
        tags: ['two-pointers', 'array', 'greedy'],
      },
      {
        id: 'shift-zeros-to-the-end',
        title: 'Shift Zeros to the End',
        difficulty: 'Easy',
        leetcodeNumber: 283,
        description:
          'Move all zeros in an array to the end while maintaining the relative order of non-zero elements.',
        hasVisualization: false,
        tags: ['two-pointers', 'array', 'in-place'],
      },
      {
        id: 'next-lexicographical-sequence',
        title: 'Next Lexicographical Sequence',
        difficulty: 'Medium',
        leetcodeNumber: 31,
        description:
          'Rearrange numbers into the next lexicographically greater permutation of the array.',
        hasVisualization: false,
        tags: ['two-pointers', 'array', 'permutation'],
      },
    ],
  },

  // ─── 02. Hash Maps And Sets ─────────────────────────────────────────
  {
    id: 'hash-maps-and-sets',
    name: 'Hash Maps And Sets',
    icon: '🗂️',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    problems: [
      {
        id: 'pair-sum-unsorted',
        title: 'Pair Sum - Unsorted',
        difficulty: 'Easy',
        leetcodeNumber: 1,
        description:
          'Find two numbers in an unsorted array that add up to a target using a hash map for O(n) lookup.',
        hasVisualization: true,
        tags: ['hash-map', 'array'],
      },
      {
        id: 'verify-sudoku-board',
        title: 'Verify Sudoku Board',
        difficulty: 'Medium',
        leetcodeNumber: 36,
        description:
          'Validate whether a partially filled 9x9 Sudoku board is valid using hash sets for rows, columns, and boxes.',
        hasVisualization: false,
        tags: ['hash-set', 'matrix', 'validation'],
      },
      {
        id: 'zero-striping',
        title: 'Zero Striping',
        difficulty: 'Medium',
        leetcodeNumber: 73,
        description:
          'If an element in a matrix is zero, set its entire row and column to zero.',
        hasVisualization: false,
        tags: ['hash-set', 'matrix', 'in-place'],
      },
      {
        id: 'longest-chain-of-consecutive-numbers',
        title: 'Longest Chain of Consecutive Numbers',
        difficulty: 'Medium',
        leetcodeNumber: 128,
        description:
          'Find the length of the longest sequence of consecutive integers in an unsorted array using a hash set.',
        hasVisualization: false,
        tags: ['hash-set', 'array', 'sequence'],
      },
      {
        id: 'geometric-sequence-triplets',
        title: 'Geometric Sequence Triplets',
        difficulty: 'Medium',
        description:
          'Count triplets in an array that form a geometric progression with a given common ratio.',
        hasVisualization: false,
        tags: ['hash-map', 'array', 'math'],
      },
    ],
  },

  // ─── 03. Linked Lists ──────────────────────────────────────────────
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    icon: '🔗',
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 to-violet-600/10',
    borderColor: 'border-violet-500/30',
    problems: [
      {
        id: 'linked-list-reversal',
        title: 'Linked List Reversal',
        difficulty: 'Easy',
        leetcodeNumber: 206,
        description:
          'Reverse a singly linked list by iteratively re-pointing each node to its predecessor.',
        hasVisualization: true,
        tags: ['linked-list', 'in-place'],
      },
      {
        id: 'remove-kth-last-node',
        title: 'Remove Kth Last Node',
        difficulty: 'Medium',
        leetcodeNumber: 19,
        description:
          'Remove the kth node from the end of a linked list using a two-pointer gap technique.',
        hasVisualization: false,
        tags: ['linked-list', 'two-pointers'],
      },
      {
        id: 'linked-list-intersection',
        title: 'Linked List Intersection',
        difficulty: 'Easy',
        leetcodeNumber: 160,
        description:
          'Find the node where two singly linked lists intersect by aligning their traversal lengths.',
        hasVisualization: false,
        tags: ['linked-list', 'two-pointers'],
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'Medium',
        leetcodeNumber: 146,
        description:
          'Design a data structure that supports get and put operations in O(1) using a hash map and doubly linked list.',
        hasVisualization: false,
        tags: ['linked-list', 'hash-map', 'design'],
      },
      {
        id: 'palindromic-linked-list',
        title: 'Palindromic Linked List',
        difficulty: 'Easy',
        leetcodeNumber: 234,
        description:
          'Determine whether a singly linked list is a palindrome using O(1) extra space.',
        hasVisualization: false,
        tags: ['linked-list', 'two-pointers', 'palindrome'],
      },
      {
        id: 'flatten-multi-level-linked-list',
        title: 'Flatten Multi-Level Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 430,
        description:
          'Flatten a doubly linked list where nodes may have child sublists into a single-level list.',
        hasVisualization: false,
        tags: ['linked-list', 'recursion', 'dfs'],
      },
    ],
  },

  // ─── 04. Fast And Slow Pointers ─────────────────────────────────────
  {
    id: 'fast-and-slow-pointers',
    name: 'Fast And Slow Pointers',
    icon: '🐇',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-pink-600/10',
    borderColor: 'border-pink-500/30',
    problems: [
      {
        id: 'linked-list-loop',
        title: 'Linked List Loop',
        difficulty: 'Easy',
        leetcodeNumber: 141,
        description:
          'Detect whether a linked list contains a cycle using Floyd\'s tortoise and hare algorithm.',
        hasVisualization: false,
        tags: ['linked-list', 'fast-slow-pointers', 'cycle-detection'],
      },
      {
        id: 'linked-list-midpoint',
        title: 'Linked List Midpoint',
        difficulty: 'Easy',
        leetcodeNumber: 876,
        description:
          'Find the middle node of a linked list in a single pass using fast and slow pointers.',
        hasVisualization: false,
        tags: ['linked-list', 'fast-slow-pointers'],
      },
      {
        id: 'happy-number',
        title: 'Happy Number',
        difficulty: 'Easy',
        leetcodeNumber: 202,
        description:
          'Determine if a number eventually reaches 1 when repeatedly replacing it with the sum of the squares of its digits.',
        hasVisualization: false,
        tags: ['math', 'fast-slow-pointers', 'cycle-detection'],
      },
    ],
  },

  // ─── 05. Sliding Windows ───────────────────────────────────────────
  {
    id: 'sliding-windows',
    name: 'Sliding Windows',
    icon: '🪟',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/30',
    problems: [
      {
        id: 'substring-anagrams',
        title: 'Substring Anagrams',
        difficulty: 'Medium',
        leetcodeNumber: 438,
        description:
          'Find all start indices of anagrams of a pattern within a string using a sliding window with character counts.',
        hasVisualization: false,
        tags: ['sliding-window', 'string', 'hash-map'],
      },
      {
        id: 'longest-substring-with-unique-characters',
        title: 'Longest Substring With Unique Characters',
        difficulty: 'Medium',
        leetcodeNumber: 3,
        description:
          'Find the length of the longest substring without repeating characters using an expanding and shrinking window.',
        hasVisualization: true,
        tags: ['sliding-window', 'string', 'hash-set'],
      },
      {
        id: 'longest-uniform-substring-after-replacements',
        title: 'Longest Uniform Substring After Replacements',
        difficulty: 'Medium',
        leetcodeNumber: 424,
        description:
          'Find the longest substring of identical characters you can achieve with at most k character replacements.',
        hasVisualization: false,
        tags: ['sliding-window', 'string'],
      },
    ],
  },

  // ─── 06. Binary Search ─────────────────────────────────────────────
  {
    id: 'binary-search',
    name: 'Binary Search',
    icon: '🔍',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-600/10',
    borderColor: 'border-cyan-500/30',
    problems: [
      {
        id: 'find-the-insertion-index',
        title: 'Find the Insertion Index',
        difficulty: 'Easy',
        leetcodeNumber: 35,
        description:
          'Find the index where a target should be inserted in a sorted array to maintain order.',
        hasVisualization: true,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'first-and-last-occurrences',
        title: 'First and Last Occurrences',
        difficulty: 'Medium',
        leetcodeNumber: 34,
        description:
          'Find the first and last positions of a target value in a sorted array using two binary searches.',
        hasVisualization: false,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'cutting-wood',
        title: 'Cutting Wood',
        difficulty: 'Medium',
        leetcodeNumber: 875,
        description:
          'Binary search on the answer to find the optimal cutting height that yields at least the required amount of wood.',
        hasVisualization: false,
        tags: ['binary-search', 'greedy'],
      },
      {
        id: 'find-target-in-rotated-sorted-array',
        title: 'Find Target in Rotated Sorted Array',
        difficulty: 'Medium',
        leetcodeNumber: 33,
        description:
          'Search for a target in a sorted array that has been rotated at an unknown pivot.',
        hasVisualization: false,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'find-median-from-two-sorted-arrays',
        title: 'Find Median From Two Sorted Arrays',
        difficulty: 'Hard',
        leetcodeNumber: 4,
        description:
          'Find the median of two sorted arrays in O(log(min(m,n))) time by binary searching the partition point.',
        hasVisualization: false,
        tags: ['binary-search', 'array', 'divide-and-conquer'],
      },
      {
        id: 'matrix-search',
        title: 'Matrix Search',
        difficulty: 'Medium',
        leetcodeNumber: 74,
        description:
          'Search for a target in a row-sorted matrix by treating it as a virtual flattened sorted array.',
        hasVisualization: false,
        tags: ['binary-search', 'matrix'],
      },
      {
        id: 'local-maxima-in-array',
        title: 'Local Maxima in Array',
        difficulty: 'Medium',
        leetcodeNumber: 162,
        description:
          'Find a peak element in an array where neighbors are unequal using binary search on the gradient.',
        hasVisualization: false,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'weighted-random-selection',
        title: 'Weighted Random Selection',
        difficulty: 'Medium',
        leetcodeNumber: 528,
        description:
          'Pick an index at random with probability proportional to its weight using prefix sums and binary search.',
        hasVisualization: false,
        tags: ['binary-search', 'prefix-sum', 'random'],
      },
    ],
  },

  // ─── 07. Stacks ────────────────────────────────────────────────────
  {
    id: 'stacks',
    name: 'Stacks',
    icon: '📚',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-orange-600/10',
    borderColor: 'border-orange-500/30',
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parenthesis Expression',
        difficulty: 'Easy',
        leetcodeNumber: 20,
        description:
          'Determine if a string of brackets is valid by using a stack to match opening and closing pairs.',
        hasVisualization: true,
        tags: ['stack', 'string'],
      },
      {
        id: 'next-largest-number-to-the-right',
        title: 'Next Largest Number to the Right',
        difficulty: 'Medium',
        leetcodeNumber: 496,
        description:
          'For each element, find the next greater element to its right using a monotonic stack.',
        hasVisualization: false,
        tags: ['stack', 'array', 'monotonic-stack'],
      },
      {
        id: 'evaluate-expression',
        title: 'Evaluate Expression',
        difficulty: 'Hard',
        leetcodeNumber: 224,
        description:
          'Evaluate a mathematical expression string with parentheses, addition, and subtraction using a stack.',
        hasVisualization: false,
        tags: ['stack', 'string', 'math'],
      },
      {
        id: 'repeated-removal-of-adjacent-duplicates',
        title: 'Repeated Removal of Adjacent Duplicates',
        difficulty: 'Medium',
        leetcodeNumber: 1209,
        description:
          'Remove all adjacent groups of k duplicate characters repeatedly using a stack-based approach.',
        hasVisualization: false,
        tags: ['stack', 'string'],
      },
      {
        id: 'implement-queue-using-stacks',
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        leetcodeNumber: 232,
        description:
          'Implement a FIFO queue using only two LIFO stacks with amortized O(1) operations.',
        hasVisualization: false,
        tags: ['stack', 'queue', 'design'],
      },
      {
        id: 'maximums-of-sliding-window',
        title: 'Maximums of Sliding Window',
        difficulty: 'Hard',
        leetcodeNumber: 239,
        description:
          'Find the maximum value in each sliding window of size k using a monotonic deque.',
        hasVisualization: false,
        tags: ['stack', 'deque', 'sliding-window'],
      },
    ],
  },

  // ─── 08. Heaps ─────────────────────────────────────────────────────
  {
    id: 'heaps',
    name: 'Heaps',
    icon: '🏔️',
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-rose-600/10',
    borderColor: 'border-rose-500/30',
    problems: [
      {
        id: 'k-most-frequent-strings',
        title: 'K Most Frequent Strings',
        difficulty: 'Medium',
        leetcodeNumber: 692,
        description:
          'Find the k most frequently occurring strings using a hash map and a min-heap of size k.',
        hasVisualization: false,
        tags: ['heap', 'hash-map', 'sorting'],
      },
      {
        id: 'combine-sorted-linked-lists',
        title: 'Combine Sorted Linked Lists',
        difficulty: 'Hard',
        leetcodeNumber: 23,
        description:
          'Merge k sorted linked lists into one sorted list using a min-heap to always pick the smallest head.',
        hasVisualization: false,
        tags: ['heap', 'linked-list', 'merge'],
      },
      {
        id: 'median-of-integer-stream',
        title: 'Median of Integer Stream',
        difficulty: 'Hard',
        leetcodeNumber: 295,
        description:
          'Find the median from a continuous data stream efficiently using a max-heap and min-heap.',
        hasVisualization: false,
        tags: ['heap', 'design', 'stream'],
      },
      {
        id: 'sort-k-sorted-array',
        title: 'Sort K-Sorted Array',
        difficulty: 'Medium',
        description:
          'Sort a nearly sorted array where each element is at most k positions from its final position using a min-heap.',
        hasVisualization: false,
        tags: ['heap', 'array', 'sorting'],
      },
    ],
  },

  // ─── 09. Intervals ─────────────────────────────────────────────────
  {
    id: 'intervals',
    name: 'Intervals',
    icon: '📏',
    color: 'text-teal-400',
    gradient: 'from-teal-500/20 to-teal-600/10',
    borderColor: 'border-teal-500/30',
    problems: [
      {
        id: 'merge-overlapping-intervals',
        title: 'Merge Overlapping Intervals',
        difficulty: 'Medium',
        leetcodeNumber: 56,
        description:
          'Merge all overlapping intervals by sorting and greedily extending the current interval.',
        hasVisualization: false,
        tags: ['intervals', 'sorting', 'greedy'],
      },
      {
        id: 'identify-all-interval-overlaps',
        title: 'Identify All Interval Overlaps',
        difficulty: 'Medium',
        leetcodeNumber: 986,
        description:
          'Find all overlapping segments between two sorted lists of intervals using a two-pointer approach.',
        hasVisualization: false,
        tags: ['intervals', 'two-pointers'],
      },
      {
        id: 'largest-overlap-of-intervals',
        title: 'Largest Overlap of Intervals',
        difficulty: 'Medium',
        leetcodeNumber: 253,
        description:
          'Determine the maximum number of intervals that overlap at any single point using a sweep line.',
        hasVisualization: false,
        tags: ['intervals', 'sorting', 'sweep-line'],
      },
    ],
  },

  // ─── 10. Prefix Sums ───────────────────────────────────────────────
  {
    id: 'prefix-sums',
    name: 'Prefix Sums',
    icon: '📊',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-indigo-600/10',
    borderColor: 'border-indigo-500/30',
    problems: [
      {
        id: 'sum-between-range',
        title: 'Sum Between Range',
        difficulty: 'Easy',
        leetcodeNumber: 303,
        description:
          'Answer range sum queries in O(1) time after an O(n) prefix sum precomputation.',
        hasVisualization: false,
        tags: ['prefix-sum', 'array'],
      },
      {
        id: 'k-sum-subarrays',
        title: 'K-Sum Subarrays',
        difficulty: 'Medium',
        leetcodeNumber: 560,
        description:
          'Count the number of subarrays that sum to k using prefix sums and a hash map.',
        hasVisualization: false,
        tags: ['prefix-sum', 'hash-map', 'array'],
      },
      {
        id: 'product-array-without-current-element',
        title: 'Product Array Without Current Element',
        difficulty: 'Medium',
        leetcodeNumber: 238,
        description:
          'Compute an array where each element is the product of all other elements without using division.',
        hasVisualization: false,
        tags: ['prefix-sum', 'array'],
      },
    ],
  },

  // ─── 11. Trees ─────────────────────────────────────────────────────
  {
    id: 'trees',
    name: 'Trees',
    icon: '🌳',
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-600/10',
    borderColor: 'border-green-500/30',
    problems: [
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        leetcodeNumber: 226,
        description:
          'Mirror a binary tree by recursively swapping each node\'s left and right children.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'balanced-binary-tree-validation',
        title: 'Balanced Binary Tree Validation',
        difficulty: 'Easy',
        leetcodeNumber: 110,
        description:
          'Check whether a binary tree is height-balanced where subtree depths differ by at most one.',
        hasVisualization: false,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'rightmost-nodes-of-binary-tree',
        title: 'Rightmost Nodes of Binary Tree',
        difficulty: 'Medium',
        leetcodeNumber: 199,
        description:
          'Return the values visible when looking at a binary tree from the right side using level-order traversal.',
        hasVisualization: false,
        tags: ['tree', 'bfs'],
      },
      {
        id: 'widest-binary-tree-level',
        title: 'Widest Binary Tree Level',
        difficulty: 'Medium',
        leetcodeNumber: 662,
        description:
          'Find the maximum width among all levels of a binary tree using indexed BFS.',
        hasVisualization: false,
        tags: ['tree', 'bfs'],
      },
      {
        id: 'bst-validation',
        title: 'BST Validation',
        difficulty: 'Medium',
        leetcodeNumber: 98,
        description:
          'Validate whether a binary tree satisfies binary search tree properties using range constraints.',
        hasVisualization: false,
        tags: ['tree', 'bst', 'dfs'],
      },
      {
        id: 'lowest-common-ancestor',
        title: 'Lowest Common Ancestor',
        difficulty: 'Medium',
        leetcodeNumber: 236,
        description:
          'Find the deepest node that is an ancestor of both given nodes in a binary tree.',
        hasVisualization: false,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'build-binary-tree-from-preorder-inorder',
        title: 'Build Binary Tree From Preorder/Inorder',
        difficulty: 'Medium',
        leetcodeNumber: 105,
        description:
          'Reconstruct a binary tree given its preorder and inorder traversal sequences.',
        hasVisualization: false,
        tags: ['tree', 'recursion', 'divide-and-conquer'],
      },
      {
        id: 'max-sum-continuous-path',
        title: 'Max Sum Continuous Path',
        difficulty: 'Hard',
        leetcodeNumber: 124,
        description:
          'Find the path with the maximum sum in a binary tree where the path can start and end at any node.',
        hasVisualization: false,
        tags: ['tree', 'recursion', 'dfs', 'dynamic-programming'],
      },
      {
        id: 'binary-tree-symmetry',
        title: 'Binary Tree Symmetry',
        difficulty: 'Easy',
        leetcodeNumber: 101,
        description:
          'Check whether a binary tree is a mirror of itself around its center.',
        hasVisualization: false,
        tags: ['tree', 'recursion', 'bfs'],
      },
      {
        id: 'binary-tree-columns',
        title: 'Binary Tree Columns',
        difficulty: 'Hard',
        leetcodeNumber: 314,
        description:
          'Group binary tree nodes by their vertical column index using BFS and a column offset map.',
        hasVisualization: false,
        tags: ['tree', 'bfs', 'hash-map'],
      },
      {
        id: 'kth-smallest-in-bst',
        title: 'Kth Smallest in BST',
        difficulty: 'Medium',
        leetcodeNumber: 230,
        description:
          'Find the kth smallest element in a BST using an in-order traversal.',
        hasVisualization: false,
        tags: ['tree', 'bst', 'dfs'],
      },
      {
        id: 'serialize-deserialize-binary-tree',
        title: 'Serialize/Deserialize Binary Tree',
        difficulty: 'Hard',
        leetcodeNumber: 297,
        description:
          'Encode a binary tree to a string and decode it back using preorder traversal with null markers.',
        hasVisualization: false,
        tags: ['tree', 'design', 'string'],
      },
    ],
  },

  // ─── 12. Tries ─────────────────────────────────────────────────────
  {
    id: 'tries',
    name: 'Tries',
    icon: '🔤',
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-500/20 to-fuchsia-600/10',
    borderColor: 'border-fuchsia-500/30',
    problems: [
      {
        id: 'design-a-trie',
        title: 'Design a Trie',
        difficulty: 'Medium',
        leetcodeNumber: 208,
        description:
          'Implement a trie with insert, search, and startsWith operations for efficient prefix lookups.',
        hasVisualization: false,
        tags: ['trie', 'design', 'string'],
      },
      {
        id: 'insert-and-search-words-with-wildcards',
        title: 'Insert and Search Words with Wildcards',
        difficulty: 'Medium',
        leetcodeNumber: 211,
        description:
          'Design a data structure that supports adding words and searching with wildcard dot characters.',
        hasVisualization: false,
        tags: ['trie', 'design', 'string', 'backtracking'],
      },
      {
        id: 'find-all-words-on-a-board',
        title: 'Find All Words on a Board',
        difficulty: 'Hard',
        leetcodeNumber: 212,
        description:
          'Find all words from a dictionary that can be formed on a character board using a trie-guided DFS.',
        hasVisualization: false,
        tags: ['trie', 'backtracking', 'matrix'],
      },
    ],
  },

  // ─── 13. Graphs ────────────────────────────────────────────────────
  {
    id: 'graphs',
    name: 'Graphs',
    icon: '🕸️',
    color: 'text-sky-400',
    gradient: 'from-sky-500/20 to-sky-600/10',
    borderColor: 'border-sky-500/30',
    problems: [
      {
        id: 'graph-deep-copy',
        title: 'Graph Deep Copy',
        difficulty: 'Medium',
        leetcodeNumber: 133,
        description:
          'Create a deep copy of a connected undirected graph using BFS or DFS with a visited map.',
        hasVisualization: false,
        tags: ['graph', 'bfs', 'dfs', 'hash-map'],
      },
      {
        id: 'count-islands',
        title: 'Count Islands',
        difficulty: 'Medium',
        leetcodeNumber: 200,
        description:
          'Count the number of distinct islands in a 2D grid by flood-filling connected land cells.',
        hasVisualization: false,
        tags: ['graph', 'bfs', 'dfs', 'matrix'],
      },
      {
        id: 'matrix-infection',
        title: 'Matrix Infection',
        difficulty: 'Medium',
        leetcodeNumber: 994,
        description:
          'Determine how many rounds it takes for all cells to become infected using multi-source BFS.',
        hasVisualization: false,
        tags: ['graph', 'bfs', 'matrix'],
      },
      {
        id: 'bipartite-graph-validation',
        title: 'Bipartite Graph Validation',
        difficulty: 'Medium',
        leetcodeNumber: 785,
        description:
          'Check if a graph can be two-colored so no adjacent nodes share the same color.',
        hasVisualization: false,
        tags: ['graph', 'bfs', 'dfs'],
      },
      {
        id: 'longest-increasing-path',
        title: 'Longest Increasing Path',
        difficulty: 'Hard',
        leetcodeNumber: 329,
        description:
          'Find the longest strictly increasing path in a matrix using DFS with memoization.',
        hasVisualization: false,
        tags: ['graph', 'dfs', 'dynamic-programming', 'matrix'],
      },
      {
        id: 'shortest-transformation-sequence',
        title: 'Shortest Transformation Sequence',
        difficulty: 'Hard',
        leetcodeNumber: 127,
        description:
          'Find the shortest word ladder from begin to end word, changing one letter at a time, using BFS.',
        hasVisualization: false,
        tags: ['graph', 'bfs', 'string'],
      },
      {
        id: 'merging-communities',
        title: 'Merging Communities',
        difficulty: 'Medium',
        leetcodeNumber: 547,
        description:
          'Group connected nodes into communities using Union-Find with path compression and union by rank.',
        hasVisualization: false,
        tags: ['graph', 'union-find'],
      },
      {
        id: 'prerequisites',
        title: 'Prerequisites',
        difficulty: 'Medium',
        leetcodeNumber: 207,
        description:
          'Determine if all courses can be completed given prerequisite constraints using topological sort.',
        hasVisualization: false,
        tags: ['graph', 'topological-sort', 'dfs'],
      },
      {
        id: 'shortest-path',
        title: 'Shortest Path',
        difficulty: 'Medium',
        leetcodeNumber: 743,
        description:
          'Find the shortest paths from a source node to all other nodes using Dijkstra\'s algorithm.',
        hasVisualization: false,
        tags: ['graph', 'dijkstra', 'heap'],
      },
      {
        id: 'connect-the-dots',
        title: 'Connect the Dots',
        difficulty: 'Medium',
        leetcodeNumber: 1584,
        description:
          'Find the minimum cost to connect all points using a minimum spanning tree algorithm.',
        hasVisualization: false,
        tags: ['graph', 'mst', 'greedy'],
      },
    ],
  },

  // ─── 14. Backtracking ──────────────────────────────────────────────
  {
    id: 'backtracking',
    name: 'Backtracking',
    icon: '🔙',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/30',
    problems: [
      {
        id: 'find-all-permutations',
        title: 'Find All Permutations',
        difficulty: 'Medium',
        leetcodeNumber: 46,
        description:
          'Generate all possible orderings of a list of distinct numbers by swapping and backtracking.',
        hasVisualization: false,
        tags: ['backtracking', 'recursion'],
      },
      {
        id: 'find-all-subsets',
        title: 'Find All Subsets',
        difficulty: 'Medium',
        leetcodeNumber: 78,
        description:
          'Generate the power set of a list of distinct integers by including or excluding each element.',
        hasVisualization: false,
        tags: ['backtracking', 'recursion', 'bit-manipulation'],
      },
      {
        id: 'n-queens',
        title: 'N Queens',
        difficulty: 'Hard',
        leetcodeNumber: 51,
        description:
          'Place N queens on an NxN chessboard so that no two queens threaten each other using backtracking.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'constraint-satisfaction'],
      },
      {
        id: 'combinations-of-a-sum',
        title: 'Combinations of a Sum',
        difficulty: 'Medium',
        leetcodeNumber: 39,
        description:
          'Find all unique combinations of candidates that sum to a target, allowing repeated use of elements.',
        hasVisualization: false,
        tags: ['backtracking', 'recursion'],
      },
      {
        id: 'phone-keypad-combinations',
        title: 'Phone Keypad Combinations',
        difficulty: 'Medium',
        leetcodeNumber: 17,
        description:
          'Map digit sequences to all possible letter combinations from a phone keypad.',
        hasVisualization: false,
        tags: ['backtracking', 'recursion', 'string'],
      },
    ],
  },

  // ─── 15. Dynamic Programming ───────────────────────────────────────
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: '🧮',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/30',
    problems: [
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        leetcodeNumber: 70,
        description:
          'Count the number of distinct ways to climb n stairs when you can take 1 or 2 steps at a time.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'fibonacci'],
      },
      {
        id: 'minimum-coin-combination',
        title: 'Minimum Coin Combination',
        difficulty: 'Medium',
        leetcodeNumber: 322,
        description:
          'Find the fewest coins needed to make a target amount using bottom-up dynamic programming.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'matrix-pathways',
        title: 'Matrix Pathways',
        difficulty: 'Medium',
        leetcodeNumber: 62,
        description:
          'Count the number of unique paths from top-left to bottom-right of a grid moving only right or down.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'matrix'],
      },
      {
        id: 'neighborhood-burglary',
        title: 'Neighborhood Burglary',
        difficulty: 'Medium',
        leetcodeNumber: 198,
        description:
          'Maximize the amount robbed from non-adjacent houses along a street using DP.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        leetcodeNumber: 1143,
        description:
          'Find the length of the longest subsequence common to two strings using a 2D DP table.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'string'],
      },
      {
        id: 'longest-palindrome-in-string',
        title: 'Longest Palindrome in String',
        difficulty: 'Medium',
        leetcodeNumber: 5,
        description:
          'Find the longest palindromic substring by expanding around each center or using DP.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'string', 'palindrome'],
      },
      {
        id: 'maximum-subarray-sum',
        title: 'Maximum Subarray Sum',
        difficulty: 'Medium',
        leetcodeNumber: 53,
        description:
          'Find the contiguous subarray with the largest sum using Kadane\'s algorithm.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'array', 'greedy'],
      },
      {
        id: '0-1-knapsack',
        title: '0/1 Knapsack',
        difficulty: 'Medium',
        description:
          'Maximize the value of items packed into a weight-limited knapsack where each item is taken or left.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'largest-square-in-matrix',
        title: 'Largest Square in Matrix',
        difficulty: 'Medium',
        leetcodeNumber: 221,
        description:
          'Find the area of the largest square containing only ones in a binary matrix using DP.',
        hasVisualization: false,
        tags: ['dynamic-programming', 'matrix'],
      },
    ],
  },

  // ─── 16. Greedy ────────────────────────────────────────────────────
  {
    id: 'greedy',
    name: 'Greedy',
    icon: '🤑',
    color: 'text-lime-400',
    gradient: 'from-lime-500/20 to-lime-600/10',
    borderColor: 'border-lime-500/30',
    problems: [
      {
        id: 'jump-to-the-end',
        title: 'Jump to the End',
        difficulty: 'Medium',
        leetcodeNumber: 55,
        description:
          'Determine if you can reach the last index of an array by greedily tracking the farthest reachable position.',
        hasVisualization: false,
        tags: ['greedy', 'array'],
      },
      {
        id: 'gas-stations',
        title: 'Gas Stations',
        difficulty: 'Medium',
        leetcodeNumber: 134,
        description:
          'Find the starting gas station index for a circular tour where you never run out of fuel.',
        hasVisualization: false,
        tags: ['greedy', 'array'],
      },
      {
        id: 'candies',
        title: 'Candies',
        difficulty: 'Hard',
        leetcodeNumber: 135,
        description:
          'Distribute minimum candies to children in a line so each child with a higher rating gets more than neighbors.',
        hasVisualization: false,
        tags: ['greedy', 'array'],
      },
    ],
  },

  // ─── 17. Sort And Search ───────────────────────────────────────────
  {
    id: 'sort-and-search',
    name: 'Sort And Search',
    icon: '🔀',
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/30',
    problems: [
      {
        id: 'sort-linked-list',
        title: 'Sort Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 148,
        description:
          'Sort a linked list in O(n log n) time using merge sort with slow-fast pointer splitting.',
        hasVisualization: false,
        tags: ['sorting', 'linked-list', 'merge-sort'],
      },
      {
        id: 'sort-array',
        title: 'Sort Array',
        difficulty: 'Medium',
        leetcodeNumber: 912,
        description:
          'Implement an efficient sorting algorithm such as merge sort or quicksort for an integer array.',
        hasVisualization: false,
        tags: ['sorting', 'array', 'divide-and-conquer'],
      },
      {
        id: 'kth-largest-integer',
        title: 'Kth Largest Integer',
        difficulty: 'Medium',
        leetcodeNumber: 215,
        description:
          'Find the kth largest element using quickselect for average O(n) time without full sorting.',
        hasVisualization: false,
        tags: ['sorting', 'array', 'quickselect'],
      },
      {
        id: 'dutch-national-flag',
        title: 'Dutch National Flag',
        difficulty: 'Medium',
        leetcodeNumber: 75,
        description:
          'Sort an array of 0s, 1s, and 2s in-place in a single pass using three-way partitioning.',
        hasVisualization: true,
        tags: ['sorting', 'array', 'two-pointers'],
      },
    ],
  },

  // ─── 18. Bit Manipulation ──────────────────────────────────────────
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    icon: '🔢',
    color: 'text-slate-400',
    gradient: 'from-slate-500/20 to-slate-600/10',
    borderColor: 'border-slate-500/30',
    problems: [
      {
        id: 'hamming-weights-of-integers',
        title: 'Hamming Weights of Integers',
        difficulty: 'Easy',
        leetcodeNumber: 338,
        description:
          'Count the number of 1-bits for every integer from 0 to n using DP on the least significant bit.',
        hasVisualization: false,
        tags: ['bit-manipulation', 'dynamic-programming'],
      },
      {
        id: 'lonely-integer',
        title: 'Lonely Integer',
        difficulty: 'Easy',
        leetcodeNumber: 136,
        description:
          'Find the single element that appears only once in an array where every other element appears twice using XOR.',
        hasVisualization: false,
        tags: ['bit-manipulation', 'array'],
      },
      {
        id: 'swap-odd-and-even-bits',
        title: 'Swap Odd and Even Bits',
        difficulty: 'Easy',
        description:
          'Swap all odd-positioned bits with even-positioned bits in an integer using bit masks and shifts.',
        hasVisualization: false,
        tags: ['bit-manipulation'],
      },
    ],
  },

  // ─── 19. Math And Geometry ─────────────────────────────────────────
  {
    id: 'math-and-geometry',
    name: 'Math And Geometry',
    icon: '📐',
    color: 'text-stone-400',
    gradient: 'from-stone-500/20 to-stone-600/10',
    borderColor: 'border-stone-500/30',
    problems: [
      {
        id: 'spiral-traversal',
        title: 'Spiral Traversal',
        difficulty: 'Medium',
        leetcodeNumber: 54,
        description:
          'Traverse a matrix in spiral order by peeling off the outermost layer in each iteration.',
        hasVisualization: false,
        tags: ['matrix', 'simulation'],
      },
      {
        id: 'reverse-32-bit-integer',
        title: 'Reverse 32-Bit Integer',
        difficulty: 'Medium',
        leetcodeNumber: 7,
        description:
          'Reverse the digits of a signed 32-bit integer, returning 0 if the result overflows.',
        hasVisualization: false,
        tags: ['math'],
      },
      {
        id: 'maximum-collinear-points',
        title: 'Maximum Collinear Points',
        difficulty: 'Hard',
        leetcodeNumber: 149,
        description:
          'Find the maximum number of points that lie on the same straight line using slope grouping.',
        hasVisualization: false,
        tags: ['math', 'geometry', 'hash-map'],
      },
      {
        id: 'the-josephus-problem',
        title: 'The Josephus Problem',
        difficulty: 'Medium',
        description:
          'Find the survivor position when every kth person is eliminated in a circle using the Josephus recurrence.',
        hasVisualization: false,
        tags: ['math', 'recursion'],
      },
      {
        id: 'triangle-numbers',
        title: 'Triangle Numbers',
        difficulty: 'Easy',
        leetcodeNumber: 118,
        description:
          'Generate the first n rows of Pascal\'s triangle where each entry is the sum of the two above it.',
        hasVisualization: false,
        tags: ['math', 'array', 'dynamic-programming'],
      },
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────

/**
 * Returns a flat array of all problems across every category.
 */
export function getAllProblems(): ProblemInfo[] {
  return CATEGORIES.flatMap((category) => category.problems);
}

/**
 * Finds a category by its slug/id.
 */
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) => category.id === slug);
}

/**
 * Finds a problem by its id across all categories.
 */
export function getProblemById(id: string): ProblemInfo | undefined {
  return getAllProblems().find((problem) => problem.id === id);
}

/**
 * Returns the category that contains the given problem id.
 */
export function getCategoryForProblem(problemId: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) =>
    category.problems.some((problem) => problem.id === problemId)
  );
}
