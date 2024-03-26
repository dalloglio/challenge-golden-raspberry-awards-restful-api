import sqlite3 from 'sqlite3';

export class SQLiteConnection {
  private static instance: SQLiteConnection;
  private db: sqlite3.Database;

  private constructor() {
    this.db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        throw err;
      }
      console.log('Connected to the database.');
    });
  }

  public static getInstance(): SQLiteConnection {
    if (!SQLiteConnection.instance) {
      SQLiteConnection.instance = new SQLiteConnection();
    }
    return SQLiteConnection.instance;
  }

  public getDb(): sqlite3.Database {
    return this.db;
  }
}
