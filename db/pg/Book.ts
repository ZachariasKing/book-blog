import { Pool, QueryResult } from 'pg';
import { BookDto } from '../models/BookDto';
import { AuthorDto } from '../models/AuthorDto';

/**
 * Book class to handle book-related database operations.
 */

export class Book {
  private pool: Pool; // Connection pool for PostgreSQL

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Method to get all books from the database
  public async getAllBooks(): Promise<BookDto[]> {
    try {
      const res = await this.pool.query('SELECT * FROM books');
      return Book.mapBookResult(res);
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Method to get books by a specific author ID
  public async getBooksByAuthorId(authorId: number): Promise<BookDto[]> {
    try {
      const res = await this.pool.query('SELECT * FROM books WHERE author_id = $1', [authorId]);
      return Book.mapBookResult(res);
    } catch (error) {
      console.error('Error fetching books by author ID:', error);
      throw error;
    }
  }

  // Method to get a book by its ID
  public async getBookById(bookId: number): Promise<BookDto | null> {
    try {
      const res = await this.pool.query('SELECT * FROM books WHERE book_id = $1', [bookId]);
      return res.rows.length > 0 ? Book.mapBookResult(res)[0] : null;
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      throw error;
    }
  }

  // Method to add a new book to the database
  public async addBook(book: BookDto): Promise<BookDto> {
    try {
      const res = await this.pool.query(
        'INSERT INTO books (title, publication_date, isbn) VALUES ($1, $2, $3) RETURNING *',
        [book.title, book.publicationDate, book.ISBN]
      );
      return Book.mapBookResult(res)[0];
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  }

  // Get all books with their authors
  // This method retrieves all books along with their associated authors.
  // It uses a JOIN query to combine data from the books and authors tables.
  public async getAllBooksWithAuthors(): Promise<BookDto[]> {
  const res = await this.pool.query(
    `SELECT 
        b.id AS book_id, 
        b.title, 
        b.publication_date, 
        b.isbn,
        b.feedback,
        a.id AS author_id, 
        a.name
     FROM book b
     JOIN author_book ab ON b.id = ab.book_id
     JOIN author a ON ab.author_id = a.id`
  );

  // Group authors by book
  const booksMap = new Map<number, BookDto>();
  for (const row of res.rows) {
    if (!booksMap.has(row.book_id)) {
      booksMap.set(row.book_id, 
        {
        bookId: row.book_id,
        title: row.title,
        publicationDate: row.publication_date,
        ISBN: row.isbn,
        feedback: row.feedback,
        authors: []
      });
    }
    booksMap.get(row.book_id)!.authors.push({
      authorId: row.author_id,
      name: row.name
    } as AuthorDto);
  }
  return Array.from(booksMap.values());
}

// Method to update the title of books by their IDs
public async deleteBookById(id: number): Promise<void> {
  try {
    await this.pool.query('DELETE FROM books WHERE book_id = $1', [id]);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}

  private static mapBookResult = (
    res: QueryResult): BookDto[] => // projection
    res.rows.map((r) => ({
      bookId: r.book_id,
      title: r.title,
      publicationDate: r.publication_date,
      ISBN: r.isbn,
      feedback: r.feedback
    }));


}
