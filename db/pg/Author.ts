import { Pool, QueryResult } from 'pg';
import { AuthorDto } from '../models/AuthorDto';


/**
 * Author class to handle author-related database operations.
 */
export class Author {
    private pool: Pool; // Connection pool for PostgreSQL

    constructor(pool: Pool) {
        this.pool = pool;
    }

    public async getAuthorById(id: number): Promise<AuthorDto | null>{
        const res = await this.pool.query('SELECT * FROM author WHERE id = $1', [id]);
        return res.rows.length > 0 ? res.rows[0] as AuthorDto : null;
    }

    public async getAllAuthors(): Promise<AuthorDto[]> {
        const res = await this.pool.query('SELECT * FROM author');
        return res.rows.map(row => row as AuthorDto);
    }

    public async getAuthorByName(name: string): Promise<AuthorDto | null> {
        const res = await this.pool.query(
            'SELECT * FROM author WHERE name = $1',
            [name]
        );
        return res.rows.length > 0 ? Author.mapAuthorResult(res)[0] as AuthorDto : null;
    }

    public async addAuthor(author: AuthorDto): Promise<AuthorDto> {
        // Use the reusable method to check if author exists
        const existing = await this.getAuthorByName(author.name);
        if (existing) {
            return existing;
        }
        const res = await this.pool.query(
            'INSERT INTO author (name) VALUES ($1) RETURNING *',
            [author.name]
        );
        return Author.mapAuthorResult(res)[0] as AuthorDto;
    }

    public async addAuthorToBook(authorId: number, bookId: number): Promise<void> {
        await this.pool.query(
            'INSERT INTO author_book (author_id, book_id) VALUES ($1, $2)',
            [authorId, bookId]
        );
    }

    public async deleteAuthorById(id: number): Promise<void> {
        await this.pool.query('DELETE FROM author WHERE id = $1', [id]);
    }

      private static mapAuthorResult = (
        res: QueryResult): AuthorDto[] => // projection
        res.rows.map((r) => ({
          authorId: r.id,
          name: r.name,
          penName: r.pen_name,
          statusId: r.status_id
        }));

}
