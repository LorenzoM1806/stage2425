export function calculateDoublePercent(doubles) {
    if(doubles === 0)
    {
        return 0
    }
    else
    {
        return (1/doubles*100).toFixed(2)
    }

}