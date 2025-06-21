const express = require('express');
const cors = require('cors'); // Add this line at the top
const { searchReddit } = require('./services/reddit');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const app = express();
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// Middleware
app.use(cors()); // Now this will work
app.use(express.json());
// Routes
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Add this new route
app.get('/api/analyze-reddit', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Get posts from Reddit
    const posts = await searchReddit(query, 5); // Get 5 posts
    
    // Analyze sentiment for each post
    const analyzedPosts = await Promise.all(
      posts.map(async (post) => {
        const textToAnalyze = `${post.title}. ${post.content}`.substring(0, 500);
        const analysis = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: textToAnalyze
        });
        
        return {
          ...post,
          sentiment: analysis[0].label,
          confidence: analysis[0].score
        };
      })
    );

    res.json(analyzedPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});