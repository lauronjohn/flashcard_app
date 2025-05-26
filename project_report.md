# Flashcard Web Application - Enhanced Project Report

## Project Overview

This project is a full-stack web application for creating and studying flashcards. The application features both frontend and backend components, allowing users to create, edit, delete, and study flashcards with an intuitive interface. The application has been enhanced with additional features based on user feedback.

## Technical Architecture

### Backend (Server-side)
- **Framework**: Flask (Python)
- **Database**: SQLite (for easy setup and portability)
- **API Design**: RESTful API endpoints for CRUD operations
- **Data Models**: Flashcard model with question, answer, category, learning status, and metadata
- **Database Migration**: Flask-Migrate for database schema changes

### Frontend (Client-side)
- **Technologies**: HTML, CSS, JavaScript (vanilla)
- **Design**: Responsive layout that works on both desktop and mobile devices
- **Interface**: Modern UI with navigation bar and elegant homepage
- **Features**: Card creation, editing, deletion, and enhanced study mode

## Key Features

1. **Elegant Homepage with Navigation**
   - Welcome section with app introduction
   - Feature highlights
   - User statistics (total cards, categories, cards reviewed)
   - Navigation bar for easy access to different sections

2. **Flashcard Management**
   - Create new flashcards with questions and answers
   - Organize flashcards by categories
   - Edit existing flashcards
   - Delete unwanted flashcards
   - Filter flashcards by category (with improved filtering)

3. **Enhanced Study Mode**
   - **Study by Category**: Select specific categories to study
   - **Learning Status Tracking**: Mark cards as "Know" or "Still Learning"
   - Flip cards to reveal answers
   - Navigate through cards sequentially
   - Track review progress
   - Randomized card order for effective studying

4. **Responsive Design**
   - Adapts to different screen sizes
   - Mobile-friendly interface
   - Consistent experience across devices

## Technical Implementation Details

### Backend Implementation

The backend is built with Flask and provides a RESTful API for the frontend to interact with. Key components include:

1. **Data Model (`src/models/flashcard.py`)**
   - Defines the structure for flashcard data
   - Includes fields for question, answer, category, difficulty, and learning status
   - Tracks review count and last reviewed timestamp
   - Provides methods for serialization (to_dict)

2. **API Routes (`src/routes/flashcard.py`)**
   - GET `/api/flashcards` - Retrieve all flashcards or filter by category
   - GET `/api/flashcards/<id>` - Retrieve a specific flashcard
   - POST `/api/flashcards` - Create a new flashcard
   - PUT `/api/flashcards/<id>` - Update an existing flashcard (including learning status)
   - DELETE `/api/flashcards/<id>` - Delete a flashcard
   - POST `/api/flashcards/<id>/review` - Mark a flashcard as reviewed

3. **Main Application (`src/main.py`)**
   - Configures the Flask application
   - Sets up database connection (SQLite)
   - Initializes Flask-Migrate for database migrations
   - Registers API blueprints
   - Serves static files

### Frontend Implementation

The frontend is built with vanilla HTML, CSS, and JavaScript, providing a clean and intuitive user interface:

1. **HTML Structure (`src/static/index.html`)**
   - Defines the page layout with navigation
   - Implements multiple "pages" within a single HTML file
   - Includes modals for card creation and confirmation dialogs
   - Features a study setup section for category selection
   - Includes "Know" and "Still Learning" buttons in study mode

2. **CSS Styling (`src/static/css/styles.css`)**
   - Implements responsive design
   - Defines animations for card flipping
   - Creates a modern, clean aesthetic
   - Ensures consistent styling across components
   - Styles for learning status indicators

3. **JavaScript Logic (`src/static/js/app.js`)**
   - Handles user interactions
   - Manages API communication
   - Implements enhanced study mode functionality
   - Controls navigation between pages
   - Updates UI based on data changes
   - Provides robust category filtering
   - Tracks and updates learning status
   - Ensures accurate review count updates

## Recent Enhancements

The application has been updated with the following improvements based on user feedback:

1. **Study Mode by Category**
   - Added a dedicated study setup screen
   - Implemented category selection before starting study mode
   - Allows users to focus on specific subjects or topics
   - Maintains the same category dropdown options as the main view

2. **Learning Status Tracking**
   - Added "Know" and "Still Learning" buttons in study mode
   - Implemented backend storage of learning status
   - Visual indicators for learning status on cards
   - Persists learning status between sessions

3. **Fixed Review Count Bug**
   - Corrected the issue where the "Cards Reviewed" count wasn't updating
   - Implemented real-time stats updates after reviewing cards
   - Ensured proper synchronization between frontend and backend
   - Added immediate UI feedback when cards are reviewed

4. **Improved User Experience**
   - Enhanced navigation between application sections
   - Added visual feedback for user actions
   - Improved error handling and notifications
   - Optimized performance for smoother interactions

## Setup and Usage Instructions

### Prerequisites
- Python 3.6 or higher
- pip (Python package manager)

### Installation Steps
1. Extract the project files from the zip archive
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Application
1. Start the Flask server:
   ```
   python -m src.main
   ```
2. Access the application in a web browser at:
   ```
   http://localhost:5000
   ```

### Using the Application
1. **Creating Flashcards**:
   - Navigate to "My Cards" section
   - Click "New Card" button
   - Fill in question, answer, and optional category
   - Click "Save"

2. **Studying Flashcards**:
   - Navigate to "Study" section
   - Select a category to study (or "All Categories")
   - Click "Start Studying"
   - Click on cards to flip between question and answer
   - After viewing the answer, mark your knowledge:
     - Click "Know" if you knew the answer
     - Click "Still Learning" if you need more practice
   - Use "Previous" and "Next" buttons to navigate

3. **Managing Flashcards**:
   - Use edit and delete buttons on each card
   - Filter cards by category using the dropdown
   - Select "All Categories" to view all flashcards

## Project Structure

```
flashcard_app/
├── requirements.txt       # Python dependencies
├── src/                   # Main application directory
│   ├── __init__.py        # Python package marker
│   ├── main.py            # Application entry point
│   ├── models/            # Database models
│   │   ├── __init__.py
│   │   ├── flashcard.py   # Flashcard data model
│   │   └── user.py        # User model and database setup
│   ├── routes/            # API endpoints
│   │   ├── __init__.py
│   │   ├── flashcard.py   # Flashcard API routes
│   │   └── user.py        # User API routes
│   └── static/            # Frontend assets
│       ├── css/
│       │   └── styles.css # Application styles
│       ├── js/
│       │   └── app.js     # Frontend JavaScript
│       └── index.html     # Main HTML entry point
└── README.md              # Project documentation
```

## Conclusion

This flashcard web application successfully implements both frontend and backend components as required. The application provides a complete solution for creating and studying flashcards with an intuitive user interface and robust backend functionality. The recent enhancements have significantly improved the user experience, particularly for studying and tracking learning progress.

The code is organized, well-documented, and follows best practices for web development. The application can be accessed directly through the HTML entry point (`src/static/index.html`) when the Flask server is running, meeting the requirement for direct access to the webpage.

