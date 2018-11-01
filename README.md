# GoGame

This project is an online Go game using NodeJS and socket.io to handle sockets.

In the application, you are able to create different rooms containing a Go board and a chat. In a room, two players can enjoy the game, as well as spectators who can watch it. Everyone can use the chat to communicate.

## Functionalities
- [x] Creation of rooms
- [x] Each room has an URL
- [x] Can join different rooms at the same time
- [x] Chat in each room
- [x] User nicknames generated (Player1, Player2, Spec1, ...)
- [ ] Go game
  - [x] Board and stones
  - [ ] Rules implementation
  - [ ] Scores display
  - [ ] Start and end of the game handling


## Installation

You need `npm` and `node` to install and use the application.

1. Clone the repository: `git clone https://github.com/bappun/gogame.git`
2. Navigate to the folder: `cd gogame`
3. Install dependencies: `npm install`
4. Run the app: `npm run app`
5. Go to `localhost:3000` in a browser

Tested and working on `npm 6.4.1` and `node 10.12.0`
