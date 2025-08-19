import { Pool, QueryResult } from "pg";
import { PublisherDto } from "../models/PublisherDto";

/**
 * Publisher class to handle publisher-related database operations.
 */

export class Publisher {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getPublisherById(id: number): Promise<PublisherDto | null> {
    const result: QueryResult<PublisherDto> = await this.pool.query(
      "SELECT * FROM publishers WHERE id = $1",
      [id]
    );
    return Publisher.mapPublisherResult(result)[0] || null;
  }

  async getPublisherByName(name: string): Promise<PublisherDto | null> {
    const result: QueryResult<PublisherDto> = await this.pool.query(
      "SELECT * FROM publisher WHERE name = $1",
      [name]
    );
    return Publisher.mapPublisherResult(result)[0] || null;
  }

  async getAllPublishers(): Promise<PublisherDto[]> {
    const result: QueryResult<PublisherDto> = await this.pool.query(
      "SELECT * FROM publisher"
    );
    return Publisher.mapPublisherResult(result);
  }

  async addPublisher(publisher: PublisherDto): Promise<PublisherDto> {
    //Check for existing Publisher first
    const existing = await this.getPublisherByName(publisher.name);
    if (existing) {
      return existing;
    }
    const result: QueryResult<PublisherDto> = await this.pool.query(
      "INSERT INTO publisher (name) VALUES ($1) RETURNING *",
      [publisher.name]
    );
    return Publisher.mapPublisherResult(result)[0] as PublisherDto;
  }

  async addPublisherToBook(publisherId: number, bookId: number): Promise<void> {
    await this.pool.query(
      "INSERT INTO publisher_book (publisher_id, book_id) VALUES ($1, $2)",
      [publisherId, bookId]
    );
  }

  async deletePublisherById(id: number): Promise<void> {
    await this.pool.query("DELETE FROM publisher WHERE id = $1", [id]);
  }

  async getPublishersByBookId(bookId: number): Promise<PublisherDto[]> {
    const result: QueryResult<PublisherDto> = await this.pool.query(
      "SELECT p.* FROM publisher p JOIN publisher_book bp ON p.id = bp.publisher_id WHERE bp.book_id = $1",
      [bookId]
    );
    return Publisher.mapPublisherResult(result);
  }

  private static mapPublisherResult = (
    res: QueryResult
  ): PublisherDto[] => // projection
    res.rows.map((r) => ({
      publisherId: r.id,
      name: r.name
    }));
}
