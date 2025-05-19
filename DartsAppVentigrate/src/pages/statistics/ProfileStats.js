export function getAmountOfBullsEye(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        if (t.throw1 === 50) count++;
        if (t.throw2 === 50) count++;
        if (t.throw3 === 50) count++;
    });

    return count;
}

export function getAmountOfBulls(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        if (t.throw1 === 25) count++;
        if (t.throw2 === 25) count++;
        if (t.throw3 === 25) count++;
    });

    return count;
}

export function getAmountOfTriple20(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        if (t.throw1 === 60) count++;
        if (t.throw2 === 60) count++;
        if (t.throw3 === 60) count++;
    });

    return count;
}

export function getAmountOf180(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        const total = t.throw1 + t.throw2 + t.throw3;
        if (total === 180) count++;
    });

    return count;
}

export function getScoresAbove140(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        const total = t.throw1 + t.throw2 + t.throw3;
        if (total >= 140 && total < 180) count++;
    });

    return count;
}

export function getScoresAbove100(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        const total = t.throw1 + t.throw2 + t.throw3;
        if (total >= 100 && total < 140) count++;
    });

    return count;
}

export function getScoreLowerThen100(userId, throws, startDate, endDate) {
    let count = 0;
    let userThrows = []

    if(startDate != null && endDate === null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate
        );
    }
    else if( startDate === null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) <= endDate
        );
    }
    else if( startDate != null && endDate != null)
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId &&
            new Date(t.datum) >= startDate && new Date(t.datum) <= endDate
        )
    }
    else
    {
        userThrows = throws.filter(t => 
            t.speler.id === userId
        )
    }

    userThrows.forEach(t => {
        const total = t.throw1 + t.throw2 + t.throw3;
        if (total < 100) count++;
    });

    return count;
}
