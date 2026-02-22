import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designTwitterIi: AlgorithmDefinition = {
  id: 'design-twitter-ii',
  title: 'Design Twitter',
  leetcodeNumber: 355,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a simplified version of Twitter. Users can post tweets, follow/unfollow others, and retrieve the 10 most recent tweet IDs from their news feed (own tweets + followed users tweets).',
  tags: ['Hash Map', 'Design', 'Heap'],
  code: {
    pseudocode: `class Twitter:
  function init():
    this.tweets = map userId -> [(time, tweetId)]
    this.following = map userId -> set of followees
    this.time = 0
  function postTweet(userId, tweetId):
    tweets[userId].append((time++, tweetId))
  function getNewsFeed(userId):
    all_tweets = tweets[userId] + tweets[f] for f in following[userId]
    return top 10 by time descending
  function follow(followerId, followeeId):
    following[followerId].add(followeeId)
  function unfollow(followerId, followeeId):
    following[followerId].remove(followeeId)`,
    python: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.tweets = defaultdict(list)
        self.following = defaultdict(set)
        self.time = 0

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int):
        all_tweets = list(self.tweets[userId])
        for f in self.following[userId]:
            all_tweets.extend(self.tweets[f])
        all_tweets.sort(reverse=True)
        return [tid for _, tid in all_tweets[:10]]

    def follow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)`,
    javascript: `class Twitter {
  constructor() {
    this.tweets = new Map();
    this.following = new Map();
    this.time = 0;
  }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }
  getNewsFeed(userId) {
    let all = [...(this.tweets.get(userId) || [])];
    for (const f of (this.following.get(userId) || new Set()))
      all = all.concat(this.tweets.get(f) || []);
    return all.sort((a, b) => b[0] - a[0]).slice(0, 10).map(t => t[1]);
  }
  follow(fId, eId) {
    if (!this.following.has(fId)) this.following.set(fId, new Set());
    this.following.get(fId).add(eId);
  }
  unfollow(fId, eId) { this.following.get(fId)?.delete(eId); }
}`,
    java: `class Twitter {
    private Map<Integer, List<int[]>> tweets = new HashMap<>();
    private Map<Integer, Set<Integer>> following = new HashMap<>();
    private int time = 0;
    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
    }
    public List<Integer> getNewsFeed(int userId) {
        List<int[]> all = new ArrayList<>(tweets.getOrDefault(userId, new ArrayList<>()));
        for (int f : following.getOrDefault(userId, new HashSet<>()))
            all.addAll(tweets.getOrDefault(f, new ArrayList<>()));
        all.sort((a, b) -> b[0] - a[0]);
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < Math.min(10, all.size()); i++) res.add(all.get(i)[1]);
        return res;
    }
    public void follow(int fId, int eId) { following.computeIfAbsent(fId, k -> new HashSet<>()).add(eId); }
    public void unfollow(int fId, int eId) { following.getOrDefault(fId, new HashSet<>()).remove(eId); }
}`,
  },
  defaultInput: {
    operations: [['postTweet', 1, 5], ['postTweet', 1, 3], ['postTweet', 2, 6], ['follow', 1, 2], ['getNewsFeed', 1], ['unfollow', 1, 2], ['getNewsFeed', 1]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'postTweet 1 5, postTweet 1 3, postTweet 2 6, follow 1 2, getNewsFeed 1, unfollow 1 2, getNewsFeed 1',
      placeholder: 'postTweet 1 5, follow 1 2, getNewsFeed 1',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts.length === 3) return [parts[0], Number(parts[1]), Number(parts[2])];
        return [parts[0], Number(parts[1])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const tweets = new Map<number, [number, number][]>();
    const following = new Map<number, Set<number>>();
    let time = 0;

    function getTweetsArr(): number[] {
      const all: number[] = [];
      tweets.forEach((ts) => ts.forEach(([, tid]) => all.push(tid)));
      return all.slice(-10);
    }

    function makeViz(label: string): ArrayVisualization {
      const arr = getTweetsArr();
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      arr.forEach((_, i) => { highlights[i] = 'default'; lbls[i] = `t${i}`; });
      const users = Array.from(tweets.keys());
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Twitter',
          entries: [
            { key: 'Action', value: label },
            { key: 'Users', value: users.join(', ') || 'none' },
            ...users.map(u => ({ key: `User ${u} tweets`, value: (tweets.get(u) || []).map(([, tid]) => tid).join(',') || 'none' })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize Twitter.', variables: {}, visualization: makeViz('Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'postTweet') {
        const userId = Number(op[1]);
        const tweetId = Number(op[2]);
        if (!tweets.has(userId)) tweets.set(userId, []);
        tweets.get(userId)!.push([time++, tweetId]);
        steps.push({ line: 6, explanation: `postTweet(${userId}, ${tweetId}): User ${userId} posts tweet ${tweetId}.`, variables: { userId, tweetId }, visualization: makeViz(`postTweet(${userId},${tweetId})`) });
      } else if (opType === 'follow') {
        const followerId = Number(op[1]);
        const followeeId = Number(op[2]);
        if (!following.has(followerId)) following.set(followerId, new Set());
        following.get(followerId)!.add(followeeId);
        steps.push({ line: 11, explanation: `follow(${followerId}, ${followeeId}): User ${followerId} follows user ${followeeId}.`, variables: { followerId, followeeId }, visualization: makeViz(`follow(${followerId},${followeeId})`) });
      } else if (opType === 'unfollow') {
        const followerId = Number(op[1]);
        const followeeId = Number(op[2]);
        following.get(followerId)?.delete(followeeId);
        steps.push({ line: 13, explanation: `unfollow(${followerId}, ${followeeId}): User ${followerId} unfollows user ${followeeId}.`, variables: { followerId, followeeId }, visualization: makeViz(`unfollow(${followerId},${followeeId})`) });
      } else if (opType === 'getNewsFeed') {
        const userId = Number(op[1]);
        let all = [...(tweets.get(userId) || [])];
        for (const f of (following.get(userId) || new Set())) {
          all = all.concat(tweets.get(f) || []);
        }
        all.sort((a, b) => b[0] - a[0]);
        const feed = all.slice(0, 10).map(t => t[1]);
        const highlights: Record<number, string> = {};
        const lbls: Record<number, string> = {};
        feed.forEach((_, i) => { highlights[i] = 'found'; lbls[i] = `tweet`; });
        steps.push({
          line: 8,
          explanation: `getNewsFeed(${userId}): Return top ${feed.length} tweets: [${feed.join(', ')}].`,
          variables: { userId, feed },
          visualization: {
            type: 'array',
            array: feed,
            highlights,
            labels: lbls,
            auxData: { label: 'News Feed', entries: [{ key: `User ${userId} feed`, value: feed.join(', ') }] },
          },
        });
      }
    }

    steps.push({ line: 14, explanation: 'All operations complete.', variables: {}, visualization: makeViz('Complete') });

    return steps;
  },
};

export default designTwitterIi;
