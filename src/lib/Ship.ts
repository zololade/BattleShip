export class Ship {
  public length: number;
  public damage: number = 0;
  public sunk: boolean = false;

  constructor(len: number) {
    this.length = len;
  }

  public hit() {
    if (!this.isSunk()) {
      this.damage++;
      this.sunk = this.damage === this.length;
      return;
    }
  }

  public isSunk() {
    return this.damage === this.length;
  }
}
