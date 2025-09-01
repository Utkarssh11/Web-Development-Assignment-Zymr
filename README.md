# User Dashboard

A React-based user dashboard application that displays user analytics and management features.

## Features

### Dashboard Tab
- **Total Users KPI**: Large number block showing total user count
- **Users Created Per Day**: Line chart displaying user creation trends over the last 30 days
- **Avatar Distribution**: Pie chart showing users with vs without profile pictures
- **Recently Joined Users**: Horizontal list of the 5 newest users with avatars and join dates

### Users Tab
- **User Table**: Displays users with avatar, name, email, and created date
- **Search Functionality**: Search by name or email
- **Sorting**: Sort by name (A-Z/Z-A) and by date (newest-oldest/oldest-newest)
- **Pagination**: 10 users per page with navigation controls
- **User Details Modal**: Click any row to view complete user information

## Technologies Used

- **React 18** - Frontend framework
- **React Hooks** - useState, useEffect for state management
- **Recharts** - Chart library for data visualization
- **CSS3** - Custom styling with responsive design

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoint

The application fetches user data from:
```
https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users
```

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React entry point
└── index.css       # Global styles

public/
└── index.html      # HTML template
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Fetches live data from API
- **Interactive Charts**: Hover effects and tooltips on charts
- **Search & Filter**: Real-time search and sorting capabilities
- **Modal System**: User detail view in popup modal
- **Pagination**: Efficient data browsing with page navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- Built with Create React App
- Uses only React hooks (no class components)
- Minimal external dependencies
- Clean, maintainable code structure
- No comments in code (as per requirements)

## Deployment

To build for production:

```bash
npm run build
```

The build folder contains the production-ready application.

## License

This project is created for educational purposes as part of a frontend development assignment.
