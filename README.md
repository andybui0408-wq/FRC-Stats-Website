# SSIS FRC Scouting Dashboard

A comprehensive full-stack web application for FRC (First Robotics Competition) team scouting, data analysis, and alliance building - exclusively for Saigon South International School (SSIS) students and staff.

## Features

### 🔐 **SSIS-Exclusive Access**
- Email-based authentication restricted to `@ssis.edu.vn` domain
- Secure session management
- Automatic user creation on first login

### 📊 **Dashboard**
- Real-time statistics overview
- Team performance distribution charts
- Alliance strength analysis
- Key metrics display

### 👥 **Team Analysis**
- Comprehensive team database
- Search and filter functionality
- Team rating system
- Performance metrics tracking
- Match history and reliability scores

### 🤝 **Alliance Building**
- Interactive alliance builder
- Real-time alliance strength calculation
- Top alliance rankings
- Synergy analysis between teams

### 📝 **Data Collection**
- Embedded Google Form for scouting data submission
- Direct integration with Google Forms
- Automatic data collection

### 📈 **Data Management**
- Excel/CSV file import (.xlsx, .xls, .csv)
- Data preview and validation
- Real-time updates

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- SSIS email address (`@ssis.edu.vn`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andybui0408-wq/FRC-Stats-Website.git
   cd FRC-Stats-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3000`
   - You'll be redirected to login page
   - Sign in with your `@ssis.edu.vn` email address

### First-Time Login

1. Navigate to the login page
2. Enter your SSIS email address (e.g., `your.name@ssis.edu.vn`)
3. Click "Sign In / Sign Up"
4. You'll be automatically registered and logged in
5. Access the full dashboard

## Deployment on Netlify

### Setup

1. **Push to GitHub** (already configured)
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Configure Netlify**
   - Connect your GitHub repository to Netlify
   - Build command: `npm install`
   - Publish directory: `.` (root)
   - Start command: `npm start`

3. **Environment Variables** (optional)
   - `PORT`: Server port (default: 3000)
   - Set up in Netlify dashboard: Site settings → Environment variables

### Netlify Functions (Alternative)

For serverless deployment, you may need to convert the Express server to Netlify Functions. The current setup uses Express.js which works on Netlify with proper configuration.

## Project Structure

```
FRC-Stats-Website/
├── index.html          # Main dashboard page
├── login.html          # Authentication page
├── server.js           # Express backend server
├── styles.css          # SSIS-branded styles
├── script.js           # Frontend JavaScript
├── package.json        # Dependencies and scripts
├── src/
│   ├── db.js          # Database layer (lowdb)
│   └── logic.js        # Alliance calculation logic
├── data/               # JSON database files (gitignored)
├── uploads/            # Temporary upload directory (gitignored)
└── README.md           # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with SSIS email
- `POST /api/auth/signup` - Sign up with SSIS email
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create/update team

### Matches
- `GET /api/matches` - List matches
- `POST /api/matches` - Create match

### Statistics
- `GET /api/stats/overview` - Dashboard statistics

### Alliances
- `GET /api/alliances/top?limit=10` - Top alliances
- `POST /api/alliances/calc` - Calculate alliance strength

### Import
- `POST /api/import/file` - Import Excel/CSV file

## Data Format

### Excel/CSV Import Format

Your Excel files should include columns for:
- **Team Number** (required)
- **Team Name**
- **Rating**
- **Matches Played**
- **Average Score**
- **Reliability**
- **Auto Points**
- **Teleop Points**
- **Endgame Points**

### Google Forms Integration

The embedded Google Form automatically collects scouting data. Ensure your form fields match the expected data structure for seamless integration.

## Algorithm Details

### Team Rating System
Teams are rated based on:
- Average match performance (40% weight)
- Consistency/reliability (30% weight)
- Match count (20% weight)
- Performance trends (10% weight)

### Alliance Strength Calculation
Alliance strength considers:
- Combined team ratings
- Reliability bonuses
- Synergy analysis
- Complementary strengths across match phases

See `ALGORITHM.md` for detailed documentation.

## SSIS Branding

The application uses SSIS brand colors and styling:
- **Primary Color**: Navy Blue (#003366)
- **Secondary Color**: Blue (#004d99)
- **Font**: Open Sans
- **Design**: Clean, professional, modern

## Security

- **Email Domain Restriction**: Only `@ssis.edu.vn` emails can access the system
- **Session Management**: Secure session tokens with expiration
- **Database**: JSON-based storage (can be upgraded to PostgreSQL/MySQL for production)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and intended exclusively for SSIS FRC Team use.

## Support

For questions or support, contact the SSIS FRC Team or create an issue in the repository.

---

**Built with ❤️ for SSIS FRC Team**

© 2024 Saigon South International School