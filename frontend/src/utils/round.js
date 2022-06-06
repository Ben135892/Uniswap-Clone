const round = (x, p = 10) => {
    if (isNaN(parseFloat(x))) return '';
    return (1 * Number(x).toFixed(p));
}

export default round;