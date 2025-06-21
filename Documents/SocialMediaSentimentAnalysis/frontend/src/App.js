import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this exists

function App() {
  const [query, setQuery] = useState('Bitcoin');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/analyze-reddit', {
        params: { query}
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Reddit Sentiment Analysis</h1>
      
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter topic (e.g. Bitcoin)"
        />
        <button onClick={analyzeSentiment} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-container">
          <h2>Analysis Results for "{query}"</h2>
          <div className="sentiment-summary">
            <h3>Summary:</h3>
            <p>
              Positive: {results.filter(r => r.sentiment === 'POSITIVE').length} posts |
              Negative: {results.filter(r => r.sentiment === 'NEGATIVE').length} posts
            </p>
          </div>

          <div className="posts-list">
            {results.map((post, index) => (
              <div key={index} className={`post-card ${post.sentiment.toLowerCase()}`}>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 150)}...</p>
                <div className="sentiment-badge">
                  Sentiment: {post.sentiment} ({(post.confidence * 100).toFixed(1)}%)
                </div>
                <a 
                  href={`https://reddit.com${post.permalink}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on Reddit
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;