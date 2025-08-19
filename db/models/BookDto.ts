import { AuthorDto } from "./AuthorDto";
import { GenreDto } from "./GenreDto";
import { PublisherDto } from "./PublisherDto";

export type BookDto = {
  // data contract
  bookId: number;
  title: string;
  publicationDate: Date;
  ISBN: string;
  feedback: string;
  authors?: AuthorDto[];
  genres?: GenreDto[];
  publisher?: PublisherDto;
  coverImageUrl?: string; // Optional field for cover image URL
};