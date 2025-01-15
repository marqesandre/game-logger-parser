const request = require('supertest');
const app = require('../src/api');

describe('GET /games', () => {
    it('should return a list of games', async () => {
        const response = await request(app).get('/games');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter games by player', async () => {
        const response = await request(app).get('/games').query({ player: 'Isgalamido' });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.every(game => game.players.includes('Isgalamido'))).toBe(true);
    });

    it('should paginate games', async () => {
        const response = await request(app).get('/games').query({ page: 1, limit: 2 });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.length).toBe(2);
    });
});

describe('GET /stats', () => {
    it('should return general statistics', async () => {
        const response = await request(app).get('/stats');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('total_games');
        expect(response.body).toHaveProperty('total_kills');
        expect(response.body).toHaveProperty('top_players');
    });
});