const round = (x, p = 8) => {
    if (isNaN(parseFloat(x))) return '';
    return parseFloat(x).toPrecision(p);
}

export default round;