import React, { useState } from 'react';
import axios from 'axios';

function RedditSentimentAnalyzer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeReddit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:5000/api/analyze-reddit', 
        { params: { query } }
      );
      setResults(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Reddit Sentiment Analysis</h1>
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term"
        />
        <button onClick={analyzeReddit} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Reddit'}
        </button>
      </div>

      <div className="results">
        {results.map((post, index) => (
          <div key={index} className={`post ${post.sentiment.toLowerCase()}`}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 200)}...</p>
            <div className="sentiment-info">
              <span className="sentiment">{post.sentiment}</span>
              <span className="confidence">
                Confidence: {(post.confidence * 100).toFixed(1)}%
              </span>
              <a 
                href={`https://reddit.com${post.permalink}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Reddit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RedditSentimentAnalyzer;