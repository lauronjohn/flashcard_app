from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db
from src.models.flashcard import Flashcard

flashcard_bp = Blueprint('flashcard', __name__)

@flashcard_bp.route('/flashcards', methods=['GET'])
def get_flashcards():
    """Get all flashcards or filter by category"""
    category = request.args.get('category')
    
    if category:
        flashcards = Flashcard.query.filter_by(category=category).all()
    else:
        flashcards = Flashcard.query.all()
    
    return jsonify({
        'success': True,
        'flashcards': [flashcard.to_dict() for flashcard in flashcards]
    }), 200

@flashcard_bp.route('/flashcards/<int:flashcard_id>', methods=['GET'])
def get_flashcard(flashcard_id):
    """Get a specific flashcard by ID"""
    flashcard = Flashcard.query.get(flashcard_id)
    
    if not flashcard:
        return jsonify({
            'success': False,
            'message': 'Flashcard not found'
        }), 404
    
    return jsonify({
        'success': True,
        'flashcard': flashcard.to_dict()
    }), 200

@flashcard_bp.route('/flashcards', methods=['POST'])
def create_flashcard():
    """Create a new flashcard"""
    data = request.get_json()
    
    if not data or not data.get('question') or not data.get('answer'):
        return jsonify({
            'success': False,
            'message': 'Question and answer are required'
        }), 400
    
    new_flashcard = Flashcard(
        question=data.get('question'),
        answer=data.get('answer'),
        category=data.get('category'),
        difficulty=data.get('difficulty'),
        learning_status=data.get('learning_status')
    )
    
    db.session.add(new_flashcard)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Flashcard created successfully',
        'flashcard': new_flashcard.to_dict()
    }), 201

@flashcard_bp.route('/flashcards/<int:flashcard_id>', methods=['PUT'])
def update_flashcard(flashcard_id):
    """Update an existing flashcard"""
    flashcard = Flashcard.query.get(flashcard_id)
    
    if not flashcard:
        return jsonify({
            'success': False,
            'message': 'Flashcard not found'
        }), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({
            'success': False,
            'message': 'No data provided'
        }), 400
    
    if 'question' in data:
        flashcard.question = data['question']
    if 'answer' in data:
        flashcard.answer = data['answer']
    if 'category' in data:
        flashcard.category = data['category']
    if 'difficulty' in data:
        flashcard.difficulty = data['difficulty']
    if 'learning_status' in data:
        flashcard.learning_status = data['learning_status']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Flashcard updated successfully',
        'flashcard': flashcard.to_dict()
    }), 200

@flashcard_bp.route('/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    """Delete a flashcard"""
    flashcard = Flashcard.query.get(flashcard_id)
    
    if not flashcard:
        return jsonify({
            'success': False,
            'message': 'Flashcard not found'
        }), 404
    
    db.session.delete(flashcard)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Flashcard deleted successfully'
    }), 200

@flashcard_bp.route('/flashcards/<int:flashcard_id>/review', methods=['POST'])
def review_flashcard(flashcard_id):
    """Mark a flashcard as reviewed"""
    flashcard = Flashcard.query.get(flashcard_id)
    
    if not flashcard:
        return jsonify({
            'success': False,
            'message': 'Flashcard not found'
        }), 404
    
    flashcard.last_reviewed = datetime.utcnow()
    flashcard.review_count += 1
    
    # Update learning status if provided
    data = request.get_json()
    if data and 'learning_status' in data:
        flashcard.learning_status = data['learning_status']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Flashcard review recorded',
        'flashcard': flashcard.to_dict()
    }), 200
