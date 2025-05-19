function amountOfBullsEye(throws, playerId, startDate, endDate) {
    let count = 0
    let userThrows = []

    if(startDate && endDate === null)
    {
            userThrows = throws.filter(t => 
                t.speler.id === playerId &&
                new Date(t.datum) >= startDate
            );
        }
        else if( startDate === null && endDate != null)
        {
            userThrows = throws.filter(t => 
                t.speler.id === playerId &&
                new Date(t.datum) <= endDate
            );
        }
        else if( startDate != null && endDate != null)
        {
            userThrows = throws.filter(t => 
                t.speler.id === playerId &&
                new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
            )
        }
        else
        {
            userThrows = throws.filter(t => 
                t.speler.id === playerId
            )
        }
    
        userThrows.forEach(t => {
            if (t.throw1 === 50) count++;
            if (t.throw2 === 50) count++;
            if (t.throw3 === 50) count++;
        });
    
        return count;
}
function amountOfTriple20(throws, playerId, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId
        )
    }

    userThrows.forEach(t => {
        if (t.throw1 === 60) count++;
        if (t.throw2 === 60) count++;
        if (t.throw3 === 60) count++;
    });

    return count;
}
function amountOfMissed(throws, playerId, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === playerId
        )
    }

    userThrows.forEach(t => {
        if (t.throw1 === 0) count++;
        if (t.throw2 === 0) count++;
        if (t.throw3 === 0) count++;
    });

    return count;
}

export function generateStatsList(throws, players,users, startDate, endDate) {

    const statList = []

    if(players.length === 0)
    {
        users.forEach(u => {
            statList.push({
                name: u.name, 
                bull:  amountOfBullsEye(throws,u.id,startDate,endDate), 
                triple: amountOfTriple20(throws,u.id,startDate,endDate), 
                miss: amountOfMissed(throws,u.id,startDate,endDate)
            })
        })
    }
    else {
        players.forEach(t => {
            let id = users.find((u) => u.name === t)
            statList.push({
                name: t, 
                bull:  amountOfBullsEye(throws,id.id,startDate,endDate), 
                triple: amountOfTriple20(throws,id.id,startDate,endDate), 
                miss: amountOfMissed(throws,id.id,startDate,endDate)
            })
        })
    }

    return statList
}