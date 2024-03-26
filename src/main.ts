import { App, Config, SQLiteBootstrap, SQLiteConnection, Server, moviesRoute } from './infra';

async function main() {
  const db = SQLiteConnection.getInstance().getDb();
  await new SQLiteBootstrap(db).init();
  const app = new App([moviesRoute]);
  await Server.start(app.getApp(), Config.PORT);
}

main();
