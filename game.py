import random

class NumberGame:
    @staticmethod
    def generate_number(difficulty='medium'):
        ranges = {
            'easy': (1, 50, 10),    # min, max, max_attempts
            'medium': (1, 100, 7),
            'hard': (1, 500, 5)
        }
        min_val, max_val, max_attempts = ranges.get(difficulty, ranges['medium'])
        secret = random.randint(min_val, max_val)
        return secret, min_val, max_val, max_attempts

    @staticmethod
    def evaluate_guess(guess, secret):
        if guess == secret:
            return "correct"
        elif guess < secret:
            return "low"
        else:
            return "high"