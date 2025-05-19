export function calculateAvg(currentScore, gamemode, dartsThrown) {
    if(currentScore == gamemode)
    {
        return 0
    }
    else {
        return (((gamemode - currentScore)/ dartsThrown) * 3).toFixed(2)
    }

}