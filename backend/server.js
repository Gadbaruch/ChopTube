const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const Jimp = require('jimp');

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'sessions.json');
const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/+$/, '');
const FB_APP_ID = String(process.env.FB_APP_ID || '').trim();
const DATABASE_URL = String(process.env.DATABASE_URL || '').trim();
const USE_DB = Boolean(DATABASE_URL);

const db = USE_DB
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

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

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getRequestBase(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  return host ? `${proto}://${host}` : '';
}

function getPublicAppSessionUrl(id) {
  return APP_BASE_URL ? `${APP_BASE_URL}?s=${encodeURIComponent(id)}` : '';
}

async function getPublishedById(id) {
  if (USE_DB) {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.artist_name,
        p.description,
        p.tags,
        p.likes,
        p.comments,
        p.created_at,
        s.payload
      FROM published p
      JOIN sessions s ON s.id = p.id
      WHERE p.id = $1
      LIMIT 1
      `,
      [id]
    );
    if (!result.rowCount) return null;
    const row = result.rows[0];
    return {
      id: String(row.id),
      name: String(row.name || 'Untitled Session'),
      artistName: String(row.artist_name || 'Anonymous'),
      description: String(row.description || ''),
      tags: Array.isArray(row.tags) ? row.tags : [],
      likes: Number(row.likes) || 0,
      comments: Array.isArray(row.comments) ? row.comments : [],
      createdAt: Number(row.created_at) || Date.now(),
      payload: row.payload,
    };
  }

  const store = readStore();
  const normalized = store.published.map(normalizePublishedItem).find((entry) => entry.id === id);
  if (!normalized) return null;
  const payload = store.sessions[id]?.payload || null;
  if (!payload) return null;
  return { ...normalized, payload };
}

async function getSessionForShare(id) {
  const published = await getPublishedById(id);
  if (published) {
    return {
      id,
      name: published.name || 'ChopTube Session',
      artistName: published.artistName || 'Anonymous',
      payload: published.payload,
    };
  }
  const session = await getSession(id);
  if (!session) return null;
  return {
    id,
    name: 'ChopTube Session',
    artistName: 'Anonymous',
    payload: session.payload,
  };
}

async function createShareImageBuffer(videoIds) {
  const width = 1200;
  const height = 630;
  const cols = 2;
  const rows = 2;
  const cellWidth = Math.floor(width / cols);
  const cellHeight = Math.floor(height / rows);
  const bg = new Jimp(width, height, 0x0b1222ff);
  const fallbackOverlay = new Jimp(width, height, 0x17213d88);
  bg.composite(fallbackOverlay, 0, 0);

  const ids = Array.from(new Set((videoIds || []).filter(Boolean))).slice(0, 4);
  if (!ids.length) {
    return bg.getBufferAsync(Jimp.MIME_PNG);
  }

  const thumbs = await Promise.all(
    ids.map(async (id) => {
      const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      try {
        return await Jimp.read(thumbUrl);
      } catch {
        return null;
      }
    })
  );

  let placed = 0;
  for (let i = 0; i < rows * cols; i += 1) {
    const img = thumbs[i] || thumbs[0];
    if (!img) continue;
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = col * cellWidth;
    const y = row * cellHeight;
    const frame = img.clone().cover(cellWidth, cellHeight, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
    bg.composite(frame, x, y);
    placed += 1;
  }

  if (!placed) return bg.getBufferAsync(Jimp.MIME_PNG);

  const shade = new Jimp(width, height, 0x00000033);
  bg.composite(shade, 0, 0);
  return bg.getBufferAsync(Jimp.MIME_PNG);
}

async function initDb() {
  if (!USE_DB) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS published (
      id TEXT PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      artist_name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      likes INTEGER NOT NULL DEFAULT 0,
      comments JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at BIGINT NOT NULL
    )
  `);
}

async function sessionExists(id) {
  if (USE_DB) {
    const r = await db.query('SELECT 1 FROM sessions WHERE id = $1 LIMIT 1', [id]);
    return r.rowCount > 0;
  }
  const store = readStore();
  return Boolean(store.sessions[id]);
}

async function createUniqueId() {
  let id = makeId();
  let guard = 0;
  while ((await sessionExists(id)) && guard < 1000) {
    id = makeId();
    guard += 1;
  }
  return id;
}

async function createSession(payload) {
  const id = await createUniqueId();
  const now = Date.now();
  if (USE_DB) {
    await db.query(
      'INSERT INTO sessions (id, payload, created_at, updated_at) VALUES ($1, $2::jsonb, $3, $4)',
      [id, JSON.stringify(payload), now, now]
    );
    return { id, payload, createdAt: now, updatedAt: now };
  }
  const store = readStore();
  store.sessions[id] = { payload, createdAt: now, updatedAt: now };
  writeStore(store);
  return { id, payload, createdAt: now, updatedAt: now };
}

async function getSession(id) {
  if (USE_DB) {
    const r = await db.query(
      'SELECT id, payload, created_at, updated_at FROM sessions WHERE id = $1 LIMIT 1',
      [id]
    );
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return {
      id: row.id,
      payload: row.payload,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
    };
  }
  const store = readStore();
  const record = store.sessions[id];
  if (!record) return null;
  return {
    id,
    payload: record.payload,
    createdAt: Number(record.createdAt) || Date.now(),
    updatedAt: Number(record.updatedAt) || Date.now(),
  };
}

async function listPublished() {
  if (USE_DB) {
    const r = await db.query(`
      SELECT
        p.id,
        p.name,
        p.artist_name,
        p.description,
        p.tags,
        p.likes,
        p.comments,
        p.created_at,
        s.payload
      FROM published p
      JOIN sessions s ON s.id = p.id
      ORDER BY p.created_at DESC
      LIMIT 200
    `);
    return r.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name || 'Untitled Session'),
      artistName: String(row.artist_name || 'Anonymous'),
      description: String(row.description || ''),
      tags: Array.isArray(row.tags) ? row.tags : [],
      likes: Number(row.likes) || 0,
      comments: Array.isArray(row.comments) ? row.comments : [],
      createdAt: Number(row.created_at) || Date.now(),
      payload: row.payload,
    }));
  }

  const store = readStore();
  return store.published
    .map(normalizePublishedItem)
    .filter((item) => item.id && store.sessions[item.id])
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 200)
    .map((item) => ({ ...item, payload: store.sessions[item.id]?.payload }));
}

async function publishSession({ id, payload, name, artistName, description, tags }) {
  const now = Date.now();
  let targetId = typeof id === 'string' ? id.trim() : '';

  if (!targetId && payload && typeof payload === 'object') {
    const created = await createSession(payload);
    targetId = created.id;
  }
  if (!targetId) return null;

  const session = await getSession(targetId);
  if (!session) return null;

  const normalizedName = String(name || 'Untitled Session').slice(0, 120).trim() || 'Untitled Session';
  const normalizedArtist = String(artistName || 'Anonymous').slice(0, 80).trim() || 'Anonymous';
  const normalizedDescription = String(description || '').slice(0, 280).trim();
  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12)
    : [];

  if (USE_DB) {
    await db.query(
      `
      INSERT INTO published (id, name, artist_name, description, tags, likes, comments, created_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, 0, '[]'::jsonb, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        artist_name = EXCLUDED.artist_name,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        created_at = EXCLUDED.created_at
      `,
      [targetId, normalizedName, normalizedArtist, normalizedDescription, JSON.stringify(normalizedTags), now]
    );
  } else {
    const store = readStore();
    const existingIndex = store.published.findIndex((item) => item && item.id === targetId);
    if (existingIndex >= 0) {
      store.published[existingIndex] = {
        ...normalizePublishedItem(store.published[existingIndex]),
        name: normalizedName,
        artistName: normalizedArtist,
        description: normalizedDescription,
        tags: normalizedTags,
        createdAt: now,
      };
    } else {
      store.published.unshift({
        id: targetId,
        name: normalizedName,
        artistName: normalizedArtist,
        description: normalizedDescription,
        tags: normalizedTags,
        likes: 0,
        comments: [],
        createdAt: now,
      });
    }
    store.published = store.published.slice(0, 400);
    writeStore(store);
  }

  return {
    id: targetId,
    name: normalizedName,
    artistName: normalizedArtist,
    description: normalizedDescription,
    tags: normalizedTags,
    likes: 0,
    commentsCount: 0,
    url: APP_BASE_URL ? `${APP_BASE_URL}?s=${encodeURIComponent(targetId)}` : undefined,
  };
}

async function updateLike(id, delta) {
  const direction = Number(delta) < 0 ? -1 : 1;
  if (USE_DB) {
    const result = await db.query(
      'UPDATE published SET likes = GREATEST(0, likes + $2) WHERE id = $1 RETURNING likes',
      [id, direction]
    );
    if (!result.rowCount) return null;
    return { id, likes: Number(result.rows[0].likes) || 0 };
  }

  const store = readStore();
  const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
  if (index < 0 || !store.sessions[id]) return null;
  const normalized = normalizePublishedItem(store.published[index]);
  normalized.likes = Math.max(0, normalized.likes + direction);
  store.published[index] = normalized;
  writeStore(store);
  return { id, likes: normalized.likes };
}

async function deletePublished(id) {
  if (USE_DB) {
    const result = await db.query('DELETE FROM published WHERE id = $1', [id]);
    if (!result.rowCount) return null;
    return { ok: true, id };
  }

  const store = readStore();
  const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
  if (index < 0) return null;
  store.published.splice(index, 1);
  writeStore(store);
  return { ok: true, id };
}

async function getPublishedComments(id) {
  if (USE_DB) {
    const result = await db.query('SELECT comments FROM published WHERE id = $1 LIMIT 1', [id]);
    if (!result.rowCount) return null;
    const comments = Array.isArray(result.rows[0].comments) ? result.rows[0].comments : [];
    return { id, comments };
  }

  const store = readStore();
  const item = store.published.map(normalizePublishedItem).find((entry) => entry.id === id);
  if (!item || !store.sessions[id]) return null;
  return { id, comments: item.comments };
}

async function addPublishedComment(id, author, text) {
  const safeAuthor = String(author || 'Guest').trim().slice(0, 40) || 'Guest';
  const safeText = String(text || '').trim().slice(0, 280);
  if (!safeText) return null;

  if (USE_DB) {
    const current = await getPublishedComments(id);
    if (!current) return null;
    const comments = Array.isArray(current.comments) ? current.comments.slice(-199) : [];
    comments.push({ author: safeAuthor, text: safeText, createdAt: Date.now() });
    await db.query('UPDATE published SET comments = $2::jsonb WHERE id = $1', [id, JSON.stringify(comments)]);
    return { id, comments, commentsCount: comments.length };
  }

  const store = readStore();
  const index = store.published.findIndex((entry) => entry && String(entry.id) === id);
  if (index < 0 || !store.sessions[id]) return null;
  const normalized = normalizePublishedItem(store.published[index]);
  normalized.comments.push({ author: safeAuthor, text: safeText, createdAt: Date.now() });
  normalized.comments = normalized.comments.slice(-200);
  store.published[index] = normalized;
  writeStore(store);
  return { id, comments: normalized.comments, commentsCount: normalized.comments.length };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'OPTIONS') {
      return sendJson(res, 204, {});
    }

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(res, 200, { ok: true, ts: Date.now(), storage: USE_DB ? 'postgres' : 'file' });
    }

    if (req.method === 'GET' && /^\/api\/og\/[a-zA-Z0-9_-]+\.png$/.test(url.pathname)) {
      const id = url.pathname.split('/').pop().replace(/\.png$/i, '');
      const session = await getSessionForShare(id);
      if (!session) return sendJson(res, 404, { error: 'Session not found' });
      const videoIds = getSessionPreviewVideoIds(session.payload);
      const imageBuffer = await createShareImageBuffer(videoIds);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(imageBuffer);
      return;
    }

    if (req.method === 'GET' && /^\/s\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
      const id = url.pathname.split('/').pop();
      const session = await getSessionForShare(id);
      if (!session) return sendJson(res, 404, { error: 'Session not found' });
      const base = getRequestBase(req);
      const shareUrl = base ? `${base}/s/${encodeURIComponent(id)}` : '';
      const imageUrl = base ? `${base}/api/og/${encodeURIComponent(id)}.png` : '';
      const appUrl = getPublicAppSessionUrl(id) || `${url.origin}?s=${encodeURIComponent(id)}`;
      const title = session.name || 'ChopTube Session';
      const artist = session.artistName || 'Anonymous';
      const description = `Session by ${artist}. Open in ChopTube to remix and play.`;
      const fbAppMeta = FB_APP_ID
        ? `  <meta property="fb:app_id" content="${escapeHtml(FB_APP_ID)}" />`
        : '';
      const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | ChopTube</title>
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ChopTube" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
${fbAppMeta}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
</head>
<body style="background:#070c18;color:#eaf0ff;font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0">
  <div style="text-align:center;padding:24px">
    <h1 style="margin:0 0 8px;font-size:28px">${escapeHtml(title)}</h1>
    <p style="margin:0 0 16px;opacity:.8">Opening ChopTube session...</p>
    <a href="${escapeHtml(appUrl)}" style="color:#9dc4ff">Open now</a>
  </div>
  <script>
    setTimeout(function () {
      try {
        window.location.href = ${JSON.stringify(appUrl)};
      } catch (e) {}
    }, 1200);
  </script>
</body>
</html>`;
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      });
      res.end(html);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/sessions') {
      const body = await readJsonBody(req);
      if (!body || typeof body !== 'object' || !body.payload || typeof body.payload !== 'object') {
        return sendJson(res, 400, { error: 'Invalid payload' });
      }
      const created = await createSession(body.payload);
      return sendJson(res, 201, getPublicSessionResponse(created.id, created));
    }

    if (req.method === 'GET' && /^\/api\/sessions\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
      const id = url.pathname.split('/').pop();
      const record = await getSession(id);
      if (!record) return sendJson(res, 404, { error: 'Session not found' });
      return sendJson(res, 200, getPublicSessionResponse(id, record));
    }

    if (req.method === 'GET' && url.pathname === '/api/published') {
      const published = await listPublished();
      const items = published.map((item) => {
        const normalized = normalizePublishedItem(item);
        const previewVideoIds = getSessionPreviewVideoIds(item.payload);
        const thumbUrls = previewVideoIds.map((id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        return {
          previewVideoId: previewVideoIds[0] || '',
          thumbUrl: thumbUrls[0] || '',
          thumbUrls,
          ...normalized,
          commentsCount: normalized.comments.length,
          comments: undefined,
          url: APP_BASE_URL ? `${APP_BASE_URL}?s=${encodeURIComponent(normalized.id)}` : undefined,
        };
      });
      return sendJson(res, 200, { items });
    }

    if (req.method === 'GET' && /^\/api\/published\/[a-zA-Z0-9_-]+\/comments$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3];
      const comments = await getPublishedComments(id);
      if (!comments) {
        return sendJson(res, 404, { error: 'Published session not found' });
      }
      return sendJson(res, 200, comments);
    }

    if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/comments$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3];
      const body = await readJsonBody(req);
      if (!body || typeof body !== 'object') {
        return sendJson(res, 400, { error: 'Invalid payload' });
      }
      const response = await addPublishedComment(id, body.author, body.text);
      if (!response) {
        return sendJson(res, 404, { error: 'Published session not found' });
      }
      return sendJson(res, 201, response);
    }

    if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/like$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3];
      const body = await readJsonBody(req);
      const result = await updateLike(id, body?.delta);
      if (!result) {
        return sendJson(res, 404, { error: 'Published session not found' });
      }
      return sendJson(res, 200, result);
    }

    if (req.method === 'DELETE' && /^\/api\/published\/[a-zA-Z0-9_-]+$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3];
      const result = await deletePublished(id);
      if (!result) {
        return sendJson(res, 404, { error: 'Published session not found' });
      }
      return sendJson(res, 200, result);
    }

    if (req.method === 'POST' && /^\/api\/published\/[a-zA-Z0-9_-]+\/delete$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3];
      const result = await deletePublished(id);
      if (!result) {
        return sendJson(res, 404, { error: 'Published session not found' });
      }
      return sendJson(res, 200, result);
    }

    if (req.method === 'POST' && url.pathname === '/api/published') {
      const body = await readJsonBody(req);
      if (!body || typeof body !== 'object') {
        return sendJson(res, 400, { error: 'Invalid payload' });
      }
      const result = await publishSession({
        id: body.id,
        payload: body.payload,
        name: body.name,
        artistName: body.artistName,
        description: body.description,
        tags: body.tags,
      });
      if (!result) {
        return sendJson(res, 404, { error: 'Session not found' });
      }
      return sendJson(res, 201, result);
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error('Request handling error:', error);
    return sendJson(res, 500, { error: 'Internal server error' });
  }
});

async function start() {
  try {
    if (USE_DB) {
      await initDb();
      console.log('Using Postgres persistent storage');
    } else {
      ensureDataStore();
      console.log('Using local file storage');
    }

    server.listen(PORT, HOST, () => {
      console.log(`ChopTube backend listening on http://${HOST}:${PORT}`);
      if (APP_BASE_URL) {
        console.log(`Public app base URL: ${APP_BASE_URL}`);
      }
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

start();
