# FRC Scouting Algorithm Documentation

## Overview
This document describes the algorithms used in the FRC Scouting Dashboard for team rating and alliance strength calculation.

## Team Rating Algorithm

### Base Rating Calculation
The team rating is calculated using a weighted combination of multiple factors:

```
Rating = (AvgScore × 0.4) + (Reliability × 100 × 0.3) + (MatchCount × 0.2) + (Consistency × 0.1)
```

### Fact[text](about:blank#blocked)ors Explained

#### 1. Average Score (40% weight)
- Raw average score from matches
- Normalized to 0-100 scale
- Higher scores indicate better performance

#### 2. Reliability (30% weight)
- Calculated as: `(Successful Matches / Total Matches) × 100`
- Measures consistency and dependability
- Range: 0-100

#### 3. Match Count (20% weight)
- Number of matches played
- Normalized to prevent bias against teams with fewer matches
- Formula: `min(MatchCount / 12, 1) × 100`

#### 4. Consistency (10% weight)
- Measures score variance
- Lower variance = higher consistency
- Formula: `100 - (StandardDeviation / Mean) × 100`

### Rating Categories
- **Excellent (90-100)**: Top-tier teams with high performance and reliability
- **Good (80-89)**: Strong teams with good performance
- **Average (70-79)**: Solid teams with room for improvement
- **Poor (Below 70)**: Teams needing significant improvement

## Alliance Strength Algorithm

### Base Alliance Score
```
BaseScore = Team1.Rating + Team2.Rating + Team3.Rating
```

### Reliability Bonus
```
ReliabilityBonus = ((Team1.Reliability + Team2.Reliability + Team3.Reliability) / 3) × 10
```

### Synergy Bonus
The synergy bonus rewards alliances with complementary strengths:

#### 1. Calculate Average Phase Scores
```
AvgAuto = (Team1.Auto + Team2.Auto + Team3.Auto) / 3
AvgTeleop = (Team1.Teleop + Team2.Teleop + Team3.Teleop) / 3
AvgEndgame = (Team1.Endgame + Team2.Endgame + Team3.Endgame) / 3
```

#### 2. Calculate Balance Factor
```
Balance = min(AvgAuto, AvgTeleop, AvgEndgame) / max(AvgAuto, AvgTeleop, AvgEndgame)
```

#### 3. Apply Synergy Bonus
```
SynergyBonus = Balance × 5
```

### Final Alliance Strength
```
AllianceStrength = BaseScore + ReliabilityBonus + SynergyBonus
```

## Data Processing

### Excel Import Processing
1. **File Validation**: Check file format and required columns
2. **Data Cleaning**: Remove empty rows, validate data types
3. **Normalization**: Convert all scores to consistent scale
4. **Validation**: Ensure data integrity and completeness

### Google Forms Integration
1. **API Connection**: Connect to Google Forms API
2. **Data Fetching**: Retrieve form responses
3. **Real-time Updates**: Refresh data at configured intervals
4. **Error Handling**: Manage connection issues gracefully

## Performance Optimization

### Caching Strategy
- Team data cached in browser localStorage
- Charts rendered only when visible
- Lazy loading for large datasets

### Memory Management
- Clean up unused chart instances
- Limit alliance combinations for large datasets
- Efficient data structures for quick lookups

## Customization Options

### Configurable Weights
All algorithm weights can be adjusted in `config.js`:

```javascript
rating: {
    weights: {
        avgScore: 0.4,      // Adjustable
        reliability: 0.3,   // Adjustable
        matches: 0.2,       // Adjustable
        consistency: 0.1    // Adjustable
    }
}
```

### Threshold Customization
Rating thresholds can be modified:

```javascript
rating: {
    thresholds: {
        excellent: 90,  // Customizable
        good: 80,       // Customizable
        average: 70,    // Customizable
        poor: 60        // Customizable
    }
}
```

## Future Enhancements

### Advanced Metrics
- **Climbing Performance**: Specialized endgame analysis
- **Defense Rating**: Defensive capabilities assessment
- **Autonomous Consistency**: Auto phase reliability
- **Match Impact**: Influence on match outcomes

### Machine Learning Integration
- **Predictive Modeling**: Forecast team performance
- **Pattern Recognition**: Identify team strategies
- **Optimization**: Suggest optimal alliance combinations

### Real-time Analytics
- **Live Match Tracking**: Real-time score updates
- **Dynamic Rankings**: Live ranking updates
- **Performance Trends**: Historical analysis

## Testing and Validation

### Algorithm Testing
- Unit tests for all calculation functions
- Integration tests for data flow
- Performance tests for large datasets

### Data Validation
- Input validation for all user data
- Error handling for malformed data
- Backup and recovery procedures

## Conclusion

The FRC Scouting Dashboard algorithms provide a comprehensive and flexible system for team analysis and alliance building. The modular design allows for easy customization and future enhancements while maintaining accuracy and performance.

For questions or suggestions about the algorithms, please refer to the main documentation or contact the development team.
