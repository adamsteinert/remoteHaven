

function fetchItems(route, addDataMethod, selectList) {
    fetch(route)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            addDataMethod(data, selectList);
        });
}

function addToSelectList(data, selectList) {
    var elm = document.getElementById(selectList);

    data.forEach(function (m) {
        var option = document.createElement("option");
        option.text = m.name;
        option.value = m.path;
        elm.add(option);
    })
}


function initItemLists() {
    fetchItems('/monsters', addToSelectList, "monsterSelect");
    fetchItems('/tiles', addToSelectList, "tileSelect");
}


function postState(data) {
    var d = JSON.stringify(data);
    console.log("SF: " + d);
    fetch('/state', {
        method: 'post',
        body: d, //{ item: JSON.stringify(data) },
        headers: {"Content-Type": "application/json"}
    }).then(function (response) {
        return response.json();
    })

    // .then(function (data) {
    //     console.log("posted data for " + data.name);
    // });
    .then(function(body){
        console.log(body);
        //alert(self.refs.task.value)
      });    
}

//Actions:
//  add
//  update
//  delete
function postBitmap(actionId, target) {
    console.log(target);

    postState({
        action: actionId,
        name: target.name,
        rotation: target.rotation,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        x: target.x,
        y: target.y,
        imgSrc: target.image.src
    });
}