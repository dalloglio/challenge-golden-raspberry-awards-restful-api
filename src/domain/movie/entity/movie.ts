import { Producer } from '../../producer/entity/producer';

export class Movie {
  private _producers: Producer[];

  constructor(
    private _id: string,
    private _title: string,
    private _year: number,
    private _winner: boolean
  ) {
    this._producers = [];
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get year(): number {
    return this._year;
  }

  get winner(): boolean {
    return this._winner;
  }

  get producers(): Producer[] {
    return this._producers;
  }

  addProducer(producer: Producer): Movie {
    this._producers.push(producer);
    return this;
  }
}
