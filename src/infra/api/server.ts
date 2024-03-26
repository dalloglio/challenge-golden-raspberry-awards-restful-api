import { Express } from 'express';

export class Server {
  static start(app: Express, port: number): Promise<void> {
    return new Promise((resolve) => {
      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        resolve();
      });
    });
  }
}
