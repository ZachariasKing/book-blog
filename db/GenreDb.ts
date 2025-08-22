import { GenreDto } from "./models/GenreDto";

export interface GenreDb {
    
    getGenreById(id: number): Promise<GenreDto | null>;
    getGenreByName(name: string): Promise<GenreDto | null>;
    getAllGenres(): Promise<GenreDto[]>;
    getGenresByBookId(bookId: number): Promise<GenreDto[]>;
    addGenre(genre: GenreDto): Promise<GenreDto>;
    addGenreToBook(genreId: number, bookId: number): Promise<void>;
    deleteGenreById(id: number): Promise<void>;
    removeGenresFromBook(bookId: number): Promise<void>;

}