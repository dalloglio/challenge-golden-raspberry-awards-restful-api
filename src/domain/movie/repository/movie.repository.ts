import { Movie } from "../entity/movie";

export interface IMovieRepository {
  findAwardWinningProducers(): Promise<Movie[]>;
}
