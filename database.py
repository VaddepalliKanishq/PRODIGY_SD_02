import json
import os

DB_FILE = 'scores.json'

def load_scores():
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_score(player_name, score, attempts):
    scores = load_scores()
    scores.append({
        "name": player_name,
        "score": score,
        "attempts": attempts
    })
    # Sort descending by score and keep top 10
    scores = sorted(scores, key=lambda x: x['score'], reverse=True)[:10]
    
    with open(DB_FILE, 'w') as f:
        json.dump(scores, f, indent=4)
    return scores