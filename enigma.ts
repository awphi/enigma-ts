function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

class ReplacementCipher {
  protected _wiring: string[] = null;

  constructor(wiring: string) {
    this._wiring = wiring.split("");
  }

  reverse(chr: string) {
    chr = chr.toUpperCase();
    var idx: number = this._wiring.indexOf(chr);
    var c: string = ALPHABET[idx % 26];
    return c;
  }

  replace(chr: string) {
    chr = chr.toUpperCase();
    var idx: number = ALPHABET.indexOf(chr);
    var c: string = this._wiring[idx % 26];
    return c;
  }
}

class Rotor {
  private _position: string[];
  private _notch: string;
  private _wiring: ReplacementCipher;

  constructor(wiring: string, notch: string) {
    this._position = [...ALPHABET];
    this._wiring = new ReplacementCipher(wiring);
    this._notch = notch;
  }

  advancePosition() {
    var a = this._position.shift();
    this._position.push(a);
  }

  reset() {
    this._position = [...ALPHABET];
  }

  isNotched() {
    return this._position[0] == this._notch;
  }

  reverse(chr: string) {
    var idx: number = ALPHABET.indexOf(chr);
    var pos: string = this._position[idx];
    var converted: string = this._wiring.reverse(pos);
    var back: string = ALPHABET[this._position.indexOf(converted)];

    return back;
  }

  replace(chr: string) {
    var idx: number = ALPHABET.indexOf(chr);
    var pos: string = this._position[idx];
    var converted: string = this._wiring.replace(pos);
    var back: string = ALPHABET[this._position.indexOf(converted)];

    return back;
  }
}

class Enigma {
  private plugboard: ReplacementCipher = null;
  private reflector: ReplacementCipher = null;
  private rotors: Rotor[] = [];

  constructor(plugWiring: string, reflectorWiring: string, rotors: Rotor[]) {
    if (plugWiring != null) {
      this.plugboard = new ReplacementCipher(plugWiring);
    }
    this.reflector = new ReplacementCipher(reflectorWiring);
    this.rotors = rotors;
  }

  stroke(chr: string) {
    if (this.plugboard != null) {
      chr = this.plugboard.replace(chr);
    }

    var notched: boolean = false;
    for (var i = this.rotors.length - 1; i >= 0; i--) {
      if (notched || i == this.rotors.length - 1) {
        this.rotors[i].advancePosition();
      }

      chr = this.rotors[i].replace(chr);
      notched = this.rotors[i].isNotched();
    }

    chr = this.reflector.replace(chr);

    for (var i = 0; i < this.rotors.length; i++) {
      chr = this.rotors[i].reverse(chr);
    }

    if (this.plugboard != null) {
      chr = this.plugboard.replace(chr);
    }

    return chr;
  }

  process(str: string) {
    var ret = "";

    for (var i = 0; i < str.length; i++) {
      if (str[i] == " ") {
        ret += " ";
      } else {
        ret += this.stroke(str[i]);
      }
    }

    return ret;
  }

  reset() {
    for (var i = 0; i < this.rotors.length; i++) {
      this.rotors[i].reset();
    }
  }
}

const rI = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "R");
const rII = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "F");
const rIII = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "W");
const wideBReflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

// Slow -> medium -> fast rotor order
const enigma = new Enigma(null, wideBReflector, [rI, rII, rIII]);

var input = "HELLO THIS IS A SECRET ENIGMA MESSAGE";
var output = enigma.process(input);
console.log(output);
enigma.reset();
console.log(enigma.process(output));
