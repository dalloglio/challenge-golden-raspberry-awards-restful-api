import express from 'express';
import { GetAwardWinningProducersUseCase } from '../../../application';
import { SQLiteConnection } from '../../database';
import { SQLiteMovieRepository } from '../../repositories';
import { MoviesController } from '../controllers';

const db = SQLiteConnection.getInstance().getDb();
const movieRepository = new SQLiteMovieRepository(db);
const getAwardWinningProducersUseCase = new GetAwardWinningProducersUseCase(movieRepository);
const moviesController = new MoviesController(getAwardWinningProducersUseCase);

export const moviesRoute = express.Router();

moviesRoute.get(
  '/movies/producers',
  moviesController.getAwardWinningProducers.bind(moviesController)
);
