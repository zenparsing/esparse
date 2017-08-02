import { IDENTIFIER, WHITESPACE } from './UnicodeData.js';

function binarySearch(table, val) {
  let right = (table.length / 3) - 1;
  let left = 0;
  let mid = 0;
  let test = 0;
  let offset = 0;

  while (left <= right) {
    mid = (left + right) >> 1;
    offset = mid * 3;
    test = table[offset];

    if (val < test) {
      right = mid - 1;
    } else if (val === test || val <= test + table[offset + 1]) {
      return table[offset + 2];
    } else {
      left = mid + 1;
    }
  }

  return 0;
}

export function isIdentifierStart(code) {
  return binarySearch(IDENTIFIER, code) === 2;
}

export function isIdentifierPart(code) {
  return binarySearch(IDENTIFIER, code) >= 2;
}

export function isWhitespace(code) {
  return binarySearch(WHITESPACE, code) === 1;
}

export function codePointLength(code) {
  return code > 0xffff ? 2 : 1;
}

export function codePointAt(str, offset) {
  let a = str.charCodeAt(offset);

  if (a >= 0xd800 && a <= 0xdbff && str.length > offset + 1) {
    let b = str.charCodeAt(offset + 1);
    if (b >= 0xdc00 && b <= 0xdfff)
      return (a - 0xd800) * 0x400 + b - 0xdc00 + 0x10000;
  }

  return a;
}

export function codePointString(code) {
  if (code > 0x10ffff)
    return '';

  if (code <= 0xffff)
    return String.fromCharCode(code);

  // If value is greater than 0xffff, then it must be encoded
  // as 2 UTF-16 code units in a surrogate pair.

  code -= 0x10000;

  return String.fromCharCode(
    (code >> 10) + 0xd800,
    (code % 0x400) + 0xdc00
  );
}
