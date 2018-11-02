Cell = class Cell {
  constructor(x, y, board) {
    this.board = board;
    this.locked = false;
    [this.x, this.y] = [x, y];
    this.stone = false;
    this.$el = this.board.$el.find(`[data-x=${x}][data-y=${y}]`);
    this.dead = false;
  }

  state() {
    if (this.isEmpty()) {
      return 0;
    }
    if (this.isBlack()) {
      return 1;
    }
    if (this.isWhite()) {
      return 2;
    }
  }

  isEmpty() {
    return !this.stone;
  }

  isWhite() {
    var ref;
    return ((ref = this.stone) != null ? ref.color : void 0) === 'white';
  }

  isBlack() {
    var ref;
    return ((ref = this.stone) != null ? ref.color : void 0) === 'black';
  }

  isAlive() {
    return !this.dead;
  }

  color(c = false) {
    var ref, ref1;
    if (c) {
      return ((ref = this.stone) != null ? ref.color : void 0) === c;
    } else {
      return ((ref1 = this.stone) != null ? ref1.color : void 0) || 'empty';
    }
  }

  oppositeColor() {
    if (!'stone') {
      return 'empty';
    }
    if (this.stone.color === 'black') {
      return 'white';
    } else {
      return 'black';
    }
  }

  addStone(stone) {
    if (!(this.groupLiberties(stone.color).length > 0)) {
      return false;
    }
    this.stone = stone;
    this.$el.data('stone', this.stone);
    return this.$el.addClass(this.stone.color);
  }

  captureStone() {
    return this.removeStone();
  }

  removeStone() {
    var c;
    if (!this.stone) {
      return;
    }
    c = this.color();
    this.stone = false;
    this.$el.data('stone', this.stone);
    return this.$el.removeClass(c);
  }

  neighbors() {
    var cell, i, len, ref, results;
    ref = this.neighborCells();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell !== void 0) {
        results.push(cell);
      }
    }
    return results;
  }

  neighborCells() {
    var ref, ref1, ref2, ref3;
    return [(ref = this.board.cells[this.x - 1]) != null ? ref[this.y] : void 0, (ref1 = this.board.cells[this.x]) != null ? ref1[this.y + 1] : void 0, (ref2 = this.board.cells[this.x + 1]) != null ? ref2[this.y] : void 0, (ref3 = this.board.cells[this.x]) != null ? ref3[this.y - 1] : void 0];
  }

  liberties(locked_flag = false) {
    var cell, i, len, ref, results;
    ref = this.neighbors();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.isEmpty() && cell.isLocked() === locked_flag) {
        results.push(cell);
      }
    }
    return results;
  }

  lockLiberties() {
    var cell, i, len, ref, results;
    ref = this.liberties();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      results.push(cell.lock());
    }
    return results;
  }

  unLockLiberties() {
    var cell, i, len, ref, results;
    ref = this.liberties(true);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      results.push(cell.unLock());
    }
    return results;
  }

  opponentGroupCaptures(color) {
    var captures, cell, i, l, len, ref;
    captures = [];
    ref = this.neighbors();
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (!(!cell.isEmpty() && cell.color() !== color)) {
        continue;
      }
      this.lock();
      l = cell.groupLiberties().length;
      cell.groupUnlock();
      if (l === 0) {
        captures = captures.concat(cell.captureGroup());
      }
      this.unLock();
    }
    return captures;
  }

  captureGroup() {
    var captures, cell, color, i, len, ref;
    captures = [this.stone];
    color = this.color();
    this.captureStone();
    ref = this.neighbors();
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.color(color)) {
        captures = captures.concat(cell.captureGroup());
      }
    }
    return captures;
  }

  markAlive() {
    var cell, i, len, ref, results;
    if (this.isEmpty()) {
      return;
    }
    this.dead = false;
    this.$el.removeClass('dead');
    ref = this.neighbors();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.color(this.color()) && cell.dead) {
        results.push(cell.markAlive());
      }
    }
    return results;
  }

  markDead() {
    var cell, i, len, ref, results;
    if (this.isEmpty()) {
      return;
    }
    this.dead = true;
    this.$el.addClass('dead');
    ref = this.neighbors();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.color(this.color()) && !cell.dead) {
        results.push(cell.markDead());
      }
    }
    return results;
  }

  groupLiberties(color = this.color()) {
    var cell, i, l, len, ref;
    if (this.isLocked()) {
      return [];
    }
    this.lock();
    l = this.liberties();
    this.lockLiberties();
    ref = this.neighbors();
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.color(color) && cell.isUnlocked()) {
        l = l.concat(cell.groupLiberties(color));
      }
    }
    if (this.isEmpty()) {
      this.groupUnlock(color);
    }
    return l;
  }

  groupUnlock(color = this.color()) {
    var cell, i, len, ref, results;
    this.unLock();
    this.unLockLiberties();
    ref = this.neighbors();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      if (cell.color(color) && cell.isLocked()) {
        results.push(cell.groupUnlock(color));
      }
    }
    return results;
  }

  lock() {
    return this.locked = true;
  }

  unLock() {
    return this.locked = false;
  }

  isLocked() {
    return this.locked;
  }

  isUnlocked() {
    return !this.locked;
  }

};