// Netlify Serverless Function for Express API
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const XLSX = require('xlsx');

// Import backend modules
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

// Initialize database on function cold start
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await db.migrate();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
}

// Session middleware - DISABLED FOR TESTING
// TODO: Re-enable authentication later
/*
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    if (sessionId) {
      const session = db.getSession(sessionId);
      if (session) {
        req.userId = session.userId;
      }
    }
  } catch (error) {
    console.error('Session middleware error:', error);
  }
  next();
});
*/

// Minimal middleware - just initialize DB
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
  } catch (error) {
    console.error('DB initialization error:', error);
  }
  next();
});

// Auth middleware - DISABLED FOR TESTING
const requireAuth = (req, res, next) => {
  // Authentication disabled - allow all requests
  next();
  /*
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
  */
};

// Multer for uploads
const upload = multer({ dest: UPLOADS_DIR });

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await ensureDbInitialized();
    res.json({ ok: true, version: '1.0.0' });
  } catch (error) {
    res.status(500).json({ error: 'Database not initialized', message: error.message });
  }
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    await ensureDbInitialized();
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
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await ensureDbInitialized();
    const { email } = req.body;
    
    if (!email || !email.endsWith('@ssis.edu.vn')) {
      return res.status(400).json({ error: 'Only @ssis.edu.vn email addresses are allowed' });
    }
    
    // Ensure database is ready
    await db.db.read();
    
    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser(email, '');
      if (!user) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
    }
    
    const session = db.createSession(user.id);
    if (!session) {
      return res.status(500).json({ error: 'Failed to create session' });
    }
    
    res.json({ user, sessionId: session.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    await ensureDbInitialized();
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    if (sessionId) {
      db.deleteSession(sessionId);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    await ensureDbInitialized();
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    await db.db.read();
    const user = db.db.data.users.find(u => u.id === req.userId);
    res.json({ user: user || null });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Teams
app.get('/api/teams', async (req, res) => {
  try {
    await ensureDbInitialized();
    const teams = db.listTeams();
    res.json(teams);
  } catch (error) {
    console.error('Teams list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    await ensureDbInitialized();
    const team = db.upsertTeam(req.body);
    res.status(201).json(team);
  } catch (error) {
    console.error('Team create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Matches
app.get('/api/matches', async (req, res) => {
  try {
    await ensureDbInitialized();
    res.json(db.listMatches());
  } catch (error) {
    console.error('Matches list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/matches', async (req, res) => {
  try {
    await ensureDbInitialized();
    const m = db.insertMatch(req.body);
    res.status(201).json(m);
  } catch (error) {
    console.error('Match create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stats
app.get('/api/stats/overview', async (req, res) => {
  try {
    await ensureDbInitialized();
    const overview = db.getOverview();
    res.json(overview);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alliances
app.get('/api/alliances/top', async (req, res) => {
  try {
    await ensureDbInitialized();
    const limit = Number(req.query.limit || 10);
    const teams = db.listTeams();
    const alliances = buildAlliances(teams).slice(0, limit);
    res.json(alliances);
  } catch (error) {
    console.error('Alliances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/alliances/calc', async (req, res) => {
  try {
    await ensureDbInitialized();
    const teamNumbers = req.body.teamNumbers || [];
    const teams = teamNumbers.map(n => db.getTeamByNumber(n)).filter(Boolean);
    const [a,b,c] = teams;
    if (!a || !b || !c) return res.status(400).json({ error: 'Three valid teams required' });
    const alliances = buildAlliances([a,b,c]);
    res.json(alliances[0]);
  } catch (error) {
    console.error('Alliance calc error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload CSV/XLSX
app.post('/api/import/file', upload.single('file'), async (req, res) => {
  try {
    await ensureDbInitialized();
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
    console.error('Import error:', e);
    res.status(500).json({ error: 'Import failed: ' + e.message });
  }
});

// Google Sheets (placeholder)
app.post('/api/import/google-sheets', async (req, res) => {
  res.status(501).json({ error: 'Google Sheets import not yet configured' });
});

// Export serverless handler
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    return await handler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
