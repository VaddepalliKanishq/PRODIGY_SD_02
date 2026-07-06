# Number Guessing Game

A beautiful and interactive number guessing game web application built with a **Flask** backend and a responsive **HTML5/CSS3/JavaScript** frontend.

## Features
- **Multiple Difficulties**: Choose between Easy (1–50, 10 attempts), Medium (1–100, 7 attempts), and Hard (1–500, 5 attempts).
- **Dynamic Scoring**: Score is calculated dynamically based on how quickly and in how many attempts the user guesses the correct number.
- **Persistent Leaderboard**: Tracks top 10 player scores locally in a JSON database.
- **Smart Validation**: Validates user inputs on the fly to prevent invalid attempts or out-of-range guesses from reducing the attempt count.

## Project Structure
```
Guessing Game/
│
├── app.py                  # Flask Web Server & game route handlers
├── game.py                 # Core game engine class for number generation & evaluation
├── database.py             # Scores manager for loading and saving to scores.json
├── scores.json             # Local database storing top player scores
├── .gitignore              # Git ignore configurations
├── README.md               # Project documentation (this file)
│
├── static/                 # Frontend assets
│   ├── css/
│   │   └── style.css       # Core game stylesheets & variables
│   └── js/
│       └── script.js       # AJAX requests & UI game loops
│
├── templates/
│   └── index.html          # Main HTML structure for the game board
│
└── utils/
    └── helpers.py          # Helper functions for input validation and scoring formulas
```

## Setup & Running Instructions

### 1. Prerequisites
Ensure you have Python 3.8+ and pip installed.

### 2. Install Flask
If not already installed, run:
```bash
pip install flask
```

### 3. Run the Game Server
Execute the Flask server from the game's root directory:
```bash
python app.py
```

By default, the server will start on port `5001`.

### 4. Play in the Browser
Open your web browser and go to:
[http://127.0.0.1:5001/](http://127.0.0.1:5001/)
