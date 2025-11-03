function ratingClass(rating) {
  if (rating >= 90) return 'excellent';
  if (rating >= 80) return 'good';
  if (rating >= 70) return 'average';
  return 'poor';
}

function allianceStrength(teams) {
  if (teams.length !== 3) return 0;
  const base = teams.reduce((s, t) => s + (t.rating || 0), 0);
  const reliability = teams.reduce((s, t) => s + (t.reliability || 0), 0) / 3 * 10;
  const auto = teams.reduce((s, t) => s + (t.auto || 0), 0) / 3;
  const teleop = teams.reduce((s, t) => s + (t.teleop || 0), 0) / 3;
  const endgame = teams.reduce((s, t) => s + (t.endgame || 0), 0) / 3;
  const balance = Math.min(auto, teleop, endgame) / Math.max(1, Math.max(auto, teleop, endgame));
  const synergy = balance * 5;
  return base + reliability + synergy;
}

function buildAlliances(teams) {
  const res = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      for (let k = j + 1; k < teams.length; k++) {
        const trio = [teams[i], teams[j], teams[k]];
        res.push({
          teams: trio.map(t => t.teamNumber),
          strength: allianceStrength(trio)
        });
      }
    }
  }
  res.sort((a, b) => b.strength - a.strength);
  return res;
}

module.exports = { ratingClass, allianceStrength, buildAlliances };


