import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designTwitter: AlgorithmDefinition = {
  id: 'design-twitter',
  title: 'Design Twitter',
  leetcodeNumber: 355,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a simplified Twitter where users can post tweets, follow/unfollow other users, and retrieve the 10 most recent tweets in their news feed. Use a global timestamp, a hash map for tweets per user, and a hash map for followees per user. The feed merges tweets using a max-heap on timestamps.',
  tags: ['heap', 'hash map', 'design', 'linked list'],

  code: {
    pseudocode: `class Twitter:
  timestamp = 0
  tweets = {}    // userId -> [(time, tweetId)]
  follows = {}   // userId -> set of followeeIds

  postTweet(userId, tweetId):
    tweets[userId].append((timestamp++, tweetId))

  getNewsFeed(userId):
    heap = max-heap of (latest tweet time, tweetId, userId, index)
    // seed with each followee and self
    for each followee in follows[userId] + {userId}:
      if tweets[followee] not empty:
        push (tweets[followee].last) to heap
    result = []
    while heap not empty and len(result) < 10:
      pop top (time, tweetId, uid, idx)
      result.append(tweetId)
      if idx - 1 >= 0:
        push tweets[uid][idx-1] to heap
    return result

  follow(followerId, followeeId):
    follows[followerId].add(followeeId)

  unfollow(followerId, followeeId):
    follows[followerId].discard(followeeId)`,

    python: `import heapq

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = {}   # userId -> list of (-time, tweetId)
        self.follows = {}  # userId -> set

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.setdefault(userId, [])
        self.tweets[userId].append((-self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> list[int]:
        heap = []
        users = self.follows.get(userId, set()) | {userId}
        for u in users:
            if u in self.tweets:
                idx = len(self.tweets[u]) - 1
                t, tid = self.tweets[u][idx]
                heapq.heappush(heap, (t, tid, u, idx))
        res = []
        while heap and len(res) < 10:
            t, tid, u, idx = heapq.heappop(heap)
            res.append(tid)
            if idx > 0:
                nt, ntid = self.tweets[u][idx - 1]
                heapq.heappush(heap, (nt, ntid, u, idx - 1))
        return res

    def follow(self, followerId: int, followeeId: int) -> None:
        self.follows.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follows.get(followerId, set()).discard(followeeId)`,

    javascript: `class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();
    this.follows = new Map();
  }

  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }

  getNewsFeed(userId) {
    const users = new Set([...(this.follows.get(userId) || []), userId]);
    // Collect latest tweets from each followed user
    const candidates = [];
    for (const u of users) {
      const userTweets = this.tweets.get(u) || [];
      for (const [t, tid] of userTweets) {
        candidates.push([t, tid]);
      }
    }
    return candidates
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([, tid]) => tid);
  }

  follow(followerId, followeeId) {
    if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
    this.follows.get(followerId).add(followeeId);
  }

  unfollow(followerId, followeeId) {
    (this.follows.get(followerId) || new Set()).delete(followeeId);
  }
}`,

    java: `class Twitter {
    int time = 0;
    Map<Integer, List<int[]>> tweets = new HashMap<>();
    Map<Integer, Set<Integer>> follows = new HashMap<>();

    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>())
              .add(new int[]{time++, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->b[0]-a[0]);
        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Set.of()));
        users.add(userId);
        for (int u : users) {
            List<int[]> tw = tweets.getOrDefault(u, List.of());
            if (!tw.isEmpty()) {
                int idx = tw.size()-1;
                pq.offer(new int[]{tw.get(idx)[0], tw.get(idx)[1]});
            }
        }
        List<Integer> res = new ArrayList<>();
        while (!pq.isEmpty() && res.size() < 10)
            res.add(pq.poll()[1]);
        return res;
    }

    public void follow(int followerId, int followeeId) {
        follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        follows.getOrDefault(followerId, Set.of()).remove(followeeId);
    }
}`,
  },

  defaultInput: {
    users: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'users',
      label: 'User IDs',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'User IDs participating in the simulation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    let time = 0;
    const tweets: Record<number, Array<[number, number]>> = {};
    const follows: Record<number, Set<number>> = {};

    const postTweet = (userId: number, tweetId: number) => {
      if (!tweets[userId]) tweets[userId] = [];
      tweets[userId].push([time++, tweetId]);
    };

    const follow = (followerId: number, followeeId: number) => {
      if (!follows[followerId]) follows[followerId] = new Set();
      follows[followerId].add(followeeId);
    };

    steps.push({
      line: 1,
      explanation: 'Initialize Twitter with empty tweet and follow maps. Global timestamp starts at 0.',
      variables: { timestamp: 0, tweetsMap: '{}', followsMap: '{}' },
      visualization: {
        type: 'array',
        array: [1, 2, 3],
        highlights: {},
        labels: { 0: 'User 1', 1: 'User 2', 2: 'User 3' },
      },
    });

    postTweet(1, 5);
    steps.push({
      line: 6,
      explanation: `postTweet(userId=1, tweetId=5): User 1 posts tweet #5 at timestamp ${time - 1}.`,
      variables: { userId: 1, tweetId: 5, timestamp: time - 1 },
      visualization: {
        type: 'array',
        array: [5, 0, 0],
        highlights: { 0: 'active' },
        labels: { 0: 'User1: tweet5', 1: 'User 2', 2: 'User 3' },
      },
    });

    postTweet(1, 3);
    steps.push({
      line: 6,
      explanation: `postTweet(userId=1, tweetId=3): User 1 posts tweet #3 at timestamp ${time - 1}.`,
      variables: { userId: 1, tweetId: 3, timestamp: time - 1 },
      visualization: {
        type: 'array',
        array: [5, 3, 0],
        highlights: { 0: 'active', 1: 'active' },
        labels: { 0: 'User1: t5', 1: 'User1: t3', 2: 'User 3' },
      },
    });

    postTweet(2, 7);
    steps.push({
      line: 6,
      explanation: `postTweet(userId=2, tweetId=7): User 2 posts tweet #7 at timestamp ${time - 1}.`,
      variables: { userId: 2, tweetId: 7, timestamp: time - 1 },
      visualization: {
        type: 'array',
        array: [5, 3, 7],
        highlights: { 2: 'active' },
        labels: { 0: 'User1: t5,t3', 1: 'User2: t7', 2: 'User 3' },
      },
    });

    follow(1, 2);
    steps.push({
      line: 21,
      explanation: 'follow(followerId=1, followeeId=2): User 1 now follows User 2. User 1 feed will include User 2 tweets.',
      variables: { followerId: 1, followeeId: 2 },
      visualization: {
        type: 'array',
        array: [1, 2, 0],
        highlights: { 0: 'found', 1: 'found' },
        labels: { 0: 'User 1', 1: 'follows User 2', 2: 'User 3' },
      },
    });

    // getNewsFeed for user 1
    const feedUsers = [1, ...(follows[1] ? [...follows[1]] : [])];
    const candidates: Array<[number, number]> = [];
    for (const u of feedUsers) {
      if (tweets[u]) candidates.push(...tweets[u]);
    }
    candidates.sort((a, b) => b[0] - a[0]);
    const feed = candidates.slice(0, 10).map(([, tid]) => tid);

    steps.push({
      line: 9,
      explanation: `getNewsFeed(userId=1): Merge tweets from User 1 and User 2 (followees). Sort by timestamp descending. Feed: [${feed.join(', ')}].`,
      variables: { userId: 1, feedUsers: feedUsers.join(', '), feed: feed.join(', ') },
      visualization: {
        type: 'array',
        array: feed,
        highlights: feed.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: { 0: 'latest' },
      },
    });

    return steps;
  },
};

export default designTwitter;
