import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import { Book } from './db/pg/Book';
import { BookDb } from './db/BookDb';
import { Author } from './db/pg/Author';
import { AuthorDb } from './db/AuthorDb';
import { PublisherDb } from './db/PublisherDb';
import { Publisher } from './db/pg/Publisher';
import { GenreDb } from './db/GenreDb';
import { Genre } from './db/pg/Genre';
import { Console } from 'console';


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

const book: BookDb = new Book(pool);
const author: AuthorDb = new Author(pool);
const publisher: PublisherDb = new Publisher(pool);
const genre: GenreDb = new Genre(pool);


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
  book.getAllBooksInformation()
    .then(books => {
      console.log('Books fetched successfully:', books);
      res.render('index.ejs', { books, title: 'Book List' });
    })
    .catch(err => {
      console.error('Error fetching books:', err);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/books', async (req, res) => {
  const { title, publicationDate, ISBN, feedback } = req.body;
  const bookData = { title, publicationDate, ISBN, feedback };
  const authors = req.body.authors.split(',').map(name => ({ name: name.trim() }));
  const genres = req.body.genres.split(',').map(name => ({ name: name.trim() }));
  const publishers = req.body.publishers.split(',').map(name => ({ name: name.trim() }));

  let newBook;
  let formError = '';

  try {
    newBook = await book.addBook(bookData);
    console.log("New book added:", newBook);
    // Add authors to the book
    for (const a of authors) {
      const authorFromData = await author.addAuthor(a);
      console.log("Author added:", authorFromData);
      await author.addAuthorToBook(authorFromData.authorId, newBook.bookId);
    }

    // Add genres to the book
    for (const g of genres) {
      const genreFromData = await genre.addGenre(g);
      console.log("Genre added:", genreFromData);
      await genre.addGenreToBook(genreFromData.genreId, newBook.bookId);
    }

    // Add publishers to the book
    for (const p of publishers) {
      const publisherFromData = await publisher.addPublisher(p);
      console.log("Publisher added:", publisherFromData);
      await publisher.addPublisherToBook(publisherFromData.publisherId, newBook.bookId);
    }

    // Book added successfully so redirect to main page
    console.log('Book added successfully');
    res.redirect('/');
  } catch (error: any) {
    console.error('Error adding book data:', error);
    formError = error.message || 'Error adding book data';
    const books = await book.getAllBooksInformation();
    res.render('index.ejs', { books, title: 'Book List', formError, showModal: true});
  }
});

app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  console.log(`Received request to delete book with ID: ${bookId}`);
  try {
    //Remove junction table entries to avoid FK constraint error (publisher_book, genre_book, author_book)
    await publisher.removePublishersFromBook(bookId);
    await genre.removeGenresFromBook(bookId);
    await author.removeAuthorsFromBook(bookId);
    await book.deleteBookById(bookId);
    
    console.log(`Book with ID ${bookId} deleted successfully`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting book with ID ${bookId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
