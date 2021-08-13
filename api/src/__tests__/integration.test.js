const supertest = require("supertest");
const app = require("./../server");
const request = supertest(app);


describe('get the books endpoint', () => {
    test('/books should respond with statuscode 200', async (complete) => {
        try {
            const response = await request.get('/books');
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe("object");
            complete()

        } catch (e) {}
    });
});

describe('post a new author', () => {
    test('/addAuthor should respond with statuscode 200', async (complete) => {
        try {
            const response = await request.post('/addAuthor').send({
                name: 'Miyamoto Musashi',
                age: '60'

            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });
});