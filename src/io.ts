module Rimu {

  export class Reader {
    lines: string[];
    pos: number;      // line index of current line.

    constructor(text: string) {
      // Split lines on newline boundaries and trim trailing white space.
      // http://stackoverflow.com/questions/1155678/javascript-string-newline-character
      // TODO split is broken on IE8 e.g. 'X\n\nX'.split(/\n/g).length) returns 2 but should return 3.
      var lines = text.split(/\r\n|\r|\n/g);
      for (var i in lines) {
        lines[i] = lines[i].replace(/\s+$/, '');
      }
      this.lines = lines;
      this.pos = 0;
    }

    // Getter/setter for current line, return null if EOF.
    cursor(value: string = null): string {
      if (this.eof()) return null;
      if (value !== null) {
        this.lines[this.pos] = value;
      }
      return this.lines[this.pos];
    }

    eof(): boolean {
      return this.pos >= this.lines.length;
    }

    // Read the next line, return null if EOF.
    next(): string {
      if (this.eof()) return null;
      this.pos++;
      if (this.eof()) return null;
      return this.lines[this.pos];
    }

    // Read to the first line matching the re.
    // Return the array of lines preceding the match plus a line containing
    // the $1 match group (if it exists).
    // Return null if an EOF is encountered.
    // Exit with the reader pointing to the line following the match.
    readTo(find: RegExp): string[] {
      var result = [];
      var match: string[];
      while (!this.eof()) {
        match = this.cursor().match(find);
        if (match) {
          if (match.length > 1) {
            result.push(match[1]);  // $1
          }
          this.next();
          break;
        }
        result.push(this.cursor());
        this.next();
      }
      // Blank line matches EOF.
      if (match || find.toString() === '/^$/' && this.eof()) {
        return result;
      }
      else {
        return null;
      }
    }

    skipBlankLines(): void {
      while (this.cursor() === '') {
        this.next();
      }
    }

  }

  export class Writer {
    buffer: string[]; // Appending an array is faster than string concatenation.

    constructor() {
      this.buffer = [];
    }

    write(s: string) {
      this.buffer.push(s);
    }

    toString(): string {
      return this.buffer.join('');
    }

  }

  // CommonJS module exports.
  declare var exports: any;
  if (typeof exports !== 'undefined') {
    exports.Reader = Rimu.Reader;
    exports.Writer = Rimu.Writer;
  }

}

