// Netlify Serverless Function for Express API
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const XLSX = require('xlsx');

const { Database } = require('../../backend/src/db');
const { buildAlliances } = require('../../backend/src/logic');

const app = express();

// CORS for Netlify
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Storage dirs (use /tmp for Netlify functions - writable directory)
const DATA_DIR = '/tmp/data';
const UPLOADS_DIR = '/tmp/uploads';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Init DB
const db = new Database(path.join(DATA_DIR, 'frc.json'));
(async () => { await db.migrate(); })();

// Session middleware
app.use((req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (sessionId) {
    const session = db.getSession(sessionId);
    if (session) {
      req.userId = session.userId;
    }
  }
  next();
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Multer for uploads
const upload = multer({ dest: UPLOADS_DIR });

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, version: '1.0.0' });
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !email.endsWith('@ssis.edu.vn')) {
    return res.status(400).json({ error: 'Only @ssis.edu.vn email addresses are allowed' });
  }
  
  const user = db.createUser(email, name || '');
  if (!user) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const session = db.createSession(user.id);
  res.json({ user, sessionId: session.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.endsWith('@ssis.edu.vn')) {
    return res.status(400).json({ error: 'Only @ssis.edu.vn email addresses are allowed' });
  }
  
  let user = db.getUserByEmail(email);
  if (!user) {
    user = db.createUser(email, '');
  }
  
  const session = db.createSession(user.id);
  res.json({ user, sessionId: session.id });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (sessionId) {
    db.deleteSession(sessionId);
  }
  res.json({ ok: true });
});

app.get('/api/auth/me', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  await db.db.read();
  const user = db.db.data.users.find(u => u.id === req.userId);
  res.json({ user: user || null });
});

// Teams
app.get('/api/teams', (req, res) => {
  const teams = db.listTeams();
  res.json(teams);
});

app.post('/api/teams', (req, res) => {
  const team = db.upsertTeam(req.body);
  res.status(201).json(team);
});

// Matches
app.get('/api/matches', (req, res) => {
  res.json(db.listMatches());
});

app.post('/api/matches', (req, res) => {
  const m = db.insertMatch(req.body);
  res.status(201).json(m);
});

// Stats
app.get('/api/stats/overview', (req, res) => {
  const overview = db.getOverview();
  res.json(overview);
});

// Alliances
app.get('/api/alliances/top', (req, res) => {
  const limit = Number(req.query.limit || 10);
  const teams = db.listTeams();
  const alliances = buildAlliances(teams).slice(0, limit);
  res.json(alliances);
});

app.post('/api/alliances/calc', (req, res) => {
  const teamNumbers = req.body.teamNumbers || [];
  const teams = teamNumbers.map(n => db.getTeamByNumber(n)).filter(Boolean);
  const [a,b,c] = teams;
  if (!a || !b || !c) return res.status(400).json({ error: 'Three valid teams required' });
  const alliances = buildAlliances([a,b,c]);
  res.json(alliances[0]);
});

// Upload CSV/XLSX
app.post('/api/import/file', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.read(fs.readFileSync(filePath));
    const sheet = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    let inserted = 0;
    rows.forEach(r => {
      if (!r['Team Number']) return;
      db.upsertTeam({
        teamNumber: Number(r['Team Number']),
        name: r['Team Name'] || '',
        rating: Number(r['Rating'] || 0),
        matches: Number(r['Matches'] || 0),
        avgScore: Number(r['Avg Score'] || r['Average Score'] || 0),
        reliability: Number(r['Reliability'] || 0),
        auto: Number(r['Auto Points'] || 0),
        teleop: Number(r['Teleop Points'] || 0),
        endgame: Number(r['Endgame Points'] || 0)
      });
      inserted++;
    });
    res.json({ ok: true, inserted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Import failed' });
  }
});

// Google Sheets (placeholder)
app.post('/api/import/google-sheets', async (req, res) => {
  res.status(501).json({ error: 'Google Sheets import not yet configured' });
});

// Export serverless handler
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await handler(event, context);
};