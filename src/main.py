import os
import sys
# DON'T CHANGE THIS LINE !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, redirect, url_for
from flask_migrate import Migrate
from src.models.user import db
from src.routes.flashcard import flashcard_bp

# Get the absolute path to the static directory
static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

app = Flask(__name__, static_folder=None)  # Disable default static handling
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(flashcard_bp, url_prefix='/api')

# Serve static files and handle all routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == "" or path == "/":
        return send_from_directory(static_folder, 'index.html')
    
    # Try to serve the file from static directory
    file_path = os.path.join(static_folder, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(static_folder, path)
    
    # For API routes, let them pass through
    if path.startswith('api/'):
        return None
        
    # For all other routes, serve index.html (for client-side routing)
    return send_from_directory(static_folder, 'index.html')

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    print(f"Static folder path: {static_folder}")
    print(f"Index.html exists: {os.path.exists(os.path.join(static_folder, 'index.html'))}")
    app.run(host='0.0.0.0', port=5000, debug=True)
