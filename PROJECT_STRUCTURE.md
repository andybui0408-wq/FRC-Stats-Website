# Project Structure

This document describes the organized folder structure of the SSIS FRC Scouting Dashboard.

## Directory Structure

```
FRC-Stats-Website/
├── frontend/                 # Frontend files (HTML, CSS, JS)
│   ├── index.html           # Main dashboard page
│   ├── login.html           # Authentication page
│   ├── script.js            # Frontend JavaScript logic
│   └── styles.css           # SSIS-branded styles
│
├── backend/                  # Backend server and logic
│   ├── server.js            # Express.js server
│   └── src/                 # Backend source code
│       ├── db.js           # Database layer (lowdb)
│       └── logic.js        # Alliance calculation logic
│
├── netlify/                 # Netlify Functions (serverless)
│   └── functions/
│       └── server.js        # Serverless function wrapper
│
├── data/                    # Data storage
│   ├── frc.json            # JSON database file
│   └── samples/            # Sample data files
│       └── sample-data.csv
│
├── docs/                    # Documentation
│   ├── ALGORITHM.md        # Algorithm documentation
│   ├── GIT_SETUP.md        # Git push setup guide
│   ├── PUSH_INSTRUCTIONS.md # Push instructions
│   └── FRC Statistics Slideshow.pdf
│
├── scripts/                 # Utility scripts
│   ├── setup-git-push.sh   # Git authentication setup
│   ├── launch.sh           # Local server launcher (Mac/Linux)
│   └── launch.bat          # Local server launcher (Windows)
│
├── uploads/                 # Temporary upload directory
│
├── node_modules/            # NPM dependencies (gitignored)
│
├── .gitignore              # Git ignore rules
├── netlify.toml            # Netlify configuration
├── package.json            # NPM package configuration
├── package-lock.json       # NPM lock file
└── README.md               # Main project documentation
```

## Folder Purposes

### `frontend/`
Contains all client-side files:
- HTML pages (index.html, login.html)
- CSS stylesheets
- Client-side JavaScript
- Served as static files by Express or Netlify

### `backend/`
Contains server-side code:
- Express.js server (server.js)
- Database layer (src/db.js)
- Business logic (src/logic.js)
- Handles API endpoints, authentication, data processing

### `netlify/`
Netlify-specific serverless functions:
- Wraps Express server for Netlify deployment
- Required for Netlify Functions platform

### `data/`
Data storage directory:
- Database JSON files
- Sample data for testing
- User uploads are stored in uploads/ (gitignored)

### `docs/`
All project documentation:
- Algorithm explanations
- Setup guides
- Reference materials

### `scripts/`
Utility scripts for development:
- Git setup automation
- Local server launchers
- Development tools

## File Path References

### Frontend → Backend
- Frontend makes API calls to `/api/*` endpoints
- Handled by Express server or Netlify Functions

### Backend → Frontend
- Express serves static files from `frontend/` directory
- Path: `backend/server.js` → `express.static('../frontend')`

### Backend → Database
- Database files stored in `data/`
- Path: `backend/src/db.js` → `../../data/frc.json`

### Netlify Function → Backend
- Serverless function imports from backend
- Path: `netlify/functions/server.js` → `../../backend/src/`

## Development

### Local Development
```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
# Serves frontend/ as static files
# API routes handled by backend/server.js
```

### File Changes
When adding new files:
- Frontend files → `frontend/`
- Backend logic → `backend/src/`
- Documentation → `docs/`
- Scripts → `scripts/`

## Deployment

### Netlify
- Publishes `frontend/` as static site
- Routes `/api/*` to `netlify/functions/server.js`
- Configuration in `netlify.toml`

### Build Process
1. Install dependencies: `npm install`
2. Frontend files copied/served from `frontend/`
3. Serverless function bundled from `netlify/functions/`

## Notes

- `node_modules/` is gitignored
- `data/` contains database files (gitignored except samples)
- `uploads/` is gitignored (temporary files)
- Configuration files stay at root for standard tooling

---

**Maintained for clarity and organization** 📁
