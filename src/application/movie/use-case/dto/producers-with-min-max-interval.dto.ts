export interface ProducersWithInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducersWithMinMaxIntervalDTO {
  max: ProducersWithInterval[];
  min: ProducersWithInterval[];
}
