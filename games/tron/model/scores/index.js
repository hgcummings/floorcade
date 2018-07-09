module.exports.init = (playersFromRound, playerTotals) => {
    const players = playersFromRound.map((p, i) => ({
        id: p.id,
        total: playerTotals[i],
        ...p.score
    }));

    const activity = countScores(players);

    return {
        players,
        activity
    }
}

async function countScores(players) {
    await sleep(1500);
    while(players.some(p => p.kills > 0 || p.place > 0)) {
        players.forEach(p => {
            if (p.kills > 0) {
                p.kills -= 1;
                p.total += 1;
            }
            if (p.place > 0) {
                p.place -= 1;
                p.total += 1;
            }
        });
        await sleep(500);
    }
    await sleep(3000);
    return players.map(p => p.total);
}

const sleep = timeout => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), timeout);
});
