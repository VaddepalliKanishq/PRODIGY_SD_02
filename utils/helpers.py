def calculate_score(attempts, max_attempts, time_taken=0):
    """Calculates a dynamic score based on efficiency."""
    if attempts > max_attempts:
        return 0
    
    # Base score depends on remaining attempts
    base_score = (max_attempts - attempts + 1) * 10
    
    # Bonus for guessing quickly (optional mechanic)
    speed_bonus = max(0, 50 - time_taken) 
    
    return base_score + speed_bonus

def validate_guess(guess, min_val, max_val):
    """Ensures the guess is a valid integer within range."""
    try:
        val = int(guess)
        if not (min_val <= val <= max_val):
            return False, f"Please guess between {min_val} and {max_val}."
        return True, val
    except ValueError:
        return False, "Invalid input. Please enter a number."