const socket = io("http://localhost:3000");

// Local info from the server
socket.on("news", function(data) {
    console.log("[NEWS]: " + data);
});

// Item state updates from the server.
socket.on("stateUpdate", function(data) {
    console.log("[SU!]: " + data);
});

// Send item state updates to the server.
function postState(item) {
    socket.emit("postState", item);
}


//Actions:
//  add
//  update
//  delete
function postGameItem(actionId, target) {
    postState({
        action: actionId,
        name: target.name,
        rotation: target.rotation,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        x: target.x,
        y: target.y,
        imgSrc: target.image.src
        //TODO: adorners
    });
}