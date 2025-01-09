export class Stake {
  private _pointsPerSecond: number;
  private _startTime: number;

  constructor(startTime: number, minerPoints: number) {
    this._pointsPerSecond = Math.floor(minerPoints / 3600);
    this._startTime = Math.floor(startTime / 1000.0);
  }

  public pointsPerSecond(): string {
    const currentTime = Math.floor(Date.now() / 1000.0);

    const elapsedTime = currentTime - Math.floor(this._startTime - 1);
    const totalPoints = Math.floor(elapsedTime * this._pointsPerSecond);
    const time = `${this._startTime}-${currentTime}`;
    return time;
  }
}
