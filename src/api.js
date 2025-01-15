const express = require('express');
const { parseLogFile } = require('./parser');
const { swaggerUi, swaggerDocs } = require('./swagger');

const app = express();
const port = 3000;

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retorna os dados dos jogos
 *     parameters:
 *       - in: query
 *         name: player
 *         schema:
 *           type: string
 *         description: Filtra jogos por jogador
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de jogos por página
 *     responses:
 *       200:
 *         description: Lista de jogos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   total_kills:
 *                     type: integer
 *                   players:
 *                     type: array
 *                     items:
 *                       type: string
 *                   kills:
 *                     type: object
 *                     additionalProperties:
 *                       type: integer
 */
app.get('/games', (req, res) => {
    const { player, page = 1, limit = 10 } = req.query;
    let games = parseLogFile('games.log');

    if (player) {
        games = games.filter(game => game.players.includes(player));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGames = games.slice(startIndex, endIndex);

    res.json(paginatedGames);
});

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Retorna estatísticas gerais dos jogos
 *     responses:
 *       200:
 *         description: Estatísticas gerais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_games:
 *                   type: integer
 *                 total_kills:
 *                   type: integer
 *                 top_players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       player:
 *                         type: string
 *                       kills:
 *                         type: integer
 */
app.get('/stats', (req, res) => {
    const games = parseLogFile('games.log');
    const total_games = games.length;
    const total_kills = games.reduce((sum, game) => sum + game.total_kills, 0);

    const playerKills = {};
    games.forEach(game => {
        Object.entries(game.kills).forEach(([player, kills]) => {
            playerKills[player] = (playerKills[player] || 0) + kills;
        });
    });

    const top_players = Object.entries(playerKills)
        .map(([player, kills]) => ({ player, kills }))
        .sort((a, b) => b.kills - a.kills)
        .slice(0, 5);

    res.json({ total_games, total_kills, top_players });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;