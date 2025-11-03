const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');

class Database {
  constructor(dbPath) {
    this.adapter = new JSONFile(dbPath);
    this.db = new Low(this.adapter, { teams: [], matches: [] });
  }

  async migrate() {
    await this.db.read();
    this.db.data ||= { teams: [], matches: [], users: [], sessions: [] };
    await this.db.write();
  }

  // User management
  createUser(email, name) {
    const data = this.db.data;
    if (data.users.find(u => u.email === email)) {
      return null; // User already exists
    }
    const user = {
      id: nanoid(),
      email,
      name,
      createdAt: new Date().toISOString()
    };
    data.users.push(user);
    this.db.write();
    return user;
  }

  getUserByEmail(email) {
    return this.db.data.users.find(u => u.email === email);
  }

  createSession(userId) {
    const session = {
      id: nanoid(),
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    this.db.data.sessions.push(session);
    this.db.write();
    return session;
  }

  getSession(sessionId) {
    const session = this.db.data.sessions.find(s => s.id === sessionId);
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }
    return session;
  }

  deleteSession(sessionId) {
    const data = this.db.data;
    data.sessions = data.sessions.filter(s => s.id !== sessionId);
    this.db.write();
  }

  upsertTeam(team) {
    const now = new Date().toISOString();
    const data = this.db.data;
    const idx = data.teams.findIndex(t => t.teamNumber === Number(team.teamNumber));
    const record = {
      teamNumber: Number(team.teamNumber),
      name: team.name || '',
      rating: Number(team.rating || 0),
      matches: Number(team.matches || 0),
      avgScore: Number(team.avgScore || 0),
      reliability: Number(team.reliability || 0),
      auto: Number(team.auto || 0),
      teleop: Number(team.teleop || 0),
      endgame: Number(team.endgame || 0),
      createdAt: now,
      updatedAt: now
    };
    if (idx >= 0) {
      data.teams[idx] = { ...data.teams[idx], ...record, createdAt: data.teams[idx].createdAt, updatedAt: now };
    } else {
      data.teams.push(record);
    }
    this.db.write();
    return record;
  }

  getTeamByNumber(teamNumber) {
    return this.db.data.teams.find(t => t.teamNumber === Number(teamNumber));
  }

  listTeams() {
    return [...this.db.data.teams].sort((a, b) => (b.rating - a.rating) || (a.teamNumber - b.teamNumber));
  }

  insertMatch(m) {
    const rec = { id: nanoid(), ...m, createdAt: new Date().toISOString() };
    this.db.data.matches.push(rec);
    this.db.write();
    return rec;
  }

  listMatches() {
    return [...this.db.data.matches].slice(-500).reverse();
  }

  getOverview() {
    const teams = this.db.data.teams;
    const matches = this.db.data.matches;
    const avgRating = teams.length ? teams.reduce((s, t) => s + (t.rating || 0), 0) / teams.length : 0;
    const top = teams.length ? teams.slice().sort((a, b) => b.rating - a.rating)[0].teamNumber : '-';
    return {
      totalTeams: teams.length,
      avgRating: Math.round(avgRating),
      topTeam: top,
      dataPoints: matches.length
    };
  }
}

module.exports = { Database };


