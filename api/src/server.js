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
    // to support URL-encoded bodies
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









async function initialiseTables() {
  await pg.schema.hasTable('book').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('book', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('title');
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