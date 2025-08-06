import { AuthorDto } from "./AuthorDto";
import { GenreDto } from "./GenreDto";
import { PublisherDto } from "./PublisherDto";

export type BookDto = {
  // data contract
  bookId: number;
  title: string;
  publicationDate: Date;
  ISBN: string;
  authors?: AuthorDto[];
  genres?: GenreDto[];
  publisher?: PublisherDto;
};