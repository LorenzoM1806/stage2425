export function checkWin(currentsets, round, sets) {
    if(round === "Finale")
    {
        if(currentsets === sets + 2)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else {
        if(currentsets === sets)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}