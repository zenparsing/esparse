// Performs a binary search on an array
function binarySearch(array, val) {
  let right = array.length - 1;
  let left = 0;

  while (left <= right) {
    let mid = (left + right) >> 1;
    let test = array[mid];

    if (val === test)
      return mid;

    if (val < test) right = mid - 1;
    else left = mid + 1;
  }

  return left;
}

export class LineMap {

  constructor() {
    this.lines = [-1];
    this.lastLineBreak = -1;
  }

  addBreak(offset) {
    if (offset > this.lastLineBreak)
      this.lines.push(this.lastLineBreak = offset);
  }

  locate(offset) {
    let line = binarySearch(this.lines, offset);
    let pos = this.lines[line - 1];
    let column = offset - pos;

    return {
      line,
      column,
      offset,
      lineOffset: pos + 1,
    };
  }

}
