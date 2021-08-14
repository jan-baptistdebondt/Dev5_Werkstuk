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

let authorID;

describe('post a new author', () => {
    test('/addAuthor should respond with statuscode 200 when a new author is added', async (complete) => {
        try {
            const response = await request.post('/addAuthor').send({
                name: 'Miyamoto Musashiii',
                age: '60'

            });
            expect(response.status).toBe(200);
            authorID = response.body.uuid;
            complete()

        } catch (e) {}
    });
});

describe('update an author', () => {
    test('/updateAuthor should respond with statuscode 200 if an author is updated', async (complete) => {
        try {
            const response = await request.patch(`/updateAuthor/${authorID}`).send({
                name: 'Miyamoto Musashi',
                age: '61'
            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });
});

describe('delete an author', () => {
    test('/deleteAuthor should respond with statuscode 200 if an author is deleted', async (complete) => {
        try {
            const response = await request.delete('/deleteAuthor').send({
                uuid: authorID
            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });
});

