import { AuthorDto } from "./models/AuthorDto";

export interface AuthorDb {
  getAuthorById(id: number): Promise<AuthorDto | null>;
  getAllAuthors(): Promise<AuthorDto[]>;
  getAuthorByName(name: string): Promise<AuthorDto | null>;
  addAuthor(author: AuthorDto): Promise<AuthorDto>;
  addAuthorToBook(authorId: number, bookId: number): Promise<void>;
  deleteAuthorById(id: number): Promise<void>;
  removeAuthorsFromBook(bookId: number): Promise<void>;
}
