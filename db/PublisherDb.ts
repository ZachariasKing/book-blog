import { PublisherDto } from "./models/PublisherDto";

export interface PublisherDb {
    getPublisherById(id: number): Promise<PublisherDto | null>;
    getPublisherByName(name: string): Promise<PublisherDto | null>;
    getPublishersByBookId(bookId: number): Promise<PublisherDto[]>;
    getAllPublishers(): Promise<PublisherDto[]>;
    addPublisher(publisher: PublisherDto): Promise<PublisherDto>;
    addPublisherToBook(publisherId: number, bookId: number): Promise<void>;
    deletePublisherById(id: number): Promise<void>;
}