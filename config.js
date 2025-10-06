// FRC Scouting Dashboard Configuration

const CONFIG = {
    // Application Settings
    app: {
        name: "FRC Scouting Dashboard",
        version: "1.0.0",
        description: "Comprehensive FRC team scouting and alliance analysis"
    },

    // Rating System Configuration
    rating: {
        // Rating thresholds for color coding
        thresholds: {
            excellent: 90,
            good: 80,
            average: 70,
            poor: 60
        },
        
        // Weight factors for overall rating calculation
        weights: {
            avgScore: 0.4,      // 40% weight for average score
            reliability: 0.3,   // 30% weight for reliability
            matches: 0.2,       // 20% weight for match count
            consistency: 0.1    // 10% weight for consistency
        }
    },

    // Alliance Calculation Settings
    alliance: {
        // Base calculation factors
        baseScoreWeight: 1.0,           // Weight for combined team ratings
        reliabilityBonus: 10,           // Maximum bonus for reliability
        synergyBonus: 5,                // Maximum synergy bonus
        
        // Synergy calculation factors
        synergyWeights: {
            auto: 0.3,
            teleop: 0.5,
            endgame: 0.2
        }
    },

    // Data Import Settings
    import: {
        // Supported file formats
        supportedFormats: ['.xlsx', '.xls', '.csv'],
        
        // Required columns for team data
        requiredColumns: [
            'Team Number',
            'Team Name',
            'Rating',
            'Matches',
            'Avg Score',
            'Reliability'
        ],
        
        // Optional columns
        optionalColumns: [
            'Auto Points',
            'Teleop Points',
            'Endgame Points',
            'Notes',
            'Location'
        ]
    },

    // Google Forms Integration
    googleForms: {
        // API endpoints (would be configured for production)
        apiUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
        
        // Data refresh interval (in milliseconds)
        refreshInterval: 30000, // 30 seconds
        
        // Form field mappings
        fieldMappings: {
            teamNumber: 'Team Number',
            teamName: 'Team Name',
            rating: 'Rating',
            matches: 'Matches',
            avgScore: 'Average Score',
            reliability: 'Reliability'
        }
    },

    // UI Configuration
    ui: {
        // Chart colors
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8'
        },
        
        // Chart settings
        charts: {
            performanceChart: {
                type: 'bar',
                responsive: true,
                maintainAspectRatio: false
            },
            allianceChart: {
                type: 'line',
                responsive: true,
                maintainAspectRatio: false
            }
        },
        
        // Table settings
        table: {
            itemsPerPage: 25,
            showPagination: true
        }
    },

    // Sample Data Configuration
    sampleData: {
        enabled: true,
        teamCount: 12,
        includeVariety: true
    },

    // Export Settings
    export: {
        formats: ['csv', 'json', 'xlsx'],
        includeCharts: true,
        includeMetadata: true
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
