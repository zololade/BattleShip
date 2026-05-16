export class Ship {
  public length: number;
  public damage = 0;
  public coordinate: [number, number][] = [];

  constructor(len: number) {
    this.length = len;
  }

  public hit() {
    if (this.isSunk) return;
    this.damage++;
  }

  get isSunk() {
    return this.damage === this.length;
  }
}
