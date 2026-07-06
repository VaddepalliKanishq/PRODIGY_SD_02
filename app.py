from flask import Flask, render_template, request, jsonify, session
from game import NumberGame
from database import load_scores, save_score
from utils.helpers import validate_guess, calculate_score
import os

app = Flask(__name__)
# In production, use os.environ.get('SECRET_KEY')
app.secret_key = 'smart-game-super-secret-key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start', methods=['POST'])
def start_game():
    data = request.json or {}
    difficulty = data.get('difficulty', 'medium')
    
    secret, min_val, max_val, max_attempts = NumberGame.generate_number(difficulty)
    
    # Store game state securely on the server
    session['secret'] = secret
    session['min_val'] = min_val
    session['max_val'] = max_val
    session['max_attempts'] = max_attempts
    session['attempts'] = 0
    session['game_over'] = False
    
    return jsonify({
        "message": "Game started",
        "min": min_val,
        "max": max_val,
        "max_attempts": max_attempts
    })

@app.route('/api/guess', methods=['POST'])
def make_guess():
    if session.get('game_over', True):
        return jsonify({"error": "Game is not active. Start a new game."}), 400

    data = request.json
    raw_guess = data.get('guess')
    
    is_valid, parsed_guess = validate_guess(raw_guess, session['min_val'], session['max_val'])
    if not is_valid:
        return jsonify({"error": parsed_guess}), 400

    session['attempts'] += 1
    attempts_left = session['max_attempts'] - session['attempts']
    
    status = NumberGame.evaluate_guess(parsed_guess, session['secret'])
    
    response = {
        "status": status,
        "attempts_made": session['attempts'],
        "attempts_left": attempts_left
    }

    if status == "correct":
        session['game_over'] = True
        score = calculate_score(session['attempts'], session['max_attempts'])
        response['score'] = score
        response['message'] = "Congratulations! You found the number."
    elif attempts_left <= 0:
        session['game_over'] = True
        response['status'] = "game_over"
        response['secret'] = session['secret']
        response['message'] = "Out of attempts! Better luck next time."
        
    session.modified = True
    return jsonify(response)

@app.route('/api/leaderboard', methods=['GET', 'POST'])
def leaderboard():
    if request.method == 'POST':
        data = request.json
        name = data.get('name', 'Anonymous')
        score = data.get('score', 0)
        attempts = data.get('attempts', 0)
        save_score(name, score, attempts)
        
    return jsonify(load_scores())

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)