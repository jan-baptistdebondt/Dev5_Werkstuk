const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js')
const port = 3000


const pg = require('knex')({
  client: 'pg',
  version: '9.6',
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'
});


const app = express();
http.Server(app);


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


app.get('/test', (req, res) => {
  res.status(200).send();
})


/**
 * @params: none
 * @returns: all authors in the database
 **/

app.get('/authors', async (req, res) => {
  const result = await pg
    .select('*')
    .from('authors')
  res.json({
    res: result
  })
  res.status(200).send()
})


/**
 * @params: none
 * @returns: all books in the database
 **/

app.get('/books', async (req, res) => {
  const result = await pg
    .select('*')
    .from('book')
  res.json({
    res: result
  })
  res.status(200).send()
})


/**
 * @params: uuid
 * @returns: a specific author by uuid
 **/

app.get('/author/:uuid', async (req, res) => {
  const result = await pg.select(['*']).from('authors').where({
    uuid: req.params.uuid
  })
  res.json({
    res: result
  })
})


/**
 * @params: uuid
 * @returns: a specific book by uuid
 **/

app.get('/book/:uuid', async (req, res) => {
  const result = await pg.select(['*']).from('book').where({
    uuid: req.params.uuid
  })
  res.json({
    res: result
  })
})


/**
 * @params: uuid, name, age 
 * @returns: the uuid of the created author
 **/

app.post("/addAuthor", (req, res) => {
  let uuid = Helpers.generateUUID();
  pg.insert({
      uuid: uuid,
      name: req.body.name,
      age: req.body.age,
      created_at: new Date(),
    })
    .into("authors")
    .then(() => {
      res.json({
        uuid: uuid
      });
    });
});


/**
 * @params: uuid, authorUuid title, author, description
 * @returns: the uuid of the created book
 **/

app.post("/addBook", async (req, res) => {
  let uuid = Helpers.generateUUID();
  let author = await pg.select(['*']).from('authors').where({
    uuid: req.body.authorUuid
  })
  pg.insert({
      uuid: uuid,
      authorUuid: author[0].uuid,
      title: req.body.title,
      author: author[0].name,
      description: req.body.description,
      created_at: new Date()
    })
    .into("book")
    .then(() => {
      res.json({
        uuid: uuid
      });
    });
});

/**
 * @params: uuid
 * @returns: statuscode 200
 **/

app.delete("/deleteAuthor", (req, res) => {
  pg('authors').where({
    uuid: req.body.uuid
  }).del()
  pg('book').where({
    authorUuid: req.body.uuid
  }).del().then(() => {
    res.sendStatus(200);
  })
});


/**
 * @params: uuid
 * @returns: statuscode 200
 **/

app.delete("/deleteBook", (req, res) => {
  pg('book').where({
    uuid: req.body.uuid
  }).del().then(() => {
    res.sendStatus(200);
  })
});


/**
 * @params: uuid, name, age 
 * @returns: statuscode 200
 **/

app.patch("/updateAuthor/:uuid", (req, res) => {
  pg('authors').where({
    uuid: req.params.uuid
  }).update(req.body).then(() => {
    res.sendStatus(200);
  })
});


/**
 * @params: uuid, authorUuid title, author, description
 * @returns: statuscode 200
 **/

app.patch("/updateBook/:uuid", (req, res) => {
  pg('book').where({
    uuid: req.params.uuid
  }).update(req.body).then(() => {
    res.sendStatus(200);
  })
});



async function initialiseTables() {
  await pg.schema.hasTable('book').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('book', (table) => {
          table.increments();
          table.uuid('uuid');
          table.uuid('authorUuid');
          table.string('title');
          table.string('author');
          table.string('description');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table book');
          for (let i = 0; i < 10; i++) {
            const uuid = Helpers.generateUUID();
            await pg.table('book').insert({
              uuid,
              title: `random book ${i}`,
              author: `author nr ${i}`,
              description: `a short description of the random book nr ${i}`
            })
          }
        });

    }
  });

  await pg.schema.hasTable('authors').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('authors', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('name');
          table.string('age');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table authors');
          for (let i = 0; i < 10; i++) {
            const uuid = Helpers.generateUUID();
            await pg.table('authors').insert({
              uuid,
              name: `author name ${i}`,
              age: `${i*10} years old`
            })
          }
        });

    }
  });
}
initialiseTables()

module.exports = app;