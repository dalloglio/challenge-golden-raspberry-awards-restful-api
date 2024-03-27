import { IMovieRepository, MovieFactory, ProducerFactory } from '../../../domain';
import { GetAwardWinningProducersUseCase } from './get-award-winning-producers.use-case';

const producerA = ProducerFactory.create('Producer A');
const producerB = ProducerFactory.create('Producer B');
const producerC = ProducerFactory.create('Producer C');
const producerD = ProducerFactory.create('Producer D');

const repository = jest.mocked<IMovieRepository>({
  findAwardWinningProducers: jest.fn().mockResolvedValue([]),
});

describe('Get Award-Winning Producers Use Case', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if there are no award-winning producers', async () => {
    const useCase = new GetAwardWinningProducersUseCase(repository);
    const result = await useCase.execute();

    expect(repository.findAwardWinningProducers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ max: [], min: [] });
  });

  it('should return the producers with the longest and shortest intevals between consecutive awards', async () => {
    repository.findAwardWinningProducers.mockResolvedValueOnce([
      MovieFactory.create('Movie 1', 1900, true).addProducer(producerA),
      MovieFactory.create('Movie 2', 1901, true).addProducer(producerB),
      MovieFactory.create('Movie 3', 1902, true).addProducer(producerB),
      MovieFactory.create('Movie 4', 1903, true).addProducer(producerC).addProducer(producerD),
      MovieFactory.create('Movie 5', 1905, true).addProducer(producerA),
    ]);

    const useCase = new GetAwardWinningProducersUseCase(repository);
    const result = await useCase.execute();

    expect(repository.findAwardWinningProducers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      max: [
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1900,
          followingWin: 1905,
        },
      ],
      min: [
        {
          producer: 'Producer B',
          interval: 1,
          previousWin: 1901,
          followingWin: 1902,
        },
      ],
    });
  });

  it('should return the producers with the same longest and shortest intevals between consecutive awards', async () => {
    repository.findAwardWinningProducers.mockResolvedValueOnce([
      MovieFactory.create('Movie 1', 1900, true).addProducer(producerA),
      MovieFactory.create('Movie 2', 1901, true).addProducer(producerB),
      MovieFactory.create('Movie 3', 1902, true).addProducer(producerC),
      MovieFactory.create('Movie 4', 1902, true).addProducer(producerD),
      MovieFactory.create('Movie 5', 1903, true).addProducer(producerC),
      MovieFactory.create('Movie 6', 1903, true).addProducer(producerD),
      MovieFactory.create('Movie 7', 1905, true).addProducer(producerA),
      MovieFactory.create('Movie 8', 1906, true).addProducer(producerB),
    ]);

    const useCase = new GetAwardWinningProducersUseCase(repository);
    const result = await useCase.execute();

    expect(repository.findAwardWinningProducers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      max: [
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1900,
          followingWin: 1905,
        },
        {
          producer: 'Producer B',
          interval: 5,
          previousWin: 1901,
          followingWin: 1906,
        },
      ],
      min: [
        {
          producer: 'Producer C',
          interval: 1,
          previousWin: 1902,
          followingWin: 1903,
        },
        {
          producer: 'Producer D',
          interval: 1,
          previousWin: 1902,
          followingWin: 1903,
        },
      ],
    });
  });

  it('should handle multiple movies with the same producer', async () => {
    repository.findAwardWinningProducers.mockResolvedValueOnce([
      MovieFactory.create('Movie 1', 1900, true).addProducer(producerA),
      MovieFactory.create('Movie 2', 1905, true).addProducer(producerA),
      MovieFactory.create('Movie 3', 1910, true).addProducer(producerA),
      MovieFactory.create('Movie 4', 1915, true).addProducer(producerA),
    ]);

    const useCase = new GetAwardWinningProducersUseCase(repository);
    const result = await useCase.execute();

    expect(repository.findAwardWinningProducers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      max: [
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1900,
          followingWin: 1905,
        },
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1905,
          followingWin: 1910,
        },
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1910,
          followingWin: 1915,
        },
      ],
      min: [
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1900,
          followingWin: 1905,
        },
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1905,
          followingWin: 1910,
        },
        {
          producer: 'Producer A',
          interval: 5,
          previousWin: 1910,
          followingWin: 1915,
        },
      ],
    });
  });

  it('should handle multiple movies with the same producer with more than one consecutive awards', async () => {
    repository.findAwardWinningProducers.mockResolvedValueOnce([
      MovieFactory.create('Movie 1', 1990, true).addProducer(producerA),
      MovieFactory.create('Movie 2', 1991, true).addProducer(producerA),
      MovieFactory.create('Movie 3', 2002, true).addProducer(producerB),
      MovieFactory.create('Movie 4', 2003, true).addProducer(producerB),
      MovieFactory.create('Movie 5', 1980, true).addProducer(producerB),
      MovieFactory.create('Movie 6', 2015, true).addProducer(producerB),
      MovieFactory.create('Movie 7', 2037, true).addProducer(producerB),
    ]);

    const useCase = new GetAwardWinningProducersUseCase(repository);
    const result = await useCase.execute();

    expect(repository.findAwardWinningProducers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      max: [
        {
          producer: 'Producer B',
          interval: 22,
          previousWin: 1980,
          followingWin: 2002,
        },
        {
          producer: 'Producer B',
          interval: 22,
          previousWin: 2015,
          followingWin: 2037,
        },
      ],
      min: [
        {
          producer: 'Producer A',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
        {
          producer: 'Producer B',
          interval: 1,
          previousWin: 2002,
          followingWin: 2003,
        },
      ],
    });
  });
});
