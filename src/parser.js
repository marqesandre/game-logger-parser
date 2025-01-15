const fs = require('fs');

function parseLogFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const games = [];
    let currentGame = null;

    data.split('\n').forEach(line => {
        if (line.includes('InitGame')) {
            if (currentGame) {
                games.push(currentGame);
            }
            currentGame = { total_kills: 0, players: [], kills: {} };
        } else if (line.includes('Kill')) {
            currentGame.total_kills++;
            const match = line.match(/Kill: \d+ \d+ \d+: (.+) killed (.+) by (.+)/);
            if (match) {
                const killer = match[1];
                const killed = match[2];
                if (killer !== '<world>') {
                    if (!currentGame.players.includes(killer)) {
                        currentGame.players.push(killer);
                    }
                    currentGame.kills[killer] = (currentGame.kills[killer] || 0) + 1;
                }
                if (!currentGame.players.includes(killed)) {
                    currentGame.players.push(killed);
                }
                if (killer === '<world>') {
                    currentGame.kills[killed] = (currentGame.kills[killed] || 0) - 1;
                }
            }
        }
    });

    if (currentGame) {
        games.push(currentGame);
    }

    return games;
}

module.exports = { parseLogFile };