import express from 'express';
import http from 'http';
import cors from 'cors';
import redis from 'redis';
import { Server } from 'socket.io';
import { REDIS_CONFIG } from "./constants";
import { getMultiplierFromTime } from './util';

const keccak256 = require('keccak256')
const subscriber = redis.createClient(REDIS_CONFIG);
const bust_subscriber = redis.createClient(REDIS_CONFIG);
const redisClient = redis.createClient(REDIS_CONFIG);
const app = express();

let chatHistory = [];
let playersBet = [];
// map for userWallet to socketId
// {
//   <wallet>: <socketId>
// }
let userWalletMapForSocketId = {};

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Weclome to divvy</h1>');
});

const arr = [];
io.on('connection', async (socket) => {
  console.log("Connection Established", chatHistory.length);
  // arr.push(socket.id);
  // console.log(arr);

  // Get current game data when sockect is connected
  let data;
  redisClient.get("game-data", (err, reply) => {
    data = JSON.parse(reply);
    socket.emit("data", data)
  });

  // Get all chat history when socket is connected
  socket.on("get-msgs", () => {
    let arr = [ ...chatHistory ];
    socket.emit("all-msgs", arr);
  });

  // Login event handler
  socket.on("login", info => {
    if (info && info.address) {
      let userBalance = 0; // Should load from db info
      if (userWalletMapForSocketId[info.address] && userWalletMapForSocketId[info.address].gameTokenBalance) userBalance = userWalletMapForSocketId[info.address].gameTokenBalance;
      userWalletMapForSocketId[info.address] = {
        socketId: socket.id,
        gameTokenBalance: userBalance,
      };
      console.log('login', info.address, userBalance);
      socket.emit('balance', userBalance);
    }
  });
  
  // Logout event handler
  socket.on("logout", () => {
    for (const user of Object.keys(userWalletMapForSocketId)) {
      if (userWalletMapForSocketId[user].socketId == socket.id) {
        console.log('logout', user);
        userWalletMapForSocketId[user].socketId = undefined;
        socket.emit('balance', 0);
        break;
      }
    }
  });
  
  // Deposit event handler
  socket.on("deposit", amount => {
    console.log('--> received deposit', amount, socket.id);
    for (const user of Object.keys(userWalletMapForSocketId)) {
      if (userWalletMapForSocketId[user].socketId == socket.id) {
        console.log('deposit', user, amount);
        const balance = userWalletMapForSocketId[user].gameTokenBalance;
        userWalletMapForSocketId[user].gameTokenBalance = balance + parseFloat(amount);
        console.dir(userWalletMapForSocketId[user], {depth: null});
        socket.emit('balance', userWalletMapForSocketId[user].gameTokenBalance);
        break;
      }
    }
  });

  // Withdraw event handler
  socket.on("withdraw", amount => {
    console.log('--> received withdraw', amount, socket.id);
    for (const user of Object.keys(userWalletMapForSocketId)) {
      if (userWalletMapForSocketId[user].socketId == socket.id) {
        console.log('withdraw', user, amount);
        const balance = userWalletMapForSocketId[user].gameTokenBalance - parseFloat(amount);
        userWalletMapForSocketId[user].gameTokenBalance = balance < 0 ? 0 : balance;
        console.dir(userWalletMapForSocketId[user], {depth: null});
        socket.emit('balance', userWalletMapForSocketId[user].gameTokenBalance);
        break;
      }
    }
  });
  
  // Addbet event handler
  socket.on("addBet", ({bet, payout}) => {
    console.log('--> received addBet', bet, payout, socket.id);
    for (const user of Object.keys(userWalletMapForSocketId)) {
      if (userWalletMapForSocketId[user].socketId == socket.id) {
        console.log('addBet', user, bet, payout);
        const balance = userWalletMapForSocketId[user].gameTokenBalance - parseFloat(bet);
        if (balance < 0) return;
        userWalletMapForSocketId[user].gameTokenBalance = balance;
        // console.dir(userWalletMapForSocketId[user], {depth: null});
        socket.emit('balance', userWalletMapForSocketId[user].gameTokenBalance);
        let newBet = {
          address: user,
          bet,
          payout,
        };
        playersBet.push(newBet);
        io.emit('newBet', newBet);
        break;
      }
    }
  });
  
  // New chat message handler
  socket.on("new message", msg => {
    // console.log(msg);
    io.emit("msg", msg);
    if(chatHistory.length > 99) {
        chatHistory.push(msg);
        chatHistory.shift();
    } else {
      chatHistory.push(msg);
    }
  });

  // Remove old socket id when it is disconnected
  socket.on('disconnect', () => {
    // Remove user from socketId map
    for (const user of Object.keys(userWalletMapForSocketId)) {
      if (userWalletMapForSocketId[user].socketId == socket.id) {
        console.log('user disconnected', user);
        userWalletMapForSocketId[user].socketId = undefined;
        break;
      }
    }
  });
})

// Redis subscriber for generating new game data
subscriber.on("message", (channel, message) => {
  console.log(message);
  const data = JSON.parse(message);
  io.emit("data", data);
  let time = 0;
  const interval = setInterval(() => {
    const value = getMultiplierFromTime(time, {HE: data.config.HOUSE_EDGE, SP: data.config.SPEED_SETTING});
    if (value > data.multiplier || time > data.duration) {
      io.emit("multiplier", data.multiplier);
      clearInterval(interval);
      startCoolDown(data.config.COOLDOWN_SETTING);
      return;
    }
    io.emit("multiplier", value.toFixed(data.config.DECIMAL));
    time += 0.1;
  }, 100);
})

const startCoolDown = (cooldown: number) => {
  let time = -1 * cooldown;
  const interval = setInterval(() => {
    if (time >= 0) {
      io.emit("multiplier", 0);
      clearInterval(interval);
      return;
    }
    io.emit("multiplier", time.toFixed(2));
    time += 0.115;
  }, 100);
}

// Redis subscriber for busting last game
// bust_subscriber.on("message", (channel, message) => {
//   console.log(`--> Last game busted: ${message}`);
//   const multiplier = JSON.parse(message)['multiplier'];
//   // console.dir(playersBet, {depth: null});
//   playersBet.map(player => {
//     if (parseFloat(player.payout) > parseFloat(multiplier)) {
//       // console.log(`--> Lost with bust: ${player.address}`);
//       return;
//     }
//     const userInfo = userWalletMapForSocketId[player.address];
//     if (userInfo && userInfo.socketId != undefined) {
//       const balance = userInfo.gameTokenBalance + parseFloat(player.payout) * parseFloat(player.bet);
//       userWalletMapForSocketId[player.address].gameTokenBalance = balance;
//       // console.log(`--> Profit with bust: ${player.address} ${parseFloat(player.payout) * parseFloat(player.bet)}`);
//       io.to(userInfo.socketId).emit('balance', balance);
//     }
//   });
//   playersBet = [];
// })

server.listen(8080, () => {
  subscriber.subscribe("new-game");
  // bust_subscriber.subscribe("game-busted");
  console.log('listening on http://localhost');
});
