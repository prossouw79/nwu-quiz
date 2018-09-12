function arraysEqual(a1, a2) {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

function shuffle(arrIn) {
    var a = arrIn.slice(0);

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    if (!arraysEqual(arrIn, a))
        return a;
    else
        return shuffle(arrIn);
}

function pluck(array, key) {
    return array.map(o => o[key]);
}

module.exports = {
    shuffle: shuffle,
    arraysEqual: arraysEqual,
    pluck: pluck
}