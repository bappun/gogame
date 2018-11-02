class Player {
    constructor(username) {
        this._username = username;
        this._capturedStones = 0;
    }

    addCapturedStones(n) {
        return this._capturedStones += n;
    }

    get username() {
        return this._username;
    }

    set username(username) {
        this._username = username;
    }

    get capturedStones() {
        return this._capturedStones;
    }

    set capturedStones(n) {
        this._capturedStones = n;
    }
}

module.exports = Player;
