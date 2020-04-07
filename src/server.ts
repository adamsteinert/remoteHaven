import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketio from "socket.io";
import * as path from "path";
import * as fs from "fs";

const app = express();
app.set("port", process.env.PORT || 3000);
app.use('/img', express.static('./client/img'));
app.use('/js', express.static('./client/js'));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: false }))

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

// Returns a list of images by itemType, which should correlate to a directory of like-typed images under the /img directory
function returnImageItemList(req: any, res: any, itemType:any) {
  fs.readdir("./client/img/" + itemType + "/", function(err, files) {
    let monsters:any = [];
    files.forEach(function(file) {
      monsters.push({path:'/img/' + itemType + '/' + file, name:file.replace('.png','')})
    })
    res.json(monsters);
  });
}


app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

app.get("/favicon.ico", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/pub/favicon.ico"));
});

// GET MONSTER INFO
app.get("/monsters", (req: any, res: any) => {
  returnImageItemList(req, res, 'monsters');
});

// GET TILE INFO
app.get("/tiles", (req: any, res: any) => {
  returnImageItemList(req, res, 'tiles');
});

// GET Player INFO
app.get("/players", (req: any, res: any) => {
  returnImageItemList(req, res, 'players');
});

// GET Player INFO
app.get("/adorners", (req: any, res: any) => {
  returnImageItemList(req, res, 'adorners');
});


app.route('/state')

  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    console.log("REQ"+ Object.keys(req.body));
    var item = req.body;
    console.log(JSON.stringify(item) + "Got state (" + item.action + ") for " + item.name);
  });

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
  // whenever we receive a 'message' we log it out
  socket.on("message", function(message: any) {
    console.log(message);
  });
});

const server = http.listen(3000, function() {
  console.log("listening on *:3000");
});