import { randomUUID } from 'node:crypto';
import { Producer } from '../entity/producer';

export class ProducerFactory {
  static create(name: string): Producer {
    return new Producer(randomUUID(), name);
  }
}
