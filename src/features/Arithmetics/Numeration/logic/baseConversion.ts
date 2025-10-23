// src/features/Arithmetics/Numeration/logic/baseConversion.ts

export type Base = 2 | 8 | 10 | 16;

const HEX_MAP = "0123456789ABCDEF";

// -- A. From base-b string to base-10 integer (polynomial expansion)
export function parseInBase(input: string, base: Base): number {
  const s = input.trim().toUpperCase();
  let value = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const digit = HEX_MAP.indexOf(ch);
    if (digit === -1 || digit >= base) {
      throw new Error(`Invalid digit '${ch}' for base ${base}`);
    }
    value = value * base + digit;
  }
  return value;
}

// -- B. From base-10 integer to base-b string (successive divisions)
export function toBaseFromDecimal(n: number, base: Base): string {
  if (n === 0) return "0";
  const digits: string[] = [];
  let x = Math.floor(Math.abs(n));
  while (x > 0) {
    const r = x % base;
    digits.push(HEX_MAP[r]);
    x = Math.floor(x / base);
  }
  const result = digits.reverse().join("");
  return n < 0 ? `-${result}` : result;
}

// -- C. Fractional part from base-10 to base-b (successive multiplications)
// limit controls the number of fractional digits
export function fractionalToBaseFromDecimal(frac: number, base: Base, limit = 16): string {
  if (frac <= 0) return "";
  let f = frac;
  const out: string[] = [];
  for (let i = 0; i < limit && f > 0; i++) {
    f *= base;
    const digit = Math.floor(f);
    out.push(HEX_MAP[digit]);
    f -= digit;
  }
  return out.join("");
}

// -- D. Bit grouping: binary <-> octal/hex (powers of two relationships)
export function binToOct(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 3) * 3, "0");
  let out = "";
  for (let i = 0; i < padded.length; i += 3) {
    const chunk = padded.slice(i, i + 3);
    out += parseInt(chunk, 2).toString(8);
  }
  return out.replace(/^0+(?=\d)/, "");
}

export function binToHex(bin: string): string {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  let out = "";
  for (let i = 0; i < padded.length; i += 4) {
    const chunk = padded.slice(i, i + 4);
    out += HEX_MAP[parseInt(chunk, 2)];
  }
  return out.replace(/^0+(?=\d)/, "");
}

export function octToBin(oct: string): string {
  let out = "";
  for (const ch of oct) {
    const v = parseInt(ch, 8);
    out += v.toString(2).padStart(3, "0");
  }
  return out.replace(/^0+(?=\d)/, "") || "0";
}

export function hexToBin(hex: string): string {
  let out = "";
  for (const chRaw of hex) {
    const ch = chRaw.toUpperCase();
    const v = HEX_MAP.indexOf(ch);
    if (v < 0) throw new Error(`Invalid hex digit '${chRaw}'`);
    out += v.toString(2).padStart(4, "0");
  }
  return out.replace(/^0+(?=\d)/, "") || "0";
}
