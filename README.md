# Finance Tracker

A modern, responsive web application for tracking income and expenses with visual dashboards and insights.

## Features

### 1. Monthly Salary Tracking
- **$1,000 monthly income** preset (easily customizable in code)
- Real-time balance calculation
- Visual indicators for budget status

### 2. Expense Categorization & Tracking
- **9 predefined categories**: Food & Dining, Housing & Rent, Transportation, Entertainment, Shopping, Utilities, Health & Wellness, Education, Other
- Add custom expenses with name, amount, category, and date
- Edit/delete functionality for expenses
- Search and filter expenses by category

### 3. Visual Dashboard with Charts
- **Doughnut chart** for expense distribution by category
- **Bar chart** comparing budget vs actual spending per category
- Interactive charts with hover details
- Responsive design for all screen sizes

### 4. Monthly Budget vs Actual Comparison
- Visual comparison of budgeted vs actual spending
- Color-coded categories for easy identification
- Real-time updates as expenses are added/removed

### 5. User-Friendly Interface
- **Clean, modern design** with gradient accents
- **Fully responsive** - works on mobile, tablet, and desktop
- **Intuitive navigation** with month selector
- **Visual feedback** for all actions
- **Accessibility considerations** with proper contrast and labels

### 6. Local Storage
- All data saved in browser's local storage
- No backend required - works completely offline
- Data persists between sessions
- Export/import functionality for data backup

### 7. Expense Management
- **Add expenses** with form validation
- **Delete expenses** with confirmation
- **Search expenses** by name
- **Filter expenses** by category
- **Sort expenses** by date (newest first)

### 8. Monthly Summary & Insights
- **Real-time insights** based on spending patterns
- **Budget status alerts** (good progress, watch spending, over budget)
- **Spending trend analysis**
- **Helpful tips** for financial management

## Technical Implementation

### File Structure
```
finance-tracker/
├── index.html      # Main HTML structure
├── style.css       # CSS styles and responsive design
├── app.js          # JavaScript application logic
└── README.md       # This documentation
```

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Object-oriented programming with classes
- **Chart.js** - Interactive data visualization
- **Font Awesome** - Icon library
- **Local Storage API** - Client-side data persistence

### Key JavaScript Features
- **FinanceTracker class** - Main application logic
- **Data persistence** - Automatic saving to local storage
- **Chart integration** - Dynamic chart updates
- **Event handling** - Form submissions, button clicks, filters
- **Date management** - Month navigation and filtering
- **Notification system** - User feedback for actions

## How to Use

### 1. Adding Expenses
1. Fill in the "Add New Expense" form
2. Enter expense name, amount, category, and date
3. Click "Add Expense" button
4. Watch the dashboard update in real-time

### 2. Managing Expenses
- **Search**: Type in the search box to filter by name
- **Filter**: Use the category dropdown to show specific categories
- **Delete**: Click the trash icon next to any expense to remove it

### 3. Navigating Months
- Use the left/right arrows to switch between months
- View expenses and charts for any selected month
- Current month is highlighted

### 4. Data Management
- **Export**: Click "Export Data" to download a JSON backup
- **Reset**: Click "Reset All Data" to clear everything (with confirmation)

## Customization

### Changing Monthly Income
Edit the `monthlyIncome` property in the `FinanceTracker` constructor in `app.js`:
```javascript
this.monthlyIncome = 1000; // Change this value
```

### Adding/Modifying Categories
Edit the `categories` object in the `FinanceTracker` constructor:
```javascript
this.categories = {
    food: { name: 'Food & Dining', color: '#FF6B6B', budget: 200 },
    // Add more categories here
};
```

### Styling Changes
Modify CSS variables in `style.css`:
```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3a0ca3;
    /* Add more custom colors */
}
```

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome for Android)

## Future Enhancements
Potential features for future development:
1. **Recurring expenses** - Set up monthly bills
2. **Income tracking** - Multiple income sources
3. **Goals setting** - Savings targets
4. **Reports generation** - PDF/Excel exports
5. **Dark mode** - Theme switching
6. **Currency support** - Multiple currencies
7. **Data import** - CSV/Excel file upload
8. **Cloud sync** - Optional backend integration

## Getting Started
Simply open `index.html` in any modern web browser. No installation or setup required!
