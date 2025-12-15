const sessions = new Map();

/**
 * Simple in‑memory session store for Telegram upload flow.
 * Key: telegramUserId (Number)
 * Value: {
 *   state: String,
 *   artistId: ObjectId (String),
 *   productType: String,
 *   media: { telegramFileId, originalName, mimeType, size },
 *   title: String,
 *   description: String,
 *   price: Number,
 *   currency: String,
 *   category: String,
 *   tags: [String],
 *   stock: Number,
 *   createdAt: Date,
 *   updatedAt: Date,
 * }
 */

function set(userId, data) {
  sessions.set(userId, { ...data, updatedAt: new Date() });
}

function get(userId) {
  return sessions.get(userId) || null;
}

function update(userId, updates) {
  const current = get(userId);
  if (!current) return null;
  const updated = { ...current, ...updates, updatedAt: new Date() };
  sessions.set(userId, updated);
  return updated;
}

function clear(userId) {
  return sessions.delete(userId);
}

function getAll() {
  return Array.from(sessions.entries()).map(([userId, data]) => ({ userId, ...data }));
}

function cleanup(maxAge = 1000 * 60 * 30) {
  const now = Date.now();
  for (const [userId, data] of sessions.entries()) {
    if (now - data.updatedAt.getTime() > maxAge) {
      sessions.delete(userId);
    }
  }
}

// Auto‑cleanup every 10 minutes
setInterval(cleanup, 1000 * 60 * 10);

module.exports = {
  set,
  get,
  update,
  clear,
  getAll,
  cleanup,
};
