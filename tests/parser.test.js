const { parseLogFile } = require('../src/parser');

test('parseLogFile should parse log file correctly', () => {
    const games = parseLogFile('games.log');
    expect(games).toBeDefined();
    expect(games.length).toBeGreaterThan(0);
    expect(games[0]).toHaveProperty('total_kills');
    expect(games[0]).toHaveProperty('players');
    expect(games[0]).toHaveProperty('kills');
});