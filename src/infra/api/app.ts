import express, { Express, NextFunction, Request, Response, Router } from 'express';
import logger from 'morgan';
import { Config } from '../config';

export class App {
  private app: Express;

  constructor(routers: Router[]) {
    this.app = express();
    this.app.use(logger(Config.ENV === 'production' ? 'combined' : 'dev'));
    this.app.use(express.json());
    this.app.use(...routers);
    this.app.get('/', (req, res) => {
      res.send('Golden Raspberry Awards RESTful API!');
    });
    this.app.use(this.notFoundHandler);
    this.app.use(this.errorHandler);
  }

  private notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
      message: 'Not Found',
      statusCode: 404,
    });
  }

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      statusCode: 500,
    });
  }

  getApp(): Express {
    return this.app;
  }
}
