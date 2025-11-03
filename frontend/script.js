// FRC Scouting Dashboard JavaScript

class FRCScoutingDashboard {
    constructor() {
        this.teams = [];
        this.alliances = [];
        this.charts = {};
        this.sessionId = localStorage.getItem('sessionId');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }

    async init() {
        // Check authentication first
        if (!await this.checkAuth()) {
            window.location.href = '/login.html';
            return;
        }

        this.setupEventListeners();
        this.setupAuthUI();
        await this.bootstrapFromBackend();
        this.updateDashboard();
    }

    async checkAuth() {
        if (!this.sessionId) return false;
        
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'x-session-id': this.sessionId }
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    this.user = data.user;
                    return true;
                }
            }
        } catch (e) {
            console.error('Auth check failed:', e);
        }
        
        // Clear invalid session
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        return false;
    }

    setupAuthUI() {
        if (this.user && this.user.email) {
            const userEmailEl = document.getElementById('user-email');
            const logoutBtn = document.getElementById('logout-btn');
            if (userEmailEl) userEmailEl.textContent = this.user.email;
            if (logoutBtn) {
                logoutBtn.style.display = 'block';
                logoutBtn.addEventListener('click', () => this.logout());
            }
        }
    }

    async logout() {
        if (this.sessionId) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'x-session-id': this.sessionId }
            });
        }
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.getAttribute('href').substring(1));
            });
        });

        // Team search and sorting
        document.getElementById('team-search').addEventListener('input', (e) => {
            this.filterTeams(e.target.value);
        });

        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.sortTeams(e.target.value);
        });

        // Alliance calculation
        document.getElementById('calculate-alliance').addEventListener('click', () => {
            this.calculateAlliance();
        });

        // Data import
        const importExcelBtn = document.getElementById('import-excel');
        if (importExcelBtn) {
            importExcelBtn.addEventListener('click', () => {
                this.importExcelData();
            });
        }

        // File input change
        document.getElementById('excel-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.processExcelFile(e.target.files[0]);
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Add active class to corresponding nav link
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Update charts when switching to dashboard
        if (sectionId === 'dashboard') {
            this.updateCharts();
        }
    }

    async bootstrapFromBackend() {
        try {
            const res = await fetch('/api/teams', {
                headers: { 'x-session-id': this.sessionId }
            });
            if (res.ok) {
                this.teams = await res.json();
            } else {
                this.teams = [];
            }
        } catch (e) {
            this.teams = [];
        }
        if (this.teams.length === 0) {
            // fallback: seed backend with sample CSV packaged in repo
            // keep UI usable with static defaults until data is uploaded
            this.teams = [
                { teamNumber: 254, name: "The Cheesy Poofs", rating: 95, matches: 12, avgScore: 85, reliability: 0.92, auto: 15, teleop: 65, endgame: 5 },
                { teamNumber: 118, name: "Robonauts", rating: 88, matches: 12, avgScore: 78, reliability: 0.89, auto: 12, teleop: 58, endgame: 8 },
                { teamNumber: 1678, name: "Citrus Circuits", rating: 92, matches: 12, avgScore: 82, reliability: 0.91, auto: 14, teleop: 60, endgame: 8 }
            ];
        }
        this.updateTeamsTable();
        this.updateTeamSelects();
        this.calculateAllianceRankings();
        this.updateDashboard();
        this.updateCharts();
    }

    updateDashboard() {
        const totalTeams = this.teams.length;
        const topTeam = this.teams.length > 0 ? this.teams.reduce((max, team) => team.rating > max.rating ? team : max).teamNumber : '-';
        const avgRating = this.teams.length > 0 ? Math.round(this.teams.reduce((sum, team) => sum + team.rating, 0) / this.teams.length) : 0;
        const dataPoints = this.teams.reduce((sum, team) => sum + team.matches, 0);

        document.getElementById('total-teams').textContent = totalTeams;
        document.getElementById('top-team').textContent = topTeam;
        document.getElementById('avg-rating').textContent = avgRating;
        document.getElementById('data-points').textContent = dataPoints;
    }

    updateTeamsTable() {
        const tbody = document.getElementById('teams-tbody');
        tbody.innerHTML = '';

        this.teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.teamNumber}</td>
                <td>${team.name}</td>
                <td><span class="rating-${this.getRatingClass(team.rating)}">${team.rating}</span></td>
                <td>${team.matches}</td>
                <td>${team.avgScore}</td>
                <td>${Math.round(team.reliability * 100)}%</td>
                <td>
                    <button class="btn btn-primary" onclick="dashboard.viewTeamDetails(${team.teamNumber})">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getRatingClass(rating) {
        if (rating >= 90) return 'excellent';
        if (rating >= 80) return 'good';
        if (rating >= 70) return 'average';
        return 'poor';
    }

    filterTeams(searchTerm) {
        const filteredTeams = this.teams.filter(team => 
            team.teamNumber.toString().includes(searchTerm) ||
            team.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayFilteredTeams(filteredTeams);
    }

    displayFilteredTeams(teams) {
        const tbody = document.getElementById('teams-tbody');
        tbody.innerHTML = '';

        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.teamNumber}</td>
                <td>${team.name}</td>
                <td><span class="rating-${this.getRatingClass(team.rating)}">${team.rating}</span></td>
                <td>${team.matches}</td>
                <td>${team.avgScore}</td>
                <td>${Math.round(team.reliability * 100)}%</td>
                <td>
                    <button class="btn btn-primary" onclick="dashboard.viewTeamDetails(${team.teamNumber})">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    sortTeams(sortBy) {
        switch(sortBy) {
            case 'rating':
                this.teams.sort((a, b) => b.rating - a.rating);
                break;
            case 'team-number':
                this.teams.sort((a, b) => a.teamNumber - b.teamNumber);
                break;
            case 'matches':
                this.teams.sort((a, b) => b.matches - a.matches);
                break;
        }
        this.updateTeamsTable();
    }

    updateTeamSelects() {
        const selects = ['team1-select', 'team2-select', 'team3-select'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select Team</option>';
            
            this.teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.teamNumber;
                option.textContent = `${team.teamNumber} - ${team.name}`;
                select.appendChild(option);
            });
        });
    }

    calculateAlliance() {
        const team1 = parseInt(document.getElementById('team1-select').value);
        const team2 = parseInt(document.getElementById('team2-select').value);
        const team3 = parseInt(document.getElementById('team3-select').value);

        if (!team1 || !team2 || !team3) {
            alert('Please select all three teams for the alliance.');
            return;
        }

        const teams = [team1, team2, team3].map(num => this.teams.find(t => t.teamNumber === num));
        const allianceStrength = this.calculateAllianceStrength(teams);
        
        const resultDiv = document.getElementById('alliance-result');
        resultDiv.innerHTML = `
            <h4>Alliance Strength: ${allianceStrength.toFixed(1)}</h4>
            <p><strong>Teams:</strong> ${teams.map(t => `${t.teamNumber} (${t.rating})`).join(', ')}</p>
            <p><strong>Combined Rating:</strong> ${teams.reduce((sum, t) => sum + t.rating, 0)}</p>
            <p><strong>Average Reliability:</strong> ${Math.round(teams.reduce((sum, t) => sum + t.reliability, 0) / 3 * 100)}%</p>
        `;
        resultDiv.classList.add('show');
    }

    calculateAllianceStrength(teams) {
        if (teams.length !== 3) return 0;
        
        const baseScore = teams.reduce((sum, team) => sum + team.rating, 0);
        const reliabilityBonus = teams.reduce((sum, team) => sum + team.reliability, 0) / 3 * 10;
        const synergyBonus = this.calculateSynergyBonus(teams);
        
        return baseScore + reliabilityBonus + synergyBonus;
    }

    calculateSynergyBonus(teams) {
        // Simple synergy calculation based on complementary strengths
        const avgAuto = teams.reduce((sum, t) => sum + t.auto, 0) / 3;
        const avgTeleop = teams.reduce((sum, t) => sum + t.teleop, 0) / 3;
        const avgEndgame = teams.reduce((sum, t) => sum + t.endgame, 0) / 3;
        
        // Bonus for balanced alliance
        const balance = Math.min(avgAuto, avgTeleop, avgEndgame) / Math.max(avgAuto, avgTeleop, avgEndgame);
        return balance * 5;
    }

    calculateAllianceRankings() {
        this.alliances = [];
        
        // Generate all possible 3-team combinations
        for (let i = 0; i < this.teams.length; i++) {
            for (let j = i + 1; j < this.teams.length; j++) {
                for (let k = j + 1; k < this.teams.length; k++) {
                    const alliance = [this.teams[i], this.teams[j], this.teams[k]];
                    const strength = this.calculateAllianceStrength(alliance);
                    
                    this.alliances.push({
                        teams: alliance,
                        strength: strength,
                        teamNumbers: [alliance[0].teamNumber, alliance[1].teamNumber, alliance[2].teamNumber]
                    });
                }
            }
        }
        
        // Sort by strength
        this.alliances.sort((a, b) => b.strength - a.strength);
        this.updateAllianceRankings();
    }

    updateAllianceRankings() {
        const container = document.getElementById('alliance-rankings-list');
        container.innerHTML = '';
        
        this.alliances.slice(0, 10).forEach((alliance, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <div class="teams">
                    #${index + 1}: ${alliance.teamNumbers.join(', ')}
                </div>
                <div class="score">${alliance.strength.toFixed(1)}</div>
            `;
            container.appendChild(item);
        });
    }

    updateCharts() {
        this.updatePerformanceChart();
        this.updateAllianceChart();
    }

    updatePerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        if (this.charts.performance) {
            this.charts.performance.destroy();
        }
        
        const ratings = this.teams.map(team => team.rating);
        const ranges = {
            '90-100': ratings.filter(r => r >= 90).length,
            '80-89': ratings.filter(r => r >= 80 && r < 90).length,
            '70-79': ratings.filter(r => r >= 70 && r < 80).length,
            '60-69': ratings.filter(r => r >= 60 && r < 70).length,
            'Below 60': ratings.filter(r => r < 60).length
        };
        
        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Number of Teams',
                    data: Object.values(ranges),
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545'],
                    borderColor: ['#1e7e34', '#117a8b', '#e0a800', '#d66302', '#bd2130'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateAllianceChart() {
        const ctx = document.getElementById('allianceChart').getContext('2d');
        
        if (this.charts.alliance) {
            this.charts.alliance.destroy();
        }
        
        const topAlliances = this.alliances.slice(0, 10);
        
        this.charts.alliance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: topAlliances.map((_, index) => `#${index + 1}`),
                datasets: [{
                    label: 'Alliance Strength',
                    data: topAlliances.map(a => a.strength),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    processExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                this.displayDataPreview(jsonData);
            } catch (error) {
                console.error('Error processing Excel file:', error);
                alert('Error processing Excel file. Please check the format.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    displayDataPreview(data) {
        const container = document.getElementById('data-preview-table');
        
        if (data.length === 0) {
            container.innerHTML = '<p>No data found in the Excel file.</p>';
            return;
        }
        
        const headers = Object.keys(data[0]);
        let tableHTML = '<table><thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';
        
        data.slice(0, 10).forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<td>${row[header] || ''}</td>`;
            });
            tableHTML += '</tr>';
        });
        
        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    async importExcelData() {
        const fileInput = document.getElementById('excel-file');
        if (fileInput.files.length === 0) {
            alert('Please select a file first.');
            return;
        }
        const file = fileInput.files[0];
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/import/file', { 
            method: 'POST', 
            headers: { 'x-session-id': this.sessionId },
            body: form 
        });
        if (!res.ok) {
            alert('Import failed.');
            return;
        }
        const result = await res.json();
        alert(`Imported ${result.inserted} rows.`);
        // refresh teams from backend
        await this.bootstrapFromBackend();
    }

    viewTeamDetails(teamNumber) {
        const team = this.teams.find(t => t.teamNumber === teamNumber);
        if (team) {
            alert(`Team ${team.teamNumber} - ${team.name}\nRating: ${team.rating}\nMatches: ${team.matches}\nAverage Score: ${team.avgScore}\nReliability: ${Math.round(team.reliability * 100)}%`);
        }
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FRCScoutingDashboard();
});
