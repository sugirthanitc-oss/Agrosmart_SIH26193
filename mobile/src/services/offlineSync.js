const QUEUE_KEY = 'agrosmart_offline_queue';
const CACHE_KEY_PREFIX = 'agrosmart_cache_';

export const offlineService = {
  getQueue: () => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  enqueue: (action, payload) => {
    const queue = offlineService.getQueue();
    const item = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      payload,
      created_at: new Date().toISOString()
    };
    queue.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return item;
  },

  clearQueue: () => {
    localStorage.removeItem(QUEUE_KEY);
  },

  setCache: (key, data) => {
    try {
      localStorage.setItem(`${CACHE_KEY_PREFIX}${key}`, JSON.stringify({
        data,
        cached_at: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Cache write failed', e);
    }
  },

  getCache: (key) => {
    try {
      const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${key}`);
      if (!raw) return null;
      return JSON.parse(raw).data;
    } catch {
      return null;
    }
  },

  syncQueueWithServer: async (token) => {
    const queue = offlineService.getQueue();
    if (queue.length === 0) return { success: true, count: 0 };

    try {
      const res = await fetch('/api/sync/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: queue })
      });

      if (res.ok) {
        offlineService.clearQueue();
        const data = await res.json();
        return { success: true, count: data.processed_count };
      }
    } catch (e) {
      console.warn('Server sync failed, keeping offline queue', e);
    }
    return { success: false, count: queue.length };
  }
};
