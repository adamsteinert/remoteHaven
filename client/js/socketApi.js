const socket = io("http://localhost:3000");

// Local info from the server
socket.on("news", function(data) {
    console.log("[NEWS]: " + data);
});

// Item state updates from the server.
socket.on("stateUpdate", function(item) {
    console.log("[SU!]: " + item);
    doStateUpdate(item)
});

//Actions:
//  add
//  update
//  delete
function postGameItem(actionId, target) {
    item = {
        action: actionId,
        name: target.name,
        rotation: target.rotation,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        x: target.x,
        y: target.y,
        imgSrc: target.image ? target.image.src : target.children[0].image.src
        //TODO: adorners
    };

    socket.emit("postState", item);
}