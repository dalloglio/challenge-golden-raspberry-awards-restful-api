import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { Movie, MovieFactory, ProducerFactory } from '../../../domain';

export class SQLiteBootstrap {
  constructor(private db: sqlite3.Database) {}

  async init(): Promise<void> {
    try {
      await this.createMoviesTable();
      await this.createProducersTable();
      await this.insertInitialData();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async createMoviesTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE movies (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          year INTEGER NOT NULL,
          winner INTEGER NOT NULL
        );
      `;

      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating movies table:', err);
          return reject(err);
        }
        console.log('Movies table created.');
        resolve();
      });
    });
  }

  private async createProducersTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE producers (
          id TEXT PRIMARY KEY,
          movie_id TEXT NOT NULL,
          name TEXT NOT NULL,
          FOREIGN KEY (movie_id) REFERENCES movies(id)
        );
      `;

      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating producers table:', err);
          return reject(err);
        }
        console.log('Producers table created.');
        resolve();
      });
    });
  }

  private async insertInitialData(): Promise<void> {
    return new Promise((resolve) => {
      const movies: Movie[] = [];

      const csvFilePath = path.join(__dirname, '..', '..', '..', '..', 'movies.csv');

      console.log('Reading CSV file data...');
      console.log('CSV file path:', csvFilePath);

      fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const movie = MovieFactory.create(row.title, Number(row.year), Boolean(row.winner));

          row.producers.split(',').forEach((producer: string) => {
            producer
              .trim()
              .split(' and ')
              .forEach((name: string) => {
                movie.addProducer(ProducerFactory.create(name.trim()));
              });
          });

          movies.push(movie);
        })
        .on('end', async () => {
          console.log('CSV file data parsed successfully.');

          const moviesQuery = 'INSERT INTO movies (id, title, year, winner) VALUES ';
          const moviesQueryValues: string[] = [];
          const moviesQueryParams: any[] = [];

          const producersQuery = 'INSERT INTO producers (id, movie_id, name) VALUES ';
          const producersQueryValues: string[] = [];
          const producersQueryParams: any[] = [];

          movies.forEach((movie) => {
            moviesQueryValues.push('(?, ?, ?, ?)');
            moviesQueryParams.push(movie.id, movie.title, movie.year, movie.winner);
            movie.producers.forEach((producer) => {
              producersQueryValues.push('(?, ?, ?)');
              producersQueryParams.push(producer.id, movie.id, producer.name);
            });
          });

          const stmtMovies = this.db.prepare(moviesQuery + moviesQueryValues.join(', '));
          stmtMovies.run(...moviesQueryParams);
          stmtMovies.finalize();

          const stmtProducers = this.db.prepare(producersQuery + producersQueryValues.join(', '));
          stmtProducers.run(...producersQueryParams);
          stmtProducers.finalize();

          resolve();
        });
    });
  }
}
