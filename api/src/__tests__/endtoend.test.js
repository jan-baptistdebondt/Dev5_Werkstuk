const supertest = require("supertest");
const app = require("./../server");
const request = supertest(app);

let authorID;
let bookID;

describe('end to end test', () => {
    test('create an author', async (complete) => {
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

    test('update an author', async (complete) => {
        try {
            const response = await request.patch(`/updateAuthor/${authorID}`).send({
                name: 'Miyamoto Musashi',
                age: '61'
            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });

    test('get an author by id', async (complete) => {
        try {
            const response = await request.get(`/author/${authorID}`);
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe("object");
            complete()

        } catch (e) {}
    });

    test('create a book', async (complete) => {
        try {
            const response = await request.post('/addBook').send({
                authorUuid: authorID,
                title: 'The Book of Five Ringsazr',
                description: 'The Book of Five Rings is one of the most insightful texts'
            });
            expect(response.status).toBe(200);
            bookID = response.body.uuid;
            complete()

        } catch (e) {}
    });

    test('update a book', async (complete) => {
        try {
            const response = await request.patch(`/updateBook/${bookID}`).send({
                title: 'The Book of Five Rings'
            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });

    test('get a book by uuid', async (complete) => {
        try {
            const response = await request.get(`/book/${bookID}`);
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe("object");
            expect(response.body.res[0].title).toBe("The Book of Five Rings");
            complete()

        } catch (e) {}
    });

    test('delete an author and all linked books', async (complete) => {
        try {
            const response = await request.delete('/deleteAuthor').send({
                uuid: authorID
            });
            expect(response.status).toBe(200);
            complete()

        } catch (e) {}
    });

});