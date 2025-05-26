# Flashcard Web Application

A full-stack web application for creating and studying flashcards, built with Flask and JavaScript.

## Features

- Create, edit, and delete flashcards
- Organize flashcards by categories
- Set difficulty levels for each flashcard
- Study mode with card flipping animation
- Track review history
- Filter flashcards by category
- Responsive design for desktop and mobile

## Technical Stack

- **Backend**: Flask with SQLAlchemy
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQLLite

## Installation and Setup

1. Clone the repository
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run the application:
   ```
   python -m src.main
   ```
5. Access the application at http://localhost:5000

## Usage Instructions

### Creating Flashcards

1. Click the "New Card" button in the header
2. Fill in the question and answer fields
3. Optionally add a category and select difficulty
4. Click "Save" to create the flashcard

### Studying Flashcards

1. Click the "Study Mode" button in the header
2. Navigate through cards using "Previous" and "Next" buttons
3. Click on a card to flip between question and answer
4. Rate cards as Easy, Medium, or Hard to track progress

### Managing Flashcards

- Click the edit icon on a card to modify its content
- Click the delete icon to remove a card
- Use the category filter dropdown to view specific categories

## Project Structure

- `src/` - Main application directory
  - `models/` - Database models
  - `routes/` - API endpoints
  - `static/` - Frontend assets
    - `css/` - Stylesheets
    - `js/` - JavaScript files
    - `index.html` - Main HTML entry point
  - `main.py` - Application entry point
- `requirements.txt` - Python dependencies

## API Endpoints

- `GET /api/flashcards` - Get all flashcards or filter by category
- `GET /api/flashcards/<id>` - Get a specific flashcard
- `POST /api/flashcards` - Create a new flashcard
- `PUT /api/flashcards/<id>` - Update an existing flashcard
- `DELETE /api/flashcards/<id>` - Delete a flashcard
- `POST /api/flashcards/<id>/review` - Mark a flashcard as reviewed
