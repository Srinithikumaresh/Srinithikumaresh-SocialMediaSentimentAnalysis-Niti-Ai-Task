const axios = require('axios');

async function getRedditToken() {
  const authString = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

async function searchReddit(query, limit = 5) {
  try {
    const token = await getRedditToken();
    const response = await axios.get(
      'https://oauth.reddit.com/search',
      {
        params: { q: query, limit },
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': process.env.REDDIT_USER_AGENT,
        },
      }
    );

    return response.data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      content: post.data.selftext,
      author: post.data.author,
      subreddit: post.data.subreddit,
      upvotes: post.data.ups,
      created: new Date(post.data.created_utc * 1000),
      permalink: post.data.permalink,
    }));
  } catch (error) {
    console.error('Reddit API error:', error);
    return [];
  }
}

module.exports = { searchReddit };