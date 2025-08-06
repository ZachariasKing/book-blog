import { BookDto } from './models/BookDto';
 
export interface BookDb {
//   // external interface
//   findBookByYearAndAuthorName(year: number, authorName: string): Promise<BookDto[]>;

//   updateTitleByIds(title: string, ids: number[]): Promise<number>;

//   findByTitle(title: string): Promise<BookDto[]>;

  getAllBooksWithAuthors(): Promise<BookDto[]>;

  addBook(book: BookDto): Promise<BookDto>;

  deleteBookById(id: number): Promise<void>;
}