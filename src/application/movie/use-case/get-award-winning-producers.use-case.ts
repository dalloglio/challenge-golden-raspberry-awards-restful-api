import { IMovieRepository, Movie } from '../../../domain';
import {
  ProducersWithInterval,
  ProducersWithMinMaxIntervalDTO,
} from './dto/producers-with-min-max-interval.dto';

export class GetAwardWinningProducersUseCase {
  constructor(private movieRepository: IMovieRepository) {}

  async execute(): Promise<ProducersWithMinMaxIntervalDTO> {
    const movies = await this.movieRepository.findAwardWinningProducers();

    if (movies.length === 0) {
      return { min: [], max: [] };
    }

    const producers = this.buildProducerAwards(movies);
    const longestIntervals = this.calculateIntervals(producers, 'max');
    const shortestIntervals = this.calculateIntervals(producers, 'min');
    const max = this.findInterval(longestIntervals, 'max');
    const min = this.findInterval(shortestIntervals, 'min');
    return { min, max };
  }

  private buildProducerAwards(movies: Movie[]): Map<string, number[]> {
    const producerAwards = new Map<string, number[]>();

    movies.forEach((movie) => {
      movie.producers.forEach((producer) => {
        const producerName = producer.name;
        const awards = producerAwards.get(producerName) || [];
        awards.push(movie.year);
        producerAwards.set(producerName, awards);
      });
    });

    return producerAwards;
  }

  private calculateIntervals(
    producerAwards: Map<string, number[]>,
    minOrMax: 'min' | 'max'
  ): ProducersWithInterval[] {
    const producers: ProducersWithInterval[] = [];

    Array.from(producerAwards.entries()).forEach(([producer, years]) => {
      const intervalYears = this.calculateIntervalYears(years);
      const interval = Math[minOrMax](...intervalYears);
      intervalYears.forEach((intervalYear, index) => {
        if (intervalYear === interval) {
          producers.push({
            producer,
            interval,
            previousWin: years[index],
            followingWin: years[index + 1],
          });
        }
      });
    });

    return producers;
  }

  private calculateIntervalYears(years: number[]): number[] {
    return years
      .sort((a, b) => a - b)
      .slice(1)
      .map((year, index) => year - years[index]);
  }

  private findInterval(
    producersWithIntervals: ProducersWithInterval[],
    minOrMax: 'min' | 'max'
  ): ProducersWithInterval[] {
    const _interval = Math[minOrMax](...producersWithIntervals.map(({ interval }) => interval));
    return producersWithIntervals.filter(({ interval }) => interval === _interval);
  }
}
