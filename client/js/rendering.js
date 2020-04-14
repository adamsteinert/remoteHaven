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

function addEventHandlers(thing) {
  // don't let individual elements fire events, only container
  thing.mouseChildren = false;
  thing.on("pressmove", drag);
  thing.on("mousedown", mouseDownReset)
  thing.on("pressup", mouseUpEvent)
}


function createBitmapItem(x, y, scale, tile) {
  var bitmap = new createjs.Bitmap(tile);
  bitmap.name = uuidv4();
  bitmap.x = x;
  bitmap.y = y;    
  bitmap.scaleX = scale;
  bitmap.scaleY = scale;

  // when image finishes loading, redraw the stage
  bitmap.image.onload = function () {
    stage.update();
  }
  return bitmap;
}

function createBitmapItem(x, y, scale, tile, name) {
  var bitmap = new createjs.Bitmap(tile);
  bitmap.name = name || uuidv4();
  bitmap.x = x;
  bitmap.y = y;    
  bitmap.scaleX = scale;
  bitmap.scaleY = scale;

  // when image finishes loading, redraw the stage
  bitmap.image.onload = function () {
    stage.update();
  }
  return bitmap;
}

// Create a RenderItemBase with just imgSrc and other values as defaults.
function ibFromSrc(imgSrc) {
  return {
    name:uuidv4(),
    x:50,
    y:50,
    imgSrc:imgSrc,
    scaleX:.9
  };
}

function addMapTile(itemBase, postUpdate=false) {
    console.log('add tile element ' + itemBase.imgSrc);
    
    //?? Changing the signature to take itemBase broke dragging...
    //var bitmap = createBitmapItemFrom(itemBase);
    var bitmap = createBitmapItem(itemBase.x, itemBase.y, itemBase.scaleX, itemBase.imgSrc, itemBase.name);
    
    addEventHandlers(bitmap);
    stage.addChild(bitmap);

    // when image finishes loading, redraw the stage
    bitmap.image.onload = function () {
      stage.update();
    }

    if(postUpdate)
      postGameItem("add", bitmap);
}

function doStateUpdate(state) {
  var child = stage.getChildByName(state.name);
  if(child) {
    console.log("I Have child " + state.name + " for " + state.action);
  } else {
    console.log("I don't have child " + state.name);
  }

  // Modify local objects
  if(state.action === "delete") {
    if(child) {
      stage.removeChild(child);
      stage.update();
    }
  } else {
    if(child) {
      updateChild(child, state);
    }
    else {
      addMapTile(state, false);
    }
  }
}

function updateChild(child, itemState) {
  child.x = itemState.x;
  child.y = itemState.y;
  child.rotation = itemState.rotation;
  stage.update();
} 

function addMonster(path, label, elite) {
    var x = 0;
    var y = 0;
    var scale = .4;

    var imageSize = 250;

    console.log('add monster element ' + path);
    var bitmap = createBitmapItem(x, y, 1, path);

    // create label for unit
    var txtLabel = new createjs.Text(label, "22px Arial", "white");
    txtLabel.x = (imageSize - txtLabel.getMeasuredWidth()) / 2;
    txtLabel.y = y + imageSize - 44;

    // label background
    var labelBG = new createjs.Shape();
    var labelBuffer = 5;
    labelBG.graphics.beginFill("gray").drawRoundRect(
        txtLabel.x - labelBuffer, 
        txtLabel.y - labelBuffer, 
        txtLabel.getMeasuredWidth() + labelBuffer * 2, 
        txtLabel.getMeasuredHeight() + labelBuffer * 2, 
        labelBuffer * 1.5);

    // elite unit border
    var hexBorder;
    if (elite) {
      hexBorder = createHexagonBorder(x + imageSize / 2 - 1, y + imageSize / 2, 118, "gold");
    }

    // group image and label together as a unit
    var container = new createjs.Container();
    addEventHandlers(container);
    container.addChild(bitmap, hexBorder, labelBG, txtLabel);
    container.scale = scale;
    container.name = uuidv4();
 
    stage.addChild(container);    
    stage.update();

    // if(postUpdate)
    //   postGameItem("add", bitmap);
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

function mouseUpEvent(evt) {
  console.log(evt);
  if(lastTarget) {
    postGameItem("update", lastTarget);
  }
}


document.addEventListener('keydown', logKey);

function logKey(e) {
    console.log(`${e.code}`);
    switch(e.code) {
        case 'KeyD':
          if(lastTarget) {
            console.log("Delete " + lastTarget);
            stage.removeChild(lastTarget);
            stage.update()
            postGameItem("delete", lastTarget);
          }
          break;

        case 'KeyZ':
            lastTarget.rotation -= 15
            stage.update()
            postGameItem("update", lastTarget);
            break; 
            
        case 'KeyC':
            lastTarget.rotation += 15
            stage.update()
            postGameItem("update", lastTarget);
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











function createHexagonBorder(x, y, r, fill) {
  //Draw Hexagon using drawPolyStar();
  var hex = new createjs.Shape();
  hex.graphics.beginStroke(fill)
    .setStrokeStyle(9) //stroke width in pixels
    .drawPolyStar(x, y, r, 6, 0, 30) //30 degrees for vertical, point on top
    .closePath();

  return hex;
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
