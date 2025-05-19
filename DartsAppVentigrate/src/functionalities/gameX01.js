export function calculateNewScore(currentScore, thrownScore, doubleValid) {

    if (thrownScore > currentScore) {
        return currentScore; // Can't go negative
    } else if (currentScore - thrownScore === 1) {
        return currentScore; // Can't finish with 1
    } else if (currentScore - thrownScore === 0) {
        if (doubleValid) {
            return 0; // Must hit a double to win
        } else {
            return currentScore;
        }
    } else {
        return currentScore - thrownScore;
    }
}
