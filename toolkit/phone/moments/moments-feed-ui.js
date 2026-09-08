import {
  loadMoments,
  deleteMoment,
  toggleMomentLike,
  addMomentComment
} from './moments-data.js';

import { getUserDisplayName } from '../utils/contact-display-helper.js';

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

function formatMomentTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export async function renderMomentsFeed() {
  const container = document.createElement('div');
  container.className = 'moments-feed-list';

  const moments = await loadMoments();

  if (moments.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:#999;">
        暂时还没有动态
      </div>
    `;
    return container;
  }

  for (const moment of moments) {
    const post = document.createElement('div');
    post.className = 'moments-feed-post';
    post.dataset.momentId = moment.id;

    const liked = Array.isArray(moment.likes)
      && moment.likes.includes('user');

    const commentsHtml = Array.isArray(moment.comments)
      ? moment.comments.map(comment => `
          <div class="moments-feed-comment">
            <strong>${escapeHtml(comment.authorName)}</strong>
            ${escapeHtml(comment.content)}
          </div>
        `).join('')
      : '';

    post.innerHTML = `
      <div class="moments-feed-post-header">
        <div class="moments-feed-post-avatar">
          <img src="${escapeHtml(moment.authorAvatar || '')}">
        </div>

        <div class="moments-feed-post-info">
          <div class="moments-feed-post-name">
            ${escapeHtml(moment.authorName)}
          </div>

          <div class="moments-feed-post-time">
            ${escapeHtml(formatMomentTime(moment.time))}
          </div>
        </div>
      </div>

      <div class="moments-feed-post-content">
        ${escapeHtml(moment.content)}
      </div>

      <div class="moments-feed-post-footer">
        <div class="moments-feed-post-reactions">
          <span>
            ${Array.isArray(moment.likes) ? moment.likes.length : 0} 赞
          </span>
        </div>

        <div class="moments-feed-post-actions">
          <button class="moments-feed-post-action like-btn">
            ${liked ? '取消赞' : '赞'}
          </button>

          <button class="moments-feed-post-action comment-btn">
            评论
          </button>
        </div>
      </div>

      <div class="moments-feed-comment-box">
        ${commentsHtml}
      </div>
    `;

    post.querySelector('.like-btn')
      .addEventListener('click', async () => {
        await toggleMomentLike(moment.id, 'user');

        const refreshed = await renderMomentsFeed();
        container.replaceWith(refreshed);
      });

    post.querySelector('.comment-btn')
      .addEventListener('click', async () => {
        const content = prompt('评论');

        if (!content?.trim()) {
          return;
        }

        await addMomentComment(moment.id, {
          id: `comment_${Date.now()}`,
          authorId: 'user',
          authorName: getUserDisplayName(),
          content: content.trim(),
          time: Math.floor(Date.now() / 1000)
        });

        const refreshed = await renderMomentsFeed();
        container.replaceWith(refreshed);
      });

    container.appendChild(post);
  }

  return container;
}