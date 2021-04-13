class Rotor {
  private static alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  private wiring: string[] = null;
  private position: number = 0;

  constructor(wiring) {
    if (!Array.isArray(wiring)) {
      wiring = wiring.split("");
    }

    this.wiring = wiring;
  }

  map(chr) {
    var c: string = this.wiring[]
  }
}
