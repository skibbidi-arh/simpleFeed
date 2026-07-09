import { useState } from 'react';
import { deletePost as apiDeletePost } from '../api';

/** Generate a deterministic HSL color from an email string. */
export function getAvatarColor(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

/** Convert an ISO date string to a relative time label. */
function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, onDeleted, style }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initial = post.email?.charAt(0).toUpperCase() || '?';
  const color = getAvatarColor(post.email || '');

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDeletePost(post.id);
      onDeleted(post.id);
    } catch (err) {
      console.error('Delete failed:', err);
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="post-card" style={style}>
      {/* Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar" style={{ background: color }}>
            {initial}
          </div>
          <div className="post-user-info">
            <span className="post-email">{post.email}</span>
            <span className="post-time">{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {post.is_owner && (
          <div>
            {!confirming ? (
              <button
                className="post-delete-btn"
                onClick={() => setConfirming(true)}
                title="Delete post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            ) : (
              <div className="post-delete-confirm">
                <span>Delete?</span>
                <button
                  className="post-delete-yes"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '...' : 'Yes'}
                </button>
                <button
                  className="post-delete-no"
                  onClick={() => setConfirming(false)}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      <div className="post-media">
        {post.file_type === 'video' ? (
          <video controls preload="metadata" playsInline>
            <source src={post.url} />
          </video>
        ) : (
          <img src={post.url} alt={post.caption || 'Post image'} loading="lazy" />
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="post-caption">
          <strong>{post.email?.split('@')[0]}</strong>
          {post.caption}
        </div>
      )}
    </article>
  );
}
