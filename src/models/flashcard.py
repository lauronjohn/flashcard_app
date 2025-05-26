from datetime import datetime
from src.models.user import db

class Flashcard(db.Model):
    __tablename__ = 'flashcards'
    
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))
    difficulty = db.Column(db.String(20))
    learning_status = db.Column(db.String(20), default=None)
    review_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_reviewed = db.Column(db.DateTime)
    
    def __init__(self, question, answer, category=None, difficulty=None, learning_status=None):
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty
        self.learning_status = learning_status
        self.review_count = 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'category': self.category,
            'difficulty': self.difficulty,
            'learning_status': self.learning_status,
            'review_count': self.review_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_reviewed': self.last_reviewed.isoformat() if self.last_reviewed else None
        }
