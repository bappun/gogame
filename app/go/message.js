class Message {
  constructor(sender, body) {
    this._sender = sender;
    this._body = body;
    this._time = new Date();

    let hours = this._time.getHours();
    if (hours < 10) hours = "0" + hours;
    let minutes = this._time.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    this._formattedTime = hours + ":" + minutes;
  }

  get sender() {
    return this._sender;
  }
  set sender(sender) {
    this._sender = sender;
  }

  get body() {
    return this._body;
  }
  set name(body) {
    this._body = body;
  }

  get time() {
    return this._time;
  }
  get formattedTime() {
    return this._formattedTime;
  }
}

module.exports = Message;
