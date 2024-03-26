import sqlite3 from 'sqlite3';
import { IMovieRepository, Movie, Producer } from '../../../domain';

export class SQLiteMovieRepository implements IMovieRepository {
  constructor(private db: sqlite3.Database) {}

  async findAwardWinningProducers(): Promise<Movie[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          m.id AS id,
          m.title AS title,
          m.year AS year,
          m.winner AS winner,
          p.id AS producer_id,
          p.name AS producer_name
        FROM movies m
        INNER JOIN producers p ON m.id = p.movie_id
        WHERE m.winner = 1;
      `;

      this.db.all<any>(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const movies: any = {};

          rows.forEach((row) => {
            if (!movies[row.id]) {
              movies[row.id] = {
                id: row.id,
                title: row.title,
                year: row.year,
                winner: row.winner,
                producers: [],
              };
            }

            movies[row.id].producers.push({
              id: row.producer_id,
              name: row.producer_name,
            });
          });

          resolve(
            Object.values(movies).map((movie: any) => {
              const m = new Movie(movie.id, movie.title, movie.year, movie.winner);
              movie.producers.forEach((producer: any) => {
                m.addProducer(new Producer(producer.id, producer.name));
              });
              return m;
            })
          );
        }
      });
    });
  }
}
