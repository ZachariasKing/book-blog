import { Pool, QueryResult } from "pg";
import { GenreDto } from "../models/GenreDto";

/**
 * Genre class to handle genre-related database operations.
 */
export class Genre {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getGenreById(id: number): Promise<GenreDto | null> {
    const result: QueryResult<GenreDto> = await this.pool.query(
      "SELECT * FROM genre WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async getGenresByBookId(bookId: number): Promise<GenreDto[]> {
    const result: QueryResult<GenreDto> = await this.pool.query(
      "SELECT g.* FROM genre g JOIN genre_book bg ON g.id = bg.genre_id WHERE bg.book_id = $1",
      [bookId]
    );
    return result.rows;
  }

  async getGenreByName(name: string): Promise<GenreDto | null> {
    const result: QueryResult<GenreDto> = await this.pool.query(
      "SELECT * FROM genre WHERE name = $1",
      [name]
    );
    return result.rows[0] || null;
  }

  async getAllGenres(): Promise<GenreDto[]> {
    const result: QueryResult<GenreDto> = await this.pool.query(
      "SELECT * FROM genre"
    );
    return result.rows;
  }

  async addGenre(genre: GenreDto): Promise<GenreDto> {
    // Check if the genre already exists
    const existing = await this.getGenreByName(genre.name);
    if (existing) {
      return existing;
    }
    const result: QueryResult<GenreDto> = await this.pool.query(
      "INSERT INTO genre (name) VALUES ($1) RETURNING *",
      [genre.name]
    );
    return Genre.mapGenreResult(result)[0];
  }

  public async addGenreToBook(genreId: number, bookId: number): Promise<void> {
    await this.pool.query(
      "INSERT INTO genre_book (genre_id, book_id) VALUES ($1, $2)",
      [genreId, bookId]
    );
  }

  async deleteGenreById(id: number): Promise<void> {
    await this.pool.query("DELETE FROM genre WHERE id = $1", [id]);
  }

  private static mapGenreResult = (
    res: QueryResult
  ): GenreDto[] => // projection
    res.rows.map((r) => ({
      genreId: r.id,
      name: r.name,
    }));


}
