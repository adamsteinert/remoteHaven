const socket = io("http://localhost:3000");

function sendMsg() {
  socket.emit("message", "HELLO WORLD");
}

var stage;
var SIZE = 50;
var cvSize = 3000;
var lastTarget;

function init() {
  //resize canvas to full width and height
  var canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = cvSize;
  canvas.height = cvSize;
  
  stage = new createjs.Stage("canvas");

  //addCircle(canvas.width/2 - (SIZE * 2.5), canvas.height/2, SIZE, "#e74c3c");
  //addStar(canvas.width/2, canvas.height/2, SIZE, "#f1c40f");
  //addRoundedSquare(canvas.width/2 + (SIZE * 2.5), canvas.height/2, SIZE * 2, 5, "#9b59b6");
  stage.update();
}

function addTile() {
    addBmp(50, 50, .9, document.getElementById("tiles").value);    
    stage.update();    
}

function addTileElement(path) {
    console.log('add tile element ' + path);
    addBmp(50, 50, .9, path);    
    stage.update();    
}

function addBmp(x, y, scale, tile) {
    var bitmap = new createjs.Bitmap(tile);
    bitmap.name = uuidv4();
    bitmap.x = x;
    bitmap.y = y;    
    bitmap.scaleX = scale;
    bitmap.scaleY = scale;
    bitmap.on("pressmove",drag);
    bitmap.on("mousedown", mouseDownReset)
    stage.addChild(bitmap);    

    postBitmap("add", bitmap);
}

function drag(evt) {
  // target will be the container that the event listener was added to
  if(evt.target.name == "square") {
    evt.target.x = evt.stageX - SIZE;
    evt.target.y = evt.stageY - SIZE;
  }
  else  {
    evt.target.x = evt.stageX;
    evt.target.y = evt.stageY;
  }

  // make sure to redraw the stage to show the change
  stage.update();   
}

// https://stackoverflow.com/questions/22829143/easeljs-glitchy-drag-drop
function mouseDownReset(evt) {
    var ct = evt.currentTarget;
    lastTarget = evt.target; // record last target
    console.log(evt);
    local = ct.globalToLocal(evt.stageX, evt.stageY),
    nx = ct.regX - local.x,
    ny = ct.regY - local.y;
    //set the new regX/Y
    ct.regX = local.x;
    ct.regY = local.y;
    //adjust the real-position, otherwise the new regX/Y would cause a jump
    ct.x -= nx;
    ct.y -= ny;
}


document.addEventListener('keydown', logKey);

function logKey(e) {
    console.log(`${e.code}`);
    switch(e.code) {
        case 'KeyD':
          console.log("Delete " + lastTarget);
          stage.removeChild(lastTarget);
          stage.update()
          break;

        case 'KeyZ':
            lastTarget.rotation -= 15
            stage.update()
            break; 
            
        case 'KeyC':
            lastTarget.rotation += 15
            stage.update()
            break;             
        default:
          // code block
      }    
}


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }












  
function addCircle(x, y, r, fill) {
  var circle = new createjs.Shape();
  circle.graphics.beginFill(fill).drawCircle(0, 0, r);
  circle.x = x;
  circle.y = y;
  circle.name = "circle";
  circle.on("pressmove",drag);
  stage.addChild(circle);
}

function addStar(x, y, r, fill) {
  var star = new createjs.Shape();
  star.graphics.beginFill(fill).drawPolyStar(0, 0, r, 5, 0.6, -90);
  star.x = x;
  star.y = y;
  star.name = "star";
  star.on("pressmove",drag);
  stage.addChild(star);
}

function addRoundedSquare(x, y, s, r, fill) {
  var square = new createjs.Shape();
  square.graphics.beginFill(fill).drawRoundRect(0, 0, s, s, r);
  square.x = x - s/2;
  square.y = y - s/2;
  square.name = "square";
  square.on("pressmove",drag);
  stage.addChild(square);
}
