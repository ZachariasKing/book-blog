import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import { Book } from './db/pg/Book';
import { BookDb } from './db/BookDb';
import { title } from 'process';
import ApiClient from './Utilities/ApiClient';


//Express server setup
const app = express();
const port = process.env.PORT || 3000; //TEST
console.log(`process.env.PORT: ${process.env.PORT}`);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Database Connection
const pool = new pg.Pool({
   user: "postgres",
   host: "localhost",
   database: "books",
   password: "Echo0123$",
   port: 5432,
});
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const book: BookDb = new Book(pool);

(async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    console.error('Error connecting to the database', err);
    process.exit(-1);
  }
})();

//Endpoints
app.get('/', (req, res) => {
  book.getAllBooksWithAuthors()
    .then(books => {
      console.log('Books fetched successfully:', books);
      res.render('index.ejs', { books, title: 'Book List' });
    })
    .catch(err => {
      console.error('Error fetching books:', err);
      res.status(500).send('Internal Server Error');
    });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
