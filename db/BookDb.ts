import { BookDto } from './models/BookDto';
 
export interface BookDb {
// external interface

  getBookById(id: number): Promise<BookDto>;
  
  getBookByTitle(title: string): Promise<BookDto>;

  getBookByIsbn(isbn: string): Promise<BookDto>;

  getAllBooksInformation(): Promise<BookDto[]>;

  addBook(book: BookDto): Promise<BookDto>;

  deleteBookById(id: number): Promise<void>;
}