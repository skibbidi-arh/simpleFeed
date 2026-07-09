import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../api';
import PostCard from './PostCard';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
      <div className="skeleton-media" />
      <div className="skeleton-caption">
        <div className="skeleton-line" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

export default function Feed({ refreshKey }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await getFeed();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Feed load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed, refreshKey]);

  const handleRefresh = () => {
    loadFeed(true);
  };

  const handleDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="feed-skeleton">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2 className="feed-title">Your Feed</h2>
        <button
          id="feed-refresh"
          className={`feed-refresh ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="feed-empty">
          <div className="feed-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <h3>No posts yet</h3>
          <p>Be the first to share something! Tap the + button to upload.</p>
        </div>
      ) : (
        <div className="feed-posts">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={handleDeleted}
              style={{ animationDelay: `${index * 80}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
