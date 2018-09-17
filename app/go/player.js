var Player = {

  init: function(pseudo) {
    this.pseudo: pseudo;
    this.capturedStones: 0;
  },

  get pseudo() {
    return this.pseudo;
  }

  get capturedStones() {
    return this.capturedStones;
  }

  addCapturedStones: function(nb) {
    capturedStones =+ nb;
  }

};

// tests
var player1 = Object.create(Player);
joueur1.init("Joueur 1");

var player2 = Object.create(Player);
joueur2.init("Joueur 2");
