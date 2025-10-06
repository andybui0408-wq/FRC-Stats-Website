# FRC Scouting Dashboard

A comprehensive web application for FRC (First Robotics Competition) team scouting, data analysis, and alliance building.

## Features

### 📊 Dashboard
- Real-time statistics overview
- Team performance distribution charts
- Alliance strength analysis
- Key metrics display

### 👥 Team Analysis
- Comprehensive team database
- Search and filter functionality
- Team rating system
- Performance metrics tracking
- Match history and reliability scores

### 🤝 Alliance Building
- Interactive alliance builder
- Real-time alliance strength calculation
- Top alliance rankings
- Synergy analysis between teams

### 📈 Data Management
- Excel file import (.xlsx, .xls)
- Google Forms integration (demo)
- Data preview and validation
- Export capabilities

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start importing team data or use the sample data

### Usage

#### Importing Data
1. Navigate to the "Data Import" section
2. Upload Excel files with team data
3. Or connect to Google Forms for real-time data collection

#### Team Analysis
1. Go to the "Teams" section
2. Use search to find specific teams
3. Sort by rating, team number, or matches
4. Click "View" for detailed team information

#### Building Alliances
1. Navigate to the "Alliances" section
2. Select three teams from the dropdown menus
3. Click "Calculate Alliance Strength"
4. View top alliance rankings

## Data Format

### Excel Import Format
Your Excel files should include columns for:
- Team Number
- Team Name
- Rating
- Matches Played
- Average Score
- Reliability
- Auto Points
- Teleop Points
- Endgame Points

### Google Forms Integration
Set up Google Forms with fields matching your data structure. The system will automatically process responses and update the dashboard.

## Algorithm Details

### Team Rating System
Teams are rated based on:
- Average match performance
- Consistency (reliability)
- Match count
- Performance trends

### Alliance Strength Calculation
Alliance strength is calculated using:
- Combined team ratings
- Reliability bonuses
- Synergy analysis
- Complementary strengths

## Customization

### Adding New Metrics
1. Update the team data structure in `script.js`
2. Add corresponding columns to the teams table
3. Update the alliance calculation algorithm

### Styling
- Modify `styles.css` for visual customization
- Update color schemes and layouts
- Add team-specific branding

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.

## Support
For questions or support, please contact the development team or create an issue in the repository.

---

Built with ❤️ for FRC teams worldwide
