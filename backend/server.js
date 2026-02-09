const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'sessions.json');
const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/+$/, '');

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const empty = { sessions: {}, published: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2));
  }
}

function readStore() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
      published: Array.isArray(parsed.published) ? parsed.published : [],
    };
  } catch {
    return { sessions: {}, published: [] };
  }
}

function writeStore(store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) req.destroy();
    });
    req.on('end', () => {
      if (!data.trim()) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function makeId(length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function createUniqueId(store) {
  let id = makeId();
  let guard = 0;
  while (store.sessions[id] && guard < 1000) {
    id = makeId();
    guard += 1;
  }
  return id;
}

function normalizePublishedItem(item) {
  return {
    id: String(item.id || ''),
    name: String(item.name || 'Untitled Session'),
    artistName: String(item.artistName || 'Anonymous').slice(0, 80).trim() || 'Anonymous',
    description: String(item.description || '').slice(0, 280),
    tags: Array.isArray(item.tags)
      ? item.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12)
      : [],
    likes: Number(item.likes) > 0 ? Number(item.likes) : 0,
    comments: Array.isArray(item.comments)
      ? item.comments
          .map((comment) => ({
            author: String(comment?.author || 'Guest').slice(0, 40),
            text: String(comment?.text || '').slice(0, 280),
            createdAt: Number(comment?.createdAt) || Date.now(),
          }))
          .filter((comment) => comment.text)
          .slice(-200)
      : [],
    createdAt: Number(item.createdAt) || Date.now(),
  };
}

function parseVideoIdFromUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : '';
}

function getSessionPreviewVideoIds(payload) {
  if (!payload || !Array.isArray(payload.tiles)) return [];
  const out = [];
  for (const tile of payload.tiles) {
    const id = parseVideoIdFromUrl(tile?.videoUrl || '');
    if (id && !out.includes(id)) out.push(id);
    if (out.length >= 4) break;
  }
  return out;
}

function getPublicSessionResponse(id, record) {
  const response = {
    id,
    payload: record.payload,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
  if (APP_BASE_URL) {
    response.url = `${APP_BASE_URL}?s=${encodeURIComponent(id)}`;
  }
  return response;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, ts: Date.now() });
  }

  if (req.method === 'POST' && url.pathname === '/api/sessions') {
    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object' || !body.payload || typeof body.payload !== 'object') {
      return sendJson(res, 400, { error: 'Invalid payload' });
    }
    const store = readStore();
    const id = createUniqueId(store);
    const now = Date.now();
    store.sessions[id] = {
      payload: body.payload,
      createdAt: now,
      updatedAt: now,
    };
    writeStore(store);
    return sendJson(res, 201, getPublicSessionResponse(id, store.sessions[id]));
  }

  if (req.method === 'GET' && /^\/api\/sessions\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
    const id = url.pathname.split('/').pop();
    const store = readStore();
    const record = store.sessions[id];
    if (!record) return sendJson(res, 404, { error: 'Session not found' });
    return sendJson(res, 200, getPublicSessionResponse(id, record));
  }

  if (req.method === 'GET' && url.pathname === '/api/published') {
    const store = readStore();
    const items = store.published
      .map(normalizePublishedItem)
      .filter((item) => item.id && store.sessions[item.id])
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 200)
      .map((item) => ({
        ...(() => {
          const previewVideoIds = getSessionPreviewVideoIds(store.sessions[item.id]?.payload);
          const thumbUrls = previewVideoIds.map((id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
          return {
            previewVideoId: previewVideoIds[0] || '',
            thumbUrl: thumbUrls[0] || '',
            thumbUrls,
          };
        })(),
        ...item,
        commentsCount: item.comments.length,
        comments: undefined,
        url: APP_BASE_URL ? `${APP_BASE_URL}?s=${encodeURIComponent(item.id)}` : undefined,
      }));
    return sendJson(res, 200, { items });
  }

  if (req.method === 'GET' && /^\/api\/published\/[a-zA-Z0-9_-]+\/comments$/.test(url.pathname)) {
    const id = url.pathname.split('/')[3];
    const store = readStore();
    const item = store.published.map(normalizePublishedItem).find((entry) => entry.id === id);
    if (!item || !store.sessions[id]) {
      return sendJson(res, 404, { error: 'Published session not found' });
    }
    return sendJson(res, 200, { id, comments: item.comments });
  }

  if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/comments$/.test(url.pathname)) {
    const id = url.pathname.split('/')[3];
    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { error: 'Invalid payload' });
    }
    const text = String(body.text || '').trim().slice(0, 280);
    if (!text) return sendJson(res, 400, { error: 'Comment text is required' });
    const author = String(body.author || 'Guest').trim().slice(0, 40) || 'Guest';

    const store = readStore();
    const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
    if (index < 0 || !store.sessions[id]) {
      return sendJson(res, 404, { error: 'Published session not found' });
    }
    const normalized = normalizePublishedItem(store.published[index]);
    normalized.comments.push({ author, text, createdAt: Date.now() });
    normalized.comments = normalized.comments.slice(-200);
    store.published[index] = normalized;
    writeStore(store);
    return sendJson(res, 201, { id, comments: normalized.comments, commentsCount: normalized.comments.length });
  }

  if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/like$/.test(url.pathname)) {
    const id = url.pathname.split('/')[3];
    const body = await readJsonBody(req);
    const delta = Number(body?.delta) < 0 ? -1 : 1;
    const store = readStore();
    const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
    if (index < 0 || !store.sessions[id]) {
      return sendJson(res, 404, { error: 'Published session not found' });
    }
    const normalized = normalizePublishedItem(store.published[index]);
    normalized.likes = Math.max(0, normalized.likes + delta);
    store.published[index] = normalized;
    writeStore(store);
    return sendJson(res, 200, { id, likes: normalized.likes });
  }

  if (req.method === 'DELETE' && /^\/api\/published\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
    const id = url.pathname.split('/')[3];
    const store = readStore();
    const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
    if (index < 0) {
      return sendJson(res, 404, { error: 'Published session not found' });
    }
    store.published.splice(index, 1);
    writeStore(store);
    return sendJson(res, 200, { ok: true, id });
  }

  if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/delete$/.test(url.pathname)) {
    const id = url.pathname.split('/')[3];
    const store = readStore();
    const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
    if (index < 0) {
      return sendJson(res, 404, { error: 'Published session not found' });
    }
    store.published.splice(index, 1);
    writeStore(store);
    return sendJson(res, 200, { ok: true, id });
  }

  if (req.method === 'POST' && url.pathname === '/api/published') {
    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { error: 'Invalid payload' });
    }

    const store = readStore();
    let id = typeof body.id === 'string' ? body.id.trim() : '';

    if (!id && body.payload && typeof body.payload === 'object') {
      id = createUniqueId(store);
      const now = Date.now();
      store.sessions[id] = { payload: body.payload, createdAt: now, updatedAt: now };
    }

    if (!id || !store.sessions[id]) {
      return sendJson(res, 404, { error: 'Session not found' });
    }

    const name = String(body.name || 'Untitled Session').slice(0, 120).trim() || 'Untitled Session';
    const artistName = String(body.artistName || 'Anonymous').slice(0, 80).trim() || 'Anonymous';
    const description = String(body.description || '').slice(0, 280).trim();
    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12)
      : [];
    const now = Date.now();
    const existingIndex = store.published.findIndex((item) => item && item.id === id);
    if (existingIndex >= 0) {
      store.published[existingIndex] = {
        ...normalizePublishedItem(store.published[existingIndex]),
        name,
        artistName,
        description,
        tags,
        createdAt: now,
      };
    } else {
      store.published.unshift({
        id,
        name,
        artistName,
        description,
        tags,
        likes: 0,
        comments: [],
        createdAt: now,
      });
    }
    store.published = store.published.slice(0, 400);
    writeStore(store);

    return sendJson(res, 201, {
      id,
      name,
      artistName,
      description,
      tags,
      likes: 0,
      commentsCount: 0,
      url: APP_BASE_URL ? `${APP_BASE_URL}?s=${encodeURIComponent(id)}` : undefined,
    });
  }

  return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  ensureDataStore();
  console.log(`ChopTube backend listening on http://${HOST}:${PORT}`);
  if (APP_BASE_URL) {
    console.log(`Public app base URL: ${APP_BASE_URL}`);
  }
});
