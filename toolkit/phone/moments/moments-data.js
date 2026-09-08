import { saveData, loadData } from '../data-storage/storage-api.js';
import logger from '../../logger.js';

const MOMENTS_KEY = 'moments';

export async function loadMoments() {
  const moments = await loadData(MOMENTS_KEY);

  if (!Array.isArray(moments)) {
    return [];
  }

  return moments;
}

export async function saveMoments(moments) {
  await saveData(MOMENTS_KEY, moments);
}

export async function addMoment(moment) {
  const moments = await loadMoments();

  const newMoment = {
    id: `moment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: Math.floor(Date.now() / 1000),
    likes: [],
    comments: [],
    ...moment
  };

  moments.unshift(newMoment);

  await saveMoments(moments);

  logger.debug('phone', '[Moments] 新增动态:', newMoment.id);

  return newMoment;
}

export async function deleteMoment(momentId) {
  const moments = await loadMoments();
  const filtered = moments.filter(moment => moment.id !== momentId);

  if (filtered.length === moments.length) {
    return false;
  }

  await saveMoments(filtered);
  return true;
}

export async function toggleMomentLike(momentId, userId) {
  const moments = await loadMoments();
  const moment = moments.find(item => item.id === momentId);

  if (!moment) {
    return false;
  }

  if (!Array.isArray(moment.likes)) {
    moment.likes = [];
  }

  const index = moment.likes.indexOf(userId);

  if (index === -1) {
    moment.likes.push(userId);
  } else {
    moment.likes.splice(index, 1);
  }

  await saveMoments(moments);

  return true;
}

export async function addMomentComment(momentId, comment) {
  const moments = await loadMoments();
  const moment = moments.find(item => item.id === momentId);

  if (!moment) {
    return false;
  }

  if (!Array.isArray(moment.comments)) {
    moment.comments = [];
  }

  moment.comments.push(comment);

  await saveMoments(moments);

  return true;
}