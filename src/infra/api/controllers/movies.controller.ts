import { Request, Response } from 'express';
import { GetAwardWinningProducersUseCase } from '../../../application/movie/use-case/get-award-winning-producers.use-case';

export class MoviesController {
  constructor(private getAwardWinningProducersUseCase: GetAwardWinningProducersUseCase) {}

  async getAwardWinningProducers(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.getAwardWinningProducersUseCase.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
      });
    }
  }
}
