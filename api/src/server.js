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


//get all authors

app.get('/authors', async (req, res) => {
  const result = await pg
    .select('*')
    .from('authors')
  res.json({
    res: result
  })
  res.status(200).send()
})


//get all books

app.get('/books', async (req, res) => {
  const result = await pg
    .select('*')
    .from('book')
  res.json({
    res: result
  })
  res.status(200).send()
})


//get specific author by uuid

app.get('/author/:uuid', async (req, res) => {
  const result = await pg.select(['*']).from('authors').where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})


//get specific book by uuid

app.get('/book/:uuid', async (req, res) => {
  const result = await pg.select(['*']).from('book').where({uuid: req.params.uuid})
  res.json({
      res: result
  })
})


//add author

app.post("/addAuthor", (req, res) => {
  let uuid = Helpers.generateUUID();
    pg.insert({
      uuid: uuid,
      title: req.body.title,
      description: req.body.description,
      created_at: new Date(),
    })
      .into("books")
      .then(() => {
        res.json({ uuid: uuid });
    });
});


//add book 

app.post("/addBook",  async (req, res) => {
  let uuid = Helpers.generateUUID();
  let author = await pg.select(['*']).from('authors').where({uuid: req.params.authorUuid})
    pg.insert({
      uuid: uuid,
      title: req.body.title,
      author: author[0].name,
      description: req.body.description,
      created_at: new Date(),
    })
      .into("books")
      .then(() => {
        res.json({ uuid: uuid });
    });
});

//delete author

app.delete("/deleteAuthor", (req, res) => {
  pg('authors').where({ uuid: req.body.uuid }).del().then(() => {
      res.sendStatus(200);
  })
});


//delete book

app.delete("/deleteBook", (req, res) => {
  pg('book').where({ uuid: req.body.uuid }).del().then(() => {
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
          table.string('title');
          table.string('author');
          table.string('description');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table book');
          for (let i = 0; i < 10; i++) {
            const uuid = Helpers.generateUUID();
            await pg.table('book').insert({ uuid, title: `random element aerjzlazjre number ${i}`, description: `a short description of the book ${i}` })
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
        });
        
    }
  });
}
initialiseTables()

module.exports = app;