import { randomUUID } from 'node:crypto';
import { Movie } from '../entity/movie';

export class MovieFactory {
  static create(title: string, year: number, winner: boolean): Movie {
    return new Movie(randomUUID(), title, year, winner);
  }
}
